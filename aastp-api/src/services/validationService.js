const repository = require("./repositoryService");

class ValidationService {

    validate(request) {

        this.validateSchema(request);

        const context = {};

        //
        // Resolve request references
        //

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

        //
        // Resolve structures
        //
       

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

           

        //
        // Resolve orientation definitions
        //

//console.log("PES Structure:");
//console.dir(context.pesStructure, { depth: null });

//console.log(
//    "Looking up orientation type:",
//    context.pesStructure.orientationType
//);

        context.pesOrientationType =
            this.resolve(
                repository.findOrientationTypeById(
                    context.pesStructure.orientationType
                ),
                "Unknown PES orientation type"
        );

        context.esOrientationType =
            this.resolve(
                repository.findOrientationTypeById(
                    context.esStructure.orientationType
                ),
                "Unknown ES orientation type"
            );

        //
        // Validate orientations
        //

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

        return {
            request,
            context
        };

    }

    validateSchema(request) {

        const required = [
            "pesType",
            "esType",
            "hazardId",
            "effectId",
            "neq",
            "pesOrientation",
            "esOrientation"
        ];

        for (const field of required) {

            if (
                request[field] === undefined ||
                request[field] === null
            ) {

                throw new Error(
                    `Missing required field '${field}'`
                );

            }

        }

        if (typeof request.neq !== "number") {
            throw new Error("NEQ must be numeric");
        }

        if (request.neq <= 0) {
            throw new Error(
                "NEQ must be greater than zero"
            );
        }

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