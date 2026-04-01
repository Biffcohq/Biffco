# Biffco — Livestock Vertical Ubiquitous Language

*Versión 1.0 — Documento de glosario y dominio de entendimiento común para el equipo de desarrollo, auditores técnicos y stakeholders de Ganadería Bovina en Argentina (Sujeto a regulaciones EUDR y SENASA).*

Este documento traduce el idioma del negocio ganadero real a los modelos core de Biffco, mitigando malentendidos, alineando variables y asegurando que las abstracciones funcionen correctamente. 

## 1. Topología y Ubicaciones Físicas (Locations)

Las ubicaciones se mapean a la jerarquía genérica del Core: `Workspace -> Facility -> Zone -> Pen`.

1. **Estancia / Empresa Ganadera (Workspace)**: El tenant o entidad principal dueña de la operación y del establecimiento. Todo sucede bajo este límite de aislamiento de datos (RLS).
2. **Establecimiento (Facility)**: Es el campo físico. Tiene una habilitación de SENASA y un número único obligatorio: el **RENSPA** (Registro Nacional Sanitario de Productores Agropecuarios). Cada RENSPA se traduce en un `Facility` dentro de un `Workspace`.
3. **Lote / Parcela (Zone)**: La división territorial más amplia dentro de un establecimiento. Típicamente comprende decenas a miles de hectáreas limitadas por alambrado. El **Polígono EUDR** se ancla a este nivel para asegurar cumplimiento con requerimientos del Parlamento Europeo en relación a deforestación.
4. **Corral (Pen)**: Una zona física acotada dentro de la manga, del encierre o del feedlot para agrupamientos menores, donde no hay pastoreo natural. Generalmente tiene un número máximo de ocupación o capacidad.
5. **Planta Faenadora (Facility tipo Slaughterhouse)**: El espacio físico del Frigorífico donde ocurre la transformación del animal vivo a los cortes de carne.

## 2. Los Activos (Assets)

El término genérico `Asset` del *Core* toma 3 formas de tipos de assets (AssetTypes) estrictamente en el dominio bovino.

6. **AnimalAsset (Animal)**: Un activo individual. Una vaca, toro, ternero o novillo. Su campo crítico es el `EID` (Electronic Identifier) o número de Caravana RFID. Vive hasta ser cerrado en faena o descartado.
7. **LotAsset (Lote de animales / Tropa estable)**: Un grupo permanente de animales que se crían, manejan y venden al unísono manteniendo el mismo *parentAssetId* o registro colectivo donde no es posible la caravana individual.
8. **DerivedAsset (Corte, Derivado)**: Todo activo derivado resultante de la faena de un `AnimalAsset`. Existen múltiples subtipos o cortes: Media Res, Costillar, Cuadril, Cuero, Ojo de Bife, Menudencias, etc.
9. **AssetGroup (Tropa Temporal)**: Un agrupador *temporal* (usado vía `GROUP_FORMED`). Los ganaderos llaman "tropa" a un conjunto de animales que se suben a la misma jaula (camión) o pasan juntos por la manga, aunque mantengan sus existencias `AnimalAsset` particulares como entidades.

## 3. Roles y Actores

10. **BovineProducer (Productor Ganadero)**: Originador del ganado. Cría, desteta, hace recría y engorda. Dueño de los activos primarios.
11. **Veterinarian (Veterinario Privado / de Campo)**: Profesional veterinario matriculado contratado por el productor. Su trabajo es clínico y particular de salud del rodeo.
12. **SenasaInspector (Inspector SENASA)**: Oficial del Gobierno Argentino. Habilita traslados y controla cuarentenas oficiales estatales.
13. **FeedlotOperator (Engordador a Corral)**: Negocio donde ingresan lotes de animales para ser encerrados en dieta intensiva por X días (ej. 90-120 días).
14. **LivestockCarrier (Transportista / Camionero)**: Custodio del activo en el evento de traslado `TRANSFER_IN_TRANSIT` (Jaulero).
15. **SlaughterhouseOperator (Operario de Frigorífico)**: El rol de mayor peso del compliance; ejecutor de la operación atómica de Faena (Transform de Vivo a Cortes).
16. **Exporter (Despachante / Exportador)**: Arma el contenedor (`GROUP_FORMED -> EXPORT`) y eleva el Documento de Debida Diligencia al Parlamento Europeo (DDS EUDR).
17. **EUImporter (Importador Europeo)**: Actor que ejecuta el Clearance de Aduanas (`CUSTOMS_CLEARED`) en destino.
18. **RetailerProcessor (Despostador minorista / Supermercado)**: Hace el empaquetado final (`RETAIL_PACKAGING_COMPLETED`) del corte y pega la etiqueta con el código QR.
19. **AccreditedLaboratory (Laboratorio Bromatológico)**: Analiza y certifica cortes o status genéticos.
20. **ExternalAuditor (Auditor Independiente)**: Analista (read-only) que evalúa el estado del sistema sin capacidad de modificarlo.

## 4. Regulaciones y Controles (Compliance y Holds)

