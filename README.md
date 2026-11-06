# LoLdle Answer Finder

**English** | [Türkçe](README.tr.md)

A small Chrome extension that reads today's [LoLdle](https://loldle.net) answer directly from the page and shows it to you.

## Features

- Shows today's champion for every mode: Classic, Quote, Ability, Emoji, Splash
- **Ability mode:** shows the correct key (Passive / Q / W / E / R) and ability name
- Highlights the right button in the bonus question and can answer it with one click
- Floating on-page box, hidden by default — click it to reveal or hide the answer (no accidental spoilers)
- Popup from the toolbar icon for a quick look
- **Automatic language:** the interface is in Turkish if your system/browser language is Turkish, otherwise English

## Installation

1. Download this repository (**Code → Download ZIP**) and extract it, or clone it:
   ```bash
   git clone https://github.com/YasefDogan/loldle-cevap-bulucu.git
   ```
2. Open `chrome://extensions` in Chrome (works in Edge, Brave, Opera too).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the extracted folder.

## Usage

1. Go to [loldle.net](https://loldle.net) and pick a mode.
2. Click the **👁 Show today's answer** box in the top-right corner of the page,
   or click the extension icon in the toolbar.
3. In Ability mode, after you find the champion, use **Answer bonus** to pick the right key.

## How it works

LoLdle is a Vue app. The extension walks the page's Vue component tree and reads the already-decrypted answer (`todayAnswerDecrypted`) and ability info (`abilityLetter`, `abilityName`). It makes no network requests and collects no data.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (MV3) |
| `content.js` | Floating answer box on loldle.net |
| `popup.html` / `popup.js` | Toolbar popup |
| `_locales/` | Extension name/description in Turkish and English |

## Disclaimer

This is an unofficial fan project and is not affiliated with LoLdle or Riot Games. It is for fun — using it spoils the game, so use it wisely. If the site changes its structure, the extension may stop working.
