import { repositoryService } from "@aastp/core-data";

const fields = [
    "pesType",
    "esType",
    "hazardId",
    "pesOrientation",
    "esOrientation"
];

class ValidationService {

    validate(request) {

        const context = {
            request,
            resolvedEntities: {},
            interaction: null,
            assessments: [],
            governingAssessment: null
        };

        const result = {
            valid: true,
            errors: []
        };

        this.validateRequiredFields(request, result);

        this.validateFieldTypes(request, result);

        this.validateEmptyStrings(request, result);

        this.validateAssessmentModel(request, context, result);

        this.validateNumericValues(request, context, result);

         // This breaks out of developing the scenario context if the data has been assessed as invalid
        if (result.errors.length > 0) {
            result.valid = false;
            result.request = request;
            result.context = context;
            
            return result;      
        }

        this.buildContext(request, context, result);

        // Set result.valid to false if there is one or more errors
        result.valid = result.errors.length === 0;

        result.request = request;
        result.context = context;
        result.context.request = request;
       
        return  result;
    }

    buildContext(request, context, result) {

        this.resolveReferences(request, context, result);

        if (result.errors.length > 0) {
            return;
        }

        this.resolveStructures(context, result);

        if (result.errors.length > 0) {
            return;
        }

        this.resolveOrientationTypes(context, result);

        this.validateOrientationSelections(request, context, result);

    }

    validateRequiredFields(request, result) {
        for (const field of fields) {
            if (
                request[field] === undefined ||
                request[field] === null
            ) {
                this.addError(result, field, "MISSING_FIELD", `Missing required field '${field}'`);
            }
        }
    }

    validateFieldTypes(request, result) {
        for (const field of fields) {
            if (
                request[field] !== undefined &&
                request[field] !== null &&
                typeof request[field] !== "string"
            ) {
                this.addError(result, field, "INCORRECT_FIELD_TYPE", `Field '${field}' must be a string`);
            }
        }
    }

    validateEmptyStrings(request, result) {
        for (const field of fields) {
            if (typeof request[field] === "string" &&
                request[field].trim() === "") {
                this.addError(result, field, "FIELD_EMPTY", `'${field}' cannot be empty`);
            }
        }
    }

    // Confirm that either NEQ or Distance has been given and determine the calculation model to be used
    validateAssessmentModel(request, context, result) {
        const hasNeq = request.neq !== undefined && request.neq !== null;
        const hasDistance = request.distance !== undefined && request.distance !== null;

        if (hasNeq && hasDistance) {
            this.addError(result, "neq", "BOTH_NEQ_AND_DISTANCE", "Both NEQ and Distance have been given");
        }
        if (!hasNeq && !hasDistance) {
            this.addError(result, "neq", "NEQ_OR_DISTANE_REQUIRED", "Neither NEQ and Distance have been given");
        }
        if (hasNeq && typeof request.neq !== "number") {
            this.addError(result, "neq", "NEQ_NUMBER", "NEQ must be a number");
        }
        if (hasDistance && typeof request.distance !== "number") {
            this.addError(result, "distance", "DISTANCE_NUMBER", "Distance must be a number");
        }
        if (hasNeq) { context.resolvedEntities.mode = "FORWARD" } 
        else { context.resolvedEntities.mode = "REVERSE" }
    }

    // Confirm that numbers are positive and greater than 0
    validateNumericValues(request, context, result) {
        switch (context.resolvedEntities.mode) {
            case "FORWARD":
                if (request.neq <= 0) {
                    this.addError(result, "neq", "NEQ_INVALID", "NEQ must be greater than zero");
                }
            break;

            case "REVERSE":
                if (request.distance <= 0) {
                    this.addError(result, "distance", "DISTANCE_INVALID", "Distance must be greater than zero");
                };
            break;
            default:
                this.addError(result, "neq", "ASSESSMENT_MODE", `Unknown assessment mode '${context.resolvedEntities.mode}'`);
        }
    }



    // Confirm that the objects referenced in the request actually exist
    resolveReferences(request, context, result) {
        context.resolvedEntities.pesType =
            this.resolve(
                "pesType",
                repositoryService.findPesTypeById(request.pesType),
                "UNKNOWN_PES",
                `Unknown PES Type '${request.pesType}'`,
                result
            );

        context.resolvedEntities.esType =
            this.resolve(
                "esType",
                repositoryService.findEsTypeById(request.esType),
                "UNKNOWN_ES",
                `Unknown ES Type '${request.esType}'`,
                result
            );


        context.resolvedEntities.hazard =
            this.resolve(
                "hazardId",
                repositoryService.findHazardById(request.hazardId),
                "UNKNOWN_HAZARD",
                `Unknown Hazard '${request.hazardId}'`,
                result
            );

    }

    // Confirm that the structures for the PES and ES exist
    resolveStructures(context, result) {
        context.resolvedEntities.pesStructure =
            this.resolve(
                "pesType.structure",
                repositoryService.findStructureById(context.resolvedEntities.pesType.structure),
                "UNKNOWN_STRUCTURE",
                `Unknown Structure '${context.resolvedEntities.pesType.structure}'`,
                result
            );

        context.resolvedEntities.esStructure =
            this.resolve(
                "esType.structure",
                repositoryService.findStructureById(context.resolvedEntities.esType.structure),
                "UNKNOWN_STRUCTURE",
                `Unknown Structure '${context.resolvedEntities.esType.structure}'`,
                result
            );

    }

    resolveOrientationTypes(context, result) {
        context.resolvedEntities.pesOrientationType = this.resolve(
            "pesStructure.orientationType",
            repositoryService.findOrientationTypeById(
                context.resolvedEntities.pesStructure.orientationType,
                result
            ),
            "UNKNOWN_ORIENTATION_TYPE",
            "Unknown PES orientation type",
            result
        );
         context.resolvedEntities.esOrientationType = this.resolve(
            "esStructure.orientationType",
            repositoryService.findOrientationTypeById(
                context.resolvedEntities.esStructure.orientationType,
                result
            ),
            "UNKNOWN_ORIENTATION_TYPE",
            "Unknown ES orientation type",
            result
        );
    }

    validateOrientationSelections(request, context, result) {
        this.validateOrientation(
            "PES",
            request.pesOrientation,
            context.resolvedEntities.pesOrientationType,
            result
        );

        this.validateOrientation(
            "ES",
            request.esOrientation,
            context.resolvedEntities.esOrientationType,
            result
        );
    }

    validateOrientation(site, orientation, definition, result) {
        
        if (!definition) {
            return;
        }
        
        if (
            !definition.values.includes(orientation)
        ) {
            const message = `${site} orientation '${orientation}' is invalid. ` +
                            `Valid values are ${definition.values.join(", ")}`
            this.addError(result, site, "ORIENTATION_INVALID", message)
        }

    }

    resolve(field, object, code, message, result) {
        if (!object) {
            this.addError(
                result, 
                field, 
                code,
                message
            );
            return null;
        }
        return object;
    }

    addError(result, field, code, message) {

        result.errors.push({
            field,
            code,
            message
        });
    }
}

//module.exports = new ValidationService();
export default new ValidationService();