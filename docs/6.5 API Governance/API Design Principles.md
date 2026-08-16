# AASTP Digital Engineering API — Design Principles

| Attribute | Value |
| --- | --- |
| Document status | Draft — companion governing document |
| Document version | 0.4.0 |
| Related API contract | `API_CONTRACT.md` v0.4.0 |
| Last updated | 2026-08-15 |

## 1. Purpose

This document defines the cross-version architectural principles governing the design and evolution of the AASTP Digital Engineering API. It establishes the enduring design rules intended to keep the public API consistent, predictable, maintainable, traceable, interoperable and backwards compatible as AASTP digital content and engineering-service capabilities evolve.

It forms part of the governed API specification suite and complements, but does not duplicate, the API Contract. The API Contract defines the approved public interface and behavioural contract for a particular API baseline; these Design Principles define the architectural rules that should remain applicable across API versions and future extensions.

This document does not independently define endpoint schemas, controlled engineering values, calculation formulae, error-code meanings or authoritative AASTP engineering behaviour. Those concerns remain governed by the applicable authoritative data, API Contract and companion specifications.

## 2. Position in the documentation suite

The API Design Principles form part of the governed API specification suite. Each normative document has a distinct responsibility and must remain consistent with the others.

| Document | Governs |
|---|---|
| `API_CONTRACT.md` | Governing human-readable specification of public API scope, resources, operations, representations and behaviour. |
| `openapi.yaml` | Normative machine-readable expression of the approved public API contract, including operations, schemas, constraints, responses and examples. |
| `API Design Principles.md` | Cross-version architectural principles governing API design and evolution. |
| `Error Code Registry.md` | Normative registry governing HTTP-status usage, error-envelope behaviour and stable application error codes. |
| `API Change Management Framework.md` | Normative process governing proposal, classification, impact assessment, approval, implementation, verification and release of changes to the public API specification suite. |

These documents are complementary rather than competing sources of API requirements. The API Contract governs human-readable public interface and behavioural requirements. OpenAPI provides the corresponding machine-readable interface specification. The Design Principles govern enduring architectural rules. The Error Code Registry governs public error semantics. The API Change Management Framework governs controlled modification of the suite.

Supporting engineering specifications and assurance artefacts may define implementation-independent engineering or schema conventions required by the API, but they do not override the normative API specification suite.

Where normative documents differ or create ambiguity in public API behaviour, implementation must not silently choose an interpretation. The discrepancy must be resolved through the API Change Management Framework before the affected change is approved for release.

## 3. Scope

These principles apply to:
- REST API design and future API versions;
- public engineering resources and reference-data retrieval;
- engineering resource selection and authoritative resource resolution exposed through the public API;
- stateless engineering calculation services;
- public request, response, metadata and provenance conventions;
- validation and assurance boundaries relevant to public API behaviour;
- future AASTP chapters, engineering domains and governed data releases;
- web, mobile, analytical, offline and external-system integrations;
- published OpenAPI descriptions and associated conformance material; and
- future extensions to the public API specification suite.

These principles do not prescribe:
- internal JavaScript, framework, database, hosting or deployment implementation;
- the internal layout of the authoritative JSON repository;
- JSON Schema design except where required to support governed public API representations;
- internal service context, resolver state or processing-object representations;
- AASTP engineering formulae, values, applicability rules or controlled engineering vocabularies;
- deployment-specific identity, credential, cryptographic or operational-security mechanisms; or
- presentation, localisation or client-specific user-interface behaviour.

Where these principles affect public API behaviour, their implementation is expressed through the applicable API Contract, OpenAPI specification and other normative companion documents. Engineering meaning remains governed by the authoritative AASTP content and validated digital engineering model.

## 4. Core principles

### 4.1 Represent the AASTP domain, not the implementation

The public API represents stable AASTP engineering concepts and governed service capabilities, not software components, repository structure or internal processing objects. Public resources use authoritative domain terms such as Structures, Exposed Site Types, Potential Explosion Site Types and Hazard Categories.

The API must not expose repositories, validators, internal filenames, source tables-as-files, resolver state, internal service context or implementation-specific processing objects as public resources or response representations.

