/**
 * Assessment
 *
 * Represents a single engineering assessment generated from an
 * interaction.
 *
 * An assessment is progressively enriched by the resolver pipeline.
 * Every resolver adds information but should never remove or replace
 * existing information.
 */

export default function createAssessment() {
    return {

        id: null,

        type: null,

        interaction: null,

        effectId: null,

        outcome: null,

        distanceRule: null,

        branch: null,

        formula: null,

        transformations: [],

        evaluation: {

            inputs: {},

            rawValue: null,

            transformedValue: null

        },

        constraints: [],

        result: {

            status: null,

            quantityDistance: null,

            governing: false

        }

    };
}