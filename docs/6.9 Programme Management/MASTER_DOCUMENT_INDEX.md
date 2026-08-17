# AASTP Digital Standard — Master Document Index

| Attribute | Value |
|---|---|
| Document ID | AASTP-PROG-002 |
| Document status | Draft — Governance baseline |
| Version | 0.1.0 |
| Applies to | All AASTP Digital Engineering documentation, standards, frameworks, specifications, procedures and governance artefacts |
| Owner | AASTP Digital Engineering Project |
| Last updated | 2026-08-16 |

---

## 1. Purpose

The Master Document Index defines the controlled documentation structure for the AASTP Digital Standard.

Its purpose is to provide a single authoritative register of all documentation required to design, implement, operate, maintain and govern the digital representation of AASTP-1.

The Master Document Index ensures that:

- every major engineering, software and governance capability has an identified controlling document;
- responsibilities between documents remain clear;
- obsolete or duplicated documentation is identified and managed;
- future documentation requirements are visible before development begins; and
- the digital standard remains maintainable through future editions, national implementations and governance transitions.

The Master Document Index does not replace individual controlled documents. It provides the authoritative map of the documentation ecosystem and the relationships between controlled artefacts.

---

## 2. Scope

This index applies to all documentation associated with the AASTP Digital Engineering Platform, including:

- architecture documents;
- engineering models;
- data standards;
- validation and assurance frameworks;
- API specifications;
- publication standards;
- client application standards; and
- governance and sustainment documentation.

The index covers both current controlled documents and planned documents required to support long-term adoption and maintenance.

---

## 3. Relationship to the Governance Suite

The Master Document Index forms part of the overall governance architecture and is the controlled entry point to the documentation suite.

```text
AASTP Digital Standard
└── Master Document Index
    ├── Architecture
    ├── Engineering Models
    ├── Data Governance
    ├── Engineering Assurance
    ├── Validation
    ├── API Governance
    ├── Publication
    ├── Client Applications
    └── Programme Management
```

Each controlled document has a defined responsibility and shall not duplicate information governed elsewhere. Where multiple documents interact, one document shall be identified as the governing authority.

---

## 4. Document Management Principles

### 4.1 Single document authority

Each engineering or governance concept shall have one primary controlling document. Supporting documents may reference the concept but shall not redefine it.

### 4.2 Clear separation of responsibilities

Documents shall describe one primary responsibility:

- architecture documents define system boundaries and responsibilities;
- standards define mandatory practices and conventions;
- frameworks define governance processes and relationships;
- specifications define implementation-independent requirements; and
- procedures define repeatable activities.

### 4.3 Controlled evolution

Documents shall be version controlled. Changes shall identify:

- affected systems;
- affected consumers;
- compatibility implications; and
- required migration actions.

### 4.4 Documentation lifecycle

Each document shall have one of the following lifecycle states.

| Status | Meaning |
|---|---|
| Planned | Requirement identified but document not yet developed |
| Draft | Under development or review and not yet approved as a working baseline |
| Baseline | Approved working standard under controlled change |
| Approved | Formally accepted governing document |
| Superseded | Replaced by an identified successor document |
| Archived | Retained for historical or audit purposes and no longer maintained |

Superseded and archived documents shall remain traceable to their replacement or reason for retirement.

---

## 5. Document Classification

| Category | Purpose |
|---|---|
| Architecture | Defines system boundaries, components, responsibilities and dependencies |
| Engineering Models | Defines engineering concepts, resolution and calculation behaviours |
| Data Governance | Defines structured data ownership, representation and lifecycle |
| Engineering Assurance | Defines confidence, evidence and trust mechanisms |
| Validation | Defines validation governance, implementation and evidence |
| API Governance | Defines stable public service interfaces and their evolution |
| Publication | Defines document generation, presentation and publishing |
| Client Applications | Defines principles for systems that consume the standard |
| Programme Management | Defines delivery, change and long-term sustainment |

---

## 6. Controlled Document Register

