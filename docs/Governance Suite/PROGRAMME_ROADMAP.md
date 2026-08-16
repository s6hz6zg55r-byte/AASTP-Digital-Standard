# AASTP Digital Engineering Platform — Programme Roadmap

**Document status:** Living programme-management document  
**Version:** 2.1  
**Purpose:** Single source of truth for delivery planning, milestone tracking and major programme decisions.

---

## 1. Project Vision

Transform AASTP-1 Chapter 1 from static publication tables into a governed digital engineering platform. The platform will maintain authoritative, validated and interoperable data; expose it through a predictable standards-based REST API; and support web, mobile, document-generation and external engineering consumers.

The programme is intended to demonstrate a sustainable digital-standard model suitable for international governance and eventual adoption by AC/326. It does not replace engineering authority with software: it makes the approved engineering information transparent, traceable, reusable and easier to assure.

---

## 2. Programme Objectives

### September objective — online demonstrator

Deliver a fully operational online demonstrator that exposes validated AASTP engineering data through a versioned REST API, with OpenAPI documentation and representative web, mobile and engineering-tool consumption. The demonstrator will support the AASTP-1 Sub-Group presentation.

### December objective — governance and adoption case

Present a complete governance model that demonstrates the sustainability, maintainability, assurance and extensibility of a digital AASTP standard suitable for international adoption by AC/326.

---

## 3. Current Programme Status

### Delivery dashboard

| Programme area | Status | Evidence / current position |
|---|---:|---|
| Foundation and repository architecture | ✅ Complete | Structured repository and repository-service approach established. |
| Digital knowledge base | 🔄 In progress | Narrative knowledge remains an evolving layer. |
| Engineering core | ✅ Complete | MVP service pipeline established from validation and governed resource resolution through interaction resolution and engineering assessment. |
| Validation and quality assurance | 🔄 In progress | Validation reporting is complete and service integration suites pass; API conformance and wider assurance remain planned. |
| Phase 5 — Demonstrator | 🔄 In progress | Service-layer baseline complete. Governing-document reconciliation and OpenAPI contract completion are now the critical path. |
| Governance and standardisation | ⬜ Not started | December governance package and adoption case pending. |

### Current focus

| Field | Value |
|---|---|
| Current milestone | 5.2 — Define the Public API |
| Immediate delivery priority | Baseline API Contract v0.4.0, reconcile the API governance suite against it, then complete the modular OpenAPI 3.1 specification. |
| Next critical-path decision | Confirm the reconciled API governance suite as the governance baseline for OpenAPI completion. |
| Status legend | ✅ Complete · ◐ Partially complete · 🔄 In progress · ⬜ Not started · ⏸ Deferred |

**Critical-path rule:** Work that does not directly support completion of Milestone 5.2, REST implementation, online deployment or the September demonstrator should normally be deferred unless it removes an immediate delivery risk.

> Update this dashboard and the status column in each task table at the end of a working session. A checked item should have objective evidence: a reviewed document, merged implementation, passing test suite or deployed service.

#### Milestone 5.1 — Validation Reporting and Presentation Framework

Status: Complete

Outcome: Established a controlled reporting framework capable of generating consistent JSON, Markdown and PDF validation outputs from the authoritative validation report model.

Key achievements:
- Validation report model established.
- Presentation framework implemented.
- Document presentation standard established.
- Reusable rendering components developed.
- Markdown and PDF renderers validated as independent consumers.
- Table rendering capability established.
- Cross-format consistency verified between JSON, Markdown and PDF outputs.

Future enhancements are deferred to the Presentation Framework Version 2.0 backlog.

#### Service-layer baseline — enabling work for Milestones 5.2 and 5.3

Status: Complete for the current MVP requirement

Outcome: Established a single validation and assessment pipeline in which a PES or Exposed Site may be supplied by authoritative ID or by a complete Structure-led engineering configuration. Configuration inputs are resolved to authoritative resources during validation before interaction resolution and engineering assessment.

