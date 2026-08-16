# AASTP Digital Engineering API — Error Code Registry

| Attribute | Value |
| --- | --- |
| Document status | Draft — normative companion document |
| Registry version | 0.4.0 |
| Related API contract | `API_CONTRACT.md` v0.4.0 |
| Last updated | 2026-08-15 |

## 1. Purpose

This registry is the normative source for public error semantics within the AASTP Digital Engineering API specification suite. It governs HTTP status usage, the common error-response envelope and stable application error codes used to communicate failures predictably to API consumers.

The registry enables clients and external systems to distinguish request, reference, engineering-validation, calculation, data-integrity, service-access and system failures while retaining human-readable messages, structured diagnostics, authoritative source references where applicable and traceability for support and assurance.

The registry may define governed error semantics that are not applicable to every current API operation or MVP capability where those semantics represent credible failure conditions within the intended digital engineering platform. Inclusion of an error code in this registry does not by itself make that error applicable to a particular public operation; applicable errors are identified by the approved API Contract and OpenAPI specification.

This registry does not define authoritative AASTP engineering requirements. Error semantics that represent engineering constraints or applicability decisions must derive from the governed engineering model and applicable authoritative source material.

## 2. Position in the documentation suite

The Error Code Registry forms part of the governed API specification suite. Each normative document has a distinct responsibility and must remain consistent with the others.

| Document | Governs |
|---|---|
| `API_CONTRACT.md` | Governing human-readable specification of public API scope, resources, operations, representations and behaviour. |
| `openapi.yaml` | Normative machine-readable expression of the approved public API contract, including operations, schemas, constraints, responses and examples. |
| `API Design Principles.md` | Cross-version architectural principles governing API design and evolution. |
| `Error Code Registry.md` | HTTP-status usage, common public error behaviour and stable application error semantics. |
| `API Change Management Framework.md` | Proposal, classification, impact assessment, approval, implementation, verification and release of changes to the public API specification suite. |

This registry governs public error semantics. It does not define successful resource or calculation representations, authoritative engineering rules or endpoint behaviour independently of the API Contract.

The API Contract identifies the engineering and operational contexts in which failures may occur. This registry defines the governed public error semantics used to represent those failures. OpenAPI identifies which registry-defined errors apply to each approved operation and expresses the corresponding machine-readable response schemas.

Supporting engineering specifications and assurance artefacts may define domain rules, calculation behaviour, validation or internal failure conditions relevant to API errors, but they do not override this registry for public error-code meaning or HTTP-status usage.

Where normative documents differ or create ambiguity in public error behaviour, implementation must not silently choose an interpretation. The discrepancy must be resolved through the API Change Management Framework before the affected behaviour is approved for release.

## 3. Normative rules

The following rules govern use of this registry:
- Every non-success public API response uses the common error-response envelope defined by this registry.
- Where a stable application error code is defined and applicable to the failure, implementations must use that code rather than create an endpoint-specific or implementation-specific substitute.
- Error-code identifiers are stable. They must not be reused, renumbered or assigned a materially different meaning.
- Human-readable messages and diagnostic detail may be improved provided that the governed meaning of the stable application code does not change.
- HTTP status, application error code, message, diagnostic detail and authority reference must describe the same failure condition consistently.
- Error codes represent governed public failure semantics rather than internal implementation events. The applicable category is determined by which public or engineering governance boundary failed, not merely by which internal component raised the condition.
- A code may remain defined in the registry even where it is not reachable through the current MVP, provided that its failure semantics are sufficiently clear and relevant to foreseeable governed extensions of the platform.
- Inclusion of a code in the registry does not imply that it applies to every API version or operation. The approved API Contract and OpenAPI specification determine applicability to specific public operations.
- `409 Conflict` is reserved and is not used merely because engineering resources, orientations, configurations or calculation inputs are incompatible or unsupported.
- Structurally valid requests that fail governed engineering validation, resource resolution or calculation applicability use `422 Unprocessable Entity` with the applicable registry-defined engineering error code.
- Failures caused by the authoritative data, release-integrity boundary or governed engineering model must not be misrepresented as client errors merely because they become visible while processing a client request.
- Validation status and release authentication status are distinct assurance concepts. Errors concerning service-access authentication or authorisation must not be used to represent failure of engineering release authentication, and vice versa.
- Error responses must not expose internal stack traces, repository paths, resolver state, credentials, cryptographic secrets or other implementation details outside the approved public contract.
- A response must never represent an unsupported, undefined, unresolved or failed engineering calculation as a successful engineering result.
- Changes to stable error semantics, category boundaries, HTTP mappings or public error-envelope behaviour must be governed through the API Change Management Framework before release.

