# AASTP Digital Standard — Architecture

**Version:** 0.5
**Status:** Governance baseline  
**Applies to:** AASTP data, validation, API, client, and repository implementations

## 1. Mission and architectural purpose

The AASTP Project provides an open, traceable, and standards-compliant digital implementation of AASTP explosive-safety regulations. It separates the authoritative knowledge base from the software that consumes it so that governments, software developers, and standards custodians can build interoperable applications from a common, authoritative source of truth.

The architecture is designed for independent evolution of data, validation, engineering services, APIs, and clients while maintaining clear responsibility boundaries. Every component and file must have one obvious home; a component must not duplicate knowledge or responsibility owned elsewhere.

## 2. Repository structure

```text
AASTP-PROJECT/
│
├── README.md
├── docs/
│
├── aastp-api/
├── aastp-data/
└── aastp-demo/
```

The three projects are independent but related components. `aastp-data` is the authoritative digital knowledge base; `aastp-api` and `aastp-demo` are consumers of that knowledge through defined interfaces.

## 3. Architectural layers

The following logical flow applies to runtime consumers and engineering services:

```text
Knowledge Layer
        ↓
JSON Repository
        ↓
Repository Layer
        ↓
Engineering Services
        ↓
REST API
        ↓
Client Applications
```

- **Knowledge Layer** provides the approved narrative source, interpretation context, and traceability needed to maintain the digital standard.
- **JSON Repository** is the authoritative structured data layer: version-controlled JSON datasets, schemas, and associated release metadata.
- **Repository Layer** is the sole programmatic abstraction over the physical JSON repository.
- **Engineering Services** contain approved engineering evaluation and composition logic. They consume repository data but do not know its storage layout.
- **REST API** exposes stable, versioned, resource-oriented interfaces for consumers.
- **Client Applications** consume API contracts and must not implement independent copies of AASTP engineering knowledge.

Validation operates across these layers as an assurance capability. It validates syntax and structure, dataset semantics, and release/integration readiness without becoming an alternative data source or an engineering service.

## 4. Component responsibilities

### 4.1 `aastp-data`

`aastp-data` is the authoritative implementation of the AASTP digital knowledge base. It contains:

- JSON datasets;
- JSON Schemas;
- traceability information and data documentation;
- standards implementation guidance;
- validation tools and validation rules; and
- the Repository Layer and repository utilities that provide controlled access to the physical JSON repository.

It must not contain engineering application logic, REST interfaces, or client-specific behaviour. The Repository Layer is data infrastructure: it abstracts repository storage and lookup; it does not evaluate engineering rules.

### 4.2 `aastp-api`

`aastp-api` provides a REST interface to the knowledge exposed by `aastp-data`. It contains:

- API source code and route definitions;
- Engineering Services, including approved rule and formula evaluation;
- API documentation and OpenAPI specifications;
- automated API and integration tests; and
- deployment and operational configuration.

The API consumes the Repository Layer and must not access JSON files directly or keep a duplicated copy of the knowledge base.

### 4.3 `aastp-demo`

`aastp-demo` provides reference client applications showing how external software can interact with the API. It is an example consumer only and must not implement independent business logic, repository access, or copies of API engineering logic.

## 5. Repository Layer responsibility

### 5.1 Purpose

The Repository Layer provides the sole abstraction between the physical JSON repository and all consuming services. Consumers of repository data interact only with the Repository Layer and remain independent of the physical structure of the underlying JSON files.

The Repository Layer owns all knowledge of:

- JSON file locations;
- JSON collection names;
- repository loading and caching;
- repository queries; and
- dataset lookup.

Consumers must not access JSON files directly. This applies to Engineering Services, API handlers, validators that require loaded datasets, and future service or integration components.

### 5.2 Namespace separation

The Repository Layer deliberately separates the Service Layer namespace from the physical JSON Data Layer namespace.

| Namespace | Convention | Examples | Status |
| --- | --- | --- | --- |
| Service / Repository API | `camelCase` dataset identifiers | `distanceRules`, `hazardCategories`, `orientationTypes`, `protectionLevels` | Stable public repository contract |
| JSON Data Layer | `snake_case` file and collection names | `distance_rules`, `hazard_categories`, `orientation_types`, `protection_levels` | Repository implementation detail |

The Repository Layer is solely responsible for mapping these identifiers. A consumer must never require knowledge of JSON filenames, collection names, repository layout, or the underlying storage implementation. Consequently, a repository reorganisation can be made without changing validators, Engineering Services, API contracts, or client applications, provided the Repository API remains compatible.

### 5.3 Repository API

Consumers use the Repository API rather than implementing their own data loading or lookup logic. Typical operations include:

- `getCollection()`;
- `findById()`; and
- `findInteraction()`.

The exact API contract must be documented, versioned where external consumers rely on it, and tested for compatibility. New query methods belong in the Repository Layer only when they express repository retrieval; engineering interpretation belongs in Engineering Services.