Internal implementation may evolve independently provided that the approved public contract, engineering semantics and required provenance remain unchanged.

### 4.2 Preserve the authoritative data boundary

The governed JSON data layer is the single authoritative digital representation from which public engineering resources and engineering processing are derived. The API exposes controlled representations derived from that data; it must not establish or maintain an independent copy of authoritative engineering definitions.

Only data releases that have satisfied the applicable validation requirements may be served by the governed API.

Validation and authentication are separate assurance concepts. Validation establishes that the digital engineering data satisfies the applicable integrity and engineering-assurance requirements. Authentication establishes whether a specific release has been approved through the applicable release-authentication process.

For the MVP, the digital data release is unauthenticated and does not supersede the published AASTP standard. Where a discrepancy exists, the approved published AASTP content remains authoritative.

Future formal adoption of authenticated digital AASTP content may change the publication status of the digital data layer through the applicable AASTP governance process. Such adoption must not be inferred or established by API implementation behaviour.

### 4.3 Keep data, validation, calculation, and clients separate

The architecture maintains explicit separation between authoritative knowledge, engineering data, validation and resource resolution, engineering processing, public interfaces and consuming applications.

```text
Knowledge layer
       |
       v
Authoritative JSON data layer
       |
       v
Validation and resource-resolution layer
       |
       v
Engineering Service
       |
       v
REST API
       |
       v
Client applications and external integrations
```
*The diagram represents architectural responsibility and dependency rather than the literal runtime sequence of an API request.*

Each layer has a distinct responsibility. Engineering data must remain separate from application logic. Validation and authoritative resource resolution occur before governed engineering processing. The Engineering Service operates on validated and resolved engineering context. The REST API exposes approved public representations and service capabilities without exposing internal processing state.

Client applications consume the public contract and must not be required to reproduce authoritative validation, resource-resolution, interaction-selection or calculation logic.

Changes within one layer must not silently redefine the responsibilities or authoritative content of another layer.

### 4.4 Be resource-oriented and read-only

Public reference data is retrieved through resource-oriented `GET` operations. Governed engineering calculations are requested through stateless `POST` operations. Neither operation modifies authoritative engineering data.

The public engineering API must not provide create, update, delete or administrative data-management operations unless a future approved contract explicitly introduces them.

The stateless calculation model does not prevent future separately governed capabilities for persisting calculation records, provided that persistence does not alter engineering calculation semantics.

### 4.5 Use stable, opaque identifiers

Public identifiers must be stable, never reused, and never renumbered. They must not be derived from display names or repository location.

Consumers may store, reference and submit identifiers, but must not be required to parse them or infer engineering meaning from their internal form. Names, codes, descriptions and other human-readable classifications remain separate fields.

A change to a resource's descriptive representation must not require a change to its stable identifier unless the governed engineering identity itself has changed.

### 4.6 Prefer shallow, plural resource paths

Public resource paths use lower-case, plural nouns and hyphenated compound words. Paths should be shallow and should not encode internal data hierarchies.

```text
Good:  /api/v1/es-types
Good:  /api/v1/hazard-categories/{hazardCategoryId}
Avoid: /api/v1/reference/chapter1/tables/hazards/list
```

Operations that do not naturally represent retrievable resources may use purpose-specific collection endpoints where explicitly defined by the approved API Contract. For the MVP, `POST /api/v1/calculations` provides the stateless engineering calculation operation.

### 4.7 Use authoritative terminology

Public API terminology must reflect the authoritative engineering concepts represented by the governed AASTP data model and approved API Contract.

**Hazard Category** is the authoritative public API term for the validated hazard-related resource. It encompasses Hazard Division and SsD.

**Structure, Exposed Site Type, Potential Explosion Site Type, Hazard Category, Engineering Service, resource selection, resource resolution, validation** and **authentication** must be used consistently with their governed meanings.

Different terms must not be used interchangeably where they represent distinct engineering or assurance concepts. In particular, validation must not be described as authentication, and client selection must not be described as authoritative resource resolution unless the governed resolution process has occurred.

The API must not silently substitute legacy, informal or implementation-specific terminology for an authoritative term. Any legacy label retained for discoverability must be explicitly documented as an alias and must not change stable resource identity or semantics.

