# Engineering Resource Resolution Model

**Status:** Draft  
**Version:** 1.1  
**Date:** 2026-08-10  
**Applies to:** AASTP digital engineering resources

## 1. Purpose

This document defines the governance and design model for resolving a user-described engineering configuration to an existing canonical resource in an authoritative AASTP dataset.

The model addresses the small number of cases in which a configuration is meaningful in the selection workflow but is not represented as an exact, separately enumerated resource. It permits an explicitly approved resolution rule to canonicalise that configuration before the authoritative resource is selected.

The model prevents exceptional configurations from causing unnecessary permutations in ES Types, PES Types, `interactions.json`, or future datasets. It also prevents engineering direction from being hidden in application code.

The governing architecture is:

```text
Engineering Resource Resolution Model (governance)
                         ↓
resource_resolution_rules.json (authoritative direction)
                         ↓
JSON Schema and cross-dataset validation
                         ↓
Pure resolver service
                         ↓
API and client selection workflow
```

JSON remains the single source of truth for executable engineering data. This Markdown document governs the mechanism; it does not contain executable mappings and does not itself authorise a resolution.

## 2. Scope

This model applies to exceptional configuration-to-resource resolution for:

- Exposed Site (ES) Types;
- Potential Explosion Site (PES) Types; and
- other authoritative datasets where a future, explicitly governed need is established.

The design is dataset-agnostic wherever practical. Rules identify their target dataset or resource type using neutral identifiers rather than ES- or PES-specific program logic.

Current demand is deliberately small: only a few ES cases and one PES case are expected. The implementation shall therefore remain an explicit, bounded canonicalisation mechanism, not become a general-purpose rule engine.

The following are out of scope:

- interaction selection;
- distance-rule selection;
- formula selection or evaluation;
- quantity-distance or other engineering calculations;
- inference of engineering equivalence;
- creation of synthetic ES, PES, interaction, or other engineering resources;
- replacement of normal dataset validation; and
- unrestricted national overrides of NATO authoritative data.

## 3. Principles

1. **Authoritative JSON data.** Executable resolution direction shall exist in `resource_resolution_rules.json`, validated against its schema and referenced datasets.
2. **Exact match first.** A valid exact resource match always takes precedence over exception rules.
3. **Explicit governance.** A rule may be applied only when an approved rule explicitly covers the submitted configuration.
4. **No inferred AASTP rules.** The resolver shall never guess a canonical target or derive equivalence from similarity.
5. **No duplicated vocabularies.** Dataset identifiers, property names, controlled values, and resource identifiers shall reference existing authoritative definitions; the rule dataset shall not redefine them.
6. **Explicit data over hidden logic.** Engineering mappings shall not be embedded in JavaScript conditionals, client logic, or API controllers.
7. **Small and deterministic.** The mechanism shall use a constrained set of condition and outcome forms, with no scripting, arbitrary expressions, chaining, or recursive rules.
8. **Traceable operation.** Every non-exact result shall identify the applied rule, input configuration, canonical configuration, and canonical resource.
9. **Non-destructive representation.** Trace output shall retain the submitted configuration; canonicalisation shall not falsely report that the user supplied the canonical values.
10. **Downstream isolation.** Resolution ends when a canonical resource is identified. Interactions and calculations consume that resource through their existing governed processes.
11. **Maintainability and compatibility.** Stable IDs and versioned schemas shall be used. Changes shall preserve backwards compatibility wherever practical.
12. **Fail closed.** Missing, invalid, ambiguous, overlapping, or unapproved cases shall not be silently resolved.
13. **Selection semantics are explicit.** A property identified as selectable may be supplied by a user. Informational context may explain a selectable value but shall not become an independent input dimension.

## 4. Terminology

### 4.1 Configuration

A structured set of user-supplied or system-supplied selection values describing a candidate instance of an engineering resource. A configuration includes the context necessary for resolution, such as a structure identifier and the applicable construction or exposure properties.

### 4.2 Canonical resource

An existing, explicitly defined resource in an authoritative dataset that represents the governed engineering treatment of the configuration. A canonical resource is not created by the resolver.

### 4.3 Exact match

A resource whose identifying properties exactly correspond to the submitted configuration after ordinary input validation, without application of a resolution rule.

### 4.4 Canonicalisation

