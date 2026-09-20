# DPI-HT-01 Takeover Decision Room

Static Vite application for the Divorce Party International hostile-takeover accounting case.

The application includes seven expandable supporting schedules, an interactive inventory/legal-provision sensitivity illustration, and a reviewer filter for revised material judgments (D058 and D072 after independent analysis; D091 after later feedback). Scenario controls do not change the base submission.

Student details supplied by the student: Maksims Paņuškins, ID mp25092. This is not institutional identity verification. On 20 September 2026 the student confirmed reading and agreeing with the current version, including revised D013, D091 and D100. EUR 65,000 remains a provisional reconstruction subject to the disclosed evidence gaps. See `public/AI-REVIEW-RECORD.md` for excerpts and a summary of the independent analysis; retain the original conversation for full verification.

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
