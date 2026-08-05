# VALIDATION_FRAMEWORK.md

**Project:** AASTP Digital Engineering Service  
**Document:** Validation Framework  
**Status:** Draft Version 1.0  
**Last Updated:** 4 August 2026

---

# 1. Purpose

The Validation Framework defines the processes used to verify the integrity, consistency and engineering correctness of the AASTP Digital Repository.

Unlike the traditional AASTP publication, where engineering data exists solely as static printed tables, the digital repository is intended to become a machine-readable engineering standard. As such, every published dataset shall be capable of automatically demonstrating its structural integrity, internal consistency and suitability for software processing.

Validation is therefore considered a mandatory architectural component rather than an optional development tool.

Every published release shall successfully complete all validation layers before being considered suitable for deployment.

---

# 2. Objectives

The Validation Framework exists to ensure that:

- JSON datasets conform to their published schemas.
- Repository references are internally consistent.
- Engineering data is mathematically coherent.
- Engineering calculations can be executed safely.
- Repository releases are repeatable and deterministic.
- Future contributors can modify the repository with confidence.
- Validation reports provide objective evidence of repository quality.

---

# 3. Design Principles

The Validation Framework follows the following principles.

## Validation is Mandatory

Every repository release shall successfully pass every validation layer.

Repositories that fail validation shall not be released.

---

## Validation is Automated

Validation shall never rely upon manual inspection.

Every validation shall be executable from the command line.

---

## Validation is Deterministic

Running the validators multiple times against identical data shall always produce identical results.

---

## Validation is Read Only

Validators shall never modify repository data.

Validation scripts shall report errors only.

---

## Validation is Layered

Each validation layer has a clearly defined responsibility.

Individual validators shall avoid duplicating responsibilities already covered elsewhere.

---

## Validation is Extensible

New validation rules shall be added without modifying existing validation architecture wherever practical.

---

## Validation Supports Governance

Validation reports form part of the repository's engineering evidence.

Validation provides confidence that the digital implementation accurately represents the published engineering data.

---

## Validation Enforces Identifier Types

Every referenced identifier type shall have exactly one definition in common.schema.json.

Dataset schemas shall reference those definitions rather than defining identifier formats locally.

---

## Validation Employs Governed Identifiers

All governed identifiers used by the Valdiation Framework - including Validator IDs, Validation Error Codes,
Repository Identifiers, Dataset codes and otehr namespace-controlled identifiers - shall be unique, stable,
non-reusable and maintained under version control. Once published, identifiers become part of the public
interface of the repository and shall be treated as backwards-compatible engineering artefacts.

---

# 4. Validation Architecture

The validation process consists of four independent layers.

```text
                 JSON Repository
                        │
                        ▼
        Layer 1 – Schema Validation
                        │
                        ▼
 Layer 2 – Repository Integrity Validation
                        │
                        ▼
     Layer 3 – Engineering Validation
                        │
                        ▼
 Layer 4 – Engineering Service Validation
                        │
                        ▼
            Validation Report
```

Each layer builds upon the guarantees provided by the previous layer.

---

# 5. Layer 1 – Schema Validation

## Purpose

Schema Validation verifies that every JSON document conforms to its published schema.

This layer verifies structural correctness only.

It does not interpret engineering meaning.

## Typical Validation

- Required properties exist.
- Property types are correct.
- Arrays contain valid objects.
- Enumerated values are valid.
- Required fields are populated.
- Unexpected structures are detected.

## Typical Failures

- Missing ID
- Invalid property type
- Missing required field
- Incorrect object structure

## Output

Schema Validation guarantees that every dataset is structurally valid JSON suitable for further processing.

---

# 6. Layer 2 – Repository Integrity Validation

## Purpose

Repository Integrity Validation verifies that all references within the repository are valid.

This layer confirms that the repository forms a complete and internally consistent dataset.

## Typical Validation

