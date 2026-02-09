# CLAUDE.md - PilotUP Project Context & Work Instructions

> **Purpose:** Permanent reference for AI assistant (Claude) working on PilotUP. Updated as project evolves.
> **Last Updated:** 2026-02-09

---

## 🎯 PROJECT OVERVIEW

**PilotUP** is a SaaS landing page for AI employees/workforce automation. Single-page React app with blog, admin panel, and SEO-optimized content.

### Tech Stack
- **Frontend:** React 19.2, Vite 5.2, React Router 7.12
- **Styling:** Tailwind CSS 3.4, Framer Motion 12.23
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deployment:** Netlify with prerendering
- **Analytics:** PostHog, Google Analytics (G-0K3CRYDW2F)
- **SEO:** react-helmet-async, custom multi-schema component

### Architecture
- **Type:** SPA with static generation (prerendering for SEO)
- **Routing:** React Router (client-side)
- **State:** React Context (AuthContext, AnnouncementContext)
- **Auth:** Supabase email/password + token-gated admin invites
- **Database:** Supabase PostgreSQL with real-time subscriptions

---

## 📋 WORK INSTRUCTIONS FOR CLAUDE

### General Approach
1. **Read files first** - Always read relevant code before suggesting changes
2. **Be concise** - No unnecessary commentary or "bragging" about features
3. **Stay focused** - Address the specific request, don't over-engineer
4. **Ask when unclear** - Don't assume requirements
5. **Update this file** - Keep CLAUDE.md current as project evolves

### Planning Style
- **Get to the point** - No verbose explanations of obvious things
- **Be specific** - File paths, line numbers, exact changes
- **Skip fluff** - No "As a senior engineer..." or similar preamble
- **Action-oriented** - What to do, not why it's important (unless asked)

### Code Changes
- **Read → Edit → Verify** - Always read files before editing
- **Preserve patterns** - Match existing code style and structure
- **No breaking changes** - Unless explicitly requested
- **Test critical paths** - SEO, auth, blog functionality

### Output Format
- **Direct answers** - Skip "Let me help you with that"
- **Code examples** - Only when helpful, not always
- **Summaries** - Bullet points, not paragraphs
- **File references** - Use `file.jsx:123` format

### When to Use Tools
- **Read** - View specific files (use liberally)
- **Glob/Grep** - Find files/code patterns
- **Edit** - Modify existing files (read first!)
- **Write** - Create new files (rarely - prefer editing)
- **Bash** - Git, npm, file operations (not for reading files)
- **Task (Explore)** - Deep codebase exploration only when needed

---

## 🏗️ PROJECT STRUCTURE

### Critical Files
```
src/
├── App.jsx                    # Main app (2000+ lines: routes, hero, features, FAQ)
├── main.jsx                   # Entry point with providers
├── components/
│   └── SEO.jsx               # Multi-schema SEO component ⚠️ CRITICAL
├── pages/
│   ├── BlogFeed.jsx          # Blog listing + search
│   ├── BlogDetail.jsx        # Single post + code highlighting
│   ├── BlogAdmin.jsx         # CRUD with TinyMCE
│   ├── Login.jsx, SignUp.jsx # Auth pages
│   └── CountdownPage.jsx     # Time-gated landing
├── contexts/
│   ├── AuthContext.jsx       # User session
│   └── AnnouncementContext.jsx # Banner with real-time
└── lib/
    └── supabase.js           # Database client

scripts/
├── generate-sitemap.js       # Pre-build: creates sitemap.xml
└── prerender.js              # Post-build: static HTML for crawlers

public/
├── pilotup-landing.png       # Social sharing image (3336x2064, 2.4MB)
├── Logo-full-black.png       # Brand logo for schemas
└── sitemap.xml               # Generated at build time
```

