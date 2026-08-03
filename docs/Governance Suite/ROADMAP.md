# AASTP Project Roadmap

---

# Project Vision

The AASTP Project aims to provide an open, traceable and standards-compliant digital implementation of the NATO Allied Ammunition Storage Publication (AASTP).

The project is structured around three independent but closely related components:

- **AASTP-Data** – The authoritative digital implementation of AASTP engineering knowledge.
- **AASTP-API** – A RESTful engineering service exposing the knowledge base and calculation engine.
- **AASTP-Demo** – Reference applications demonstrating practical integration with the API.

The long-term objective is to provide an authoritative digital representation of AASTP that can ultimately replace static PDF tables with structured, versioned engineering data suitable for adoption by AC/326 and integration into national and commercial explosive safety systems.

---

# Guiding Principles

Development is guided by the following principles.

- JSON is the single source of truth.
- Separate data, engineering logic and presentation.
- Maintain complete traceability back to AASTP.
- Prefer explicit structures over implicit behaviour.
- Preserve backwards compatibility wherever practical.
- Design for future AASTP editions.
- Comprehensive automated validation.
- Stable, documented REST interfaces.
- Explainable engineering calculations.
- Extensible architecture supporting future national tailoring.

---

# System Architecture

```
Knowledge Layer
        │
        ▼
JSON Data Layer
        │
        ▼
Validation Layer
        │
        ▼
Engineering Service

    AssessmentResolver
            │
            ▼
    ReferenceResolver
            │
            ▼
    CalculationResolver
            │
            ▼
    FormulaEvaluator
            │
            ▼
    TransformationEngine

        │
        ▼
REST API
        │
        ▼
Reference Applications

    Web Demonstrator
    Excel
    Mobile
    Power BI
```

The Engineering Service represents the computational core of the project. It is intentionally independent of any user interface or API implementation.

---

# Current Project Status

| Component | Status |
|-----------|--------|
| Repository Architecture | ✅ Complete |
| Project Architecture | ✅ Complete |
| Data Architecture | ✅ Complete |
| Engineering Architecture | ✅ Complete |
| JSON Knowledge Base | 🔄 In Progress |
| JSON Schemas | 🔄 In Progress |
| Validation Framework | 🔄 In Progress |
| Assessment Resolver | ✅ Complete |
| Reference Resolver | ✅ Complete |
| Calculation Resolver | ✅ Complete |
| Formula Evaluator | ✅ Complete |
| Transformation Engine | ✅ Complete |
| Engineering Service | 🔄 Integration Testing |
| REST API | ⏳ Planned |
| Demonstrator | ⏳ Planned |
| Public Deployment | ⏳ Planned |

---

# Development Roadmap

## Phase 1 — Foundation

**Status:** Complete

Objective

Establish the architecture, repository structure and engineering principles that underpin the project.

Major Deliverables

- Repository structure
- Project documentation
- Git configuration
- Development environment
- Architectural principles
- Engineering philosophy

---

## Phase 2 — Digital Knowledge Base

**Status:** In Progress

Objective

Create the authoritative digital implementation of AASTP Chapter 1.

Major Deliverables

- Complete JSON datasets
- Stable JSON schemas
- Referential integrity
- Dataset documentation
- Traceability to AASTP
- Dataset versioning

---

## Phase 3 — Engineering Core

**Status:** Near Completion

Objective

Develop a fully data-driven engineering calculation pipeline.

Major Deliverables

- Assessment pipeline
- Assessment Resolver
- Reference Resolver
- Calculation Resolver
- Formula Evaluator
- Transformation Engine
- Engineering Service
- Forward calculations
- Reverse calculations
- Comprehensive unit testing
- Comprehensive integration testing
- Stable engineering contracts

Success Criteria

- All unit tests passing.
- All integration tests passing.
- Engineering contracts frozen.
- Calculation pipeline fully documented.

---

## Phase 4 — Validation & Quality Assurance

**Status:** Next Priority

Objective

Provide objective evidence that the digital implementation is internally consistent and trustworthy.

Major Deliverables

- Four-layer validation framework
- Validation reporting
- Engineering consistency checks
- Schema validation
- Referential integrity validation
- Regression testing
- Automated validation summary

