assessments/

├── Assessment.js
│   Canonical assessment data structure.
│
├── AssessmentFactory.js
│   Creates new assessment objects.
│
├── assessmentStatus.js
│   Assessment lifecycle constants.
│
└── README.md
    Describes the assessment model and how resolver services
    enrich an assessment throughout the pipeline.

    Resolvers never create assessments. They only enrich them.



InteractionService
    │
    ▼
Find interaction

AssessmentResolver
    │
    ▼
Create one assessment per hazard outcome

DistanceRuleResolver
    │
    ▼
Resolve the referenced distance rule

BranchResolver
    │
    ▼
Select the applicable branch
    (evaluates "when")

FormulaResolver
    │
    ▼
Resolve formula

CalculationEngine
    │
    ▼
Calculate distance

TransformationEngine
    │
    ▼
Round / minimums / etc.