Key achievements:
- Resource-property semantics established to distinguish selectable, informational and derived properties.
- Resource-resolution validation implemented for direct-ID and configuration-based PES/ES selections.
- Service-layer resource resolution implemented with Structure-scoped exact matching and governed canonicalisation rules.
- `validationService` integrated with resource resolution, while preserving the original client request.
- Resolution evidence and authoritative resolved entities carried in the validated context.
- Assessment/engineering pipeline integrated so downstream services consume the same authoritative PES/ES representation regardless of input route.
- Direct-ID compatibility, configuration matching, governed canonicalisation, invalid-configuration rejection, forward/reverse calculation and request immutability covered by passing tests.
- Reported passing suites include `validationService` (36/36), `resourceResolver` (16/16) and `engineeringService` integration (31/31), together with the subsequently confirmed overall service-pipeline integration.

Known limitation:
- Orientation-data limitations remain a governed source-data issue for AC/326 and future scenario selection. No unsupported orientation rule is introduced by this roadmap.

---

## 4. Architecture Overview

```text
Knowledge Layer
        │
        ▼
Authoritative JSON Data Layer
        │
        ▼
Validation and Engineering Assurance
        │
        ├─────────────────────┐
        ▼                     ▼
Document Generation       Versioned REST API
        │                     │
        ▼                     ▼
Governed Publications   Web · Mobile · Excel · Power BI · External Systems
```

### Architectural responsibilities

| Layer | Responsibility |
|---|---|
| Knowledge layer | Preserves narrative context, interpretation and source references. |
| JSON data layer | Holds authoritative structured data with stable identifiers and human-readable names. |
| Validation layer | Tests request and repository integrity, resolves governed resource selections and prevents invalid contexts reaching engineering processing. |
| Engineering assurance | Provides evidence, scenarios, regression controls and governed reports. |
| REST API | Exposes versioned, stateless and resource-oriented capability. |
| Client applications | Consume the API without becoming alternate sources of engineering truth. |

---

## 5. Programme Principles

1. **JSON is the single source of truth.** Generated documents and applications are consumers, never competing authorities.
2. **Clarity over cleverness.** Use explicit structures, stable identifiers and predictable interfaces.
3. **Separate data from application logic.** Keep knowledge, engineering data, validation, presentation and delivery concerns distinct.
4. **Validation is non-negotiable.** New capabilities must retain or strengthen evidence of correctness.
5. **Prefer references to duplication.** Reuse canonical objects and identifiers rather than copying data.
6. **Design for future chapters and national tailoring.** Extend through governed profiles and references, not ad hoc forks.
7. **Backwards compatibility where practical.** Version APIs and data deliberately; record material changes.
8. **Renderer independence.** A document model and presentation standard should support more than one output format.
9. **Open, interoperable delivery.** REST, OpenAPI and documented schemas are the default integration mechanisms.
10. **Governance is a product capability.** Decisions, changes, provenance and assurance must be understandable to future contributors and standards bodies.

---

## 6. Delivery Timeline

| Period | Primary outcome | Key delivery markers |
|---|---|---|
| August | Validation reporting baseline | Reporting outputs stable; presentation framework established. |
| Early September | API contract | Governing documents reconciled; request, response, resource and error schemas agreed in OpenAPI 3.1. |
| Mid September | Online demonstrator | Conformant API and interactive documentation deployed and verified. |
| Second-last week of September | AASTP-1 Sub-Group presentation | Demonstration scenarios and supporting material ready. |
| October | Consumer capability | Web, mobile and engineering-tool integrations mature. |
| November | Governance package | Maintenance, assurance, release and tailoring model prepared. |
| First week of December | AC/326 presentation | Adoption case and governance demonstration complete. |

Dates are programme targets, not commitments to change controlled engineering content without review.

---

## 7. Milestone Roadmap

| Milestone | Outcome | Status | Target |
|---|---|---:|---|
| 5.1 | Complete validation reporting | ✅ Complete | Late August |
| 5.2 | Reconcile and agree the API contract | 🔄 In progress | Early September |
| 5.3 | Implement and test the API | ⬜ Not started | Early–mid September |
| 5.4 | Publish the online demonstrator | ⬜ Not started | Mid September |
| 5.5 | Demonstrate client consumption | ⬜ Not started | September–October |

---

## 8. Detailed Task Breakdown

