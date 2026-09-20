# KD3903 Flag Filler Registry

Multilingual self-service registry for Kingdom 3903.

## Purpose
Each player may register one CH25 Flag Filler. Active registered Flag Fillers can be excluded from DKP / Kingdom Cleanup removal workflows.

## Rules
- One active Flag Filler per Main Governor.
- One active Main Governor per Flag Filler.
- Main ID and Flag Filler ID must be different.
- Registration generates a Removal Code.
- Rename requires Main ID + Flag Filler ID + Removal Code; IDs remain immutable.
- Removal requires Main ID + Flag Filler ID + Removal Code.
- Removed registrations remain in history but are no longer active/protected.

## Architecture
Google Apps Script Web App -> private Google Sheet

This public repository must never contain player data, removal codes, spreadsheet IDs, credentials, or secrets.

## Current version
v0.2.0 - Kingdom UI

## Asset
`assets/kd3903-banner.gif` is loaded by the Web App from this public GitHub repository.
