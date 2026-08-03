/**
 * AssessmentService
 *
 * Public entry point for all AASTP engineering assessments.
 *
 * Responsibilities
 * ----------------
 * - Validate incoming requests.
 * - Resolve the applicable interaction.
 * - Create assessment objects.
 * - Resolve engineering references.
 * - Execute engineering calculations.
 * - Return the completed assessment.
 *
 * This service intentionally contains no engineering logic.
 * It simply orchestrates the assessment pipeline.
 */

import validationService from "#services/validationService";
import interactionService from "#services/interactionService";

import assessmentResolver from "#resolvers/assessmentResolver";
import referenceResolver from "#resolvers/referenceResolver";

import engineeringService from "#services/engineeringService";

function process(request) {

    //--------------------------------------------------------------
    // Stage 1
    // Validate the incoming request.
    //--------------------------------------------------------------

    const result = validationService.validate(request);

    if (!result.valid) {
        return result;
    }

    const { context } = result;

    //--------------------------------------------------------------
    // Stage 2
    // Resolve the applicable interaction.
    //--------------------------------------------------------------

    interactionService.process(context);

    //--------------------------------------------------------------
    // Stage 3
    // Create assessment objects.
    //--------------------------------------------------------------

    assessmentResolver.process(context);

    //--------------------------------------------------------------
    // Stage 4
    // Resolve engineering references.
    //--------------------------------------------------------------

    context.assessments.forEach(assessment => {
        referenceResolver.resolve(assessment);
    });

    //--------------------------------------------------------------
    // Stage 5
    // Execute the engineering pipeline.
    //--------------------------------------------------------------

    engineeringService.process(context);

    //--------------------------------------------------------------
    // Stage 6
    // Return the completed assessment.
    //--------------------------------------------------------------

    return {
        valid: true,
        request,
        context
    };

}

export default {
    process
};