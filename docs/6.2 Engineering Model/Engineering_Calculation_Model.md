# AASTP Digital Engineering API — Engineering Calculation Model

| Attribute | Value |
| --- | --- |
| Document status | Draft — normative companion document |
| Document version | 0.3.0 |
| Related API contract | `API_CONTRACT.md` v0.4.0 |
| Last updated | 2026-08-15 |

## 1. Purpose

This specification defines the governed model used by the AASTP Engineering Service to receive, resolve, execute and return an engineering calculation. It establishes an implementation-independent boundary between an engineering problem, the controlled conditions under which it is evaluated, the governed calculation process and the resulting engineering outcome.

The model is intended to make engineering calculations deterministic, repeatable, explainable and traceable to the validated AASTP data release and applicable authoritative source material.

This specification defines how governed engineering rules are resolved and executed; it is not an independent source of engineering rules. Authoritative engineering values, relationships, formulae, transformations and other structured calculation data remain governed by the authoritative JSON data layer and its associated validation controls. Applicable AASTP source material remains the authoritative basis from which that digital representation is derived.

## 2. Scope

This specification governs the engineering calculation model for AASTP-1 Chapter 1 calculations performed by the Engineering Service. It defines:
- the Engineering Scenario, which expresses the engineering problem;
- the Execution Context, which establishes controlled conditions affecting engineering resolution or representation;
- the public Calculation Request and calculation-result representations;
- the non-public Internal Calculation Context;
- input-led calculation-direction determination;
- the preceding Structure-led engineering resource-selection and resolution workflow;
- governed calculation applicability and calculation paths;
- calculation execution boundaries;
- engineering validation, traceability and provenance requirements; and
- the MVP boundary and controlled extension points.

This specification does not define individual AASTP engineering values, formulae or other authoritative engineering content. It does not independently define endpoint routing, HTTP status codes, public error semantics, service-access authentication or authorisation, release-authentication mechanisms, or presentation-specific layouts.

Those matters are governed by the authoritative JSON data and schemas, API Contract, API Design Principles, Error Code Registry, approved OpenAPI description, applicable assurance and security controls, and authoritative AASTP source material as appropriate.

Where this specification describes a public request or response representation, that representation must remain consistent with the approved API Contract and OpenAPI description.

## 3. Relationship to API Governance Documents

This specification forms part of the API governance suite and shall be read with the other normative governance artefacts applicable to the Engineering Service.

| Governing artefact | Relationship to this specification |
|---|---|
| API Design Principles v0.4.0 | Defines the enduring architectural and design principles governing the Engineering Service, including authoritative terminology, Structure-led resource selection, stable identifiers, explicit inputs, deterministic behaviour, validated data releases, release provenance, public representation boundaries, OpenAPI alignment and compatibility. |
| API Contract v0.4.0 | Defines the normative public behaviour of the Engineering API, including resource-selection operations, the unified `POST /calculations` operation, calculation-request constraints, successful and error response envelopes, response metadata, release `authenticationStatus`, and stateless operation. This specification defines the governed engineering calculation model beneath that public contract. |
| Error Code Registry v0.4.0 | Defines stable public failure semantics and the common error-response model. Validation, resource-resolution, calculation-applicability, calculation-execution, data-integrity and system failures identified through this model shall use the applicable registered error semantics. |
| Authoritative JSON data and schemas | Provide the governed engineering entities, relationships, rules, formulae, transformations, constraints and provenance consumed by the calculation model. |
| Approved OpenAPI description | Provides the machine-readable public representation of calculation requests, responses and applicable errors in accordance with the API Contract and this specification. |

This specification does not supersede or duplicate the responsibilities of those artefacts. It defines the engineering meaning, resolution process, execution model and traceability requirements applicable to governed calculations.

Where an inconsistency is identified, the applicable controlled governance artefact shall take precedence according to the project's document hierarchy and change-control process. The inconsistency shall be treated as a governance defect requiring reconciliation; implementation behaviour must not be used to resolve the inconsistency by assumption.

This specification shall not be used to infer, create or substitute an engineering rule, value, relationship or calculation method absent from the authoritative data or applicable source material.

## 4. Engineering Principles

1. **Authority is preserved**. The Engineering Service consumes governed engineering data and rules; it does not create, duplicate or silently reinterpret them. Authoritative structured engineering content remains in the governed JSON data layer and its associated validation controls, with traceability to applicable AASTP source material.

2. **The scenario is stable**. The engineering problem is represented independently of REST, software language, client type, localisation, presentation format and internal implementation structure.

3. **Calculation-affecting context is explicit**. Any context that can affect engineering resource resolution, rule applicability, calculation execution or interpretation shall be governed and explicit at the applicable boundary. Context shall not be silently assumed where doing so could change engineering meaning. Representation-only context shall remain separate from calculation-driving engineering inputs.

4. **Results are explainable and traceable**. A calculation result shall identify its engineering basis and applicable provenance sufficiently for an authorised reviewer to understand which governed resources and calculation method produced the outcome.

5. **Resolution is controlled**. Engineering identifiers shall be stable. Resources, relationships, rules, formulae, constraints and transformations used in a calculation shall resolve only through the governed data and resolution mechanisms applicable to the served validated data release. An unresolved, ambiguous or inconsistent resolution shall not be resolved by implementation assumption.

6. **Canonical calculation is separated from representation**. Calculation execution shall use the governed units, precision, transformations and calculation sequence defined by the applicable engineering method. Input conversion and output representation shall occur only through approved conversions that preserve engineering meaning. Language, formatting and other presentation concerns shall not alter the canonical engineering result.

7. **Compatibility is deliberate**. Additive evolution is preferred. A change that alters engineering meaning, calculation behaviour, validation, resolution, applicability or a public calculation representation requires governed change assessment and appropriate versioning.

8. **Calculation fails closed**. An unresolved, ambiguous, unsupported, undefined or otherwise non-applicable engineering case shall produce the applicable governed outcome or failure. The Engineering Service shall not guess, substitute or fabricate an engineering result.

9. **Engineering resource selection and resolution precede calculation**. Structure-led selection establishes the construction, exposure and orientation dimensions applicable to PES and ES resource selection. The Calculation Request provides sufficient governed information to identify or authoritatively resolve the applicable PES and ES resources and orientations; the calculation engine does not infer those resources from incomplete structural configuration.

10. **Calculation direction is input-led**. The Engineering Service determines the applicable calculation direction from the submitted authoritative calculation input and its governed definition. A client does not independently select forward or reverse calculation through a direction-specific endpoint or mode field.

## 5. Architecture

The Engineering Calculation Model separates public engineering configuration and calculation requests from non-public engineering resolution and execution.

```text
Client application
        |
        v
Structure-led engineering selection
        |
        v
PES / ES resource resolution
        |
        v
Calculation Request
        |
        v
Request and engineering validation
        |
        v
Authoritative resource and context resolution
        |
        v
Internal Calculation Context (non-public)
        |
        v
Calculation applicability resolution
        |
        v
Governed rule, formula, constraint
and transformation execution
        |
        v
Governed Calculation Result
with engineering traceability
```

The model separates four principal concerns:
- **Engineering Scenario** — the technology-neutral engineering problem to be solved, including the resolved or resolvable engineering resources, orientations, Hazard Category and authoritative calculation input.
- **Execution Context** — governed contextual information that may affect resource resolution, applicability or approved representation without becoming an implicit part of the Engineering Scenario.
- **Internal Calculation Context** — the non-public resolved engineering state constructed from the validated request and governed data release and used by the Engineering Service to determine and execute the applicable calculation path.
- **Calculation Result** — the governed engineering outcome together with the engineering basis and provenance required for review, assurance and reproducibility.

