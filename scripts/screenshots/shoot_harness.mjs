/* README screenshots from the card dev harness (frontend/dev): the real card
 * bundle-to-be, fed with frontend/dev/fixture.json (anonymised example house,
 * built by scripts/make_dev_fixture.py with the backend's own functions).
 * Usage: (cd frontend && npm run dev) & node shoot_harness.mjs <out_dir>
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = process.argv[2] || '../../docs/img';
const BASE = 'http://127.0.0.1:5173/dev/index.html';
fs.mkdirSync(OUT, { recursive: true });
const STATION = '192.168.30.40'; // weather station of the fictional demo house
const SHOTS = [
  ['electricite', 'view=electricity&module=T1-R1-7', 1100],
  ['reseau-topologie', 'view=network&network_view=topology', 1000],
  ['reseau-vlan', 'view=network&network_view=vlan', 1000],
  ['reseau-switch', 'view=network&network_view=switch&port=22', 1000],
  ['pare-feu', `view=network&device=${STATION}&tab=firewall`, 1000],
  ['historique', `view=network&device=${STATION}&tab=history`, 1000],
  ['edition', 'view=electricity&edit=1&edit_module=T1-R1-6', 1100],
  ['ajout-equipement', `view=network&edit=1&add_device=${STATION}`, 1100],
  ['mobile-sombre', 'view=electricity&theme=dark&width=390', 430],
  ['mobile-reseau-sombre', 'view=network&network_view=topology&theme=dark&width=390', 430],
  ['en-network-switch', 'view=network&network_view=switch&port=22&lang=en', 1000],
];

const browser = await chromium.launch();
for (const [name, query, width] of SHOTS) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2, timezoneId: 'Europe/Paris', locale: 'fr-FR' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}?shot=1&${query}`);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 20000 });
  await page.waitForTimeout(800);
  // device sheets are dialogs over the card: capture the dialog only
  const dialog = page.locator('home-infra-map-card [role="dialog"]').first();
  const target = query.includes('device=') && (await dialog.count()) ? dialog : page.locator('home-infra-map-card').first();
  await target.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, errors.length ? errors : 'ok');
  await page.close();
}
await browser.close();