### 4.8 Require explicit engineering inputs and governed selection

Public engineering operations must use explicit client-supplied engineering inputs. The API must not silently infer omitted engineering values, select orientations automatically, substitute resources, or apply undocumented engineering assumptions.

A PES or ES may be selected using either:
- the stable identifier of an authoritative resolved PES Type or Exposed Site Type; or
- a complete Structure-led engineering configuration containing the applicable client-selectable properties required for authoritative resource resolution.

These selection methods are mutually exclusive for each resource. A request must not combine a resolved resource identifier with a configuration for the same PES or Exposed Site.

Structure is the starting point for configuration-based resource selection. It identifies which construction and exposure dimensions are applicable to that Structure and defines the applicable orientation type and permitted orientation values. Structure does not itself resolve a PES Type or Exposed Site Type and must not silently supply engineering values.

Where configuration-based selection is used, the client supplies the applicable selectable engineering values. Authoritative resource resolution is a governed service responsibility and occurs during validation before interaction and engineering processing. Clients must not be required to reproduce authoritative resource-resolution logic.

Resource resolution and orientation validation are separate concerns. Resolution establishes the authoritative PES Type or Exposed Site Type represented by the submitted selection. Orientation remains an explicit interaction input governed by the selected Structure and is validated separately from PES or Exposed Site resource resolution.

The service must preserve the original client request and represent authoritative resolution outcomes separately. Resolution, canonicalisation or other governed processing must not silently rewrite the submitted request.

Calculation requests provide exactly one authoritative calculation input supported by the applicable engineering model. The Engineering Service determines the applicable calculation direction from the submitted input rather than requiring the client to specify a separate forward or reverse operation.

Calculation quantities must have unambiguous governed units and quantity semantics; their public representation is defined by the approved API Contract and OpenAPI specification.

Approved engineering values and relationships have a single authoritative definition in the governed data release. Public schemas may define their representation, type, constraints and relationships, but must not create independently maintained copies of controlled engineering values or engineering-selection logic.

### 4.9 Be deterministic, reproducible and traceable

Governed engineering operations must be deterministic. Equivalent valid requests processed against the same governed engineering context, data release, resource-resolution model and calculation-method version must produce equivalent authoritative resource-resolution and engineering outcomes.

Public responses must provide sufficient provenance to identify the governed context from which the response was produced. Common response metadata identifies:
- the public API version;
- the applicable data release;
- the validation status of that release;
- the authentication status of that release; and
- the time at which the response was generated.

Calculation responses additionally identify the applicable calculation-method version and provide sufficient governed evidence to understand the authoritative resources used in the calculation.

Where resource resolution occurs, the resulting authoritative PES Type or Exposed Site Type must remain traceable to the client selection that produced it. Where canonicalisation or another governed Resource Resolution Rule affects the resolution outcome, sufficient resolution evidence must be preserved to distinguish that governed outcome from a direct or exact resource selection.

The original client request must remain distinguishable from derived or resolved engineering context. Validation, resource resolution, canonicalisation and calculation processing must not obscure or silently rewrite the inputs actually submitted by the consumer.

Where a public engineering resource or outcome derives from specific authoritative source material, an approved structured source reference must be provided where required by the public contract. Source references must be derived from governed engineering data or approved provenance and must never be fabricated by API implementation code.

Traceability and reproducibility must not depend on internal repository paths, resolver state, transient service objects or other implementation-specific representations.

### 4.10 Validate and resolve before engineering processing

Only a data release that has satisfied the applicable engineering validation requirements may be served by the governed API. Release validation establishes engineering and data integrity; it remains separate from release authentication as defined by these principles and the API Contract.

Incoming engineering requests must be validated before interaction processing, assessment generation or calculation occurs. Validation must establish that the submitted request is sufficiently complete, well-formed and engineering-valid for the requested operation.

Request validation includes, as applicable:
- request structure and required fields;
- field types and permitted representations;
- mutually exclusive selection alternatives;
- resource existence and reference validity;
- Structure-led property applicability;
- authoritative PES and Exposed Site resource resolution;
- orientation validity;
- hazard-category validity;
- calculation-input validity, quantity semantics and applicable constraints; and
- other governed relationships required before engineering processing.

