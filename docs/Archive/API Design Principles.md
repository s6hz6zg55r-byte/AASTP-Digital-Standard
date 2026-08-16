# API Design Principles

## 1. Purpose

This document defines the architectural principles governing the design and evolution of the AASTP REST API. These principles ensure that API remains consistent, predictable, maintainable and backwards compatible across future editions of AASTP.

## 2. Scope

This document will apply to:

- REST API
- Reference Data endpoints
- Assessment endpoints
- Future chapters
- External integrations

It does not address:

- Internal JavaScript implementation
- Repository implementation
- JSON schema design
- Database implementation

## 3. Design Philosophy

### Principle 1
__The API represents the AASTP domain, not the software implementation.__
The public interface shoul expose concepts such as:

- PES Types
- ES Types
- Hazard Divisions
- Effects
- Structures
- Assessments

It should never expose implementation concepts such as:

- Repositories
- Validators
- Internal filenames

### Principle 2
__The JSON data layer is the autthoritative representation of AASTP reference data.__

The API does not create its own data model. It exposes the authoritative JSON.

### Principle 3
__The API is read-only except where calculations are requested.__

Reference Data - `GET`
Assessment - `POST`

Nothing else:
- No editing
- No deleting
- No creating

## 4. Resource Design
### Use nouns
Good:
```
/pes-types
/es-types
/effects
```
Bad:
```
/getEffects
/listHazards
/findPes
```
### Use plural resources
Good:
```
/effects
/hazards
/constraints
```
Single resource
```
/effects/EFF001
```
### Hierarchy
Keep URIs shallow.
Good:
```
/hazards
/effects
/formulas
```
Avoid:
```
/reference/chapter1/tables/formulas/list
```

### 4.1 Filtering and query parameters
The following rules are to be applied when structuring queries
- Query parameters are camelCase
- Multiple filters are ANDed
- Unknown parameters return REQ008
- Filters never change resource structure

Examples include
```text
GET /distance-rules
```
```text
GET /distance-rules?hazard=1.1
```
```text
GET /effects?active=true
```
```text
GET /pes-types?structure=ECM
```

## 5. HTTP Method Characteristics
The purpose of the various HTTP methods are:
|Method|Purpose | Idempotent | Purpose |
|------|------|------|------|
| GET | Retrieve reference data | Yes | Retrieve reference data |
| POST | Submit assessment | Expected to be functionally deterministic | Submit an assessment request |

Assessment operations do not modify the underlying AASTP datasets. For identical requests against he same dataset version, implementations should return identical results.

## 6. Resource Identifiers
Identifiers:
- are stable
- never reused
- never renumbered
- never derived from display names
For example, `PES001` remains `PES001` forever. Even if the name changes.

## 7. Versioning
The API version shall reside within commands. This will support backwards compatability in the event of API versioning.
Minor, backwards-compatable additions do not require a URI version change.

For example:
```
/api/v1/
```
rather than
```
/api/
```
Therefore, a major change will become:
```
/api/v2/
```
This will ensure that changes never break exisiting clients.

## 8. Response Format
All API responses shall conform to a consistent response structure defined by the OpenAPI Specification.

## 9. Error Handling
Every HTTP response shall include an appropriate HTTP status code (defined in HTTP_CODES.md).
These codes will identify if any errors have been generated as a result of a request.

## 10. Traceability
Every response originating from the AASTP standard should preserve sufficient provenance to allow the originating rule or reference to be identified.
For example:
```json
{
    "source": {
        "standard":"AASTP-1",
        "edition":"Edition D Version 1",
        "reference":"Annex 1-A Table 2"
    }
}
```

## 11. Compatability
The following rules shall be applied as API versions are released:
- Never remove fields
- Never change IDs
- Prefer adding fields
- Mark deprecated fields
- Preserve behaviour

## 12. Performance
The following performance principles should be adopted:
- Reference data should be cacheable
- Assessments are not cacheable
- Responses are to remain deterministic

## 13. Security
Security principles may develop over time. Initially:
- No authentication required for reference data
- Assessment endpoints may require authentication in the future

## 14. Documentation
Every endpoint description is to include:
- Summary
- Description
- Parameters
- Response
- Examples
- Errors
- OpenAPI schema

## 15. Future Extension
New functionality should be introduced by ading resources rather than modifying the behaviour of existing resources wherever practical.

## 16. Relationship to the AASTP Standards
- The API is not the standard
- The JSON data layer is the digital representation of the standard
- The API is mechanism for exposing that representation
- The API should never introduce behaviour that contradicts the published AASTP rules
- Where a discrepancy exists, the published AASTP standard remains authoritative until a revised digital edition is approved