Validation Layers

### Layer 1

JSON Schema Validation

### Layer 2

Referential Integrity

### Layer 3

Engineering Validation

Examples include:

- Branch continuity
- Formula consistency
- Interaction integrity
- Transformation validation
- Dataset completeness

### Layer 4

Pipeline Validation

- Unit tests
- Integration tests
- Engineering regression suite

Success Criteria

A complete validation report demonstrating the integrity of both the engineering data and execution pipeline.

---

## Phase 5 — REST API

**Highest Development Priority Following Validation**

Objective

Expose the engineering service through a stable, documented REST API.

Major Deliverables

- REST endpoints
- OpenAPI 3.1 specification
- Request validation
- Standard error handling
- API versioning
- Engineering response model
- API documentation

Success Criteria

The Engineering Service can be consumed by external applications without requiring knowledge of the underlying JSON implementation.

---

## Phase 6 — Public Demonstrator

Objective

Provide a working demonstration of the digital AASTP service.

Major Deliverables

- Public API deployment
- React web application
- End-to-end engineering assessments
- Engineering trace display
- Example scenarios
- Demonstration documentation

Success Criteria

A publicly accessible demonstration capable of performing representative AASTP engineering assessments.

---

## Phase 7 — Digital Standard Extensions

Objective

Extend the architecture while preserving compatibility.

Major Deliverables

- National policy overlays
- National tailoring
- Future AASTP editions
- Additional engineering modules
- Extended knowledge base

---

## Phase 8 — Optional Enhancements

Objective

Provide additional capabilities once the core demonstrator has been delivered.

Potential Enhancements

- Unit conversion
- Excel integration
- Power BI integration
- Mobile applications
- GIS integration
- Batch processing
- Additional API implementations

---

# Current Development Focus

The current priority order is:

1. Complete Engineering Service integration testing.
2. Resolve remaining engineering edge cases.
3. Complete the validation framework.
4. Generate comprehensive validation reports.
5. Freeze the engineering core.
6. Develop the REST API.
7. Publish the API and demonstrator.
8. Implement national tailoring.
9. Develop optional enhancements.

---

# Milestone Reviews

## M1 — Engineering Core Complete

Success Criteria

- Engineering Service complete.
- Unit tests complete.
- Integration tests complete.
- Stable engineering contracts.

---

## M2 — Validation Complete

Success Criteria

- Four validation layers complete.
- Validation report generated.
- Engineering consistency demonstrated.

---

## M3 — REST API Complete

Success Criteria

- Stable REST API.
- OpenAPI documentation complete.
- End-to-end engineering requests supported.

---

## M4 — Demonstrator Online

Success Criteria

- Public deployment complete.
- Demonstrator operational.
- Representative engineering scenarios available.

---

## M5 — National Tailoring

Success Criteria

- National overlay architecture implemented.
- Demonstration of extensibility beyond core AASTP.

---

## M6 — Version 1.0

Success Criteria

- Stable engineering core.
- Stable API.
- Complete documentation.
- Demonstrator available.
- Ready for stakeholder review and AC/326 engagement.

---

# Release Philosophy

The project follows Semantic Versioning (MAJOR.MINOR.PATCH) and maintains independent version numbers for the data and API components.

- **AASTP-Data** versions reflect changes to the engineering knowledge base.
- **AASTP-API** versions reflect changes to the Engineering Service and REST interface.
- Compatibility between releases is documented through supported version ranges.

Backward compatibility will be maintained wherever practical.

---

# Long-Term Vision

The ultimate objective is to establish a standards-compliant digital engineering platform that demonstrates how AASTP can evolve from a static publication into a versioned, interoperable engineering service.

The project is intended to demonstrate that:

- Engineering knowledge can be represented as structured data.
- Calculations can be fully traceable and explainable.
- Validation can provide objective confidence in engineering outcomes.
- A stable API enables integration with modern software ecosystems.
- National policy can be incorporated through structured overlays rather than document duplication.

This roadmap will be reviewed and updated at each major project milestone to ensure that development priorities remain aligned with the long-term objective of producing a robust, maintainable and internationally adoptable digital engineering standard.