# Deployment Guide

## 1. GitHub
Commit and push this repository. The repository may be public because it contains no production data or secrets.

## 2. Google Apps Script
Open the private Google Sheet used by KD3903.

Use **Extensions -> Apps Script**.

Create/copy these Apps Script files:

- Code.gs
- Config.gs
- Registry.gs
- Security.gs
- Validation.gs
- Index.html
- Styles.html
- JavaScript.html

Replace the default Apps Script content with the matching files from `src/`.

Copy the content of `appsscript.json` into the Apps Script manifest if you are managing the manifest manually.

## 3. Script Property
In Apps Script open:

Project Settings -> Script Properties

Create:

Key: `SPREADSHEET_ID`

Value: the ID of the private KD3903 Flag Filler Registry Google Sheet.

Do NOT put this value in GitHub.

## 4. Test
Before public deployment, test with disposable/sample Governor IDs.

Required tests:

1. Register Main A + Flag A -> success.
2. Register Main A + Flag B -> rejected.
3. Register Main B + Flag A -> rejected.
4. Main ID equals Flag ID -> rejected.
5. Rename with correct IDs + code -> names update, IDs stay unchanged.
6. Rename with wrong code -> rejected.
7. Verify RENAME appears in CHANGE_LOG.
8. Remove with wrong Removal Code -> rejected.
9. Remove with correct code -> success.
10. Verify removed record disappears from ACTIVE_FLAG_FILLERS.
11. Re-register Main A with a new Flag after removal -> success.
12. Verify CHANGE_LOG contains REGISTER, RENAME and REMOVE.

## 5. Deploy
Apps Script:

Deploy -> New deployment -> Web app

Execute as: Me

Who has access: Anyone

Deploy and copy the Web App URL.

## 6. Go live
After testing, change CONFIG / APP_STATUS from `SETUP` to `LIVE`.

The Web App URL can then be posted on the KD3903 Discord.

## Security
Never commit:
- Spreadsheet ID
- player records
- Removal Codes
- credentials
- API keys
- private exports
