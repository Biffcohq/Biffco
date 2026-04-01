# Declaración de Debida Diligencia (DDS) - EUDR Art. 4 y 9

Este documento formaliza los campos y el mapeo arquitectónico utilizado en Biffco para generar el Documento de Debida Diligencia en cumplimiento con el Reglamento (UE) 2023/1115 del Parlamento Europeo y del Consejo.

## Estructura de Datos (Artículo 9 del EUDR)

De acuerdo a la ley europea, cualquier operador que introduzca o exporte ganado, carne, soja o madera, deberá presentar la siguiente información, la cual extraemos de nuestro DAG inmutable:

| Campo EUDR | Origen en `biffco` (Trazabilidad) |
| --- | --- |
| **Operador Responsable** (Nombre) | `workspaces.name` / Perfil del exportador activo. |
| **Identificación (EORI)** | Registrado centralmente bajo `workspaces.metadata.eoriNumber`. |
| **Código Arancelario (Taric)** | `DerivedAsset.metadata.hsCode` u obtenido desde el catálogo de clasificación Biffco. |
| **Descripción del Producto** | `DerivedAsset.type` (Ej. Carne Deshuesada, Cuartos, Cuero). |
| **País de Producción** | Base del `Zone` original al nacer el animal (`locations.country`). |
| **Geolocalización Satelital** | Extraído recursivamente: El `AnimalAsset` traza su array de `LotAssets` y se iteran los GeoJSON de la(s) tabla(s) `zones.polygon`. |
| **Fecha de Producción/Cosecha** | Para la ganadería: Rango de vida del `AnimalAsset` (createdAt -> Fecha del SLAUGHTER_COMPLETED). |
| **Certificación Libre Deforestación**| Se consulta la API externa de `Global Forest Watch` iterando sobre cada *Polígono Geográfico*. Si existe un `HIGH_RISK` alerta, la mercancía se declara `RESTRICTED`.|

## Herencia de Máximo Riesgo (Worst-Case Compliance)

Los *Polígonos* no se diluyen. Si se consolida un envase de carne (LotAsset) con carne procedente de 1,000 animales limpios y 1 animal proveniente de un polígono *high-risk* deforestado (post 2020), la Declaración DDS reportará obligatoriamente la totalidad de la partida como "Riesgosa" (`RESTRICTED`), activando alertas en aduana.