The governed transformation of a non-exact configuration into a canonical configuration that identifies an existing authoritative resource. Canonicalisation does not change the recorded user input and does not imply that all superficially similar configurations are equivalent.

### 4.5 Redundant parameter

A supplied property that is valid in the wider structure or dataset context but does not discriminate between engineering resources when the rule's explicit conditions are met. The rule assigns the governed canonical value for lookup while preserving the supplied value in trace information.

### 4.6 Non-applicable parameter

A property that may exist in the wider selection model but is not applicable once a particular governed configuration has been selected. The rule sets it to the dataset's existing non-applicable representation for canonical lookup. That representation must already be defined by the authoritative model; the resolution dataset shall not invent one.

### 4.7 Resolution rule

A uniquely identified, approved record in `resource_resolution_rules.json` that defines:

- the authoritative dataset or resource type to which it applies;
- the bounded condition under which it applies;
- the permitted canonicalisation outcome;
- the expected canonical target or the information needed for an exact canonical lookup; and
- governance and traceability metadata.

### 4.8 Selectable property

A property that the governing Structure and dataset explicitly permit a user or client to supply when describing a configuration. Selectability is contextual: a property may exist in a resource representation without being a valid selection input.

### 4.9 Informational context

A property exposed to explain or qualify a selectable engineering value but not independently selected by the user. In the current exposure model, `exposure.category` provides the engineering meaning of `exposure.level`; `exposure.level` is selectable where applicable, while `exposure.category` is resolved from the selected Structure or canonical resource.

### 4.10 Undefined configuration

A valid, well-formed configuration that an approved rule authoritatively resolves as having no defined canonical resource. This is a successful governed resolution with status `undefined`; it is distinct from invalid input, an unsupported condition, a missing rule, or an implementation failure.

## 5. Responsibilities and boundaries

### 5.1 Governance model

This document shall:

- define when canonicalisation is permitted;
- establish terminology, boundaries, responsibilities, and change control;
- define mandatory traceability and failure behaviour; and
- remain generic enough for future authoritative datasets.

It shall not define individual executable mappings.

### 5.2 Authoritative resolution-rule dataset

`resource_resolution_rules.json` shall:

- contain only explicitly approved exceptional mappings;
- use stable unique rule IDs;
- reference authoritative datasets, structures, properties, values, and targets;
- state a constrained outcome type; and
- contain sufficient provenance and lifecycle metadata for governance.

It shall not copy controlled vocabulary definitions or contain calculation logic.

### 5.3 Schema and validation layer

The schema shall validate the shape and allowed vocabulary of the rule dataset. Cross-dataset validators shall validate its engineering references, target existence, applicability, uniqueness, and determinism.

### 5.4 Resolver service

The resolver shall perform deterministic exact matching and, only where necessary, apply one explicitly matching rule. It shall return a resolution result and trace record without side effects.

### 5.5 API and clients

The API shall provide the supported selection workflow and communicate exact, canonicalised, unsupported, invalid, and ambiguous outcomes clearly. Clients may collect and display configuration values, but shall not reproduce or reinterpret authoritative resolution logic.

### 5.6 Prohibited behaviours

No layer may:

- infer a canonical target from the nearest or most conservative-looking resource;
- use array order, naming resemblance, or defaults as engineering direction;
- bypass an exact match in favour of a rule;
- apply multiple rules sequentially;
- allow a rule to invoke another rule;
- resolve a configuration through client-side-only behaviour;
- alter an interaction, distance rule, formula, or calculated result;
- create missing resource permutations at runtime;
- treat a missing value as `false`, `null`, zero, or any controlled value unless the governing dataset explicitly defines that meaning; or
- silently select one result when multiple resources or rules match.

## 6. Generic resolution pipeline

```text
1. Receive dataset/resource type, context, and configuration
                              ↓
2. Validate request shape, references, properties, and controlled values
                              ↓
3. Search the authoritative target dataset for an exact match
                 ┌────────────┴────────────┐
                 │                         │
          one exact match          no exact match
                 │                         ↓
                 │              4. Find explicitly applicable rule
                 │                  ┌──────┴─────────┐
                 │                  │                │
                 │             one rule       zero or many rules
                 │                  │                │
                 │                  ↓                ↓
                 │        5. Canonicalise       fail closed
                 │                  ↓
                 │        6. Exact lookup of canonical
                 │           configuration/target
                 │                  ↓
                 └──────────→ 7. Return resource and trace
```

