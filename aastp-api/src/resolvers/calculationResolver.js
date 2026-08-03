import { repositoryService } from "@aastp/core-data";
import { AssessmentStatus } from "#services/assessments/assessmentStatus";

/**
 * Resolves the engineering calculation required for an assessment.
 * 
 * Determine the input value
 *       ↓
 * Determine the branch criteria
 *       ↓
 * Find all matching branches
 *       ↓
 * Verify exactly one match
 *       ↓
 * Return the branch
 *
 * Responsibilities:
 *  - Determine calculation direction.
 *  - Select the appropriate calculation branch.
 *  - Resolve the formula definition.
 *  - Resolve the expression
 *  - Merge parameters.
 *  - Build assessment.calculation
 *
 * Inputs:
 *  assessment.distanceRule
 *  assessment.request
 *
 * Outputs:
 *  assessment.calculation
 */

export function resolve(assessment) {

    const distanceRule = assessment.distanceRule;

    if (!distanceRule) {
        return assessment;
    }

    const direction =
        assessment.request.direction;

    const formula = resolveFormula(distanceRule);
    const solvable = resolveSolvable(formula, direction);

    if (!solvable) {
        assessment.result.status =
            AssessmentStatus.NOT_SOLVABLE;
        return assessment;
    }

    const branch = selectBranch(
            assessment,
            distanceRule,
            assessment.request,
            direction
        );

    if (!branch) {
        return assessment;
    }

    const inputValue = determineInputValue(assessment.request, direction);

    const resolvedExpression =
        resolveExpression(
            formula,
            branch,
            direction
        );
        
    const parameters = 
        resolveParameters(
            formula,
            branch,
            direction
        );

    const engineeringUnits =
        resolveEngineeringUnits(
            formula,
            direction
        );

    const transformations =
        resolveTransformations(
            distanceRule,
            direction
        );

    assessment.calculation = {

        direction,

        branch,

        formula,

        inputValue,

        resolvedExpression,

        parameters,

        engineeringUnits,

        solvable,

        transformations
    };

    return assessment;
}

function resolveFormula(
    distanceRule
) {
    const branches =
        distanceRule.calculation.branches;
    if (branches.length === 0) {
        throw new Error(
            `Distance rule ${distanceRule.id} defines no calculation branches.`
        );
    }
    const formula =
        repositoryService.findFormulaById(
            branches[0].formula
        );
    if (!formula) {
        throw new Error(
            `Formula ${branches[0].formula} not found.`
        );
    }
    return formula;
}

function selectBranch(
    assessment,
    distanceRule,
    request,
    direction
) {
   
    const branches =
    distanceRule.calculation.branches;

    const inputValue = determineInputValue(
        request,
        direction
    );

    const engineeringRange = determineEngineeringRange(
        branches,
        direction
    );

    if (inputValue < engineeringRange.minimum) {
        assessment.result.status =
            AssessmentStatus.BELOW_MINIMUM;
        return null;
    }
    
    if (inputValue > engineeringRange.maximum) {
        assessment.result.status =
            AssessmentStatus.ABOVE_MAXIMUM;
        return null;
    }
    
    const matchingBranches =
        branches.filter(branch =>
            matchesBranch(
                branch,
                request,
                direction
            )
        );

    if (matchingBranches.length === 0) {
        const inputValue = determineInputValue(request, direction);
        throw new Error(
            `No matching branch found for distance rule ${distanceRule.id} during ${direction} calculation. Input value: ${inputValue}.`
        )
    }

    if (matchingBranches.length > 1) {
        const branchIds =
            matchingBranches.map(branch => branch.id).join(", ");
        throw new Error(
            `Multiple matching branches found for distance rule ${distanceRule.id}. Matching branches: ${branchIds}.`
        )
    }

    return matchingBranches[0];
}

function determineEngineeringRange(
    branches,
    direction
) {
    const ranges =
        branches
            .map(branch => determineBranchRange(branch, direction))
            .filter(range => range !== undefined);

    if (ranges.length === 0) {
        throw new Error(
            `No ${direction} branch ranges defined.`
        );
    }
    const minimum =
        Math.min(
            ...ranges.map(range =>
                range.gte ?? range.gt
            )
        );
    const maximum =
        Math.max(
            ...ranges.map(range =>
                range.lte ?? range.lt
            )
        );
    return {
        minimum,
        maximum
    };
}

function matchesBranch(
    branch,
    request,
    direction
) {

    return matchesRange(
        determineInputValue(request, direction),
        determineBranchRange(branch, direction)
    );

}

function matchesRange(
    value,
    range
) {

    if (!range) {
        return true;
    }

    if (
        range.gt !== undefined &&
        !(value > range.gt)
    ) {
        return false;
    }

    if (
        range.gte !== undefined &&
        !(value >= range.gte)
    ) {
        return false;
    }

    if (
        range.lt !== undefined &&
        !(value < range.lt)
    ) {
        return false;
    }

    if (
        range.lte !== undefined &&
        !(value <= range.lte)
    ) {
        return false;
    }

    return true;

}

function determineInputValue(
    request,
    direction
) {

    if (direction === "forward") {
        return request.neq;
    }

    return request.distance;

}

function resolveExpression(
    formula,
    branch,
    direction
) {

    const expression =
        direction === "forward"
            ? (branch.forwardExpression ?? formula.forwardExpression)
            : (branch.reverseExpression ?? formula.reverseExpression);

    if (expression === undefined) {
        throw new Error(
            `No ${direction} expression defined for branch ${branch.id}.`
        );
    }

    return expression;

}

function resolveParameters(
    formula,
    branch,
    direction
) {

    const parameters =
        formula.parameters?.[direction];

    if (!parameters) {
        throw new Error(
            `No ${direction} parameters defined for formula ${formula.id}.`
        );
    }

    return {
        ...parameters,
        ...branch.parameters
    };

}

function resolveTransformations(
    distanceRule,
    direction
) {

    const transformations =
        distanceRule.transformations?.[direction];

    if (!Array.isArray(transformations)) {
        throw new Error(
            `No ${direction} transformations defined for distance rule ${distanceRule.id}.`
        );
    }

    return transformations;
}

function determineBranchRange(
    branch, 
    direction
) {

    if (direction === "forward") {
        return branch.when?.neq;
    }
    return branch.result?.distance;
}

function resolveEngineeringUnits(
    formula,
    direction
) {

    const engineeringUnits =
        formula.engineeringUnits?.[direction];

    if (!engineeringUnits) {
        throw new Error(
            `No ${direction} engineering units defined for formula ${formula.id}.`
        );
    }

    return engineeringUnits;

}

function resolveSolvable(
    formula,
    direction
) {

    const solvable =
        formula.solvable?.[direction];

    if (solvable === undefined) {
        throw new Error(
            `No ${direction} solvable definition for formula ${formula.id}.`
        );
    }

    return solvable;

}

export default { resolve };