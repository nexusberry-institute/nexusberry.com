import * as migration_20260223_083127 from './20260223_083127';

export const migrations = [
  {
    up: migration_20260223_083127.up,
    down: migration_20260223_083127.down,
    name: '20260223_083127'
  },
];
