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

import { validateResourcePropertySemanticsSchema }
    from "./layer1/validateResourcePropertySemanticsSchema.js";

import { validateResourceResolutionRulesSchema }
    from "./layer1/validateResourceResolutionRulesSchema.js";

import { validateStructuresSchema }
    from "./layer1/validateStructuresSchema.js";

import { validateTransformationsSchema }
    from "./layer1/validateTransformationsSchema.js";

/*
==============================================================================
Layer 2 - Repository Validation
==============================================================================
*/

import { validateConstraintsRepository }
    from "./layer2/validateConstraintsRepository.js";

import { validateReferences }
    from "./layer2/validateReferences.js";

import { validateDistanceRulesRepository }
    from "./layer2/validateDistanceRulesRepository.js";

import { validateEffectsRepository }
    from "./layer2/validateEffectsRepository.js";

import { validateEsTypesRepository }
    from "./layer2/validateEsTypesRepository.js";

import { validateFormulasRepository }
    from "./layer2/validateFormulasRepository.js";

import { validateHazardCategoriesRepository }
    from "./layer2/validateHazardCategoriesRepository.js";

import { validateInteractionsRepository }
    from "./layer2/validateInteractionsRepository.js";

import { validateOrientationTypesRepository } 
    from "./layer2/validateOrientationTypesRepository.js";

import { validatePesTypesRepository }
    from "./layer2/validatePesTypesRepository.js";

import { validateProtectionLevelsRepository }
    from "./layer2/validateProtectionLevelsRepository.js";

import { validateResourcePropertySemanticsRepository }
    from "./layer2/validateResourcePropertySemanticsRepository.js";

import { validateResourceResolutionRulesRepository }
    from "./layer2/validateResourceResolutionRulesRepository.js";

import { validateStructuresRepository }
    from "./layer2/validateStructuresRepository.js";

import { validateTransformationsRepository }
    from "./layer2/validateTransformationsRepository.js";

//import validation from "ajv/dist/vocabularies/validation/index.js";




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

validationResults.push(validateResourcePropertySemanticsSchema());

validationResults.push(validateResourceResolutionRulesSchema());

validationResults.push(validateStructuresSchema());

validationResults.push(validateTransformationsSchema());

/*
==============================================================================
Layer 2
==============================================================================
*/

validationResults.push(validateConstraintsRepository());

validationResults.push(validateReferences());

validationResults.push(validateDistanceRulesRepository());

validationResults.push(validateEffectsRepository());

validationResults.push(validateEsTypesRepository());

validationResults.push(validateFormulasRepository());

validationResults.push(validateHazardCategoriesRepository());

validationResults.push(validateInteractionsRepository());

validationResults.push(validateOrientationTypesRepository());

validationResults.push(validatePesTypesRepository());

validationResults.push(validateProtectionLevelsRepository());

validationResults.push(validateResourcePropertySemanticsRepository());

validationResults.push(validateResourceResolutionRulesRepository());

validationResults.push(validateStructuresRepository());

validationResults.push(validateTransformationsRepository());

/*
==============================================================================
Generate Report
==============================================================================
*/

generateValidationReport(
    validationResults,
    {
        jsonPath: "./reports/validation-report.json",
        markdownPath: "./reports/validation-report.md"

    }
);

