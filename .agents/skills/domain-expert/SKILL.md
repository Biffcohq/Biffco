---
description: "Business domain knowledge, Ubiquitous Language, actor workflows, event catalogs, VerticalPack specs for BIFFCO"
triggers:
  - livestock
  - mining
  - vertical
  - VerticalPack
  - actor
  - EUDR
  - SENASA
  - DTE
  - faena
  - slaughter
  - transfer
  - productor
  - veterinario
  - inspector
  - transportista
  - feedlot
  - frigorifico
  - exportador
  - importador
  - DDS
  - compliance
  - Battery Passport
  - carbon footprint
---

# Domain Expert

You are the Domain Expert / Product Owner for BIFFCO.

## Livestock Vertical (Phase C) — 11 Actors

| # | Actor | Workspace | Key Events |
|---|-------|-----------|------------|
| 01 | Productor Ganadero | Own (origin tenant) | ANIMAL_REGISTERED, WEIGHT_RECORDED, TRANSFER_INITIATED |
| 02 | Veterinario de Campo | Member in producer's WS | VACCINE_ADMINISTERED, TREATMENT_ADMINISTERED, VETERINARY_INSPECTION |
| 03 | Inspector SENASA | Member in multiple WSs | OFFICIAL_INSPECTION, HEALTH_CERT_ISSUED (DTE), QUARANTINE_IMPOSED |
| 04 | Transportista | Own WS | TRANSFER_IN_TRANSIT, CHECKPOINT_RECORDED |
| 05 | Feedlot / Engordador | Own WS | FEEDLOT_ENTRY, WEIGHT_GAIN_RECORDED |
| 06 | Frigorífico | Own WS | SLAUGHTER_COMPLETED (Transform 1→N), EUDR_DDS_GENERATED |
| 07 | Laboratorio | Own or Member | QUALITY_ANALYSIS_COMPLETED, QUALITY_CERT_ISSUED |
| 08 | Exportador | Own or same as Frigorífico | EUDR_DDS_GENERATED, CONTAINER_LOADED |
| 09 | Importador UE | Own (destination country) | CUSTOMS_CLEARED, EUDR_DDS_VERIFIED |
| 10 | Minorista/Procesador | Own (destination) | SPLIT_COMPLETED (media res → cortes), RETAIL_PACKAGING_COMPLETED |
| 11 | Auditor Externo | Read-only Member | reports.generate only |

## Asset Types — Livestock

- **AnimalAsset**: Individual animal with EID, breed, sex, birthDate
- **LotAsset**: Group of animals for batch operations
- **DerivedAsset**: Post-slaughter products (cuadril, costillar, cuero, menudencias)

## Critical Domain Rules

1. **SLAUGHTER_COMPLETED validations**: status ACTIVE, 0 holds, DTE vigente, if EU destination: VETERINARY_INSPECTION < 72h, polygon EUDR declared, GFW check clean
2. **Worst-case inheritance**: hold on ANY input → ALL outputs inherit
3. **Core never contains domain terms**: "vaca", "corral" belong in VerticalPack only
4. **Every real-world action = signed DomainEvent**

## Mining Vertical (Phase F) — 8 Actors

MiningOperator, ProcessingPlant, Smelter, MiningCarrier, Laboratory, MiningInspector, BatteryManufacturer, ESGAuditor

Asset types: OreExtract → MineralConcentrate → RefinedMaterial → BatteryPrecursor
Carbon footprint accumulates through Split/Merge/Transform.
