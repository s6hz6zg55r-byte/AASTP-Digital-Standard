/**
 * ============================================================================
 * Validation Constants
 * ============================================================================
 *
 * Shared validation constants used throughout the engineering services,
 * validators and calculation engine.
 *
 * These values represent controlled vocabularies rather than repository
 * datasets.
 *
 * ============================================================================
 */
export const VALIDATION_LAYER = Object.freeze({

    SCHEMA: 1,

    REPOSITORY: 2,

    BUSINESS_RULE: 3,

    ENGINEERING: 4

});

// Define the expression owner constants for formulas and distance rules
// This is used in formulas.json to indicate which repository owns the expression for a given formula
export const EXPRESSION_OWNER = Object.freeze({

    FORMULAS: "formulas",

    DISTANCE_RULES: "distanceRules"

});

/**
 * Validation Framework Constants
 *
 * Purpose:
 * Central definition of validator identifiers,
 * governed error codes and warning codes.
 *
 * Referenced by all repository validators.
 */

export const VALIDATORS = {

    DISTANCE_RULES_SCHEMA: "VAL-L1-DR-001",

    REPOSITORY_REFERENCES: "VAL-L2-REF-001",

    DISTANCE_RULES_REPOSITORY: "VAL-L2-DRR-001",

    // future validators...
};

export const ERROR_CODES = {

    //
    // validateReferences()
    //

    REF001: "Unknown Orientation Type Reference.",
    
    REF002: "Unknown Structure Reference.",

    REF003: "Unknown PES Type Reference.",

    REF004: "Unknown ES Type Reference.",
    
    REF005: "DEPRECATED: Unknown Interaction Reference.",
    
    REF006: "Unknown Effect.",

    REF007: "Unknown Hazard Category.",

    REF008: "Unknown Constraint.",

    REF009: "Unknown Distance Rule.",
    
    REF010: "Unknown Protection Level.",

    REF011: "Unknown ECM Protection Rating.",

    ENG001: "Missing/Conflicting Definition.",

    ENG002: "Missing Input Basis.",
    
    ENG003: "Missing Protection Level.",
    
    ENG004: "Invalid Input Basis.",

    ENG005: "Invalid Status.",

    ENG006: "Duplicate Hazard, Protection Level, Constraint Definitions within Effect.",
    
    // future error codes...

    //
    // validateDistanceRuleStructure()
    //

    DR001: "Duplicate Distance Rule ID.",

    DR002: "Duplicate Distance Rule Name.",

    DR003: "Distance Rule Contains No Branches.",

    DR004: "Calculation Object Missing.",

    DR005: "Applicability Definition Missing.",

    DR006: "Traceability Definition Missing.",


    //
    // validateBranchStructure()
    //

    DR010: "Duplicate Branch ID.",

    DR011: "Branch ID Does Not Derive From Parent Rule.",

    DR012: "Invalid Branch Sequence.",

    //
    // validateEngineeringReferences()
    //

    DR020: "Unknown Formula Reference.",

    DR021: "Unknown Forward Transformation.",

    DR022: "Unknown Reverse Transformation.",

    //
    // Validate Branch Applicability
    //

    DR030: "First Branch Has No Lower Bound.",

    DR031: "Final Branch Has No Upper Bound.",

    DR032: "Gap Betweeen Consecutive Branches.",

    DR033: "Branch Applicability Overlap.",

    DR034: "Branch Ordering Inconsistent wtih Applicability",

    //
    // Validate Distance Rule Transformations
    //

    DR050: "Unknown Forward Transformation.",

    DR051: "Unknown Reverse Transformation.",

    DR052: "Duplicate Transformation Reference.",

    DR053: "Forward Transformations is not an Array.",

    DR054: "Reverse Transformations is not an Array.",

    DR055: "Transformation Container is Missing.",

    //
    // Formula Structure Validation
    //

    FM001: "Duplicate Formula ID.",

    FM002: "Duplicate Formula Code.",

    FM003: "Duplicate Formula Name.",

    FM004: "Missing Mandatory Property.",

    //
    // Formula Solvability Validation
    //

    FM010: "Missing Forward Solvability.",

    FM011: "Missing Reverse Solvability.",
    
    FM012: "Invalid Forward Solvability.",
    
    FM013: "Invalid Reverse Solvability.",

    //
    // Validate Engineering Units
    //

    FM020: "Missing Forward Engineering Units.",

    FM021: "Missing Reverse Engineering Units.",

    FM022: "Missing Forward Input Unit.",
    
    FM023: "Missing Forward Output Unit.",
    
    FM024: "Missing Reverse Input Unit.",
    
    FM025: "Missing Reverse Output Unit.",

    //
    // Validate Parameter Contract
    //

    FM030: "Missing Forward Parameter Contract.",

    FM031: "Missing Reverse Parameter Contract.",

    FM032: "Missing Forward Input Parameter.",
    
    FM033: "Missing Forward Output Parameter.",
    
    FM034: "Missing Reverse Input Parameter.",
    
    FM035: "Missing Reverse Output Parameter.",

    //
    // Validate Engineering Expressions
    //

    FM040: "Missing Forward Engineering Expression.",
    
    FM041: "Missing Reverse Engineering Expression.",

    FM042: "Invalid Forward Engineering Expression.",
    
    FM043: "Invalid Reverse Engineering Expression.",

    FM044: "Invalid Expression Owner.",

    //
    // Validate Formula Consistency
    //

    FM050: "Forward Definition Inconsistent with Solvability.",

    FM051: "Reverse Definition Inconsistent with Solvability.",

    FM052: "Expression Defined by Incorrect Owner.",


};

export const WARNING_CODES = {

    DRW001:
        "Engineering note missing.",

    DRW002:
        "Rule has no transformations."
};

export const SCHEMA_ERROR_CODES = {

    SCH001: {
        severity: "ERROR",
        description: "JSON Schema validation failure."
    }

}