## 4. HTTP status policy

HTTP status codes provide the protocol-level classification of a non-success response. Stable application error codes provide the more precise governed failure semantics defined by this registry.

HTTP status selection is determined by the nature of the failure at the public API boundary. Multiple application error codes may therefore map to the same HTTP status, and the same underlying engineering object may contribute to different error categories depending on which governance boundary failed.

Status codes defined or reserved by this registry are not necessarily applicable to every API version or operation. The approved API Contract and OpenAPI specification identify the responses applicable to each public operation.

| HTTP status | Use | Registry codes |
|---|---|---|
| `200 OK` | Successful reference-data retrieval or engineering calculation. | None; success representations are governed by the API Contract and OpenAPI specification. |
| `201 Created` | Reserved for a future explicitly contracted operation that creates a resource. | None currently defined. |
| `204 No Content` | Reserved for a future explicitly contracted operation that succeeds without a response body. | None currently defined. |
| `400 Bad Request` | The request cannot be processed because its syntax, structure, required fields, field types, request properties or query parameters do not conform to the public contract. | `REQ` |
| `401 Unauthorized` | Service-access authentication is required, missing or invalid. It does not describe the authentication status of the served engineering data release. | `AUTH` codes mapped to `401`. |
| `403 Forbidden` | The caller has been authenticated for service access but is not authorised to perform the requested operation. | `AUTH` codes mapped to `403`. |
| `404 Not Found` | A resource explicitly referenced or requested through the applicable public operation does not exist in the relevant governed context. | Applicable `REF` codes. |
| `405 Method Not Allowed` | The HTTP method is not supported for the requested public resource or operation. | None currently defined. |
| `406 Not Acceptable` | The requested response representation is not supported by the applicable public contract. | None currently defined. |
| `409 Conflict` | Reserved for a future explicitly governed conflict condition. It is not used merely because engineering resources, orientations, configurations or inputs are incompatible, unresolved or unsupported. | None currently defined. |
| `415 Unsupported Media Type` | The request body uses a media type not supported by the applicable public operation. | None currently defined. |
| `422 Unprocessable Entity` | The request is structurally valid but cannot proceed because it fails governed engineering validation, authoritative resource resolution or calculation applicability. | Applicable engineering-validation, resource-resolution or calculation-applicability codes. |
| `429 Too Many Requests` | The caller has exceeded an applicable service rate limit. | None currently defined. |
| `500 Internal Server Error` | Processing failed because of a non-transient calculation-execution, data-integrity or unexpected internal service failure. | Applicable `CAL`, `DAT`, `SYS` codes. |
| `503 Service Unavailable` | The service or engineering data required to fulfil the operation is temporarily unavailable and the request may succeed later without correction by the client. | Applicable `DAT`, `SYS` codes. |

## 5. Common error-response envelope

All non-success public API responses use UTF-8 JSON and the common error-response envelope defined by this registry. The envelope separates:
- `error` — the governed failure semantics and diagnostics for the specific request; and
- `metadata` — the API, data-release and assurance provenance applicable to the response.

Members described as optional are omitted when they do not apply.