- Referenced IDs exist.
- Duplicate identifiers are detected.
- Cross-file references are valid.
- Formula references exist.
- Distance Rule references exist.
- Hazard references exist.
- Constraint references exist.
- Transformation references exist.
- Protection Level references exist.

## Typical Failures

- Missing reference
- Duplicate identifier
- Broken repository relationship

## Output

Repository Integrity Validation guarantees that every reference within the repository resolves successfully.

---

# 7. Layer 3 – Engineering Validation

## Purpose

Engineering Validation verifies that repository data represents coherent engineering information.

Unlike previous layers, Engineering Validation understands the engineering meaning of the data.

This layer provides confidence that engineering calculations can be performed safely.

## Typical Validation

### Distance Rules

- Branch sequencing
- Continuous branch coverage
- No branch overlaps
- Valid engineering ranges
- Formula consistency
- Transformation consistency
- Reverse branch availability
- Engineering unit consistency

### Formulae

- Expression compilation
- Parameter consistency
- Solvability consistency
- Engineering unit definitions
- Forward and reverse compatibility

### Interaction Rules

- Outcome consistency
- Duplicate hazard detection
- Valid engineering outcomes
- Constraint compatibility

### Other Repository Data

Engineering validation rules shall be added as future repository capabilities are introduced.

## Typical Failures

- Gap between branches
- Overlapping branches
- Invalid engineering units
- Inconsistent formula definitions
- Unsupported engineering relationships

## Output

Engineering Validation guarantees that repository data represents coherent engineering information.

---

# 8. Layer 4 – Engineering Service Validation

## Purpose

Engineering Service Validation verifies that validated repository data can be processed correctly by the Engineering Service.

This layer validates software behaviour rather than repository content.

## Scope

- Unit Tests
- Integration Tests
- Pipeline Testing
- Engineering Status Transitions
- Forward Calculations
- Reverse Calculations
- Boundary Conditions
- Error Handling
- State Machine Validation

## Typical Failures

- Incorrect pipeline sequencing
- Incorrect engineering status
- Calculation failures
- Formula evaluation failures
- Transformation failures

## Output

Engineering Service Validation guarantees that the repository can be processed correctly by the engineering engine.

---

# 9. Validation Report

Every validation execution shall generate a Validation Report.

The Validation Report provides objective evidence of repository quality.

A typical report shall include:

- Repository Version
- Validation Date
- Validation Result
- Layer 1 Summary
- Layer 2 Summary
- Layer 3 Summary
- Layer 4 Summary
- Test Statistics
- Overall Repository Status

Example:

```text
AASTP Digital Repository Validation Report

Repository Version:
1.0

Schema Validation
PASS

Repository Integrity Validation
PASS

Engineering Validation
PASS

Engineering Service Validation
PASS

Overall Repository Status
VALID
```

The Validation Report shall become part of the repository release artefacts.

---

# 10. Repository Release Process

Repository releases follow the sequence below.

```text
Repository Updated
        │
        ▼
Schema Validation
        │
        ▼
Repository Integrity Validation
        │
        ▼
Engineering Validation
        │
        ▼
Engineering Service Validation
        │
        ▼
Validation Report Generated
        │
        ▼
Repository Released
```

Repositories failing any validation stage shall not proceed to release.

---

# 11. Future Development

The Validation Framework is intended to expand alongside the repository.

Future validation capabilities may include:

- National tailoring validation
- Unit conversion validation
- API contract validation
- Version compatibility validation
- Continuous Integration (CI)
- GitHub Actions integration
- Digital signatures
- Release certification
- Performance validation
- Client compatibility validation

The layered architecture is specifically intended to allow additional validation capabilities without affecting existing validators.

---

# 12. Conclusion

Validation is a fundamental component of the AASTP Digital Engineering Service.

Rather than relying upon manual inspection, the repository is capable of demonstrating its own structural integrity, engineering consistency and operational correctness through automated validation.

