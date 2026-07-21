export function createDecisionTrace(data = {}) {
    return {
        steps: data.steps || []
    };
}