```json
{
  "error": {
    "httpStatus": 422,
    "code": "governed-error-code",
    "message": "Human-readable explanation of the failure.",
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
    "generatedAt": "2026-08-15T00:00:00Z"
  }
}
```
| Member | Required | Meaning |
|---|---|---|
| `error.httpStatus` | Yes | HTTP status repeated in the response body for consumer convenience. It must match the actual HTTP response status. |
| `error.code` | Conditional | Stable application error code from this registry. Required where an applicable registry code is defined for the failure. May be omitted only where this registry explicitly permits a code-less HTTP response. |
| `error.message` | Yes | Human-readable explanation of the failure. It must be consistent with the governed code meaning and must not expose sensitive implementation details. |
| `error.details` | No | Array of actionable field-level or request-level diagnostics that add occurrence-specific context without redefining the stable error semantics. |
| `error.authority` | Conditional | Included where the failure represents an AASTP-derived engineering constraint, applicability decision or other governed domain condition and an approved source reference is available. Omitted for purely technical failures. |
| `error.traceId` | Yes | Correlation identifier used to associate the client-visible error with authorised operational diagnostics and audit evidence. |
| `metadata` | Yes | Common API, data-release, validation, authentication and response-generation provenance defined by the API Contract. |

`error.authority` uses the approved public source-reference representation defined by the API Contract and OpenAPI specification. The following structure is conceptual until that representation is finalised:

```json
{
  "standard": "AASTP-1",
  "edition": "approved-edition-identifier",
  "reference": "authoritative-source-reference"
}
```
Authority references must be supported by governed engineering source material and must never be fabricated by API implementation code.

`error.details` may explain this occurrence, but must not change the stable meaning of `error.code`.

Common metadata fields are populated only from assurance state that the service can establish reliably. Where a failure prevents a normally required provenance value from being established, the response must follow the exceptional metadata behaviour defined by the API Contract/OpenAPI schema for that failure and must not fabricate a value.

## 6. Error-code categories

### 6.1 Request errors (`REQ`)

Request errors indicate that the submitted public representation does not conform to the syntactic or structural requirements of the applicable API operation. These normally return `400 Bad Request`.

`REQ` errors concern the form of the request rather than the engineering validity of the submitted context. A request that is structurally valid but fails authoritative engineering validation, resource resolution or calculation applicability uses the applicable engineering error category instead.

Request errors may arise from malformed JSON, missing required properties, invalid JSON data types, unsupported request properties, invalid parameter representations or other violations of the published request contract.

| Code | Description |
| --- | --- |
| `REQ001` | Missing required field. |
| `REQ002` | Invalid field type. |
| `REQ003` | Invalid JSON. |
| `REQ004` | Unknown request property. |
| `REQ005` | Invalid path, header or other request parameter value. |
| `REQ006` | Invalid API-governed enumeration value. |
| `REQ007` | Unsupported API version. |
| `REQ008` | Invalid or unknown query parameter. |

`REQ006` applies only where the permissible values form part of the public API contract itself. It does not authorise OpenAPI or implementation code to duplicate controlled engineering vocabularies whose authority remains the governed data release. A value governed by authoritative engineering data uses the applicable reference or engineering-validation error instead.

`REQ` codes must not be used merely because an engineering configuration is invalid. Once a request conforms to the published structural contract, failures of engineering applicability, resource resolution or calculation processing are governed by the applicable engineering error category.

### 6.2 Reference errors (`REF`)

Reference errors indicate that an explicit identifier supplied through the applicable public contract, governed extension or externally provided engineering context does not resolve to the referenced governed object.

These normally return `404 Not Found` where the missing reference is attributable to the submitted request or explicitly selected governed context.

`REF` errors describe failure of an explicit reference supplied at the public or governed integration boundary. They must not be used where an internally derived reference is missing because of a defect in the authoritative data, validated release, tailoring package or service implementation; those conditions use the applicable `DAT` error where the governed reference or data is defective, or the applicable `SYS` error where resolution fails because of the running service or operational environment.

Inclusion of a reference code in this registry does not imply that the referenced object is exposed as a standalone public MVP resource. Some reference codes are retained for future governed capabilities where the corresponding object may be referenced explicitly.

