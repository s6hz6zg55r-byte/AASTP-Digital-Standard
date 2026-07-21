export function createInteractionDecision(data) {
    return {
        
        interactionId: data.interactionId,
        
        effectId: data.effectId,
        
        formulaId: data.formulaId,
        
        transformationIds: data.transformationIds
    };
}