-----------------------------
Step 1: Export from OLD Supabase (Schema + data)
-----------------------------
$env:PGPASSWORD = 'ykfN6yml9Xl3zRGG'

pg_dump --no-owner --no-privileges --file=schema.sql --host=aws-0-ap-south-1.pooler.supabase.com --port=6543 --username=postgres.yjeujsqiqjfcvnmmvdgi postgres


--------------------------------------------
Step 2: Import to the New Supabase Account
--------------------------------------------
$env:PGPASSWORD = 'cs9QXRR2S*i3i!X'

psql -U postgres.uabtgajwhzanzajlppzc -h aws-0-ap-south-1.pooler.supabase.com -p 6543 -d postgres -f schema.sql