Where a PES or ES is supplied by complete Structure-led configuration, authoritative resource resolution occurs as part of validation. The applicable Resource Resolution Rules may perform governed canonicalisation or other approved resolution behaviour where supported by the authoritative engineering model.

A request must not proceed into interaction or calculation processing unless all required validation and resource-resolution stages have completed successfully. A request leaving the validation boundary must therefore contain, or be associated with, the validated and resolved engineering context required by the Engineering Service.

Validation and resource resolution must fail explicitly where required information is missing, invalid, incompatible, undefined or unresolved. The service must not substitute plausible resources, infer unsupported relationships or continue processing in order to produce an apparently usable engineering result.

Validation must preserve the submitted request. Derived validation state, resolved resources and resolution evidence must be represented separately from the original client input so that subsequent engineering processing remains traceable to both the submitted request and the authoritative resolved context.

### 4.11 Govern public errors centrally

Public API error behaviour must be governed centrally and applied consistently across all endpoints and service operations.

HTTP status codes provide protocol-level classification of the response. Stable application error codes provide the more precise machine-readable meaning required by API consumers. These are related but distinct concerns and must not be treated as interchangeable.

The Error Code Registry is the normative authority for public error semantics, including:
- stable application error codes;
- the meaning and intended use of each error code;
- applicable HTTP status mappings;
- common error-envelope behaviour; and
- compatibility requirements governing existing error codes.

Public operations must use registered error codes rather than inventing endpoint-specific or implementation-specific alternatives. OpenAPI must represent the applicable governed errors and error schemas consistently with the Error Code Registry.

Error behaviour must distinguish materially different failure conditions where that distinction is useful to consumers. This includes, as applicable, failures involving:
- malformed or incomplete requests;
- invalid field types or values;
- mutually exclusive or incompatible selections;
- unknown resource identifiers or references;
- invalid Structure-led property selections;
- undefined or unresolved resource configurations;
- invalid orientations or Hazard Categories;
- unsupported or invalid calculation inputs;
- unavailable or invalid engineering processing; and
- requested public resources that do not exist.

Error responses must provide sufficient structured information for a consumer to identify and correct the failure where practicable, without exposing internal stack traces, repository structure, resolver state, implementation details or other information outside the approved public contract.

Existing public error codes must not be silently repurposed to represent different failure semantics. Changes to governed error behaviour must follow the API Change Management Framework and applicable API-versioning rules.

### 4.12 Version deliberately and preserve compatibility

The public API must be versioned deliberately so that consumers can determine the contract against which they are integrating and can rely on established behaviour within a supported major version.

The major API version appears in the URL path, for example `/api/v1/`. A change that breaks the approved public contract requires a new major API version unless an explicitly governed migration mechanism provides equivalent compatibility.

Within a major API version:
- do not remove existing public fields, resources or operations;
- do not change the established meaning or type of an existing field;
- do not change or reuse stable resource identifiers;
- do not materially change established request, response, error or resource-resolution semantics;
- prefer additive optional fields, new resources and new operations where these preserve existing consumer behaviour;
- mark superseded fields or operations as deprecated before removal and document their replacement and migration path; and
- preserve existing behaviour unless a governed compatibility assessment establishes that the change is non-breaking.

Compatibility is semantic as well as structural. A change may be breaking even where the JSON shape remains valid if it materially changes engineering meaning, validation requirements, resource-resolution behaviour, calculation behaviour, error semantics or reasonable consumer expectations.

API version, data-release version and calculation-method version are independent concerns. A new validated or authenticated data release, or a new calculation-method version, does not by itself require a new API major version where the existing public contract remains valid. The effective versions used to produce a response must remain identifiable through the applicable response metadata.

Changes to the public API must be classified and assessed through the API Change Management Framework before release. Where a breaking change is unavoidable, it must be explicit, appropriately versioned, documented and supported by migration guidance.

### 4.13 Make the contract machine-readable and testable

The approved OpenAPI 3.1 specification is the normative machine-readable expression of the approved public API Contract. It must remain consistent with the human-readable API Contract and the other normative components of the API specification suite.