The assessments below establish the proposed disposition of existing documents and identify planned governance artefacts. Versions shown for planned documents are intentionally blank until work begins.

### 6.1 Architecture Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-DIG-ARCH-001 | Digital Engineering Architecture | Baseline v0.5 | Retain as the governing architecture baseline. Incorporate repository classification, engineering object identification, the discriminator model, controlled vocabulary architecture and the identifier model in a future controlled revision. |

### 6.2 Engineering Model Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-ENG-MOD-001 | Engineering Calculation Model | Locked v0.3.0 | Retain as the controlled engineering baseline. Defines calculation behaviour independently of API and application implementation. Any change requires formal reopening and a new controlled version. |
| AASTP-ENG-MOD-002 | Engineering Resource Resolution Model | Draft v1.1 | Retain as a standalone engineering standard governing canonicalisation and resource resolution. Reconcile terminology and dependencies with the architecture before baseline approval. |
| AASTP-ENG-MOD-003 | Engineering Object Model | Planned | Required to formalise the separation between object identity, object definition and engineering behaviour. |
| AASTP-ENG-MOD-004 | Engineering Scenario Model | Planned | Required to govern future scenario-based engineering workflows. |
| AASTP-ENG-MOD-005 | National Tailoring Model | Planned | Required to govern national profiles, deviations, applicability and traceability without modifying the authoritative core. |

### 6.3 Engineering Assurance Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-EAF-001 | Engineering Assurance Framework | Baseline | Retain as the primary assurance governance document. The Validation Framework is a subordinate component of this framework. |
| AASTP-EAF-002 | Engineering Traceability Framework | Planned | Defines provenance, source citation and end-to-end traceability requirements. |
| AASTP-EAF-003 | Release Assurance Framework | Planned | Defines the evidence and approvals required before publication of governed digital releases. |
| AASTP-EAF-004 | Security and Integrity Strategy | Planned | Defines protection of digital engineering assets, supply-chain controls and release integrity. |

### 6.4 Validation Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-VAL-001 | Validation Framework | Baseline v1.1 | Retain as the detailed validation governance document subordinate to the Engineering Assurance Framework. |
| AASTP-VAL-002 | Validator Catalogue | Planned | Defines validator identifiers, layer assignment, dataset coverage, inputs, outputs and purpose. |
| AASTP-VAL-003 | Validation Error and Warning Code Register | Planned | Defines diagnostic codes, severity, validator ownership, descriptions and compatibility rules. Coordinate with the API Error Code Registry while preserving the distinction between validation diagnostics and API errors. |
| AASTP-VAL-004 | Validation Statistics Catalogue | Planned | Defines validation statistics fields, calculation rules and reporting meaning. |
| AASTP-VAL-005 | Validator Development Standard | Planned | Defines the development methodology, test expectations and lifecycle for validators. |
| AASTP-VAL-006 | Artificial Defect Test Strategy | Planned | Defines controlled defect injection used to demonstrate validator effectiveness. |

### 6.5 API Governance Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-API-001 | API Contract | Baseline v0.4.0 | Retain as the governing human-readable API specification and current formatting baseline. |
| AASTP-API-002 | OpenAPI Schema Standard | Revised issue v1.1 | Retain as the governing schema design standard. Reconcile terminology and normative relationships with the API Contract. |
| AASTP-API-003 | API Design Principles | Draft | Reconcile against the API Contract before baselining. Remove duplicated rules and retain only principles not governed elsewhere. |
| AASTP-API-004 | Error Code Registry | Draft | Reconcile with the API Contract and implemented error behaviour. Clarify its relationship to validation diagnostic codes. |
| AASTP-API-005 | API Change Management Framework | Planned | Required to govern compatibility, deprecation and version evolution. |
| AASTP-API-006 | API Security Standard | Planned | Defines authentication, authorisation, transport, deployment and operational security controls. |
| AASTP-API-007 | API Security Standard | Draft v0.1.0 | Provides a catalogue of reusable OpenAPI schema components planned for AASTP Digital Engineering API. |