### Milestone 5.1 — Complete Validation Reporting

**Objective:** Complete a governed validation-reporting capability in which validated engineering evidence can be rendered consistently from the presentation framework.

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [x] | Implement PDF and Markdown renderers using the Presentation Component Framework | ✅ Complete | Independent consumers of the validation report model. |
| [x] | Apply the Document Presentation Standard | ✅ Complete | Version 1.0 baseline established. |
| [x] | Validate consistency between JSON, Markdown and PDF outputs | ✅ Complete | Cross-format consistency verified. |
| [x] | Lock Presentation Framework Version 1.0 | ✅ Complete | Enhancements moved to the Version 2.0 backlog. |

### Milestone 5.2 — Define the Public API

**Objective:** Reconcile the governing documents with proven service behaviour and define a stable, versioned and documented public contract before REST implementation.

#### Completed service-layer foundation

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [x] | Establish resource-property semantics | ✅ Complete | Selectable, informational and derived roles support governed Structure-led selection. |
| [x] | Implement and validate resource resolution | ✅ Complete | Direct IDs, exact configuration matches and governed canonicalisation supported. |
| [x] | Integrate resource resolution with `validationService` | ✅ Complete | Invalid or unresolved selections stop before interaction processing. |
| [x] | Integrate the assessment/engineering pipeline | ✅ Complete | Authoritative resolved resources feed interaction and engineering services. |
| [x] | Confirm service integration tests pass | ✅ Complete | Passing suites and overall pipeline integration confirmed in the project record. |

#### Work package 1 — API Contract v0.4.0 baseline

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [x] | Reconcile API Contract with completed service architecture | ✅ Complete | Structure-led selection, validation-stage resolution and Engineering Service architecture captured. |
| [x] | Formalise hybrid PES/ES selection | ✅ Complete | Direct-ID/configuration XOR defined independently for PES and ES. |
| [x] | Define common response metadata and envelope | ✅ Complete | Includes `apiVersion`, `dataVersion`, `validationStatus`, `authenticationStatus` and `generatedAt`. |
| [x] | Define public resource contracts | ✅ Complete | Structure, PES Type, ES Type and Hazard Category contracts established. |
| [x] | Define calculation-service contract | ✅ Complete | Input-led calculation, orientation, hazard selection and resource resolution defined. |
| [x] | Define request immutability and resolution principles | ✅ Complete | Original request preserved; authoritative resolution represented separately. |
| [x] | Establish security and release-assurance boundaries | ✅ Complete | Validation and release authentication explicitly separated. |
| [x] | Define future extension boundaries | ✅ Complete | Additional content, localisation, offline operation and national tailoring covered. |
| [x] | Baseline API Contract v0.4.0 | ✅ Complete | Content review complete and accepted as the governing human-readable input to API governance reconciliation and OpenAPI completion. |

#### Work package 2 — API Governance Suite reconciliation

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Reconcile API Design Principles with API Contract v0.4.0 | ⬜ Not started | Remove obsolete assumptions and align terminology and architectural principles. |
| [ ] | Reconcile Error Code Registry with API Contract v0.4.0 | ⬜ Not started | **Already identified as required follow-on action.** Include resource resolution, applicability, authentication and common metadata behaviour. |
| [ ] | Establish API Change Management Framework | ⬜ Not started | Define proposal, classification, impact assessment, approval, implementation, verification and release process. |
| [ ] | Confirm normative-document responsibilities | ⬜ Not started | Ensure API Contract, OpenAPI, Design Principles, Error Code Registry and Change Management Framework have non-overlapping authorities. |
| [ ] | Confirm governance suite consistency | ⬜ Not started | No unresolved contradictions before OpenAPI baseline is completed. |