OpenAPI defines the public interface structure required for machine consumption, including:
- public operations and paths;
- parameters and request bodies;
- public resource and calculation schemas;
- required fields and structural constraints;
- successful and non-success responses;
- common metadata and provenance representations;
- applicable security schemes;
- reusable components; and
- governed examples.

Common public concepts must be defined once as reusable components and referenced rather than independently reproduced. OpenAPI representations must describe public engineering concepts and service behaviour rather than repository structures, internal service context, resolver state or implementation-specific objects.

OpenAPI must express structural constraints where those constraints form part of the public contract and can be represented reliably. This includes, where applicable, mutually exclusive request alternatives such as direct-ID and configuration-based PES and Exposed Site selection.

OpenAPI must not become an independent authority for engineering behaviour. Controlled engineering values, resource relationships, property applicability, authoritative resource resolution, calculation applicability and other engineering rules governed by the validated data release or Engineering Service must not be duplicated as independently maintained OpenAPI logic.

Examples must use validated, non-sensitive engineering data, conform to the schemas they illustrate and must not invent AASTP rules or unsupported engineering combinations.

The complete OpenAPI specification must be capable of automated validation. Representative valid and invalid requests and responses must be testable against the published schemas, and conformance testing must demonstrate that implemented public behaviour agrees with the approved API Contract and OpenAPI specification.

### 4.14 Design security without changing semantics

Security controls must protect the confidentiality, integrity and availability of the service without changing the meaning of governed engineering resources, requests, calculations or results.

HTTPS is mandatory for deployed environments. Transport security protects communications between consumers and the service but does not establish the engineering validity or authentication status of the data release being served.

Service access authentication and engineering release authentication are separate concerns. Authentication or authorisation used to control access to an API determines whether a consumer may use a service. Release authentication establishes whether a governed engineering data release has been authenticated through the approved release-authentication process. Neither concept may be used as a substitute for the other.

The authentication status of the served engineering data must remain explicit in applicable public response metadata. An API response delivered securely over HTTPS, or through a future authenticated client connection, must not imply that an unauthenticated engineering data release is authenticated.

Security controls must remain external to authoritative engineering semantics. Authentication, authorisation, rate limiting, gateway controls, transport protection and other service-protection mechanisms must not:
- redefine authoritative engineering values or relationships;
- alter resource-resolution behaviour;
- change calculation semantics or engineering outcomes;
- duplicate or bypass engineering validation;
- silently modify submitted engineering inputs; or
- create alternative engineering behaviour based solely on a consumer's identity or access mechanism.

Public error responses, logs and operational telemetry must not expose stack traces, repository paths, internal resolver state, credentials, cryptographic material or other implementation details outside the approved public contract.

Security mechanisms may evolve independently of the engineering model where the public API contract remains unchanged. Where a future security requirement would alter public API behaviour, representation or compatibility, the change must be governed through the API Change Management Framework and applicable API-versioning rules.

### 4.15 Introduce performance features deliberately

Performance optimisation must not compromise engineering correctness, provenance, determinism, validation, resource resolution or the approved public API contract.

Performance features are introduced only where a demonstrated service or consumer requirement justifies them. Optimisation must not add unnecessary complexity to the MVP or move authoritative engineering behaviour into caches, gateways, clients or other infrastructure outside the governed engineering architecture.

HTTP caching is not required for the MVP. Where caching is introduced, stable read-only reference resources may be cacheable only through explicitly defined HTTP cache behaviour appropriate to the resource and data-release lifecycle.

Calculation responses must not be represented as cacheable by default, even though governed calculations are deterministic. Any future calculation-caching strategy must ensure that a cached result is valid for the complete governed engineering context from which it was produced.

Performance mechanisms must not:
- serve engineering resources from a superseded or unintended data release;
- obscure dataVersion, validationStatus, authenticationStatus or applicable calculation-method provenance;
- bypass request validation or authoritative resource resolution;
- reuse a calculation result across materially different engineering contexts;
- alter engineering values, resolution outcomes or calculation results; or
- make public API behaviour dependent on undocumented infrastructure assumptions.

Where performance optimisation changes observable public behaviour, representation or compatibility, it must be introduced through the API Change Management Framework and represented in the API Contract and OpenAPI specification as applicable.

### 4.16 Extend by addition, not behavioural mutation

