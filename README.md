# WoW Forever Guide Tool

A private community website for preparing the current WoW Forever guide for a
user's BattleTag. The built-in guide and custom uploads are decrypted and
re-encrypted in the user's browser.

The application does not provide authentication. Deploy it behind your existing
authentication layer.

## Requirements

- Node.js 20.9 or newer
- npm
- A compatible encrypted guide export
- The exact source BattleTag used to encrypt that export

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Prepare the current guide

The private source file and personal BattleTag must never be committed. The
`.private/` directory is ignored by Git.

1. Create `.private/` in the project root.
2. Save the current encrypted export as `.private/source-guide.txt`.
3. Save its source BattleTag as the only line in
   `.private/source-battletag.txt`.
4. Run:

```bash
npm run prepare:guide
```

The command decrypts the source locally, verifies its checksum and guide count,
re-encrypts it to the generic site key, verifies an exact round trip, and writes
`public/guide-wow-forever.txt`. The website displays that file's preparation
date. Rebuilding with unchanged guide content preserves the existing date.

To publish an update, replace the two private input files, run the same command,
test the generated guide, and deploy from that local working tree. The prepared
artifact is intentionally ignored by Git so it cannot leak through the public
fork.

## Linux server deployment

Clone the customized fork on the server that will run the website:

```bash
git clone https://github.com/Brandon-Crow/restedxp-reencrypt.git
cd restedxp-reencrypt
npm ci
mkdir -p .private
```

Add these two files directly on the server:

```text
.private/source-guide.txt
.private/source-battletag.txt
```

The BattleTag file must contain only the exact source BattleTag. Build the
deployable application and start it:

```bash
npm run deploy:build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Point the existing authenticated website or reverse proxy to
`http://127.0.0.1:3000`. It must protect all paths, including
`/guide-wow-forever.txt`.

Use your container's process supervisor to keep `npm run start` running and to
restart it after a new build. The `.next/` output and prepared guide must remain
on the server at runtime.

### Update the guide

Replace `.private/source-guide.txt` and update
`.private/source-battletag.txt` if its source BattleTag changed, then run:

```bash
npm run deploy:build
# Restart the running Next.js process with your process supervisor.
```

### Update the application

The server's `.private/` files survive normal Git updates because they are
ignored. Update and rebuild with:

```bash
git pull --ff-only
npm ci
npm run deploy:build
# Restart the running Next.js process with your process supervisor.
```

## Other production hosting

```bash
npm run lint
npm run build
npm run start
```

The application can also be deployed to Vercel or another platform that
supports Next.js 16. The build fails if the prepared artifact is absent. Do not
connect the public GitHub fork directly because it intentionally does not
contain that artifact. Prepare the guide and deploy the working tree instead.
The included `.vercelignore` excludes `.private/` while allowing the prepared
guide to be included in a Vercel CLI deployment.

Configure your own authentication in front of the deployment. The built-in
artifact is a static file, so the authentication layer must protect static
assets as well as pages.

## Privacy model

- Your personal source BattleTag remains in the ignored `.private/` directory.
- The original encrypted source remains in the ignored `.private/` directory.
- The prepared artifact is deployed but is never committed to the public fork.
- The deployed site contains only an artifact encrypted for a generic site key.
- User BattleTags and custom uploads are processed in the browser.
- The application has no API routes, database, or application analytics.

Authorized users can retrieve the prepared artifact from the deployed site.
Only deploy content you are permitted to distribute to those users.