An exact match shall return without consulting resolution rules for selection. The service may report that no rule was applied.

If no exact match exists, exactly one approved rule must match. A canonicalising rule may perform one bounded operation containing one or more explicitly declared property assignments, but it may not initiate further rule evaluation. Its resulting canonical configuration and declared target must identify exactly one existing resource. An `undefined_configuration` rule instead terminates successfully without canonical assignments, a canonical target, or a subsequent lookup.

If no rule matches, the result is unsupported. If more than one rule matches, the result is ambiguous and indicates a data-governance or validation failure. Rule ordering or priority shall not be used to conceal overlap.

## 7. Conceptual rule data structure

The following is illustrative only. Field names and controlled values must be finalised in the JSON Schema before implementation. Placeholders deliberately avoid inventing authoritative identifiers or mappings.

```json
{
  "schemaVersion": "1.0.0",
  "metadata": {
    "datasetId": "resource_resolution_rules",
    "version": "1.0.0",
    "status": "draft"
  },
  "rules": [
    {
      "id": "<stable-rule-id>",
      "status": "approved",
      "appliesTo": {
        "datasetId": "<authoritative-dataset-id>",
        "resourceType": "<authoritative-resource-type>",
        "context": {
          "structureId": "<existing-structure-id>"
        }
      },
      "when": {
        "all": [
          {
            "property": "<authoritative-property-name>",
            "operator": "equals",
            "value": "<authoritative-controlled-value>"
          },
          {
            "any": [
              {
                "property": "<authoritative-property-name>",
                "operator": "type_is",
                "value": "string"
              },
              {
                "property": "<authoritative-property-name>",
                "operator": "equals",
                "value": null
              }
            ]
          }
        ]
      },
      "outcome": {
        "type": "redundant_parameter",
        "canonicalAssignments": [
          {
            "property": "<authoritative-property-name>",
            "value": "<authoritative-controlled-value>"
          }
        ],
        "canonicalTargetId": "<existing-resource-id>"
      },
      "governance": {
        "rationale": "<approved engineering rationale>",
        "source": "<approved source reference>",
        "effectiveFrom": "<date>"
      }
    }
  ]
}
```

### 7.1 Neutral identification

`datasetId` is the primary neutral discriminator. `resourceType` may be retained where a dataset contains more than one resource type or where it improves validation and API clarity. The pair must resolve through a governed dataset registry or equivalent authoritative configuration; it shall not be an unrestricted filename or dynamic code-module name.

ES and PES rules use the same envelope and rule semantics. Dataset-specific validators or adapters may interpret their authoritative resource shape, but they must expose the same resolver contract.

In the current authoritative datasets, the neutral identifiers correspond to metadata values `es_types` and `pes_types`. Their resource collections are held under `es_types` and `pes_types` respectively. This physical distinction belongs in explicit dataset adapters or a governed dataset registry; it shall not leak into the rule language as separate ES- and PES-specific behaviours.

### 7.2 Constrained condition groups

A condition is either a predicate or a conjunction group. The governed conjunction vocabulary is:

- `all`: every child condition must match; and
- `any`: at least one child condition must match.

Groups may contain predicates and, where a demonstrated rule requires it, nested groups. Each group shall contain at least one child. A group shall contain exactly one of `all` or `any`; implicit conjunctions and a separate `or` operator are not permitted. The schema should support nesting because the conceptual grammar is recursive, while governance should keep actual rules as shallow as practical.

### 7.3 Governed predicate operators

The initial operator vocabulary is deliberately limited to:

| Operator | Meaning | Predicate value |
|---|---|---|
| `equals` | The runtime property value is deeply equal to the supplied JSON value, including strict type distinction. | Any schema-permitted JSON value. |
| `type_is` | The runtime property exists and has the specified JSON type. | One of `string`, `boolean`, `null`, `object`, `array`, or `number`, as permitted for the referenced property. |

`type_is` is explicit and shall replace the ambiguous operator name `is`. Its type name belongs in the predicate's `value` field; a parallel `type` member shall not be used. A missing property does not satisfy `type_is`, including `type_is: "null"`; absence and JSON `null` remain distinct.

Additional operators shall be introduced only through a governed schema and model change supported by a demonstrated engineering requirement. The initial model shall not support arbitrary expressions, negation, ranges, embedded code, priority-based conflict resolution, or rule chaining.

