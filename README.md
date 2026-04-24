# Sanjana Nukala — Portfolio

A clean, static HTML/CSS/JS portfolio site. No frameworks, no build tools —
just open a file in your browser and it works. Hosted on GitHub Pages.

---

## File Structure

```
sanjana-portfolio/
├── index.html                        ← Home page
├── css/
│   ├── global.css                    ← Shared tokens, nav, footer, utilities
│   ├── home.css                      ← Home page styles
│   ├── work.css                      ← Work listing page styles
│   └── case-study.css                ← Case study page styles
├── js/
│   └── main.js                       ← Scroll reveal, filter, interactions
├── work/
│   ├── index.html                    ← Work listing page
│   └── depression-dashboard/
│       └── index.html                ← Case study: Depression Dashboard
└── README.md
```

---

## Adding a New Case Study

1. Create a new folder inside `work/`:
   ```
   work/your-project-name/
   └── index.html
   ```

2. Copy `work/depression-dashboard/index.html` as your starting template.

3. Update at the top of the new file:
   ```html
   <link rel="stylesheet" href="../../css/global.css" />
   <link rel="stylesheet" href="../../css/case-study.css" />
   ```
   and at the bottom:
   ```html
   <script src="../../js/main.js"></script>
   ```

4. Add a card to `work/index.html` pointing to your new folder.

5. Add a preview card to `index.html` in the Work Preview section.

---

## Customizing

### Fonts
Fonts are loaded from Google Fonts in `css/global.css`:
- **Syne** (sans-serif, headings + UI)
- **Instrument Serif** (serif + italic accents)

To swap fonts, change the `@import` line at the top of `global.css`
and update the `--serif` and `--sans` CSS variables.

### Colors
All colors live as CSS variables at the top of `global.css`:
```css
:root {
  --bg:       #faf9f7;   /* page background */
  --ink:      #111110;   /* primary text */
  --ink-mid:  #4a4845;   /* body text */
  --ink-soft: #8a8680;   /* muted text, labels */
  --border:   rgba(17,17,16,0.10);
  --bg-warm:  #fdf6ee;   /* warm tint backgrounds */
  --bg-cool:  #eef4fb;   /* cool tint backgrounds */
}
```

### Nav Logo
Find `<!-- Replace with your own logo SVG or wordmark -->` in each HTML file
and swap the `<svg>` for your own logo or just a text wordmark.

### Email
Replace `hello@youremail.com` in the `nav-cta` link and any `mailto:` references
throughout the HTML files.

---

## Deploying to GitHub Pages

### First time setup
1. Create a new GitHub repository (e.g. `yourusername.github.io` for a root site,
   or any name for a project site).
2. Push this folder's contents to the `main` branch.
3. Go to **Settings → Pages → Source** and select `main` branch, `/ (root)`.
4. Your site will be live at:
   - `https://yourusername.github.io` (if repo is named `yourusername.github.io`)
   - `https://yourusername.github.io/repo-name/` (for any other repo name)

### Updating the site
```bash
git add .
git commit -m "Update portfolio"
git push origin main
```
GitHub Pages will rebuild automatically within ~60 seconds.

### Custom domain (optional)
1. Buy a domain (Namecheap, Google Domains, etc.)
2. In your repo go to **Settings → Pages → Custom domain** and enter your domain.
3. Add a `CNAME` file to the root of your repo containing just your domain:
   ```
   yourdomain.com
   ```
4. Point your domain's DNS to GitHub's IPs (see GitHub Pages docs for current IPs).

---

## Local Development

No build step needed. Just open `index.html` in your browser.

For the cleanest experience (avoids any path quirks), use a simple local server:

```bash
# Python (built-in)
python3 -m http.server 3000
# then open http://localhost:3000

# Node (if you have npx)
npx serve .
```

---

## Notes

- All images use `onerror` fallbacks — placeholder text shows until you add real images.
- The work filter on `work/index.html` uses `data-category` attributes. Match them to
  the `data-filter` values on the filter buttons.
- Scroll reveal animations fire once per element via `IntersectionObserver` (in `main.js`).
# sanjana-portfolio
