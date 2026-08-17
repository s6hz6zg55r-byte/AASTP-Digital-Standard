# AASTP Digital Engineering API — OpenAPI Schema Catalogue

| Attribute | Value |
|---|---|
| Document ID | AASTP-API-007 |
| Document status | Draft |
| Version | 0.1.0 |
| Applies to | Reusable OpenAPI 3.1 schemas for the AASTP Digital Engineering API |
| Owner | AASTP Digital Engineering Project |
| Last updated | 2026-08-16 |

---

## 1. Purpose

This document is the controlled catalogue of reusable OpenAPI schema components planned for the AASTP Digital Engineering API. It records each schema's public purpose, governing source, visibility, dependencies, lifecycle state and implementation notes before the schema is registered in `openapi/openapi.yaml`.

The catalogue provides governance and traceability. It does not define authoritative engineering rules, controlled engineering values, endpoint behaviour or implementation objects.

## 2. Scope

This catalogue applies to reusable schema files under `openapi/components/schemas/` and their registration in the root OpenAPI document. It covers:

- shared API primitives and provenance;
- public engineering resource representations;
- summaries and collection envelopes;
- engineering-resource selection and resolution representations;
- calculation requests and results; and
- public error representations.

Path items, parameters, response components and complete reusable examples are outside this catalogue except where they depend on a catalogued schema.

## 3. Relationship to the Governance Suite

This document is subordinate to the governing engineering and API documents. Where a conflict exists, the governing source identified below prevails and the discrepancy shall be resolved through controlled change.

| Governing document | Relationship |
|---|---|
| Master Document Index, AASTP-PROG-002 v0.1.0 | Governs document identity, lifecycle, ownership and the standard controlled-document structure. This catalogue is proposed for addition to section 6.5 of the index as `AASTP-API-007`. |
| API Contract, AASTP-API-001 v0.4.3 | Governs the approved public resources, selections, calculations, envelopes, metadata and behaviour represented by schemas. |
| API Design Principles, AASTP-API-003 v0.4.0 | Governs enduring resource orientation, explicit inputs, stable identifiers, traceability, compatibility and separation of public representations from internal implementation. |
| OpenAPI Schema Standard, AASTP-API-002 v0.4.0 | Governs modularity, naming, file layout, descriptions, examples, references, validation and schema compatibility. |
| Error Code Registry, AASTP-API-004 | Governs public error codes and meanings. Error schemas represent the registered contract and shall not create codes. |
| Authoritative JSON data and approved engineering models | Govern engineering identity, meaning, permissible values, relationships, applicability, resolution and calculation semantics. OpenAPI describes only their public representation. |

## 4. Catalogue Principles

1. Each schema shall represent one identifiable public engineering or API concept.
2. Each reusable schema shall be defined once, in one lower-camel-case YAML file, and registered once with a PascalCase component name.
3. Public schemas shall expose only the representation required by the approved API Contract.
4. Internal service context, resolver state, repository paths and implementation objects shall not become public merely because they exist in code or data files.
5. Stable identifiers, metadata, provenance and error structures shall be reused by reference.
6. Controlled engineering vocabularies shall not be copied into OpenAPI enums. Their values remain governed by the authoritative data release.
7. Examples shall illustrate structure without becoming a second source of engineering truth.
8. A catalogue entry at `Planned` or `Candidate` status does not approve its fields or authorise public exposure.

### 4.1 Governing source rule

The `Governing source` recorded for each schema identifies the authority that defines the concept's public meaning, public representation or authoritative engineering content.

Governing sources shall be recorded according to the following rules:

- the **API Contract** shall be cited where it defines the public resource,
  representation, relationship, request, response or behavioural requirement
  represented by the schema;
- an **engineering model or other controlled specification** shall be cited
  where it defines engineering meaning or behaviour represented by the schema;
- the applicable **authoritative dataset** shall be cited where it governs the
  engineering identity, values, relationships or applicability represented by
  the schema; and
- other normative governance documents shall be cited only where they directly
  govern the meaning of the schema concerned.

The OpenAPI Schema Standard applies to every schema and governs how schemas are structured, named, documented, referenced and validated. It shall not normally be repeated in individual `Governing source` entries because it does not define the engineering meaning or public contract of the individual concept.

The API Design Principles shall be cited where a schema directly implements a cross-version architectural rule, such as stable opaque identifiers, rather than being listed routinely for every schema.