| Code | Description |
|---|---|
| `REF001` | Referenced PES Type not found. |
| `REF002` | Referenced Exposed Site Type not found. |
| `REF003` | Referenced Hazard Category not found. |
| `REF004` | Referenced effect not found. |
| `REF005` | Referenced Structure not found. |
| `REF006` | Referenced protection level not found. |
| `REF007` | Referenced orientation type not found. |
| `REF008` | Referenced distance rule not found. |
| `REF009` | Referenced formula not found. |
| `REF010` | Referenced constraint not found. |
| `REF011` | Referenced transformation not found. |

A missing governed object does not automatically produce a `REF` error. `REF` applies only where the missing identifier was explicitly supplied through the applicable public or governed integration contract. Where the service derives or follows a governed reference internally and that referenced object is unexpectedly absent, the failure indicates a data-integrity condition and must use the applicable `DAT` error.

### 6.3 Engineering validation and resource-resolution errors (VAL)

`VAL` errors indicate that a request conforms to the public request structure but fails a governed engineering-validation or authoritative resource-resolution requirement. These normally return `422 Unprocessable Entity`.

`VAL` errors apply after request syntax and structural requirements have been satisfied. They represent failures in the engineering meaning, applicability, completeness, compatibility or authoritative resolution of the submitted engineering context.

Resource resolution forms part of the validation boundary. A complete Structure-led PES or Exposed Site configuration that cannot be authoritatively resolved therefore uses the applicable `VAL` error rather than a separate resolution-error family.

`VAL` errors must distinguish, where useful to consumers, between:
- invalid engineering values;
- missing engineering properties required by the selected context;
- invalid property combinations;
- invalid orientation or quantity-basis selections;
- explicitly undefined configurations;
- configurations for which no authoritative resource or applicable Resource Resolution Rule exists; and
- other governed relationship or applicability failures that prevent the request from becoming a validated and resolved engineering context.

`VAL` must not be used where the request merely contains malformed syntax or violates the published request structure; those failures use `REQ`. It must also not be used where a required governed object is unexpectedly absent because of a defect in the validated data or service; those failures use the applicable data-integrity or system category.

| Code | Description |
|---|---|
| `VAL001` | Authoritative calculation input is below the permitted range. |
| `VAL002` | Authoritative calculation input is above the permitted range. |
| `VAL003` | Invalid PES orientation. |
| `VAL004` | Invalid Exposed Site orientation. |
| `VAL005` | Unsupported quantity basis. |
| `VAL006` | Orientation is not supported by the selected Structure. |
| `VAL007` | Required engineering property is missing for the selected context. |
| `VAL008` | Invalid engineering property combination. |
| `VAL009` | Engineering configuration is explicitly undefined by the authoritative resource-resolution model. |
| `VAL010` | Engineering configuration could not be resolved to an authoritative resource. |
| `VAL011` | Engineering property is not applicable to the selected Structure or engineering context. |

### 6.4 Calculation applicability errors (`ASM`)

`ASM` is the stable legacy prefix for governed calculation-applicability errors. Retention of the prefix does not require the public API or Engineering Service to use “assessment” as an architectural or operation name.

`ASM` errors indicate that the submitted request has passed applicable structural validation, engineering validation and authoritative resource resolution, but the governed engineering model determines that no requested calculation can be performed for the resolved engineering context. These normally return `422 Unprocessable Entity`.

`ASM` errors represent governed engineering applicability outcomes rather than calculation-engine failures. Where the applicability decision derives from authoritative AASTP content, the response includes the applicable error.authority.

`ASM` must not be used where calculation processing should have been possible but fails because governed data, a formula, a rule or another required internal object is unexpectedly absent or defective. Those conditions use the applicable `DAT` or `CAL` error.

| Code | Description |
|---|---|
| `ASM001` | No applicable interaction rule exists for the resolved engineering context. |
| `ASM002` | Effect is not supported for the selected Hazard Category. |
| `ASM003` | Hazard Category is not supported by the applicable interaction. |
| `ASM004` | No applicable distance rule exists for the engineering context. |
| `ASM005` | No applicable distance-rule branch exists within the supported domain of the applicable distance rule. |
| `ASM006` | No approved formula is defined for the applicable calculation context. |
| `ASM007` | No approved inverse calculation method is available for the submitted authoritative input. |
| `ASM008` | Calculation is not applicable. |
| `ASM009` | No QD is required. |
| `ASM010` | Calculation is prohibited by an authoritative constraint. |
| `ASM011` | Authoritative calculation input is outside the supported domain of the applicable engineering rule. |

