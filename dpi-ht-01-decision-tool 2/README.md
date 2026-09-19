# DPI-HT-01 Takeover Decision Room

Static Vite application for the Divorce Party International hostile-takeover accounting case.

The application includes seven expandable supporting schedules, an interactive inventory/legal-provision sensitivity illustration, and a reviewer filter for the two judgments revised after independent analysis. Scenario controls do not change the base submission.

Student identity is confirmed as Maksims Paņuškins, ID mp25092. The student confirmed review and understanding of the 25 material judgments before submission.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4173/`. The assessor view is available at `/review`, and the machine-readable submission is at `/submission.json`.

## Build and deploy

```bash
npm run build
npm run preview
```

Import the repository into Vercel. The included configuration uses `npm run build` and publishes `dist`. Do not set the output directory to `.next`; this is a Vite project.

## Submission structure

`scripts/build-submission.mjs` regenerates `public/submission.json` from the completed case analysis and verifies all 100 decision IDs. The original Codex templates are preserved in `source/` for reference.
