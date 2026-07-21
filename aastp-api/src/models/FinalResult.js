export function createFinalResult(data) {
    return {
        success: data.success ?? false,
        scenario: data.scenario ?? null,
        interactionDecision: data.interactionDecision ?? null,
        calculation: data.calculation ?? null,
        trace: data.trace ?? createDecisionTrace(),
        messages: data.messages ?? []
    };
}