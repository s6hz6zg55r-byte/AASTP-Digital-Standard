# AASTP Digital Engineering API Contract

| Attribute | Value |
| --- | --- |
| Document status | Draft — governing design document |
| Contract version | 0.4.0 |
| API major version | v1 (proposed) |
| Milestone | 5.2 — API Contract |
| Last updated | 2026-08-14 |

## 1. Purpose

The AASTP Digital Engineering API provides controlled, predictable access to validated digital engineering data derived from AASTP-1 Chapter 1. It enables client applications and external systems to browse relevant engineering resources, retrieve individual entities, and request governed engineering calculations.

The API is an access and service layer. It is not an alternative authoritative data store, a copy of repository files, or a source of engineering rules in its own right. The validated JSON data layer remains the single source of truth. The API also supports governed engineering resource selection and resolution, allowing complete Structure-led PES and Exposed Site configurations to be resolved to authoritative engineering resources before calculation.

## 2. Scope

### 2.1 In scope for the MVP

The minimum viable demonstrator supports an end-to-end workflow in which a consumer can:

1. Browse structures, ES types, PES types, and hazard categories.
2. Retrieve a Structure to determine applicable construction, exposure and orientation dimensions.
3. Use the Structure and governed property semantics to determine which engineering inputs are selectable, informational or derived.
4. Select the applicable construction, exposure or orientation values.
5. Submit either:
- an authoritative PES/ES type ID; or
- a complete Structure-led PES/ES engineering configuration.
6. The service validates and resolves any configuration to an authoritative PES/ES type before interaction resolution.
7. Submit the authoritative calculation input, such as NEQ or distance; the service derives calculation direction.
8. Receive the engineering result together with resolved-resource and calculation provenance.

### 2.2 Out of scope for the MVP

The following are intentionally excluded unless added through a governed contract change:

- Editing authoritative engineering data through the API.
- Exposing repository file paths or internal JSON document layout.
- Inventing, silently defaulting or heuristically inferring engineering inputs.
- Bulk export, authentication workflows, user administration, and audit-log retrieval.
- Resources from AASTP chapters or tables not yet represented and validated in the data layer.

Governed resource resolution from complete validated configurations is explicitly in scope and must be driven only by authoritative data and approved resolution rules.

## 3. Design principles

- **Authoritative data remains separate.** JSON is the source of truth; the API exposes resources derived from validated JSON.
- **Resource-oriented.** Stable, human-understandable resources are preferred over file-oriented endpoints.
- **Selection-aware.** The API distinguishes browsing engineering resources from selecting and resolving the resources that define an engineering problem.
- **Explicit and predictable.** Inputs, units, assumptions, versions, and errors are declared rather than implied.
- **Validated by design.** The API serves only data that has passed the applicable validation process and rejects invalid calculation requests.
- **Backwards compatible where practical.** Non-breaking additions are preferred; breaking changes require a new major API version.
- **Traceable.** Results identify the contract and data versions used to produce them.
- **Governed errors.** Error identifiers and their meanings are controlled by the Error Code Registry, rather than redefined by individual endpoints.
- **Client-neutral.** The contract supports web, mobile, analytical, and external-system consumers without embedding presentation concerns.
- **Extensible.** New AASTP resources and calculation capabilities can be added without reshaping existing resources unnecessarily.
- **Controlled values have one authority.** Approved engineering terms and permissible values are defined once in the authoritative data layer. OpenAPI describes their structure and use; it does not duplicate controlled vocabularies as independently maintained enums.
- **Resolution occurs within validation.** Configuration-based PES and Exposed Site selections are resolved to authoritative resources before interaction resolution or engineering calculation.
- **Original requests are preserved.** Validation, normalisation and canonicalisation must not mutate the submitted client request; resolved resources and resolution evidence are represented separately.

## 4. Intended consumers

The API is designed to support multiple consumer types without requiring consumers to reproduce authoritative AASTP engineering logic locally.

Intended consumers include:
- web applications;
- mobile applications;
- engineering tools such as Excel and Power BI;
- national or NATO informational systems;
- automated engineering and analytics tools;
- future AASTP digital services.

Human-facing clients may use the API to guide Structure-led PES and Exposed Site selection, while system integrations may reference authoritative PES and ES Type identifiers directly where those identifiers are already known.

All consumers use the same authoritative API contract. No consumer is expected to reproduce resource-resolution, interaction-selection or engineering-calculation logic independently.

## 5. Architecture overview

Client Applications
        │
        ▼
Versioned REST API
        │
        ▼
Engineering Service
        │
        ▼
Validation Service
        │
        ├── Request validation
        ├── Resource selection validation
        ├── PES / ES resource resolution
        └── Orientation validation
        │
        ▼
Validated Engineering Context
        │
        ▼
Interaction Resolution
        │
        ▼
Engineering Assessment
        │
        ▼
API Response

With authoritative information flowing into that pipeline through:

Authoritative JSON
        │
        ▼
Repository Service
        │
        ├──────────────► Validation / Resource Resolution
        ├──────────────► Interaction Resolution
        └──────────────► Engineering Assessment

1. The REST API does not directly access authoritative JSON datasets. Authoritative data access is mediated through the repository/service architecture.
2. PES and ES configurations are resolved during validation to authoritative engineering resources before interaction processing.
3. Interaction and engineering processing operate only on validated, resolved engineering contexts.
4. The API response exposes governed results and appropriate resolution/provenance evidence rather than the internal service context.

## 6. Versioning strategy

### 6.1 API version

The API major version is expressed in the URL path:

```text
/api/v1/
```

`v1` is the proposed initial public contract. A breaking change—such as removing a field, changing a field’s meaning or type, or changing a calculation result semantics—requires a new major version.

### 6.2 Data version

The data version is expressed as `dataVersion` in response metadata and identifies the authoritative AASTP dataset used. For example:

```json
{
  "dataVersion": "AASTP-1-D-1"
}
```

### 6.3 Calculation-method version

Calculation results must additionally identify `calculationMethodVersion`. These versions enable a consumer to understand which governed release produced an output without coupling the consumer to a repository implementation.

### 6.4 Breaking vs Non-breaking changes

The following changes would typically be classified as non-breaking:

- adding a new Structure,
- adding a new PES Type,
- adding a new optional response property,
- correcting authoritative engineering data through a governed release.

The following would be considered breaking changes and warrant `v1`─►`v2` or similar:

- removing or renaming an API field,
- changing a field's meaning,
- changing an identifier field to a structurally incompatible representation,
- making an optional request property mandatory,
- changing endpoint semantics,
- removing an endpoint.

### 6.5 Metadata representation

Every resource response and calculation result must expose a `metadata` object containing at least:

- `apiVersion`
- `dataVersion`
- `validationStatus`
- `authenticationStatus`
- `generatedAt`

Every governed response, including an error response, includes `metadata`. Calculation responses additionally include `calculationMethodVersion`.

The final dataVersion vocabulary must be based on approved AASTP material. It must not be fabricated by an API implementation.

## 7. Resource model

### 7.1 Resource identity

Each public resource has a stable `id`. IDs are opaque to consumers: consumers may store and use them, but must not derive meaning from their internal format. Human-readable names are provided separately.

### 7.2 Common representation

Public engineering resources have stable resource representations that are carried within a governed API response envelope. Resource fields describe the engineering entity; response metadata describes API, data-release, validation provenance, and authentication status of the data model used.

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "AASTP-1-D-1",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T17:00:00Z"
  }
}
```

### 7.3 Resource relationships

- A **structure** is a public engineering resource and the starting point for engineering resource selection. It defines which construction and exposure properties are applicable and identifies the orientation type governing valid orientation selections.
- An **ES type** is an authoritative resolved engineering resource associated with a Structure. It represents one governed combination of applicable construction and exposure characteristics.
- A **PES type** is an authoritative resolved engineering resource associated with a Structure. It represents one governed combination of applicable PES construction characteristics.
- A **hazard category** is the authoritative hazard-related resource and encompasses Hazard Division and SsD.
- A **resource selection** is the client-facing definition used to identify a PES or ES resource. A selection may be supplied either as a direct authoritative resource identifier or as a complete Structure-led engineering configuration.
- A **calculation request** identifies PES and ES resources either by stable authoritative resource ID or by complete Structure-led engineering configuration, together with the Hazard Category, applicable orientation selections and required engineering inputs. Configuration-based PES/ES selections are resolved to authoritative resources during validation before interaction processing.

The API returns relationships as resource IDs or embedded, explicitly versioned information only where doing so is necessary to make a resource independently useful. It must not duplicate authoritative information merely for convenience.

### 7.4 Browsing, selection, and resolution

The API supports three related but distinct activities.

**Resource browsing** allows a consumer to discover and retrieve validated public engineering resources. It is used for navigation, reference, and selection interfaces, and includes structures, ES types, PES types, Hazard Categories and orientation-related information.

**Engineering resource selection** describes the engineering configuration supplied by the client. Selection begins with a Structure and includes only the construction and exposure properties applicable to that Structure. Orientation is selected separately using the orientation type associated with the structure. A client may alternatively provide a known authoritative PES Type or ES Type identifier directly.

**Engineering resource resolution** is performed during request validation. A complete Structure-led configuration is matched against authoritative PES/ES definitions. Where no exact resource exists, validated Resource Resolution Rules may canonicalise the configuration or declare it undefined. Only an authoritative resolved resource may proceed to interaction resolution.

The API must preserve this distinction. A structure does not itself prescribe construction, exposure, or orientation values, and an ES or PES definition does not redefine the structural applicability framework. The authoritative data and validation layer govern the relationship between them.

### 7.5 Resource selection contract

PES and ES selections use a hybrid contract. For each PES selection, exactly one of the following is provided:
- a direct PES Type identifier; or
- a complete PES configuration.

For each ES selection, exactly one of the following is provided:
- a direct ES Type identifier; or
- a complete ES configuration.

A configuration identifies its Structure and contains only the applicable selectable engineering properties required to define that resource. Informational or derived properties are not independently supplied unless the governing data model explicitly permits them.

Direct-ID and configuration-based selections converge on the same authoritative resolved PES/ES representation before interaction processing.

### 7.6 Property applicability and semantics

Construction and exposure properties have governed semantic roles. A property may be selectable, informational or derived according to the authoritative data model. Structure applicability determines whether the property applies to a particular Structure; property semantics determine how an applicable property participates in selection.

### 7.7 Orientation relationship

Orientation is a governed interaction input that is associated with the selected Structure but is not part of PES/ES resource resolution.

The Structure identifies the applicable orientation type. That orientation type defines the permissible orientation values for the engineering context. The selected orientation is validated after PES/ES resource resolution and before interaction resolution.

Orientation must not be silently defaulted or inferred.

### 7.8 Resolution outcomes

Configuration-based resource resolution may produce one of the following governed outcomes:

- **exact match** - the submitted configuration corresponds directly to one authoritative PES/ES Type;
- **canonicalised** - a validated Resource Resolution Rule transforms the submitted configuration to an authoritative canonical resource;
- **undefined configuration** - the authoritative resolution model explicitly declares the configuration undefined;
- **unresolved** - no authoritative resource or applicable resolution rule covers the submitted configuration.

Exact and canonicalised outcomes may proceed to interaction resolution. Undefined and unresolved configurations fail request validation and do not enter the engineering-assessment pipeline.

## 8. MVP endpoint catalogue

All endpoints below are relative to `/api/v1`. The initial MVP is read-only except for calculation requests, which are stateless service invocations and do not alter repository data.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/structures` | List validated Structures available for browsing and Structure-led engineering selection. |
| `GET` | `/structures/{structureId}` | Retrieve one Structure, including applicable construction/exposure dimensions and its orientation type. |
| `GET` | `/es-types` | List authoritative Exposed Site Types for browsing and reference. |
| `GET` | `/es-types/{esTypeId}` | Retrieve one authoritative Exposed Site Type and its governed engineering characteristics. |
| `GET` | `/pes-types` | List authoritative Potential Explosion Site Types for browsing and reference. |
| `GET` | `/pes-types/{pesTypeId}` | Retrieve one authoritative Potential Explosion Site Type and its governed engineering characteristics. |
| `GET` | `/hazard-categories` | List validated Hazard Categories. |
| `GET` | `/hazard-categories/{hazardCategoryId}` | Retrieve one authoritative Hazard Category. |
| `POST` | `/calculations` | Perform a governed engineering assessment using direct IDs or complete Structure-led PES/ES configurations. |

