/**
 * ============================================================================
 * Engineering Constants
 * ============================================================================
 *
 * Shared engineering constants used throughout the engineering services,
 * validators and calculation engine.
 *
 * These values represent controlled vocabularies rather than repository
 * datasets.
 *
 * ============================================================================
 */

/* To be adopted as a standard pattern for defining controlled vocabularies in the future:
export const XXX = Object.freeze({
    ...
});

export const XXX_VALUES = Object.freeze(
    Object.values(XXX)
);

INPUT_BASIS_VALUES
HAZARD_CATEGORY_VALUES
EFFECT_CATEGORY_VALUES
EXPOSURE_CATEGORY_VALUES
EXPOSURE_LEVEL_VALUES
ROOF_TYPE_VALUES
STRUCTURE_CATEGORY_VALUES

*/

export const INPUT_BASIS = Object.freeze({
    NEQ: "NEQ",
    MCE: "MCE"
});

export const INPUT_BASIS_VALUES = Object.freeze(
    Object.values(INPUT_BASIS)
);

export const HAZARD_CATEGORY = Object.freeze({

    HAZARD_DIVISION: "hazard_division",

    STORAGE_SUBDIVISION: "storage_subdivision"

});

export const HAZARD_CATEGORY_TYPES = Object.freeze(
    Object.values(HAZARD_CATEGORY)
);



/*
==============================================================================
Engineering Status
==============================================================================
*/
export const ENGINEERING_STATUS = Object.freeze({
    N_A: "N_A",
    NO_QD: "NO_QD"
});

export const ENGINEERING_STATUS_VALUES = Object.freeze(
    Object.values(ENGINEERING_STATUS)
);

/*
==============================================================================
Transformation Definitions
==============================================================================

Defines the supported Transformation functions and their expected parameter
contracts.

Referenced by:

- validateTransformationsRepository
- transformationEngine
- future engineering documentation

==============================================================================
*/
export const TRANSFORMATION_FUNCTIONS = {

    ceil: ["value"],

    floor: ["value"],

    max: ["value", "limit"]

};

/*
==============================================================================
Constraint Definitions
==============================================================================
*/
export const CONSTRAINT_CATEGORIES = [
    
    "mandatory",
    
    "advisory"

];

// Define the expression owner constants for formulas and distance rules
// This is used in formulas.json to indicate which repository owns the expression for a given formula
export const EXPRESSION_OWNER = Object.freeze({

    FORMULAS: "formulas",

    DISTANCE_RULES: "distanceRules"

});

export const STRUCTURE_CATEGORIES = [

    "explosives_facility",

    "personnel_facility",

    "transport_route",

    "vulnerable_structure",

    "utility",

    "infrastructure"

];

/**
 * Construction discriminators applicable to ES Types.
 */
export const ES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS = [

    "ecmProtectionRating",

    "headwall",

    "barricaded",

    "roofType"

];

/**
 * Construction discriminators applicable to PES Types.
 */
export const PES_SUPPORTED_CONSTRUCTION_DISCRIMINATORS = [

    "aperture",

    "barricaded",

    "roofType"

];

/**
 * Exposure discriminators applicable to ES Types.
 */
export const ES_SUPPORTED_EXPOSURE_DISCRIMINATORS = [

    "category",

    "level"

];

export const EXPOSURE_CATEGORIES = [

    "traffic_density",

    "occupancy",

    "criticality"
];

export const EXPOSURE_LEVELS = [

    "high",

    "medium",

    "low"

];

export const ROOF_TYPES = [
    
    "Protective",

    "Light"

];

export const EFFECT_CATEGORIES = [

    "blast_effect",

    "fragment_effect",

    "thermal_effect",

    "fire_effect",

    "local_effect"

];

export const ORIENTATION_TYPES = [

    "front",

    "side",

    "rear",

    "any"

];

export const INTERACTION_REFERENCE_TYPES = [

    "table_entry",

    "figure",

    "annex",

    "para"

];

export const RESOLUTION_OPERATORS = Object.freeze([

    "equals",

    "type_is"

]);

export const RESOLUTION_OUTCOME_TYPES = Object.freeze([

    "redundant_parameter",
    
    "non_applicable_parameter",
    
    "undefined_configuration"
]);

export const RESOLUTION_VALUE_TYPES = Object.freeze([

    "string",

    "number",

    "boolean",

    "null",

    "object",

    "array"

]);

export const PROPERTY_DERIVATION_SOURCES = Object.freeze([

    "exposure"

]);

export const RESOURCE_PROPERTY_ROLES = Object.freeze([

    "selectable",

    "informational"

]);