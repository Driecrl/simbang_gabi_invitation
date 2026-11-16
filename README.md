# Simbang Gabi Invitation

A sender creates an invitation (link + QR + email), the receiver says YES, reads a letter,
and both write a wish. Wishes are locked in the browser and open on January 1, 2027
(Philippine time). Plain HTML, CSS and JavaScript, with Supabase as the database.

## Structure
```
index.html              all screens
css/style.css           colors at the top
js/config.js            Supabase URL + key, default date/time, reminders, NO messages, letter template
js/api.js               talks to Supabase
js/crypto.js            locks and unlocks wishes (key stays in the link after the #)
js/parol.js             draws the lantern
js/app.js               screens and logic
js/music.js             floating Bibingka player (official YouTube upload, loads on tap)
database/supabase-setup.sql   run once in the Supabase SQL Editor
```

## Set up on a new computer
1. Install VS Code and Git. Clone your GitHub repo, or open this folder.
2. In VS Code install the "Live Server" extension, right-click index.html > Open with Live Server.
3. Supabase: if the project still exists, nothing else to do. For a new project, run
   database/supabase-setup.sql in the SQL Editor, then put the Project URL and the
   publishable key in js/config.js. Never use the secret / service_role key.

## Publish
Push to GitHub, then Settings > Pages > Deploy from a branch > main > / (root).
Create invitations from the live github.io address so the links work for everyone.

## Important
- Links contain a secret key after the # sign. Always share the whole link.
- Do not commit any .env file. The .gitignore already ignores it.

## Keeping Supabase awake
.github/workflows/keep-supabase-awake.yml pings the database every 2 days so the free project does not pause.
Check the Actions tab now and then: a red X means the project is paused. Restore it in the Supabase dashboard.

## New Year wish emails (optional)
People can type their email on the wish screen. On January 1 (12:00 AM Philippine time) a GitHub job emails each of them the wishes.
Files: scripts/send-new-year-emails.js, .github/workflows/new-year-emails.yml, tools/make-keys.html, database/migration-new-year-emails.sql
One-time setup:
1. Run database/migration-new-year-emails.sql in the Supabase SQL Editor.
2. Open tools/make-keys.html (through Live Server). Put the public key in js/config.js (EMAIL_PUBLIC_KEY).
3. GitHub secrets (Settings > Secrets and variables > Actions): EMAIL_PRIVATE_KEY, SUPABASE_SERVICE_KEY, GMAIL_USER, GMAIL_APP_PASSWORD.
4. Actions > New Year wish emails > Run workflow: first mode "test", then "dry".
The private key and the service key never go in the website or in git. The job logs only counts.
