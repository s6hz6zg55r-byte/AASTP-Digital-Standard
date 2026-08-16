ROADMAP.md

ARCHITECTURE.md

JSON_SCHEMA_GUIDE.md

VALIDATION_FRAMEWORK.md

API_SPECIFICATION.md

SECURITY_AND_INTEGRITY_STRATEGY.md

DEPLOYMENT_GUIDE.md

CONTRIBUTOR_GUIDE.md

REPOSITORY_ENGINEERING_GUIDE.md

VALIDATION_STANDARD.md

## Validator Phase A - Complete Layer 1
| Validator | Dataset |
|-----------|---------|
| ✅ `validateDistanceRulesSchema` | `distanceRules.json` |
| ✅ `validateFormulasSchema` | `formulas.json` |
| ✅ `validateTransformationsSchema` | `transformations.json` |
| ✅ `validateEffectsSchema` | `effects.json` |
| ✅ `validateHazardCategoriesSchema` | `hazardCategories.json` |
| ✅ `validateEcmProtectionRatingsSchema` | `ecmProtectionRatings.json` |
| ✅ `validateProtectionLevelsSchema` | `protectionLevels.json` |
| ✅ `validateConstraintsSchema` | `constraints.json` |
| ✅ `validateInteractionsSchema` | `interactions.json` |
| ✅ `validateEsTypesSchema` | `esTypes.json` |
| ✅ `validatePesTypesSchema` | `pesTypes.json` |
| ✅ `validateOrientationTypesSchema` | `orientationTypes.json` |
| ✅ `validateStructuresSchema` | `structures.json` |

## Validator Phase B - Complete Layer 2
Once every repository has a Layer 1 validator, return to the remaining Layer 2 validators:
| Validator | Dataset |
|-----------|---------|
| ✅ `validateDistanceRulesRepository` | `distanceRules.json` |
| ✅ `validateFormulasRepository` | `formulas.json` |
| ✅ `validateReferencesRepository` |    |
| ✅ `validateTransformationsRepository` | `transformations.json` |
| ✅ `validateConstraintsRepository` | `constraints.json` |
| ✅ `validateProtectionLevelsRepository` | `protectionLevels.json` |
| ✅ `validateOrientationTypesRepository` | `orientationTypes.json` |
| ✅ `validateStructuresRepository` | `structures.json` |
| ✅ `validateEsTypesRepository` | `esTypes.json` |
| ✅ `validatePesTypesRepository` | `pesTypes.json` |
| ✅ `validateEffectsRepository` | `effects.json` |
| ✅ `validateHazardCategoriesRepository` | `hazardCategories.json` |
| ✅ `validateInteractionsRepository` | `interactions.json` |


By then, every Layer 2 validator can safely assume the JSON has already passed schema validation.

## Validator Phase C - Report Generation
Once Layers 1 and 2 are complete, enhance generateValidationReport to produce:
- Markdown
- PDF
- JSON
At that point, the report becomes a genuine certification report rather than a work-in-progress summary.

## Validator Phase D - Layer 3
Only after Layers 1 and 2 are complete would I start the engineering integrity validators.
Examples include:
- orphaned repository objects,
- unused formulas,
- unused transformations,
- completeness against AASTP Table 1,
- repository coverage,
- cross-dataset consistency,
- repository dependency graph validation.

## Review vocabularies
Review engineering vocabularies to determine whether they represent simple controlled terminology or knowledge-bearing engineering concepts. Where a vocabulary requires user guidance, engineering definitions, references, or category-specific behaviour, promote it from a controlled constant to a dedicated Engineering Knowledge Repository.
This is likely going to result in a new JSON file describing exposure categories

## Engineering Traceability Framework
Develop a standardised provenance and traceability model applicable across all repositories and future national tailoring. The framework will define common source structures, referencing conventions, provenance metadata, validation rules, API representation, and extensibility mechanisms to support NATO baseline data, national supplements, and future editions of AASTP. This work will be undertaken after completion of the demonstrator to avoid disrupting current development priorities.

# Phase E - Demonstrator (Milestone 5)

**Objective**

Deliver a fully operational online demonstrator that showcases validated engineering data exposed through a standards-based REST API and consumed by web, mobile and engineering applications in preparation for the AASTP-1 Sub-Group presentation.

---

## Milestone 5.1 - Complete Validation Reporting

### PDF Renderer

| Task | Status |
|------|--------|
| Implement PDF renderer using the Presentation Component Framework | ⬜ |
| Apply the Document Presentation Standard | ⬜ |
| Generate PDF Validation Report | ⬜ |
| Validate consistency between JSON, Markdown and PDF outputs | ⬜ |
| Lock Presentation Framework Version 1.0 | ⬜ |

### Presentation Framework

| Task | Status |
|------|--------|
| Confirm Document Presentation Standard Version 1.0 | ✅ |
| Confirm Presentation Component Framework Version 1.0 | ◐ |
| Complete initial reusable component library | ⬜ |
| Verify renderer independence | ⬜ |

---

## Milestone 5.2 - API Contract

### API Architecture

| Task | Status |
|------|--------|
| Review API architecture | ⬜ |
| Confirm API resource model | ⬜ |
| Confirm endpoint hierarchy | ⬜ |
| Confirm versioning strategy | ⬜ |
| Confirm error response model | ⬜ |

