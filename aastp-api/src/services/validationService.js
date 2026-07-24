const repository = require("./repositoryService");
const fields = [
    "pesType",
    "esType",
    "hazardId",
    "effectId",
    "pesOrientation",
    "esOrientation"
];

class ValidationService {

    validate(request) {

        const context = {};

        this.validateRequiredFields(request);

        this.validateFieldTypes(request);

        this.validateEmptyStrings(request);

        this.validateAssessmentModel(request, context);

        this.validateNumericValues(request, context);

        //----------------------------------
        // Validation complete
        //----------------------------------
        
        this.resolveReferences(request, context);

        this.resolveStructures(context);

        this.resolveOrientationTypes(context);

        this.validateOrientationSelections(request, context);
       
        return {
            request,
            context
        };

    }

    validateRequiredFields(request) {
        for (const field of fields) {
            if (
                request[field] === undefined ||
                request[field] === null
            ) {
                throw new Error(`Missing required field '${field}'`);
            }
        }
    }

    validateFieldTypes(request) {
        for (const field of fields) {
            if (typeof request[field] !== "string") {
                throw new Error(`'${field}' must be a string`);
            }
        }
    }

    validateEmptyStrings(request) {
        for (const field of fields) {
            if (request[field].trim() === "") {
                throw new Error (`'${field}' cannot be empty`);
            }
        }
    }

    // Confirm that either NEQ or Distance has been given and determine the calculation model to be used
    validateAssessmentModel(request, context) {
        const hasNeq = request.neq !== undefined && request.neq !== null;
        const hasDistance = request.distance !== undefined && request.distance !== null;

        if (hasNeq === hasDistance) {
            throw new Error(
                "Specify either 'neq' or 'distance', but not both."
            );
        }
        if (hasNeq && typeof request.neq !== "number") {
            throw new Error(
                "NEQ must be a number"
            );
        }
        if (hasDistance && typeof request.distance !== "number") {
            throw new Error(
                "Distance must be a number"
            );
        }
        if (hasNeq) { context.mode = "FORWARD" } 
        else { context.mode = "REVERSE" }
    }

    // Confirm that numbers are positive and greater than 0
    validateNumericValues(request, context) {
        switch (context.mode) {
            case "FORWARD":
                if (request.neq <= 0) {
                    throw new Error(
                        "NEQ must be greater than zero"
                    );
                }
            break;

            case "REVERSE":
                if (request.distance <= 0) {
                    throw new Error(
                        "Distance must be greater than zero"
                    );
                };
            break;
            default:
                throw new Error (
                    `Unknown assessment mode '${context.mode}'`
                );
        }
    }

    // Confirm that the objects referenced in the request actually exist
    resolveReferences(request, context) {
        context.pesType =
            this.resolve(
                repository.findPesTypeById(request.pesType),
                `Unknown PES Type '${request.pesType}'`
            );

        context.esType =
            this.resolve(
                repository.findEsTypeById(request.esType),
                `Unknown ES Type '${request.esType}'`
            );


        context.hazard =
            this.resolve(
                repository.findHazardById(request.hazardId),
                `Unknown Hazard '${request.hazardId}'`
            );


        context.effect =
            this.resolve(
                repository.findEffectById(request.effectId),
                `Unknown Effect '${request.effectId}'`
            );

    }

    // Confirm that the structures for the PES and ES exist
    resolveStructures(context) {
        context.pesStructure =
            this.resolve(
                repository.findStructureById(context.pesType.structure),
                `Unknown Structure '${context.pesType.structure}'`
            );

        context.esStructure =
            this.resolve(
                repository.findStructureById(context.esType.structure),
                `Unknown Structure '${context.esType.structure}'`
            );

    }

    resolveOrientationTypes(context) {
        context.pesOrientationType = this.resolve(
            repository.findOrientationTypeById(
                context.pesStructure.orientationType
            ),
            "Unknown PES orientation type"
        );
         context.esOrientationType = this.resolve(
            repository.findOrientationTypeById(
                context.esStructure.orientationType
            ),
            "Unknown ES orientation type"
        );
    }

    validateOrientationSelections(request, context) {
        this.validateOrientation(
            "PES",
            request.pesOrientation,
            context.pesOrientationType
        );

        this.validateOrientation(
            "ES",
            request.esOrientation,
            context.esOrientationType
        );
    }

    validateOrientation(site, orientation, definition) {
        if (
            !definition.values.includes(orientation)
        ) {

            throw new Error(

                `${site} orientation '${orientation}' is invalid. ` +
                `Valid values are ${definition.values.join(", ")}`

            );

        }

    }

    resolve(object, message) {

        if (!object) {
            throw new Error(message);
        }

        return object;

    }

}

module.exports = new ValidationService();