Where several sources apply, the catalogue shall identify the minimum set necessary to establish clear traceability without duplicating general governance relationships already defined in Section 3.

## 5. Classification and Lifecycle

### 5.1 Visibility

| Status | Meaning |
|---|---|
| Public | Part of the published API contract and suitable for use by consumers. |
| Internal | Used only within implementation or validation and prohibited from the published OpenAPI contract. |
| To be determined | Public need or boundary has not yet been approved. |

### 5.2 Schema lifecycle

| Status | Meaning |
|---|---|
| Candidate | Concept identified but public need or boundary requires a governance decision. |
| Planned | Public need agreed; schema has not yet been drafted. |
| Draft | Schema exists or is being authored but has not completed review. |
| Review | Draft is ready for schema, contract and engineering review. |
| Baseline | Approved working schema under controlled change. |
| Deprecated | Supported temporarily with an identified replacement and migration period. |
| Superseded | Replaced and no longer used by the current contract. |

## 6. Reusable Schema Catalogue

Dependencies name component schemas, not files. Exact properties and required fields remain subject to contract-level review.

### 6.1 Common API and provenance schemas

| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `Identifier` / `identifier.yaml` | Represents a stable, opaque public resource identifier. | API Contract 7.1; API Design Principles 4.5 | Public | None | Review | Shall constrain representation only. Consumers shall not infer meaning from its format. |
| `ResponseMetadata` / `responseMetadata.yaml` | Identifies API version, authoritative data release, validation status, authentication status and response generation time. | API Contract 6.2–6.5 | Public | None, unless later-factored governed primitives are approved | Review | Common metadata contains `apiVersion`, `dataVersion`, `validationStatus`, `authenticationStatus` and `generatedAt`. Calculation-method provenance is added only to calculation responses. |
| `SourceReference` / `sourceReference.yaml` | Provides a structured public reference to authoritative source material associated with an engineering resource or governed engineering decision. | API Contract; API Design Principles 4.9; Error Code Registry; authoritative provenance data | Public | None | Review | Contains `standard`, `edition` and optional `reference`. Values must derive from governed provenance and must never be fabricated. |
| `ErrorResponse` / `errorResponse.yaml` | Provides the common public error envelope. | API Contract; Error Code Registry | Public | `ResponseMetadata`, `ErrorDetail` | Planned | Shall represent registered behaviour without defining new codes or endpoint-specific variants. |
| `ErrorDetail` / `errorDetail.yaml` | Represents one structured public error, including its registered code and consumer-safe diagnostic detail. | Error Code Registry | Public | Optional field-detail schema if approved | Planned | Error-code values are registry-controlled and shall not be duplicated as an independently maintained enum. |

### 6.2 Public engineering resource schemas
| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `StructureSummary` / `structureSummary.yaml` | Provides the deliberately narrower Structure representation used in collections or relationships. | API Contract resource model | Public | `Identifier` | Draft | Retain only if a distinct summary projection is justified; otherwise reuse `Structure` to avoid unnecessary variants. |
| `PotentialExplosionSiteTypeSummary` / `potentialExplosionSiteTypeSummary.yaml` | Provides the concise representation of a Potential Explosion Site Type used for collection and relationship contexts. | API Contract PES Type resource and collection provisions; authoritative PES Types dataset | Public | `Identifier` | Review | Contains resource identity, display information and Structure relationship only. Construction characteristics, notes and provenance remain on the complete PES Type representation. |
| `ExposedSiteTypeSummary` / `exposedSiteTypeSummary.yaml` | Provides the concise representation of an Exposed Site Type used for collection and relationship contexts. | API Contract Exposed Site Type resource and collection provisions; authoritative ES Types dataset | Public | `Identifier` | Review | Contains resource identity, display information and Structure relationship only. Construction, exposure, notes and provenance remain on the complete Exposed Site Type representation. |
| `HazardCategorySummary` / `hazardCategorySummary.yaml` | Provides a narrower Hazard Category representation for collections or relationships. | API Contract resource model | Public | `Identifier` | Planned | Retain only if justified by an approved response projection. |
| `EcmProtectionRatingSummary` / `ecmProtectionRatingSummary.yaml` |  |  | Public |  | Planned |  |