Structure-led selection establishes the engineering dimensions applicable to PES and ES configuration. Authoritative PES and ES resource resolution occurs before interaction processing and governed calculation execution. Depending on the approved public workflow, a consumer may reference already resolved PES and ES resources or submit a complete Structure-led configuration for validation and authoritative resolution by the Engineering Service.

Resource resolution is a governed validation activity. It must produce an authoritative resolved resource or an applicable governed validation outcome; the calculation engine must not infer PES or ES resources from incomplete structural information.

Once the request has been validated and the required engineering resources and context have been resolved, the Engineering Service constructs a non-public Internal Calculation Context. Subsequent interaction, applicability, distance-rule, formula, constraint and transformation processing operates against this controlled context rather than directly against the public request.

Public API representations and internal calculation objects are deliberately separated. Repository paths, indexes, resolver state, intermediate execution objects and other implementation-specific structures must not become part of the public calculation contract unless separately governed and approved.

## 6. Engineering Scenario Model

The Engineering Scenario is the technology-neutral representation of the engineering problem to be evaluated by the Engineering Service.

It identifies the engineering resources and relationships required to establish the interaction together with the single authoritative calculation input from which calculation direction is determined.

The Engineering Scenario is independent of REST routing, JSON serialization, client implementation and internal service structure. A public Calculation Request is a governed API representation from which a valid Engineering Scenario can be established; the two concepts are related but are not required to be structurally identical.

For the MVP, an Engineering Scenario comprises:
- the applicable PES resource;
- the applicable PES orientation;
- the applicable ES resource;
- the applicable ES orientation;
- the applicable Hazard Category; and
- exactly one authoritative calculation input.

The authoritative calculation input identifies:
- the engineering quantity being supplied;
- its value; and
- its unit.

Calculation direction is derived from the authoritative input and the governed calculation model. Direction is not an independent property of the Engineering Scenario.

### 6.1 Conceptual model

```text
EngineeringScenario
├── pes
│   ├── resourceId
│   └── orientationId
├── es
│   ├── resourceId
│   └── orientationId
├── hazardCategoryId
└── authoritativeInput
    ├── quantity
    ├── value
    └── unit
```
This model expresses engineering meaning rather than prescribing a public JSON schema. Property names and serialization are governed by the API Contract and approved OpenAPI description.

### 6.2 Authoritative calculation input

Each Engineering Scenario contains exactly one authoritative calculation input.

The authoritative input is the engineering quantity supplied as known by the consumer and used by the Engineering Service to determine the applicable calculation direction.

For the MVP, the supported authoritative calculation quantities are those approved by the governing AASTP calculation model and exposed by the public Calculation Request. The current calculation architecture supports NEQ as the authoritative input for forward calculation and distance as the authoritative input for inverse calculation.

The Engineering Scenario does not contain a separate calculation-direction field. The applicable direction is derived from the authoritative input and must not conflict with, or depend upon, an independently supplied client mode.

The input quantity, value and unit must be explicit. Units must not be inferred from field names, deployment configuration, locale or client convention.

An authoritative input may be valid in its own right while lying outside the supported domain of an otherwise applicable engineering rule. Such a condition is a calculation-applicability outcome rather than evidence that the Engineering Scenario representation itself is malformed.

### 6.3 Engineering resource identity

Engineering Scenario resource references use stable authoritative identifiers from the applicable governed data release.

PES and ES resources must be authoritatively resolved before interaction processing. The Engineering Scenario may be established from resource identifiers already supplied by the consumer or from a complete Structure-led configuration resolved through the governed validation and resource-resolution process.

The Engineering Scenario must not contain an implementation-derived substitute for an unresolved PES or ES resource.

Structure information used during resource selection and resolution does not need to be duplicated into the Engineering Scenario once the authoritative PES or ES resource has been resolved, except where explicitly required by a governed calculation rule.

### 6.4 Orientation

PES and ES orientation are explicit properties of the Engineering Scenario where required by the applicable Structure and interaction model.

Orientation is not embedded within the resolved PES or ES Type. Permitted orientation values are governed through the associated Structure and are validated separately from PES and ES resource resolution.

An orientation must therefore be both:
- a recognised value of the applicable governed orientation vocabulary; and
- supported by the Structure applicable to the selected PES or ES resource.

The Engineering Service must not silently supply a default orientation where orientation is required to determine engineering meaning.

### 6.5 Scenario validation boundary

A valid Engineering Scenario must be sufficiently complete and internally consistent to establish the engineering problem without implementation assumption.

Establishing a valid Engineering Scenario requires confirmation that:
- required engineering resource references are present and resolvable;
- PES and ES resources are authoritative for the applicable governed data release;
- required orientations are present and valid for their associated Structures;
- the Hazard Category is a valid authoritative resource;
- exactly one authoritative calculation input is present;
- the input quantity and unit are supported by the applicable calculation contract; and
- the input value satisfies applicable general engineering-validation constraints independent of calculation-rule applicability.

Successful Engineering Scenario validation does not establish that a calculation necessarily applies. Calculation applicability is determined subsequently against the resolved engineering context and applicable governed engineering rules.

A scenario that is structurally valid but fails engineering validation or resource resolution must not proceed to calculation applicability or execution.

## 7. Execution Context Model

The Execution Context is not a container for all information associated with a calculation. It contains only controlled contextual information that may affect engineering resource resolution, calculation applicability or approved representation without changing the identity of the Engineering Scenario.

Release provenance, validation state and authentication state are not supplied through the Execution Context. They are established by the Engineering Service and returned through governed response metadata.

The MVP does not expose client-selectable Execution Context fields. The served validated data release, validation state and release authentication state are established by the Engineering Service.

Future Execution Context fields, including national tailoring, localisation and representation preferences, shall only be introduced through controlled governance. Each field shall define:
- its effect on engineering resolution, applicability or representation;
- whether it may influence calculation behaviour;
- its validation requirements;
- its provenance requirements; and
- its compatibility impact.

Potential future Execution Context concepts may include:
- national tailoring context;
- language preference for human-readable content; and
- approved output representation preferences.

These examples do not constitute MVP API fields or imply an approved implementation approach.

For the MVP, the API serves its validated data release and returns the effective version as `metadata.dataVersion`; it does not yet contract a client-selected repository version, national profile, language or unit system.

## 8. Calculation Request Model

The Calculation Request is the public representation of the engineering information submitted to the Engineering Service for evaluation.

It provides the information required for the Engineering Service to establish an Engineering Scenario, resolve the applicable engineering context and perform a governed calculation where an approved calculation pathway exists.

The Calculation Request represents the engineering problem to be evaluated. It does not represent an instruction to execute a specific calculation method, formula or calculation direction. The applicable calculation pathway is determined by the Engineering Service from the authoritative calculation input and the resolved engineering context.

A Calculation Request shall contain sufficient information to:
- identify or authoritatively resolve the applicable PES and ES resources;
- establish required PES and ES orientations;
- identify the applicable Hazard Category;
- provide exactly one authoritative calculation input; and
- support validation, calculation applicability assessment and governed calculation execution.

The Calculation Request is intentionally separated from the Engineering Scenario and Internal Calculation Context:
- the Calculation Request is the public representation received by the Engineering Service;
- the Engineering Scenario is the technology-neutral representation of the engineering problem established from the validated request; and
- the Internal Calculation Context is the non-public resolved execution state used by the Engineering Service to perform the governed calculation.

The Calculation Request shall not contain:
- internal calculation state;
- resolver state;
- repository structures;
- intermediate calculation values;
- formula or transformation execution state; or
- other implementation-specific information.

Public Calculation Request representations, including field names, required properties, validation constraints and response interactions, are governed by the API Contract and approved OpenAPI specification. This specification defines the engineering meaning of the request and its transformation into the Engineering Scenario; it does not independently define the public API schema.

