# Assessment Context

**File:** `assessment-context.md`

---

# Purpose

The Assessment Context is the primary working object used by the AASTP Assessment Engine.

It represents the complete state of an assessment as it progresses through the rule engine.

Rather than passing numerous independent objects between services, a single Assessment Context is progressively enriched by each stage of the assessment pipeline.

The Assessment Context is **not** intended to be stored permanently.

It exists only for the lifetime of an assessment.

---

# Design Principles

The Assessment Context is designed to:

- provide a single source of truth during an assessment
- avoid repeated repository lookups
- avoid recalculating resolved references
- provide complete traceability
- simplify debugging
- support future assessment stages
- remain independent of the REST API representation

---

# Assessment Pipeline

The Assessment Context flows through the following services.

```
Client Request
        │
        ▼
ValidationService
        │
        ▼
InteractionService
        │
        ▼
DistanceRuleService
        │
        ▼
BranchResolver
        │
        ▼
FormulaResolver
        │
        ▼
CalculationService
        │
        ▼
TransformationService
        │
        ▼
AssessmentResult
```

Each service adds additional information while preserving existing state.

---

# Lifecycle

The Assessment Context begins as a validated client request.

Each subsequent resolver enriches the same object.

No resolver should remove information added by an earlier stage.

---

# Object Structure

```
AssessmentContext
│
├── request
├── mode
│
├── pesType
├── esType
├── hazard
├── effect
│
├── pesStructure
├── esStructure
│
├── pesOrientationType
├── esOrientationType
│
├── interaction
├── distanceRule
├── branch
├── formula
│
├── calculation
├── transformations
└── result
```

---

# Population Responsibility

| Property | Populated By |
|-----------|--------------|
| request | ValidationService |
| mode | ValidationService |
| pesType | ValidationService |
| esType | ValidationService |
| hazard | ValidationService |
| effect | ValidationService |
| pesStructure | ValidationService |
| esStructure | ValidationService |
| pesOrientationType | ValidationService |
| esOrientationType | ValidationService |
| interaction | InteractionService |
| distanceRule | DistanceRuleService |
| branch | BranchResolver |
| formula | FormulaResolver |
| calculation | CalculationService |
| transformations | TransformationService |
| result | TransformationService |

---

# Immutability

Once populated, objects should be treated as immutable.

Resolvers may append additional properties but should not modify information resolved by previous stages.

---

# Repository Usage

Repository lookups should only occur inside resolver services.

Client applications should never access repository data directly.

---

# Traceability

Every resolved object should preserve its original AASTP reference.

Example:

```
interaction.source
distanceRule.traceability
formula.source
```

This allows every calculated value to be traced back to the originating publication.

---

# Error Handling

Each resolver should either:

- enrich the Assessment Context

or

- throw a descriptive exception.

The Assessment Context should never exist in a partially modified state following a failed resolver.

---

# Future Extensions

The Assessment Context is expected to grow to include:

```
calculation

transformations

assessmentResult

warnings

validationMessages

assumptions

auditTrail

executionStatistics
```

These additions should not require changes to earlier services.

---

# Design Rules

Resolvers should:

✓ Read existing properties

✓ Add new properties

✓ Never remove properties

✓ Never duplicate repository data unnecessarily

✓ Never modify previously resolved objects

---

# Benefits

The Assessment Context provides:

- a consistent contract between services
- deterministic execution
- complete traceability
- simplified debugging
- future extensibility
- clean separation between validation, resolution and calculation