`ASM005` applies only where absence of an applicable branch is a governed applicability outcome. An unexpected gap in branch coverage where the governed data requires complete coverage is a data-integrity failure. `ASM005` must not be used merely because the submitted calculation input lies outside the overall supported domain of the rule; that condition uses `ASM011`.

`ASM007` applies where the submitted authoritative calculation input requires inverse calculation processing but the governed engineering model provides no approved inverse method. Calculation direction is determined from the authoritative input and is not independently selected by the client.

`ASM006` applies where no approved formula is defined for an otherwise valid calculation context. It does not apply where governed data references a formula that is unexpectedly missing or defective.

`ASM008` is the general calculation-applicability code and is used only where no more specific `ASM` code describes the governed condition.

### 6.5 Calculation execution errors (`CAL`)

`CAL` errors indicate that a request has passed applicable structural validation, engineering validation, authoritative resource resolution and calculation-applicability processing, and that an approved calculation path has been established, but execution of that calculation could not be completed successfully.

These normally return `500 Internal Server Error`. A failed calculation must not return a partial, intermediate or plausible-looking engineering value as a successful result.

`CAL` errors represent failures during execution of an otherwise applicable governed calculation. They must not be used where the authoritative engineering model determines that no calculation applies; those conditions use `ASM`. They must also not be used merely because a governed data object required for calculation is missing, structurally invalid or internally inconsistent; those conditions use the applicable `DAT` error.

Where execution fails, the service must fail closed and preserve sufficient diagnostic information for authorised investigation through the applicable trace identifier without exposing internal implementation details through the public response.

| Code | Description |
|---|---|
| `CAL001` | Governed formula evaluation failed. |
| `CAL002` | Mathematical domain error occurred during calculation execution. |
| `CAL003` | Division by zero occurred during calculation execution. |
| `CAL004` | Numeric overflow occurred during calculation execution. |
| `CAL005` | Governed transformation failed during calculation execution. |
| `CAL006` | Resolved calculation coefficient is invalid for execution. |
| `CAL007` | Governed calculation expression could not be evaluated. |
| `CAL008` | Calculation engine failure. |

`CAL` errors apply only after an approved calculation path has been established. A governed determination that no calculation applies uses the applicable `ASM` error.

A missing, malformed or internally inconsistent formula, coefficient, transformation or other calculation object within the governed data release uses the applicable `DAT` error where the condition represents a failure of the data-integrity or validation boundary.

`CAL002` represents an unexpected mathematical-domain failure during execution. Where the authoritative calculation input is valid but lies outside the explicitly supported domain of the applicable engineering rule, `ASM011` applies instead.

`CAL006` applies to an execution-time coefficient condition that could not reasonably be identified as a static data-integrity failure before calculation. A malformed, missing or intrinsically invalid coefficient in the governed data release uses the applicable `DAT` error.

`CAL007` applies where an otherwise governed calculation expression cannot be evaluated during execution. Where the expression itself is malformed or invalid within the governed data release and should have been rejected by release validation, the condition is a data-integrity failure.

`CAL008` is the general calculation-execution error and is used only where no more specific `CAL` code represents the failure.

### 6.6 Data-integrity errors (`DAT`)

`DAT` errors indicate that the governed engineering data, data-release boundary or associated release-integrity state is missing, inconsistent, invalid or otherwise unable to support the requested operation.

These failures are not attributable to a structurally or engineering-valid client request. They normally return `500 Internal Server Error` where the governed data is present but defective, or `503 Service Unavailable` where the required governed release cannot presently be established or made available.

A production deployment should normally prevent `DAT` failures through release validation, integrity checks and controlled publication. The existence of those controls does not eliminate the need for governed failure behaviour where an integrity condition is nevertheless detected at runtime.

`DAT` must not be used merely because a client explicitly references an object that does not exist; that condition uses the applicable `REF` error. Conversely, where the service follows an internally governed reference that should exist and the referenced object is unexpectedly absent, the condition is a data-integrity failure.