#### 6.2.1 Primary engineering resource schemas
| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `Structure` / `structure.yaml` | Represents a Structure used as the starting point for configuration-based PES and Exposed Site selection. | API Contract 7.3–7.7 and 8.2; authoritative Structures and Orientation Types datasets | Public | `Identifier`, `SupportedConstructionProperties`, `SupportedExposureProperties`, `OrientationType` | Review | Defines Structure-level construction/exposure applicability and the governing orientation type. It does not prescribe construction/exposure values or resolve a PES Type or Exposed Site Type. |
| `PotentialExplosionSiteType` / `potentialExplosionSiteType.yaml` | Represents an authoritative resolved Potential Explosion Site Type and its governed relationship to a Structure and applicable PES construction characteristics. | API Contract 7.1, 7.3–7.7 and 8.2; authoritative PES Types dataset | Public | `Identifier`, `PotentialExplosionSiteConstruction`, `SourceReference` | Review | Structure is represented by stable ID. Construction is a consistently shaped object; repository `null` construction is represented publicly as an empty object. Orientation is not part of the PES Type and remains governed by the associated Structure. |
| `ExposedSiteType` / `exposedSiteType.yaml` | Represents an authoritative resolved Exposed Site Type and its governed relationship to a Structure and applicable construction and exposure characteristics. | API Contract 7.1, 7.3–7.7 and 8.2; authoritative ES Types dataset | Public | `Identifier`, `ExposedSiteConstruction`, `ExposedSiteExposure`, `SourceReference` | Review | Structure is represented by stable ID. Construction is always represented as an object, with repository `null` normalised to `{}`. Exposure is either a complete category/level pair or `null`. Orientation remains governed by the associated Structure. |
| `HazardCategory` / `hazardCategory.yaml` | Represents the authoritative hazard-related resource encompassing Hazard Division and SsD. | API Contract 7.3; hazard-category dataset | Public | `Identifier`, `SourceReference` as required | Planned | Shall not introduce a separate OpenAPI-maintained hazard vocabulary. |
| `EcmProtectionRating` / `ecmProtectionRating.yaml` | Represents an independently identifiable ECM Protection Rating available for discovery and Structure-led engineering configuration. | API Contract resource model and ECM Protection Rating endpoint provisions; authoritative ECM Protection Ratings dataset | Public | `Identifier`, `SourceReference` | Review | Represents governed ECM protection-rating identity and description. Controlled rating values are derived from authoritative data and are not duplicated as OpenAPI enums. Public provenance is normalised through `SourceReference`. |

#### 6.2.2 Supporting public engineering resource schemas
| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `SupportedConstructionProperties` / `supportedConstructionProperties.yaml` | Identifies construction-property dimensions applicable to a Structure. | API Contract 7.3, 7.6 and 8.2; authoritative Structures dataset | Public | None | Review | Boolean indicators represent applicability only. Permitted construction values remain governed by authoritative data and are not duplicated in OpenAPI. |
| `SupportedExposureProperties` / `supportedExposureProperties.yaml` | Identifies exposure-property dimensions applicable to a Structure. | API Contract 7.3, 7.6 and 8.2; authoritative Structures dataset | Public | None | Review | Boolean indicators represent applicability only. Permitted exposure values remain governed by authoritative data and are not duplicated in OpenAPI. |
| `OrientationType` / `orientationType.yaml` | Represents the orientation classification associated with a Structure and the permitted values available for explicit orientation selection. | API Contract 7.3, 7.7 and 8.2; authoritative Orientation Types dataset | Public | `Identifier` | Review | Permitted orientation values are derived from the validated data release and are not duplicated as OpenAPI enums. |
| `PotentialExplosionSiteConstruction` / `potentialExplosionSiteConstruction.yaml` | Represents the governed construction characteristics associated with a Potential Explosion Site Type. | API Contract 7.3, 7.5–7.6 and 8.2; authoritative PES Types dataset | Public | None | Review | Contains only PES construction dimensions represented by authoritative PES definitions. Non-applicable properties are omitted from the public representation rather than exposed as repository `null` placeholders. Controlled engineering values remain authoritative in the validated data release. |
| `ExposedSiteConstruction` / `exposedSiteConstruction.yaml` | Represents the governed construction characteristics associated with an Exposed Site Type. | API Contract 7.3, 7.5–7.6 and 8.2; authoritative ES Types and ECM Protection Ratings datasets | Public | `Identifier` | Review | Contains only construction dimensions represented by authoritative ES definitions. `ecmProtectionRating` is a stable resource reference. Non-applicable properties are omitted rather than exposed as repository `null` placeholders. Controlled engineering values remain governed by authoritative data. |
| `ExposedSiteExposure` / `exposedSiteExposure.yaml` | Represents the governed exposure characteristics associated with an Exposed Site Type. | API Contract 7.3, 7.5–7.6 and 8.2; authoritative ES Types dataset | Public | None | Review | Exposure is represented as a complete `category` and `level` pair. Controlled engineering values remain governed by authoritative data and are not duplicated as OpenAPI enums. Absence of exposure is handled by the containing Exposed Site Type representation. |

