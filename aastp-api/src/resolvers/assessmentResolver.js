import AssessmentFactory from "#services/assessments/assessmentFactory";
import { AssessmentStatus } from "#services/assessments/assessmentStatus";


/**
 * AssessmentResolver
 *
 * Responsibility
 * --------------
 * Converts a resolved interaction into one Assessment object
 * for every engineering outcome defined by that interaction.
 *
 * This resolver performs no engineering calculations.
 * It simply normalises the interaction into a collection of
 * independent assessments for downstream processing.
 *
 * Pipeline
 * --------
 * Interaction
 *     ↓
 * AssessmentResolver
 *     ↓
 * Assessment[]
 */
export function resolve(context) {

    if (!context?.interaction) {
        throw new Error(
            "assessmentResolver requires context.interaction"
        );
    }

    context.assessments =
        createAssessments(
            context.request, 
            context.interaction,
            context.resolvedEntities.mode
        );

    return context;
}

/**
 * Creates one assessment for each engineering effect
 * that has an outcome matching the requested hazard.
 */
function createAssessments(request, interaction, mode) {

    const assessments = [];
    for (const [effectId, outcomes] of Object.entries(interaction.effects)) {
        if (!request.hazardId) {
            throw new Error(
                "assessmentResolver requires request.hazardId"
            );
        }
        const matchingOutcome = outcomes.find(
            outcome => outcome.hazard === request.hazardId
        );

        if (!matchingOutcome) {
            continue;
        }
        const assessment =
            AssessmentFactory.create({
                request,
                interaction,
                effectId,
                outcome: matchingOutcome,
                direction: mode.toLowerCase()
            });
        assessment.result.status =
            resolveAssessmentStatus(matchingOutcome);
        assessments.push(assessment);
    }
    return assessments;
}

// Determine if the assessment is N/A or No QD, and set the status accordingly.
function resolveAssessmentStatus(outcome) {

    switch (outcome.status) {

        case OutcomeStatus.NOT_APPLICABLE:
            return AssessmentStatus.NOT_APPLICABLE;

        case OutcomeStatus.NO_QUANTITY_DISTANCE:
            return AssessmentStatus.NO_QUANTITY_DISTANCE;

        default:
            return AssessmentStatus.PENDING;

    }

}

export const OutcomeStatus = Object.freeze({

    NOT_APPLICABLE: "N_A",

    NO_QUANTITY_DISTANCE: "NO_QD"

});