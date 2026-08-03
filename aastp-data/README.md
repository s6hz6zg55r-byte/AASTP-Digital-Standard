Purpose
-------

The repository provides the sole public interface to the AASTP data package.

Consumers must not access JSON files directly.

Public API
----------

repository.getInteractions()

repository.getDistanceRules()

repository.getEffects()

...

Design Principles
-----------------

• JSON structure is an implementation detail.
• Consumers interact only through repository methods.
• Returned objects are treated as read-only.

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
│
└── governingAssessment
            ├── assessmentId
            ├── governingCriterion
            └── value

traceability
│
├── references
│      ├── interactionId
│      ├── distanceRuleId
│      ├── branchId
│      ├── formulaId
│      ├── transformationIds[]
│      └── constraintIds[]
│
└── decisions
|      ├── hazardId
|      ├── protectionLevelId
|      ├── inputBasis
|      ├── selectedRule
|      └── status
│
└── processing
       ├── validatorVersion
       ├── ruleEngineVersion
       ├── completedAt
       ├── warnings[]

| Section | Owner |
|----------|-------|
| request | ValidationService |
| resolvedEntities | ValidationService |
| interaction | InteractionService |
| assessments | AssessmentResolver |
| assessment.calculation | CalculationService |
| assessment.traceability.references | Resolver services |
| assessment.traceability.decisions | Resolver services |
| assessment.traceability.processing | Each service updates its own contribution |
| governingAssessment | GoverningAssessmentService (or equivalent final stage) |

Services may enrich the AssessmentContext, but they should not modify or remove information added by previous services

Validation
    adds

↓

Interaction
    adds

↓

Assessment Resolver
    adds

↓

Calculation
    adds

↓

Transformation
    adds

↓

Governing Assessment
    adds