### 8.1 Authoritative calculation input

The Calculation Request shall contain exactly one authoritative calculation input.

The authoritative calculation input represents the engineering quantity supplied by the consumer that forms the basis for determining the applicable calculation pathway. It identifies the quantity, value and unit provided to the Engineering Service for evaluation.

The authoritative calculation input comprises:
- **quantity** — the engineering quantity being supplied;
- **value** — the numerical value of that quantity; and
- **unit** — the authoritative unit associated with the supplied value.

The authoritative calculation input shall be explicit. Units shall not be inferred from field names, client configuration, locale, presentation preferences or implementation assumptions.

The Engineering Service shall determine the applicable calculation pathway from the authoritative calculation input and the resolved engineering context. The Calculation Request shall not contain an independent calculation-direction indicator.

A Calculation Request containing multiple competing calculation-driving inputs shall be considered invalid because the Engineering Service cannot determine a single authoritative basis for calculation.

The authoritative calculation input defines the known engineering quantity supplied to the calculation process. It does not define:
- the applicable formula;
- the applicable distance rule;
- the calculation method;
- the calculation result; or
- the applicability of the calculation.

The presence of a valid authoritative calculation input does not guarantee that a calculation applies. The Engineering Service shall determine whether an approved calculation pathway exists after the Engineering Scenario has been established and the applicable engineering context has been resolved.

The authoritative calculation input shall satisfy applicable general engineering-validation constraints. A valid input that lies outside the supported domain of an otherwise applicable engineering rule shall be treated as a calculation-applicability outcome rather than an invalid Calculation Request.

### 8.2 Calculation Request validation boundary

A Calculation Request is valid only when it can establish a sufficiently complete Engineering Scenario without implementation assumption.

Request validation includes:
- public schema validation;
- reference validation;
- engineering resource validation;
- orientation validation;
- Hazard Category validation;
- authoritative input validation; and
- confirmation that no conflicting calculation-driving information has been provided.

Successful request validation does not indicate that a calculation applies.

Calculation applicability is determined only after the Engineering Scenario has been established and the applicable engineering context has been resolved.

### 8.3 PES and ES resource representation

The Calculation Request shall provide sufficient information to identify or authoritatively resolve the applicable PES and ES resources required to establish the Engineering Scenario.

PES and ES resources represent governed engineering entities within the validated AASTP data release. They shall be referenced using stable authoritative identifiers where an applicable resource has already been resolved.

Where the approved workflow supports Structure-led resource resolution, the Calculation Request may provide the governed structural and contextual information required for the Engineering Service to resolve the applicable PES or ES resource. In such cases, the submitted configuration is considered a resolution input and does not itself become the authoritative PES or ES resource used during calculation.

Authoritative PES and ES resolution shall occur before interaction processing, calculation applicability assessment and calculation execution.

The Engineering Service shall not:
- infer a PES or ES resource from incomplete structural information;
- substitute an alternative PES or ES resource without governed resolution authority;
- use client-provided descriptive information as an authoritative engineering identifier; or
- execute a calculation against an unresolved PES or ES configuration.

Once resolved, the Internal Calculation Context shall contain the authoritative PES and ES resources used for calculation processing. The public Calculation Request shall not contain duplicated copies of the complete PES or ES resource definitions unless explicitly required by a governed future API capability.

The use of PES and ES identifiers within a Calculation Request does not transfer authority for those resources to the client. The authoritative meaning of each resource is established by the served validated data release identified through response metadata.

### 8.4 Calculation-direction determination

The Calculation Request shall not contain an independent calculation-direction indicator. The applicable calculation direction is determined by the Engineering Service from the authoritative calculation input and the governed calculation model.

The authoritative calculation input identifies the engineering quantity supplied by the consumer. The Engineering Service determines whether the submitted input requires a forward or inverse calculation pathway based on the applicable governed calculation definitions.

The determination of calculation direction shall occur only after:
- the Calculation Request has passed applicable structural and engineering validation;
- required PES and ES resources have been identified or authoritatively resolved;
- required orientations have been validated;
- the Hazard Category has been established; and
- the authoritative input has been validated.

The Engineering Service shall not:
- accept a client-selected calculation direction where that direction conflicts with the authoritative input;
- execute a calculation pathway that is not supported by the resolved engineering context;
- infer a calculation direction from endpoint selection, client application behaviour or presentation context; or
- return a calculated result where the authoritative input does not correspond to an approved calculation pathway.

Where the authoritative input is valid but no approved calculation pathway exists, the condition shall be handled as a calculation-applicability outcome using the applicable governed error semantics.

The resulting calculation direction is part of the Internal Calculation Context and calculation provenance, not part of the public Calculation Request representation.

### 8.5 Request-to-scenario transformation

The Engineering Service shall transform a validated Calculation Request into an Engineering Scenario before calculation applicability assessment and execution.

This transformation establishes the technology-neutral representation of the engineering problem to be evaluated. It does not perform calculation execution and does not itself determine the final engineering outcome.

The transformation process shall:
- validate that all required engineering information is present;
- establish or resolve the applicable PES and ES resources;
- validate required PES and ES orientations;
- establish the applicable Hazard Category;
- identify the authoritative calculation input;
- determine the applicable calculation pathway from the authoritative input; and
- preserve sufficient provenance to demonstrate how the Engineering Scenario was established.

The resulting Engineering Scenario shall contain only information necessary to define the engineering problem. It shall not contain:
- repository structures;
- internal service state;
- resolver implementation details;
- intermediate calculation values;
- formula execution state;
- transformation execution state; or
- other implementation-specific information.

Where the Calculation Request contains sufficient information for direct resource identification, the Engineering Scenario shall reference the resolved authoritative PES and ES resources.

Where the Calculation Request requires Structure-led resource resolution, the Engineering Scenario shall only be established after successful authoritative resolution. The Engineering Service shall not create an Engineering Scenario containing unresolved or ambiguous engineering resources.

A valid Engineering Scenario does not by itself establish that a calculation is applicable. The resolved Engineering Scenario is provided to the calculation-applicability process, which determines whether an approved calculation pathway exists for the specific engineering context.

The Internal Calculation Context shall subsequently be derived from the Engineering Scenario and validated governed data release. It may contain additional resolved information required for calculation execution but shall remain separate from the public Calculation Request and Engineering Scenario.

## 9. Internal Calculation Context Model

The Internal Calculation Context is the non-public, service-internal representation of the fully resolved engineering state used by the Engineering Service to perform a governed calculation.

It is derived from the validated Calculation Request, established Engineering Scenario and governed AASTP data release. It contains the resolved information required to determine applicability, select the governed calculation pathway and execute the calculation.

The Internal Calculation Context is not part of the public API contract and shall not be exposed directly through public responses.

The purpose of the Internal Calculation Context is to provide a controlled boundary between:
- the public representation submitted by a consumer;
- the technology-neutral Engineering Scenario;
- the resolved engineering state required for execution; and
- the resulting Calculation Result.

The Internal Calculation Context shall contain only information required to support governed calculation processing. It shall not become an alternative storage location for authoritative engineering data.

### 9.1 Conceptual model

The Internal Calculation Context represents the resolved engineering state used by the Engineering Service to determine calculation applicability and execute an approved calculation pathway.

It is derived from the validated Calculation Request, established Engineering Scenario and applicable governed data release. It contains the resolved engineering information required to perform the calculation but does not replace the authoritative data layer.

The Internal Calculation Context is not a public representation. It exists to provide a controlled boundary between the engineering problem submitted by a consumer and the implementation-independent calculation process.

Conceptually, the Internal Calculation Context contains:

```text
InternalCalculationContext
├── EngineeringScenario
│   └── Hazard Category
├── ResolvedResources
│   ├── PES resource
│   └── ES resource
├── ResolvedInteraction
├── ApplicableCalculationPath
│   ├── Distance rule
│   ├── Formula
│   ├── Constraints
│   └── Transformations
├── AuthoritativeInput
└── CalculationProvenance
```

The conceptual model identifies the categories of information required to support governed calculation processing. It does not prescribe a public JSON representation or implementation structure.

The Internal Calculation Context shall contain references to authoritative engineering resources rather than duplicated engineering definitions. Where additional derived information is required for execution, that information shall remain traceable to the authoritative resources and calculation method from which it was derived.

The Internal Calculation Context shall not contain:
- alternative engineering interpretations;
- implementation-specific calculation logic;
- uncontrolled overrides of authoritative data;
- unresolved engineering selections; or
- client-provided instructions that alter governed calculation behaviour.

### 9.2 Context construction and resolution rules

The Internal Calculation Context shall be constructed by the Engineering Service after successful validation of the Calculation Request and establishment of the Engineering Scenario.

The Internal Calculation Context shall represent the resolved engineering state applicable to the calculation being performed. It shall be created only from:
- the validated Calculation Request;
- the established Engineering Scenario;
- the applicable validated AASTP data release; and
- governed resource-resolution and applicability processes.

Construction of the Internal Calculation Context shall include, where applicable:
- resolution of PES and ES resources;
- resolution of the applicable interaction;
- identification of the applicable calculation pathway;
- resolution of governing distance rules, formulae, constraints and transformations; and
- establishment of calculation provenance.

The Engineering Service shall not create an Internal Calculation Context containing:
- unresolved engineering resources;
- ambiguous engineering selections;
- unvalidated authoritative inputs;
- calculation methods that are not approved by the applicable data release; or
- client-provided instructions that bypass governed resolution.

All information within the Internal Calculation Context shall remain traceable to authoritative engineering resources or governed derivation processes.

Where the Engineering Service cannot establish a complete and unambiguous Internal Calculation Context, calculation execution shall not proceed and the applicable governed error outcome shall be returned.

### 9.3 Internal Calculation Context rules

The Internal Calculation Context shall provide a controlled execution boundary for governed calculations. It shall contain only the resolved engineering information required to determine applicability and execute the approved calculation pathway.

The Internal Calculation Context shall:
- be created only from validated inputs and governed engineering resources;
- reference authoritative engineering resources using stable identifiers wherever practical;
- preserve traceability to the applicable data release and calculation method;
- contain resolved engineering relationships required for calculation execution;
- support reproducible calculation execution; and
- remain separate from public request and response representations.

The Internal Calculation Context shall not:
- become an alternative repository for authoritative engineering data;
- modify, override or correct authoritative JSON data;
- introduce engineering rules that do not exist in the governed data release;
- contain unresolved or ambiguous engineering selections;
- contain client instructions that bypass governed calculation rules;
- expose implementation-specific execution details through public interfaces; or
- become a persistent source of engineering authority.

Where derived information is required for calculation execution, the derivation method shall be governed and traceable to the authoritative engineering resources from which it was produced.

The Internal Calculation Context may contain implementation-specific information required for execution where such information does not alter engineering meaning and remains within the controlled service boundary.

Any condition indicating that the Internal Calculation Context cannot be established consistently with the validated engineering model shall prevent calculation execution and shall be handled using the applicable governed error semantics.

## 10. Calculation Result Model and Engineering Traceability

The Calculation Result represents the governed engineering outcome produced by the Engineering Service after successful completion of an approved calculation pathway.

It represents the result of applying the applicable calculation method to the resolved Internal Calculation Context. It does not represent the complete API response envelope, which additionally contains service, release and assurance metadata defined by the API Contract.

The Calculation Result shall be:
- deterministic for a given validated Engineering Scenario, Internal Calculation Context and governed data release;
- traceable to the engineering resources and calculation method used;
- independent of client presentation requirements; and
- expressed using the canonical engineering representation defined by the applicable calculation model.

A Calculation Result shall not contain:
- client request information unrelated to the engineering outcome;
- implementation-specific execution details;
- unresolved engineering selections;
- internal service state; or
- ungoverned interpretation of authoritative engineering data.

### 10.1 Conceptual model

The Calculation Result represents the governed engineering outcome produced by the Engineering Service after successful execution of an approved calculation pathway.

It is derived from the Internal Calculation Context and represents the result of applying the applicable governed calculation method to the resolved engineering state.

The Calculation Result provides the engineering outcome and sufficient calculation traceability to support review, verification and assurance activities. It does not represent the complete execution state used internally by the Engineering Service.

Conceptually, the Calculation Result contains:

```text
CalculationResult
├── Quantity
├── Value
├── Unit
├── AuthoritativeInputReference
│   ├── Quantity
│   ├── Value
│   └── Unit
├── CalculationBasis
│   ├── Interaction reference
│   ├── Calculation rule reference
│   ├── Formula reference
│   ├── Constraint references
│   └── Transformation references
└── TraceabilityReferences
    ├── PES reference
    ├── ES reference   
    └── Calculation references
```
The conceptual model identifies the engineering information required to represent a governed calculation outcome. It does not prescribe a public JSON representation or implementation structure.

The Calculation Result shall reference authoritative engineering resources and calculation methods rather than duplicate their definitions.

The Calculation Result shall remain independent of client presentation requirements. Formatting, language selection and unit display preferences are handled through approved representation mechanisms and shall not alter the canonical engineering result.

The Calculation Result shall not contain:
- unresolved engineering selections;
- client request information unrelated to the engineering outcome;
- internal resolver state;
- implementation-specific execution details;
- intermediate calculation states; or
- ungoverned modifications to authoritative engineering data.

### 10.2 Calculation result representation

A Calculation Result shall represent the canonical engineering outcome produced by the governed calculation process.

The representation shall contain the information necessary to identify:
- the calculated engineering quantity;
- the calculated value;
- the applicable unit; and
- the governed calculation basis supporting the result.

The calculated quantity and unit shall correspond to the quantity defined by the applicable calculation pathway. The result shall be expressed using the canonical engineering representation defined by the governed calculation model.

A Calculation Result shall retain a reference to the authoritative calculation input used to determine the calculation pathway.

The authoritative input reference provides traceability between the submitted engineering input, any approved input conversions or transformations, the canonical value used during calculation, and the resulting engineering outcome.

Input values shall be converted to the canonical calculation representation before entering the governed calculation process.

Input conversion shall occur during validation and shall:
- confirm that the supplied unit is valid for the specified quantity;
- apply the approved conversion to the canonical calculation unit;
- preserve traceability between the supplied value and the canonical value used for calculation; and
- ensure that subsequent engineering processing operates on standardised values.

Output transformations shall occur after calculation execution and before final result representation.

Where output unit conversion is required, conversion shall occur before application of any rounding, truncation or formatting transformation. This ensures that numerical precision is preserved when representing results in alternative unit systems.

The sequence of applied transformations shall be governed and traceable. Future implementations may require explicit transformation ordering or weighting where multiple transformations are applicable.

Where an input representation differs from the canonical calculation representation, the traceability chain shall preserve sufficient information to demonstrate:
- the original supplied quantity, value and unit;
- any approved conversion or transformation applied before calculation;
- the canonical quantity, value and unit used during calculation; and
- the relationship between the canonical input and the resulting Calculation Result.

Input conversion or transformation shall not alter the engineering meaning of the authoritative input. The Calculation Result shall remain traceable to the original authoritative input provided by the consumer.