`DAT` errors must fail closed. A service must not continue processing against a partial, inconsistent, mismatched or unverified engineering release in order to produce a plausible result.

| Code | Description |
|---|---|
| `DAT001` | Duplicate governed identifier detected in the data release. |
| `DAT002` | Broken internal reference detected in governed engineering data. |
| `DAT003` | Prohibited or unresolved circular reference detected in governed engineering data. |
| `DAT004` | Declared data-release version does not match the loaded governed release. |
| `DAT005` | Required governed data release is missing. |
| `DAT006` | Governed data release does not conform to the required data schema. |
| `DAT007` | Governed data release is corrupt or fails required integrity checks. |
| `DAT008` | Governed data release could not be initialised for service use. |

`500 Internal Server Error` applies where the governed data is available but invalid, inconsistent or defective.

`503 Service Unavailable` applies where the required governed release or data service cannot presently be established or accessed and the request may succeed later without correction by the client.

A release being `unauthenticated` does not itself constitute a `DAT` error where the applicable deployment permits validated but unauthenticated data. A release-authentication failure becomes an error only where the applicable governed deployment or release policy requires successful authentication before serving.

Runtime detection of a `DAT` condition may indicate that an upstream release validator, integrity check or publication control failed to prevent an invalid release from entering service. The API error reports the runtime condition; it does not replace the underlying assurance investigation.

### 6.7 System errors (`SYS`)

`SYS` errors indicate an unexpected failure of the API service, runtime environment, supporting infrastructure or operational service boundary that is not attributable to the client request, governed engineering data or calculation execution.

These return `500 Internal Server Error` where the failure is non-transient, or `503 Service Unavailable` where the service is temporarily unable to fulfil otherwise valid requests.

`SYS` errors must remain distinct from:
- `DAT` errors, which represent failures of governed engineering data or the data-release integrity boundary;
- `CAL` errors, which occur during execution of an otherwise applicable governed calculation; and
- `AUTH` errors, which represent service-access authentication or authorisation failures.

`SYS` is the appropriate category only where the failure is primarily attributable to the running service or its operational environment rather than to authoritative engineering content.

| Code | Description |
|---|---|
| `SYS001` | Unexpected service exception. |
| `SYS002` | Reserved; previous meaning superseded by applicable `DAT` error. |
| `SYS003` | Engineering API service temporarily unavailable. |
| `SYS004` | Service or deployment configuration error. |
| `SYS005` | Service operation timed out. |
| `SYS006` | Required operational logging or audit recording failed. |

`SYS001` is the general unexpected-service fallback and is used only where no more specific governed error code applies.

`SYS002` is reserved to preserve identifier stability. Its previous meaning, validated data release unavailable, is now governed by the applicable `DAT` error and must not be reused for a different failure.

`SYS003` represents unavailability of the running service or operational platform. Unavailability or invalidity of the governed engineering data uses the applicable `DAT` error instead.

`SYS004` refers only to service or deployment configuration. Invalid client-supplied engineering configurations use the applicable `REQ` or `VAL` error.

`SYS006` is used only where required operational or security logging cannot be established and the applicable deployment policy requires the service to fail rather than continue. Non-critical logging failures must not alter valid engineering processing or results.

### 6.8 Authentication and authorisation errors (`AUTH`)

`AUTH` errors represent failures of client authentication or authorisation at the service-access boundary.

Client authentication and authorisation are not required for the initial public MVP unless imposed by the deployment environment. Where such controls are enabled, `AUTH` codes provide the governed public error semantics for determining whether a caller may access the requested API operation.

`AUTH` errors are separate from engineering release authentication. The `authenticationStatus` reported in response metadata describes whether the served engineering data release has been authenticated through the applicable release-authentication process. It does not describe the identity or permissions of the caller.

`AUTH` codes must therefore not be used to represent:
- an unauthenticated AASTP data release;
- failure of release-signature verification;
- missing custodian approval evidence;
- engineering validation failure;
- data-integrity failure; or
- national-tailoring approval or authentication state.

