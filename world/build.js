// Oldpig Studio: cream + macaron pavilions around a central plaza.
import * as THREE from 'three';
import { buildIsland } from '@engine/world/terrain.js';
import { buildForest, buildTufts } from '@engine/world/landscape.js';
import { BoxBatch } from '@engine/world/blocks.js';
import { canvasTexture } from '@engine/world/textures.js';
import { pixelText, textWidth } from '@engine/world/pixel-text.js';
import {
  ISLAND, TREES, PLAZA, GALLERY, CONSOLE, TAVERN, LIGHTHOUSE,
} from './layout.js';

const CREAM = 0xf5efe6;
const PEACH = 0xf5c6a5;
const MINT = 0xb8e0d2;
const PINK = 0xf4b8c5;
const LAVENDER = 0xc9b8e0;
const SKY = 0xa8c5e2;
const CHOCO = 0x6b4f3a;
const WARM = 0xffdfa8;

const paint = tint => ({ tex: 'paint', tint });
const glow = (tint, emissive = 1) => ({ tex: 'paint', tint, emissive });

function signTexture(title, accent) {
  return canvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = '#fbf7f0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, w, 8);
    ctx.fillRect(0, h - 8, w, 8);
    const scale = 2;
    const tw = textWidth(title, scale);
    pixelText(ctx, title, Math.round((w - tw) / 2), 24, scale, '#5c4638');
  });
}

function defineClay(grid) {
  grid.define('clay_peach', { tex: { all: 'plaster' }, tint: PEACH, merge: true, map: '#f5c6a5' });
  grid.define('clay_mint', { tex: { all: 'plaster' }, tint: MINT, merge: true, map: '#b8e0d2' });
  grid.define('clay_pink', { tex: { all: 'plaster' }, tint: PINK, merge: true, map: '#f4b8c5' });
  grid.define('clay_lavender', { tex: { all: 'plaster' }, tint: LAVENDER, merge: true, map: '#c9b8e0' });
  grid.define('clay_roof', { tex: { all: 'terracotta' }, merge: true, map: '#c97b63' });
  grid.define('clay_cream', { tex: { all: 'plaster' }, tint: CREAM, merge: true, map: '#f5efe6' });
}

function fillPavilion(grid, box, floor, wall) {
  grid.fill(box.x0, 0, box.z0, box.x1, 1, box.z1, floor);
  const y1 = box.height;
  grid.fill(box.x0, 1, box.z0, box.x1, y1, box.z0 + 1, wall);
  grid.fill(box.x0, 1, box.z1 - 1, box.x1, y1, box.z1, wall);
  grid.fill(box.x0, 1, box.z0, box.x0 + 1, y1, box.z1, wall);
  grid.fill(box.x1 - 1, 1, box.z0, box.x1, y1, box.z1, wall);
  grid.fill(box.x0, y1, box.z0, box.x1, y1 + 1, box.z1, 'clay_roof');
  for (const x of [box.x0, box.x1 - 1]) {
    for (const z of [box.z0, box.z1 - 1]) grid.set(x, y1 + 1, z, 'clay_roof');
  }
}