### 7.4 Outcome shapes and canonical targets

A rule should normally declare both:

- the canonical property assignments, so the transformation is transparent; and
- the expected canonical target ID, so validation can prove that the transformation resolves to the approved resource.

The resolver shall confirm that the canonicalised configuration and target agree. A mismatch is a data-integrity failure, not permission to prefer either value.

Canonicalising outcomes, including `redundant_parameter` and `non_applicable_parameter`, require non-empty `canonicalAssignments` and a `canonicalTargetId`. An `undefined_configuration` outcome permits neither field because it represents an approved terminal result rather than a transformation to a resource:

```json
{
  "outcome": {
    "type": "undefined_configuration"
  }
}
```

The rule ID and governance metadata provide the authority and traceability for that result. The rule shall not use `canonicalTargetId: null` to express undefined, because that is indistinguishable from an omitted or incomplete target.

### 7.5 Observations from the current rule dataset

The current `resourceResolutionRules.json` is pre-schema working data and contains matters that shall be resolved through engineering review or structural migration before release. This document records them so that validation does not silently normalise them:

- RR002, RR003, and RR004 express type tests as `operator: "equals"` with a sibling `type: "string"`; the governed shape is `operator: "type_is"` with `value: "string"`.
- RR002, RR003, and RR004 repeat `structure` as a condition although `appliesTo.context.structureId` already scopes the rule. The schema design must establish one authoritative location; the preferred location is scope context, with validators rejecting contradictory duplication.
- RR003 and RR004 can both match when both exposure properties are strings and therefore overlap. `any` permits the intended alternatives to be expressed in one rule, subject to confirmation of the engineering intent.
- RR003 and RR004 are scoped to Structure `STR011` but declare `ES007C` as their canonical target. Cross-dataset target validation must reject any target whose structure or canonical configuration does not agree with the rule scope. No replacement target is asserted here.
- Governance `source` and `effectiveFrom` values remain placeholders even though the rules are marked `approved`. Approved status must require completed governance metadata.
- The document metadata uses `metadata.dataset`, while the conceptual vocabulary uses `datasetId`. The schema shall adopt one canonical name and any migration shall be explicit.

These observations are data-quality and schema-design findings only. They do not authorise changes to the engineering mappings in the rule dataset.

## 8. Outcomes and traceability

The resolver shall distinguish at least these outcomes:

| Outcome | Meaning |
|---|---|
| `exact_match` | One authoritative resource matched without a rule. |
| `canonicalised` | One explicitly governed rule transformed the configuration and identified one canonical resource. |
| `undefined` | One approved `undefined_configuration` rule successfully established that the valid configuration has no defined canonical resource. |
| `unsupported_configuration` | No exact resource and no approved rule matched. |
| `invalid_configuration` | Input shape, reference, applicability, or controlled value was invalid. |
| `ambiguous_resolution` | Multiple resources or rules matched, or the canonical result was not unique. |
| `resolution_data_error` | A rule, target, or authoritative dataset failed an integrity check. |

A canonicalised result should contain, at minimum:

```json
{
  "status": "canonicalised",
  "datasetId": "<authoritative-dataset-id>",
  "resourceType": "<authoritative-resource-type>",
  "resolvedResourceId": "<existing-resource-id>",
  "resolution": {
    "ruleId": "<stable-rule-id>",
    "outcomeType": "<canonicalisation-outcome>",
    "submittedConfiguration": {},
    "canonicalConfiguration": {},
    "changes": [
      {
        "property": "<property-name>",
        "submittedValue": "<value>",
        "canonicalValue": "<value>",
        "reason": "<redundant-or-non-applicable>"
      }
    ]
  }
}
```

The public API may expose a stable subset of internal trace data, but it must expose enough information for a consumer to know that canonicalisation occurred and which rule governed it. Logs and calculation audit records should also capture the rule-dataset version and target-dataset version.

An undefined result shall include the applied rule ID, `outcomeType: "undefined_configuration"`, submitted configuration, and governing dataset versions. It shall omit `resolvedResourceId`, `canonicalConfiguration`, and canonical changes. Consumers must not interpret that omission as a server fault: the explicit `status: "undefined"` is the successful domain result.

## 9. Relationship to Structures and ES/PES selection

