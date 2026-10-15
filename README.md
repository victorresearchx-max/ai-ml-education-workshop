# AI & ML for Education Workshop — Landing Page

Static one-page website (HTML + CSS + JS). No build step.

## Files
- `index.html` — page content (dates, speakers, fees, contact, payment details)
- `style.css` — styling (light theme; colours at the top in `:root`)
- `script.js` — mobile menu, schedule tabs, countdown (event date set at the top)

## Preview locally
Open `index.html` in a browser, or run:
```bash
python3 -m http.server 8000
```

## Publish on GitHub Pages
```bash
git init
git add .
git commit -m "Workshop landing page"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```
Then on GitHub, go to **Settings → Pages → Source: Deploy from a branch → `main` / root** and save.
The site will be at `https://<username>.github.io/<repo>/`.

## To update
- **KonfHub link:** set `KONFHUB_URL` at the top of `script.js` — all Register buttons (`data-konfhub`) will open it.
- **KonfHub widget/button code (optional):** paste it inside `<div id="konfhub-embed">` in `index.html`.
- **Fee:** `#fees` section in `index.html` (currently USD 500, single pass).
- **Instructor:** `#speakers` section — replace the `SN` placeholder with `<img src="speaker.jpg" alt="...">`.
- **Event date:** hero section in `index.html` and `EVENT_DATE` in `script.js`.
- **Logo:** `favicon.svg` and the `#logo` symbol in `index.html`.
