# Deploying Next.js on the server (Docker)

## Why you saw 500 and CSS/required-server-files errors

- The container was running **`next dev`** (development server) on the server.
- With **NODE_ENV=production** or `.env.production`, Next expects a **production build** (pre-built CSS, `required-server-files.json`). Those files only exist after `next build`.
- **`next dev`** does not create them, so you get:
  - `Module parse failed: Unexpected character '@'` in `globals.css` (raw `@import`/`@tailwind` not processed)
  - `ENOENT: no such file or directory, open '/app/.next/required-server-files.json'`
  - `GET / 500`

## Fix: run production build + start, not dev

On the server you must:

1. **Build** the app once: `npm run build` (or build inside Docker).
2. **Run** the production server: `npm start` (or `node server.js` with standalone output).
3. Do **not** run `next dev` on the server (use dev only locally).

## Option 1: Use the included Dockerfile (recommended)

This repo includes a production Dockerfile that builds and runs standalone:

```bash
# Build image (runs next build inside the image)
docker build -t sobitas-nextjs .

# Run (uses pre-built app; no next dev)
docker run -p 3000:3000 --env-file .env sobitas-nextjs
```

- **Build** stage runs `npm run build`; CSS and all assets are compiled.
- **Run** stage uses `node server.js` (standalone), so no `required-server-files.json` path issues and no raw CSS parsing.

Ensure your compose/service uses this image and **does not** override the command with `npm run dev`.

## Option 2: Change existing Docker Compose / Dockerfile

If you keep your current image but change how it runs:

1. **Build at image build time** (in your Dockerfile):
   ```dockerfile
   RUN npm ci
   COPY . .
   RUN npm run build
   ```

2. **Start with production server** (in Dockerfile or compose):
   ```dockerfile
   CMD ["npm", "start"]
   ```
   or, if using standalone output:
   ```dockerfile
   CMD ["node", "server.js"]
   ```

3. **Do not** set `CMD` or `command` to `npm run dev` on the server.

4. **NODE_ENV**: Use `NODE_ENV=production` only when running `next start` (or `node server.js`). Do not use `NODE_ENV=production` with `next dev`.

## Config change in this repo

- **next.config.js**: `output: 'standalone'` is set so the build produces a self-contained output in `.next/standalone` and the Dockerfile can run `node server.js` with minimal files.
- **swcMinify**: Removed (deprecated in Next.js 15).

After rebuilding the image and running with `npm start` (or `node server.js`), the CSS and `required-server-files.json` errors and 500s from this cause should stop.