A Structure defines which construction and exposure dimensions are applicable, which properties are selectable, and which properties are informational context. The authoritative ES or PES definitions provide the governed resource instances and their values.

Applicability and selectability are not synonyms. An informational property may be applicable and present in the returned resource without being a permitted user input. Clients shall derive their controls only from explicitly selectable properties, not from every property present in the representation.

For exposure selection, `exposure.category` is descriptive context that establishes the meaning or scale of `exposure.level`; it is not an independent user-selectable dimension. The selected Structure or resolved resource supplies the category, and the user selects only an applicable level. The service shall reject attempts to use a client-supplied category to construct combinations outside the governing Structure.

The selection workflow is:

```text
Browse Structures
        ↓
Select Structure
        ↓
Read selectable properties and informational context
        ↓
Collect values only for selectable properties
        ↓
Resolve an ES or PES Type
        ↓
Select any subsequent orientation or scenario inputs
```

Structure applicability does not guarantee that every mathematical permutation is an explicitly enumerated ES or PES Type. Where a supported configuration lacks an exact resource, it may be canonicalised only by an approved resolution rule.

The ES and PES pipelines may differ in the dimensions they collect, but they shall use the same resolution semantics. One PES resolution case is currently known to exist; its conditions and canonical target must be separately established and approved before a rule is authored. This document does not invent its specifics.

## 10. Relationship to interactions and calculation logic

Resource resolution is strictly upstream of interaction and calculation logic:

```text
Configuration → canonical ES/PES resource → interaction resolution → calculation
```

The resolver answers only:

> Which existing canonical resource does this explicitly governed configuration represent?

It shall not answer which interaction, distance rule, protection level, formula, or result applies. Once the canonical resource has been identified, existing authoritative relationships and downstream services operate normally.

This boundary protects `interactions.json` from permutations that have no distinct engineering meaning while preserving its authority for actual interactions.

## 11. Validation requirements

Validation shall occur when data is built or released and defensively when the service loads it. A release containing invalid resolution rules shall fail validation and shall not be served.

### 11.1 Dataset and schema validation

Validators shall confirm that:

- the document conforms to `resource_resolution_rules.schema.json`;
- schema and dataset versions are present and supported;
- rule IDs are stable, unique, and conform to the governed identifier format;
- required governance metadata is present;
- only supported condition and outcome types are used;
- every condition group contains exactly one non-empty `all` or `any` array;
- predicates conform to the operator-specific shape (`equals` or `type_is`);
- `type_is` values use only governed JSON type names;
- outcome-specific required and prohibited fields are enforced; and
- unknown properties are rejected where the schema requires a closed object.

### 11.2 Reference validation

Validators shall confirm that:

- every `datasetId` and `resourceType` is registered and supported;
- every referenced structure exists where structure context is used;
- every condition and assignment property exists in the authoritative model;
- each property is applicable in the declared context;
- each property used as submitted selection input is selectable in the declared context;
- informational properties, including `exposure.category`, are not accepted as independent selection dimensions;
- every controlled value exists in its authoritative vocabulary;
- `equals` values conform to the referenced property's allowed type and `type_is` is compatible with that property's schema, including strict distinctions among `false`, `null`, missing, strings, arrays, objects, and numbers;
- every declared canonical target exists in the target dataset and agrees with the declared dataset, resource type, context, and canonical assignments;
- the canonicalised configuration exactly and uniquely identifies the declared target; and
- `undefined_configuration` rules have no canonical assignments or target and are supported by completed governance metadata.

### 11.3 Determinism and conflict validation

Validators shall confirm that:

- no authoritative configuration produces more than one exact target;
- no two active rules overlap for the same dataset, resource type, context, and possible input configuration;
- overlap analysis accounts for `all`, `any`, nested groups, equality predicates, and type predicates;
- no rule can apply to a configuration that already has an exact match;
- each canonicalising rule produces exactly one existing canonical target, while each undefined rule terminates without one;
- no rule depends on ordering or priority to resolve a conflict;
- no rule targets another unresolved or synthetic configuration; and
- no rule can be chained or recursively applied.

Where exhaustive overlap analysis is practical because controlled domains are finite and small, validators should enumerate the relevant domain. Otherwise, overlap must be tested through a transparent deterministic comparison supported by focused test cases.

### 11.4 Boundary validation