### 6.3 Selection and resolution schemas

| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `PotentialExplosionSiteSelection` / `potentialExplosionSiteSelection.yaml` | Accepts exactly one direct PES Type ID or one complete Structure-led PES configuration. | API Contract 7.4–7.5 | Public | `Identifier`, `PotentialExplosionSiteConfiguration` | Planned | Mutual exclusivity should use explicit OpenAPI 3.1 composition and be validated by contract tests. |
| `ExposedSiteSelection` / `exposedSiteSelection.yaml` | Accepts exactly one direct Exposed Site Type ID or one complete Structure-led Exposed Site configuration. | API Contract 7.4–7.5 | Public | `Identifier`, `ExposedSiteConfiguration` | Planned | Must preserve the submitted representation; resolution output is separate. |
| `PotentialExplosionSiteConfiguration` / `potentialExplosionSiteConfiguration.yaml` | Represents a complete client-supplied Structure-led PES configuration. | API Contract 7.5–7.6; authoritative property semantics | Public | `Identifier`, approved PES construction representation | Planned | Includes only applicable selectable properties. It must not encode resource-resolution rules. |
| `ExposedSiteConfiguration` / `exposedSiteConfiguration.yaml` | Represents a complete client-supplied Structure-led Exposed Site configuration. | API Contract 7.5–7.6; authoritative property semantics | Public | `Identifier`, approved ES construction and exposure representations | Planned | Includes only applicable selectable properties. Informational and derived properties are not client selections unless explicitly approved. |
| `OrientationSelection` / `orientationSelection.yaml` | Represents the explicit orientation input validated against the selected Structure's orientation type. | API Contract 7.7 | Public | Structure or Structure ID relationship as approved | Planned | Shall not silently default or infer an orientation and shall not duplicate the authoritative value set. |
| `ResourceResolution` / `resourceResolution.yaml` | Reports the authoritative resource resolved from a client configuration and the governed resolution outcome. | API Contract 7.4 and 7.8 | Public | `Identifier`, optional governed resolution evidence | Planned | Represents exact, canonicalised, undefined or unresolved outcomes as governed by the contract; it does not expose resolver internals. |
| `ResolutionEvidence` / `resolutionEvidence.yaml` | Provides approved evidence when canonicalisation or another governed rule affects resolution. | API Contract; Engineering Resource Resolution Model | To be determined | `SourceReference` or stable rule reference as approved | Candidate | Public fields require a boundary decision. Internal rule-engine state is prohibited. |

### 6.4 Calculation schemas

| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `CalculationRequest` / `calculationRequest.yaml` | Represents a stateless calculation request using governed PES, Exposed Site, Hazard Category, orientation and one supported calculation input. | API Contract calculation request sections; Engineering Calculation Model | Public | PES/ES selections, `Identifier`, `OrientationSelection`, approved quantity schemas | Planned | The request must preserve client input and must not ask the client to choose calculation direction. |
| `CalculationResult` / `calculationResult.yaml` | Represents the governed engineering result, resolved resources and calculation provenance. | API Contract; Engineering Calculation Model | Public | `ResponseMetadata`, `ResourceResolution`, approved result quantity and provenance schemas | Planned | Prefer this governed term over the existing empty `calculationResponse.yaml` placeholder; the response envelope may remain a separate schema if required. |
| `EngineeringQuantity` / `engineeringQuantity.yaml` | Represents a value with unambiguous governed quantity and unit semantics where a shared value object is approved. | API Contract; Engineering Calculation Model; authoritative unit governance | To be determined | None | Candidate | Do not invent units or publish an OpenAPI enum of controlled units. Create only after the quantity representation is agreed. |

### 6.5 Collection and envelope schemas