### Route Map
```
/                    → HomePage (with countdown gate until Jan 31, 2026)
/blog                → BlogFeed (public, SEO optimized)
/blog/:slug          → BlogDetail (dynamic, prerendered)
/login               → Login (noindex)
/signup              → SignUp (token-gated, noindex)
/blog/admin          → BlogAdmin (protected)
/admin/invites       → AdminInvites (protected)
/admin/announcements → AnnouncementAdmin (protected)
```

---

## 🎨 CODE CONVENTIONS

### Component Structure
```jsx
// Pattern: Functional components with hooks
const Component = () => {
  const [state, setState] = useState(initial);
  const { user } = useAuth();

  useEffect(() => { /* setup */ }, [deps]);

  return <div>JSX</div>;
};
```

### Styling
- **Tailwind first** - Use utility classes
- **Custom animations** - In tailwind.config.js (blob, glow-text-slow)
- **Framer Motion** - For orchestrated animations
- **No CSS modules** - Minimal custom CSS

### Naming
- Components: `PascalCase.jsx`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS: `kebab-case`

### API Calls
```js
// Supabase pattern
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value);

if (error) throw error;
// Handle data
```

### Error Handling
- Try/catch with user-friendly messages
- Null checks on optional data
- Early returns for error states

---

## 💾 DATABASE SCHEMA

### Tables (Supabase)

**blogs**
```sql
id: UUID
title: TEXT
slug: TEXT (unique)
content: TEXT (HTML with code blocks)
cover_url: TEXT (optional)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**announcement_settings**
```sql
id: UUID
is_visible: BOOLEAN
background_color: TEXT
background_image: TEXT
width, height, custom_width, custom_height: TEXT
content: JSONB { text, highlight, additionalText, linkText, linkUrl }
```

**admin_invite_tokens**
```sql
token: TEXT (32 chars, unique)
email: TEXT
used_at: TIMESTAMP (nullable)
created_at: TIMESTAMP
used_by_user_id: UUID (nullable)
```

### RPC Functions
- `validate_admin_invite_token(token_input)` → {valid, email, message}
- `mark_invite_as_used(token_input, user_id)` → marks consumed

---

## 🔐 ENVIRONMENT VARIABLES

Required in `.env.local`:
```bash
VITE_SUPABASE_URL=              # Project URL
VITE_SUPABASE_ANON_KEY=         # Anon key
VITE_POSTHOG_KEY=               # Analytics
VITE_POSTHOG_HOST=              # https://us.i.posthog.com
VITE_TINYMCE_API_KEY=           # Rich text editor
VITE_WAITLIST_API_URL=          # External waitlist endpoint
VITE_PUBLIC_ENVIRONMENT=        # "development" | "production"
```

**Never commit .env.local to git!**

---

## 🔍 SEO IMPLEMENTATION (CRITICAL)

### Current SEO Setup (Feb 2026 - Just Implemented)
- **Multi-schema support** with @graph format
- **Home page:** Organization + WebSite + SoftwareApplication + FAQPage schemas
- **Blog pages:** BlogPosting + BreadcrumbList schemas
- **Auth pages:** WebPage schema + noindex/nofollow
- **Social sharing:** `pilotup-landing.png` for OG/Twitter images
- **Sitemap:** Dynamic generation with lastmod dates
- **Prerendering:** Static HTML for /, /blog, /blog/:slug

### SEO Component (`SEO.jsx`)
**Props:**
- `title` - Page title (auto-appends "| PilotUP")
- `fullTitle` - Override with complete title
- `description` - Meta description (auto-truncates to 155 chars)
- `canonical` - Canonical URL path
- `ogImage` - Open Graph image URL
- `type` - "website" or "article"
- `schema` - Single schema or array for @graph
- `keywords` - Array or string
- `twitterCard` - "summary" or "summary_large_image"
- `twitterImage` - Explicit Twitter image
- `datePublished` - ISO 8601 timestamp
- `dateModified` - ISO 8601 timestamp
- `robots` - "noindex,nofollow" etc.

**Usage Example:**
```jsx
<Seo
  fullTitle="PilotUP: Build Your Own AI Employees"
  description="Build AI employees that work 24/7..."
  canonical="/"
  schema={[orgSchema, websiteSchema, faqSchema]}
  keywords={['AI employees', 'automation']}
  twitterCard="summary_large_image"
  ogImage={`${SITE_URL}/pilotup-landing.png`}
  datePublished="2025-12-01T00:00:00Z"
  dateModified={new Date().toISOString()}