Where conversions or transformations occur before calculation, they shall be governed, validated and traceable as part of the calculation pathway. Where conversions are applied only for output representation, they shall not alter the canonical engineering result.

A Calculation Result shall contain sufficient calculation traceability to identify the governed resources and methods used to produce the outcome. This traceability shall use references to authoritative resources rather than duplicated engineering definitions.

The Calculation Result shall not expose:
- internal calculation context structures;
- resolver implementation details;
- intermediate calculation states;
- software execution information unrelated to engineering meaning; or
- unsupported interpretations of authoritative engineering data.

The public representation of a Calculation Result, including field names, serialization format and response structure, shall be governed by the API Contract and approved OpenAPI specification.

### 10.3 Calculation result traceability

A Calculation Result shall contain sufficient traceability information to identify the governed engineering resources, calculation method and authoritative input that produced the engineering outcome.

Traceability information shall establish the relationship between:
- the authoritative calculation input;
- the resolved Engineering Scenario;
- the applicable Internal Calculation Context;
- the governed calculation pathway; and
- the resulting engineering outcome.

Calculation traceability shall reference authoritative engineering resources rather than duplicate their definitions.

Where applicable, traceability information may include references to:
- authoritative input;
- PES and ES resources;
- Hazard Category;
- resolved interaction;
- applicable calculation rule;
- formula;
- constraints;
- transformations; and
- applicable governed data release.

The level of traceability exposed through the public Calculation Result shall be sufficient to support engineering interpretation and assurance without exposing unnecessary implementation details or internal service state.

Detailed execution records, diagnostic information and validation evidence required for engineering assurance, audit or service investigation shall be maintained separately from the public Calculation Result in accordance with applicable governance and assurance processes.

### 10.4 Calculation result validity and failure boundary

A Calculation Result shall only be produced where the Engineering Service has successfully established and executed an approved calculation pathway using a valid Internal Calculation Context.

The existence of a valid Calculation Request or established Engineering Scenario does not by itself indicate that a Calculation Result can be produced. Calculation applicability shall be determined before calculation execution.

A Calculation Result shall require:
- successful Calculation Request validation;
- successful establishment of the Engineering Scenario;
- successful construction of the Internal Calculation Context;
- identification of an applicable governed calculation pathway;
- successful completion of the calculation process; and
- successful validation of the resulting engineering outcome against applicable result constraints.

Where any required condition is not satisfied, the Engineering Service shall not return a Calculation Result representing an engineering outcome that has not been successfully established.

Failure conditions shall be classified according to their governing category, including:
- validation failures where submitted information does not satisfy required constraints;
- applicability failures where no approved calculation pathway exists for the resolved engineering context;
- calculation failures where an applicable calculation pathway exists but execution cannot be completed successfully; and
- data or system failures where required authoritative information or service capability is unavailable.

Error reporting shall use the governed error semantics defined by the Error Code Registry.

The absence of a Calculation Result shall not imply that the Calculation Request was invalid. The Engineering Service shall distinguish between invalid requests, valid requests without an applicable calculation pathway, and failures occurring during calculation execution.

## 11. Calculation Path Execution Model

The Calculation Path Execution Model defines the controlled process by which the Engineering Service applies an approved calculation pathway to a resolved Internal Calculation Context.

Calculation execution shall occur only after:
- the Calculation Request has been validated;
- the Engineering Scenario has been established;
- required PES and ES resources have been resolved;
- the Internal Calculation Context has been constructed; and
- an applicable governed calculation pathway has been identified.

The calculation pathway shall define the governed resources required to produce a Calculation Result, including applicable rules, formulae, constraints and transformations.

The Engineering Service shall execute calculations using the authoritative data release served by the service. Calculation execution shall not introduce, modify or infer engineering rules outside the governed data and resolution mechanisms.

Forward and inverse calculation pathways are specific applications of this common execution model. The applicable pathway is determined from the authoritative calculation input and governed calculation capability rather than selected by the consumer.

### 11.1 Calculation pathway determination

The Engineering Service shall determine the applicable calculation pathway from the validated Engineering Scenario, Internal Calculation Context and authoritative calculation input.

Calculation pathway determination shall consider:
- the authoritative input quantity;
- the resolved PES and ES resources;
- the applicable Hazard Category;
- the resolved interaction;
- available governed calculation methods; and
- any applicable constraints or applicability conditions.

A calculation pathway shall only be considered valid where:
- the required governed resources can be resolved;
- the calculation method is defined within the applicable data release;
- the method supports the supplied authoritative input;
- any required inverse capability exists where applicable; and
- the resulting pathway is unambiguous.

The Engineering Service shall not:
- allow a consumer to select a calculation pathway independently of the authoritative input;
- select an arbitrary pathway where multiple candidates exist;
- infer missing engineering rules;
- apply a calculation method outside its approved domain; or
- execute a calculation where applicability has not been established.

Where no valid calculation pathway exists, the Engineering Service shall return the applicable governed applicability outcome.

### 11.2 Common calculation execution sequence

Once a valid calculation pathway has been established, the Engineering Service shall execute the calculation using a controlled and repeatable sequence.

The calculation execution sequence shall:
1. Confirm the resolved Internal Calculation Context and applicable calculation pathway.

2. Confirm the authoritative calculation input and establish the canonical calculation representation required by the applicable calculation method.

3. Apply any governed input conversions or normalisation required before calculation execution.

4. Apply the approved calculation rule, formula or calculation method defined by the applicable calculation pathway.

5. Apply governed constraints, conditions and calculation-specific processing defined by the applicable method.

6. Apply approved calculation transformations in their governed sequence.

7. Establish the canonical engineering result.

8. Apply approved output representation transformations, including unit conversion and formatting, where required for consumer presentation.

9. Generate the Calculation Result with appropriate engineering traceability.

The Engineering Service shall maintain the distinction between:
- transformations that affect the calculation process or engineering meaning; and
- transformations that affect only result representation.

Calculation transformations shall form part of the governed calculation pathway. Representation transformations shall occur only after the canonical engineering result has been established and shall not alter the calculated engineering outcome.

The execution sequence shall not be altered where such alteration may change the engineering outcome.

### 11.3 Canonical calculation representation

The Engineering Service shall perform governed calculations using a canonical engineering representation independent of consumer-provided units, formatting preferences or presentation requirements.

The canonical calculation representation shall provide a consistent basis for applying approved calculation rules, formulae, constraints and transformations.

Input values shall be converted to the applicable canonical representation before calculation execution. The conversion process shall:
- validate that the supplied quantity and unit are compatible;
- apply approved conversion methods;
- preserve traceability to the original authoritative input; and
- ensure that subsequent calculation processing operates on standardised engineering values.

The canonical calculation representation shall be used for:
- calculation pathway execution;
- formula application;
- constraint evaluation;
- transformation processing that affects engineering meaning; and
- establishment of the canonical Calculation Result.

Consumer-specific representation requirements, including alternate units, formatting and display conventions, shall not modify the canonical calculation representation or alter the engineering outcome.

The canonical calculation representation shall remain implementation-independent. The specific representation used internally by the Engineering Service is an implementation concern, provided that the engineering meaning and traceability requirements are preserved.

### 11.4 Rule, formula and transformation execution

The Engineering Service shall execute the applicable calculation pathway using the governed rules, formulae, constraints and transformations resolved within the Internal Calculation Context.

The calculation method shall be determined from authoritative engineering resources contained within the applicable governed data release. The Engineering Service shall not introduce, modify or infer calculation logic outside the governed calculation definitions.

Execution of the calculation pathway shall:
- apply the resolved calculation rule or formula;
- apply applicable constraints and conditions defined by the calculation method;
- apply calculation transformations in the governed sequence;
- preserve traceability between each applied resource and the resulting Calculation Result; and
- produce the canonical engineering result.

