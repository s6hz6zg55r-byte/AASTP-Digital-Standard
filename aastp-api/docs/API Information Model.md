What are all of the reusable information objects in the AASTP API?

AASTP API Information Model

Infrastructure
--------------
Authority
Metadata
ErrorResponse
Health
Version
Dataset

Reference Data
--------------
PesType
 - id
 - code
 - name
 - structure
 - source
EsType
 - id
 - code
 - name
 - structure
 - construction
 - exposure
 - source
HazardCategory
 - id
 - code
 - name
 - description
 - parentDivision
 - type
 - active
 - effects
 - supportedQuantityBasis
 - source
Structure
 - id
 - code
 - name
 - category
 - supportedProperties
 - supportedExposure
 - orientationtype
ProtectionLevel
 - id
 - code
 - name
 - source
InteractionRule
 - id
 - conditions
 - effects
DistanceRule
 - id
 - name
 - applicability
 - calculation
Constraint
 - id
 - code
 - name
 - category
 - text
 - source
Formula
 - id
 - code
 - name
 - description
 - solvable
 - units
 - parameters
 - forwardExpression
 - reverseExpression
Transformation
 - id
 - name
 - expression

Assessment
----------
AssessmentRequest
AssessmentResponse
 - Metadata
 - Assessment
 - Applied Rules
 - Applied Formulae
 - Result
Calculation
Result
AppliedRule
AppliedFormula

Collections
-----------
PesTypeList
EsTypeList
...

src/
│
├── data/
│   ├── hazards.json
│   ├── distanceRules.json
│   ├── ...
│
├── repositories/
│   ├── repository.js
│   └── repositoryService.js
│
├── resolvers/
│   ├── assessmentResolver.js
│   ├── referenceResolver.js
│   ├── branchResolver.js
│   ├── formulaResolver.js
│   ├── transformationResolver.js
│   ├── calculationResolver.js
│   └── ...
│
├── validators/
│   ├── validateDataset.js
│   ├── validateDistanceRules.js
│   └── ...
│
├── engines/
│   ├── formulaEngine.js
│   ├── transformationEngine.js
│   └── expressionEngine.js
│
├── api/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
│
├── models/
│
├── utils/
│
└── index.js


const interactionService = require("@services/interactionService");
const referenceResolver = require("@resolvers/referenceResolver");
const formulaEngine = require("@engines/formulaEngine");
const calculateController = require("@api/controllers/calculateController");

const repositoryService = require("@data/repositoryService");
const repository = require("@data/repository");