// Oldpig Studio campus. 1 block = 1 m. x east, z south, y up.
export const ISLAND = { x0: -36, x1: 38, z0: -26, z1: 31 };

// Spawn on the south lawn, facing the plaza / studio gate.
export const SPAWN = { x: 0.5, z: 18, heading: Math.PI };

// Soft-clay campus footprints (half-open intervals for grid.fill).
export const PLAZA = { x0: -4, x1: 5, z0: 4, z1: 12 };
export const GALLERY = { x0: -18, x1: -8, z0: -2, z1: 8, height: 4 };
export const CONSOLE = { x0: 9, x1: 18, z0: -2, z1: 8, height: 4 };
export const TAVERN = { x0: 10, x1: 19, z0: 12, z1: 20, height: 4 };
export const LIGHTHOUSE = { x: 0, z: -10, r: 2, height: 10 };

export const MAILBOX = { x: -6.5, z: 24.5, yaw: Math.PI };
export const PORTAL = { x: 8, z: 25.5, yaw: Math.PI };

export const STATIONS = [
  { id: 'about', name: '工作室', en: 'Studio', icon: 'seal', at: [0.5, 10.2], look: [0.5, 7.5] },
  { id: 'works', name: '展厅', en: 'Gallery', icon: 'works', at: [-8.5, 3], look: [-13, 3] },
  { id: 'omc', name: '控制台', en: 'Console', icon: 'lab', at: [8.5, 3], look: [13.5, 3] },
  { id: 'lighthouse', name: '灯塔', en: 'Lighthouse', icon: 'eye', at: [0.5, -6.2], look: [0, -10] },
  { id: 'tv', name: '酒馆', en: 'Tavern', icon: 'coffee', at: [9.2, 16], look: [14.5, 16] },
  { id: 'mailbox', name: '留言', en: 'Mailbox', icon: 'mail', at: [MAILBOX.x, MAILBOX.z - 1.6], look: [MAILBOX.x, MAILBOX.z] },
  { id: 'portal', name: '传送门', en: 'Portal', icon: 'portal', at: [PORTAL.x + Math.sin(PORTAL.yaw) * 2.4, PORTAL.z + Math.cos(PORTAL.yaw) * 2.4], look: [PORTAL.x, PORTAL.z] },
];

// Perimeter trees, clearing the plaza, path, and building doors.
export const TREES = [
  [-28, -18], [-22, -20], [-14, -22], [-4, -22], [8, -22], [18, -20], [28, -16],
  [-30, -6], [-30, 6], [-28, 16], [-24, 24], [-18, 28],
  [30, -4], [32, 8], [28, 18], [24, 28], [14, 30],
  [-32, 22], [34, 24], [-8, -18], [4, -18],
];

export const INTRO = { pos: [42, 34, 52], portrait: [68, 54, 84], look: [0, 2, 4] };