Where multiple calculation branches or conditions exist within a governed method, the Engineering Service shall apply only the branch conditions explicitly defined by the authoritative calculation resource.

The Engineering Service shall not:
- substitute alternative formulae or rules where a governed resource exists;
- assume relationships between forward and inverse methods where they are not explicitly defined;
- reorder calculation transformations where doing so may alter engineering meaning;
- apply undocumented corrections or adjustments; or
- embed engineering rules that duplicate or override authoritative data.

Where the resolved calculation pathway cannot be executed in accordance with the governed calculation definition, the Engineering Service shall not produce a Calculation Result and shall return the applicable governed failure outcome.

For a given Engineering Scenario, Internal Calculation Context and governed data release, execution of the calculation pathway shall produce a deterministic Calculation Result.

## 12. Inverse Calculation Path

The Inverse Calculation Path defines the controlled conditions under which the Engineering Service may calculate an engineering quantity by applying an approved inverse calculation method.

An inverse calculation is an explicitly governed calculation pathway that determines a quantity not directly supplied by the consumer from an authoritative input representing the outcome of another calculation relationship.

The Engineering Service shall not assume that a forward calculation relationship is inherently reversible. An inverse calculation pathway shall only be available where an approved inverse method is defined within the applicable governed data release.

The Inverse Calculation Path shall operate within the common Calculation Path Execution Model defined in Section 11. It differs only in the determination and execution of the applicable governed inverse method.

### 12.1 Inverse calculation applicability

The Engineering Service shall perform an inverse calculation only where the authoritative calculation input corresponds to a quantity for which an approved inverse calculation pathway exists.

Inverse calculation applicability shall be determined from:
- the authoritative calculation input;
- the resolved Engineering Scenario;
- the applicable governed calculation resources; and
- any defined inverse calculation constraints.

The Engineering Service shall not:
- derive inverse relationships from forward calculation definitions unless explicitly authorised;
- assume mathematical invertibility of a governed formula;
- apply numerical inversion where an approved inverse method is not defined; or
- return an engineering result based on an unsupported inverse relationship.

Inverse calculation shall use the same governed resource resolution, interaction determination and data release selection processes as other calculation pathways.

Where an inverse calculation pathway is not defined, the Engineering Service shall return the applicable governed applicability outcome.

### 12.2 Approved inverse methods

An inverse calculation method shall only be applied where the applicable governed data release explicitly defines an approved inverse calculation pathway.

An approved inverse method shall identify:
- the authoritative input quantity to which the inverse method applies;
- the resulting engineering quantity to be calculated;
- the governing formula, rule or approved calculation method;
- any constraints, applicability conditions or domain limitations; and
- any required transformations or processing steps.

The Engineering Service shall apply the approved inverse method using the same governed resource resolution, calculation context and execution sequence applied to other calculation pathways.

An inverse method shall not be generated automatically from a forward calculation definition unless the generation process itself is an approved and governed capability.

Where a forward calculation pathway exists but no approved inverse method exists, the Engineering Service shall not perform an inverse calculation.

The Engineering Service shall preserve traceability between the inverse method applied and the authoritative engineering resources that define the relationship.

### 12.3 Inverse calculation constraints and validation

An inverse calculation shall be executed only within the defined applicability domain of the approved inverse method.

The Engineering Service shall validate that:
- the authoritative input value is within the supported domain of the inverse method;
- required constraints and applicability conditions are satisfied;
- the inverse method produces an engineering outcome that satisfies the defined applicability, constraint and result validation requirements; and
- the resulting Calculation Result satisfies applicable result constraints.

Where an inverse method produces multiple possible solutions, the Engineering Service shall apply only the selection criteria explicitly defined by the governed calculation method.

The Engineering Service shall not:
- select an arbitrary solution where multiple valid outcomes exist;
- extrapolate beyond the approved domain of an inverse method;
- disregard constraints defined by the governing calculation resource;
- use inverse calculations to overcome limitations in the authoritative data model; or
- return a Calculation Result where the inverse solution cannot be established with sufficient engineering confidence.

Any conversion, transformation or rounding applied during an inverse calculation shall follow the same governed sequencing and traceability requirements established for other 
calculation pathways.

Failure to satisfy inverse calculation constraints shall prevent calculation completion and shall be handled using the applicable governed error semantics.

## 13. Validation Rules

Validation ensures that the Engineering Service performs calculations only against information that is structurally valid, engineering-consistent and supported by the governed calculation model.

Validation shall be applied throughout the calculation lifecycle and shall establish confidence that:
- the supplied engineering information can be interpreted correctly;
- the Engineering Scenario represents a valid engineering problem;
- the Internal Calculation Context contains only resolved and applicable information; and
- the resulting Calculation Result satisfies applicable outcome constraints.

Validation activities shall support, but remain distinct from, the Engineering Assurance Framework. Validation establishes whether a specific calculation operation is valid; assurance establishes confidence that the broader engineering service remains accurate, controlled and sustainable.

Validation outcomes shall use the governed error semantics defined by the Error Code Registry where calculation execution cannot proceed.

### 13.1 Validation principles

The Engineering Service shall validate information at each stage of the calculation lifecycle before progressing to subsequent processing stages.

Validation shall be performed against authoritative engineering definitions, governed constraints and applicable calculation requirements.

Validation shall:
- occur before information is used for calculation execution;
- distinguish invalid information from valid information that is outside calculation applicability;
- preserve traceability of validation outcomes;
- prevent unresolved or inconsistent engineering information from entering calculation execution; and
- avoid introducing engineering interpretation not defined by the governed calculation model.

Validation shall not modify authoritative engineering information or silently correct invalid inputs. Where correction, normalisation or conversion is required, it shall occur only through governed processes with defined traceability.

### 13.2 Engineering input validation

Engineering input validation shall establish whether the supplied authoritative input is suitable for use within the governed calculation process.

Validation shall confirm that:
- the required authoritative input has been provided;
- the input quantity is compatible with the intended calculation pathway;
- the supplied value conforms to applicable engineering constraints;
- the supplied unit is valid for the identified quantity;
- any required input conversion to the canonical calculation representation can be performed; and
- the resulting canonical input is suitable for calculation execution.

Where input conversion is required, the Engineering Service shall perform the conversion during validation before the input enters the calculation process.

Input validation shall preserve traceability between:
- the original supplied value and unit;
- the approved conversion or transformation applied;
- the resulting canonical calculation input; and
- the subsequent Calculation Result.

The Engineering Service shall not:
- silently modify invalid engineering inputs;
- substitute missing values;
- apply undocumented assumptions;
- infer engineering intent from ambiguous inputs; or
- accept values outside defined constraints without an approved governing mechanism.

Where engineering input validation fails, the Engineering Service shall not construct a calculation pathway or produce a Calculation Result.

Input constraints, including minimum, maximum and boundary conditions, shall be defined by the applicable governed engineering resource and shall not be independently implemented by the Engineering Service.

### 13.3 Calculation context validation

Calculation context validation shall establish whether the resolved Internal Calculation Context is complete, consistent and suitable for calculation execution.

Validation shall confirm that:
- the Engineering Scenario has been successfully established;
- required PES and ES resources have been resolved;
- the applicable interaction has been identified;
- the applicable calculation pathway has been determined;
- required rules, formulae, constraints and transformations are available;
- all referenced engineering resources are present within the applicable governed data release; and
- the resolved context is internally consistent with the governing engineering model.

Calculation context validation shall ensure that:
- no unresolved engineering selections remain;
- no conflicting resource relationships exist;
- no unsupported calculation assumptions have been introduced; and
- no information outside the governed engineering model has been used to establish applicability or execution behaviour.

