ROADMAP.md

ARCHITECTURE.md

JSON_SCHEMA_GUIDE.md

VALIDATION_FRAMEWORK.md

API_SPECIFICATION.md

SECURITY_AND_INTEGRITY_STRATEGY.md

DEPLOYMENT_GUIDE.md

CONTRIBUTOR_GUIDE.md

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
| `validateTransformationsRepository` | `transformations.json` |
| `validateEffectsRepository` | `effects.json` |
| `validateProtectionLevelsRepository` | `protectionLevels.json` |
| `validateConstraintsRepository` | `constraints.json` |
| `validateEsTypesRepository` | `esTypes.json` |
| `validatePesTypesRepository` | `pesTypes.json` |
| `validateHazardCategoriesRepository` | `hazardCategories.json` |


By then, every Layer 2 validator can safely assume the JSON has already passed schema validation.

## Validator Phase C - Report Generation
Once Layers 1 and 2 are complete, enhance generateValidationReport to produce:
- Markdown
- PDF
- JSON
At that point, the report becomes a genuine certification report rather than a work-in-progress summary.

## Validator Phase D - Layer 3
Only after Layers 1 and 2 are complete would I start the engineering assurance validators.
Examples include:
- orphaned repository objects,
- unused formulas,
- unused transformations,
- completeness against AASTP Table 1,
- repository coverage,
- cross-dataset consistency.