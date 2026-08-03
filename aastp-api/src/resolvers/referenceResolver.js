import { repositoryService } from "@aastp/core-data";

/**
 * Resolves engineering references for an assessment.
 *
 * Input:
 *  Assessment containing a hazard outcome from the interaction.
 *
 * Output:
 *  Assessment enriched with repository objects.
 */
export function resolve(assessment) {

    if (!assessment?.outcome) {
        throw new Error(
            "referenceResolver requires assessment.outcome"
        );
    }

    const outcome = assessment.outcome;

    assessment.hazard = resolveReference(
        outcome.hazard,
        repositoryService.findHazardById,
        "hazard"
    );

    assessment.distanceRule = resolveReference(
        outcome.distanceRule,
        repositoryService.findDistanceRuleById,
        "distance rule"
    );

    assessment.protectionLevel = resolveReference(
        outcome.protectionLevel,
        repositoryService.findProtectionLevelById,
        "protection level"
    );

    assessment.constraints = (
        outcome.constraints ?? []).map(id =>
            resolveReference(
                id,
                repositoryService.findConstraintById,
                "constraint"
            )
        );
        
    return assessment;
}

function resolveReference(id, lookup, description) {

    if (!id) {
        return null;
    }

    const value = lookup(id);

    if (!value) {
        throw new Error(
            `Unknown ${description} '${id}'`
        );
    }

    return value;
}