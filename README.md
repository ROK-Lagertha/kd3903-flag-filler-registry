# 👑 KD3903 Flag Filler Registry

Official self-service **Flag Filler Registry for Rise of Kingdoms ---
Kingdom 3903**.

The registry allows KD3903 players to register and manage one approved
CH25 Flag Filler for their Main Governor. It gives kingdom leadership a
reliable active list for DKP reviews, player administration and Kingdom
Cleanup while keeping the underlying Google Sheets private.

> **KD3903 --- Fair Play • Stronger Together • International Family**

## ✨ Current Status

**Live / production-tested.**

The original Google Apps Script WebApp frontend has been migrated to a
Cloudflare-hosted frontend and API gateway. Google Apps Script remains
the protected backend bridge and Google Sheets remains the source of
truth.

The current release includes:

-   Cloudflare-hosted responsive frontend
-   Cloudflare Worker API gateway
-   Google Apps Script API bridge
-   Private Google Sheets data store
-   Register, Rename and Remove workflows
-   Registry Code verification
-   10 interface languages
-   Main menu with FAQ, About Flag Filler Registry and How It Works
-   Responsive desktop, tablet and mobile layouts
-   Mobile accordion for Registry actions
-   Optimized production artwork
-   Server-side validation and duplicate protection
-   Audit logging
-   Security hardening for the public API path

## 🏗️ Architecture

``` text
Player / Browser
       │
       ▼
Cloudflare Static Frontend
cloudflare/public/
       │
       │ POST /api/registry
       ▼
Cloudflare Worker / API Gateway
cloudflare/worker.js
       │
       │ authenticated server-to-server request
       ▼
Google Apps Script API Bridge
src/Api.gs
       │
       ▼
Registry Business Logic
src/Registry.gs
       │
       ▼
Private Google Spreadsheet
 ├── FLAG_FILLERS
 ├── ACTIVE_FLAG_FILLERS
 ├── CHANGE_LOG
 └── CONFIG
```

The browser never communicates directly with the Google Spreadsheet and
does not receive the Apps Script API secret.

## ⚙️ Player Workflows

### Register

A player provides:

-   Main Governor ID
-   Main Governor Name
-   Flag Filler Governor ID
-   Flag Filler Name

The system validates the request, prevents duplicate active
registrations and creates a personal **Registry Code**.

The Registry Code must be kept safe because it is required for future
Rename and Remove operations.

### Rename

Players can update the stored Main and/or Flag Filler name without
creating a new registration.

Rename requires:

-   Main Governor ID
-   Flag Filler Governor ID
-   Registry Code
-   New Main name and/or Flag Filler name

Governor IDs remain unchanged.

### Remove

Players can remove an active registration using:

-   Main Governor ID
-   Flag Filler Governor ID
-   Registry Code

Removal is a **soft delete**. The registration is removed from the
active list while the historical record remains available for kingdom
administration.

To register a different Flag Filler, the existing active registration
must first be removed.

## 📋 Registry Rules

-   Maximum **1 active Flag Filler per Main Governor**
-   A Flag Filler Governor ID can belong to only **1 active
    registration**
-   Main Governor ID and Flag Filler Governor ID must be different
-   Governor IDs must be numeric
-   Governor IDs cannot be changed through Rename
-   Names can be updated through Rename
-   Registry Code is required for Rename and Remove
-   Historical records are retained after removal
-   Registration does not override KD3903 contribution requirements

## ⚔️ Flag Filler ≠ Free Farm

Registration confirms that an account is an approved Flag Filler. It
does **not** exempt the account from KD3903 requirements.

Flag Fillers are intended to support the kingdom and are expected to
meet the applicable **Death Requirements during KvK**. A registered Flag
Filler that does not meet the required contribution can still be subject
to normal kingdom administration.

## 🧭 Menu & Information Architecture

The production header contains two compact controls:

-   **Language** --- flag-only language selector for all 10 supported
    interface languages
-   **MENU** --- opens the Registry information navigation

The main menu contains:

### FAQ

Reserved for practical questions, special cases and common player
problems.

### About Flag Filler Registry

Explains why the Registry exists, what approved Flag Filler status
means, kingdom responsibilities and the role of the stored Registry
data.

### How It Works

Explains the complete player workflow:

``` text
Register → Save Registry Code → Rename when needed → Remove before replacement
```

This separation keeps general explanations out of the FAQ and makes the
Registry easier to understand on both desktop and mobile.

## 🌍 Supported Languages

The player interface currently supports **10 languages**:

  Language              Code
  --------------------- ------
  🇬🇧 English            `en`
  🇩🇪 Deutsch            `de`
  🇷🇺 Русский            `ru`
  🇹🇷 Türkçe             `tr`
  🇫🇷 Français           `fr`
  🇲🇾 Bahasa Melayu      `ms`
  🇫🇮 Suomi              `fi`
  🇺🇦 Українська         `uk`
  🇺🇿 O'zbekcha          `uz`
  🇮🇩 Bahasa Indonesia   `id`

