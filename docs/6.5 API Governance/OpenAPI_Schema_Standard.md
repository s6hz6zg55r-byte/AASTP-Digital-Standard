# OpenAPI Schema Standard

**Document ID:** AASTP-OAS-STD-001  
**Version:** 1.1  
**Status:** Revised issue  
**Applies to:** AASTP Digital Engineering API OpenAPI 3.1 specification  
**Owner:** AASTP Digital Engineering Project

## 1. Purpose

This standard defines the mandatory structure, naming, documentation and maintenance rules for OpenAPI schema components used by the AASTP Digital Engineering API.

Its purpose is to ensure that schemas provide a clear, stable and reusable representation of AASTP engineering concepts. Schema components are part of the governed API contract. They must remain understandable independently of the Node.js reference implementation and suitable for use by web applications, mobile applications, engineering tools and external systems.

## 2. Scope

This standard applies to every reusable schema component held under `openapi/components/schemas/`, and to every reference to those components from the root OpenAPI document, path files, response components, request bodies, examples and parameters.

It applies to schemas for common API concepts, engineering resources, resource summaries, collection envelopes, calculation requests and responses, traceability information, and future API capabilities.

This standard does not define endpoint behaviour, HTTP response codes, security controls, or the authoritative AASTP engineering data itself. Those concerns are governed by the API contract, API response standard, security arrangements and JSON data repositories respectively.

## 3. Relationship to the API Governance Suite

This document forms part of the AASTP API governance suite. It is subordinate to the project engineering principles and must be read with the following governed artefacts:

- the API contract and OpenAPI root document;
- the JSON data and validation standards;
- the engineering calculation model;
- the error and response standards; and
- applicable AASTP-1 source material.

The JSON data layer remains the authoritative source for engineering data. OpenAPI schemas describe the public representation of that data; they do not create, reinterpret or replace engineering rules.

## 4. Design Principles

All schemas shall follow these principles:

- **Engineering meaning first.** A schema represents an identifiable engineering or API concept, not an internal implementation object.
- **Single source of truth.** A concept shall be defined once and reused by reference.
- **Explicit structure.** Required fields, constraints and relationships shall be declared rather than inferred by client applications.
- **Human readability.** A competent maintainer shall be able to understand a schema without navigating application code.
- **Stable public contract.** Published schemas shall evolve compatibly wherever practical.
- **Modularity.** Small, independently reviewable files are preferred over large monolithic specifications.
- **Controlled values remain authoritative.** OpenAPI shall not independently reproduce a controlled engineering vocabulary that is defined in the authoritative data layer.
- **Terminological accuracy.** AASTP terminology shall be used consistently. In particular, use **Exposed Site** and **Potential Explosion Site**; do not substitute informal alternatives.

## 5. Directory Structure

The OpenAPI specification shall use the following modular structure:

```text
openapi/
├── openapi.yaml
├── paths/
│   ├── es-types.yaml
│   ├── pes-types.yaml
│   ├── structures.yaml
│   ├── hazard-categories.yaml
│   ├── calculations.yaml
│   └── metadata.yaml
└── components/
    ├── schemas/
    │   ├── identifier.yaml
    │   ├── responseMetadata.yaml
    │   ├── structure.yaml
    │   ├── exposedSiteTypeSummary.yaml
    │   └── exposedSiteTypeCollection.yaml
    ├── responses/
    ├── parameters/
    └── examples/
```

The root document is the index and assembly point for the specification. Component directories shall contain reusable definitions grouped by OpenAPI component type.

## 6. File Naming Convention

Schema filenames shall use lower camel case and the `.yaml` extension.

```text
responseMetadata.yaml
identifier.yaml
exposedSiteTypeSummary.yaml
potentialExplosionSiteType.yaml
calculationRequest.yaml
```

Each filename shall describe the concept contained in the file. Abbreviations shall be avoided in schema filenames unless they are an established, unambiguous AASTP term. Filenames shall not contain spaces, version numbers, duplicate-type suffixes or implementation-specific names.

The component name registered in `openapi.yaml` shall use PascalCase and correspond directly to the filename:

```yaml
ResponseMetadata:
  $ref: "./components/schemas/responseMetadata.yaml"
```

## 7. One Schema Per File Rule

Each file in `components/schemas/` shall define exactly one reusable schema.

Schema files shall contain the schema value itself. They shall not contain `openapi`, `paths`, `components`, `schemas`, or a component-name wrapper. The following is prohibited:

```yaml
components:
  schemas:
    ResponseMetadata:
      type: object
```

The required form is:

```yaml
type: object
description: >
  Metadata describing an API response.
```

## 8. Root Document Responsibilities

`openapi/openapi.yaml` shall:

- declare the OpenAPI version and API-level metadata;
- define servers, tags, security and top-level API governance metadata;
- map each path to its modular path file; and
- register each reusable component under the appropriate OpenAPI component section using `$ref`.

The root document shall not duplicate the implementation of modular schemas, path operations, reusable responses, parameters or examples. It is the authoritative index of the specification, not a second implementation location.

## 9. Individual Schema File Responsibilities

Each schema file shall:

