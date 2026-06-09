# New Haven Tapball Cricket League (NHTCL) 2026

A single-page static website for the NHTCL Independence Day cricket tournament (July 4–5, 2026).

## Tech Stack

- HTML5, CSS3, Bootstrap 5.3 (CDN)
- Vanilla JavaScript (no build tools)
- Google Fonts (Poppins, Inter)
- Bootstrap Icons

## Project Structure

```
├── index.html       # Single-page website with all 12 sections
├── css/
│   └── style.css    # Custom styles, animations, print CSS
├── js/
│   └── main.js      # Interactivity (form validation, lightbox, scroll effects)
└── README.md
```

## Local Preview

Open `index.html` directly in a browser, or use any static server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

## Deploy to GitHub Pages

1. Create a GitHub repository (e.g., `nhtcl-2026`)
2. Push all files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial NHTCL website"
   git remote add origin https://github.com/YOUR_USERNAME/nhtcl-2026.git
   git push -u origin main
   ```
3. Go to **Settings → Pages** in the repository
4. Under "Source", select **Deploy from a branch**
5. Choose `main` branch, `/ (root)` folder, click **Save**
6. Site will be live at `https://YOUR_USERNAME.github.io/nhtcl-2026/`

## Updating Content

Edit `index.html` directly to update:
- Team names (search for "TBD")
- Standings tables (update numbers in Pool A/B tables)
- Gallery images (replace placeholder divs with `<img>` tags)
- Award winners (replace "To Be Announced")
- Sponsor logos (replace placeholder cards)

## Print Support

The Rules, Invitations, and Brochure sections have dedicated Print buttons that produce clean printable output via `@media print` CSS rules.

## License

© 2026 New Haven Tapball Cricket League. All rights reserved.