#### Work package 3 — OpenAPI schema reconciliation
**Objective:** Translate the approved API Contract into complete, reusable OpenAPI 3.1 schemas without introducing new engineering semantics. 

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Reconcile common response metadata schema | ⬜ Not started | Include `apiVersion`, `dataVersion`, `validationStatus`, `authenticationStatus` and `generatedAt`; calculation metadata additionally includes `calculationMethodVersion`. |
| [ ] | Complete Structure public schemas | ⬜ Not started | Represent the approved Structure entity and summary contracts; Structure remains the entry point for configuration-based selection. |
| [ ] | Complete PES Type public schemas | ⬜ Not started | Represent the approved resolved PES Type entity and summary contracts without redefining Structure-level applicability. |
| [ ] | Complete Exposed Site Type public schemas | ⬜ Not started | Represent the approved resolved ES Type entity and summary contracts without redefining Structure-level applicability. |
| [ ] | Complete Hazard Category public schemas | ⬜ Not started | Preserve authoritative hazard identifiers and approved public engineering representation. |
| [ ] | Define PES and ES configuration schemas | ⬜ Not started | Use Structure-led construction/exposure vocabulary required for resource resolution; do not expose internal resolver objects. |
| [ ] | Define PES and ES selection schemas | ⬜ Not started | Encode exactly one direct-ID or complete configuration selection independently for PES and ES using OpenAPI-compatible XOR constraints. |
| [ ] | Define orientation representation | ⬜ Not started | Preserve orientation as a separate request concern governed by Structure; do not introduce unsupported rules to resolve known source-data limitations. |
| [ ] | Define calculation-input schema | ⬜ Not started | Encode the approved input-led forward/reverse model. |
| [ ] | Resolve calculation-input representation and unit semantics | ⬜ Not started | Explicitly determine the public representation and governed units for quantities such as NEQ and distance before implementation. |
| [ ] | Define calculation-request schema | ⬜ Not started | Combine PES selection, ES selection, orientations, hazard category and exactly one authoritative calculation input. |
| [ ] | Define calculation-result schema | ⬜ Not started | Expose stable engineering outputs defined by the approved calculation contract rather than internal Engineering Service context. |
| [ ] | Define resource-resolution evidence schemas | ⬜ Not started | Represent authoritative resolved resources and governed exact-match/canonicalisation evidence at the level required by the public contract. |
| [ ] | Normalise public source-reference representation | ⬜ Not started | Establish one governed OpenAPI representation for authoritative source references used by public engineering resources. |
| [ ] | Reconcile common error schemas with Error Code Registry | ⬜ Not started | OpenAPI error representations must consume the reconciled registry rather than independently defining error semantics. |
| [ ] | Add governed valid and invalid examples | ⬜ Not started | Examples must use combinations verified against authoritative repository data and cover both selection routes. |
| [ ] | Confirm schemas expose no repository or implementation-specific state | ⬜ Not started | Public representations must remain independent of repository layout, resolver state and internal service context. |

#### Work package 4 — OpenAPI endpoint and specification completion
**Objective:** Assemble the approved schemas into the complete modular OpenAPI 3.1 specificaton defining every MVP public operation.

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Complete `GET /structures` | ⬜ Not started | Return validated Structure summary resources using the common collection envelope. |
| [ ] | Complete `GET /structures/{structureId}` | ⬜ Not started | Return the approved complete Structure public representation. |
| [ ] | Complete `GET /pes-types` | ⬜ Not started | Return validated PES Type summaries using the common collection envelope. |
| [ ] | Complete `GET /pes-types/{pesTypeId}` | ⬜ Not started | Return the approved complete PES Type representation. |
| [ ] | Complete `GET /es-types` | ⬜ Not started | Return validated ES Type summaries using the common collection envelope. |
| [ ] | Complete `GET /es-types/{esTypeId}` | ⬜ Not started | Return the approved complete Exposed Site Type representation. |
| [ ] | Complete `GET /hazard-categories` | ⬜ Not started | Return validated Hazard Category summaries using the common collection envelope. |
| [ ] | Complete `GET /hazard-categories/{hazardCategoryId}` | ⬜ Not started | Return the approved complete Hazard Category representation. |
| [ ] | Complete `POST /calculations` | ⬜ Not started | Implement the approved hybrid PES/ES selection, orientation, hazard and input-led calculation contract in OpenAPI. |
| [ ] | Apply governed successful-response envelopes to all operations | ⬜ Not started | Collection, individual-resource and calculation operations use the common contract consistently. |
| [ ] | Apply governed error responses to all operations | ⬜ Not started | HTTP status and stable application error behaviour must align with the Error Code Registry. |
| [ ] | Register reusable schemas, parameters, responses and examples | ⬜ Not started | Avoid duplication across modular path and component files. |
| [ ] | Register all modular paths and components from `openapi.yaml` | ⬜ Not started | Root specification remains the controlled assembly and entry point. |
| [ ] | Confirm MVP scope excludes unapproved convenience operations | ⬜ Not started | Do not add filtering, searching, resolution endpoints or other capabilities unless required by the approved contract. |
| [ ] | Generate and inspect interactive API documentation | ⬜ Not started | Documentation must be generated from the specification rather than independently maintained. |
| [ ] | Perform API Contract-to-OpenAPI traceability review | ⬜ Not started | Every normative MVP operation and public representation in API Contract v0.4.0 must have a corresponding OpenAPI definition. |

