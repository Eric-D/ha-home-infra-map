"""Board photos.

Stored under `/config/home_infra_map/photos/`, deliberately NOT under
`/config/www`: everything in www is served at /local/ *without
authentication*, and a photo of the electrical board is house documentation.
Photos are served by an authenticated view; the card asks HA for a signed URL
(`auth/sign_path`) to display them in an <img>. Uploads are re-encoded with
Pillow (a Home Assistant core dependency): EXIF metadata (GPS, phone model)
is dropped and the image is downscaled.
"""

from __future__ import annotations

import io
import logging
import re
import time
from http import HTTPStatus
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import KEY_HASS, HomeAssistantView
from homeassistant.core import HomeAssistant
from PIL import Image, ImageOps

from .const import PHOTO_DIR, PHOTO_MAX_BYTES, PHOTO_MAX_SIDE, PHOTO_URL

_LOGGER = logging.getLogger(__name__)
_SAFE_ID = re.compile(r"^[A-Za-z0-9_-]{1,64}$")


def photo_dir(hass: HomeAssistant) -> Path:
    """Return the photo directory."""
    return Path(hass.config.path(PHOTO_DIR))


def reencode(data: bytes) -> bytes:
    """Return a clean JPEG: oriented, downscaled, without metadata."""
    with Image.open(io.BytesIO(data)) as img:
        img.load()
        oriented = ImageOps.exif_transpose(img) or img
        rgb = oriented.convert("RGB")
        rgb.thumbnail((PHOTO_MAX_SIDE, PHOTO_MAX_SIDE))
        out = io.BytesIO()
        rgb.save(out, format="JPEG", quality=85, optimize=True)
        return out.getvalue()


def _store_photo(directory: Path, board_id: str, data: bytes) -> str:
    directory.mkdir(parents=True, exist_ok=True)
    filename = f"{board_id}.jpg"
    (directory / filename).write_bytes(reencode(data))
    return f"{filename}?v={int(time.time())}"


async def async_save_photo(hass: HomeAssistant, board_id: str, data: bytes) -> str:
    """Save an uploaded photo; returns the photo_path to store on the board."""
    if not _SAFE_ID.match(board_id):
        raise ValueError("invalid board id")
    return await hass.async_add_executor_job(_store_photo, photo_dir(hass), board_id, data)


async def async_import_photo(hass: HomeAssistant, source: Path, board_id: str) -> str | None:
    """Copy a photo referenced by an imported YAML file (if readable)."""

    def _read() -> bytes | None:
        try:
            return source.read_bytes() if source.is_file() else None
        except OSError:
            return None

    data = await hass.async_add_executor_job(_read)
    if not data:
        _LOGGER.info("Photo %s not found, skipped", source)
        return None
    try:
        return await async_save_photo(hass, board_id, data)
    except (OSError, ValueError) as err:
        _LOGGER.warning("Photo %s could not be imported: %s", source, err)
        return None


class PhotoView(HomeAssistantView):
    """GET (any authenticated user) / POST (admin) a board photo."""

    url = PHOTO_URL + "/{board_id}"
    name = "api:home_infra_map:photo"
    requires_auth = True

    async def get(self, request: web.Request, board_id: str) -> web.StreamResponse:
        """Serve a photo."""
        if not _SAFE_ID.match(board_id):
            return web.Response(status=HTTPStatus.NOT_FOUND)
        hass = request.app[KEY_HASS]
        path = photo_dir(hass) / f"{board_id}.jpg"
        exists = await hass.async_add_executor_job(path.is_file)
        if not exists:
            return web.Response(status=HTTPStatus.NOT_FOUND)
        return web.FileResponse(path, headers={"Cache-Control": "private, max-age=3600"})

    async def post(self, request: web.Request, board_id: str) -> web.Response:
        """Upload a photo (multipart field 'file')."""
        user = request.get("hass_user")
        if user is None or not user.is_admin:
            return self.json_message("admin required", HTTPStatus.UNAUTHORIZED)
        if not _SAFE_ID.match(board_id):
            return self.json_message("invalid board id", HTTPStatus.BAD_REQUEST)
        hass = request.app[KEY_HASS]
        reader = await request.multipart()
        field = await reader.next()
        if field is None or getattr(field, "name", None) != "file":
            return self.json_message("missing file", HTTPStatus.BAD_REQUEST)
        data = bytearray()
        while chunk := await field.read_chunk():  # type: ignore[union-attr]
            data.extend(chunk)
            if len(data) > PHOTO_MAX_BYTES:
                return self.json_message("file too large", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
        try:
            photo_path = await async_save_photo(hass, board_id, bytes(data))
        except (OSError, ValueError) as err:
            return self.json_message(f"invalid image: {err}", HTTPStatus.BAD_REQUEST)
        return self.json({"photo_path": photo_path})
