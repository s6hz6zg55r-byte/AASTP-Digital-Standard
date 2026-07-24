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

