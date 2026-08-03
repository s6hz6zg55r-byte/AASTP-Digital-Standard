# AssessmentContext

**Version:** 1.0.0  
**Status:** Approved  
**Project:** AASTP Digital Assessment Engine  
**Last Updated:** 28 July 2026

---

# 1. Purpose

The Assessment Context is the canonical working document shared by all services within the AASTP Assessment Engine.

It represents the complete state of an assessment as it progresses through the processing pipeline. Each service enriches the context with additional information without modifying or removing data created by previous services.

The Assessment Context provides:

- A single shared contract between services.
- Complete engineering traceability.
- Support for debugging and validation.
- Auditability suitable for future AC/326 governance.
- A stable internal API independent of external request or response models.

The Assessment Context is **not** intended to be persisted as the authoritative data source. The authoritative source remains the project JSON datasets.

---

# 2. Design Principles

The Assessment Context follows these principles.

## Progressive Enrichment

Each service enriches the context by adding information.

Services must not remove or overwrite information produced by earlier services unless explicitly correcting an error.

---

## Single Source of Truth

Authoritative engineering data is never duplicated.

The context stores references (IDs) to datasets rather than copies of dataset records wherever practical.

---

## Complete Traceability

Every engineering decision must be reproducible.

Every assessment contains sufficient information to determine:

- what engineering data was used,
- why it was selected,
- how the calculation was performed.

---

## Separation of Responsibilities

Each service owns a clearly defined portion of the Assessment Context.

---

## Extensibility

Future AASTP chapters and additional assessment types shall be accommodated by extending the context without breaking existing consumers.

---

# 3. Assessment Lifecycle

```
Request
    │
    ▼
ValidationService
    │
    ▼
InteractionService
    │
    ▼
AssessmentResolver
    │
    ▼
CalculationService
    │
    ▼
TransformationService
    │
    ▼
GoverningAssessmentService
    │
    ▼
Assessment Result
```

Each service progressively enriches the same Assessment Context.

---

# 4. AssessmentContext Structure

```text
AssessmentContext
│
├── request
│
├── resolvedEntities
│
├── interaction
│
├── assessments[]
│     │
│     ├── assessmentId
│     ├── effectId
│     ├── protectionLevelId
│     ├── status
│     ├── calculation
│     │
│     └── traceability
│
└── governingAssessment
      ├── assessmentId
      ├── governingCriterion
      └── value
```

---

# 5. Context Sections

## request

Contains the original validated assessment request supplied by the caller.

This object is immutable after validation.

Example:

```javascript
request = {

    assessmentMode,
    pesType,
    esType,
    hazardId,

    pesOrientation,
    esOrientation,

    neq,
    distance

}
```

---

## resolvedEntities

Contains repository objects resolved during validation.

Example:

```javascript
resolvedEntities = {

    pesType,
    esType,
    hazard,
    assessmentMode

}
```

These objects are provided for convenience during processing and avoid repeated repository lookups.

---

## interaction

Contains the resolved interaction record.

Example:

```javascript
interaction = {

    id: "INT003",

    ...

}
```

---

## assessments

Contains one assessment for every applicable engineering pathway.

An interaction may produce multiple assessments.

Examples include:

- Blast
- Primary Fragments
- Secondary Fragments
- Thermal
- Multiple protection levels

---

# 6. Assessment Structure

```javascript
assessment = {

    assessmentId,

    effectId,

    protectionLevelId,

    status,

    calculation,

    traceability

}
```

---

## assessmentId

Stable identifier within the Assessment Context.

Used by the governing assessment to reference the controlling assessment.

---

## effectId

Reference to the assessed effect.

---

## protectionLevelId

Reference to the protection level used during assessment.

---

## status

Indicates the assessment outcome.

Examples:

```
CALCULATED
NO_QD
N_A
NEGLIGIBLE
```

---

## calculation

Contains the numerical calculation results.

Example:

```javascript
calculation = {

    input,

    output,

    units

}
```

---

# 7. Traceability

Every assessment contains an independent traceability record.

This ensures complete engineering provenance for every assessment pathway.

```text
traceability
│
├── references
│
├── decisions
│
└── processing
```

---

## references

References identify the authoritative engineering data used.

```javascript
references = {

    interactionId,

    distanceRuleId,

    branchId,

    formulaId,

    transformationIds: [],

    constraintIds: []

}
```

These IDs reference the project JSON datasets.

---

## decisions

Decisions explain why the engineering pathway was selected.

```javascript
decisions = {

    hazardId,

    protectionLevelId,

    inputBasis,

    selectedRule,

    status

}
```

This information records the engineering reasoning rather than simply the datasets used.

---

## processing

Records processing metadata.

```javascript
processing = {

    validatorVersion,

    ruleEngineVersion,

    completedAt,

    warnings: []

}
```

This information enables complete auditability and reproducibility.

---

# 8. Governing Assessment

The governing assessment identifies the controlling engineering outcome.

```javascript
governingAssessment = {

    assessmentId,

    governingCriterion,

    value

}
```

Example:

```javascript
governingAssessment = {

    assessmentId: "ASM002",

    governingCriterion:
        "Maximum Separation Distance",

    value: 287

}
```

The governing assessment references an existing assessment rather than duplicating it.

---

# 9. Service Ownership

| Context Section | Responsible Service |
|-----------------|---------------------|
| request | ValidationService |
| resolvedEntities | ValidationService |
| interaction | InteractionService |
| assessments | AssessmentResolver |
| calculation | CalculationService |
| traceability.references | Resolver Services |
| traceability.decisions | Resolver Services |
| traceability.processing | Individual Services |
| governingAssessment | GoverningAssessmentService |

---

# 10. Mutability Rules

Services may enrich the Assessment Context.

Services shall not:

- remove information;
- overwrite information produced by previous services;
- duplicate authoritative engineering data.

The Assessment Context represents the complete provenance of the assessment and must remain internally consistent throughout processing.

---

# 11. Extension Rules

Future extensions shall adhere to the following rules.

- Preserve backwards compatibility wherever practical.
- Extend existing objects rather than replacing them.
- Continue using dataset IDs as references.
- Keep engineering knowledge in the JSON datasets rather than embedding it in services.
- Ensure new assessment types include independent traceability records.

---

# 12. Rationale

The Assessment Context provides a single, consistent processing model for the AASTP Assessment Engine.

It enables:

- deterministic processing;
- complete engineering traceability;
- reproducible calculations;
- simplified service interfaces;
- future support for additional AASTP chapters;
- future adoption as part of a standards-based digital implementation.

The context deliberately separates:

- authoritative engineering knowledge,
- processing state,
- engineering decisions,
- calculation results,
- audit information.

This separation supports maintainability while preserving full transparency of the assessment process.

---

# 13. Guiding Principle

The Assessment Context is the canonical internal contract of the AASTP Assessment Engine.

Every service accepts an Assessment Context, enriches it, and returns the same Assessment Context.

No service invents an alternative processing model.

context = {

    request: { ... },

    resolvedEntities: { ... },

    interaction: { ... },

    assessments: [

        {
            effect: "...",
            branch: "...",
            formula: "...",
            calculatedDistance: 845,
            finalDistance: 900
        },

        {
            effect: "...",
            branch: "...",
            formula: "...",
            calculatedDistance: 640,
            finalDistance: 650
        }

    ],

    governingAssessment: { ... }

};