export function build({ grid, layer, materials }) {
  defineClay(grid);
  buildIsland(grid, ISLAND, { surfaceAt: () => 'grass', corner: 10, wobble: 0 });

  // Soft clay path from spawn up to the plaza.
  grid.fill(-1, 0, 12, 2, 1, 19, 'pavers');
  grid.fill(PLAZA.x0, 0, PLAZA.z0, PLAZA.x1, 1, PLAZA.z1, 'travertine');

  // Gallery (west) — peach pavilion, east door toward plaza.
  fillPavilion(grid, GALLERY, 'planks', 'clay_peach');
  grid.fill(GALLERY.x1 - 1, 1, 2, GALLERY.x1, 4, 4, null);
  grid.fill(GALLERY.x0, 2, 1, GALLERY.x0 + 1, 3, 5, 'glass');
  grid.fill(-16, 2, GALLERY.z0, -12, 3, GALLERY.z0 + 1, 'glass');

  // Console room (east) — mint machine hall, west door.
  fillPavilion(grid, CONSOLE, 'concrete', 'clay_mint');
  grid.fill(CONSOLE.x0, 1, 2, CONSOLE.x0 + 1, 4, 4, null);
  grid.fill(CONSOLE.x1 - 1, 2, 1, CONSOLE.x1, 3, 5, 'glass');
  grid.fill(12, 2, CONSOLE.z0, 16, 3, CONSOLE.z0 + 1, 'glass');

  // Tavern (southeast) — pink lounge, west door.
  fillPavilion(grid, TAVERN, 'deck', 'clay_pink');
  grid.fill(TAVERN.x0, 1, 15, TAVERN.x0 + 1, 4, 17, null);
  grid.fill(TAVERN.x1 - 1, 2, 14, TAVERN.x1, 3, 18, 'glass');
  grid.fill(13, 2, TAVERN.z1 - 1, 17, 3, TAVERN.z1, 'glass');

  // Lighthouse tower — lavender stack with glass lantern room.
  const L = LIGHTHOUSE;
  for (let y = 0; y < L.height - 2; y++) {
    grid.fill(L.x - 1, y, L.z - 1, L.x + 2, y + 1, L.z + 2, y < 1 ? 'stone' : 'clay_lavender');
  }
  grid.fill(L.x, 1, L.z, L.x + 1, L.height - 2, L.z + 1, null);
  grid.fill(L.x, 1, L.z + 1, L.x + 1, 4, L.z + 2, null);
  grid.fill(L.x - 1, L.height - 2, L.z - 1, L.x + 2, L.height - 1, L.z + 2, 'glass');
  grid.fill(L.x - 1, L.height - 1, L.z - 1, L.x + 2, L.height, L.z + 2, 'clay_roof');

  const B = new BoxBatch(layer);
  const planes = [];
  const obstacles = [];
  const hotspots = [];
  const bakes = [];
  const foot = (x, z, w, d) => obstacles.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, level: 0 });
  const hot = (id, x, y, z, w, h, d) => hotspots.push({
    id,
    box: new THREE.Box3(
      new THREE.Vector3(x - w / 2, y, z - d / 2),
      new THREE.Vector3(x + w / 2, y + h, z + d / 2),
    ),
  });
  const plane = (w, h, tex, x, y, z, ry = 0) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex }));
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    mesh.receiveShadow = true;
    planes.push(mesh);
    return mesh;
  };

  // Welcome board in the plaza.
  B.box(0.5, 0, 7.2, 0.12, 2.2, 0.12, { tex: 'oak' });
  B.box(0.5, 1.35, 7.2, 2.4, 1.1, 0.08, paint(CREAM));
  plane(2.2, 0.9, signTexture('OLDPIG', '#f5c6a5'), 0.5, 1.55, 7.26);
  foot(0.5, 7.2, 2.5, 0.5);
  hot('about', 0.5, 0, 7.2, 3, 2.4, 2);

  // Gallery interior: table + books + accent lamp.
  B.box(-13, 0, 3, 2.2, 0.75, 1.1, { tex: 'oak' });
  B.box(-13, 0.75, 3, 2.2, 0.08, 1.1, { tex: 'wood_panel' });
  B.box(-15.2, 0, 5.2, 1.4, 1.8, 0.4, { tex: 'bookshelf', top: 'wood_panel' });
  B.box(-13, 1.9, 5.6, 0.35, 0.12, 0.35, glow(WARM));
  bakes.push({ id: 'gallery-lamp', position: [-13, 2.1, 5.6], power: 2.4, radius: 8, direction: [0, -1, 0] });
  foot(-13, 3, 2.4, 1.3);
  foot(-15.2, 5.2, 1.5, 0.5);
  hot('works', -13, 0, 3, 8, 3.2, 8);
  plane(1.6, 0.55, signTexture('GALLERY', '#f4b8c5'), -8.05, 2.4, 3, Math.PI / 2);

  // Console racks + glowing panels.
  for (const z of [1, 3, 5]) {
    B.box(15.2, 0, z, 1.6, 1.6, 0.7, { tex: 'steel' });
    B.box(14.35, 0.45, z, 0.06, 0.7, 0.5, glow(SKY));
    foot(15.2, z, 1.8, 0.9);
  }
  B.box(12.2, 0, 5.4, 1.4, 0.75, 0.8, { tex: 'deepslate' });
  B.box(12.2, 0.75, 5.4, 1.2, 0.05, 0.55, glow(0x9fd3ff));
  bakes.push({ id: 'console-desk', position: [12.2, 1.1, 5.4], power: 2.2, radius: 7, direction: null });
  foot(12.2, 5.4, 1.6, 1);
  hot('omc', 13.5, 0, 3, 8, 3.2, 8);
  plane(1.6, 0.55, signTexture('OMC', '#b8e0d2'), 8.95, 2.4, 3, -Math.PI / 2);

  // Tavern bar + warm screen.
  B.box(16, 0, 16, 3.2, 1.05, 0.7, { tex: 'walnut' });
  B.box(14.2, 0, 14.2, 0.7, 0.45, 0.7, paint(CHOCO));
  B.box(17.4, 1.2, 18.6, 1.8, 1.05, 0.08, paint(0x1c1f21));
  B.box(17.4, 1.28, 18.55, 1.55, 0.82, 0.04, glow(0x7ec8ff, 0.85));
  B.box(14.8, 1.85, 15.2, 0.4, 0.15, 0.4, glow(WARM));
  bakes.push({ id: 'tavern-lamp', position: [14.8, 2.0, 15.2], power: 2.6, radius: 8, direction: [0, -1, 0] });
  foot(16, 16, 3.4, 0.9);
  foot(14.2, 14.2, 0.9, 0.9);
  foot(17.4, 18.6, 2, 0.4);
  hot('tv', 14.5, 0, 16, 8, 3.2, 7);
  plane(1.6, 0.55, signTexture('TAVERN', '#c9b8e0'), 9.95, 2.4, 16, -Math.PI / 2);

  // Lighthouse lantern glow + sign.
  B.box(L.x + 0.5, L.height - 1.55, L.z + 0.5, 1.2, 0.35, 1.2, glow(WARM));
  bakes.push({ id: 'lighthouse', position: [L.x + 0.5, L.height - 1.2, L.z + 0.5], power: 4.5, radius: 16, direction: null });
  foot(L.x + 0.5, L.z + 0.5, 3.2, 3.2);
  hot('lighthouse', L.x + 0.5, 0, L.z + 0.5, 5, 4, 5);
  plane(1.8, 0.55, signTexture('API', '#a8c5e2'), L.x + 0.5, 3.2, L.z + 2.05);

  // Plaza planters / macaron accents.
  for (const [x, z, tint] of [[-3.2, 5.2, PINK], [3.8, 5.2, MINT], [-3.2, 10.5, LAVENDER], [3.8, 10.5, PEACH]]) {
    B.box(x, 0, z, 0.7, 0.45, 0.7, paint(tint));
    B.box(x, 0.45, z, 0.35, 0.35, 0.35, { tex: 'hedge' });
    foot(x, z, 0.8, 0.8);
  }

  const forest = buildForest(grid, layer, TREES);
  const flowers = buildTufts(layer, materials, [
    { x: -5, z: 14, tile: 'flower_violet' },
    { x: -3.5, z: 15.5, tile: 'flower_white' },
    { x: 4, z: 14.5, tile: 'flower_red' },
    { x: 5.5, z: 16, tile: 'flower_violet' },
    { x: -20, z: 10, tile: 'tall_grass' },
    { x: 22, z: 10, tile: 'tall_grass' },
    { x: -10, z: 22, tile: 'flower_white' },
    { x: 2, z: 22, tile: 'flower_red' },
  ]);

  return {
    batches: { static: B },
    planes: [...planes, flowers],
    obstacles,
    hotspots,
    bakes,
    forest,
  };
}