### 8.1 Resource browsing

Collection endpoints return validated public engineering resources using a common response envelope. Resource browsing supports discovery, navigation, reference and client-side selection workflows; it does not itself resolve a PES or ES configuration or establish a calculation context.

The MVP collection endpoints include Structures, Exposed Site Types, Potential Explosion Site Types and Hazard Categories.

Collection responses contain:

- `metadata`, providing common API, data-release and validation provenance; and
- `data`, containing an array of summary representations appropriate to the resource type.

Summary representations expose only the information required to identify and browse the resource. Detailed engineering characteristics are returned by the corresponding individual-resource endpoint.

Pagination, filtering, ordering and search are not required for the MVP. They may be introduced later as backwards-compatible extensions where consumer requirements justify them.

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": [
    {
      "id": "stable-resource-id",
      "name": "Human-readable name"
    }
  ]
}
```

### 8.2 Entity retrieval and selection support

Individual-resource endpoints use the same common response envelope as collection endpoints. For an individual-resource response, `data` contains a single resource object rather than an array.

`GET /structures/{structureId}` returns the structural selection framework for the selected Structure. It identifies the construction and exposure properties that are applicable to that Structure and the orientation type governing valid orientation selections.

`GET /es-types/{esTypeId}` and `GET /pes-types/{pesTypeId}` return authoritative resolved engineering resources. These resources expose the governed engineering characteristics associated with the selected Structure but do not redefine Structure-level applicability.

Individual-resource responses support client-side browsing and configuration workflows. They do not require the client to perform authoritative resource resolution. A complete Structure-led PES or Exposed Site configuration may instead be submitted to the calculation service, where it is validated and resolved to an authoritative resource before interaction processing.

**Structure retrieval**
`GET /structures/{structureId}` returns the complete public representation of one validated Structure. A Structure is the starting point for configuration-based PES and Exposed Site selection.

The response identifies:
- the Structure's stable identity and human-readable classification;
- the construction properties applicable to the Structure;
- the exposure properties applicable to the Structure; and
- the orientation type and permitted orientation values associated with the Structure.

Applicability indicators define which engineering dimensions apply to the Structure. They do not prescribe a value for those dimensions and do not independently determine whether an applicable property is selectable, informational or derived.

The Structure response must not resolve a PES Type or Exposed Site Type and must not silently supply engineering values. Configuration-based resource resolution occurs during request validation after the consumer supplies the applicable selectable values.

A Structure may support dimensions that are relevant only to PES selection, only to ES selection, or to both. The applicable PES and ES resource definitions determine whether a supported dimension participates in the specific resource-selection workflow.

For the MVP, the Structure entity contract comprises:
- `id` — stable Structure identifier;
- `code` — engineering code;
- `name` — human-readable Structure name;
- `category` — Structure classification;
- `supportedConstructionProperties` — applicability indicators for construction dimensions;
- `supportedExposureProperties` — applicability indicators for exposure dimensions; and
- `orientation` — the applicable orientation type and its permitted values.

The Structure entity does not contain permissible construction or exposure values and does not contain resource-resolution outcomes.

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "id": "STR001",
    "code": "ECM",
    "name": "Earth Covered Magazine",
    "category": "explosives_facility",
    "supportedConstructionProperties": {
      "ecmProtectionRating": true,
      "headwall": true,
      "barricaded": true,
      "roofType": true,
      "aperture": false
    },
    "supportedExposureProperties": {
      "category": false,
      "level": false
    },
    "orientation": {
      "id": "OR001",
      "name": "Directional",
      "values": [
        "front",
        "side",
        "rear"
      ]
    }
  }
}
```

The example illustrates the role of a Structure resource only; its engineering values are exemplars only. The permitted engineering values, orientation vocabulary, applicability relationships and compatibility rules are governed by the validated data release and must not be created or independently maintained by the API implementation.

PES Type and Exposed Site Type resources represent authoritative resolved engineering resources. Each resource identifies one governed combination of Structure and applicable engineering characteristics. These entity responses describe the resolved resource; they do not define the Structure-level applicability framework and do not themselves perform resource resolution.

Individual PES and ES entity responses expose the engineering characteristics of that resolved resource. They must not be interpreted as independently defining the complete permissible value set for the associated Structure.

**Potential Explosion Site (PES) Type retrieval**
`GET /pes-types/{pesTypeId}` returns the complete public representation of one validated PES Type.

The response identifies:
- the PES Type's stable identity and human-readable description;
- the associated Structure;
- the governed construction characteristics defining that PES Type;
- supporting notes where present; and
- the authoritative engineering source reference.

A PES Type does not redefine which construction properties are applicable to its Structure. Structure-level applicability remains governed by the associated Structure resource.

For the MVP, the PES Type entity contract comprises:
- `id` — stable PES Type identifier;
- `code` — engineering code;
- `name` — human-readable PES Type name;
- `structure` — Structure identifier applicable to the PES Type;
- `construction` — governed construction values defining the PES Type;
- `notes` — any notes or comments applicable to the PES Type; and
- `source` — the authoritative source for the PES Type definition.

The PES Type entity does not contain orientation information. Valid orientation selections are obtained from the associated Structure and are validated separately from PES resource resolution.

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "id": "PES002A",
    "code": "HWM-P",
    "name": "Heavy Walled Magazine - Protective Roof",
    "structure": "STR002",
    "construction": {
      "aperture": false,
      "barricaded": null,
      "roofType": "Protective"
    },
    "notes": "",
    "source": {
      "document": "AASTP-1",
      "note": "authoritative-source-reference"
    }
  }
}
```
The public `source` representation will be standardised during OpenAPI schema reconciliation. Differences in source-reference representation within authoritative datasets must not result in inconsistent public API contracts.

**Exposed Site (ES) Type retrieval**
`GET /es-types/{esTypeId}` returns the complete public representation of one validated Exposed Site Type.

The response identifies:
- the ES Type's stable identity and human-readable description;
- the associated Structure;
- the governed construction characteristics defining that ES Type;
- the governed exposure characteristics defining that ES Type;
- supporting notes where present; and
- the authoritative engineering source reference.

An ES Type does not redefine which construction or exposure properties are applicable to its Structure. Structure-level applicability remains governed by the associated Structure resource.

For the MVP, the ES Type entity contract comprises:
- `id` — stable ES Type identifier;
- `code` — engineering code;
- `name` — human-readable ES Type name;
- `structure` — Structure identifier applicable to the ES Type;
- `construction` — governed construction values defining the ES Type;
- `exposure` - governed exposure values defining the ES Type;
- `notes` — any notes or comments applicable to the ES Type; and
- `source` — the authoritative source for the ES Type definition.

The Exposed Site Type entity does not contain orientation information. Valid orientation selections are obtained from the associated Structure and are validated separately from ES resource resolution.

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "id": "ES003A",
    "code": "example-code",
    "name": "Example ES Type",
    "structure": "STR001",
    "construction": {
      "ecmProtectionRating": "PR003",
      "headwall": true,
      "barricaded": false,
      "roofType": null
    },
    "exposure": {
      "category": false,
      "level": false
    },
    "notes": "",
    "source": {
      "document": "AASTP-1",
      "para": "authoritative-source-reference"
    }
  }
}
```
**Hazard Category retrieval**
`GET /hazard-categories/{hazardCategoryId}` returns the complete public representation of one validated Hazard Category.

The response identifies:
- the Hazard Category's stable identity and human-readable description;
- the governed hazard classification represented by that resource;
- any associated engineering characteristics exposed by the validated data model;
- supporting notes where present; and
- the authoritative engineering source reference.

A Hazard Category is selected independently of PES and Exposed Site resource resolution. It forms part of the validated engineering context used during interaction and assessment processing.

