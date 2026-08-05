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
export const INPUT_BASIS = Object.freeze({
    NEQ: "NEQ",
    MCE: "MCE"
});

export const INPUT_BASIS_VALUES = Object.freeze(
    Object.values(INPUT_BASIS)
);

export const ENGINEERING_STATUS = Object.freeze({
    N_A: "N_A",
    NO_QD: "NO_QD"
});

export const ENGINEERING_STATUS_VALUES = Object.freeze(
    Object.values(ENGINEERING_STATUS)
);