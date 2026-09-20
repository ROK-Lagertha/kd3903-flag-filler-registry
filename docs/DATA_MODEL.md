# Data Model

## FLAG_FILLERS

| Column | Purpose |
|---|---|
| RECORD_ID | Internal immutable registration ID |
| MAIN_ID | Main Governor ID |
| MAIN_NAME | Main Governor name |
| FLAG_ID | Flag Filler Governor ID |
| FLAG_NAME | Flag Filler name |
| STATUS | ACTIVE or REMOVED |
| REGISTERED_AT | Registration timestamp |
| REMOVED_AT | Removal timestamp |
| REMOVAL_CODE | Self-service removal secret |
| LANGUAGE | Language used during registration |
| LAST_UPDATED_AT | Last status update |

Only ACTIVE records are protected.

## ACTIVE_FLAG_FILLERS
Calculated whitelist for DKP and cleanup workflows. It must contain only ACTIVE registrations.

## CHANGE_LOG
Append-only audit trail for REGISTER, RENAME and REMOVE actions. Rename details preserve the old and new names.

## CONFIG
Operational settings. No credentials or private secrets should be stored in the public GitHub repository.
