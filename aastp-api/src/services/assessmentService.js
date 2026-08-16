/**
 * AssessmentService
 *
 * Public entry point for all AASTP engineering assessments.
 *
 * Responsibilities
 * ----------------
 * - Validate and normalise incoming requests.
 * - Resolve authoritative PES and ES resources.
 * - Resolve the applicable interaction.
 * - Execute the engineering assessment pipeline.
 * - Return the completed assessment context.
 *
 * This service contains no engineering logic.
 * It orchestrates the validated service pipeline.
 */

import validationService
    from "#services/validationService";

import interactionService
    from "#services/interactionService";

import * as engineeringService
    from "#services/engineeringService";


function process(request) {

    /*
    --------------------------------------------------------------------------
    Stage 1
    Validate and normalise request
    --------------------------------------------------------------------------
    */

    const result =
        validationService.validate(
            request
        );


    if (!result.valid) {
        return result;
    }


    const { context } =
        result;


    /*
    --------------------------------------------------------------------------
    Stage 2
    Resolve interaction
    --------------------------------------------------------------------------
    */

    interactionService.process(
        context
    );


    /*
    --------------------------------------------------------------------------
    Stage 3
    Execute engineering pipeline
    --------------------------------------------------------------------------
    */

    engineeringService.process(
        context
    );


    /*
    --------------------------------------------------------------------------
    Stage 4
    Return completed result
    --------------------------------------------------------------------------
    */

    return {
        valid: true,
        request,
        context
    };

}


export default {
    process
};