import { AssessmentStatus } from "#services/assessments/assessmentStatus";

export function resolve(assessment) {

    if (!assessment) {
        throw new Error(
            "transformationEngine requires an assessment."
        );
    }

    validateCalculation(assessment);

    assessment.calculation.transformedResult = applyTransformations(
        assessment.calculation.transformations, 
        assessment.calculation.rawResult
    );

    assessment.result.status = AssessmentStatus.COMPLETE;

    return assessment;

}

function validateCalculation(assessment) {

    if (!assessment.calculation) {
        throw new Error(
            "transformationEngine requires assessment.calculation."
        );
    }

    if (assessment.calculation.transformations === undefined) {
        throw new Error(
            "transformationEngine requires calculation.transformations."
        );
    }

    if (assessment.calculation.rawResult === undefined || assessment.calculation.rawResult === null) {
        throw new Error(
            "transformationEngine requires calculation.rawResult."
        );
    }

    if  (!Array.isArray(assessment.calculation.transformations)) {
        throw new Error(
            "transformationEngine requires calculation.transformations to be an array."
        );
    }

}

function applyTransformations(transformations, rawResult) {

    let result = rawResult;
    for (const transformation of transformations) {
        result = applyTransformation(
            transformation,
            result
        );
        validateTransformedResult(result, transformation, rawResult);
    }
    return result;
}

function applyTransformation(transformation, value) {
    switch (transformation.name) {

        case "round_up_metre":
            return roundUpMetre(value);

        case "round_down_metre":
            return roundDownMetre(value);

        case "minimum":
            return minimum(value);

        default:
            throw new Error(`Unknown transformation '${transformation.id}'.`);
    }
}

function validateTransformedResult(result, transformation, rawResult) {
    if (!Number.isFinite(result)) {
        throw new Error(
            `Transformation '${transformation.id}' resulted in ${result} from input ${rawResult}.`
        );
    }

}

function roundUpMetre(value) {
    return Math.ceil(value);
}

function roundDownMetre(value) {
    return Math.floor(value);
}

function roundDown10kg(value) {
    return Math.floor(value / 10) * 10;
}