| Component / file | Purpose | Governing source | Visibility | Dependencies | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| `StructureCollection` / `structureCollection.yaml` | Envelopes a collection of Structures or Structure summaries with response metadata. | API Contract response conventions | Public | `ResponseMetadata`, `Structure` or `StructureSummary` | Planned | Select full or summary item representation once; do not maintain parallel equivalent collections. |
| `PotentialExplosionSiteTypeCollection` / `potentialExplosionSiteTypeCollection.yaml` | Envelopes the concise public collection of Potential Explosion Site Types with common response metadata. | API Contract 8.1 and 9.3 | Public | `ResponseMetadata`, `PotentialExplosionSiteTypeSummary` | Review | The `data` array uses the approved PES Type summary projection. Full construction, notes and provenance are available from individual PES Type resources. Pagination and collection counts are outside the MVP contract. |
| `ExposedSiteTypeCollection` / `exposedSiteTypeCollection.yaml` | Envelopes the concise public collection of Exposed Site Types with common response metadata. | API Contract Exposed Site Type collection and successful-response provisions | Public | `ResponseMetadata`, `ExposedSiteTypeSummary` | Review | The `data` array uses the approved Exposed Site Type summary projection. Full construction, exposure, notes and provenance are available from individual Exposed Site Type resources. Pagination and collection counts are outside the MVP contract. |
| `HazardCategoryCollection` / `hazardCategoryCollection.yaml` | Envelopes a collection of Hazard Categories or summaries with response metadata. | API Contract response conventions | Public | `ResponseMetadata`, Hazard Category or summary | Planned | Item choice requires response-contract approval. |
| `EcmProtectionRatingCollection` / `ecmProtectionRatingCollection.yaml` |  |  | Public |  | Planned |  |

### 6.6 Internal concepts explicitly excluded from the public schema catalogue

| Internal concept | Status | Reason |
|---|---|---|
| Validated engineering context | Internal | It is a service boundary object, not a public representation. |
| Repository file/document layout | Internal | The API Contract prohibits coupling consumers to internal JSON layout or repository paths. |
| Interaction, distance, formula, constraint and transformation rule records | Internal for MVP | They are calculation implementation resources, not approved public discovery resources. |
| Resolver state and intermediate canonicalisation objects | Internal | Public output may expose governed resolution evidence, but not implementation state. |
| Validation engine objects and stack traces | Internal | Public failures use the governed error envelope and registered codes. |

## 7. Dependency and Authoring Order

Schemas should be reviewed and implemented in the following dependency order:

1. `Identifier`, `ResponseMetadata`, `sourceReference`, `ErrorDetail`, `ErrorResponse`.
2. Full public engineering resources and the `OrientationType` representation.
3. Any justified summary and collection schemas.
4. PES/Exposed Site configuration and selection schemas.
5. Orientation selection and public resource-resolution output.
6. Calculation request and result schemas.

This order does not approve the field content of a dependent schema. Each schema must still be reconciled with its governing sources before baseline.

## 8. Existing Artefact Disposition

The current repository contains a mixture of populated drafts, placeholders and earlier terminology. Recommended disposition is:

| Existing artefact | Assessment | Proposed action |
|---|---|---|
| `identifier.yaml` | Useful draft | Review constraints and description; retain if aligned with opaque-ID requirements. |
| `responseMetadata.yaml` | Useful draft with terminology risk | Reconcile `repositoryVersion` with the API Contract's `dataVersion` and required metadata fields. |
| `sourceReference.yaml` | Useful draft | Retain subject to traceability-field review against authoritative provenance data. |
| `structure.yaml` | Useful draft | Reconcile property naming and the orientation relationship with the current data model and API Contract. |
| `orientation.yaml` | Ambiguous earlier concept | Replace or rename only after confirming the approved `OrientationType` and `OrientationSelection` boundaries. |
| `exposedSiteConstruction.yaml`, `exposedSiteExposure.yaml` | Potential supporting schemas | Review against governed property semantics; do not embed controlled vocabularies. |
| Exposed Site Type and summary/collection drafts | Useful earlier drafts | Reconcile terminology, dependencies, metadata and filename casing. |
| Empty PES, Hazard Category and calculation files | Placeholders | Populate only after catalogue approval; empty files are not contract definitions. |
| `calculationResponse.yaml` | Empty and terminology not yet governed | Decide whether it is a response envelope or should be replaced by `calculationResult.yaml`. |

