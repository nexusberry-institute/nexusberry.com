import * as migration_20260223_083127 from './20260223_083127';
import * as migration_20260223_092529 from './20260223_092529';

export const migrations = [
  {
    up: migration_20260223_083127.up,
    down: migration_20260223_083127.down,
    name: '20260223_083127',
  },
  {
    up: migration_20260223_092529.up,
    down: migration_20260223_092529.down,
    name: '20260223_092529'
  },
];
