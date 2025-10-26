# FeelGood (React)

This repository is a migrated Next.js app converted to a Vite + React application.

How to run:

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Notes:
- The `pages/` dir from Next was converted into `src/pages/` and routing is handled with `react-router-dom`.
- Tailwind is still used; if you need Tailwind processing, ensure `tailwind.config.js` is present and `postcss` is configured.
# Firebase secrets

This project expects a `secrets.js` file at the project root with your Firebase web app credentials. This file is not checked into source control in normal operation — add it to `.gitignore`.

Create `secrets.js` (in the repository root) with the following shape:

```javascript
// secrets.js (DO NOT COMMIT)
export const firebaseSecret = {
	apiKey: '<YOUR_API_KEY>',
	authDomain: '<YOUR_AUTH_DOMAIN>',
	projectId: '<YOUR_PROJECT_ID>',
	storageBucket: '<YOUR_STORAGE_BUCKET>',
	messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
	appId: '<YOUR_APP_ID>',
};

export default firebaseSecret;
```

Then ensure `.gitignore` contains at least the following line so the file is not committed:

```
secrets.js
```

If you accidentally committed credentials to a public repo, rotate them in the Firebase console immediately and remove the file from git history.
# nextjs-app

Minimal Next.js app scaffold created by the assistant.

Getting started

1. Install dependencies

```bash
cd nextjs-app
npm install
```

2. Run development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.