The Engineering Service shall not execute a calculation where the Internal Calculation Context:
- cannot be established completely;
- contains ambiguous engineering relationships;
- references unavailable or invalid resources;
- applies a calculation method outside its defined applicability conditions; or
- cannot provide sufficient traceability to the governing engineering resources.

Where calculation context validation fails, the Engineering Service shall return the applicable governed failure outcome and shall not produce a Calculation Result.

Once calculation context validation has completed successfully, the validated Internal Calculation Context shall remain unchanged for the duration of calculation execution. Any change affecting engineering meaning shall require revalidation before calculation proceeds.

### 13.4 Result validation

Result validation shall establish whether the calculated engineering outcome satisfies the applicable requirements for a valid Calculation Result.

Validation shall confirm that:
- the calculation completed using the validated Internal Calculation Context;
- the resulting quantity and unit correspond to the applicable calculation pathway;
- the result conforms to applicable engineering constraints;
- all required transformations have been applied in the governed sequence;
- the result remains traceable to the authoritative input and governed calculation resources; and
- the Calculation Result contains sufficient information to support engineering interpretation and assurance.

Result validation shall not modify the calculated engineering outcome or introduce additional engineering assumptions.

Where representation transformations are applied after calculation, validation shall ensure that:
- the canonical engineering result remains preserved;
- conversion and formatting operations do not alter engineering meaning; and
- any applied transformations remain traceable.

The Engineering Service shall not return a Calculation Result where the calculated outcome:
- fails applicable result constraints;
- cannot be traced to the governing calculation pathway;
- has been affected by an uncontrolled transformation; or
- cannot be demonstrated to represent the approved engineering calculation outcome.

Where result validation fails, the Engineering Service shall return the applicable governed failure outcome and shall not represent the calculation as a valid engineering result.

## 14. MVP Scope and Future Extension Points

The Engineering Calculation Model defines an extensible architecture intended to support the long-term digital evolution of AASTP engineering services.

The MVP implementation shall provide a controlled and demonstrable calculation capability while preserving the architectural foundations required for future expansion.

Features identified as future extensions shall not be implemented by introducing uncontrolled changes to the engineering model. Future capabilities shall be introduced through governed changes to the data model, validation framework, service interfaces and supporting documentation.

The distinction between MVP capability and future extension shall ensure that immediate implementation remains achievable while maintaining compatibility with future digital engineering requirements.

### 14.1 MVP calculation capability

The MVP Engineering Service shall demonstrate the ability to:
- consume an authoritative governed data release;
- validate engineering inputs;
- establish a valid Engineering Scenario;
- construct and validate an Internal Calculation Context;
- determine an applicable calculation pathway;
- execute approved calculation methods;
- generate traceable Calculation Results; and
- provide governed failure outcomes where calculation cannot be completed.

MVP capability shall prioritise correctness, traceability and assurance over breadth of functionality.

The MVP shall not require implementation of future extension capabilities unless they are necessary to demonstrate the core Engineering Service architecture.

### 14.2 Deferred capabilities

The following capabilities are recognised as future extensions to the Engineering Service and are outside the scope of the MVP implementation.

Deferred capabilities shall not require uncontrolled modification of the Engineering Calculation Model and shall be introduced through governed extension processes.

**Extended engineering data capability**

Future implementations may support:
- expanded AASTP chapter coverage beyond the initial implementation scope;
- additional engineering entities, relationships and calculation methods;
- enhanced engineering knowledge representation; and
- broader integration of narrative and supporting engineering information.

**National tailoring and localisation**

Future implementations may support:
- controlled national tailoring profiles;
- approved deviations from baseline AASTP requirements;
- national calculation methods where authorised;
- language-specific representations; and
- jurisdiction-specific output requirements.

**Enhanced calculation services**

Future implementations may support:
- additional calculation pathways;
- expanded inverse calculation capability;
- automated generation of engineering tables and reports;
- batch calculation services; and
- integration with external engineering systems.

**Deployment and operational capability**

Future implementations may support:
- offline calculation environments;
- nationally hosted instances;
- distributed service deployments;
- enhanced user interfaces and visualisation; and
- integration with enterprise engineering platforms.

**Engineering assurance and governance capability**

Future implementations may support:
- enhanced validation reporting;
- automated assurance evidence generation;
- formal release authentication workflows;
- extended audit capability; and
- integration with broader digital engineering governance frameworks.

**Engineering assurance and conformance capability**

Future implementations may support:
- machine-testable conformance models;
- reference calculation test vectors;
- profile conformance suites;
- reproducibility records;
- automated assurance evidence generation;
- extended validation reporting; and
- formal release verification workflows.

Deferred capabilities shall preserve the principles established within this model, including authoritative data ownership, traceability, validation, interoperability and controlled evolution.

Future extensions shall be introduced only where the required terminology, data structures, validation requirements and governance arrangements have been defined.

### 14.3 Future extension principles

Future extensions to the Engineering Service shall preserve the architectural principles established within this model and shall be introduced through controlled governance processes.

Future extensions shall:
- preserve the separation between authoritative engineering data, engineering calculation logic and service implementation;
- maintain the authoritative status of governed data releases;
- extend existing governed structures rather than introduce parallel engineering models;
- maintain backwards compatibility wherever practical;
- preserve traceability between engineering inputs, calculation methods and resulting outcomes;
- maintain validation and assurance requirements appropriate to the capability being introduced;
- define required terminology, data structures and governance arrangements before implementation; and
- undergo appropriate engineering assessment before adoption into an authoritative service release.

Future extensions shall not:
- duplicate authoritative engineering information;
- introduce undocumented engineering rules;
- bypass established validation mechanisms;
- alter existing calculation outcomes without controlled approval;
- require consumers to interpret authoritative engineering data independently where a governed service capability exists; or
- create incompatible representations of existing engineering concepts.

New capabilities shall be introduced as controlled extensions of the Engineering Service architecture rather than independent solutions.

National extensions, including tailoring profiles and jurisdiction-specific requirements, shall be implemented through governed extension mechanisms and shall not modify the baseline authoritative engineering model.

## 15. Risks

The Engineering Calculation Model introduces a controlled digital representation of AASTP engineering processes. The principal risks relate not only to software implementation, but also to preservation of engineering authority, traceability, reproducibility and governance.

Risks shall be managed through the architectural principles, validation controls and governance processes established within this specification and related governance artefacts.

| Risk | Control |
|---|---|
| Ambiguous or incomplete engineering resource resolution | Require Structure-led resource selection, authoritative PES and ES resolution, and a single valid calculation pathway. The Engineering Service shall fail closed where applicability cannot be established. |
| Calculation results cannot be reproduced after data or rule changes | Associate results with the applicable validated data release, calculation basis references and required provenance information. |
| National tailoring modifies engineering outcomes without visibility | Require explicit approved national profiles, controlled applicability rules and traceable profile identification in resulting calculations. |
| Unit conversion or transformation introduces engineering discrepancy | Perform calculations using canonical engineering representations, apply controlled conversions and preserve conversion and transformation traceability. |
| Consumers become dependent on internal implementation structures | Expose stable engineering identifiers and governed representations rather than repository paths, indexes or internal execution objects. |
| Inverse calculation produces an invalid or misleading engineering outcome | Permit inverse calculations only where an approved inverse method exists within the governed data release and applicable constraints are satisfied. |
| Future extensions introduce incompatible engineering interpretations | Require controlled extension mechanisms, terminology definition, schema governance and engineering assessment before adoption. |
| MVP scope expansion delays demonstration of the core Engineering Service concept | Maintain a clear MVP boundary and introduce additional capability only through controlled extension processes. |
| Calculation logic becomes duplicated between software and authoritative data | Maintain the authoritative JSON data layer as the source of engineering rules, formulae, constraints and transformations. |
| Validation provides confidence in individual calculations but not long-term service assurance | Maintain separation between operational validation and the Engineering Assurance Framework, including evidence generation and governance processes. |