/>
```

### ⚠️ SEO Rules - NEVER Break These
1. **Always import SITE_URL** from SEO.jsx when needed
2. **Always use schema arrays** for multi-schema pages
3. **Always include BreadcrumbList** on blog pages
4. **Always set noindex** on auth/admin pages
5. **Always use pilotup-landing.png** for home page social image
6. **Always include dateModified** for freshness signals
7. **Never remove existing schemas** without replacement

---

## 📦 BUILD & DEPLOYMENT

### Local Development
```bash
npm run dev              # Vite dev server (http://localhost:5173)
npm run lint             # ESLint check
npm run preview          # Test production build locally
```

### Build Process
```bash
npm run prebuild        # Generate sitemap from Supabase
npm run build           # Vite production build → dist/
npm run prerender       # Puppeteer static HTML generation (optional)
```

### Netlify Deployment
- **Build Command:** `npm install --legacy-peer-deps && npm run prebuild && npm run build`
- **Publish Dir:** `dist`
- **Auto-deploy:** Push to `main` branch triggers build
- **SPA Redirect:** All routes → /index.html (status 200)
- **Prerendered paths:** /, /blog, /blog/:slug served as static HTML

### Testing Before Deploy
1. Check modified files: `git status`
2. Run lint: `npm run lint`
3. Build locally: `npm run build && npm run preview`
4. Verify SEO: View page source, check meta tags and schemas

---

## 🔧 COMMON TASKS

### Adding a New Page
1. Create component in `src/pages/`
2. Import in `App.jsx`
3. Add route in Routes section
4. Add `<Seo />` component with appropriate schema
5. Update sitemap in `scripts/generate-sitemap.js` if public page

### Modifying Blog
- **Frontend:** Edit `BlogFeed.jsx` or `BlogDetail.jsx`
- **Admin:** Edit `BlogAdmin.jsx` (TinyMCE configuration)
- **Schema:** Blog posts use BlogPosting + BreadcrumbList (maintain this!)

### Updating SEO
1. **Read SEO.jsx first** to understand current implementation
2. **Test schemas** with https://search.google.com/test/rich-results
3. **Never remove** existing meta tags without replacement
4. **Always maintain** @graph structure for multi-schema pages

### Updating Styles
- **Tailwind config:** `tailwind.config.js` (fonts, animations, colors)
- **Global styles:** `src/index.css` (minimal - Tailwind directives only)
- **Component styles:** Inline Tailwind classes (preferred)

### Database Changes
1. Make changes in Supabase dashboard
2. Update type definitions in code if needed
3. Test queries in Supabase SQL editor first
4. Document schema changes in this file

---

## 🚨 GIT COMMIT CONVENTIONS

### Commit Message Format
```
<type>: <short summary>

<detailed description if needed>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `style:` - Formatting, CSS
- `docs:` - Documentation
- `chore:` - Build, dependencies
- `perf:` - Performance improvement