The Validation Framework therefore provides one of the principal advantages of the digital implementation over traditional static engineering tables.

As the repository evolves beyond Chapter 1, the Validation Framework will continue to expand, providing a scalable, repeatable and transparent mechanism for assuring engineering quality across future editions of AASTP.

---

## Validation Error Code Convention

### Purpose

Validation error codes provide a consistent, traceable mechanism for identifying repository issues detected during validation.

Each validation error shall contain:

- **Error Code** — Identifies the type of validation failure.
- **Location** — Identifies the repository object where the failure occurred.
- **Message** — Human-readable description of the issue.

Validation error codes are distinct from **Validator IDs**.

- **Validator IDs** identify *which validator* detected an issue.
- **Error Codes** identify *what type of issue* was detected.

This separation allows the same error type to be detected by multiple validators while maintaining full traceability.

---

## Validation Error Structure

All validation errors shall conform to the following structure.

```javascript
{
    code: "DR001",

    location: "BD03_A",

    message: "Unknown formula 'FORM999'."
}
```

| Field | Purpose |
|--------|---------|
| `code` | Repository-specific validation error code. |
| `location` | Repository object where the issue occurred. |
| `message` | Human-readable description suitable for reports. |

Additional fields may be introduced in future versions (for example `severity`, `recommendation`, or `field`) without changing the overall structure.

---

# Validator IDs vs Error Codes

Validator IDs and Error Codes serve different purposes.

Example:

```
Validator
---------
VAL-L2-DR-001

Validation Error
----------------
DR002
```

Meaning:

- **VAL-L2-DR-001**
  - Layer 2 validator
  - Distance Rules
  - Repository Integrity

- **DR002**
  - Unknown Formula Reference

A validator may report multiple different error codes.

Likewise, the same error code may be detected by multiple validators.

---

## Error Code Prefixes

Each repository dataset shall own its own error code namespace.

| Prefix | Dataset |
|---------|----------|
| DR | Distance Rules |
| FM | Formulas |
| IN | Interactions |
| EF | Effects |
| HC | Hazard Categories |
| ES | Explosive Store Types |
| PS | Potential Explosion Site Types |
| PL | Protection Levels |
| TR | Transformations |
| CS | Constraints |
| OR | Orientations |
| RF | References / Traceability |

Additional prefixes shall be allocated as new repository datasets are introduced.

---

## Numbering Convention

Error codes shall use the format:

```
<Prefix><Number>
```

Examples:

```
DR001
DR002
FM001
TR003
PL002
```

Numbers should be allocated sequentially within each dataset.

Error codes shall remain stable once published to preserve backwards compatibility with validation reports and automated tooling.

---

## Allocation Principles

Validation error codes should describe the category of repository issue rather than the implementation that detected it.

For example:

| Code | Meaning |
|------|---------|
| DR001 | Duplicate Distance Rule ID |
| DR002 | Unknown Formula Reference |
| DR003 | Unknown Transformation Reference |
| DR004 | Duplicate Branch ID |
| DR005 | Duplicate Branch Sequence |

Future validators should reuse existing error codes wherever applicable rather than creating duplicate meanings.

---

## Governance

Validation error codes form part of the AASTP Validation Framework and shall be treated as governed identifiers.

Once published:

- Error codes should not be renumbered.
- Existing meanings should not change.
- Deprecated codes should remain reserved.
- New codes should be appended sequentially.

This approach ensures long-term stability of validation reports, automated tooling, and future integrations.

---

## Validator Identifier (Validator ID) Convention

### Purpose

Validator Identifiers (Validator IDs) provide a permanent, governed identifier for every validator within the AASTP Validation Framework.

Each validator shall possess a unique Validator ID that remains stable throughout the lifetime of the project.

Validator IDs provide traceability between:

- Validation reports
- Source code
- Repository documentation
- Automated validation pipelines
- Continuous Integration (CI) systems
- Future conformance testing