- define one complete reusable schema or primitive schema;
- state the concept represented through a schema-level description;
- define only properties and constraints belonging to that concept;
- reference shared concepts rather than restating them; and
- include examples where they improve practical understanding.

Schema files shall not contain endpoint-specific behaviour, Express implementation detail, calculated values not defined by the engineering model, or duplicated definitions of shared identifiers, metadata or error structures.

## 10. Standard Schema Layout

Object schemas shall use the following standard section order:

```yaml
type: object

description: >
  Clear statement of the concept represented by this schema.

properties:
  propertyName:
    type: string
    description: >
      Clear statement of the information held by this property.
    example: example-value

required:
  - propertyName
```

The standard order is:

1. `type`
2. `description`
3. `properties`
4. `required`

Additional schema keywords may be used only when required by the concept. They shall be placed where OpenAPI/JSON Schema syntax requires and documented sufficiently for review. The `required` keyword shall be aligned with `properties`; it shall never be nested within `properties`.

Primitive schemas shall use the applicable subset of this order, for example `type`, `format`, `description`, constraints and `example`.

## 11. Property Ordering Standard

Within `properties`, fields shall be presented in the order most useful to a consuming engineer: stable identifier first, then name, description, relationships, engineering attributes and supporting metadata. Where no semantic order is evident, use alphabetical order.

Within an individual property definition, use the following order when the keywords are present:

```yaml
propertyName:
  type: string
  format: date-time
  description: >
    Explanation of the property.
  example: "2026-08-10T08:35:14Z"
  minimum: 0
  maximum: 100
  enum:
    - permittedValue
  default: permittedValue
```

For a property expressed only as a reference, use `$ref` alone unless a formally reviewed composition is necessary. Do not add sibling validation or descriptive keywords to a `$ref` merely for convenience.

`enum` may be used only for a value set that the API contract explicitly governs within OpenAPI. It shall not be used to duplicate approved engineering terms, engineering constants, permitted orientations, construction values, exposure values, units, or other controlled values whose authority is the validated data release. Such schemas shall describe the value's type and refer consumers to the authoritative resource or definition instead.

## 12. Description Standard

Every schema and every property shall have a description.

Descriptions shall be concise, declarative and written in complete sentences. They shall state what the value represents, not how a particular client or server happens to use it. Engineering meaning, units, controlled terminology and applicability shall be stated where needed to prevent ambiguity.

Descriptions shall not introduce engineering requirements that are absent from the authoritative data, AASTP source material or approved engineering model. Where a controlled value set or calculation constraint requires explanation, that explanation shall be governed alongside the underlying rule.

Use folded YAML text (`>`) for multi-line descriptions. Use literal YAML text (`|`) only where line breaks are meaningful to consumers.

## 13. Example Standard

Each property shall include an example where a representative value can be provided without implying an unapproved engineering rule. Examples shall be valid for the declared type, format and constraints.

Examples shall:

- use realistic, non-sensitive values;
- conform to the schema and to any enumeration;
- use UTC (`Z`) for `date-time` values unless the property explicitly represents another time basis;
- be consistent across related schemas; and
- be reviewed whenever a schema constraint changes.

Examples illustrate a contract; they are not authoritative engineering data. A complete reusable response example belongs in `components/examples/`, not in place of a schema property example.

## 14. `$ref` Usage Rules

`$ref` shall be used to reference a reusable, separately governed component.

The root document shall use relative references to register modular schemas:

```yaml
ResponseMetadata:
  $ref: "./components/schemas/responseMetadata.yaml"
```

Once registered, references from within the assembled OpenAPI document shall normally use component references:

```yaml
metadata:
  $ref: "#/components/schemas/ResponseMetadata"
```

Direct relative references between schema files may be used only where the specification tooling and validation process explicitly support them. The project shall adopt one reference resolution strategy and apply it consistently; mixed reference styles within the same component family are prohibited.

Schemas shall use `$ref` for shared identifiers, response metadata, common errors, traceability structures and other repeated concepts. `$ref` shall not be used to obscure a relationship that would be clearer as an explicit schema property.

## 15. Reuse Principles

Reuse is mandatory where the same concept appears in more than one API contract location. Before introducing a field or schema, authors shall determine whether an approved component already represents that concept.

The following are expected to be reused when applicable:

- stable engineering identifiers;
- response metadata;
- error and validation response structures;
- common traceability structures; and
- shared engineering value objects.

Schemas shall be composed from stable concepts rather than copied and edited. A new schema is justified only when it represents a distinct concept, a deliberately narrower public representation, or an approved evolution of the contract.

## 16. Comment/Header Standard

Every schema file shall begin with the following YAML comment header, adapted to the schema concerned:

```yaml
# =============================================================================
# Response Metadata Schema
# =============================================================================
#
# Purpose
# -------
# Defines metadata accompanying successful API responses.
#
# Used by
# -------
# - Repository collection responses
# - Repository entity responses
# - Engineering calculation responses
#
# =============================================================================
```

The header shall identify the schema title, purpose and principal consumers. It shall not duplicate the complete schema description or include a change history; version history belongs in governed documentation and source control.