#### Work package 5 — OpenAPI and Engineering Service conformance
**Objective:** Demonstrate that API Contract v0.4.0, the normative API governance suite, OpenAPI 3.1 specification and proven Engineering Service behaviour describe the same public interface before REST implementation begins.

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Validate the complete OpenAPI 3.1 specification | ⬜ Not started | Resolve all references and eliminate schema, operation and structural validation errors. |
| [ ] | Validate governed request examples against OpenAPI schemas | ⬜ Not started | Valid examples must validate; deliberately invalid examples must fail for the documented reason. |
| [ ] | Execute direct-ID calculation examples through the Engineering Service | ⬜ Not started | Confirm documented public requests produce the expected authoritative resource and engineering outcomes. |
| [ ] | Execute exact configuration-selection examples through the Engineering Service | ⬜ Not started | Confirm Structure-led exact matches resolve and process as documented. |
| [ ] | Execute governed canonicalisation examples through the Engineering Service | ⬜ Not started | Confirm applicable Resource Resolution Rules produce the documented authoritative resource and evidence. |
| [ ] | Test undefined and unresolved configuration paths | ⬜ Not started | Confirm invalid resource configurations are rejected before interaction and engineering processing. |
| [ ] | Test forward calculation examples | ⬜ Not started | Confirm input-led direction and documented result representation. |
| [ ] | Test reverse calculation examples | ⬜ Not started | Confirm input-led direction and documented result representation. |
| [ ] | Validate Engineering Service outputs against OpenAPI response schemas | ⬜ Not started | Public mapping must conform without serialising internal service context directly. |
| [ ] | Verify resource-resolution evidence against the approved public schema | ⬜ Not started | Exact-match and canonicalisation provenance must be stable and governed. |
| [ ] | Verify metadata and assurance-state behaviour | ⬜ Not started | Confirm `validationStatus`, MVP `authenticationStatus`, versions and timestamps are represented as specified. |
| [ ] | Verify governed error behaviour | ⬜ Not started | Test representative validation, reference, resolution, not-found and processing failures against the Error Code Registry and OpenAPI. |
| [ ] | Confirm request immutability across representative calculations | ⬜ Not started | Public processing must preserve the submitted request while carrying resolved resources separately. |
| [ ] | Perform governance-suite consistency review | ⬜ Not started | API Contract, OpenAPI, API Design Principles, Error Code Registry and Change Management Framework must contain no unresolved normative contradiction. |
| [ ] | Record known source-data limitations without API workarounds | ⬜ Not started | In particular, retain the known orientation limitation as an engineering-source issue rather than inventing API behaviour. |
| [ ] | Complete Milestone 5.2 acceptance review | ⬜ Not started | Assess the completed work against API Contract Section 14.6. |
| [ ] | Approve OpenAPI as the Milestone 5.3 REST implementation contract | ⬜ Not started | Formal Milestone 5.2 exit and Milestone 5.3 entry criterion. |

### Milestone 5.3 — API Implementation

**Objective:** Deliver a tested REST API that faithfully exposes the approved contract and completed service-layer capability.

