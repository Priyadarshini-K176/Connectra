# Interview PDF — Chat App

This folder contains an HTML document with the top 30 frontend interview questions tailored to the Chat App repository and a small Node script to export it as a PDF.

Files:
- `frontend-interview-questions.html` — the printable HTML with questions and short hints.
- `make-pdf.js` — Node script using Puppeteer to render the HTML and save `frontend-interview-questions.pdf`.
- `package.json` — includes `puppeteer` dependency and a convenience script.

How to generate the PDF locally:

1. Open a terminal in this folder (`c:/projects/chat-app/Interview-Prep`).
2. Install dependencies:

```bash
npm install
```

3. Run the script to create the PDF:

```bash
npm run make-pdf
```

This will create `frontend-interview-questions.pdf` in the same folder.

Notes:
- Puppeteer will download a recent Chromium. If you prefer not to download Chromium, adjust `make-pdf.js` to point to a system-installed Chrome via `puppeteer.launch({ executablePath: '/path/to/chrome' })`.
- Alternatively, open `frontend-interview-questions.html` in a browser and print-to-PDF manually for quick results.
