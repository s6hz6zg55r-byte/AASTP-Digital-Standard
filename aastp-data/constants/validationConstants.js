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

export const VALIDATION_LAYER_NAMES = Object.freeze({

    1: "Schema Validation",

    2: "Repository Validation",

    3: "Business Rule Validation",

    4: "Engineering Validation"

});

export const VALIDATION_RESULT_STATUS = Object.freeze({
    PASS: "PASS",
    FAIL: "FAIL"
});

export const VALIDATION_SEVERITY = Object.freeze([
    "ERROR",
    "WARNING"
]);

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

    CONSTRAINTS_SCHEMA: "VAL-L1-CV-001",

    CONSTRAINTS_REPOSITORY: "VAL-L2-CV-001",
    
    DISTANCE_RULES_SCHEMA: "VAL-L1-DR-001",

    DISTANCE_RULES_REPOSITORY: "VAL-L2-DR-001",

    ECM_PROTECTION_RATINGS_SCHEMA: "VAL-L1-PR-001",

    ECM_PROTECTION_RATINGS_REPOSITORY: "VAL-L2-PR-001",

    EFFECTS_SCHEMA: "VAL-L1-EF-001",

    EFFECTS_REPOSITORY: "VAL-L2-EF-001",

    ES_TYPES_SCHEMA: "VAL-L1-ES-001",

    ES_TYPES_REPOSITORY: "VAL-L2-ES-001",
    
    FORMULAS_SCHEMA: "VAL-L1-FM-001",

    FORMULAS_REPOSITORY: "VAL-L2-FM-001",

    HAZARD_CATEGORIES_SCHEMA: "VAL-L1-HC-001",

    HAZARD_CATEGORIES_REPOSITORY: "VAL-L2-HC-001",
    
    INTERACTIONS_SCHEMA: "VAL-L1-INT-001",

    INTERACTIONS_REPOSITORY: "VAL-L2-INT-001",

    ORIENTATION_TYPES_SCHEMA: "VAL-L1-OR-001",

    ORIENTATION_TYPES_REPOSITORY: "VAL-L2-OR-001",
    
    PES_TYPES_SCHEMA: "VAL-L1-PES-001",

    PES_TYPES_REPOSITORY: "VAL-L2-PES-001",

    PROTECTION_LEVELS_SCHEMA: "VAL-L1-PL-001",

    PROTECTION_LEVELS_REPOSITORY: "VAL-L2-PL-001",

    RESOURCE_RESOLUTION_RULES_SCHEMA: "VAL-L1-RRR-001",
    
    RESOURCE_RESOLUTION_RULES_REPOSITORY: "VAL-L2-RRR-001",

    RESOURCE_PROPERTY_SEMANTICS_SCHEMA: "VAL-L1-RPPS-001",

    RESOURCE_PROPERTY_SEMANTICS_REPOSITORY: "VAL-L2-RPPS-001",
    
    STRUCTURES_SCHEMA: "VAL-L1-ST-001",
    
    STRUCTURES_REPOSITORY: "VAL-L2-ST-001",

    TRANSFORMATIONS_SCHEMA: "VAL-L1-TR-001",
    
    TRANSFORMATIONS_REPOSITORY: "VAL-L2-TR-001",

    REPOSITORY_REFERENCES: "VAL-L2-REF-001"

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

    //
    // Validate Transformation Structure
    //

    TR001: "Duplicate Transformation ID.",

    TR002: "Duplicate Transformation Name.",

    TR003: "Missing Mandatory Property.",

    //
    // Validate Transformation Expressions
    //
    
    TR010: "Missing Transformation Expression.",

    TR011: "Invalid Transformation Expression.",

    //
    // Validate Transformation Syntax
    //

    TR020: "Invalid Transformation Expression Syntax.",

    TR021: "Invalid Parameter List.",

    //
    // Validate Function Contracts
    //

    TR030: "Unsupported Transformation Function.",

    TR031: "Invalid Parameter Count.",

    TR032: "Invalid Parameter Names.",

    //
    // Validate Transformation Consistency
    //

    TR040: "Repository Contains No Transformations.",

    //
    // Constraints Repository Structure
    //

    CV001: "Duplicate Constraint ID.",

    CV002: "Duplicate Constraint Code.",

    CV003: "Duplicate Constraint Name.",

    CV004: "Missing Mandatory ConstraintProperty.",

    //
    // Constraints Definitions
    //

    CV010: "Constraint Missing Description.",

    CV011: "Constraint Missing Source.",

    //
    // Constraint Vocabulary
    //

    CV020: "Unknown Constraint Category.",

    //
    // Constraint Source References
    //
    
    CV030: "Missing Source Document.",

    CV031: "Missing Source Paragraph.",

    //
    // Constraint Repository Consistency
    //

    CV040: "Repository Contains No Constraints.",

    //
    // Validate Protection Level Structure
    //

    PL001: "Duplicate Protection Level ID.",
    
    PL002: "Duplicate Protection Level Code.",
    
    PL003: "Duplicate Protection Level Name.",
    
    PL004: "Missing Mandatory Property.",

    //
    // Validate Protection Level Definitions
    //

    PL010: "Protection Level Missing Notes.",

    PL011: "Protection Level Missing Description.",

    //
    // Validate Engineering Traceability
    //

    PL020: "Protection Level Missing Source Document.",

    PL021: "Protection Level Missing Source Paragraph.",

    //
    // Validate Protection Level Repository Consistency
    //

    PL030: "Repository Contains No Protection Levels.",

    //
    // Validate Orientation Type Structure
    //

    OR001: "Duplicate Orientation Type ID.",
    
    OR002: "Duplicate Orientation Type Name.",

    OR003: "Missing Mandatory Property.",

    //
    // Validate Orientation type Definitions
    //

    OR010: "Orientation Type Missing Values.",

    OR011: "Orientation Type Invalid Values.",

    //
    // Validate Engineering Traceability
    //

    OR020: "Orientation Type Missing Source Document.",
    
    OR021: "Orientation Type Missing Source Edition.",

    OR022: "Orientation Type Missing Source Chapter.",

    //
    // Validate Orientation Type Repository Consistency
    //

    OR030: "Repository Contains No Orientation Types.",

    //
    // Validate Structure Repository
    //

    ST001: "Duplicate Structure ID.",

    ST002: "Duplicate Structure Code.",

    ST003: "Duplicate Structure Name.",

    ST004: "Missing Mandatory Property.",

    //
    // Validate Structure Engineering Objects Definitions
    //

    ST010: "Invalid supportedProperties Definition.",

    ST011: "Invalid supportedExposure Definition.",

    //
    // Validate Controlled Vocabulary References
    //

    ST020: "Unknown Structure Category.",

    ST021: "Unknown Structure Type.",

    //
    // Validate Engineering Traceability
    //

    ST030: "Structure repository missing source standard.",

    ST031: "Structure repository missing source edition.",

    ST032: "Structure repository missing source chapter.",

    //
    // Validate Structure Repository Consistency
    //

    ST040: "Repository Contains No Structures.",

    //
    // Validate ES Types Repository Integrity
    //

    ES001: "Duplicate ES Type ID.",

    ES002: "Duplicate ES Type Name.",

    ES003: "Missing Mandatory Property.",

    //
    // Validate ES Types Structure Definitions
    //

    ES010: "Invalid construction definition.",
    
    ES011: "Invalid exposure definition.",

    //
    // Validate ES Types Governed Dependencies
    //

    ES020: "Unknown Structure Reference.",

    ES021: "Invalid Construction Applicability.",

    ES022: "Invalid Exposure Applicability.",

    ES023: "Invalid Construction Discriminator.",

    ES024: "Invalid Exposure Discriminator.",

    ES025: "Invalid Construction Value.",
    
    ES026: "Invalid Exposure Value.",

    //
    // Validate PES Repository Structure
    //
    
    PES001: "Invalid Repository Structure.",

    PES002: "Duplicate PES Type ID.",

    PES003: "Duplicate PES Type Name.",

    //
    // Validate PES Type Structure Definitions
    //

    PES010: "Invalid construction definition.",

    //
    // Validate PES Structures
    //

    PES020: "Unknown Structure Reference.",

    PES021: "Invalid Construction Applicability.",

    PES022: "Invalid Construction Discriminator.",

    PES023: "Invalid Governed Value.",

    //
    // Validate PES Engineering Traceability
    //

    PES030: "PES Missing Engineering Traceability.",

    //
    // Validate Effects Repository Structure
    //

    EFF001: "Invalid Repository Structure.",

    EFF002: "Duplicate Effect ID.",

    EFF003: "Duplicate Effect Code.",

    EFF004: "Duplicate Effect Name.",

    //
    // Validate Effect Engineering Definitions
    //

    EFF010: "Invalid Effect Definition.",

    //
    // Validate Effect Governed Values
    //

    EFF020: "Invalid Governed Value.",

    //
    // Validate Effect Engineering Traceability
    //

    EFF030: "Missing Engineering Provenance or Traceability.",

    //
    // Validate Hazard Categories Repository Structure
    //

    HAZ001: "Invalid Repository Structure.",

    HAZ002: "Duplicate Hazard Category ID.",

    HAZ003: "Duplicate Hazard Category Code.",

    HAZ004: "Duplicate Hazard Category Name.",

    //
    // Validate Hazard Categories Engineering Definitions
    //

    HAZ010: "Invalid Hazard Category Definition.",

    //
    // Validate Hazard Categories Governed Values
    //

    HAZ020: "Invalid Hazard Category Type.",

    HAZ021: "Invalid Parent Division.",

    HAZ022: "Invalid Effect Reference.",
    
    HAZ023: "Invalid Supported Quantity Basis.",

    //
    // Validate Hazard Categories Engineering Traceability
    //

    HAZ030: "Missing Engineering Provenance or Traceability.",

    //
    // Validate Interactions Repository Structure
    //

    INT001: "Invalid Repository Structure.",

    INT002: "Duplicate Interaction Identifier.",

    INT003: "Duplicate Interaction Configuration.",
    
    //
    // Validate Interactions Engineering Definitions
    //

    INT011: "Interaction must contain at least one effect definition.",

    INT012: "Effect must contain at least one hazard definition.",
    
    INT013: "Hazard definition missing hazard identifier.",
    
    INT014: "Calculated hazard missing required engineering properties.",
    
    INT015: "Non-calculated hazard contains calculation properties.",
    
    //
    // Validate Interactions Relationship Validity
    //
    
    INT020: "Invalid ES Type Reference.",

    INT021: "Invalid PES Type Reference.",

    INT022: "Invalid ES Orientation.",

    INT023: "Invalid PES Orientation.",

    INT024: "Invalid Effect Reference.",

    INT025: "Invalid Hazard Category Reference.",

    INT026: "Invalid Distance Rule Reference.",

    INT027: "Invalid Protection Level Reference.",

    INT028: "Invalid Constraint Reference.",

    //
    // Validate Engineering Traceability
    //

    INT030: "Missing Engineering Provenance or Traceability.",

    INT031: "Interaction Source Document Missing.",

    INT032: "Interaction Source Reference Missing.",

    INT033: "Invalid Interaction Reference Type.",

    //
    // Validate Interactions Repository Consistency
    //

    INT040: "Duplicate Hazard Outcome Within Effect.",

    INT041: "Empty Effect Defintion.",
    
    INT042: "Duplicate Constraint Reference.",

    //
    // Validate Resource Resolution Rules Repository Structure
    //

    RRR001: "Invalid Repository Structure.",

    RRR002: "Duplicate Resolution Rule ID.",

    //
    // Validate Resource Resolution Rules Engineering Definitions
    //
    
    RRR010: "Invalid Resolution Rule Definition.",

    RRR011: "Invalid Resolution Rule Predicate.",

    RRR012: "Invalid Resolution Rule Outcome.",

    RRR013: "Invalid Resolution Rule Canonical Assignment.",

    RRR014: "Invalid Canonical Target Definition.",

    //
    // Validate Resource Resolution Rules Governed Dependencies
    //

    RRR020: "Invalid Dataset Reference.",

    RRR021: "Invalid Resource Type Reference.",

    RRR022: "Invalid Structure Reference.",

    RRR023: "Invalid Property Reference.",

    RRR024: "Invalid Controlled Value.",

    RRR025: "Invalid Canonical Assignment.",

    RRR026: "Invalid Canonical Target Reference.",

    RRR027: "Canonical Target Does Not Match Canonical Configuration.",

    RRR028: "Property Not Applicable to Structure.",

    //
    // Validate Resource Resolution Rules Engineering Traceability
    //

    RRR030: "Missing Engineering Provenance or Traceability.",

    RRR031: "Missing Resolution Rationale.",

    RRR032: "Missing Resolution Source.",

    RRR033: "Missing Resolution Effective Date.",

    RRR034: "Approved Rule Contains Placeholder Governance Data.",

    //
    // Validate Resource Resolution Rules Repository Consistency
    //

    RRR040: "Duplicate Resolution Rule.",

    RRR041: "Overlapping Resolution Rules.",

    RRR042: "Ambiguous Resolution.",

    RRR043: "Rule Applies to Existing Exact Resource.",

    RRR044: "Canonical Resolution Is Not Unique.",

    //
    // Validate Resource Property Semantics Repository Structure
    //

    RPS001: "Empty Resource Property Semantics Repository.",

    RPS002: "Duplicate Resource Property.",

    RPS010: "Invalid Property Role.",
    
    RPS011: "Invalid Derivation Source.",

    RPS012: "Invalid Semantic Definition.",

    RPS013: "Unknown Resource Property."

};

export const WARNING_CODES = {

    DRW001: "Engineering note missing.",

    DRW002: "Rule has no transformations.",

    TRW001: "Duplicate Transformation Expression.",

    CVW001: "Duplicate Constraint Description.",

    PLW001: "Duplicate Protection Levels.",

    ORW001: "Duplicate Orientation Type Value Sets.",

    STW001: "Duplicate Structure Definitions.",

    ESW001: "Duplicate ES Type Definitions.",

    PESW001: "Duplicate PES Type Definitions.",

    EFFW001: "Duplicate Effect Definitions.",

    HAZW001: "Duplicate Hazard Category Definitions.",

    RRRW001: "Redundant Resolution Rule.",

    RRRW002: "Rule Never Matches Governed Configuration.",

    RRRW003: "Informational Property Used in Selection Condition." 


};

export const SCHEMA_ERROR_CODES = {

    SCH001: {
        severity: "ERROR",
        description: "JSON Schema validation failure."
    }

}

