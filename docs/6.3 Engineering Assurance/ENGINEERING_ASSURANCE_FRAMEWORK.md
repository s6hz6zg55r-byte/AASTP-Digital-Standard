# Engineering Assurance Framework

## Purpose

The Engineering Assurance Framework provides confidence that the AASTP digital data model remains an accurate, consistent and authoritative representation of the engineering intent contained within AASTP-1.

The framework exists to ensure that engineering information can be trusted before it is consumed by applications, APIs, analytical tools or future national implementations.

Validation is therefore treated as an engineering assurance activity rather than a software quality activity.

---

# Engineering Assurance Philosophy

Traditional software validation asks a simple question:

> "Is the data valid?"

The AASTP Engineering Assurance Framework asks a more important question:

> "Can this engineering information be trusted?"

This distinction underpins the entire architecture of the project.

The objective is not merely to validate JSON syntax or repository structure. The objective is to demonstrate that every engineering object has been verified against the engineering rules defined by AASTP and the governed architecture of the digital engineering model.

---

# Why Validation Matters

The JSON repositories are intended to become the authoritative digital representation of AASTP.

If the data cannot be trusted, then:

- engineering calculations cannot be trusted
- APIs cannot be trusted
- applications cannot be trusted
- analytical outputs cannot be trusted
- future national tailoring cannot be trusted

Validation therefore provides confidence in every downstream engineering product.

---

# Engineering Assurance Objectives

The framework provides assurance that:

- repository structures are correct
- engineering objects are internally consistent
- governed references remain valid
- engineering relationships remain intact
- calculations reference valid engineering data
- engineering provenance is maintained
- engineering intent remains traceable to the authoritative publication

---

# Validation Architecture

The validation framework is divided into four progressively more capable assurance layers.

```
Knowledge Layer
        │
        ▼
JSON Data Layer
        │
        ▼
Layer 1 — Schema Validation
        │
        ▼
Layer 2 — Repository Integrity
        │
        ▼
Layer 3 — Cross-Repository Validation
        │
        ▼
Layer 4 — Engineering Rule Validation
```

Each layer builds upon the previous layer.

A repository cannot demonstrate engineering integrity unless it first demonstrates structural integrity.

---

# Layer 1 — Schema Validation

Layer 1 validates repository structure.

It confirms that:

- JSON structure is correct
- required properties exist
- data types are correct
- identifiers conform to the schema
- mandatory objects are present

Layer 1 deliberately does not attempt to determine whether engineering information is correct.

Its purpose is structural validation.

---

# Layer 2 — Repository Integrity

Layer 2 validates engineering integrity within an individual repository.

Typical validation activities include:

- repository completeness
- engineering object definitions
- governed dependencies
- engineering traceability
- repository consistency

Layer 2 establishes confidence that each repository is internally coherent.

---

# Layer 3 — Cross-Repository Validation

Layer 3 validates engineering relationships between repositories.

Examples include:

- ES/PES interactions
- engineering references
- governed identifiers
- repository interoperability

This layer ensures that independently valid repositories continue to function correctly as an integrated engineering model.

---

# Layer 4 — Engineering Rule Validation

Layer 4 validates engineering behaviour.

This layer applies engineering rules contained within AASTP to determine whether engineering outcomes remain valid.

Examples include:

- quantity-distance relationships
- interaction logic
- engineering constraints
- transformation behaviour
- future engineering calculations

This layer represents the highest level of engineering assurance.

---

# Engineering Validation Principles

The framework is built upon several fundamental principles.

## Validation supports engineering assurance

Validation is not intended merely to detect software errors.

It provides evidence that engineering information remains trustworthy.

---

## Validation is layered

Higher assurance levels assume lower assurance levels have already been satisfied.

Each layer has a clearly defined responsibility.

---

## Validation is deterministic

Every validation rule has a clearly defined engineering purpose.

Validation outcomes are repeatable and produce consistent results.

---

## Validation is transparent

Every validation outcome should clearly identify:

- the engineering object
- the engineering rule
- the validation outcome
- the reason for failure
- the corrective action

---

## Validation supports governance

Validation provides objective evidence that repositories comply with the governed engineering model.

---

# Engineering Traceability

Every engineering object should remain traceable to its authoritative engineering source.

Traceability supports:

- engineering review
- future editions
- national tailoring
- auditing
- change management

The Engineering Traceability Framework standardises how engineering provenance is represented throughout the service.

---

# Validation Statistics

The framework deliberately records detailed engineering statistics.

Validation does not simply report Pass or Fail.

Instead it records engineering evidence describing:

- relationships checked
- engineering objects validated
- governed references verified
- engineering rules evaluated
- warnings generated
- errors detected

These statistics provide measurable evidence of engineering assurance.

---

# Repository Reference Architecture

Engineering Object repositories follow a common validation lifecycle.

1. Lookup Collections
2. Repository Structure
3. Engineering Object Definitions
4. Governed Dependencies
5. Engineering Traceability
6. Repository Consistency

This architecture promotes consistency, maintainability and future extensibility across all engineering repositories.

---

# Future Evolution

The validation framework has been designed to evolve alongside future editions of AASTP.

Future enhancements include:

- Engineering Knowledge Repositories
- National Tailoring Validation
- Digital provenance and governance
- Expanded engineering rule validation
- Automated engineering assurance reporting

The architecture intentionally separates engineering knowledge, engineering behaviour and engineering data, allowing future capability to be incorporated without fundamental redesign.

---

# Summary

The validation framework is a core component of the digital AASTP architecture.

It provides confidence that engineering information remains structurally correct, internally consistent, traceable to the authoritative publication and suitable for use in engineering decision making.

Rather than validating software alone, the framework provides demonstrable engineering assurance that the digital representation faithfully preserves the engineering intent of AASTP.