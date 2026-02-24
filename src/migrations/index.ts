import * as migration_20260223_083127 from './20260223_083127';
import * as migration_20260223_100000_fix_quizzes from './20260223_100000_fix_quizzes';
import * as migration_20260223_112919 from './20260223_112919';
import * as migration_20260223_113137 from './20260223_113137';
import * as migration_20260223_122039 from './20260223_122039';
import * as migration_20260223_192200_tutorials_quizzes_enhancements from './20260223_192200_tutorials_quizzes_enhancements';
import * as migration_20260224_add_show_assignment from './20260224_add_show_assignment';
import * as migration_20260224_drop_videos_assignments from './20260224_drop_videos_assignments';
import * as migration_20260224_drop_lectures from './20260224_drop_lectures';
import * as migration_20260224_add_show_code_presentation_flags from './20260224_add_show_code_presentation_flags';

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
  {
    up: migration_20260223_192200_tutorials_quizzes_enhancements.up,
    down: migration_20260223_192200_tutorials_quizzes_enhancements.down,
    name: '20260223_192200_tutorials_quizzes_enhancements',
  },
  {
    up: migration_20260224_add_show_assignment.up,
    down: migration_20260224_add_show_assignment.down,
    name: '20260224_add_show_assignment',
  },
  {
    up: migration_20260224_drop_videos_assignments.up,
    down: migration_20260224_drop_videos_assignments.down,
    name: '20260224_drop_videos_assignments',
  },
  {
    up: migration_20260224_drop_lectures.up,
    down: migration_20260224_drop_lectures.down,
    name: '20260224_drop_lectures',
  },
  {
    up: migration_20260224_add_show_code_presentation_flags.up,
    down: migration_20260224_add_show_code_presentation_flags.down,
    name: '20260224_add_show_code_presentation_flags',
  },
];