### OpenAPI Specification

| Task | Status |
|------|--------|
| Complete OpenAPI 3.1 specification | ⬜ |
| Define request schemas | ⬜ |
| Define response schemas | ⬜ |
| Define common error objects | ⬜ |
| Produce interactive API documentation | ⬜ |

### Repository Mapping

| Task | Status |
|------|--------|
| Map repositories to REST resources | ⬜ |
| Confirm identifier strategy | ⬜ |
| Confirm filtering behaviour | ⬜ |
| Confirm support for national tailoring | ⬜ |

---

## Milestone 5.3 - API Implementation

### Repository Services

| Task | Status |
|------|--------|
| Implement repository service layer | ⬜ |
| Implement engineering resolver services | ⬜ |
| Implement validation middleware | ⬜ |

### REST Endpoints

| Task | Status |
|------|--------|
| Implement repository endpoints | ⬜ |
| Implement engineering calculation endpoints | ⬜ |
| Implement metadata endpoint | ⬜ |
| Implement health endpoint | ⬜ |

### Testing

| Task | Status |
|------|--------|
| Repository endpoint testing | ⬜ |
| Engineering calculation testing | ⬜ |
| Error handling testing | ⬜ |
| API integration testing | ⬜ |

---

## Milestone 5.4 - Online Demonstrator

### Infrastructure

| Task | Status |
|------|--------|
| Select hosting platform | ⬜ |
| Configure deployment pipeline | ⬜ |
| Configure production environment | ⬜ |
| Configure HTTPS | ⬜ |
| Configure logging | ⬜ |

### Deployment

| Task | Status |
|------|--------|
| Deploy REST API | ⬜ |
| Deploy OpenAPI documentation | ⬜ |
| Verify online functionality | ⬜ |
| Publish demonstrator URL | ⬜ |

---

## Milestone 5.5 - Client Applications

### Web Application

| Task | Status |
|------|--------|
| Connect React application to live API | ⬜ |
| Remove direct JSON dependencies | ⬜ |
| Implement repository browsing | ⬜ |
| Implement engineering calculations | ⬜ |
| Improve navigation and layout | ⬜ |
| Add engineering explanations | ⬜ |
| Improve validation messaging | ⬜ |

### Mobile Application

| Task | Status |
|------|--------|
| Connect mobile application to live API | ⬜ |
| Repository browsing | ⬜ |
| Engineering calculations | ⬜ |
| Develop offline strategy | ⬜ |

### Excel Integration

| Task | Status |
|------|--------|
| Implement API connectivity | ⬜ |
| Engineering calculation functions | ⬜ |
| Repository lookup functions | ⬜ |
| Create demonstration workbook | ⬜ |

### Demonstration Package

| Task | Status |
|------|--------|
| Prepare September demonstration | ⬜ |
| Develop demonstration script | ⬜ |
| Produce screenshots | ⬜ |
| Develop demonstration scenarios | ⬜ |
| Prepare supporting notes | ⬜ |

---

# Future Work (Post Demonstrator)

## Validation Framework

### Layer 3 Validation

| Task | Status |
|------|--------|
| Repository dependency validation | ⬜ |
| Repository completeness validation | ⬜ |
| Cross-dataset engineering validation | ⬜ |
| Repository coverage validation | ⬜ |
| AASTP Table completeness validation | ⬜ |

### Layer 4 Validation

| Task | Status |
|------|--------|
| Engineering assurance validation | ⬜ |
| Scenario validation | ⬜ |
| Regression validation | ⬜ |
| Service-level validation | ⬜ |

---

## Engineering Assurance

| Task | Status |
|------|--------|
| Complete Engineering Assurance Framework | ⬜ |
| Complete Validation Reporting Framework | ⬜ |
| Standardise validator documentation | ⬜ |
| Review validator consistency | ⬜ |

---

## Document Generation

### Presentation Framework

| Task | Status |
|------|--------|
| Complete remaining presentation components | ⬜ |
| Develop Document Component Catalogue | ⬜ |
| Develop Renderer Specification | ⬜ |
| Expand Document Presentation Standard | ⬜ |

### Publications

| Task | Status |
|------|--------|
| Interaction Table generator | ⬜ |
| Formula Reference generator | ⬜ |
| Hazard Category handbook | ⬜ |
| Engineering Data Dictionary | ⬜ |
| National publication generator | ⬜ |

---

## Platform Governance

| Task | Status |
|------|--------|
| Documentation Governance Framework | ⬜ |
| Repository Governance Model | ⬜ |
| API Governance Model | ⬜ |
| Document lifecycle management | ⬜ |
| Versioning policy | ⬜ |
| Maintenance strategy | ⬜ |
| Contributor workflow | ⬜ |

---

## Engineering Data

| Task | Status |
|------|--------|
| Review engineering vocabularies | ⬜ |
| Develop Engineering Knowledge Repositories | ⬜ |
| Develop Engineering Traceability Framework | ⬜ |
| National tailoring architecture | ⬜ |
| Future chapter support | ⬜ |

---

## Security & Operations

| Task | Status |
|------|--------|
| Implement Security and Integrity Strategy | ⬜ |
| Deployment automation | ⬜ |
| Backup and recovery | ⬜ |
| Monitoring | ⬜ |
| Operational maintenance procedures | ⬜ |
| Release management | ⬜ |