English is the default language on first load.

## 🎨 Frontend & Responsive UX

The production frontend lives in `cloudflare/public/`.

The current design follows the **3903 Tool Family** visual language:

The header uses a compact flag-based language picker next to the main
`MENU`. The menu provides dedicated **FAQ**, **About Flag Filler
Registry** and **How It Works** views so general explanations do not
have to be duplicated inside the FAQ.

-   Deep navy / black base
-   Gold and silver metallic accents
-   Warm gold glow
-   Kingdom administration / registry identity
-   Dedicated Flag Filler Registry hero artwork
-   KD3903 Cappy footer artwork
-   Compact flag-based language picker and main menu navigation

### Desktop

Desktop displays Register, Rename and Remove as three parallel Registry
cards.

### Mobile & Narrow Tablets

At viewport widths up to `900px`, the three Registry actions use an
accordion:

-   All three cards start collapsed
-   Tapping a card opens its form
-   Opening another card automatically closes the previous one
-   Only one Registry form is expanded at a time

This keeps the mobile page compact without changing any Registry
business logic.

## 🔐 Security Model

The public application uses a layered security model.

### Cloudflare Worker

`cloudflare/worker.js` acts as the public API gateway and:

-   Accepts Registry writes only through `/api/registry`
-   Supports only `REGISTER`, `RENAME` and `REMOVE`
-   Validates request structure before forwarding
-   Requires JSON requests
-   Limits request bodies to **8192 bytes**
-   Rejects cross-origin browser write requests
-   Uses a **12-second upstream timeout**
-   Returns controlled public error responses
-   Applies security headers to static responses
-   Exposes `/api/health` for backend health checks

### Worker → Apps Script Authentication

Cloudflare stores the server-side secret:

``` text
APPS_SCRIPT_API_SECRET
```

Google Apps Script stores the matching Script Property:

``` text
CF_API_SECRET
```

The browser never receives either secret.

### Apps Script API Bridge

`src/Api.gs`:

-   Authenticates requests from the Cloudflare Worker
-   Routes `PING`, `REGISTER`, `RENAME` and `REMOVE`
-   Does not expose internal Apps Script or Spreadsheet errors publicly
-   Returns only known safe business error codes where appropriate

### Spreadsheet Configuration

The production Spreadsheet ID is stored in the Apps Script Script
Property:

``` text
SPREADSHEET_ID
```

It is not required in the public frontend.

## 🗃️ Google Sheets

Google Sheets remains the source of truth.

  Sheet                   Purpose
  ----------------------- -----------------------------------------
  `FLAG_FILLERS`          Registry records and registration state
  `ACTIVE_FLAG_FILLERS`   Active Flag Filler view/list
  `CHANGE_LOG`            Administrative audit history
  `CONFIG`                Registry configuration

Registry write operations use Apps Script locking to reduce concurrency
conflicts.

Register and Remove actions are logged to `CHANGE_LOG`. Rename updates
the authoritative Registry record first; audit logging is intentionally
isolated so a logging failure cannot turn an already successful rename
into a false failure response.

## 📁 Project Structure

``` text
kd3903-flag-filler-registry/
├── cloudflare/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── FlagFiller_Banner.png
│   │   │   ├── Footer_Cappy_links.png
│   │   │   └── Footer_Cappy_rechts.png
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── app.js
│   │   ├── card-accordion.js
│   │   ├── menu.js
│   │   └── language-picker.js
│   └── worker.js
├── src/
│   ├── Api.gs
│   ├── Code.gs
│   ├── Config.gs
│   ├── Registry.gs
│   ├── Security.gs
│   ├── Validation.gs
│   ├── Index.html
│   ├── Styles.html
│   └── JavaScript.html
├── assets/
├── docs/
├── appsscript.json
├── wrangler.jsonc
└── README.md
```

### Legacy Frontend Files

`src/Index.html`, `src/Styles.html` and `src/JavaScript.html` belong to
the earlier Google Apps Script WebApp frontend.

They remain in the repository for project history/reference, but the
**live player-facing frontend is `cloudflare/public/`**.

## 🚀 Deployment

The application has two deployment layers.

### 1. Google Apps Script Backend

Required Script Properties:

``` text
SPREADSHEET_ID
CF_API_SECRET
```

Deploy the Apps Script backend as a Web App that can receive the
authenticated Worker requests.

When backend code changes:

1.  Update the Apps Script source.
2.  Save the project.
3.  Open **Deploy → Manage deployments**.
4.  Edit the backend Web App deployment.
5.  Create/select a new version.
6.  Deploy.