### 6.6 Publication Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-PUB-001 | Document Generation Architecture | Draft | Retain. Consider renaming to **Digital Publication Architecture**, because it governs a publishing capability rather than only a generation utility. |
| AASTP-PUB-002 | Document Presentation Standard | Planned | Defines common document headers, structure, formatting, rendering and accessibility requirements. |
| AASTP-PUB-003 | Publication Pipeline Standard | Planned | Defines automated production, quality control, approval and release workflows. |

### 6.7 Data Governance Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-DATA-001 | JSON Data Standard | Planned | Defines authoritative structured-data conventions, common patterns and representation rules. |
| AASTP-DATA-002 | Dataset Classification Standard | Planned | Defines reference, engineering and supporting dataset categories and their governance boundaries. |
| AASTP-DATA-003 | Identifier Standard | Planned | Defines stable repository identifiers, engineering designations, aliases and identifier lifecycle. |
| AASTP-DATA-004 | Controlled Vocabulary Standard | Planned | Defines ownership, definition, use and evolution of engineering terminology. |
| AASTP-DATA-005 | Schema Governance Standard | Planned | Defines schema ownership, validation, compatibility, versioning and migration. |
| AASTP-DATA-006 | Data Dictionary | Planned | Provides a human-readable reference for datasets, fields, constraints and relationships. |

### 6.8 Client Application Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-CLIENT-001 | Web Application Architecture | Planned | Required to govern evolution of the web demonstrator and future web consumers. |
| AASTP-CLIENT-002 | Mobile Application Architecture | Planned | Required before a controlled mobile implementation is developed. |
| AASTP-CLIENT-003 | Engineering Tool Integration Standard | Planned | Required for consistent integration with Excel, Power BI and external engineering tools. |
| AASTP-CLIENT-004 | Offline Operation Concept | Planned | Required for deployed and disconnected environments, including data synchronisation and release integrity. |

### 6.9 Programme Management Documents

| Document ID | Document | Status | Assessment |
|---|---|---|---|
| AASTP-PROG-001 | Programme Roadmap | Living document v2.1 | Retain as the current delivery-planning authority. Its living status shall not override controlled technical baselines. |
| AASTP-PROG-002 | Master Document Index | Draft v0.1.0 | This document. Establish as the controlled authority for the documentation suite. |
| AASTP-PROG-003 | Change Management Plan | Planned | Required to define programme-level change initiation, impact assessment, approval and communication. |

---

## 7. Validation Framework Future Enhancements

The following concepts shall be incorporated into future controlled revisions of the Validation Framework or its subordinate documents.

### 7.1 Validation statistics

Validation statistics shall record validation operations performed rather than repository object counts. This ensures that statistics remain meaningful as validators increase in sophistication.

For example, a validator assessing formula behaviour may perform hundreds of engineering checks against a small number of formula records. The reported statistic shall represent the validation activity performed.

### 7.2 Validation effectiveness

The framework shall record demonstrated validator effectiveness. Evidence may include confirmation against known repository defects or controlled artificial defects.

| Diagnostic Code | Example evidence |
|---|---|
| DR004 | Verified against a known repository defect |
| DR006 | Verified against a known repository defect |

The diagnostic codes above are illustrative references from the source assessment and shall not be treated as newly defined codes by this document.

### 7.3 Validator design principles

Future validator documentation shall incorporate the following principles:

- each validator answers one engineering question;
- each validation phase answers one validation question;
- engineering knowledge belongs in governed constants or authoritative repository data;
- validators validate engineering rules rather than define them;
- shared helpers are introduced only where they improve clarity and consistency; and
- repository complexity should reflect genuine engineering complexity.

---

## 8. Standard Document Header and Structure

### 8.1 Mandatory header

All controlled documents shall use the following header.

