/**
 * Assessment lifecycle states.
 *
 * These indicate how far an assessment has progressed through
 * the resolver pipeline.
 */

export const AssessmentStatus = Object.freeze({

    PENDING: "pending",

    COMPLETE: "complete",

    NOT_APPLICABLE: "not_applicable",

    NO_QUANTITY_DISTANCE: "no_quantity_distance",

    NOT_SOLVABLE: "not_solvable",

    ABOVE_MAXIMUM: "above_maximum",

    BELOW_MINIMUM: "below_minimum",

    FAILED: "failed"

});