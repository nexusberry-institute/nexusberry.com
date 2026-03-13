import * as migration_20260223_083127 from './20260223_083127';
import * as migration_20260223_100000_fix_quizzes from './20260223_100000_fix_quizzes';
import * as migration_20260223_112919 from './20260223_112919';
import * as migration_20260223_113137 from './20260223_113137';
import * as migration_20260223_122039 from './20260223_122039';
import * as migration_20260223_192200_tutorials_quizzes_enhancements from './20260223_192200_tutorials_quizzes_enhancements';
import * as migration_20260224_165047 from './20260224_165047';
import * as migration_20260224_172300_drop_coursework_modules_moduletopics from './20260224_172300_drop_coursework_modules_moduletopics';
import * as migration_20260224_180000_drop_training_courses_payment_plans_discount_codes_enrollments from './20260224_180000_drop_training_courses_payment_plans_discount_codes_enrollments';
import * as migration_20260224_192756 from './20260224_192756';
import * as migration_20260224_add_show_assignment from './20260224_add_show_assignment';
import * as migration_20260224_add_show_code_presentation_flags from './20260224_add_show_code_presentation_flags';
import * as migration_20260224_drop_lectures from './20260224_drop_lectures';
import * as migration_20260224_drop_videos_assignments from './20260224_drop_videos_assignments';
import * as migration_20260225_154036 from './20260225_154036';
import * as migration_20260225_add_batch_to_leads from './20260225_add_batch_to_leads';
import * as migration_20260225_add_enrollments_tutorial_access_rename_user_role from './20260225_add_enrollments_tutorial_access_rename_user_role';
import * as migration_20260225_users_students_cleanup from './20260225_users_students_cleanup';
import * as migration_20260226_005946 from './20260226_005946';
import * as migration_20260226_143743 from './20260226_143743';
import * as migration_20260226_154804 from './20260226_154804';
import * as migration_20260226_163335 from './20260226_163335';
import * as migration_20260226_173637 from './20260226_173637';
import * as migration_20260227_move_trial_tutorials_add_father_name from './20260227_move_trial_tutorials_add_father_name';
import * as migration_20260227_add_father_name_to_admission_requests from './20260227_add_father_name_to_admission_requests';
import * as migration_20260227_status_enum_changes from './20260227_status_enum_changes';
import * as migration_20260227_add_title_to_enrollments from './20260227_add_title_to_enrollments';
import * as migration_20260302_simplify_tutorial_access from './20260302_simplify_tutorial_access';
import * as migration_20260302_add_student_to_attendance_details from './20260302_add_student_to_attendance_details';
import * as migration_20260302_attendance_system_overhaul from './20260302_attendance_system_overhaul';
import * as migration_20260303_add_seo_to_tutorials from './20260303_add_seo_to_tutorials';
import * as migration_20260311_quiz_marks_timer from './20260311_quiz_marks_timer';
import * as migration_20260311_fix_locked_documents_quiz_results from './20260311_fix_locked_documents_quiz_results';
import * as migration_20260311_add_quiz_attempts from './20260311_add_quiz_attempts';
import * as migration_20260311_add_quiz_results_attempts from './20260311_add_quiz_results_attempts';
import * as migration_20260311_add_tutorial_video_watch_logs from './20260311_add_tutorial_video_watch_logs';
import * as migration_20260311_fix_locked_documents_video_watch_logs from './20260311_fix_locked_documents_video_watch_logs';
import * as migration_20260311_add_student_to_users from './20260311_add_student_to_users';
import * as migration_20260312_replace_sessions_with_first_watched_at from './20260312_replace_sessions_with_first_watched_at';
import * as migration_20260313_add_home_page_global from './20260313_add_home_page_global';

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
    name: '20260223_122039',
  },
  {
    up: migration_20260223_192200_tutorials_quizzes_enhancements.up,
    down: migration_20260223_192200_tutorials_quizzes_enhancements.down,
    name: '20260223_192200_tutorials_quizzes_enhancements',
  },
  {
    up: migration_20260224_165047.up,
    down: migration_20260224_165047.down,
    name: '20260224_165047',
  },
  {
    up: migration_20260224_172300_drop_coursework_modules_moduletopics.up,
    down: migration_20260224_172300_drop_coursework_modules_moduletopics.down,
    name: '20260224_172300_drop_coursework_modules_moduletopics',
  },
  {
    up: migration_20260224_180000_drop_training_courses_payment_plans_discount_codes_enrollments.up,
    down: migration_20260224_180000_drop_training_courses_payment_plans_discount_codes_enrollments.down,
    name: '20260224_180000_drop_training_courses_payment_plans_discount_codes_enrollments',
  },
  {
    up: migration_20260224_192756.up,
    down: migration_20260224_192756.down,
    name: '20260224_192756',
  },
  {
    up: migration_20260224_add_show_assignment.up,
    down: migration_20260224_add_show_assignment.down,
    name: '20260224_add_show_assignment',
  },
  {
    up: migration_20260224_add_show_code_presentation_flags.up,
    down: migration_20260224_add_show_code_presentation_flags.down,
    name: '20260224_add_show_code_presentation_flags',
  },
  {
    up: migration_20260224_drop_lectures.up,
    down: migration_20260224_drop_lectures.down,
    name: '20260224_drop_lectures',
  },
  {
    up: migration_20260224_drop_videos_assignments.up,
    down: migration_20260224_drop_videos_assignments.down,
    name: '20260224_drop_videos_assignments',
  },
  {
    up: migration_20260225_154036.up,
    down: migration_20260225_154036.down,
    name: '20260225_154036',
  },
  {
    up: migration_20260225_add_batch_to_leads.up,
    down: migration_20260225_add_batch_to_leads.down,
    name: '20260225_add_batch_to_leads',
  },
  {
    up: migration_20260225_add_enrollments_tutorial_access_rename_user_role.up,
    down: migration_20260225_add_enrollments_tutorial_access_rename_user_role.down,
    name: '20260225_add_enrollments_tutorial_access_rename_user_role',
  },
  {
    up: migration_20260225_users_students_cleanup.up,
    down: migration_20260225_users_students_cleanup.down,
    name: '20260225_users_students_cleanup',
  },
  {
    up: migration_20260226_005946.up,
    down: migration_20260226_005946.down,
    name: '20260226_005946',
  },
  {
    up: migration_20260226_143743.up,
    down: migration_20260226_143743.down,
    name: '20260226_143743',
  },
  {
    up: migration_20260226_154804.up,
    down: migration_20260226_154804.down,
    name: '20260226_154804',
  },
  {
    up: migration_20260226_163335.up,
    down: migration_20260226_163335.down,
    name: '20260226_163335',
  },
  {
    up: migration_20260226_173637.up,
    down: migration_20260226_173637.down,
    name: '20260226_173637',
  },
  {
    up: migration_20260227_move_trial_tutorials_add_father_name.up,
    down: migration_20260227_move_trial_tutorials_add_father_name.down,
    name: '20260227_move_trial_tutorials_add_father_name',
  },
  {
    up: migration_20260227_add_father_name_to_admission_requests.up,
    down: migration_20260227_add_father_name_to_admission_requests.down,
    name: '20260227_add_father_name_to_admission_requests',
  },
  {
    up: migration_20260227_status_enum_changes.up,
    down: migration_20260227_status_enum_changes.down,
    name: '20260227_status_enum_changes',
  },
  {
    up: migration_20260227_add_title_to_enrollments.up,
    down: migration_20260227_add_title_to_enrollments.down,
    name: '20260227_add_title_to_enrollments',
  },
  {
    up: migration_20260302_simplify_tutorial_access.up,
    down: migration_20260302_simplify_tutorial_access.down,
    name: '20260302_simplify_tutorial_access',
  },
  {
    up: migration_20260302_add_student_to_attendance_details.up,
    down: migration_20260302_add_student_to_attendance_details.down,
    name: '20260302_add_student_to_attendance_details',
  },
  {
    up: migration_20260302_attendance_system_overhaul.up,
    down: migration_20260302_attendance_system_overhaul.down,
    name: '20260302_attendance_system_overhaul',
  },
  {
    up: migration_20260303_add_seo_to_tutorials.up,
    down: migration_20260303_add_seo_to_tutorials.down,
    name: '20260303_add_seo_to_tutorials',
  },
  {
    up: migration_20260311_quiz_marks_timer.up,
    down: migration_20260311_quiz_marks_timer.down,
    name: '20260311_quiz_marks_timer',
  },
  {
    up: migration_20260311_fix_locked_documents_quiz_results.up,
    down: migration_20260311_fix_locked_documents_quiz_results.down,
    name: '20260311_fix_locked_documents_quiz_results',
  },
  {
    up: migration_20260311_add_quiz_attempts.up,
    down: migration_20260311_add_quiz_attempts.down,
    name: '20260311_add_quiz_attempts',
  },
  {
    up: migration_20260311_add_quiz_results_attempts.up,
    down: migration_20260311_add_quiz_results_attempts.down,
    name: '20260311_add_quiz_results_attempts',
  },
  {
    up: migration_20260311_add_tutorial_video_watch_logs.up,
    down: migration_20260311_add_tutorial_video_watch_logs.down,
    name: '20260311_add_tutorial_video_watch_logs',
  },
  {
    up: migration_20260311_fix_locked_documents_video_watch_logs.up,
    down: migration_20260311_fix_locked_documents_video_watch_logs.down,
    name: '20260311_fix_locked_documents_video_watch_logs',
  },
  {
    up: migration_20260311_add_student_to_users.up,
    down: migration_20260311_add_student_to_users.down,
    name: '20260311_add_student_to_users',
  },
  {
    up: migration_20260312_replace_sessions_with_first_watched_at.up,
    down: migration_20260312_replace_sessions_with_first_watched_at.down,
    name: '20260312_replace_sessions_with_first_watched_at',
  },
  {
    up: migration_20260313_add_home_page_global.up,
    down: migration_20260313_add_home_page_global.down,
    name: '20260313_add_home_page_global',
  },
];
