# KD3903 Flag Filler Registry

Multilingual self-service registry for Kingdom 3903.

## Purpose
Each player may register one CH25 Flag Filler. Active registered Flag Fillers can be excluded from DKP / Kingdom Cleanup removal workflows.

## Rules
- One active Flag Filler per Main Governor.
- One active Main Governor per Flag Filler.
- Main ID and Flag Filler ID must be different.
- Registration generates a Registry Code.
- Rename requires Main ID + Flag Filler ID + Registry Code; IDs remain immutable.
- Removal requires Main ID + Flag Filler ID + Registry Code.
- Removed registrations remain in history but are no longer active/protected.

## Architecture
Google Apps Script Web App -> private Google Sheet

This public repository must never contain player data, registry codes, spreadsheet IDs, credentials, or secrets.

## Current version
v0.2.5.1 Pre-Live - FAQ Hotfix

## Asset
`assets/kd3903-banner.gif` is loaded by the Web App from this public GitHub repository.

## Languages
English, German, Russian, Turkish, French, Bahasa Melayu.

## v0.2.5
Adds a dedicated in-app FAQ view, Death Requirements warning, and localized FAQ navigation.

### v0.2.5.1
Fixes FAQ navigation/localization binding and Turkish/French translation mapping.
