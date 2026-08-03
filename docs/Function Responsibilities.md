| Property | Created by | Used by |
|----------|------------|---------|
| `request` | AssessmentFactory | CalculationResolver |
| `interaction` | AssessmentFactory | ReferenceResolver |
| `outcome` | AssessmentFactory | ReferenceResolver |
| `calculation` | CalculationResolver | FormulaEvaluator |
| `rawResult` | FormulaEvaluator | TransformationEngine |
| `transformedResult` | TransformationEngine | ConstraintEngine |