Future AASTP content and service capabilities should be introduced as additive extensions wherever practical. New capability must not silently change the established meaning or behaviour of existing public resources, fields, operations or engineering concepts.

Additive extensions may include:
- additional AASTP chapters, engineering domains and authoritative resources;
- new calculation methods and governed engineering inputs or outputs;
- new resource-discovery, search, filtering or resolution capabilities;
- additional provenance, assurance and release information;
- localisation and knowledge-integration capabilities;
- offline and external-system integration;
- governed national tailoring; and
- other capabilities introduced through an approved future API contract.

Extensions must preserve the architectural separation between authoritative engineering data, validation and resource resolution, the Engineering Service, the public API, knowledge and localisation content, and consuming applications or integrations.

An extension must not duplicate authoritative engineering data, create a competing source of engineering truth, bypass validation or resource resolution, or introduce unsupported engineering assumptions for implementation or consumer convenience.

Localisation and presentation extensions may translate, explain, supplement or contextualise authoritative NATO content, including through nationally relevant terminology and references, but must not silently modify NATO engineering values, resource identities, relationships, resolution behaviour or calculation outcomes.

Governed national tailoring is distinct from localisation. Where an approved national context changes engineering applicability, resource resolution, interaction behaviour, calculation processing or engineering outcomes, that change must be explicit, attributable to the applicable tailoring context and distinguishable from the NATO baseline. National tailoring must not overwrite or obscure the underlying authoritative NATO engineering definition.

Offline copies, caches, exports and external integrations must preserve authoritative identity, applicable release provenance and validation boundaries. They must not become independent sources of AASTP engineering data or logic merely because the information is consumed outside the hosted API.

Where a genuinely new engineering concept cannot be represented correctly through additive extension of the existing public model, the API must represent that concept explicitly rather than overload an existing resource or field with a different meaning. Any resulting compatibility impact must be governed through the API Change Management Framework and applicable versioning rules.

## 5. Query and representation rules

Public API query and representation conventions must remain predictable, explicit and consistent across resource types and operations.

Filtering, search, pagination and client-selected ordering are not required for the MVP. Where subsequently introduced, they must be defined through the governed API change process and represented explicitly in the API Contract and OpenAPI specification before public release.

Query capabilities follow these principles:
- query parameter names use `camelCase`;
- multiple independent filters are combined using logical AND unless an operation explicitly defines another governed rule;
- unknown or unsupported query parameters produce the applicable governed error rather than being silently ignored;
- filtering changes the resources selected from a collection and must not change the authoritative representation or engineering meaning of an individual resource;
- search and ordering must not create alternative resource identities or engineering classifications;
- pagination must preserve stable and predictable collection semantics; and
- query behaviour must not reproduce authoritative engineering-selection, applicability or resource-resolution logic that belongs to the validated data and Engineering Service.

Requests and responses use UTF-8 JSON unless a future approved contract explicitly introduces another representation.

Clients sending JSON request bodies use `Content-Type: application/json`. Clients may explicitly request JSON using `Accept: application/json`. The governed MVP representation is UTF-8 JSON.

Representation conventions must remain independent of internal repository format and implementation structure. Public representations are governed by the API Contract and OpenAPI specification and must not change merely because the underlying storage or service implementation changes.

## 6. Governance and change control

The public API specification suite is a governed engineering baseline. Changes to its normative documents, public representations or observable behaviour must be controlled through the approved API Change Management Framework.

Change governance must preserve consistency between the API Contract, OpenAPI specification, API Design Principles, Error Code Registry and API Change Management Framework. A change affecting one normative component must be assessed for consequential changes to the others before release.

Proposed changes must be assessed for their effect on, as applicable:
- public resources, operations, requests and responses;
- schemas and structural constraints;
- stable identifiers and authoritative terminology;
- validation and resource-resolution behaviour;
- engineering calculations and calculation-method provenance;
- error semantics;
- data-release validation and authentication provenance;
- backwards compatibility and API versioning;
- examples, documentation and consumer expectations;
- implementation and conformance testing; and
- future extension and interoperability.

