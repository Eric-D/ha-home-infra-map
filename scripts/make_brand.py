"""Draw the integration icon/logo (brand/), so nothing external is needed."""

from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "custom_components" / "home_infra_map" / "brand"


def icon(size: int) -> Image.Image:
    s = size / 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((8 * s, 8 * s, 248 * s, 248 * s), radius=48 * s, fill=(11, 107, 203, 255))
    white = (255, 255, 255, 255)
    # house
    d.line(
        [(52 * s, 120 * s), (128 * s, 52 * s), (204 * s, 120 * s)],
        fill=white,
        width=int(16 * s),
        joint="curve",
    )
    d.line(
        [(72 * s, 112 * s), (72 * s, 200 * s), (184 * s, 200 * s), (184 * s, 112 * s)],
        fill=white,
        width=int(14 * s),
    )
    # lightning bolt
    d.polygon(
        [
            (132 * s, 92 * s),
            (100 * s, 148 * s),
            (126 * s, 148 * s),
            (116 * s, 188 * s),
            (156 * s, 128 * s),
            (130 * s, 128 * s),
            (146 * s, 92 * s),
        ],
        fill=(255, 196, 0, 255),
    )
    # network nodes
    for x, y in ((216, 176), (216, 216), (176, 216)):
        d.ellipse(((x - 10) * s, (y - 10) * s, (x + 10) * s, (y + 10) * s), fill=white)
    return img


for name, size in (("icon.png", 256), ("icon@2x.png", 512), ("logo.png", 256), ("logo@2x.png", 512)):
    icon(size).save(OUT / name, optimize=True)
print("ok")
