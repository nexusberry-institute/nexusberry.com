students suggestion:
video quality control
presentation download
+10 sec or -10 sec option on mobile
volume control option inc and dec
re-join class

---

# Manually create a worktree branching from dev
git worktree add .claude/worktrees/auth-module -b worktree-auth-module dev

# Then start Claude inside it
cd .claude/worktrees/auth-module && claude

Create a new worktree called auth-module branching from dev, then open it
Create a worktree from dev for the auth module, work on it, then commit, push, and open a PR targeting dev

---
New terminal for each worktree — yes, always. Each terminal = one Claude session = one worktree. That's the whole point of parallel work:

Terminal 1 → claude --worktree auth-module    (Claude working on auth)
Terminal 2 → claude --worktree payment-module (you planning next task)
Terminal 3 → your normal terminal             (git, npm, whatever)

Does it create AND open? — yes. One command does everything:

Creates .claude/worktrees/auth-module/ folder
Creates worktree-auth-module branch from main
Opens Claude Code already inside that worktree directory
Claude's context is scoped to that worktree automatically

You don't need to cd anywhere. You just start talking to Claude and it's already on the right branch in the right folder.

---

https://www.nexusberry.com/admin/collections/attendance

show infinitely : 
Confirm deletion
You are about to delete 1 Attendance

---

AdmissionRequests:
1. approve only by super admin
2. make installments

---

FeeReceipts
- admin: separate upload collection for fee receipts
- admin: only superadmin can verify
- dashboard: show list of isntallments
- dashboard: studetns dashboard shows submit fee


---
Tutorials:
dashboard: fetch batch assigned tutorial

tutorials subject list on sidebar, 
featured subjects in main area
only 4 tutorials in main with order: features or last four desc

---
 remove easy to fix erros like variable defined but never used, unused imports, react/no-unescaped-entities, etc.
 ---
batch slug
---
add a new field to add student student picture and diplay in dashboard
---
login page:
do not auto save last login  
login -> brower back -> login (not recommended)

---
Media
- delete all pictures from frontend
- organize in folders

---