### Example
```bash
git commit -m "$(cat <<'EOF'
feat: Add blog category filtering

- Added category dropdown to BlogFeed
- Updated Supabase schema with categories table
- Maintained SEO schemas and BreadcrumbList

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### Git Rules
- **Stage specific files** - No `git add -A` or `git add .`
- **Read before commit** - Verify changes with `git diff`
- **Meaningful messages** - Describe what and why
- **Never force push** to main
- **Never amend** unless explicitly asked

---

## 🧪 TESTING & VALIDATION

### Before Every Commit
- [ ] Files read before editing
- [ ] Code matches existing patterns
- [ ] No console errors in dev mode
- [ ] Responsive design verified (mobile/desktop)

### SEO Validation (Critical Changes)
- [ ] View page source - meta tags present
- [ ] Schema validator: https://validator.schema.org/
- [ ] Rich results test: https://search.google.com/test/rich-results
- [ ] Twitter card: https://cards-dev.twitter.com/validator
- [ ] Sitemap accessible: /sitemap.xml

### Auth/Protected Routes
- [ ] Login/logout flows work
- [ ] Protected routes redirect to /login
- [ ] Admin invite tokens validate correctly

### Blog System
- [ ] Search filters work
- [ ] Code blocks highlight correctly
- [ ] Copy button works
- [ ] SEO schemas present on all posts

---

## 🎯 PROJECT-SPECIFIC CONTEXT

### Business Logic
- **Countdown gate:** Home page locked until Jan 31, 2026, 4:00 PM IST
- **Admin access:** Token-gated signup only (no public registration)
- **Blog visibility:** All posts public, no draft state currently
- **Announcement bar:** Real-time updates via Supabase subscriptions

### Design Language
- **Glassmorphism:** Navbar and cards use backdrop blur
- **Animated blobs:** Background gradients with custom keyframes
- **Brand colors:** Primary #E21339 (red), dark backgrounds
- **Typography:** Poppins (headings), Plus Jakarta Sans (body)

### Performance Targets
- **Lighthouse SEO:** 95+ score
- **First Paint:** < 1.5s
- **LCP:** < 2.5s
- **Bundle size:** Monitor - TinyMCE is largest dependency

### Known Limitations
- No image upload - cover_url is external URL only
- No blog categories/tags yet (future feature)
- No comment system
- No multi-language support

---

## 🔄 UPDATE LOG

### 2026-02-09: Comprehensive SEO Overhaul
- ✅ Multi-schema support with @graph format
- ✅ Home page: Organization + WebSite + SoftwareApplication + FAQPage
- ✅ Blog pages: Enhanced BlogPosting + BreadcrumbList
- ✅ Auth pages: WebPage schema + noindex directives
- ✅ Sitemap: Added lastmod dates, daily changefreq for /blog
- ✅ Social sharing: Updated to pilotup-landing.png
- ✅ Twitter cards: Upgraded to summary_large_image

**Expected Impact:** Home page ranks #1 for "pilotup" searches, FAQ rich results, 15-30% CTR improvement

---

## 📞 QUICK REFERENCE

### Important URLs
- **Site:** https://pilotup.io
- **Supabase Project:** iugcoedgqoqcyatmgcbm.supabase.co
- **PostHog:** https://us.i.posthog.com
- **Google Analytics:** G-0K3CRYDW2F

### Key Constants in Code
- `SITE_URL` - "https://pilotup.io"
- `SITE_NAME` - "PilotUP"
- `COUNTDOWN_TARGET_DATE` - Jan 31, 2026, 4:00 PM IST
- `SEO_MARKER` - "data-pilotup-seo"

### Support Commands
```bash
# Supabase
npx supabase login
npx supabase db push

# Install dependencies
npm install --legacy-peer-deps

# Check bundle size
npm run build && ls -lh dist/assets/
```

---

## 💡 WORKING WITH CLAUDE (This File)

### When I Should Update This File
- New features added
- Architecture changes
- New dependencies
- Build process changes
- SEO schema updates
- Database schema changes
- Important decisions/conventions

### How to Update
Just tell me: "Update CLAUDE.md with [specific change]" and I'll edit this file to keep it current.

### What NOT to Do
- Don't delete this file
- Don't ignore the conventions here
- Don't commit credentials/secrets

---

**END OF CLAUDE.md**

> This file is the source of truth for how Claude should work on PilotUP.
> Keep it updated. Keep it concise. Keep it actionable.
