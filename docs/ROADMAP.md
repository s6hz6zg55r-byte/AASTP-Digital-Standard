# AASTP Project Roadmap

## Project Vision

The AASTP Project aims to provide an open, traceable and standards-compliant digital implementation of the NATO Allied Ammunition Storage and Transport Publication (AASTP) safety regulations.

The project is structured around three independent but related components:

* **AASTP-Data** – The authoritative implementation of the AASTP knowledge base.
* **AASTP-API** – A RESTful API providing access to the knowledge base and rule evaluation engine.
* **AASTP-Demo** – Reference applications demonstrating integration with the API.

The long-term objective is to enable governments, software developers and standards custodians to build interoperable explosive safety applications from a common, versioned source of truth.

| Project        | Purpose                       | Current Status |
| -------------- | ----------------------------- | -------------- |
| **AASTP-Data** | Authoritative knowledge base  | In Development |
| **AASTP-API**  | REST API and rule engine      | In Development |
| **AASTP-Demo** | Reference client applications | In Development |

---

# Guiding Principles

Development of the project is guided by the following principles:

* Single source of truth for all AASTP knowledge.
* Separation of data, application logic and user interfaces.
* Standards compliance and traceability.
* Backwards-compatible API evolution.
* Extensible architecture supporting future AASTP editions.
* Comprehensive automated validation.
* Open and well-documented interfaces.

---

# Development Roadmap

## Phase 1 – Foundation

**Status:** In Progress

Objective:

Establish the repository structure, architecture and development environment required to support long-term project growth.

Deliverables include:

* Repository architecture
* Documentation
* Git configuration
* API project structure
* Data project structure
* Demonstrator project structure

---

## Phase 2 – Knowledge Base

**Status:** Planned

Objective:

Complete the digital implementation of AASTP Edition D.

Major tasks include:

* Complete JSON datasets
* Complete JSON Schemas
* Validation framework
* Traceability to source publications
* Dataset versioning
* Data documentation

---

## Phase 3 – Rule Engine

**Status:** Planned

Objective:

Implement the core reasoning engine used to evaluate explosive safety rules.

Major tasks include:

* Rule selection engine
* Formula evaluation
* Transformation engine
* Explainability engine
* Reverse calculations
* Unit testing

---

## Phase 4 – REST API

**Status:** Planned

Objective:

Expose the knowledge base and rule engine through a stable REST interface.

Major tasks include:

* REST endpoints
* OpenAPI specification
* API versioning
* Error handling
* Authentication (if required)
* Performance optimisation

---

## Phase 5 – Reference Applications

**Status:** Planned

Objective:

Provide reference implementations demonstrating integration with the API.

Potential applications include:

* React demonstration interface
* Excel add-in
* Command-line utilities
* Python examples

---

## Phase 6 – Operational Readiness

**Status:** Planned

Objective:

Prepare the project for production use and wider community adoption.

Major tasks include:

* Continuous Integration
* Automated testing
* Release process
* Documentation review
* Public deployment
* Community contribution guidelines

---

# Future Opportunities

The project architecture has been designed to support future expansion, including:

* Support for future AASTP editions
* National policy overlays
* Additional calculation modules
* GIS integration
* Mobile applications
* Alternative API implementations
* Cloud deployment
* Integration with external explosive safety systems

---

# Current Status

| Component               | Status         |
| ----------------------- | -------------- |
| Repository Architecture | ✅ Complete     |
| Data Architecture       | ✅ Complete     |
| API Architecture        | ✅ Complete     |
| Documentation Framework | ✅ Complete     |
| Knowledge Base          | 🔄 In Progress |
| Rule Engine             | 🔄 In Progress |
| REST API                | ⏳ Planned      |
| Demonstrator            | 🔄 In Progress |
| Public Release          | ⏳ Planned      |

---

# Release Philosophy

The project follows semantic versioning (`MAJOR.MINOR.PATCH`) and maintains independent version numbers for the data layer and API implementation.

* The **AASTP-Data** version reflects changes to the knowledge base.
* The **AASTP-API** version reflects changes to the API and processing engine.
* Compatibility between components is documented through supported version ranges.

All releases aim to preserve backwards compatibility wherever practical.

---