The Cloudflare Worker must point to the active Apps Script Web App
endpoint.

### 2. Cloudflare Frontend & Worker

Cloudflare configuration is stored in `wrangler.jsonc`.

The project configuration uses:

``` text
name: kd3903-flag-filler-registry
main: cloudflare/worker.js
assets directory: ./cloudflare/public
binding: ASSETS
```

Configure the Worker secret:

``` text
APPS_SCRIPT_API_SECRET
```

Its value must match the Apps Script `CF_API_SECRET`.

Deploy the Worker and static assets with the repository's
Cloudflare/Wrangler deployment workflow.

After deployment, verify:

1.  The frontend loads correctly on desktop and mobile.
2.  The language selector and main menu (FAQ / About / How It Works)
    work.
3.  `/api/health` returns a successful backend response.
4.  Register works with a valid test registration.
5.  Rename works with the generated Registry Code.
6.  Remove works with the same Registry Code.
7.  The expected Spreadsheet and Change Log updates are present.

## 🖼️ Production Assets

The production Registry artwork is stored in:

``` text
cloudflare/public/assets/
```

Current assets:

-   `FlagFiller_Banner.png` --- Registry hero artwork
-   `Footer_Cappy_links.png` --- left footer artwork
-   `Footer_Cappy_rechts.png` --- right footer artwork

The assets were optimized for web delivery while preserving PNG
transparency and the approved KD3903 design.

Approximate optimization result:

-   Original combined size: \~7.1 MB
-   Optimized combined size: \~2.15 MB
-   Header reduction: \~55%
-   Left footer reduction: \~70%
-   Right footer reduction: \~81%

## 🩺 Health Check

The Worker exposes:

``` text
GET /api/health
```

The Worker forwards a protected `PING` to Apps Script.

A healthy backend returns a successful response containing a `PONG`
status.

## 🚫 Do Not Commit

Never commit production secrets or private Registry data.

This includes:

-   `APPS_SCRIPT_API_SECRET`
-   `CF_API_SECRET`
-   Registry Codes
-   Player Registry exports
-   Private Spreadsheet contents
-   Credentials or API keys
-   Other private kingdom administration data

Keep secrets in Cloudflare secret storage and Google Apps Script Script
Properties.

## 🧭 Migration History

The project originally ran as a Google Apps Script WebApp.

The 2026 migration moved the public application layer to Cloudflare
while retaining the existing Registry logic and Google Sheets data
model.

Major migration milestones:

-   **FFR-OP-009** --- Frontend decoupled from Apps Script
-   **FFR-OP-010** --- Cloudflare target architecture established
-   **FFR-OP-011** --- Existing data storage and Registry logic
    connected and tested
-   **FFR-OP-012** --- Cloudflare security hardening completed and
    tested
-   **FFR-OP-012.1** --- Rename response / atomicity bug fixed and
    tested
-   **FFR-OP-013** --- Cloudflare production workflows verified; final
    cutover pending
-   **FFR-OP-014** --- Repository documentation finalized for the
    production architecture
-   **FFR-OP-015** --- Main menu and information architecture
    implemented and production-tested
-   **FFR-OP-015.2** --- Compact flag-only language picker implemented
    and tested
-   **FFR-OP-016** --- Obsolete development-status notice removed from
    the release source; Cloudflare deployment verification pending

## 🧹 Final Release Cleanup

The release source no longer includes the development-only footer/status
notice:

``` text
CLOUDFLARE PREVIEW · SECURE REGISTRY API · GOOGLE SHEETS REMAINS SOURCE OF TRUTH
```

This text was useful during development but is not part of the intended
player-facing production UI. At the time of this documentation update,
Cloudflare build/deployment verification for this final cleanup is still
pending. The last known successful production deployment remains
functional.

## 📦 Release Status

The previous Google Apps Script frontend release line reached
**v0.3.2**.

The current Cloudflare version represents the redesigned and
security-hardened successor to that release line. Register, Rename and
Remove have been verified successfully in production use, including the
first official Flag Filler registration. The final release-source
cleanup is complete; deployment verification of that cleanup remains
pending.

The current production baseline includes:

-   Cloudflare frontend
-   Cloudflare API gateway
-   Apps Script authenticated API bridge
-   Existing Google Sheets Registry
-   Final responsive 3903 design
-   Optimized artwork
-   Mobile Registry accordion
-   Multilingual interface with FAQ, About and How It Works
-   Security hardening
-   Rename atomicity fix
-   Compact flag-only 10-language picker
-   Main menu with separated FAQ / About / How It Works content

## 👑 Kingdom 3903

**Fair Play • Stronger Together • International Family**

Built for the players and leadership of **KD3903**.

This project is a kingdom administration tool for KD3903 and is not
intended as a general multi-kingdom SaaS platform.