Validators shall reject rule content that refers to interactions, distance rules, formulae, calculation outputs, or mutable service behaviour. They shall also reject duplicated labels or value definitions that belong in another authoritative dataset.

## 12. Service-layer responsibilities

The service should expose a pure function conceptually equivalent to:

```javascript
resolveEngineeringResource({
  datasetId,
  resourceType,
  context,
  configuration
}, authoritativeData)
```

The exact signature may evolve, but the function shall:

- validate or consume prevalidated immutable inputs;
- select the correct authoritative dataset explicitly;
- perform exact matching before considering rules;
- require exactly one matching rule when governed resolution is needed;
- evaluate only `all`, `any`, `equals`, and `type_is` with strict JSON semantics;
- apply only assignments declared by a canonicalising rule;
- verify a canonicalising rule's resulting target by exact lookup;
- return a terminal governed `undefined` result for an `undefined_configuration` rule without attempting lookup or chaining;
- return a structured result with traceability;
- avoid mutation of inputs and loaded authoritative data;
- avoid network, filesystem, clock, random, logging, and global-state dependencies;
- produce the same output for the same inputs and dataset versions; and
- use consistent machine-readable error codes.

Dataset-specific field access should be isolated behind small explicit adapters or selectors. The shared resolver should not accumulate ES/PES conditionals. Adding a future dataset may require a registered adapter and validator, but shall not require a new rule language.

Unit tests shall cover exact matches, each approved rule, boundary values, unsupported inputs, invalid references, target mismatch, ambiguity, and immutability. Integration tests shall confirm the same results through the API.

## 13. API implications

The API should support selection/resolution separately from resource browsing. The precise route is an API-contract decision, but a resolution request must provide:

- the target dataset or resource type;
- the necessary selection context, including structure where applicable; and
- the submitted configuration.

The response must distinguish exact, canonicalised, and governed undefined selection. For canonicalised results it should expose the resolved resource, rule ID, outcome type, and a concise account of canonicalised properties. For undefined results it should expose the rule ID and `undefined_configuration` outcome without a resource identifier. Detailed internal provenance may be exposed through audit or diagnostic representations where appropriate.

Recommended HTTP behaviour is:

- successful exact, canonicalised, or governed undefined resolution: success response with explicit status;
- malformed or invalid input: client-error response with stable validation details;
- valid but unsupported configuration: a governed domain error, distinct from malformed input;
- ambiguous resolution or invalid loaded rule data: server/data-integrity error that is monitored and not silently recovered.

The API shall not require clients to download and execute the rule dataset. Whether the raw rule dataset is exposed as a read-only governance resource is a separate consumer and security decision.

## 14. Failure modes

| Failure mode | Required behaviour |
|---|---|
| Invalid property or controlled value | Reject as `invalid_configuration`; do not canonicalise. |
| Missing required selection value | Reject unless the authoritative model explicitly permits omission. |
| No exact match and no rule | Return `unsupported_configuration`; do not choose a nearby resource. |
| One approved undefined rule | Return successful status `undefined`; do not attempt canonical lookup or report an implementation error. |
| Multiple exact matches | Return `ambiguous_resolution` and raise a target-dataset integrity issue. |
| Multiple matching rules | Return `ambiguous_resolution` and raise a rule-governance issue. |
| Rule target does not exist | Reject the rule dataset at validation/load time; fail closed at runtime. |
| Canonical assignments disagree with target | Reject the rule dataset; do not prefer either representation. |
| Undefined outcome includes assignments or target | Reject the rule dataset as structurally inconsistent. |
| Informational property supplied as an independent input | Reject as `invalid_configuration`; return the governing context separately. |
| Rule refers to inapplicable property | Reject the rule dataset. |
| Unsupported schema or dataset version | Refuse to load or resolve and report a compatibility error. |
| Downstream interaction missing | Report in the downstream service; do not alter resource resolution. |

## 15. Illustrative ES examples

These examples reflect the engineering cases discussed during design. They illustrate resolver behaviour; the executable authority remains the validated rule dataset. Complete conditions, source references, effective dates, and canonical targets must be verified and formally approved. Where the current working rules contain an inconsistency, the example does not silently correct it.

### 15.1 ES007 family — redundant `barricaded`

Discussed authoritative behaviour: for Structure `STR005`, when `roofType` is `null`, `barricaded = false` is the enumerated canonical form and `barricaded = true` does not change the engineering result. The current authoritative `es_types` dataset defines that canonical record as `ES007C`.