#### Existing service foundation

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [x] | Implement repository service layer | ✅ Complete | Authoritative data access is routed through the repository service. |
| [x] | Implement engineering resolver services | ✅ Complete | Includes governed resource, interaction and assessment resolution. |
| [x] | Implement service-layer validation | ✅ Complete | `validationService` validates and resolves requests before downstream processing. |
| [x] | Implement engineering calculation service | ✅ Complete | Existing forward/reverse engineering pipeline retained with passing integration tests. |

#### API implementation and testing work package

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Implement modular repository browsing endpoints | ⬜ Not started | Structures, PES Types, ES Types and Hazard Categories. |
| [ ] | Implement `POST /calculations` against the Engineering Service boundary | ⬜ Not started | Support the approved hybrid request contract. |
| [ ] | Implement agreed metadata, health and common error behaviour | ⬜ Not started | Scope governed by the approved contract. |
| [ ] | Test repository browsing and individual-resource endpoints | ⬜ Not started | Verify traceability to authoritative JSON. |
| [ ] | Test calculation success and failure paths | ⬜ Not started | Cover both selection routes and resolution evidence. |
| [ ] | Complete API integration and regression testing | ⬜ Not started | Include OpenAPI/service conformance in the release gate. |

### Milestone 5.4 — Online Demonstrator

**Objective:** Make the API and its documentation securely accessible online for the September demonstration.

#### Deployment work package

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Select hosting platform | ⬜ Not started | |
| [ ] | Configure deployment pipeline and production environment | ⬜ Not started | Repeatable deployment required. |
| [ ] | Configure HTTPS, logging and proportionate monitoring | ⬜ Not started | Demonstrator operational baseline. |
| [ ] | Deploy REST API and OpenAPI documentation | ⬜ Not started | Same approved contract and implementation. |
| [ ] | Verify online functionality and publish demonstrator URL | ⬜ Not started | Evidence retained for the September package. |

### Milestone 5.5 — Client Applications

**Objective:** Demonstrate that multiple consumer types can use the same governed API rather than directly depending on local JSON copies.

#### Client demonstrator work package

| Done | Task | Status | Evidence / notes |
|---:|---|---:|---|
| [ ] | Connect a web demonstrator to the live API | ⬜ Not started | Include repository browsing and a representative calculation workflow. |
| [ ] | Connect a mobile demonstrator to the live API | ⬜ Not started | Include a representative workflow; define offline strategy separately. |
| [ ] | Create an Excel or equivalent engineering-tool demonstrator | ⬜ Not started | Use API lookups and calculations rather than local authoritative copies. |
| [ ] | Prepare demonstration scenarios and script | ⬜ Not started | Use only verified repository combinations; account for known orientation limitations. |
| [ ] | Produce screenshots and supporting notes | ⬜ Not started | Reviewed September presentation package. |

---

## 9. Success Criteria

### September demonstrator

| Done | Criterion | Evidence required |
|---:|---|---|
| [ ] | Validated engineering data is available through the online API | Deployed endpoint responses traceable to authoritative JSON. |
| [ ] | The API is documented through OpenAPI | Published interactive documentation matches implemented behaviour and passes conformance tests. |
| [ ] | Configuration and direct-ID calculation requests are supported | Verified requests resolve to authoritative PES/ES resources before assessment. |
| [ ] | Resource-resolution evidence is available | Public response evidence is stable, governed and does not expose unnecessary internal context. |
| [ ] | A web consumer uses the live API | Demonstrable repository browsing and calculation flow. |
| [ ] | A mobile consumer uses the live API | Demonstrable representative mobile workflow. |
| [ ] | An engineering-tool integration is demonstrated | Excel workbook or equivalent uses the API. |
| [ ] | Validation evidence is available | Reproducible validation, service and API conformance evidence. |
| [ ] | Demonstration narrative is ready | Script, verified scenarios, screenshots and supporting notes reviewed. |

### December governance and adoption case

| Done | Criterion | Evidence required |
|---:|---|---|
| [ ] | Governance model is documented | Roles, decision rights and controlled-change approach. |
| [ ] | Engineering assurance is demonstrable | Validation, scenarios, regression and traceability approach. |
| [ ] | Maintenance model is credible | Ownership, release process, documentation and contribution model. |
| [ ] | Deployment model is repeatable | Environment, security, operational monitoring and recovery guidance. |
| [ ] | National tailoring is governed | Profile/extension approach without duplicating core authoritative data. |
| [ ] | Long-term interoperability is evidenced | Versioned API, schemas and integration guidance. |
| [ ] | Document generation framework is demonstrated | Presentation components, standards and renderers show repeatable generation of controlled engineering publications. |

