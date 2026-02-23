● Exact workflow now:

  1. Edit collection — e.g. add a field in src/collections/Quizzes/index.ts
  2. Regenerate types — pnpm generate:types
  3. Create migration — pnpm migrate:create --name add_quiz_field
    - This diffs your collection changes against the .json snapshot and generates SQL
  4. Review the generated .ts file in src/migrations/ — make sure the SQL looks right
  5. Run migration — pnpm migrate:run
    - This applies the SQL to your production DB and updates payload_migrations
  6. Commit & push — collection changes + types + migration files
  7. Vercel deploys — pnpm ci sees migration already applied, skips it, builds

  Since push: false, the dev server won't auto-apply your field change to the DB. So after step 1, if you restart  
  pnpm dev, the new field won't appear in the admin panel until you run step 5. That's the intended behavior — all 
  schema changes go through migrations now.

  ---

  ● With a local Docker DB, the workflow adds a safety layer:

  1. Edit collection
  2. pnpm generate:types
  3. pnpm migrate:create --name add_quiz_field
  4. Review the generated SQL
  5. pnpm migrate:run — runs against local DB (safe to break)
  6. Test — verify the field works in admin panel locally
  7. Commit & push
  8. Vercel deploys — pnpm ci runs payload migrate against production DB (first time it hits production)

  The key difference: step 5 hits your local DB instead of production. If the migration has a bug, only your local 
  DB breaks — you can pnpm docker:reset and start over. Production stays untouched until Vercel deploys.

  Your current setup (no local DB): step 5 hits production directly. If something goes wrong, you're fixing it on  
  the live database.

  For a solo project this is fine. A local DB becomes more valuable when you're experimenting with bigger schema   
  changes or have users relying on the live site.

  ---