Conceptual input:

```json
{
  "datasetId": "es_types",
  "resourceType": "es_type",
  "context": {
    "structureId": "STR005"
  },
  "configuration": {
    "roofType": null,
    "barricaded": true
  }
}
```

Conceptual resolution:

```text
No exact match
    ↓
Approved ES007 rule applies when roofType is null
    ↓
barricaded is recorded as redundant
    ↓
Canonical lookup uses barricaded = false
    ↓
Exact lookup identifies ES007C
```

An executable rule must still declare `ES007C` explicitly and include the complete configuration needed for unambiguous matching. Validation must confirm the target remains the exact canonical record. The response retains `barricaded = true` as the submitted value and reports `false` only as the canonical lookup value.

### 15.2 ES013 — non-applicable exposure

Discussed authoritative behaviour: for Structure `STR011`, when `roofType` is `Protective`, exposure properties are represented as `false`; supplied exposure selections do not affect resolution. The current authoritative `es_types` dataset defines that canonical record as `ES013A`.

Conceptual input:

```json
{
  "datasetId": "es_types",
  "resourceType": "es_type",
  "context": {
    "structureId": "STR011"
  },
  "configuration": {
    "roofType": "Protective",
    "exposure": {
      "level": "<supplied-controlled-value>"
    }
  }
}
```

The Structure supplies the informational exposure category. It is shown to the user to explain the meaning of the selectable level but is not posted as an independent selection input.

Conceptual resolution:

```text
No exact match
    ↓
Approved ES013 protective-roof rule applies
    ↓
Exposure properties are recorded as non-applicable
    ↓
Canonical lookup uses the existing authoritative false representation
    ↓
Exact lookup identifies ES013A
```

The discussed intended canonical record is `ES013A`. However, the current RR003/RR004 working entries declare `ES007C`, overlap when both exposure properties are strings, and treat informational `exposure.category` as an input predicate. Those entries must fail target, overlap, and selection-semantics validation until reviewed. This document does not change their mapping. A validated rule may use `any` to combine genuine alternative selectable-input conditions if engineering review confirms that behaviour. The resolver must not convert arbitrary missing or unknown exposure values to `false`.

### 15.3 ES003 family — headwall precedence

The discussed ES003 case concerns Structure `STR001` with `ecmProtectionRating = "PR003"`, `headwall = true`, `barricaded = true`, and `roofType = null`. The current authoritative dataset defines `ES003A`, `ES003B`, and `ES003C`, but none enumerates the dual-true `headwall` and `barricaded` combination.

The clarified engineering direction is that, when both `headwall` and `barricaded` are `true` in this context, the headwall takes precedence. `barricaded` is canonicalised to `false`, producing the existing target `ES003A`. This is represented in the working dataset by RR001 and is an example of `redundant_parameter` canonicalisation.

The rule remains subject to completed governance provenance and cross-dataset validation. In particular, its placeholder `source` and `effectiveFrom` values are not sufficient for a released rule marked `approved`.

### 15.4 Governed undefined outcome

Where an approved engineering case establishes that a valid selection has no defined resource, the rule shall use:

```json
{
  "outcome": {
    "type": "undefined_configuration"
  }
}
```

The service returns `status: "undefined"` with the rule trace and does not attempt to manufacture, approximate, or look up a target. No specific ES or PES mapping is asserted by this conceptual example.

## 16. National tailoring and future extension

National tailoring may eventually require additional or substituted resolution rules. Such capability must preserve the distinction between:

- the baseline NATO authoritative rule set; and
- an explicitly identified national profile or overlay.

A future tailoring design should require profile identity, jurisdiction, version, provenance, approval status, effective dates, and a deterministic precedence policy. Baseline rules must not be edited in place, and every result must disclose which baseline or tailored rule set was used.

No national override mechanism is authorised by this version of the model. It should be designed separately before implementation to avoid silent divergence and preserve interoperability.

Future datasets may use this mechanism when all of the following are true:

- a real configuration-to-resource gap has been demonstrated;
- an explicit canonical resource and engineering equivalence have been approved;
- normal exact matching cannot represent the case cleanly;
- the case fits the constrained condition and outcome model; and
- adding the dataset does not introduce calculation behaviour into resolution.