---

## 10. Critical-path control

Until the September demonstrator is established, programme work will prioritise the shortest governed path to a demonstrable end-to-end service:
**API Contract → API Governance Suite → OpenAPI → Conformance → REST API → Deployment → Client Demonstration**

New requirements, architectural improvements and governance opportunities identified during this work will normally be recorded in the roadmap or deferred backlog rather than immediately implemented where they do not block the current milestone.

Work should leave the critical path only where:
- an identified issue prevents completion of the current milestone;
- proceeding would create material rework or technical debt affecting the MVP;
- an engineering correctness or assurance issue makes continued implementation unsafe;
- a source-data limitation prevents valid demonstration; or
- a decision is required now to preserve backwards compatibility or architectural integrity.

---

## 11. Deferred Work Backlog

These items are deliberately deferred because they do not block the September demonstrator. Deferral does not reduce their importance; it protects the critical path.

### Validation and engineering assurance

| Done | Work item | Status | Rationale / trigger to resume |
|---:|---|---:|---|
| [ ] | Repository dependency, completeness and coverage validation | ⏸ Deferred | Resume after demonstrator baseline. |
| [ ] | Cross-dataset and AASTP table completeness validation | ⏸ Deferred | Resume during source-to-data reconciliation. |
| [ ] | Engineering assurance and scenario validation | ⏸ Deferred | Resume for demonstrator hardening and the December package. |
| [ ] | Extended regression and service-level validation | ⏸ Deferred | Resume before controlled releases and hosted-service operation. |
| [ ] | Complete Engineering Assurance Framework | ⏸ Deferred | Resume for the December governance package. |
| [ ] | Standardise validator documentation and consistency | ⏸ Deferred | Resume before a controlled validation release. |

### Presentation and publications

| Done | Work item | Status | Rationale / trigger to resume |
|---:|---|---:|---|
| [ ] | Presentation Framework Version 2.0 enhancements | ⏸ Deferred | Extend components only when reuse is demonstrated. |
| [ ] | Advanced table layout, orientation, headers, numbering and navigation | ⏸ Deferred | Resume when additional publication requirements justify the work. |
| [ ] | Renderer profiles, catalogue and renderer specification | ⏸ Deferred | Resume after component and renderer behaviour stabilises. |
| [ ] | Interaction Table and Formula Reference generators | ⏸ Deferred | Resume after document-generation patterns are proven. |
| [ ] | Hazard Category handbook and Engineering Data Dictionary | ⏸ Deferred | Resume after knowledge and data-governance review. |
| [ ] | National publication generator | ⏸ Deferred | Resume with national-tailoring requirements. |

### Platform governance and engineering data

| Done | Work item | Status | Rationale / trigger to resume |
|---:|---|---:|---|
| [ ] | Documentation and repository governance frameworks | ⏸ Deferred | Resume for the December governance package. |
| [ ] | Document lifecycle, maintenance and contributor workflows | ⏸ Deferred | Resume as publication and contribution workflows mature. |
| [ ] | Controlled public-release policy | ⏸ Deferred | Resume before public API release; API versioning strategy itself is already agreed. |
| [ ] | Engineering vocabulary and metadata review | ⏸ Deferred | Establish controlled terminology and dataset-edition metadata. |
| [ ] | Engineering knowledge repositories and traceability framework | ⏸ Deferred | Resume after the demonstrator. |
| [ ] | National tailoring architecture and future chapter support | ⏸ Deferred | Resume once Chapter 1 patterns and requirements stabilise. |
| [ ] | Release authentication and custodian approval framework | ⏸ Deferred | Define governed release approval, digital-signature evidence, custodian handover and transition from `unauthenticated` to `authenticated`; resume for the December governance package. |

### Security, operations and integrations

