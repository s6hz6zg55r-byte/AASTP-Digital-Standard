# AASTP Digital Standard

![Status](https://img.shields.io/badge/status-development-blue)

## Overview

The AASTP Digital Standard project develops a governed digital representation of NATO Allied Ammunition Storage and Transport Publication (AASTP-1) engineering processes.

The objective is to transition from static publication tables and manually interpreted engineering rules to a controlled digital engineering service based on:

- authoritative structured data;
- validated engineering models;
- governed calculation services;
- interoperable interfaces; and
- traceable engineering outcomes.

The project separates engineering authority from software implementation by maintaining the authoritative engineering data layer independently from applications and service components.

---

# Architecture

The AASTP Digital Standard follows a layered architecture:
Engineering Knowledge
        |
        v
Authoritative Data Layer
        |
        v
Validation Layer
        |
        v
Engineering Service API
        |
        v
Client Applications
        |
        v
External Integrations


Each layer has a defined responsibility and is governed through controlled documentation.

---

# Repository Structure

The repository contains the following primary components:
AASTP-Digital-Standard
|
├── aastp-data
│   └── Authoritative engineering datasets
|
├── aastp-common
│   └── Shared libraries and common services
|
├── aastp-api
│   └── Engineering Service REST API
|
├── aastp-demo
│   └── Demonstration applications and examples
|
├── docs
│   └── Controlled documentation and governance artefacts
|
├── package.json
└── package-lock.json


---

# Engineering Principles

The project follows these principles:

## Authoritative data first

The structured data layer is the authoritative representation of engineering rules, relationships and calculation inputs.

Applications shall consume governed data rather than independently reproduce engineering logic.

---

## Separation of concerns

Engineering knowledge, data, validation, service implementation and user applications are maintained as separate but integrated layers.

This ensures:

- maintainability;
- interoperability;
- controlled evolution; and
- long-term governance.

---

## Validation before execution

Engineering calculations are performed only after:

- inputs have been validated;
- engineering applicability has been established;
- required resources have been resolved; and
- the calculation pathway has been confirmed.

---

## Traceability

Calculation outcomes shall remain traceable to:

- authoritative inputs;
- engineering scenarios;
- calculation pathways;
- governed data releases; and
- validation status.

---

# Documentation

Controlled documentation is maintained within:

docs/

The documentation suite is governed by:

**AASTP Digital Standard — Master Document Index**

The Master Document Index defines:

- document ownership;
- document relationships;
- lifecycle status;
- governance hierarchy; and
- planned future documentation.

Key documents include:

| Document | Purpose |
|---|---|
| Digital Engineering Architecture | Defines system architecture and boundaries |
| Engineering Calculation Model | Defines calculation concepts and execution principles |
| Engineering Assurance Framework | Defines confidence, governance and assurance processes |
| Validation Framework | Defines validation requirements and controls |
| API Contract | Defines Engineering Service interface behaviour |
| Error Code Registry | Defines governed failure and diagnostic outcomes |

---

# Development Environment

The project uses:

- Node.js
- JavaScript ES Modules
- Express.js
- REST API architecture
- JSON-based engineering datasets

Recommended development environment:

- Visual Studio Code
- Git
- Node.js LTS

---

# Getting Started

## Clone repository

```bash
git clone https://github.com/s6hz6zg55r-byte/AASTP-Digital-Standard.git
```
Navigate to the project:

```bash
cd AASTP-Digital-Standard

npm install
```

## Data Layer
The `aastp-data` repository component contains the authoritative engineering datasets.

These datasets are subject to:
- validation controls;
- version management;
- controlled release processes; and
- governance requirements.

The data layer is not intended to be modified directly without applying the applicable governance processes.

## API Service
The aastp-api component provides access to governed engineering functionality through RESTful interfaces.

The API is designed to be:
- resource-oriented;
- versioned;
- stateless;
- documented through OpenAPI specifications; and
- consumable by multiple client types.

## Validation

The validation layer provides confidence that:
- engineering datasets are structurally valid;
- relationships are consistent;
- calculation pathways are complete;
- references are resolved; and
- engineering constraints are satisfied.

Validation is considered part of the engineering assurance process.

## Demonstration Applications

The aastp-demo component contains demonstration implementations showing how the Engineering Service may be consumed by:
- web applications;
- engineering tools; and
- future mobile applications.

Demonstrations are intended to show capability and interoperability rather than define engineering authority.

## Contribution and Change Management

Changes shall follow controlled development practices.

Before modifying:
- authoritative datasets;
- schemas;
- engineering models;
- calculation methods; or
- governance documentation,
the impact on dependent components shall be assessed.

All changes should maintain:
- backwards compatibility where practical;
- traceability;
- validation coverage; and
- documented rationale.

## Current Status
The project is currently under active development.

Primary development objectives include:
- completion of Engineering Service capability;
- validation framework implementation;
- API deployment;
- demonstration applications;
- governance documentation;
- preparation for future standards adoption.

## Future Direction

The long-term objective is to establish a sustainable digital engineering capability supporting:
- authoritative digital representations of AASTP content;
- controlled national tailoring;
- multilingual representations;
- automated publication generation;
- interoperability with external engineering systems; and
- future digital standards environments.

## Licence and Usage

This repository is currently maintained as a development and demonstration capability.

Usage, distribution and adoption arrangements will be governed through future programme governance processes.


---