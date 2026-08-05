import { generateValidationReport } from "./utils/generateValidationReport.js";
/*
==============================================================================
Layer 1 - Schema Validation
==============================================================================
*/

import { validateConstraintsSchema }
    from "./layer1/validateConstraintsSchema.js";

import { validateDistanceRulesSchema }
    from "./layer1/validateDistanceRulesSchema.js";

import { validateEcmProtectionRatingsSchema }
    from "./layer1/validateEcmProtectionRatingsSchema.js";

import { validateEffectsSchema }
    from "./layer1/validateEffectsSchema.js";

import { validateEsTypesSchema }
    from "./layer1/validateEsTypesSchema.js";

import { validateFormulasSchema }
    from "./layer1/validateFormulaSchema.js";

import { validateHazardCategoriesSchema }
    from "./layer1/validateHazardCategoriesSchema.js";

import { validateInteractionSchema }
    from "./layer1/validateInteractionSchema.js";

import { validateOrientationTypesSchema }
    from "./layer1/validateOrientationTypesSchema.js";

import { validatePesTypesSchema }
    from "./layer1/validatePesTypesSchema.js";

import { validateProtectionLevelsSchema }
    from "./layer1/validateProtectionLevelsSchema.js";

import { validateStructuresSchema }
    from "./layer1/validateStructuresSchema.js";

import { validateTransformationsSchema }
    from "./layer1/validateTransformationsSchema.js";

/*
==============================================================================
Layer 2 - Repository Validation
==============================================================================
*/

import { validateReferences }
    from "./layer2/validateReferences.js";

import { validateDistanceRulesRepository }
    from "./layer2/validateDistanceRulesRepository.js";

import { validateFormulasRepository }
    from "./layer2/validateFormulasRepository.js";
import validation from "ajv/dist/vocabularies/validation/index.js";


const validationResults = [];

/*
==============================================================================
Layer 1
==============================================================================
*/

validationResults.push(validateConstraintsSchema());

validationResults.push(validateDistanceRulesSchema());

validationResults.push(validateEcmProtectionRatingsSchema());

validationResults.push(validateEffectsSchema());

validationResults.push(validateEsTypesSchema());

validationResults.push(validateFormulasSchema());

validationResults.push(validateHazardCategoriesSchema());

validationResults.push(validateInteractionSchema());

validationResults.push(validateOrientationTypesSchema());

validationResults.push(validatePesTypesSchema());

validationResults.push(validateProtectionLevelsSchema());

validationResults.push(validateStructuresSchema());

validationResults.push(validateTransformationsSchema());

/*
==============================================================================
Layer 2
==============================================================================
*/

validationResults.push(validateReferences());

validationResults.push(validateDistanceRulesRepository());

validationResults.push(validateFormulasRepository());

/*
==============================================================================
Generate Report
==============================================================================
*/

generateValidationReport(validationResults);

