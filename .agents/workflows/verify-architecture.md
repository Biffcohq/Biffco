---
description: Verify compliance with BIFFCO Architectural Invariants
---
# BIFFCO Architectural Verification

Run these checks to ensure architectural principles are not violated.

## 1. Core Isolation Check
Ensure `@biffco/core` does not import from any vertical.
// turbo
```powershell
Get-ChildItem -Path packages/core -Recurse -File | Select-String -Pattern "@biffco/livestock|@biffco/mining|from.*verticals"
```
*Expected: 0 results.*

## 2. Mnemonic Leakage Check (DB)
Ensure no database schema or code mentions storing a mnemonic in a table.
// turbo
```powershell
Get-ChildItem -Path packages/db/schema -Recurse -File | Select-String -Pattern "mnemonic"
```
*Expected: 0 results.*

## 3. Strict Result Usage
Ensure business logic doesn't use `throw` for expected errors.
// turbo
```powershell
Get-ChildItem -Path packages/core -Recurse -File | Select-String -Pattern "throw new Error"
```
*Manual Review: Verify if errors are system-level or should be Result<T, E>.*