Comments shall explain intent, constraints or maintenance decisions that cannot be adequately expressed in OpenAPI. Comments shall not contradict the schema or substitute for a machine-readable constraint.

## 17. Validation Expectations

Every schema change shall be validated before approval and publication.

Validation shall confirm, as a minimum:

- valid YAML syntax;
- valid OpenAPI 3.1 and JSON Schema usage;
- successful resolution of every `$ref`;
- unique and correctly registered component names;
- consistency between `required`, declared properties and examples;
- conformance of examples to type, format, permitted enum and numeric constraints; and
- consistency with the authoritative JSON data layer and approved engineering model.

Automated validation is required wherever tooling is available. Automated checks do not replace engineering review of terminology, units, applicability or traceability.

## 18. Backwards Compatibility Rules

Published schemas form part of the public API contract. Changes shall be presumed breaking unless demonstrated otherwise.

The following are normally backward compatible:

- adding an optional property;
- adding a new reusable schema not referenced by an existing contract;
- improving descriptions or examples without changing meaning; and
- adding a permitted enum value only where the enum is explicitly governed by OpenAPI and clients are designed to tolerate unknown values.

The following require a new API version or an approved compatibility strategy:

- removing or renaming a property or schema;
- changing a property type, format, unit, meaning or identifier format;
- making an optional property required;
- narrowing a validation constraint or permitted OpenAPI enumeration; and
- changing the meaning of an existing response envelope.

Deprecation shall be explicit, documented and time-bounded. A deprecated component shall identify its replacement and remain valid throughout the approved migration period.

## 19. Review Checklist

Before approving a new or changed schema, reviewers shall confirm:

- [ ] The schema represents one identifiable engineering or API concept.
- [ ] The file has the correct lower-camel-case name and `.yaml` extension.
- [ ] The file contains no `components` or `schemas` wrapper.
- [ ] The schema is registered once, with the correct PascalCase component name.
- [ ] The standard header comment is present and accurate.
- [ ] Schema and property descriptions are complete, accurate and non-duplicative.
- [ ] Property and keyword ordering follow this standard.
- [ ] `required` is correctly aligned and justified.
- [ ] Shared concepts are reused through approved references.
- [ ] Examples are valid, representative and do not assert unapproved engineering data.
- [ ] All `$ref` values resolve successfully.
- [ ] The change is compatible or has an approved versioning and migration plan.
- [ ] AASTP terminology, including **Exposed Site** and **Potential Explosion Site**, is correct.

## 20. Worked Example: `ResponseMetadata`

The following example is the baseline pattern for a modular object schema. It illustrates the header, standalone structure, mandatory descriptions, property ordering, constraints and the placement of `required`.

```yaml
# =============================================================================
# Response Metadata Schema
# =============================================================================
#
# Purpose
# -------
# Defines metadata accompanying successful API responses.
#
# Used by
# -------
# - Repository collection responses
# - Repository entity responses
# - Engineering calculation responses
#
# =============================================================================

type: object

description: >
  Metadata describing an API response and the authoritative engineering
  repository from which its data was derived.

properties:
  repositoryVersion:
    type: string
    description: >
      Version of the authoritative AASTP engineering repository used to
      produce the response.
    example: "AASTP-1 Edition 3"

  generatedAt:
    type: string
    format: date-time
    description: >
      UTC timestamp indicating when the API response was generated.
    example: "2026-08-10T08:35:14Z"

  itemCount:
    type: integer
    description: >
      Number of resources contained within the response data element when
      the response represents a collection.
    example: 12
    minimum: 0

required:
  - repositoryVersion
  - generatedAt
```

The root document registers this schema once:

```yaml
components:
  schemas:
    ResponseMetadata:
      $ref: "./components/schemas/responseMetadata.yaml"
```

A collection schema then reuses it through the registered component:

```yaml
metadata:
  $ref: "#/components/schemas/ResponseMetadata"
```

`itemCount` remains optional because it is meaningful for collection responses but not necessarily for an individual resource or calculation response.

## 21. Future Extension Points

This standard is intentionally limited to a stable baseline. Future revisions may define additional controlled conventions for:

- pagination and filtering schemas;
- links and hypermedia representations;
- national profiles and controlled extensions;
- multilingual descriptions;
- explicit unit and quantity value objects;
- Structure schemas and selection-support schemas that distinguish structural applicability from the permissible values held by ES and PES definitions;
- shared provenance and engineering traceability components;
- deprecation metadata and lifecycle fields; and
- automated linting, bundling and contract-test requirements.

Future extensions shall preserve the principles of modularity, explicitness, reuse and backwards compatibility. They shall not be adopted solely to reflect a transient implementation preference.

## 22. Version History

| Version | Date | Status | Change |
| --- | --- | --- | --- |
| 1.1 | 2026-08-10 | Revised issue | Aligned with API Contract v0.3.1: added Structure artefact examples and prohibited OpenAPI duplication of authoritative controlled engineering vocabularies. |
| 1.0 | 2026-08-09 | Initial issue | Initial standard establishing the modular OpenAPI schema structure, layout, documentation, reuse, validation and compatibility rules. |
