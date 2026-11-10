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