21. **EUDR (Reglamento de Cero Deforestación Europeo)**: Exige la coordenada geológica de todos los polígonos (*Zone*) donde el animal estuvo físicamente desde su nacimiento. Si hay infracción (cruzada vía Global Forest Watch), hereda el peor caso (Worst-case inheritance) y se inhabilita exportar.
22. **DTE (Documento de Tránsito Electrónico)**: Evento (`HEALTH_CERT_ISSUED`) firmado exclusivamente por el `SenasaInspector`. Obligatorio en todo movimiento o evento `TRANSFER_INITIATED`.
23. **DDS (Due Diligence Statement)**: Documentación de la Unión Europea que atestigua que ni el *AnimalAsset*, ni su linaje, estuvieron en polígonos deforestados. Biffco lo auto-genera si el semáforo es verde.
24. **Hold (Retención)**: Invariante del *Core* que marca el Asset como inmovilizado/bloqueado. Subtipos: Retención sanitaria (`SANITARY_HOLD` / `VETERINARY_HOLD`), interdicción oficial/cuarentena (`QUARANTINE`).
25. **GFW Check (Global Forest Watch)**: Control de latitud y longitud histórica frente a la base de datos de alertas de deforestación.

## 5. Acciones y Eventos de Dominio (DomainEvents)

26. **Señalada / Marcación (`BRANDING_RECORDED`)**: Acción de marcar fuego, mueca de oreja o fijar un identificador de plástico. En digital es cuando se asigna/registra el `EID` oficial a un Asset.
27. **Alta / Nacimiento (`ANIMAL_REGISTERED` / `BIRTH_RECORDED`)**: Cuando el animal se declara y se da de alta en el Ledger inmutable por parte del `BovineProducer`.
28. **Pesada (`WEIGHT_RECORDED`)**: Ocurre en la manga del productor, al ingreso al feedlot (`WEIGHT_GAIN_RECORDED`) y pre-faena. 
29. **Faena (`SLAUGHTER_COMPLETED`)**: La conversión irreversible y matemática (`TRANSFORM 1 -> N`) de `AnimalAsset` a `DerivedAssets` (media res, cuero, achuras).
30. **Vacunación Oficial (`VACCINE_ADMINISTERED`)**: Campañas como Fiebre Aftosa (Foot and mouth disease) o Brucelosis, que son mandatorias y exigen la firma del `SenasaInspector`.
31. **Tratamiento Veterinario (`TREATMENT_ADMINISTERED`)**: Antibióticos (requieren receta en el Payload) donde empieza a correr un **Tiempo de Retiro/Carencia** antes del cual no se puede faenar.
32. **Incidencia Sanitaria (`HEALTH_INCIDENT_REPORTED`)**: Si el animal se lastima, se detecta renguera o patología de gravedad, disparando automáticamente un hold interno de gravedad.
33. **Resolución de Alta (`INCIDENT_RESOLVED`)**: Un `Veterinarian` o `SenasaInspector` dan de alta al animal y extirpan el lock correspondiente del hold actual.
34. **Inspección de Cuota / Oficial (`OFFICIAL_INSPECTION`)**: Acto confirmatorio de SENASA en la manga o en el acceso al frigorífico para validar papelería.
35. **Certificación Externa (`EXTERNAL_CERTIFICATION_LINKED`)**: Ejemplo, un Inspector de la asociación Argentina de la raza Aberdeen Angus ancla un certificado PDF (en el storage WORM de Biffco) certificando la pureza de raza.

## 6. Operaciones estructurales (Core Hooks)

36. **Dividir Tropa (`SPLIT_COMPLETED`)**: Agarra un `LotAsset` o `DerivedAsset` y lo divide en dos manteniéndose en el mismo tipo pero heredando las regulaciones del peor caso del Asset originante. P. ej.: Un lote de 100 terneros se parte en de 50 y 50 para viajar a campos distintos.
37. **Unir Tropa (`MERGE_COMPLETED`)**: Consolidación atómica de N animales en 1 solo `LotAsset`. (P. ej.: Lote Terneros 1 y Lote Terneros 2 ahora conforman el Lote Destete General). Hereda permanentemente los riesgos de ambos orígenes conjuntos.
38. **Faenar Lote vs Faena particular (`TRANSFORM`)**: La regla del vertical de livestock es que se cierra individualmente cada animal que entra al túnel de sangrado, generando `DerivedAssets` rastreables hasta ese único `EID` progenitor en caso de trazabilidad individual (Mercados muy premium EUDR).

## 7. Diccionario final simplificado

39. **Mnemonic**: 24 palabras criptográficas generadas por la WebCrypto API de Biffco al iniciar usuario. La única credencial de identidad humana.
40. **Trazabilidad 360 / Lineage (DAG Visualizer)**: Capacidad abstracta de mirar un corte de "Ojo de bife" (`DerivedAsset`), ver el Evento de Extracción (`SLAUGHTER_COMPLETED`), observar quién era el padre vivo (`AnimalAsset`), seguir los Movimientos Inter-establecimiento (`LOCATION_CHANGED`), ver el Polígono donde pastó (`Zone EUDR check`) y verificar que todos esos pasos tengan firmas `Ed25519` validables independientemente por auditoría externa.
