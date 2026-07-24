# HTTP Status Codes

These communicate the broad outcome of the request.

| HTTP Code | Meaning | When Used |
|-----------|---------|-----------|
| **200 OK** | Request successful | Successful GET or POST calculation |
| **201 Created** | Resource created | Reserved for future administrative APIs |
| **204 No Content** | Successful with no body | Rarely required |
| **400 Bad Request** | Invalid request syntax or parameters | Missing fields, invalid types |
| **404 Not Found** | Requested resource does not exist | Unknown PES, Effect, Formula etc. |
| **405 Method Not Allowed** | Unsupported HTTP method | PUT, PATCH, DELETE etc. |
| **406 Not Acceptable** | Unsupported response format | Future-proofing |
| **409 Conflict** | Conflicting request state | Reserved |
| **415 Unsupported Media Type** | Content-Type incorrect | Non-JSON request |
| **422 Unprocessable Entity** | Valid request but invalid assessment | Unsupported interaction, impossible combination |
| **429 Too Many Requests** | Rate limiting | Future |
| **500 Internal Server Error** | Unexpected server failure | Bug or exception |
| **503 Service Unavailable** | API temporarily unavailable | Maintenance |

---

# Standard Success Response

There are two types of responses:
- GET response
- POST response

### GET Response
A GET is a request for reference data from the JSON files.
Examples include:
- invalid JSON
- misisng parameter
- unknown endpoint
- internal exception

A GET response will have the following format:
```json
{
  "data": {
    "httpStatus": 400,
    "code": "REQ001",
    "message": "Missing required field 'neq'.",
    "traceId": "8db0fd9d"
  }
}
```
---

# Standard Error Response

There are two types of errors:
- Technical Errors
- Domain Errors

### Technical Errors
These indicate that something is wrong with the request or the server.
Examples include:
- invalid JSON
- misisng parameter
- unknown endpoint
- internal exception

Technical errors return the following strucuture:
```json
{
  "error": {
    "httpStatus": 400,
    "code": "REQ001",
    "message": "Missing required field 'neq'.",
    "traceId": "8db0fd9d"
  }
}
```
### Domain Errors
These indicate that the request conflicts with the AASTP rules.
Examples include:
- unsupported interaction
- no distance rule
- prohibited combination
- invalid hazard/effect pairing
As these errors relate to the standard, the error return will identify the authority of the error.
Domain errors return the following structure:

```json
{
  "error": {
    "httpStatus": 422,
    "code": "ASM001",
    "message": "No interaction rule found.",
    "authority": {
      "standard": "AASTP-1",
      "edition": "Edition D Version 1",
      "reference": "Annex I, Table 5"
    },
    "traceId": "8db0fd9d"
  }
}
```

Notice that:

- `code` is stable
- `message` is for humans
- `authority` contains structured information relating to the error
- `traceId` is a unique id that helps debugging

---

# Error Code Categories

Error codes are grouped by prefix.

## Request Errors (REQ)

The API request itself is malformed.

| Code | Description |
|------|-------------|
| REQ001 | Missing required field |
| REQ002 | Invalid field type |
| REQ003 | Invalid JSON |
| REQ004 | Unknown request property |
| REQ005 | Invalid parameter value |
| REQ006 | Invalid enumeration value |
| REQ007 | Unsupported API version |
| REQ008 | Invalid query parameter |

---

## Reference Errors (REF)

Referenced objects do not exist.

| Code | Description |
|------|-------------|
| REF001 | Unknown PES Type |
| REF002 | Unknown ES Type |
| REF003 | Unknown Hazard Division |
| REF004 | Unknown Effect |
| REF005 | Unknown Structure |
| REF006 | Unknown Protection Level |
| REF007 | Unknown Orientation Type |
| REF008 | Unknown Distance Rule |
| REF009 | Unknown Formula |
| REF010 | Unknown Constraint |
| REF011 | Unknown Transformation |

---

## Validation Errors (VAL)

The request is valid JSON but fails business validation.

| Code | Description |
|------|-------------|
| VAL001 | NEQ must be greater than zero |
| VAL002 | NEQ exceeds supported range |
| VAL003 | Invalid PES orientation |
| VAL004 | Invalid ES orientation |
| VAL005 | Unsupported quantity basis |
| VAL006 | Orientation not supported by structure |
| VAL007 | Required property missing |
| VAL008 | Invalid property combination |

---

## Assessment Errors (ASM)

The request is valid, but no assessment can be performed.

| Code | Description |
|------|-------------|
| ASM001 | No interaction rule found |
| ASM002 | Effect not supported for hazard |
| ASM003 | Hazard not supported by interaction |
| ASM004 | No applicable distance rule |
| ASM005 | Distance rule branch not found |
| ASM006 | Formula not available |
| ASM007 | Reverse calculation unsupported |
| ASM008 | Assessment not applicable |
| ASM009 | No QD required |
| ASM010 | Assessment prohibited by constraint |

---

## Calculation Errors (CAL)

Something failed during calculation.

| Code | Description |
|------|-------------|
| CAL001 | Formula evaluation failed |
| CAL002 | Mathematical domain error |
| CAL003 | Divide by zero |
| CAL004 | Numeric overflow |
| CAL005 | Transformation failed |
| CAL006 | Invalid coefficient |
| CAL007 | Invalid expression |
| CAL008 | Calculation engine failure |

---

## Data Integrity Errors (DAT)

These should almost never occur in production. They indicate problems with the underlying datasets rather than the client's request.

| Code | Description |
|------|-------------|
| DAT001 | Duplicate identifier |
| DAT002 | Broken reference |
| DAT003 | Circular reference |
| DAT004 | Dataset version mismatch |
| DAT005 | Missing mandatory dataset |
| DAT006 | Invalid schema |
| DAT007 | Corrupt dataset |
| DAT008 | Repository initialisation failed |

---

## Internal Errors (SYS)

Unexpected server failures.

| Code | Description |
|------|-------------|
| SYS001 | Unexpected exception |
| SYS002 | Repository unavailable |
| SYS003 | Service unavailable |
| SYS004 | Configuration error |
| SYS005 | Timeout |
| SYS006 | Logging failure |

---

## Authentication Errors (AUTH)

Unexpected authentication failures.

| Code | Description |
|------|-------------|
| AUTH001 | Authentication required |
| AUTH002 | Invalid credentials |
| AUTH003 | Access denied |
| AUTH004 | Token expired |

---