### 5.4 Repository utilities

Repository utilities support generic, domain-neutral repository operations. Examples include `buildIdSet()` and `buildIdMap()`.

These utilities may be reused by the Repository Layer, Validation Framework, Engineering Services, and future API components. They must not contain validation policy or engineering judgement. Validation-specific helpers—such as diagnostic creation, rule evaluation, and result aggregation—belong to validation utilities, not repository utilities.

## 6. Dependency rules

Dependencies flow in one direction only:

```text
aastp-data
      │
      ▼
aastp-api
      │
      ▼
aastp-demo
```

The following rules apply:

- `aastp-data` has no dependency on `aastp-api` or `aastp-demo`.
- `aastp-api` depends on the published data and Repository Layer interfaces in `aastp-data`.
- `aastp-demo` depends on the versioned REST API, not on the data repository or Repository Layer.
- Circular dependencies are prohibited.
- Dependencies on physical JSON paths or collection names outside `aastp-data` are prohibited.

This keeps the knowledge base independent of application technology and keeps repository implementation details from leaking into higher layers.

## 7. Validation and release architecture

Validation is governed independently from repository access and Engineering Services:

- Layer 1 validates document and JSON syntax.
- Layer 2 validates schema and structural integrity.
- Layer 3 validates approved dataset semantic relationships.
- Layer 4 validates release and integration assurance.

Validators may consume datasets through the Repository Layer, but must not own physical repository knowledge or mutate authoritative data. Repository utilities remain generic; validation utilities own `ValidationResult` creation, diagnostic reporting, rule evaluation, and aggregate result production.

Only a release that has retained validation evidence, traceability, compatibility evidence, and authorised approval may be published through the API distribution process. This establishes a clear boundary between a working repository change and an accepted digital-standard release.

## 8. Documentation structure

Documentation is maintained alongside the component it describes.

| Location | Purpose |
| --- | --- |
| `README.md` | Project overview and navigation |
| `docs/` | Project-wide architecture, roadmap, and governance |
| `aastp-api/docs/` | API documentation, OpenAPI specification, deployment, and operational guidance |
| `aastp-data/docs/` | Data model, Repository API, schema documentation, validation rules, and standards maintenance |
| `aastp-demo/README.md` | Demonstrator setup and usage |

## 9. Naming conventions

| Layer | Convention | Examples |
| --- | --- | --- |
| JSON data | `snake_case` | `interaction_rules`, `distance_rule`, `hazard_category` |
| Service and Repository API | `camelCase` | `interactionRules`, `distanceRule`, `hazardCategory` |
| JavaScript variables and functions | `camelCase` | `findById`, `buildIdMap` |
| Classes | `PascalCase` | `InteractionService`, `AssessmentResolver` |
| REST endpoints | `kebab-case` | `/distance-rules`, `/hazard-categories` |
| JSON IDs | Uppercase prefixes and numeric suffixes | `INT001`, `DR003`, `HC002` |

Naming is part of the interoperability contract. Changes to an established public identifier must be assessed for compatibility and documented with a migration path where appropriate.

## 10. Architectural principles

1. **Single Source of Truth** — Every dataset, schema, validator, and rule representation has one authoritative location.
2. **Separation of Responsibilities** — Data, repository access, validation, engineering logic, API delivery, and user interfaces have distinct responsibilities.
3. **Stable Public Interfaces** — Components communicate through defined interfaces; internal repository implementation details do not cross boundaries.
4. **Explicit Data over Implicit Behaviour** — JSON data and approved schemas express the standard; application code must not conceal data rules or duplicate knowledge.
5. **Documentation Lives with the Code** — Documentation is maintained and versioned with the component it describes.
6. **Extensibility** — The architecture supports future AASTP editions, chapters, APIs, clients, and integrations without major reorganisation.
7. **Maintainability and Compatibility** — Changes are deliberate, documented, tested, and compatible where practical. Breaking changes require a governed transition.
8. **Traceable Releases** — Published data and API releases retain traceability, validation evidence, and approval records.

# Things to incorporate into this governance document in the future
## Governance note
I think this is a good concise note to add to your governance documentation for later expansion.
Repository Categories
### Simple Repositories
- Contain governed engineering reference data.
- Minimal internal logic.
- Schema validation focuses on structure and mandatory properties.
- Repository validation focuses on uniqueness, controlled vocabulary and engineering definitions.
- Examples include Transformations, Hazards, Protection Levels, Constraints, ES Types and PES Types.
### Engineering Repositories
- Contain engineering decision logic or calculation behaviour.
- Often require conditional schema validation.
- Repository validation focuses on engineering consistency, relationships and completeness.
- Examples include Distance Rules, Formulas and Interactions.
### Engineering Principle
Repository complexity should reflect engineering complexity. Simple reference repositories should remain structurally simple, while engineering repositories should explicitly model engineering behaviour and decision logic.