For the MVP, the Hazard Category entity contract comprises:
- `id` — stable Hazard Category identifier;
- `code` — authoritative hazard code;
- `name` — human-readable Hazard Category name;
- `description` — explanatory description of the Hazard Category;
- `parentDivision` — parent Hazard Division where applicable;
- `type` - governed classification of the Hazard Category;
- `active` — indicates whether the Hazard Category is active in the served validated release;
- `source` — authoritative source reference for the Hazard Category;
- `effects` - references to the engineering effects associated with the Hazard Category; and
- `supportedQuantityBasis` - the authoritative quantity bases supported by the Hazard Category.

The Hazard Category entity does not define PES/ES Structure applicability, construction, exposure or orientation behaviour.

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "id": "HD001",
    "code": "1.1",
    "name": "Mass Explosion Hazard",
    "description": "Substances and articles which have a mass explosion hazard.",
    "parentDivision": null,
    "type": "hazard_division",
    "active": true,
    "source": {
      "document": "AASTP-1",
      "para": "1.2.1.2.1"
    },
    "effects": [
      "EFF001",
      "EFF002"
    ],
    "supportedQuantityBasis": [
      "NEQ"
    ]
  }
}
```

### 8.3 Engineering calculation service

POST /calculations is the public entry point for a governed AASTP engineering assessment. The operation accepts the engineering information required to establish the PES, ES, interaction and calculation context and returns the resulting governed engineering assessment.

The calculation service is stateless. A response is derived from the submitted request, the validated authoritative data release and the applicable versioned engineering calculation implementation. The service does not persist a calculation record by default.

A calculation request may identify the PES and ES either by authoritative resource identifier or by complete Structure-led engineering configuration. Configuration-based selections are validated and resolved to authoritative PES and ES Types before interaction resolution and engineering calculation.

The calculation service does not heuristically infer, silently default or invent missing engineering inputs. Resource resolution is permitted only where the submitted configuration and authoritative Resource Resolution Rules provide a governed resolution path.

**Resource selection**
PES and ES selections use the hybrid resource-selection contract defined in Section 7.

For the PES, the request must provide exactly one of:
- `pesType` — an authoritative PES Type identifier; or
- `pes` — a complete Structure-led PES configuration.

For the ES, the request must provide exactly one of:
- `esType` — an authoritative ES Type identifier; or
- `es` — a complete Structure-led ES configuration.

Direct-ID and configuration-based selections converge on the same authoritative PES/ES representation during validation. Subsequent interaction and engineering processing does not depend on which selection path the client used.

A configuration identifies its Structure using `structureId` and supplies the applicable selectable construction and, where relevant, exposure properties required by the authoritative resource model.

A configuration must not independently supply properties governed as informational or derived unless explicitly permitted by the authoritative data model. The service validates submitted properties against Structure applicability and governed resource-property semantics before resource resolution.

**Configuration contract structure:**

```json
{
  "pes": {
    "structureId": "structure-id",
    "construction": {
      "exampleProperty": "authoritative-value"
    }
  },
  "es": {
    "structureId": "structure-id",
    "construction": {
      "exampleProperty": "authoritative-value"
    },
    "exposure": {
      "exampleProperty": "authoritative-value"
    }
  }
}
```
**Orientation**
`pesOrientation` and `esOrientation` are explicit interaction inputs and remain separate from PES and ES resource configuration.

The applicable orientation vocabulary is governed by the Structure associated with the resolved PES or ES Type. Submitted orientations are validated against that Structure before interaction resolution.

Orientation does not participate in PES/ES resource resolution and must not be silently defaulted or inferred.

**Hazard Category**
`hazardId` identifies the authoritative Hazard Category applicable to the assessment. The Hazard Category is selected independently of PES/ES resource resolution and is validated before interaction and engineering processing.

The submitted Hazard Category must be active and supported by the authoritative data and applicable engineering relationships. Its supported quantity basis and associated effects are governed by the validated Hazard Category dataset and related engineering datasets.

**Authoritative calculation input**
The request supplies exactly one authoritative calculation input supported by the applicable engineering model. For the MVP calculation service this is:
- `neq` for a forward quantity-distance assessment; or
- `distance` for a reverse quantity-distance assessment.

The service derives calculation direction from the supplied input. The client does not submit a separate `direction` property.

Where an interaction requires a quantity basis other than NEQ, such as MCE, its use must be governed by the Hazard Category, interaction and calculation data. The API must not independently derive or substitute one quantity basis for another.

The input-led model permits additional authoritative calculation inputs to be introduced in future API revisions where supported by the governed data and calculation model, without requiring direction-specific calculation endpoints.

#### Conceptual requests
**Direct-ID request**

```json
{
  "pesType": "authoritative-pes-type-id",
  "esType": "authoritative-es-type-id",
  "pesOrientation": "authoritative-orientation-value",
  "esOrientation": "authoritative-orientation-value",
  "hazardId": "authoritative-hazard-category-id",
  "neq": 2000
}
```

**Configuration-based request**
```json
{
  "pes": {
    "structureId": "structure-id",
    "construction": {
      "exampleProperty": "authoritative-value"
    }
  },
  "es": {
    "structureId": "structure-id",
    "construction": {
      "exampleProperty": "authoritative-value"
    },
    "exposure": {
      "exampleProperty": "authoritative-value"
    }
  },
  "pesOrientation": "authoritative-orientation-value",
  "esOrientation": "authoritative-orientation-value",
  "hazardId": "authoritative-hazard-category-id",
  "neq": 2000
}
```
Mixed selection is also permitted: one resource may be supplied by authoritative ID while the other is supplied as a complete configuration.

#### Validation and resolution pipeline
**Validation and resource resolution**
Before engineering calculation, the service:
1. validates the request structure and required fields;
2. validates direct resource identifiers or Structure-led configurations;
3. resolves configuration-based PES/ES selections to authoritative resources;
4. validates PES and ES orientations against their associated Structures;
5. validates the Hazard Category and authoritative calculation input;
6. establishes the validated engineering context;
7. resolves the applicable interaction; and
8. executes the governed engineering assessment.

A request that fails any required validation or resource-resolution stage does not proceed to interaction resolution or engineering calculation.

**Successful response**

```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "calculationMethodVersion": "calculation-method-identifier",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "result": {
      "exampleOutput": {
        "value": 0,
        "unit": "authoritative-unit"
      }
    }
  }
}
```
The final calculation `data` contract will expose the governed engineering result together with the resource-resolution and calculation provenance required for traceability. Internal service context and resolver objects are not public API contracts and must not be serialized directly unless explicitly represented by an approved response schema.

**Request preservation**
The service must not mutate the submitted request when validating, normalising, canonicalising or resolving engineering resources. Any resolved resource, canonicalisation or derived calculation state is maintained separately from the original request.

Where the calculation response echoes submitted inputs, those inputs represent the client's original request rather than a silently rewritten version of it.

## 9. Request and response conventions

### 9.1 Transport and media type

- API operations use HTTPS in deployed environments.
- Base URL paths use lower-case, plural resource names and hyphenated compound words.
- Request and response bodies use UTF-8 JSON.
- Clients sending a request body must use `Content-Type: application/json`.
- Clients should request JSON with `Accept: application/json`.
- JSON property names use `camelCase`.
- Date-time values use RFC 3339 date-time representation in UTC unless a specific engineering field explicitly requires another governed representation.
- Public API representations must not expose repository file paths, internal module names or implementation-specific object structures.

### 9.2 Requests

API requests must be explicit, structurally valid and sufficient for the requested operation. The API distinguishes request-syntax validation from engineering-domain validation so that consumers can determine whether a failure results from the request representation or from the governed engineering context.

**General request requirements**
- Path parameters identify public resources by stable resource ID.
- Request bodies must conform to the schema defined for the applicable operation.
- Required properties must be present and must use the defined JSON data type.
- Unknown request properties are rejected unless the applicable operation explicitly permits extensible content.
- Controlled engineering values are validated against their authoritative definitions in the served validated data release. They must not be independently maintained by the API implementation.
- The API must not invent, silently default or heuristically infer omitted engineering inputs.
- Invalid request syntax, missing required properties, invalid property types and unknown request properties are request errors and use the applicable `REQ` code from the Error Code Registry.
- A structurally valid request that fails an engineering applicability, relationship or value constraint uses the applicable `VAL` or `ASM` code.

**Engineering resource selection**
Calculation requests use the hybrid PES/ES resource-selection contract defined in Sections 7.5 and 8.3.

For each PES or ES selection, the client supplies exactly one of:
- a stable authoritative PES/ES Type identifier; or
- a complete Structure-led engineering configuration.

A configuration must identify its Structure and provide the applicable selectable properties required by the authoritative resource model. Properties governed as informational or derived must not be independently supplied unless the authoritative data model explicitly permits them.

Configuration-based selections are validated and resolved by the service. Clients are not required to reproduce authoritative resource-resolution logic.

Direct-ID and configuration-based selections are subject to the same authoritative engineering validation before interaction processing.

**Orientation**
PES and ES orientations are supplied explicitly and separately from PES/ES resource configuration. Each orientation must be valid for the Structure associated with the resolved resource.

Orientation is not used to resolve the PES or ES Type and must not be silently defaulted or inferred.

**Hazard Category**
The client explicitly supplies the applicable Hazard Category by stable resource ID. Hazard selection is independent of PES/ES resource resolution and is validated as part of establishing the engineering context.

**Calculation Input**
The client supplies exactly one authoritative calculation input supported by the applicable calculation model. For the MVP this is `neq` or `distance`.

The service determines calculation direction from the supplied authoritative input. Clients must not supply an independent forward/reverse mode.

Calculation-input units, numerical constraints and supported quantity bases are governed by the approved API schema and authoritative engineering model. The API must not perform undocumented unit assumptions or quantity-basis substitutions.

**Request preservation**
Submitted calculation requests are immutable from the perspective of the public API contract. Validation, normalisation, canonicalisation and resource resolution must not alter the original client request. Resolved resources and derived engineering state are maintained separately.

### 9.3 Successful responses

All successful API responses use the common response envelope defined by this contract.

The response contains:
- `metadata` — common API, data-release and validation provenance; and
- `data` — the public representation returned by the operation.

The type and cardinality of `data` are determined by the endpoint:
- collection endpoints return an array of resource summary objects;
- individual-resource endpoints return a single complete resource object; and
- calculation endpoints return a governed calculation-result object.

Successful responses must expose only fields defined by the approved public API contract. Repository representations, internal service context, resolver state and other implementation-specific objects must not be serialized directly into public responses.

Resource identifiers returned by the API are stable authoritative identifiers from the served validated data release.

Successful responses must not silently substitute, reinterpret or modify authoritative engineering values.

**Common response metadata**
All successful responses include:
- `apiVersion` — version of the public API contract;
- `dataVersion` — identifier of the validated data release used to produce the response;
- `validationStatus` — validation state of the served data release;
- `authenticationStatus` - authentication state of the served data release; and
- `generatedAt` — time at which the API generated the response.

Calculation responses additionally include:
- `calculationMethodVersion` — identifier of the governed calculation implementation used to produce the engineering result.

#### General examples
**Collection**
```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": [
    {
      "id": "stable-resource-id",
      "name": "Human-readable name"
    }
  ]
}
```
**Individual resource**
```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "id": "stable-resource-id",
    "name": "Human-readable name"
  }
}
```
**Calculation**
```json
{
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "calculationMethodVersion": "calculation-method-identifier",
    "generatedAt": "2026-08-14T00:00:00Z"
  },
  "data": {
    "result": {
      "exampleOutput": {
        "value": 0,
        "unit": "authoritative-unit"
      }
    }
  }
}
```
The calculation example is conceptual. The final calculation-result representation, including resource-resolution evidence and calculation provenance, must be defined by the approved calculation response schema and must not be inferred from internal service objects.

MVP reference-data retrieval and successful calculations return `200 OK`.

### 9.4 Error responses

All non-success responses use the common error-response envelope defined by the Error Code Registry.

The Error Code Registry is the normative source for:
- HTTP status usage;
- stable application error codes;
- error-envelope structure;
- domain-authority references;
- trace identifiers; and
- the distinction between request, reference, validation, applicability, calculation, data-integrity, system and authentication failures.

API endpoints must use registry-defined error codes where an applicable code exists and must not create endpoint-specific substitutes.

Error responses include the common `metadata` object required by this contract. Where an error expresses an AASTP-derived engineering constraint or applicability decision, the response includes the applicable authoritative source reference in accordance with the Error Code Registry.

Errors must clearly distinguish between:
- malformed or incomplete requests;
- unknown public resources;
- structurally valid requests that fail engineering validation;
- valid engineering contexts for which no approved calculation applies; and
- internal calculation, data-integrity or system failures.

Unsupported engineering relationships, invalid orientations, invalid resource configurations and calculation-applicability failures are not reported as `409 Conflict`. They use `422 Unprocessable Entity` with the applicable governed validation or applicability code.

Error responses must not expose internal exceptions, repository paths, credentials, resolver state or other implementation-specific details.

A failed or unsupported engineering calculation must never be represented as a successful engineering result.

**Conceptual envelope reference**
```json
{
  "error": {
    "httpStatus": 422,
    "code": "governed-error-code",
    "message": "Human-readable error message.",
    "details": [
      {
        "field": "request.property",
        "issue": "Actionable description of the problem."
      }
    ],
    "authority": {
      "standard": "AASTP-1",
      "edition": "approved-edition-identifier",
      "reference": "authoritative-source-reference"
    },
    "traceId": "request-correlation-identifier"
  },
  "metadata": {
    "apiVersion": "v1",
    "dataVersion": "data-release-identifier",
    "validationStatus": "validated",
    "authenticationStatus": "unauthenticated",
    "generatedAt": "2026-08-14T00:00:00Z"
  }
}
```
Optional members such as `details` and `authority` are included only where applicable, as defined by the Error Code Registry.

## 10. Error governance

Error behaviour forms part of the public API contract. All non-success responses must comply with the normative Error Code Registry. Error responses use the common message structure defined in Section 9.4. This section governs error classification and API behaviour.

The Error Code Registry governs:

- HTTP status usage;
- stable application error codes;
- error-code categories and meanings;
- the common error-response envelope;
- use of field-level diagnostic details;
- use of authoritative AASTP source references;
- trace identifiers; and
- the distinction between client, engineering, calculation, data-integrity and system failures.

This API Contract governs the endpoint behaviour and engineering context in which those errors may occur. Individual endpoints and OpenAPI operations must reference applicable registry-defined errors rather than create independent error semantics.

### 10.1 Error classification

The API preserves a clear distinction between different failure classes:
- **request errors** — the submitted representation is malformed, incomplete or structurally invalid;
- **reference errors** — a referenced public resource does not exist in the served validated release;
- **validation errors** — the request is structurally valid but fails a governed engineering input, resource-selection or relationship constraint;
- **calculation applicability errors** — the engineering context is valid but no approved calculation applies;
- **calculation execution errors** — an approved calculation cannot be executed successfully;
- **data-integrity errors** — the served data release or validation boundary is inconsistent or unavailable; and
- **system errors** — an unexpected technical or service failure occurs.

Authentication and authorisation errors apply where the deployment environment introduces those controls.

### 10.2 Resource-resolution failures

Configuration-based PES and ES resource resolution occurs during request validation.

A resource-resolution failure is reported according to the nature of the failure:
- an unknown referenced Structure or direct PES/ES Type is a reference error;
- a missing or structurally invalid configuration property is a request or validation error as governed by the Error Code Registry;
- an invalid engineering property combination, explicitly undefined configuration or unresolved configuration is an engineering validation failure;
- a failure of the validated data or resolution model itself is a data-integrity or system failure rather than a client error.

Configuration-resolution failures must not be represented as successful resource selections and must not proceed to interaction resolution.

The Error Code Registry shall define the stable application codes used for these conditions.

### 10.3 Calculation applicability

A valid engineering request may still result in no approved calculation.

Conditions such as the absence of an applicable interaction, distance rule, formula or approved reverse method are calculation-applicability failures rather than malformed requests.

These conditions use the applicable governed applicability error defined in the Error Code Registry and must never result in a plausible-looking engineering value being returned as successful.

### 10.4 HTTP status principles

HTTP status codes describe the broad transport-level result. Stable application error codes provide the more precise API meaning.

Engineering incompatibility, invalid orientation, prohibited combinations, undefined or unresolved resource configurations, and calculation applicability failures are not represented as `409 Conflict`.

Where the request representation is valid but the selected engineering context cannot be accepted or calculated, the applicable `422 Unprocessable Entity` error is used in accordance with the Error Code Registry.

Internal calculation, validated-data and system failures use the applicable `500` or `503` behaviour defined by the Error Code Registry.

### 10.5 Error traceability

Where an error represents an AASTP-derived engineering constraint or applicability decision, the error response includes an authoritative source reference where that reference is available and governed.

Purely technical errors do not fabricate AASTP authority references.

Every error response includes the common API metadata required by this contract and a trace identifier in accordance with the Error Code Registry.

Error responses must provide sufficient information for a consumer to understand and, where possible, correct the request without exposing internal exceptions, repository paths, credentials, implementation state or other sensitive details.

## 11. OpenAPI alignment

The normative machine-readable API description will be maintained as an OpenAPI document, initially targeting OpenAPI 3.1.

This API Contract governs the architectural intent, public resource model, endpoint semantics and engineering boundaries of the API. The OpenAPI specification expresses that approved contract in machine-readable form and governs operation-level request and response schemas, required properties, transport representations, examples and documented status responses.

OpenAPI must implement the API Contract; it must not independently define AASTP engineering rules or controlled engineering values.

### 11.1 Required OpenAPI coverage

Before MVP implementation is considered contract-complete, the OpenAPI specification must define:
- every path and operation in the MVP endpoint catalogue;
- path parameters and their required representations;
- the common successful-response envelope;
- the common response metadata schema;
- collection summary schemas for Structures, PES Types, ES Types and Hazard Categories;
- complete individual-resource schemas for Structures, PES Types, ES Types and Hazard Categories;
- the hybrid PES and ES resource-selection schemas;
- Structure-led PES and ES configuration schemas;
- orientation inputs;
- Hazard Category selection;
- authoritative calculation inputs;
- the calculation request schema;
- the governed calculation-response schema;
- resource-resolution and calculation provenance exposed by the calculation response;
- the common error-response envelope;
- applicable non-success responses using codes governed by the Error Code Registry; and
- examples derived from validated, non-sensitive engineering data.

### 11.2 Schema composition

Common API representations should be defined once as reusable OpenAPI components and referenced by operations rather than independently reproduced.

Reusable components should include, where appropriate:
- response metadata;
- resource identity and source-reference representations;
- Structure, PES Type, ES Type and Hazard Category resources;
- resource summary representations;
- PES and ES direct-ID selections;
- PES and ES configuration selections;
- orientation selections;
- calculation inputs and outputs;
- calculation provenance;
- resource-resolution provenance; and
- error responses.

Schema composition must preserve the distinction between public API representations and internal repository or service-layer objects.

### 11.3 Hybrid resource-selection representation

The OpenAPI calculation-request schema must enforce the hybrid resource-selection contract defined in Sections 7.5, 8.3 and 9.2.

For each PES selection, exactly one of `pesType` or `pes` is supplied.

For each ES selection, exactly one of `esType` or `es` is supplied.

Mixed selection is permitted, allowing one resource to be identified directly while the other is supplied as a complete configuration.

OpenAPI should express structural exclusivity where practical. Engineering completeness, property applicability, resource-property semantics and authoritative resource resolution remain validation responsibilities and must not be duplicated as independently maintained OpenAPI logic.

### 11.4 Controlled engineering values

OpenAPI describes the structure, type and use of controlled engineering values but does not become an independent authority for their permissible vocabulary.

Controlled values governed by the validated data release must not be duplicated as manually maintained OpenAPI enums unless a governed design decision explicitly requires that representation and establishes how consistency with the authoritative data is assured.

Where runtime validation depends upon authoritative resource relationships, applicability rules or controlled values, those constraints are enforced through the validated data and service layers.

### 11.5 Calculation schemas

The OpenAPI calculation-request schema must represent the input-led calculation contract defined in Section 8.3.

For the MVP, the request accepts exactly one authoritative calculation input: neq or distance. The client does not submit a separate calculation direction.

OpenAPI defines the public representation, data type and documented constraints of these inputs. Engineering applicability, supported quantity basis and calculation-method selection remain governed by the authoritative data and engineering service.

The calculation-response schema must expose only approved public engineering results and provenance. Internal service context, resolver state and calculation implementation objects must not be exposed merely because they exist internally.

### 11.6 Error alignment

OpenAPI must document the applicable non-success responses for each operation using the common error representation defined in Section 9.4.

Stable application error codes and their meanings remain governed by the Error Code Registry. OpenAPI references those governed semantics and must not create competing endpoint-specific error definitions.

### 11.7 Contract consistency

The API Contract, OpenAPI specification, API Design Principles, Error Code Registry and API Change Management Framework form a governed API specification suite and must remain mutually consistent.

Where normative components differ or create ambiguity in public API behaviour, the discrepancy must be resolved through the API Change Management Framework. Implementation must not silently choose one interpretation.

Changes to OpenAPI that alter public endpoint semantics, required inputs, response meaning or compatibility must be assessed against the versioning rules in Section 6 before release.

## 12. Security assumptions

### 12.1 Security boundary and principles

Security controls protect the confidentiality, integrity and availability of the digital engineering service without altering the authoritative engineering model or the meaning of engineering results.

The MVP is designed as a publicly accessible engineering service. Reference-data and calculation endpoints do not require client authentication unless required by the deployment environment. Future authentication and authorisation controls may be introduced without changing the engineering semantics of public resources, calculation requests or calculation responses.

Public accessibility does not imply that the served engineering data is authenticated as an approved authoritative release. Validation status and release authentication are independent assurance properties and must be represented separately.

Every MVP response must identify the authentication status of the served data release. Until an approved release-authentication mechanism and associated governance process are implemented, responses must identify the release as unauthenticated.

An unauthenticated release may have passed the applicable engineering validation process. Accordingly, validationStatus must not be used to imply release authentication, approval or custodial endorsement.

Security controls must not:
- alter authoritative engineering data or calculation semantics;
- silently modify engineering requests or results;
- bypass engineering validation or resource resolution;
- cause an unauthenticated release to be represented as authenticated;
- conceal validation, applicability or calculation failures; or
- create an independent source of engineering rules or controlled values.

Security architecture must preserve the ability to introduce stronger release authentication, client authentication, authorisation and deployment controls without requiring changes to the underlying engineering resource model.

Release authentication is intended to provide verifiable evidence that the served data release has been approved by the authorised AASTP custodian or other designated governance authority. The mechanism for establishing authentication, including digital signature, signature verification, custodian authority and release-approval processes, is governed separately from this API Contract. Until that mechanism is formally established and successfully verified, the API must report the served release as `unauthenticated`.

### 12.2 Transport security

All deployed public API traffic must use HTTPS. Unencrypted HTTP must not be used to transmit engineering requests, responses or service metadata across public or untrusted networks.

Transport security protects API communications against unauthorised disclosure and modification while in transit. It does not establish the engineering validity or release authentication status of the data being served.

The deployed service must:
- use HTTPS for all public API endpoints;
- use transport-security protocols and configurations appropriate to the approved deployment environment;
- prevent or redirect unencrypted public API access in accordance with the deployment security policy;
- protect request and response content from modification while in transit;
- ensure transport-security configuration is maintained independently of authoritative engineering data and calculation logic; and
- fail securely where the required transport-security boundary cannot be established.

Transport-layer certificates authenticate the network service endpoint; they do not authenticate the AASTP data release. Release authentication is represented separately by authenticationStatus and is governed by the release-authentication process defined in Section 12.1.

Local development and automated testing environments may use non-HTTPS transport where required for development purposes, provided that such environments are clearly separated from the deployed public service and cannot be represented as production endpoints.

### 12.3 Access control

The MVP is designed as a publicly accessible engineering service. Public reference-data endpoints and POST /calculations do not require client authentication or authorisation unless additional controls are imposed by the deployment environment.

Public access to the service does not imply that the served AASTP data release is authenticated, approved or endorsed by an authorised AASTP custodian or AC/326 authority. Release authentication is represented independently by authenticationStatus in accordance with Section 12.1.

The API architecture must permit client authentication and authorisation controls to be introduced in future deployments without changing the engineering meaning of public resources, calculation requests or calculation responses.

Access-control mechanisms must remain separate from authoritative engineering data, validation, resource resolution and calculation logic. They must not:
- alter engineering inputs or results;
- modify or bypass engineering validation;
- change PES, ES, Hazard Category or interaction resolution;
- cause an unauthenticated data release to be represented as authenticated;
- create independent engineering rules or controlled values; or
- produce different engineering outcomes solely because different authorised clients submit otherwise identical engineering requests against the same governed service configuration.

Where authentication or authorisation is introduced, access failures must use the applicable error behaviour governed by the Error Code Registry and must occur without exposing protected engineering-service operations or implementation details.

Access-control policy, credential mechanisms, identity providers, roles, permissions and administrative access are deployment and security-governance concerns and are not prescribed by this API Contract.

The public engineering API does not provide operations for creating, modifying or deleting authoritative AASTP engineering data or release-governance information. Management of authoritative data, release approval, digital signatures and custodial authority occurs outside the public API boundary.

### 12.4 Input and service protection

The public API must protect the availability and integrity of the engineering service against malformed, abusive or excessive requests.

Security-oriented request controls are distinct from engineering validation. Security controls protect the service boundary; engineering validation determines whether a structurally valid request represents an acceptable engineering context.

The deployed service must:
- reject malformed request bodies and unsupported media types;
- enforce the request schemas defined by the approved API contract;
- reject unknown request properties except where extensibility is explicitly permitted;
- apply appropriate request-size limits;
- apply rate limiting or equivalent traffic controls appropriate to the deployment environment;
- limit request-processing time and resource consumption so that individual requests cannot unreasonably degrade service availability;
- validate path parameters and other externally supplied identifiers before using them to access service resources;
- prevent externally supplied input from being interpreted as executable code, filesystem paths, repository locations or implementation commands;
- fail safely when service-protection limits are exceeded; and
- return governed API errors without exposing sensitive implementation details.

Service-protection controls must not replace, weaken or bypass engineering validation. A request that passes transport and security checks must still pass the full validation, resource-resolution and engineering-applicability process before an engineering result may be returned.

Conversely, an engineering validation failure must not be treated as evidence of malicious activity merely because the submitted engineering configuration is invalid or unsupported.

Rate limits, request-size limits, timeouts and similar operational thresholds are deployment controls. Their specific values are not defined by this API Contract and may vary between approved deployments without changing engineering semantics.

Where a protection control prevents a request from being processed, the API must use the applicable HTTP and error behaviour governed by the Error Code Registry.

### 12.5 Data and release integrity

The public API may serve engineering data and perform governed calculations only against an identifiable data release that has passed the required validation process for that deployment.

The service must establish the integrity state of the data release before making it available through public endpoints. A data release that is missing, corrupt, inconsistent with its declared version, or otherwise fails the required validation boundary must not be served as valid engineering data.

Validation status and release authentication are separate assurance properties:
- `validationStatus` identifies whether the served release has passed the applicable engineering validation process; and
- `authenticationStatus` identifies whether the served release has been authenticated as an approved release through the governed release-authentication process.

For the MVP, the served release may be validated but remains unauthenticated until an approved release-authentication mechanism is implemented and successfully verified. MVP responses must therefore explicitly identify the release as unauthenticated.

A future authenticated release is expected to be supported by verifiable evidence that the served data model has been approved by the authorised AASTP custodian or other designated AC/326 governance authority. Digital signature is the intended mechanism for demonstrating that approval, but the cryptographic implementation, custodian authority, key management and release-signing process are governed outside this API Contract.

The service must not represent a data release as authenticated merely because:
- the release passed engineering validation;
- the repository from which it was loaded is trusted;
- the service is accessed over HTTPS;
- the data version matches an expected identifier; or
- a checksum confirms that files have not changed since an unapproved reference state.

Authentication status may be reported as authenticated only when the approved release-authentication mechanism has positively verified the served release and its governing approval evidence.

The deployed service must:
- load authoritative engineering data only through the governed repository/service boundary;
- verify that the served release corresponds to the declared dataVersion;
- prevent a failed, partial or inconsistent release from being exposed as a valid release;
- prevent calculation processing when the required authoritative data cannot be established reliably;
- preserve the association between calculation results and the exact data release used to produce them;
- ensure that release-integrity failures are reported as data-integrity or service failures rather than as client errors;
- ensure that deployment or operational controls cannot silently alter authoritative engineering values; and
- preserve sufficient release provenance to support later audit, reproduction and assurance.

Where release integrity cannot be established, the service must fail safely and must not return engineering data or calculation results in a form that could reasonably be interpreted as authoritative.

### 12.6 Logging and information exposure

The deployed service must maintain sufficient operational logging to support security monitoring, fault investigation, service assurance and audit without unnecessarily retaining engineering requests, sensitive information or implementation details.

Operational logging is separate from engineering provenance. API response metadata and calculation provenance identify the governed data and calculation context associated with a response; operational logs record information required to operate and protect the service.

The deployed service should record, where appropriate:
- request time and operation;
- HTTP response status and applicable stable application error code;
- request trace or correlation identifier;
- API version;
- data release identifier;
- validation and authentication status of the served release;
- calculation method version for calculation operations;
- service, validation, data-integrity and security events required for operational assurance; and
- sufficient technical information to investigate failures without exposing protected implementation details.

Logging must not routinely record information that is unnecessary for service operation or assurance. In particular, logs must not expose:
- credentials, authentication tokens, private keys or other security secrets;
- digital-signature private material or custodian signing credentials;
- internal filesystem or repository paths where disclosure is unnecessary;
- internal stack traces or implementation state to API consumers;
- information excluded by applicable security, privacy or deployment policy; or
- authoritative engineering data merely to create an unnecessary duplicate copy of the governed data layer.

Complete calculation requests and responses must not be retained by default solely because a calculation has been performed. Where a deployment requires calculation retention for audit, regulatory, national or operational purposes, that retention must be explicitly governed and must remain separate from the stateless calculation behaviour defined by this API Contract.

Error responses must provide sufficient information for a consumer to understand and, where possible, correct a request, but must not expose internal exceptions, stack traces, repository locations, credentials, security configuration or other implementation-specific information.

Trace identifiers exposed through governed error responses must permit authorised operators to correlate a client-visible failure with the corresponding operational event without exposing internal logging information to the client.

Logging failures must not alter engineering data or calculation results. Where required operational or security logging cannot be established, the deployment must respond in accordance with its approved security and availability policy rather than silently weakening mandatory assurance controls.

Log retention periods, storage locations, access permissions, monitoring mechanisms and detailed audit requirements are deployment and security-governance concerns and are not prescribed by this API Contract.

### 12.7 Future security controls

The MVP security model establishes the minimum controls required for a publicly accessible, validated but unauthenticated engineering service. The architecture must support the introduction of additional security and assurance controls as the service progresses toward operational or formally governed use.

Future controls may include:
- client authentication and identity management;
- role-based or policy-based authorisation;
- deployment-specific access restrictions;
- automated verification of digitally signed AASTP data releases;
- verification of custodian or designated governance authority;
- certificate, credential and cryptographic key management;
- enhanced security monitoring and audit;
- deployment-specific calculation-record retention;
- integration with organisational or NATO identity and security services; and
- additional controls required by the approved hosting or operational environment.

The introduction of additional security controls must not change the authoritative engineering meaning of resources, requests, validation outcomes, resource resolution or calculation results.

Where future controls restrict access to an existing operation, the access restriction should be implemented independently of the engineering operation wherever practical. An otherwise identical engineering request processed against the same authenticated data release and calculation method must produce the same engineering outcome regardless of the client identity or access-control mechanism.

Future release-authentication controls must preserve the distinction between engineering validation and release authentication. A release may be reported as authenticated only where the approved release-authentication process has positively established that the served release corresponds to a release approved by the authorised AASTP custodian or other designated governance authority.

Security extensions that alter public request or response representations, introduce new mandatory client behaviour, or otherwise affect compatibility are subject to the API versioning and change-control requirements defined by this contract.

Detailed security architecture, cryptographic mechanisms, identity-provider selection, key management, custodian-signature processes, operational monitoring and deployment-specific security controls are governed outside this API Contract by the applicable Security and Integrity Strategy and associated implementation documentation.

The absence of a future security capability from the MVP must not be represented as though that capability has been implemented.

## 13. Future extension points

The API architecture is intentionally designed to support controlled extension beyond the MVP without requiring existing engineering resources or operations to be unnecessarily redesigned.

Future capabilities must be introduced through the governed change process and must preserve the architectural boundaries established by this contract. In particular, extensions must preserve:
- authoritative JSON as the single source of engineering truth;
- separation of the knowledge, data, validation, service/API and client layers;
- stable public resource identities;
- the distinction between Structure applicability, engineering resource selection and authoritative resource resolution;
- validation and resource resolution before interaction processing;
- separation between engineering validation and release authentication;
- governed calculation and release provenance;
- the common response and error conventions;
- backwards compatibility within an API major version wherever practical; and
- the principle that clients are not required to reproduce authoritative AASTP engineering logic.

Future requirements should normally be implemented by extending existing resources and operations or by introducing new resources and operations. Existing public representations must not be repurposed with incompatible meanings merely to accommodate new functionality.

Where a proposed extension changes an existing public contract incompatibly, the change must be managed in accordance with the versioning and change-control principles defined by this contract.

### 13.1 Additional AASTP content

Future releases may extend the digital engineering service to additional AASTP chapters, tables and engineering domains as those materials are converted into governed digital representations.

Additional AASTP content should use the established architectural pattern wherever applicable:

**Knowledge Layer → JSON Data Layer → Validation Layer → Service/API Layer → Client Applications**

The existing Chapter 1 resource model must not be assumed to represent engineering concepts that are materially different in other AASTP content. Where authoritative source material introduces new engineering concepts, relationships or behaviours, these should be represented explicitly through appropriate data resources, validation rules, service capabilities and public API representations.

New engineering content must:
- preserve authoritative JSON as the single source of structured engineering truth;
- use stable, governed identifiers;
- maintain separation between engineering data and application logic;
- define and validate references and relationships explicitly;
- provide sufficient provenance to identify the authoritative source material;
- pass the applicable validation and assurance process before being served;
- preserve existing resource identities and API behaviour wherever practical; and
- avoid duplicating existing governed engineering concepts where references or shared resources provide an appropriate representation.

Extension to additional AASTP content may introduce new resource types, relationships, validation requirements, calculation methods and API operations where required by the authoritative engineering model. Such extensions must not silently change the meaning of existing resources merely to accommodate new content.

Where engineering concepts are shared between chapters or domains, common governed resources should be reused where their meaning is genuinely equivalent. Similar terminology alone must not be treated as evidence that two engineering concepts are identical.

New AASTP content must be incorporated through the governed change and versioning process before becoming part of a supported public API release.

### 13.2 Resource discovery and data access

Future consumer requirements may justify additional capabilities for discovering, navigating, retrieving and comparing public engineering resources.

The MVP intentionally provides simple collection and individual-resource retrieval without requiring filtering, ordering, pagination or search. Additional discovery capabilities may be introduced where justified by dataset size, consumer workflows or integration requirements.

Future capabilities may include:
- filtering by defined public resource properties;
- ordering of collection results;
- pagination of large collections;
- text or structured search;
- retrieval of multiple identified resources in a single operation;
- bulk export of public engineering data;
- discovery of available data releases;
- retrieval of release metadata;
- comparison between governed data releases; and
- explicit cache-control and conditional-retrieval behaviour for stable reference data.

Resource-discovery capabilities must operate on approved public API representations and must not expose repository organisation, filenames, filesystem paths or internal data structures as part of the public contract.

Filtering, search and other discovery mechanisms must not become independent sources of engineering classification or applicability logic. Where a discovery operation uses controlled engineering properties, their meaning remains governed by the authoritative data release.

Discovery operations may assist a consumer in locating candidate engineering resources, but they must not be represented as authoritative PES or ES resource resolution unless the operation explicitly invokes the governed resource-resolution process.

Bulk or release-oriented access must preserve sufficient provenance for a consumer to identify the applicable data release, validation status and authentication status. Exported data must not be represented as an authenticated AASTP release unless the applicable release-authentication evidence remains valid and verifiable for that representation.

New discovery and retrieval capabilities should be introduced as backwards-compatible extensions wherever practical and must use the versioning and change-control process defined by this contract where they alter public behaviour.

### 13.3 Selection and resolution services

The MVP performs authoritative PES and ES resource resolution as part of calculation-request validation. Clients may therefore submit complete Structure-led engineering configurations without independently determining the corresponding authoritative PES or ES Type.

Future consumer requirements may justify additional selection-support or explicit resource-resolution operations. Such capabilities may support interactive client workflows where a consumer needs to identify, inspect or confirm an authoritative PES or ES Type before submitting a calculation.

Any future authoritative resource-resolution service must use the same governed data, resource-property semantics, Resource Resolution Rules and validation processes used by the engineering calculation service. It must not introduce a separate implementation or independent source of resolution logic.

Future selection and resolution capabilities must preserve the distinction between:
- Structure-level property applicability;
- client-supplied engineering configuration;
- resource-property semantics governing how applicable properties participate in selection;
- authoritative resource resolution;
- resolved PES or ES Type identity; and
- orientation as a separately validated interaction input.

A selection-support operation may assist a consumer in constructing a valid configuration or identifying candidate values or resources. Such assistance must not be represented as authoritative resource resolution unless the complete governed resolution process has been applied successfully.

Where an explicit authoritative resolution operation is introduced, equivalent engineering configurations must resolve consistently with the calculation service when processed against the same data release and resolution model. Resolution outcomes must not depend on which public API operation initiated the resolution.

Resolution responses must provide sufficient provenance to identify the data release and applicable resolution outcome. Where canonicalisation or another governed Resource Resolution Rule determines the authoritative resource, the public representation should provide sufficient resolution provenance for the outcome to be understood and audited without exposing internal resolver implementation state.

Undefined, unresolved or invalid configurations must produce governed outcomes consistent with the validation and error model defined by this contract. An explicit resolution endpoint must not convert a configuration that would fail calculation-request validation into a valid authoritative resource.

The exact endpoint structure, request schema and response representation for future selection-support or resource-resolution services are not defined by the MVP and must be established through the governed API change process before implementation.

### 13.4 Additional calculation capabilities

Future releases may introduce additional calculation methods, authoritative input types, quantity bases, engineering outputs and applicability criteria where supported by authoritative AASTP content.

Additional calculation capabilities should use the input-led calculation model established by this contract where that model accurately represents the authoritative engineering method. The client should provide the authoritative engineering input required by the method, while calculation direction, applicable rules and calculation method are determined by the governed engineering service wherever these can be derived unambiguously from the validated engineering context.

Direction-specific endpoints or client-selected calculation methods should not be introduced merely because an engineering relationship supports multiple calculation directions. Where the applicable calculation behaviour can be determined authoritatively from the submitted engineering context, that determination remains a service responsibility.

Future authoritative engineering methods may require inputs, outputs or processing models that differ materially from the MVP quantity-distance calculation model. Such methods must not be forced into the existing calculation contract where doing so would obscure their engineering meaning or require artificial representations.

New calculation capabilities must:
- be supported by authoritative engineering source material;
- represent required inputs and outputs explicitly;
- define applicable units and quantity bases;
- define engineering applicability and constraints;
- identify the governed calculation method used;
- be incorporated into the applicable validation and assurance framework;
- preserve sufficient provenance to reproduce and audit the engineering result;
- define forward, reverse or other calculation behaviour where applicable;
- fail explicitly where no approved calculation method applies; and
- be represented in the API and OpenAPI specifications through the governed change process before public implementation.

Additional calculation methods must remain separate from authoritative engineering data where appropriate. Calculation implementation must consume governed engineering definitions rather than embed independently maintained copies of formulas, constants, transformations, applicability rules or controlled engineering values.

Where multiple approved calculation methods could potentially apply to the same engineering context, the method-selection rule must itself be explicitly governed. The API must not select between competing engineering methods through undocumented implementation precedence or client assumptions.

Calculation responses must continue to identify the data release and calculation-method version required to understand and reproduce the result. Where additional governed provenance is required by a future calculation method, it may be added through backwards-compatible extension or an appropriately versioned API change.

The exact request and response representations for future calculation capabilities are not defined by the MVP and must be derived from the applicable authoritative engineering model before implementation.

### 13.5 Localisation and knowledge integration

Future releases may support localisation of narrative knowledge, terminology, explanatory content and references to improve the usability of the digital AASTP service across NATO nations and other authorised user communities.

Localisation is not limited to translation. A localised knowledge representation may supplement the NATO baseline with nationally relevant terminology, explanatory material, cross-references and references to national standards or guidance, provided that the provenance and authority of that material remain explicit.

The authoritative NATO engineering data and knowledge baseline must remain distinguishable from localised or nationally supplied knowledge. Localisation must not silently modify, replace or override NATO engineering rules, controlled values, resource identities, calculations or authoritative source references.

Localised knowledge may include:
- translated narrative and explanatory content;
- nationally preferred engineering terminology and abbreviations;
- national equivalents or explanatory mappings for NATO terminology;
- references and cross-references to applicable national standards, publications or guidance;
- national explanatory notes describing the relationship between NATO and national material;
- localised presentation of source references where appropriate; and
- other contextual information that assists users in interpreting or applying the NATO baseline without changing its engineering meaning.

Every localised knowledge item must preserve sufficient provenance to distinguish:
- the underlying NATO content or engineering concept to which it relates;
- the nation, organisation, language or other localisation context;
- the source and authority of the localised information; and
- where applicable, the version or edition of the referenced national material.

National references must supplement rather than replace the authoritative NATO source reference. Where both NATO and national references apply, the service should preserve both so that a consumer can identify the governing NATO source and the associated national context.

Local terminology must not require changes to stable engineering identifiers. Where different terms describe the same governed engineering concept, localisation should associate those terms with the existing stable identifier rather than create duplicate engineering resources.

Where a national concept does not have an equivalent NATO engineering concept, it must not be mapped to an existing resource merely because the terminology is similar. Such relationships must be represented explicitly and governed according to their actual meaning.

Localisation must remain separate from national tailoring. Localised knowledge may explain, translate, supplement or cross-reference the NATO baseline but does not itself alter engineering behaviour. A national requirement that changes an engineering value, applicability rule, resource resolution, interaction or calculation outcome constitutes national tailoring and must be governed separately in accordance with Section 13.7.

The detailed representation, packaging, selection and delivery of localisation content is not defined by the MVP. Future implementation must preserve the separation between authoritative engineering data, NATO knowledge content, localised knowledge and governed national tailoring.

### 13.6 Offline and external integration

Future implementations may support offline operation, local caching, synchronised engineering data and integration with external engineering, planning or information systems.

Offline and external integrations must preserve the same engineering authority, validation and provenance boundaries established by this contract. The use of a local copy, cache, export or external integration must not create an independent source of authoritative AASTP engineering data or logic.

An offline implementation must be able to identify the exact governed data release on which its engineering operations depend. Where applicable, the local representation must preserve:
- `dataVersion`;
- `validationStatus`;
- `authenticationStatus`;
- sufficient release provenance to identify the source release;
- the calculation-method version applicable to calculations performed locally; and
- any other governed dependencies required to reproduce or assure an engineering result.

A locally stored release must retain the validation and authentication state applicable to that specific release. Loss of connectivity to the online service does not itself invalidate an otherwise valid authenticated release, provided that the local release and its authentication evidence remain intact and verifiable.

Conversely, a cached, exported, modified or locally reconstructed dataset must not be represented as an authenticated release merely because it originated from an authenticated source. Any modification that invalidates the governed release identity or authentication evidence must be detectable and reflected in the assurance status presented to the consumer.

Offline implementations must not silently combine engineering resources from different data releases or calculation-method versions. Where multiple releases are retained locally, the active release must be explicitly identifiable.

Synchronisation mechanisms must preserve release boundaries. Updating an offline client from one governed release to another must occur as an identifiable release transition rather than as an uncontrolled series of individual engineering-data changes.

External systems may consume public API resources and calculations or, where a future governed mechanism permits, synchronise approved engineering data for local use. External integrations must not be required to reproduce authoritative resource-resolution, validation or calculation-selection logic where that logic can be provided by the governed AASTP service or approved implementation.

Published schemas, OpenAPI definitions, conformance tests and other interoperability artefacts may be provided to support independent client and service implementations. Conformance with an interface specification does not by itself establish that an implementation is using a validated or authenticated AASTP data release.

The detailed packaging, synchronisation protocol, local-storage representation, release-update mechanism and conformance framework for offline or external implementations are outside the scope of the MVP and must be defined through the governed extension process before implementation.

### 13.7 National tailoring

Future deployments may support governed national tailoring of the authoritative AASTP baseline where a nation applies approved national engineering requirements, restrictions or interpretations that differ from the NATO baseline.

National tailoring is distinct from localisation. Localisation may translate, explain, supplement or cross-reference NATO content without changing engineering behaviour. National tailoring may alter the engineering context and may therefore affect resource availability, resource resolution, applicability, interaction behaviour, calculation processing or engineering outcomes.

The authoritative NATO baseline must remain immutable from the perspective of national tailoring. National requirements must be represented as an explicit governed layer or overlay associated with an identifiable NATO baseline release rather than by modifying the underlying NATO engineering data.

A national tailoring model must:
- identify the nation or other authorised tailoring authority;
- identify the exact NATO baseline release to which the tailoring applies;
- represent each deviation explicitly rather than relying on undocumented implementation behaviour;
- identify the authoritative national source and approval basis for each governed deviation;
- preserve the original NATO engineering value, relationship or behaviour against which the deviation applies;
- distinguish national additions, replacements, restrictions and exclusions in accordance with the approved tailoring model;
- pass the applicable validation and assurance process before use;
- provide sufficient provenance to determine which engineering outcomes were affected by national tailoring;
- prevent nationally tailored values or behaviours from being represented as NATO baseline requirements; and
- preserve the ability to execute or inspect the unmodified NATO baseline independently of the national tailoring.

National tailoring should use references to existing NATO resources wherever possible rather than duplicating baseline engineering data. The tailoring layer should contain only the information required to express the governed deviation and its provenance.

Where a nationally tailored engineering context is used, API responses must provide sufficient metadata or provenance to distinguish:
- the applicable NATO baseline release;
- the national tailoring package or version;
- the validation status of the applicable engineering context;
- the authentication status of the NATO baseline and, where separately governed, the national tailoring; and
- where required for engineering traceability, the national deviation responsible for a changed outcome.

National tailoring must not be applied silently. A consumer must be able to determine whether an engineering result represents the NATO baseline or a nationally tailored engineering context.

Tailoring must be applied through governed service and validation mechanisms rather than through client-side substitution of engineering values. Clients must not be required to reproduce national deviation logic independently.

A nationally tailored calculation must remain reproducible. The applicable NATO baseline, tailoring version, calculation-method version and other governed dependencies required to reproduce the result must therefore remain identifiable.

National tailoring may itself require an approval and authentication model. Authentication of the underlying NATO release does not, by itself, authenticate a national tailoring package, and authentication of a national tailoring package must not imply NATO approval of the national deviation.

The detailed tailoring schema, deviation taxonomy, precedence model, national custodian model, validation requirements, authentication mechanism and public API representation are outside the scope of the MVP and must be defined through the governed extension process before implementation.

A national tailoring package must not be assumed to remain valid when its associated NATO baseline is superseded. Application of existing tailoring to a new NATO baseline must be subject to an explicit compatibility assessment, validation and, where applicable, reapproval before use.

### 13.8 Security, assurance and operational extensions

Future operational deployments may introduce additional security, engineering-assurance and service-management capabilities as the digital AASTP service progresses beyond the MVP.

These capabilities must build upon, rather than bypass or replace, the assurance boundaries established by this contract. Additional operational controls must remain distinguishable from authoritative engineering data and must not independently alter engineering meaning or outcomes.

Future capabilities may include:
- authenticated AASTP data releases supported by governed digital-signature and custodian-approval processes;
- client authentication and identity management;
- role-based or policy-based authorisation;
- enhanced security monitoring, audit and event correlation;
- governed calculation-record retention and retrieval;
- enhanced release and calculation provenance;
- automated integrity and release-authentication verification;
- service health, availability and operational-status reporting;
- deployment-specific security and availability controls;
- integration with organisational or NATO identity, security and monitoring services; and
- additional engineering-assurance evidence required for formally governed or operational use.

Security and operational controls must not change engineering outcomes solely because of client identity, hosting environment, persistence mechanism or operational configuration. Equivalent engineering requests processed against the same governed engineering context, data release and calculation method must produce equivalent engineering outcomes.

Where future deployments persist calculation records, the persisted record must preserve sufficient provenance to identify the engineering context from which the result was produced. Persistence must not change the stateless semantics of POST /calculations unless a future version of the API explicitly introduces a separate operation for creating or managing calculation records.

Future assurance capabilities may expose additional evidence concerning data validation, release authentication, calculation-method assurance or other governed assurance states. Such evidence must remain traceable to the applicable assurance process and must not be generated solely from API implementation assumptions.

Operational status must remain distinct from engineering assurance. The availability or health of the service does not establish that a data release is validated or authenticated, and a validated or authenticated release does not establish that a particular deployment is operationally healthy.

Security, assurance and operational extensions that introduce new mandatory client behaviour or incompatible public representations are subject to the versioning and change-control requirements defined by this contract.

Detailed security architecture, release-signature governance, identity management, operational monitoring, service-management processes and engineering-assurance frameworks are governed by their applicable supporting strategies and governance products rather than being independently defined by this API Contract.

## 14. Milestone 5.2 acceptance criteria

Milestone 5.2 establishes the approved public API contract required before REST API implementation proceeds under Milestone 5.3.

Completion of this milestone requires both the human-readable API Contract and the machine-readable OpenAPI 3.1 specification to represent the approved engineering-service behaviour consistently.

Work completed during development of the underlying service layer may satisfy supporting elements of this milestone where objective evidence already exists. Milestone completion does not require those capabilities to be reimplemented; it requires their externally relevant behaviour to be accurately represented by the approved public contract.

The following criteria define the Milestone 5.2 completion gate.

### 14.1 Architectural and service-boundary agreement

Milestone 5.2 requires the public API architecture to be reconciled with the proven engineering-service architecture.

Acceptance criteria:
✅ - Structure is established as the entry point for configuration-based PES and ES selection.
✅ - Direct-ID and Structure-led configuration selection are supported as alternative public input models.
✅ - Exactly one selection method is permitted independently for each PES and ES.
✅ - Resource resolution occurs during validation before interaction and engineering processing.
✅ - Orientation remains separate from PES/ES resource resolution.
✅ - The original client request is preserved and authoritative resolution outcomes are represented separately.
✅ - API consumers are not required to reproduce authoritative resource-resolution or engineering logic.
✅ - The public API exposes service capability rather than repository or internal resolver representations.

### 14.2 Public resource and calculation contracts

✅ - Common successful-response envelope defined.
✅ - Structure public entity contract defined.
✅ - PES Type public entity contract defined.
✅ - Exposed Site Type public entity contract defined.
✅ - Hazard Category public entity contract defined.
✅ - Collection behaviour defined for MVP resource browsing.
✅ - Individual-resource retrieval behaviour defined.
✅ - Calculation service behaviour and input-led calculation model defined.
✅ - Direct-ID and configuration-based PES/ES selection behaviour defined.
✅ - Calculation response requirements, including resolution evidence and provenance, defined.
✅ - Known orientation source-data limitations remain outside API implementation assumptions.

### 14.3 Metadata, provenance and assurance

✅ - `apiVersion` defined.
✅ - `dataVersion` defined.
✅ - `validationStatus` defined independently from release authentication.
✅ - `authenticationStatus` defined independently from engineering validation.
✅ - MVP data is explicitly identified as `unauthenticated`.
✅ - `generatedAt` defined for API responses.
✅ - `calculationMethodVersion` required for calculation responses.
✅ - Future authenticated releases are associated conceptually with governed custodian or designated-authority approval.
✅ - HTTPS service authentication is explicitly distinguished from engineering-release authentication.
✅ - National tailoring and future localisation are prevented from obscuring baseline provenance.

### 14.4 Errors, security and compatibility

✅ - Common public error structure defined.
✅ - Stable application error codes distinguished from HTTP status codes.
✅ - Error behaviour requires sufficient client information without exposing internal implementation state.
✅ - Public MVP access model defined.
✅ - Transport-security boundary defined.
✅ - Input and service-protection requirements defined.
✅ - Data and release-integrity requirements defined.
✅ - Logging and information-exposure requirements defined.
✅ - Future security and assurance extension boundaries defined.
✅ - API versioning and backwards-compatibility principles defined.
✅ - Future extension principles established for additional AASTP content, localisation, offline operation, national tailoring and external integrations.

### 14.5 OpenAPI 3.1 completion and conformance

⬜ - Public resource schemas are represented in the modular OpenAPI 3.1 specification.
⬜ - PES and ES direct-ID/configuration XOR relationships are encoded in OpenAPI.
⬜ - Calculation request and response schemas reflect the approved API Contract.
⬜ - Common metadata includes authenticationStatus and all other approved provenance fields.
⬜ - Common error schemas and governed error responses are represented.
⬜ - Collection and individual-resource operations are represented for Structures, PES Types, ES Types and Hazard Categories.
⬜ - POST /calculations is represented using the approved calculation contract.
⬜ - OpenAPI examples use combinations verified against authoritative repository data.
⬜ - The complete modular OpenAPI document resolves and validates successfully.
⬜ - OpenAPI request examples produce the documented service outcomes.
⬜ - Service responses conform to the approved OpenAPI response schemas.
⬜ - Interactive API documentation can be generated from the approved specification.

### 14.6 Milestone approval gate

Milestone 5.2 is complete when:

⬜ - API Contract v0.4.0 is reviewed and accepted as the governing human-readable public interface specification;
⬜ - the modular OpenAPI 3.1 specification is consistent with API Contract v0.4.0;
⬜ - the OpenAPI specification validates successfully;
⬜ - representative valid and invalid requests demonstrate conformance between the API Contract, OpenAPI specification and existing service-layer behaviour;
⬜ - unresolved engineering-source limitations are documented and have not been replaced by unsupported API assumptions;
⬜ - the Error Code Registry is reconciled with API Contract v0.4.0;
⬜ - implementation-affecting decisions are reflected in the applicable governing documentation; and
⬜ - the approved OpenAPI specification is accepted as the implementation contract for Milestone 5.3.

Completion of Milestone 5.2 establishes the public interface baseline. Subsequent REST implementation must conform to this baseline unless a governed contract change is approved.

## Appendix A — Terminology

| Term | Definition |
|---|---|
| **Authenticated release** | A validated data release for which the approved release-authentication process has positively established verifiable evidence of approval by the authorised AASTP custodian or other designated governance authority. |
| **Authentication status** | The assurance state indicating whether the served data release has been authenticated through the approved release-authentication process. It is independent of engineering validation status. |
| **Authoritative data** | The governed JSON data layer from which API resources and engineering processing are derived. |
| **Canonicalisation** | A governed resource-resolution process that maps an otherwise valid engineering configuration to the applicable authoritative resource in accordance with an approved Resource Resolution Rule. |
| **Engineering resource resolution** | The governed determination of the authoritative PES Type or ES Type corresponding to either a supplied authoritative identifier or a complete Structure-led engineering configuration. |
| **Localisation** | Governed translation, terminology, explanatory knowledge or national contextual material that supplements the NATO baseline without changing engineering behaviour. |
| **National tailoring** | A governed national deviation from the NATO baseline that may alter engineering applicability, resource resolution, interaction behaviour, calculation processing or engineering outcomes while preserving the underlying NATO baseline. |
| **Release authentication** | The governed process by which verifiable evidence is established that a data release corresponds to a release approved by the authorised AASTP custodian or other designated governance authority. |
| **Resolution evidence** | Governed provenance describing how an authoritative resource-resolution outcome was established, including applicable canonicalisation or Resource Resolution Rules where required. |
| **Resource browsing** | Discovery and retrieval of public engineering resources without authoritatively resolving a PES Type or ES Type for an engineering context. |
| **Resource selection** | The client-facing process of identifying a PES or ES either by authoritative resource ID or by supplying a complete Structure-led engineering configuration. |
| **Structure** | The engineering resource defining the applicability framework and orientation type used to support PES and ES configuration-based selection. |
| **Unauthenticated release** | A data release for which approved release authentication has not been positively established. An unauthenticated release may nevertheless have passed engineering validation. |
| **Validated release** | A specific version of authoritative JSON data that has passed the applicable engineering validation process and is eligible for API serving under the applicable deployment policy. A validated release is not necessarily an authenticated release. |
| **Validation status** | The assurance state indicating whether the applicable engineering validation process has been satisfied. It does not imply release authentication or custodial approval. |

## Appendix B — Change history

| Date | Contract version | Change | Author / approval |
| --- | --- | --- | --- |
| 2026-08-15 | 0.4.0 | Major contract revision aligned with the completed Structure-led service architecture. Defined hybrid direct-ID/configuration PES and ES selection; validation-stage resource resolution and resolution evidence; complete public Structure, PES Type, ES Type and Hazard Category representations; unified calculation request and response behaviour; common response metadata and provenance; separation of engineering validation from release authentication; expanded security and integrity requirements; governed future extension principles for additional AASTP content, localisation, offline integration and national tailoring; strengthened OpenAPI conformance requirements; and revised Milestone 5.2 acceptance criteria. | Draft |
| 2026-08-10 | 0.3.1 | Replaced direction-specific calculation endpoints with a unified calculation service. The service determines the applicable calculation direction from the submitted authoritative input value and unit, allowing future supported input types without endpoint proliferation. | Draft |
| 2026-08-10 | 0.3.0 | Elevated Structure to a public engineering resource; distinguished resource browsing from engineering resource selection and resolution; added Structure MVP endpoints; defined the structure-led selection workflow and resolved-resource calculation semantics; and reaffirmed single-authority governance for controlled engineering values. | Draft |
| 2026-08-09 | 0.2.0 | Adopted Hazard Category terminology; made Error Code Registry normative; defined common error envelope, HTTP-status mapping, source references, deterministic calculations, and MVP security/performance assumptions. | Draft |
| 2026-08-09 | 0.1.0 | Initial Milestone 5.2 draft: MVP resources, calculation-service boundary, conventions, error model, security assumptions, and acceptance criteria. | Draft |

## Appendix C — Normative companion documents

The following documents form the API documentation suite and must remain consistent with this contract:

| Document | Role |
|---|---|
| `API_CONTRACT.md` | Governing human-readable specification of public API scope, resources, operations, representations and behaviour. |
| `openapi.yaml` | Normative machine-readable expression of the approved public API contract, including operations, schemas, constraints, responses and examples. |
| `API Design Principles.md` | Cross-version architectural principles governing API design and evolution. |
| `Error Code Registry.md` | Normative registry governing HTTP-status usage, error-envelope behaviour and stable application error codes. |
| `API Change Management Framework.md` | Normative process governing proposal, classification, impact assessment, approval, implementation, verification and release of changes to the public API documentation suite. |

The normative companion documents form a governed API specification suite and must remain mutually consistent.

`API_CONTRACT.md` governs the human-readable public interface and behavioural contract. `openapi.yaml` provides its normative machine-readable expression. `API Design Principles.md` governs cross-version architectural principles. `Error Code Registry.md` governs public error semantics and stable application error codes. `API Change Management Framework.md` governs controlled modification of the specification suite.

No individual companion document may be changed in a manner that silently alters engineering semantics or creates an unresolved contradiction with another normative document. Discrepancies must be resolved through the API Change Management Framework before the affected change is approved for release.
