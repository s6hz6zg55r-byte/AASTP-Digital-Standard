import * as assessmentResolver from "../resolvers/assessmentResolver.js";
import * as referenceResolver from "../resolvers/referenceResolver.js";
import * as calculationResolver from "../resolvers/calculationResolver.js";

import * as formulaEvaluator from "../evaluators/formulaEvaluator.js";

import * as transformationEngine from "../engines/transformationEngine.js";
import { AssessmentStatus } from "#services/assessments/assessmentStatus";

/**
 * Executes the engineering assessment pipeline.
 *
 * Input:
 *   context
 *
 * Output:
 *   context (updated)
 */

// Engineering execution pipeline.
//
// Assessment
//     ↓
// Reference Resolution
//     ↓
// Calculation Resolution
//     ↓
// Formula Evaluation
//     ↓
// Engineering Transformations

export function process(context) {

    validateContext(context);

    assessmentResolver.resolve(context);

    if (!Array.isArray(context.assessments)) {
        throw new Error(
            "engineeringService requires context.assessments."
        );
    }

    processAssessments(context.assessments);

    return context;

}

function processAssessments(assessments) {

    for (const assessment of assessments) {
        processAssessment(assessment);
    }

}

function processAssessment(assessment) {

    // If there is no distance rule, then there is no need to resolve the assessment.
    // This may occur if the outcome is N/A or No NEQ.
    if (!assessment.outcome.distanceRule) {
        return;
    }

    referenceResolver.resolve(assessment);

    calculationResolver.resolve(assessment);

    if (!isPending(assessment)) {
        return;
    }

    formulaEvaluator.resolve(assessment);

    if (!isPending(assessment)) {
        return;
    }

    transformationEngine.resolve(assessment);

}

function validateContext(context) {

    if (!context) {
        throw new Error(
            "engineeringService requires a context."
        );
    }

    if (!context.request) {
        throw new Error(
            "engineeringService requires context.request."
        );
    }

    if (!context.interaction) {
        throw new Error(
            "engineeringService requires context.interaction."
        );
    }

}

export function isPending(assessment) {

    return (
        assessment.result.status ===
        AssessmentStatus.PENDING
    );

}