## 16. Acceptance Criteria

The Engineering Calculation Model shall be considered acceptable when it demonstrates that governed engineering calculations can be performed consistently, traceably and reproducibly through the digital Engineering Service architecture.

Acceptance shall focus on the integrity of the engineering model, the correctness of calculation execution, the traceability of resulting outcomes and the ability to evolve the service through controlled governance processes.

Acceptance criteria shall apply to the Engineering Calculation Model and its implementation capability. Detailed software verification procedures, test cases and deployment acceptance activities shall be defined separately.

### 16.1 Engineering model acceptance

The Engineering Calculation Model shall demonstrate that:
- authoritative engineering data is represented using governed structures;
- Engineering Scenarios can be uniquely established from supplied inputs and resolved resources;
- PES and ES relationships are explicitly represented and traceable;
- calculation applicability can be determined without reliance on undocumented engineering assumptions;
- authoritative calculation inputs are clearly identified; and
- calculation pathways can be resolved using governed engineering resources.

### 16.2 Calculation execution acceptance

The Engineering Service shall demonstrate that governed calculations can be executed consistently and correctly using the approved calculation pathways defined within the Engineering Calculation Model.

Calculation execution acceptance shall confirm that:
- validated engineering inputs are converted into the canonical calculation representation before execution;
- the applicable calculation pathway is determined from the validated Engineering Scenario and Internal Calculation Context;
- only approved rules, formulae, constraints and transformations are applied;
- calculation transformations are executed in the governed sequence;
- representation transformations are applied only after establishment of the canonical engineering result;
- inverse calculations are performed only where approved inverse methods exist;
- unsupported or invalid calculation pathways produce governed failure outcomes; and
- equivalent engineering inputs, calculation context and governed data releases produce consistent Calculation Results.

Calculation execution acceptance shall demonstrate that the Engineering Service executes the governed engineering model rather than introducing independent calculation logic or undocumented assumptions.

Where calculation execution cannot be completed in accordance with the governed calculation pathway, the service shall fail predictably and shall not return an incomplete or misleading Calculation Result.

### 16.3 Traceability and assurance acceptance

The Engineering Service shall demonstrate that Calculation Results are traceable to the engineering information and governed resources used to produce them.

Traceability and assurance acceptance shall confirm that:
- the authoritative calculation input can be identified;
- the resolved Engineering Scenario and Internal Calculation Context can be identified and reviewed;
- the applicable governed data release can be identified;
- the calculation pathway, rules, formulae, constraints and transformations applied can be determined;
- validation outcomes associated with the calculation process are available;
- the resulting Calculation Result can be distinguished from unsuccessful or incomplete calculation attempts; and
- equivalent engineering inputs, governed resources and execution conditions produce reproducible outcomes.

The Engineering Service shall preserve sufficient evidence to support engineering review, verification activities and future assurance processes.

Traceability information shall support confidence in the engineering outcome without requiring consumers to access or interpret internal implementation structures.

Detailed assurance processes, evidence requirements and ongoing service confidence measures shall be defined through the Engineering Assurance Framework.

### 16.4 Compatibility and extension acceptance

The Engineering Calculation Model shall demonstrate that future capability can be introduced through controlled extensions while preserving existing engineering meaning, compatibility and governance.

Compatibility and extension acceptance shall confirm that:
- authoritative engineering identifiers remain stable wherever practical;
- existing calculation pathways continue to produce consistent outcomes unless a controlled engineering change has been approved;
- extensions modify or add governed structures rather than creating parallel engineering models;
- future capabilities can be introduced without requiring consumers to depend on internal implementation details;
- changes to authoritative data, calculation methods or representations can be assessed through controlled governance processes; and
- existing validation, traceability and assurance mechanisms remain applicable as capability expands.

The Engineering Service shall support controlled evolution of the Engineering Calculation Model through additive extension wherever practical.

Where a future change requires modification of an existing engineering concept, the change shall be subject to appropriate engineering assessment, compatibility review and controlled release processes.

## 17. Glossary

| Term | Definition |
|---|---|
| AASTP | Allied Ammunition Storage and Transport Publication. |
| Authoritative calculation input | The single engineering quantity, value and unit supplied by the consumer that forms the basis for determining the applicable calculation pathway. The authoritative calculation input does not define the calculation method or guarantee that a calculation applies. |
| Canonical unit | The controlled unit used internally for calculation before any output conversion or formatting. |
| Calculation applicability | The determination that an approved calculation pathway exists for a resolved Engineering Scenario and Internal Calculation Context. |
| Calculation pathway | The governed set of engineering resources, rules, formulae, constraints and transformations required to execute an approved calculation for a resolved Engineering Scenario. |
| Calculation Request | Public model through which a client submits one Engineering Scenario and optional Execution Context. |
| Calculation Result | The governed engineering outcome produced by the Engineering Service after successful execution of an approved calculation pathway, together with the traceability information required for review, assurance and reproducibility. |
| Canonical calculation representation | The controlled engineering representation used during calculation execution after validation and conversion of supplied inputs. It provides a consistent basis for applying governed rules, formulae, constraints and transformations. |
| Engineering Assurance Framework | The governance framework that establishes how confidence is maintained and demonstrated in the accuracy, traceability, integrity and sustainability of the digital Engineering Service. |
| Engineering Scenario | The technology-neutral representation of the engineering problem, including the resolved PES and ES resources, orientations, Hazard Category and authoritative calculation input. |
| Execution Context | Controlled contextual information that may affect engineering resource resolution, calculation applicability or approved representation without changing the identity of the Engineering Scenario. |
| ES | Exposed Site. |
| Forward calculation | Calculation of required separation distance from a supplied NEQ. |
| Internal Calculation Context | The non-public resolved engineering state constructed from the validated Calculation Request, established Engineering Scenario and governed data release. It contains the information required to determine applicability and execute an approved calculation pathway while remaining traceable to authoritative resources. |
| NEQ | Net Explosive Quantity. |
| PES | Potential Explosion Site. |
| National profile | An approved national tailoring of the governed standard or repository, identified and applied explicitly. |
| Reverse calculation | Calculation of maximum permitted NEQ from a supplied separation distance. |
| Structure | A public engineering resource that defines the construction and exposure dimensions and orientation type applicable to engineering resource selection. |
| Traceability | The controlled relationship between the authoritative input, Engineering Scenario, Internal Calculation Context, governed calculation pathway, applied resources and resulting Calculation Result. |
| Transformation | A governed operation applied to an engineering value, either as part of calculation execution or representation processing. Transformations shall preserve traceability and engineering meaning. |
| Validated data release | A controlled release of authoritative engineering data that has passed applicable validation controls and is approved for use by the Engineering Service. |

## 18. Document History

| Date | Version | Change | Author / approval |
|---|---|---|---|
| 2026-08-16 | 0.3.0 | Major revision of the Engineering Calculation Model. Established the Engineering Scenario, Execution Context and Internal Calculation Context separation; introduced Structure-led resource resolution; formalised input-led calculation direction determination; defined canonical calculation representation, validation lifecycle, inverse calculation governance, MVP boundaries, future extension principles, risk controls and acceptance criteria. | Draft |
| 2026-08-10 | 0.2.0 | Aligned with API Contract v0.3.1: introduced Structure-led selection before calculation, replaced operation-selected direction with input-led direction determination through the unified calculation service, and corrected ES/PES terminology. | Draft |
| Pre-2026-08-10 | 0.1.0 | Initial governed engineering calculation model. | Draft |
