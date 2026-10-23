# Emergency Passport — How to Run

A small offline-first web app (PWA) built with TanStack Start, React 19, TypeScript, and Tailwind CSS v4. No database or API keys needed — everything is stored locally in the browser.

## Requirements

- Node.js 20 or newer (install with nvm: https://github.com/nvm-sh/nvm#installing-and-updating)
- npm (comes with Node)

## Run in 3 steps

```sh
# 1. Unzip the project and open the folder
cd emergency-passport

# 2. Install dependencies (one time)
npm install

# 3. Start the dev server
npm run dev
```

Then open http://localhost:3000 in your browser (check the URL printed in the terminal).

## Build for production

```sh
npm run build
npm run start   # serve the production build
```

## Using the app

- **Home** — quick overview of your emergency profile (preloaded with demo data for "Rashi Jain"; edit it under **My Passport**).
- **My Passport** — enter your real name, blood group, allergies, medications, conditions and emergency contact, then choose which fields responders can see.
- **SHOW EMERGENCY QR** — shows your QR code. Scanning it opens `/emergency/<token>` with only the fields you've chosen to share, plus a tap-to-call button.
- **Install as an app** — use your browser's "Install app" / "Add to Home Screen" option for offline access. Offline mode works in the production build (not in `npm run dev`), and each page must be opened once online before it loads offline.

## Notes

- All data lives in your browser's local storage — nothing is sent to a server.
- The emergency QR link embeds your shared details in the URL itself, so it works even without internet on the responder's side (they just need to open the link once).
