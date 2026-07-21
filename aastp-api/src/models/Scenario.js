export function createScenario(data) {
    return {
        // hazardCategory is the ID of the hazardDivision array object (i.e. HD001) 
        hazardCategory: data.hazardCategory,
        // pesType is to be an array defining all characteristics of the PES required (i.e. orientation, physical attributes)
        pesType: data.pesType,
        // esType is to be an array defining all characteristsics of hte ES required (i.e. orientation, physical attributes, exposure)
        esType: data.esType,
        // These are the NEQ or distance to be used in a calculation (based on the units in the units object).
        // The parameter not given is to be null
        neq: data.neq,
        distance: data.distance,
        // protectionLevel may be given if a minimum protection level is stated. If not used this will be null
        protectionLevel: data.protectionLevel,
        // Units will be an array defining the input units for NEQ or distance
        units: data.units
    };
}