```markdown
# Document Title

| Attribute | Value |
|---|---|
| Document ID | AASTP-XXX-XXX-001 |
| Document status | Draft / Baseline / Approved |
| Version | x.y.z |
| Applies to | Defined scope |
| Owner | Responsible authority |
| Last updated | YYYY-MM-DD |
```

The API Contract is the current formatting reference. The planned Document Presentation Standard will become the governing authority once approved.

### 8.2 Recommended section structure

Controlled documents should use the following structure where applicable:

1. Purpose
2. Scope
3. Relationship to the Governance Suite
4. Principles
5. Architecture, Requirements or Process
6. Responsibilities
7. Validation or Assurance Requirements
8. Future Extension Points
9. Version History

Sections that do not apply may be omitted, but the reason should be clear from the document's purpose and scope. Normative and informative content should be distinguishable.

---

## 9. Governance Responsibilities

| Responsibility | Accountable role |
|---|---|
| Maintain the Master Document Index | AASTP Digital Engineering Project |
| Allocate and protect stable document IDs | Documentation governance owner |
| Approve lifecycle-state changes | Designated document authority |
| Maintain each controlled document | Document owner identified in its header |
| Assess cross-document impacts | Relevant architecture, engineering, data, assurance and API owners |
| Preserve supersession and archival history | Documentation governance owner |

Specific named authorities may be assigned when formal programme governance is established. Until then, the project owner retains accountability.

---

## 10. Review and Change Control

The Master Document Index shall be reviewed whenever:

- a controlled document is created, renamed, baselined, approved, superseded or archived;
- a document owner, governing relationship or repository location changes;
- a planned capability creates a new documentation requirement;
- duplication or conflicting authority is identified; or
- a programme or AASTP release review is performed.

Changes to document IDs, titles or governing relationships shall include an impact assessment. Stable document IDs shall not be reused. Renaming a document shall not, by itself, require a new ID where the governing responsibility remains unchanged.

---

## 11. Future Governance Development

The documentation suite is expected to expand as the digital standard matures. Candidate future artefacts include:

- AC/326 adoption and transition documentation;
- formal release governance;
- national implementation guidance;
- a digital certification or conformance framework;
- external integration standards;
- contributor and repository maintenance guidance;
- operational support and incident-management procedures;
- training material and user documentation; and
- records-retention and archival guidance.

These candidates shall be assigned document IDs and lifecycle status when their scope and governing category are agreed. They shall not be treated as approved requirements solely because they appear in this section.

---

## 12. Risks

| Risk | Control |
|---|---|
| Multiple documents become competing sources of truth | Assign one governing authority for each concept and require other documents to reference it. |
| Outdated documents continue to influence implementation | Record lifecycle status, successor relationships and archival decisions explicitly. |
| Planned documents are mistaken for approved requirements | Clearly distinguish Planned status from Baseline or Approved status. |
| Stable references break when documents are renamed or reorganised | Preserve document IDs and maintain supersession history. |
| Documentation diverges in structure and presentation | Apply the standard header now and govern presentation through AASTP-PUB-002 when approved. |
| Changes in one document create hidden conflicts elsewhere | Require cross-document impact assessment and update this index as part of change control. |
| The register becomes stale | Review it at each document lifecycle change and programme release review. |

---

## 13. Future Extension Points

Future revisions may extend the register with:

- document type;
- named owner and approving authority;
- repository location;
- governing parent and subordinate relationships;
- criticality;
- review cycle and next review date;
- normative or informative classification;
- applicable AASTP edition or digital release;
- superseding and superseded document IDs; and
- machine-readable index data for automated publication and governance checks.

A machine-readable representation should be introduced only after the register fields and governance rules are stable. The Markdown document remains the human-readable controlled authority until an approved data standard defines otherwise.

---

## 14. Version History

| Version | Date | Status | Change |
|---|---|---|---|
| 0.1.0 | 2026-08-16 | Draft — Governance baseline | Initial Master Document Index created from the programme documentation assessment. Established the controlled register, planned-document set, standard header, governance responsibilities, risks and future extension points. |
