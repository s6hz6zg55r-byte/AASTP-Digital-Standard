export function createCalculationResult(data) {
    return {
        // Three types are supported: "quantity-distance", "maximum-neq", "validation"
        type: data.type,

        // Inputs detail what values were used. typically it will be an object that will contain one or more value (i.e. neq and distance)
        inputs: data.inputs,

        // Formula is an object containing all the information the engine used in the calculation.
        // For example {id, baseFormula, scaling factor}
        formula: data.formula,

        // Intermediate is the raw results or values that will support traceability
        // For example {rawValue, cubeRoot, rawNEQ}
        intermediate: data.intermediate,
        
        // Transformations is an array that will list all transformations that are applied to the result. A calculation may have no transformations, one or several.
        // {    id: "TR001",
        //      description: "Round to nearest metre"
        // },
        // {    id: "TR004",
        //      description: "Apply minimum distance"
        // }
        transformations: data.transformations,

        // Result gives the value and units of the calculation output 
        result: data.results
        
    };
}