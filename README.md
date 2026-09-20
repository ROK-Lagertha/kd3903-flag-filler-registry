# 👑 KD3903 Flag Filler Registry

Official self-service **Flag Filler registration system for Rise of Kingdoms — Kingdom 3903**.

The registry allows KD3903 players to register one approved CH25 Flag Filler for their Main Governor and gives kingdom leadership a reliable active list for administration, DKP reviews, and Kingdom Cleanup.

> **KD3903 — Fair Play • Stronger Together • International Family**

## 🌐 Live Registry

**https://kingdom3903.s.gy/flagfiller3903**

The public WebApp is designed for desktop and mobile use. English is used on first load, and players can switch languages directly in the interface.

## ✨ Features

- Register **one active Flag Filler per Main Governor**
- Prevent duplicate active Main Governor and Flag Filler IDs
- Rename Main Governor and/or Flag Filler names without changing Governor IDs
- Remove an active Flag Filler registration
- Personal **Registry Code** for Rename and Remove operations
- Server-side validation of registrations
- Soft deletion instead of permanent record deletion
- Administrative change history for Register, Rename, and Remove actions
- Dedicated FAQ & Help section
- Responsive KD3903 black/gold interface
- Official KD3903 Discord integration
- Multilingual player interface

## 🌍 Supported Languages

The registry currently supports **10 languages**:

| Language | Code |
|---|---|
| 🇬🇧 English | `en` |
| 🇩🇪 Deutsch | `de` |
| 🇷🇺 Русский | `ru` |
| 🇹🇷 Türkçe | `tr` |
| 🇫🇷 Français | `fr` |
| 🇲🇾 Bahasa Melayu | `ms` |
| 🇫🇮 Suomi | `fi` |
| 🇺🇦 Українська | `uk` |
| 🇺🇿 O‘zbekcha | `uz` |
| 🇮🇩 Bahasa Indonesia | `id` |

English is the default language on first load.

## ⚙️ How It Works

### Register

A player provides:

- Main Governor ID
- Main Governor Name
- Flag Filler Governor ID
- Flag Filler Name

After successful registration, the system generates a personal Registry Code in the format:

```text
3903-XXXXXXXX
```

The Registry Code should be kept safe. It is required to manage the registration later.

### Rename

If the ingame name of the Main Governor or Flag Filler changes, the player can update the stored name without creating a new registration.

Rename requires:

- Main Governor ID
- Flag Filler Governor ID
- Registry Code
- New Main and/or Flag Filler name

Governor IDs cannot be changed through Rename.

### Remove

A registration can be removed using:

- Main Governor ID
- Flag Filler Governor ID
- Registry Code

Removal is a **soft delete**. The account disappears from the active Flag Filler list, while the historical record remains available for kingdom administration.

To use a different Flag Filler, the existing registration must first be removed and the new account registered afterward.

## ⚔️ Flag Filler ≠ Free Farm

Registration confirms that an account is an approved Flag Filler. It does **not** exempt that account from KD3903 requirements.

Flag Fillers are intended to support the kingdom during war and are expected to meet the applicable **Death Requirements during KvK**.

A CH25 Flag Filler that does not fulfill its required contribution may still be required to leave the kingdom.

## 🏗️ Architecture

```text
Player
  │
  ▼
KD3903 WebApp
  │
  ▼
Google Apps Script
  │
  ▼
Private Google Sheet
  ├── FLAG_FILLERS
  ├── ACTIVE_FLAG_FILLERS
  ├── CHANGE_LOG
  └── CONFIG
```

The public interface never exposes the backing spreadsheet directly.

### Google Apps Script

The Apps Script backend handles:

- Registration validation
- Duplicate prevention
- Registry Code verification
- Rename operations
- Soft deletion
- Change logging
- Spreadsheet access
- Concurrency protection using `LockService`

## 🔐 Data & Security

The public GitHub repository contains application source code only.

The following must **never** be committed to this repository:

- Player registration data
- Registry Codes
- Private spreadsheet contents
- Spreadsheet IDs
- Credentials
- API keys
- Other secrets

The production Spreadsheet ID is stored in **Google Apps Script Script Properties**, not in source control.

The registry stores only the information required for KD3903 administration, including Main/Flag Governor IDs and names, registration status, selected language, and administrative timestamps.

## 📁 Project Structure

```text
kd3903-flag-filler-registry/
├── assets/
│   └── kd3903-banner.gif
├── src/
│   ├── Code.gs
│   ├── Config.gs
│   ├── Registry.gs
│   ├── Security.gs
│   ├── Validation.gs
│   ├── Index.html
│   ├── Styles.html
│   └── JavaScript.html
└── README.md
```

## 🚀 Deployment

The application runs as a **Google Apps Script WebApp**.

Typical deployment workflow:

1. Update the source files in the Apps Script project.
2. Save the project.
3. Open **Deploy → Manage deployments**.
4. Edit the existing WebApp deployment.
5. Select **New version**.
6. Deploy the new version.

Updating the existing deployment preserves the public WebApp URL.

The short public KD3903 URL redirects players to the current production deployment.

## 🧾 Registry Rules

- Maximum **1 active Flag Filler per Main Governor**
- A Flag Filler Governor ID can belong to only **1 active registration**
- Main Governor ID and Flag Filler ID must be different
- Governor IDs must be valid numeric IDs
- Governor IDs cannot be edited after registration
- Names can be updated through Rename
- Registry Code is required for Rename and Remove
- Historical records are retained after removal
- Registration does not override KD3903 contribution or Death Requirements

## 🛟 Support

Players who lose their Registry Code or experience problems with the WebApp should contact:

**义Lagertha义**

Please do not create duplicate registrations if a Registry Code has been lost.

## 💬 KD3903 Discord

Official Kingdom 3903 Discord:

**https://discord.gg/kingdom3903**

## 📦 Current Release

### v0.3.2 — Complete FAQ Localization

Current release highlights:

- Complete player-facing Flag Filler Registry
- Register, Rename, and Remove workflows
- Registry Code management
- Responsive KD3903 UI
- FAQ & Help system
- Discord and support integration
- 10 supported languages
- English default language
- Complete FAQ localization
- Native Russian and Turkish FAQ content
- Localized FAQ heading and Death Requirements warning panel

## 🗂️ Version History

| Version | Summary |
|---|---|
| `v0.3.2` | Complete FAQ localization and final multilingual FAQ fixes |
| `v0.3.1` | Russian and Turkish FAQ localization hotfix |
| `v0.3.0` | Release Candidate; Indonesian added and English set as default |
| `v0.2.9` | Finnish, Ukrainian, and Uzbek support |
| `v0.2.8` | Player support contact added |
| `v0.2.7` | KD3903 Discord integration |
| `v0.2.6` | FAQ UI polish |
| `v0.2.5` | FAQ & Help system and pre-live localization |
| `v0.2.4` | French and Bahasa Melayu support |
| `v0.2.3` | Result frame polish |
| `v0.2.2` | Registry Code terminology and CSS hotfix |
| `v0.2.1` | Ornate KD3903 UI and mobile improvements |
| `v0.2.0` | Kingdom-themed player interface |
| `v0.1.1` | Rename workflow |
| `v0.1.0` | Initial registry foundation |

---

### 👑 Kingdom 3903

**Fair Play • Stronger Together • International Family**

Built for the players and leadership of **KD3903**.