If a future requirement needs inference, arithmetic, ordered priorities, or extensive rule interaction, it should use a separately governed model rather than expanding this mechanism into a general-purpose engine.

## 17. Governance and change control

Every rule addition, amendment, retirement, or reactivation shall be reviewed as an engineering-data change. The change record shall include:

- the stable rule ID;
- the configuration gap being addressed;
- the approved canonical mapping;
- the authoritative source and engineering rationale;
- affected dataset and resource versions;
- validation and test evidence;
- backwards-compatibility and client-impact assessment;
- approval authority and date; and
- effective and, where applicable, retirement dates.

Rule IDs shall not be reused. A materially changed mapping should be versioned or replaced according to the repository's data-governance policy, with historical traceability retained. Retired rules must not silently disappear where previous calculation or audit records refer to them.

Changes to the JSON Schema, condition vocabulary, outcome vocabulary, matching semantics, or precedence policy are model changes, not routine data edits. They require documentation, compatibility analysis, migration guidance, and an appropriate version increment.

Release governance shall ensure that the governance model, rule data, schemas, validators, resolver, API contract, and tests remain aligned.

## 18. Implementation work products

The initial implementation should produce:

1. `Engineering_Resource_Resolution_Model.md` — this governance and design model.
2. `resource_resolution_rules.schema.json` — the constrained rule-data contract.
3. `resource_resolution_rules.json` — only approved exceptional cases.
4. A dataset registry or explicit equivalent mapping neutral dataset IDs to authoritative repositories and validators.
5. Cross-dataset validation for IDs, references, properties, controlled values, applicability, target existence, overlap, ambiguity, and prohibited content.
6. A pure resolver service with small dataset adapters.
7. Unit, integration, regression, and rule-fixture tests.
8. OpenAPI request, response, and error schemas for engineering resource resolution.
9. Contributor documentation covering purpose, inputs, outputs, dependencies, examples, failure modes, and extension points.
10. Governance records for each approved ES and PES rule.

Implementation should begin with the smallest approved ES/PES rule set. No speculative rules or unused language features should be added for possible future cases.

## 19. Risks and controls

| Risk | Control |
|---|---|
| The mechanism grows into a second engineering rule engine | Constrained `all`/`any` grammar and `equals`/`type_is` vocabulary; no calculation fields, expressions, priorities, or chaining. |
| Application logic becomes authoritative | Store every mapping in validated JSON; prohibit hard-coded engineering branches. |
| Rules hide user input | Preserve submitted and canonical configurations in trace output. |
| Overlapping rules produce unstable results | Build-time overlap validation and runtime fail-closed ambiguity handling. |
| Controlled vocabularies are duplicated | Reference authoritative values and validate them cross-dataset. |
| A canonical target changes or disappears | Cross-dataset release validation, stable IDs, versioned rule data, regression tests. |
| Clients implement divergent behaviour | Resolve server-side and expose explicit outcome semantics through OpenAPI. |
| Informational context becomes an unintended input | Declare selectable properties explicitly; reject `exposure.category` as an independent selection dimension. |
| Undefined is mistaken for a failure | Use an explicit `undefined_configuration` rule outcome and successful API status with traceability. |
| National tailoring obscures the NATO baseline | Separate, identified, versioned overlays with provenance; no tailoring in the baseline rule dataset. |

## 20. Recommended next steps

1. Confirm the neutral identifiers for authoritative datasets and resource types.
2. Define the minimal JSON Schema vocabulary shown conceptually in this document, including recursive `all`/`any` groups, discriminated `equals`/`type_is` predicates, and outcome-specific shapes.
3. Obtain explicit engineering approval for every canonical mapping, beginning with the discussed ES cases and the known PES case.
4. Implement cross-dataset validators before adding executable rules.
5. Implement and test the pure resolver with exact-match-first behaviour.
6. Add the selection/resolution operation and trace contract to OpenAPI.
7. Review national tailoring only as a separate governed design exercise.

## 21. Version history

| Version | Date | Status | Change |
|---|---|---|---|
| 1.1 | 2026-08-10 | Draft | Added `all`/`any` condition groups, explicit `equals` and `type_is` operators, governed undefined outcomes, selectable-versus-informational semantics, expanded validation and API requirements, and observations from the current working rule dataset. |
| 1.0 | 2026-08-10 | Draft | Initial dataset-agnostic governance and design model for explicit engineering resource resolution. |