Such conditions use the applicable governed assurance, data-integrity or future release-authentication semantics established for those capabilities.

| Code | Description | HTTP status |
|---|---|---|
| `AUTH001` | Service-access authentication is required. | `401` |
| `AUTH002` | Supplied service-access credentials are invalid. | `401` |
| `AUTH003` | Authenticated caller is not authorised to perform the requested operation. | `403` |
| `AUTH004` | Supplied service-access authentication token has expired. | `401` |

## 7. Implementation and OpenAPI requirements

The Error Code Registry defines the governed public failure semantics of the Engineering API. The OpenAPI specification and service implementation must express and implement those semantics consistently without redefining them.

### 7.1 OpenAPI representation

The OpenAPI 3.1 specification must identify every non-success response applicable to each approved public operation.

For each applicable non-success response, OpenAPI must define:
- the HTTP status;
- the common error-response envelope;
- the registry-defined error code or codes that may be returned;
- any operation-specific diagnostic-detail representation permitted by the public contract; and
- examples where they materially improve consumer understanding.

OpenAPI must reference reusable common error schemas wherever practical rather than independently redefining the error envelope for individual operations.

OpenAPI must not create error codes, alter registry-defined meanings or introduce operation-specific substitutes for governed registry codes.

Inclusion of an error code in this registry does not require it to appear against every operation. Only errors applicable to the approved operation are included in that operation's OpenAPI responses.

### 7.2 HTTP status and error-code consistency

The HTTP status returned by the service must be consistent with the applicable registry-defined error semantics.

`error.httpStatus` must match the actual HTTP response status.

Where multiple registry codes may use the same HTTP status, the stable application error code provides the authoritative public distinction between those failure conditions.

Implementations must not change HTTP status solely because an internal component represents or raises the failure differently. Status selection is governed by the failure at the public API boundary.

### 7.3 Error-code selection

Implementations must select the most specific applicable registry-defined error code.

General fallback codes such as `ASM008`, `CAL008` and `SYS001` must be used only where no more specific governed code describes the detected failure.

Error-code selection must reflect the governance boundary that failed rather than merely the software component in which the condition was detected.

A single failure condition must not be represented simultaneously by competing public error codes. Where multiple internal failures contribute to a request failure, the public response must identify the governed failure condition that determines the operation outcome. Additional safe diagnostic information may be included in `error.details`.

### 7.4 Error messages and diagnostic detail

`error.message` must provide a concise human-readable explanation consistent with the stable meaning of `error.code`.

`error.details` may provide occurrence-specific diagnostics, including affected request fields or engineering selections, where doing so assists the consumer in understanding or correcting the failure.

Messages and diagnostic details must not:
- redefine or materially extend the stable meaning of the error code;
- expose internal exceptions, stack traces, repository paths, resolver state or implementation-specific object structures;
- expose credentials, cryptographic material or other protected information; or
- disclose governed information that is not approved for exposure through the public API.

Internal diagnostic information required for engineering assurance, support or investigation must be associated with the request through `error.traceId` rather than exposed directly to the consumer.

### 7.5 Engineering authority

Errors representing authoritative engineering constraints, applicability decisions or other governed AASTP-derived outcomes include `error.authority` where an approved authoritative source reference is available.

Authority references must use the approved public source-reference representation and must be derived from governed engineering source information. API implementation code must not fabricate, infer or independently maintain authoritative source references.

Purely technical request, calculation-engine, data-platform or system failures do not require an engineering authority reference unless the specific failure also represents a governed engineering decision.

### 7.6 Response metadata and assurance provenance

The common metadata requirements defined by the API Contract apply to error responses.

Error responses expose the assurance provenance that the service can establish reliably, including the applicable API version, data version, validation status, release authentication status and response-generation time.

Metadata must describe the actual assurance state applicable to the failed operation. The service must not fabricate a provenance value merely to satisfy the normal response shape.

Where the failure itself prevents a normally required metadata value from being established, the response must follow the exceptional metadata behaviour defined by the API Contract and OpenAPI schema.

