import createAssessment from "#services/assessments/assessment";
import { AssessmentStatus } from "#services/assessments/assessmentStatus";

/**
 * Creates a new assessment.
 *
 * The factory ensures every assessment begins with the same
 * structure and lifecycle state.
 */
function create(options = {}) {

    const assessment = createAssessment();

    assessment.id = options.id ?? null;

    assessment.type = options.type ?? null;

    assessment.request = options.request ?? null;

    assessment.interaction = options.interaction ?? null;

    assessment.effectId = options.effectId ?? null;

    assessment.outcome = options.outcome ?? null;

    assessment.result.status = AssessmentStatus.PENDING;

    return assessment;
}

export default { create };