| Done | Work item | Status | Rationale / trigger to resume |
|---:|---|---:|---|
| [ ] | Production Security and Integrity Strategy | ⏸ Deferred | Resume before production-grade public service operation. |
| [ ] | Backup, recovery and operational maintenance procedures | ⏸ Deferred | Resume before persistent production operation. |
| [ ] | Production monitoring and release management | ⏸ Deferred | Resume before controlled public releases. |
| [ ] | Power BI integration | ⏸ Deferred | Resume after the API resource model is stable. |
| [ ] | HTML renderer, national branding and internationalisation | ⏸ Deferred | Resume when a governed use case requires them. |
| [ ] | Digitally signed publications and automated publication pipeline | ⏸ Deferred | Resume when publication governance is agreed. |

---

## 12. Major Architectural Decisions

| ID | Decision | Status | Rationale | Review trigger |
|---|---|---:|---|---|
| AD-001 | JSON is the authoritative engineering data source. | Locked | Supports structured reuse, validation and interoperable consumption. | Only through controlled data-governance change. |
| AD-002 | Knowledge, data, validation, API and clients remain distinct layers. | Locked | Preserves separation of concerns and future extensibility. | New layer or material interface change. |
| AD-003 | Validation uses a layered assurance model. | Locked | Allows integrity checks and higher-level assurance to evolve independently. | Evidence that layers need revised scope. |
| AD-004 | Document generation separates document models, presentation standards and renderers. | Locked | Enables renderer independence and consistent publication. | New document format or model. |
| AD-005 | The Presentation Component Framework is Version 1.0. | Locked | Provides a stable baseline extended through governed reusable components. | Significant reusable-component pattern emerges. |
| AD-006 | REST API and OpenAPI are the primary integration boundary. | Locked | Provides predictable, standards-based access for all consumer types. | Security, interoperability or standards requirement changes. |
| AD-007 | API contract precedes REST API implementation. | Locked | Avoids consumer-specific design and protects compatibility. | Contract review identifies a material gap. |
| AD-008 | National tailoring must extend or profile core data rather than duplicate it. | Proposed | Maintains common authoritative data while allowing legitimate national variation. | Confirmed tailoring requirements. |
| AD-009 | Engineering calculations are governed by an implementation-independent engineering calculation model. | Locked | Separates engineering semantics from transport protocols and implementation technology. | Material change to the engineering calculation model. |
| AD-010 | Resource selection and resolution are validation-stage responsibilities. | Locked | Interaction and engineering services receive authoritative PES/ES resources regardless of whether the request used IDs or configurations. | Material change to the public selection contract or validation boundary. |
| AD-011 | The original client request is preserved; normalisation and canonicalisation are recorded as resolved resources and evidence. | Locked | Supports traceability, auditability and engineering assurance. | A governed audit or privacy requirement requires a different evidence model. |
| AD-012 | Engineering Service is the governed architectural name for the service responsible for executing the validated engineering assessment pipeline. | Locked | Establishes consistent terminology across architecture, API governance, OpenAPI and implementation documentation. |

---

## 13. Long-Term Vision

The long-term product is not simply a collection of JSON files. It is a digital engineering platform for AASTP:

```text
Authoritative Engineering Data
        │
        ▼
Validation and Engineering Assurance
        │
        ├───────────────┬────────────────┬──────────────────┐
        ▼               ▼                ▼                  ▼
REST API          Publications       Web & Mobile      External Systems
```

This platform should enable controlled evolution of current and future AASTP chapters, transparent engineering assurance, national profiles, repeatable publications and integration with the tools used by nations and partners. Its success will be measured by trustworthiness, maintainability, interoperability and governance—not merely by the number of interfaces delivered.

---

## 14. Roadmap Maintenance

| Activity | Cadence | Owner |
|---|---|---|
| Update task status and evidence | End of each working session | Delivery lead |
| Review critical path and deferred work | Weekly | Programme team |
| Review milestones and decision log | At each milestone boundary | Programme governance |
| Review target dates and presentation readiness | Monthly, then weekly during September | Programme lead |

When a task changes scope materially, record the decision in the decision log and update the affected success criterion. Do not silently change the underlying engineering-data schema or validation rules through roadmap maintenance.