Validator IDs identify **which validator** detected an issue.

They do **not** identify the type of issue detected.

Issue classification is the responsibility of Validation Error Codes.

---

## Validator Identifier Structure

All Validator IDs shall conform to the following format:

```text
VAL-L<Layer>-<Dataset>-<Number>
```

Where:

| Component | Purpose |
|-----------|---------|
| `VAL` | Validation Framework prefix |
| `L<Layer>` | Validation Layer (1–4) |
| `<Dataset>` | Dataset or validation domain |
| `<Number>` | Sequential validator number within the dataset and layer |

Example:

```text
VAL-L2-DR-001
```

Meaning:

- Validation Framework
- Layer 2 (Repository Integrity)
- Distance Rules
- Validator 001

---

## Dataset Codes

Each repository dataset shall be allocated a permanent dataset code.

| Dataset | Code |
|----------|------|
| Distance Rules | DR |
| Formulas | FM |
| Interactions | IN |
| Effects | EF |
| Hazard Categories | HC |
| Explosive Store Types | ES |
| Potential Explosion Site Types | PS |
| Protection Levels | PL |
| Transformations | TR |
| Constraints | CS |
| Orientations | OR |
| References / Traceability | RF |
| Engineering Service | ENG |
| Repository | REP |

Additional dataset codes may be introduced as the repository expands.

Dataset codes shall remain stable once published.

---

## Validation Layers

The Validation Framework consists of four architectural layers.

| Layer | Description |
|--------|-------------|
| L1 | Schema Validation |
| L2 | Repository Integrity Validation |
| L3 | Engineering Validation |
| L4 | Service Validation |

Validator IDs shall always reference the layer in which the validator operates.

Validators shall not span multiple layers.

---

## Number Allocation

Validator numbers shall be allocated sequentially within each dataset and layer.

Examples:

```text
VAL-L1-DR-001
VAL-L1-DR-002
VAL-L2-DR-001
VAL-L2-DR-002
VAL-L3-DR-001
```

Numbers shall never be reused.

Deprecated validators shall retain their allocated identifier.

Future validators shall receive the next available sequential number.

---

## Validator Metadata

Every validator shall expose metadata describing its identity.

Example:

```javascript
export const validator = {

    id: "VAL-L2-DR-001",

    layer: 2,

    dataset: "distance_rules",

    name: "Distance Rules Repository Integrity"

};
```

This metadata forms part of the Validation Result returned by every validator.

---

## Validation Result Traceability

Every Validation Result shall include the validator metadata.

Example:

```javascript
{
    validator: {

        id: "VAL-L2-DR-001",

        layer: 2,

        dataset: "distance_rules",

        name: "Distance Rules Repository Integrity"

    },

    passed: true,

    statistics: {

        recordsChecked: 58

    },

    errors: [],

    warnings: []

}
```

This enables every validation report to identify precisely which validator produced each result.

---

## Governance Principles

Validator IDs are governed identifiers.

Once allocated:

- Validator IDs shall never be renumbered.
- Validator IDs shall never be reused.
- Validator names may evolve to improve clarity.
- Validator behaviour may evolve as repository standards develop.
- Deprecated Validator IDs shall remain permanently reserved.

Maintaining stable Validator IDs ensures that validation reports remain traceable across repository versions and supports long-term compatibility with automated tooling and future international standardisation.

---

## Relationship to Validation Error Codes

Validator IDs and Validation Error Codes perform complementary functions.

| Identifier | Purpose |
|------------|---------|
| Validator ID | Identifies **which validator** detected an issue. |
| Validation Error Code | Identifies **what issue** was detected. |

Example:

```text
Validator
---------
VAL-L2-DR-001

Validation Error
----------------
DR002

Meaning
-------
Layer 2 Repository Integrity Validator detected an Unknown Formula Reference.
```

This separation of responsibilities provides clear traceability while avoiding duplication of information within validation reports.