Service-access authentication state must not be substituted for engineering release `authenticationStatus`, and engineering release authentication state must not be represented using `AUTH` error semantics.

### 7.7 Fail-closed behaviour

Implementations must fail closed where a condition prevents the service from establishing a valid, applicable and sufficiently assured engineering result.

A failed, unsupported, undefined or unresolved calculation must not be represented as a successful numeric engineering result.

The service must not:
- substitute another engineering resource without governed resolution authority;
- substitute a different formula, rule, constraint or transformation because the required object is unavailable;
- continue calculation against engineering data known to be invalid, inconsistent or corrupt;
- convert a non-numeric governed engineering outcome into an arbitrary numeric value; or
- return an intermediate or partially calculated value as though it were an authoritative result.

### 7.8 Logging, traceability and operational diagnostics

Each public error response includes a `traceId` capable of correlating the client-visible failure with authorised operational diagnostics.

Internal logging should preserve sufficient information to support:
- investigation of service failures;
- engineering-assurance investigation of `DAT` conditions;
- calculation-failure diagnosis;
- security and access-control investigation where applicable; and
- verification that the correct public error semantic was returned.

Operational diagnostics must remain separate from the public response and must be protected according to the applicable deployment security and logging policy.

Failure of non-critical diagnostic logging must not alter an otherwise valid engineering result. Where required operational or security logging is mandatory for continued processing, failure is handled using the applicable governed system error.

### 7.9 Verification and testing

Every registry code implemented by a public operation must have verification evidence demonstrating that:
- the intended failure condition produces the correct stable application error code;
- the correct HTTP status is returned;
- the response conforms to the common error-response schema;
- `error.httpStatus` matches the protocol response;
- applicable metadata and authority information are correct;
- prohibited internal information is not exposed; and
- adjacent failure conditions are not incorrectly mapped to the same semantic where the registry distinguishes them.

Boundary testing should specifically verify distinctions between neighbouring error categories, including `REQ`/`VAL`, `REF`/`DAT`, `VAL`/`ASM`, `ASM`/`CAL`, `ASM`/`DAT`, `CAL`/`DAT`, and `DAT`/`SYS`.

Tests must be updated when registry semantics, operation applicability, OpenAPI mappings or implementation behaviour change.

### 7.10 Change control

New error codes, changes to stable error semantics, category-boundary changes, HTTP-status mapping changes, reserved-code changes and modifications to the common error-response envelope are governed API changes.

Such changes require:
- a documented update to this registry;
- impact assessment under the API Change Management Framework;
- reconciliation with the API Contract;
- corresponding OpenAPI changes;
- implementation changes where applicable;
- verification and regression testing; and
- inclusion in the applicable specification-suite release history.

A reserved or retired error-code identifier must not be reassigned to a materially different failure condition.

## 8. Change history

| Date | Registry version | Change | Author / approval |
| --- | --- | --- | --- |
| 2026-08-15 | 0.4.0 | Reconciled with API Contract v0.4.0 and the wider API governance suite; clarified error-category boundaries and HTTP status policy; expanded validation, resource-resolution, calculation-applicability, data-integrity, system and authentication semantics; added new governed error conditions and reserved superseded codes; aligned the common error envelope with validation and release-authentication provenance; and expanded OpenAPI, implementation, fail-closed, traceability, verification and change-control requirements. | Draft |
| 2026-08-10 | 0.3.0 | Aligned with `API_CONTRACT.md` v0.3.1 and Engineering Calculation Model v0.2.0: recognised the full governance suite, clarified that `REQ006` is retained without duplicating controlled engineering vocabularies, and confirmed `ASM007` remains applicable to an unsupported inverse calculation determined by the submitted input. | Draft |
| 2026-08-09 | 0.2.0 | Revised to align with `API_CONTRACT.md` v0.2.0 and API Design Principles v0.2.0: adopted the common error envelope, made `422` the status for invalid engineering relationships and applicability failures, reserved `409`, adopted Hazard Category terminology, and clarified the documentation-suite roles. | Draft |
| Pre-2026-08-09 | Earlier draft | Initial HTTP-status and error-code registry. | Draft |