## 9. Review and Assurance Requirements

Before a schema moves to Baseline, reviewers shall confirm that:

- it has an approved public purpose and governing source;
- its fields match the API Contract and authoritative engineering model;
- it neither duplicates nor invents a controlled engineering vocabulary;
- its visibility boundary is correct;
- dependencies exist, are registered once and resolve consistently;
- YAML, OpenAPI 3.1 and JSON Schema validation succeeds;
- examples conform to the schema but are not treated as authoritative data;
- required properties and composition rules are contractually justified;
- compatibility impact is classified and controlled; and
- the catalogue entry and root OpenAPI registration are updated together.

Automated validation does not replace engineering, terminology or governance review.

## 10. Schema Template Review

### 10.1 Existing template assessment

The current `openapi/templates/schema.yaml` is close to the mandatory object-schema layout: it has the standard comment header, defines one unwrapped schema, and orders `type`, `description`, `properties` and `required` correctly.

It is not fully compliant as a reusable template for the following reasons:

| Finding | Consequence | Required correction |
|---|---|---|
| The title and purpose use the placeholder term `Filename entity`. | Encourages implementation-oriented or mechanically unreplaced wording rather than an identifiable engineering or API concept. | Use explicit replacement tokens and describe a schema concept, not necessarily an entity. |
| `format:` is present with an empty value. | Produces invalid or ambiguous schema content when copied without cleanup. | Omit optional keywords from the base template and add them only when applicable. |
| `default:` is present with an empty value. | May create unintended semantics and conflicts with the rule that additional keywords are used only when required. | Omit it. A default must never imply an engineering value unless explicitly governed. |
| A blank mapping entry appears below `properties:`. | Creates avoidable YAML ambiguity and poor copy discipline. | Remove it. |
| The property description repeats the generic schema wording. | Does not satisfy the requirement to explain what the property represents. | Provide a property-specific replacement prompt. |
| The example is generic and capitalised as display text. | It may not conform to the final type, format or constraints. | Require a valid, representative, non-authoritative value. |
| The template does not warn authors about controlled vocabularies. | Authors may introduce OpenAPI enums or defaults that duplicate engineering authority. | Add concise authoring comments that are removed or resolved before approval. |

### 10.2 Proposed compliant template

The proposed replacement is maintained alongside this draft as `schema-template.proposed.yaml`. It intentionally contains only mandatory baseline keywords. Optional keywords such as `format`, numeric constraints, composition, `enum` and `default` shall be added only when justified by the governed concept.

## 11. Responsibilities

| Responsibility | Accountable role |
|---|---|
| Maintain this catalogue and coordinate MDI updates | API governance owner |
| Approve public schema boundaries | API contract owner with relevant engineering and architecture owners |
| Confirm engineering meaning and authoritative source | Engineering/data owner |
| Confirm OpenAPI Schema Standard conformance | OpenAPI maintainer/reviewer |
| Assess compatibility and migration | API change authority |
| Validate schema assembly and examples | API implementation and assurance maintainers |

Named authorities may be assigned when formal programme governance is established. Until then, the AASTP Digital Engineering Project retains accountability.

## 12. Risks

| Risk | Control |
|---|---|
| OpenAPI becomes a second engineering authority | Reference authoritative data and models; prohibit duplicated controlled vocabularies and invented semantics. |
| Draft implementation objects become accidental public contracts | Require an approved visibility and purpose in this catalogue before root registration. |
| Too many summary or envelope variants create duplication | Require a material public-contract justification for each distinct projection. |
| Schema and API Contract diverge | Review catalogue, schemas and root registration as one controlled change. |
| Direct and configuration-based selections become ambiguous | Use explicit, mutually exclusive schema composition and contract tests. |
| Renames break external references | Apply compatibility review, deprecation and migration controls before changing published components. |

## 13. Future Extension Points

Future controlled revisions may add:

- pagination, filtering and links schemas;
- multilingual public representations;
- national profiles and controlled extensions;
- approved quantity and unit value objects;
- deprecation and lifecycle metadata;
- schemas for future AASTP chapters and engineering domains; and
- machine-readable catalogue data after the governance fields stabilise.

These are candidates only and do not form part of the current public contract until approved through governed change.

## 14. Version History

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-08-16 | Draft | Initial governed schema catalogue and review of the existing OpenAPI schema template. |
