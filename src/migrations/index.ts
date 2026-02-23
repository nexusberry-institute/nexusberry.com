import * as migration_20260223_083127 from './20260223_083127';
import * as migration_20260223_100000_fix_quizzes from './20260223_100000_fix_quizzes';
import * as migration_20260223_112919 from './20260223_112919';
import * as migration_20260223_113137 from './20260223_113137';
import * as migration_20260223_122039 from './20260223_122039';

export const migrations = [
  {
    up: migration_20260223_083127.up,
    down: migration_20260223_083127.down,
    name: '20260223_083127',
  },
  {
    up: migration_20260223_100000_fix_quizzes.up,
    down: migration_20260223_100000_fix_quizzes.down,
    name: '20260223_100000_fix_quizzes',
  },
  {
    up: migration_20260223_112919.up,
    down: migration_20260223_112919.down,
    name: '20260223_112919',
  },
  {
    up: migration_20260223_113137.up,
    down: migration_20260223_113137.down,
    name: '20260223_113137',
  },
  {
    up: migration_20260223_122039.up,
    down: migration_20260223_122039.down,
    name: '20260223_122039'
  },
];
