# AASTP Digital Standard — Validation Framework

**Version:** 1.1  
**Status:** Governance baseline  
**Supersedes:** Validation Framework v1.0  
**Applies to:** Structured AASTP datasets, their schemas, validators, validation results, releases, and published API representations

## 1. Purpose

This framework governs validation for the digital representation of AASTP-1. Its purpose is to ensure that published structured data is traceable, internally consistent, and fit for use by the API, client applications, and external integrations.

Validation is an assurance mechanism; it does not create, infer, or alter AASTP requirements. The authoritative source for a rule remains the approved AASTP publication or an explicitly approved engineering decision that records how that rule is represented digitally.

The framework supports a long-lived, interoperable standard by making validation rules explicit, stable, testable, and independently reviewable.

## 2. Scope and non-scope

This framework defines:

- the responsibilities of four validation layers;
- the required structure of validation results;
- ownership and boundaries of validation and repository utilities;
- validator and diagnostic identifiers;
- the release assurance workflow; and
- governance expectations for changes.

It does not define ammunition safety rules, replace formal source review, or authorise a validator to repair data automatically. A validation result records an observed conformance condition; a data owner remains responsible for the correction and its source traceability.

## 3. Governing principles

The following principles apply to all validators, datasets, and releases.

1. **JSON is the authoritative digital data layer.** Narrative material is contextual knowledge, not a substitute for structured data.
2. **Data is separate from application logic.** Rules belong in validators or schemas, not hidden in API or client code.
3. **Rules must be explicit.** A validator must identify the requirement it tests and must not rely on undocumented assumptions.
4. **Identifiers are stable.** Dataset, record, validator, and diagnostic identifiers must remain stable where practical; changes require a documented migration path.
5. **References over duplication.** Validation must preserve normalised data structures and detect inconsistent repeated representations.
6. **No invented rules or values.** Missing, ambiguous, or disputed source information is escalated; it is not guessed by code.
7. **Backwards compatibility is deliberate.** Breaking changes require impact analysis, versioning, and an approved transition plan.
8. **Results are reproducible.** Given the same release candidate, validator version, and configuration, a validation run must produce materially the same results.

## 4. Validation architecture

Validation is performed in layers. Each layer has a distinct responsibility; later layers do not replace earlier ones.

| Layer | Responsibility | Typical evidence | Must not do |
| --- | --- | --- | --- |
| 1 — Document and syntax | Confirm files can be read and conform to basic JSON syntax and expected file conventions. | Parse errors, file location, encoding or manifest checks. | Interpret AASTP meaning. |
| 2 — Schema and structural integrity | Confirm required fields, types, formats, enumerations, IDs, and references conform to the approved schema. | Schema validation and reference-resolution results. | Apply policy or domain judgement not represented by the schema. |
| 3 — Dataset semantic integrity | Confirm relationships and constraints within and across datasets that express approved AASTP data rules. | Cross-record and cross-dataset rule results. | Infer a missing source value or silently modify data. |
| 4 — Release and integration assurance | Confirm the approved dataset release is coherent, fully validated, API-compatible, and suitable for publication. | Release manifest, aggregate result, compatibility and regression checks. | Treat a passing interface test as proof of source correctness. |

### 4.1 Layer execution

Layers should run in order. A layer may continue to report independent findings where useful, but a release cannot be accepted if an earlier-layer error prevents reliable interpretation of a later-layer result. Validation tooling must indicate when a check was not run or could not be evaluated.

### 4.2 Rule placement

- Syntax and file conventions belong in Layer 1.
- Approved schema constraints and referential structure belong in Layer 2.
- Approved relationships between records or datasets belong in Layer 3.
- Release completeness, compatibility, and delivery controls belong in Layer 4.

Placing a rule in the lowest appropriate layer improves feedback quality and prevents duplicate, conflicting implementations.

## 5. Validation results

Every validator must emit results using the `ValidationResult` contract. This enables consistent reporting through command-line tools, CI, APIs, dashboards, and future consumers.

### 5.1 `ValidationResult` contract

```json
{
  "validatorId": "L2.SCHEMA.RECORD",
  "code": "E2-SCHEMA-001",
  "severity": "error",
  "message": "Record does not conform to the approved schema.",
  "location": {
    "datasetId": "<dataset-id>",
    "file": "<relative-path>",
    "pointer": "/<json-pointer>"
  },
  "ruleReference": "<approved-rule-or-schema-reference>",
  "expected": "<optional expected condition>",
  "actual": "<optional observed value>",
  "relatedLocations": [],
  "runId": "<validation-run-id>"
}
```

Required fields are `validatorId`, `code`, `severity`, `message`, and `location`. `location.file` is required when a finding relates to a repository file; `location.pointer` uses JSON Pointer when the finding relates to a JSON value. Optional fields must be omitted when unavailable—never populated with invented values.

`severity` is one of:

- `error`: non-conformance that prevents release acceptance unless an approved exception is recorded.
- `warning`: a governed advisory finding that does not itself prevent release acceptance.
- `info`: an informational observation, not a conformance failure.

Human-readable messages must explain the observed condition without embedding business logic that is absent from the linked rule. Machine processing must use `code`, not message text.

### 5.2 Aggregate run result

A validation run must also produce an aggregate record containing the run identifier, dataset release identifier or commit, validator package version, execution timestamp, layer status, totals by severity, and whether the run is eligible for release. This aggregate record is release evidence and must be retained with the release artefacts.

## 6. Utility boundaries and implementation responsibilities

Repository utilities and validator utilities are separate modules with separate responsibilities.

**Repository utilities** provide general, domain-neutral operations: locating files, reading JSON, resolving repository paths, loading manifests, calculating checksums, and reporting repository-wide operational failures. They must not decide AASTP conformance.

**Validator utilities** provide validation-specific operations: creating `ValidationResult` objects, evaluating schema or rule predicates, resolving data references for validation, grouping results, and producing aggregate run records. They must not conceal file-system behaviour or mutate authoritative data.

Validators are small, reusable, and preferably pure functions. They receive explicit inputs and configuration, return results, and do not write to source datasets. Any exception to this boundary requires an approved architecture decision.

## 7. Repository release workflow

1. A proposed data change is submitted with source traceability and any required schema, validator, and documentation changes.
2. Repository checks and Layers 1–3 run against the proposed change. Errors are corrected or addressed through an approved, time-bounded exception.
3. Regression tests confirm that validators and public data representations remain compatible as intended.
4. Layer 4 assembles release evidence: release identifier, data manifest, validator versions, aggregate results, compatibility statement, and approvals.
5. An authorised maintainer reviews the evidence and marks the release accepted or rejected.
6. Only an accepted, immutable release is published to the API distribution process. Published releases retain their validation evidence and provenance.

Emergency corrections follow the same validation requirements. Expedited review may reduce elapsed time; it does not waive evidence, traceability, or release identification.

## 8. Governance, change control, and exceptions

Changes to schemas, data rules, validator behaviour, result contracts, diagnostic codes, or release gates must be reviewed as governed changes. The change record must state the reason, affected datasets and consumers, compatibility impact, migration approach where needed, and tests proving the intended outcome.

An exception must identify the affected release and finding, owner, justification, compensating control, approver, and expiry or review date. Exceptions are not permanent suppressions and do not change the underlying rule.

Deprecated identifiers, codes, and fields remain documented until all supported consumers have completed their migration. Removal requires an approved compatibility decision.

## 9. Documentation requirements

Every validator and major validation component must document:

- purpose and the approved rule or source reference;
- inputs, outputs, and dependencies;
- examples of conforming and non-conforming conditions;
- failure modes and emitted diagnostic codes; and
- foreseeable extension points or compatibility constraints.

Tests must cover the accepted condition, expected failures, boundaries, and known regression cases. A rule change without corresponding tests and documentation is incomplete.

## Annex A — Validator Identifier Convention

### A.1 Format

Validator identifiers use the format:

```text
L<layer>.<domain>.<name>
```

Where:

- `<layer>` is `1`, `2`, `3`, or `4`;
- `<domain>` is a concise, stable uppercase functional domain; and
- `<name>` is a concise, stable uppercase validator name.

Examples:

```text
L1.JSON.PARSE
L2.SCHEMA.RECORD
L2.REFERENCE.RESOLVE
L3.DATASET.CROSS_REFERENCE
L4.RELEASE.COMPATIBILITY
```

Identifiers name validators, not individual findings. A validator may emit more than one diagnostic code. Names must not embed edition dates, filenames, or mutable implementation details. A renamed validator is a new identifier; the predecessor and migration rationale must be documented.

### A.2 Allocation

New identifiers are allocated through reviewed source control with a documented purpose and layer. Reuse of a retired identifier for different behaviour is prohibited.

## Annex B — Validation Error and Warning Code Convention

### B.1 Format

Diagnostic codes use the format:

```text
<class><layer>-<namespace>-<sequence>
```

Examples:

```text
E1-JSON-001
E2-SCHEMA-014
E3-REFERENCE-006
E4-RELEASE-002
W2-QUALITY-001
W3-TRACEABILITY-004
```

`<class>` is `E` for errors, `W` for warnings, or `I` for informational observations. `<layer>` is the responsible validation layer. `<sequence>` is a zero-padded, stable three-digit number within the namespace.

### B.2 Error codes

Error codes identify a failure of an approved requirement. Their namespace must describe the governed concern, such as `JSON`, `SCHEMA`, `REFERENCE`, `DATASET`, or `RELEASE`. An error code must link to a validator and an approved rule, schema constraint, or release control.

### B.3 Governed warning namespaces

Warnings are reserved for documented advisory conditions. Warning namespaces are governed to prevent warning output becoming an unreviewed second class of rules. The initially recognised namespaces are:

| Namespace | Permitted purpose |
| --- | --- |
| `QUALITY` | Data-quality signals that do not demonstrate non-conformance to an approved rule. |
| `TRACEABILITY` | Incomplete or weak provenance metadata that does not invalidate the represented source requirement. |
| `COMPATIBILITY` | A documented future consumer-impact risk during an approved transition. |
| `DEPRECATION` | Use of a supported but scheduled-for-removal identifier, field, or representation. |

New warning namespaces require governance approval, a documented owner, a release disposition policy, and a statement explaining why the condition is not an error. A warning must never be used to bypass a known conformance failure. If a warning becomes a release gate, it must be promoted to an error code through normal change control.

### B.4 Code lifecycle

Codes are never reassigned to a different meaning. A retired code remains documented with its status and replacement, if any. Code registries must be version-controlled and published with the validator package or governance documentation.

## Annex C — Dataset Code Registry (placeholder)

This annex is reserved for the governed registry of stable dataset codes, names, ownership, scope, schema version, and deprecation status. It will define allocation and retirement procedures before dataset codes are relied on by external integrations.

## Annex D — Engineering Status Registry (placeholder)

This annex is reserved for the governed registry of engineering and publication statuses used across data, validation, release, and API processes. It will define permitted values, meanings, transitions, owners, and API representation before those statuses are treated as interoperable contract values.

## 10. Future extension points

This framework is intended to accommodate future AASTP chapters, additional datasets, stronger provenance controls, signed release artefacts, and published machine-readable validator and diagnostic registries. Such extensions must preserve the principles and boundaries in this document and be introduced through governed, versioned change.



---
# Recommended updated that should be incorporated

1. I think we've just arrived at another governance principle for the Validation Framework:
Validation statistics should record the number of validation operations performed rather than the number of repository objects defined.

That distinction might seem subtle, but it's important. It means the statistics quantify the validator's work, not the repository's contents. As your validators become more sophisticated—particularly those that validate branches, formulas, transformations and engineering relationships—that definition will remain meaningful and comparable across all validation layers.

2. These validation codes have been demonstrated to effectively detect real data defects. As we go forward I would like this to be included so we can demonstrate efficacy.
| Code | Status |
|------|--------|
| DR004 | ✓ Verified against repository defect |
| DR006 | ✓ Verified against repository defect |
We'll probably need to introduce artificial errors to test them all.

3. validationConstants.js is the authoritative register of validation error and warning codes. The Governance documentation reproduces this register for publication purposes but is not maintained independently during active development.

4. The following annexes need to be developed:
- Validator Catalog
. Validator ID
. Layer
. Dataset
. Purpose

- Error and Warning Code Register
. Code
. Severity (Error/Warning)
. Validator it relates to
. Description

- Validation Statistics Catalogue
. Every statistics field produced by each validator
. Definition
. Reporting purposes

- The following validator design principles have been developed:
. Each validator should answer a single engineering question.

. Each validation phase should answer a single validation question.

. Engineering knowledge belongs in governed constants or repository data.

. Validators should validate engineering rules, not define them.

. Shared helpers should only be introduced where they materially improve clarity, consistency or maintainability.

. Repository complexity should reflect engineering complexity.

. Reference repositories should remain simple.

. Engineering repositories should explicitly model engineering behaviour.

. Validation should progress from:
    Structure
        ↓
    Completeness
        ↓
    Syntax
        ↓
    Engineering Semantics
        ↓
    Repository Consistency

- Overview and concept behind two types of Level 2 Validators
Layer 2 Validator Types
Reference Repository Validators
Reference repository validators assure the integrity of repositories that define engineering concepts rather than engineering behaviour. Their primary purpose is to ensure that reference data is complete, uniquely identifiable, traceable to the source publication and internally consistent. Typical examples include Protection Levels, Constraints, Orientation Types and ES/PES Types.
Typical validation progression:
Repository Structure
        ↓
Engineering Definitions
        ↓
Controlled Vocabulary (where applicable)
        ↓
Engineering Traceability
        ↓
Repository Consistency
Engineering Repository Validators
Engineering repository validators assure repositories that define engineering logic or calculations. In addition to repository integrity, they validate engineering behaviour, calculation definitions, parameter contracts and relationships with other engineering repositories. Typical examples include Distance Rules, Formulas, Effects and Interactions.
Typical validation progression:
Repository Structure
        ↓
Engineering Definitions
        ↓
Engineering Behaviour
        ↓
Engineering References
        ↓
Engineering Consistency
        ↓
Repository Consistency

- The following concept should be incorporated into this governance document:
Engineering validators should be designed to expose ambiguities in the engineering model rather than simply identify syntactic errors. Where a validator highlights an inconsistency between the model and the data, the preferred outcome is to improve the engineering model or repository rather than weaken the validation rules, unless a genuine business requirement for flexibility exists.