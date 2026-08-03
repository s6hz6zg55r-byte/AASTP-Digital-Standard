# VALIDATION_FRAMEWORK.md

**Project:** AASTP Digital Engineering Service  
**Document:** Validation Framework  
**Status:** Draft Version 1.0  
**Last Updated:** 3 August 2026

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