# ROOT // LOGS — Cybersecurity Journey & Writeup Blog

An elevated, high-performance, dark-mode technical journal for documenting cybersecurity labs, CTF walkthroughs, network packet forensics, and defensive security from **Day 1 to Industry-Ready**.

---

## ⚡ Features

- **Cyber Tactical Aesthetic:** Deep obsidian/carbon surfaces (`#07090e`), emerald terminal accents (`#10b981`), electric cyan data feeds, and subtle scanline grid overlays.
- **Total Freedom to Post Articles:**
  - **In-Browser Studio (`+ Writeup`):** Draft articles directly in your browser with split-pane live Markdown preview, quick snippet insertion (`[!FLAG]`, `[!NOTE]`, code blocks), auto-save, and instant publishing.
  - **Direct File Editing:** Add or edit articles in `src/data/posts.ts` or export them as standard `.md` files for version control.
  - **Export to Markdown:** Download any composed article as a clean `.md` file with standard YAML frontmatter for your local Obsidian or Git archives.
- **Technical Reading Experience:**
  - Dynamic scroll-based reading progress bar
  - Automatic Table of Contents with jump-to-heading and hash-linking
  - Highlight.js syntax highlighting with 1-click **Copy Code** button
  - Security callout boxes: `[!NOTE]` (Mission Intel), `[!WARNING]` (Safety alert), `[!FLAG]` (Pwned/Captured), `[!INTEL]` (Blue team mitigation)
- **100-Day Journey Roadmap:** Visual milestone timeline tracking foundations, homelab setups, privilege escalation, Active Directory labs, and certification readiness.
- **Interactive Security Arsenal:** Hardware specifications, VM hypervisor details, and terminal command cheatsheets (Nmap, Wireshark, VirtualBox, Kali).
- **Interactive Terminal Overlay (`Ctrl + K`):** Quick-navigation command palette with interactive commands (`help`, `posts`, `read <id>`, `timeline`, `arsenal`, `whoami`, `clear`).
- **Free GitHub Pages Deployment:** Pre-configured GitHub Actions workflow ready to host for **\$0** with zero server maintenance.

---

## 🚀 Quick Start (Local Run)

### 1. Install & Launch
Inside the `cyber-blog` directory:

```bash
# Navigate to project
cd cyber-blog

# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ✍️ How to Post New Articles

### Method 1: The Built-in Writeup Studio (Instant)
1. Click **`+ Writeup`** in the top navigation bar.
2. Enter your **Title**, **Category**, **Difficulty**, and **Tags**.
3. Write your notes in Markdown using the live split-screen editor. Use the quick buttons to insert code blocks, flags, and warnings.
4. Click **Publish to Blog** — the article is immediately active, searchable, and stored locally.
5. (Optional) Click **Export .md** to save the file to your computer.

### Method 2: Adding directly in Code / Markdown
Open `src/data/posts.ts` and append a new object to `INITIAL_POSTS`:

```typescript
{
  id: 'day-4-active-directory-kerberoasting',
  title: 'Day 4: Understanding Kerberoasting & SPN Ticket Extraction',
  date: '2026-10-08',
  category: 'Red Team',
  difficulty: 'Intermediate',
  readTime: '6 min read',
  tags: ['active-directory', 'kerberos', 'impacket'],
  excerpt: 'Analyzing how service accounts with SPNs expose RC4/AES hashes for offline cracking.',
  content: `
# Day 4: Understanding Kerberoasting

Your markdown content goes here...
`
}
```

---

## 🌐 Deploying to GitHub Pages (\$0 Free Hosting)

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `cyber-blog` or `<username>.github.io`).
2. Push your blog code:
   ```bash
   git init
   git add .
   git commit -m "feat: initial cybersecurity blog release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish your blog live!

---

## 🛠️ Tech Stack

- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS + `@tailwindcss/typography`
- **Markdown Engine:** `marked` + `highlight.js`
- **Icons:** `lucide-react`
- **Fonts:** Inter & JetBrains Mono