Where a proposed API change affects engineering meaning, terminology, applicability, resource resolution, calculation behaviour or another authoritative engineering concept, the change must be supported by appropriate governed engineering evidence. API governance must not independently create or reinterpret AASTP engineering requirements.

Changes must be classified and their compatibility impact established before implementation and release. Breaking, additive, corrective and editorial changes must be handled in accordance with the API Change Management Framework and the versioning principles defined by this document.

No change may silently:
- alter authoritative AASTP engineering semantics;
- redefine the meaning of an existing public field, resource, operation or error;
- reuse or renumber a stable identifier;
- bypass or weaken required validation or resource resolution;
- obscure applicable provenance or assurance status;
- introduce an unsupported engineering assumption; or
- create inconsistency between normative components of the API specification suite.

Where normative documents differ or create ambiguity, implementation must not resolve the discrepancy by assumption. The inconsistency must be addressed through the governed change process before the affected behaviour is approved for release.

## 7. Conformance expectations

An implementation conforms to these Design Principles when its public behaviour, representations and governed engineering operations are consistent with the approved API specification suite and preserve the architectural boundaries established by this document.

Conformance requires that the implementation:
- derives public engineering resources and governed engineering processing from an applicable validated data release and does not establish an independent source of authoritative engineering data;
- clearly distinguishes the validation status and authentication status of the served data release and does not imply authentication that has not occurred;
- exposes authoritative AASTP domain resources and approved service capabilities rather than repository structures, internal service context, resolver state or other implementation-specific objects;
- preserves stable resource identifiers, authoritative terminology and the distinct engineering roles of Structures, PES Types, Exposed Site Types and Hazard Categories;
- accepts only the selection methods and engineering inputs defined by the approved public contract and does not silently infer omitted engineering values or unsupported engineering relationships;
- performs required validation and authoritative resource resolution before governed interaction or calculation processing;
- preserves the original client request separately from derived validation state, resolved resources and resolution evidence;
- produces deterministic engineering outcomes for equivalent valid requests processed against the same governed engineering context, data release, resource-resolution model and calculation-method version;
- exposes the provenance, assurance status, resolved-resource evidence and calculation-method information required by the applicable public contract;
- uses the common public response and error conventions defined by the API specification suite;
- uses only error semantics governed by the Error Code Registry;
- implements public operations and representations consistently with the approved API Contract and OpenAPI specification;
- satisfies applicable automated schema, example and API conformance tests;
- preserves the separation between engineering semantics and transport security, access control, caching, client behaviour and other infrastructure concerns;
- does not mutate authoritative engineering data through public reference-data or calculation operations;
- preserves backwards compatibility within a supported API major version except where an approved governed change explicitly provides otherwise; and
- introduces changes and extensions only through the applicable API Change Management Framework.

Conformance is assessed against the approved versions of the normative API specification suite applicable to the implementation. Conformance to one document does not compensate for a material inconsistency with another normative component of that suite.

Where an implementation cannot satisfy a normative requirement because the governing specifications are incomplete, inconsistent or ambiguous, the implementation must not silently establish new public or engineering behaviour. The issue must be resolved through the governed change process before the affected behaviour is treated as conformant.

## 8. Change history

| Date | Document version | Change | Author / approval |
| --- | --- | --- | --- |
| 2026-08-15 | 0.4.0 | Reconciled with API Contract v0.4.0 and the expanded normative API specification suite. Updated principles for authoritative data boundaries, validation and authentication, Structure-led selection, resource resolution, request preservation, deterministic processing and provenance, error governance, semantic compatibility, OpenAPI conformance, security, performance, extensibility, localisation and national tailoring. Strengthened governance, change-control and conformance requirements and adopted Engineering Service as the governed architectural term. | Draft |
| 2026-08-10 | 0.3.0 | Aligned with `API_CONTRACT.md` v0.3.1: recognised Structures as public selection resources; defined Structure-led ES/PES resolution; adopted the unified, input-led calculation service; added controlled-value single-authority rules; and recognised the full governance suite. | Draft |
| 2026-08-09 | 0.2.0 | Revised companion document aligned with `API_CONTRACT.md` v0.2.0: Hazard Category terminology, calculation terminology, error-registry governance, common provenance, MVP security and caching positions, and formal documentation-suite roles. | Draft |

