# AASTP Knowledge API

## OpenAPI 3.1 Draft Specification (Version 0.1)

```yaml
openapi: 3.1.0

info:
  title: AASTP Knowledge API
  version: 0.1.0
  summary: REST API for accessing the AASTP Knowledge Engine.
  description: >
    The AASTP Knowledge API provides access to the structured
    knowledge base developed from AASTP-1. It exposes reference
    datasets, engineering rules, calculation services and
    traceability information.

  contact:
    name: AASTP Knowledge Project

servers:
  - url: https://api.aastp.org/api/v1
    description: Production

  - url: http://localhost:3000/api/v1
    description: Development

tags:

  - name: Reference Data
  - name: Knowledge
  - name: Calculations
  - name: Validation
  - name: Administration
  - name: Health

paths:

##############################################################################
# HEALTH
##############################################################################

  /health:

    get:

      tags:
        - Health

      summary: API Health Check

      operationId: health

      responses:

        "200":

          description: API available

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/HealthResponse'

##############################################################################
# REFERENCE DATA
##############################################################################

  /hazard-categories:

    get:

      tags:
        - Reference Data

      summary: List Hazard Categories

      operationId: listHazardCategories

      parameters:

        - $ref: '#/components/parameters/Limit'

        - $ref: '#/components/parameters/Offset'

      responses:

        "200":

          description: Hazard Categories

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/HazardCategory'

  /hazard-categories/{id}:

    get:

      tags:
        - Reference Data

      summary: Get Hazard Category

      operationId: getHazardCategory

      parameters:

        - $ref: '#/components/parameters/Id'

      responses:

        "200":

          description: Hazard Category

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/HazardCategory'

        "404":

          $ref: '#/components/responses/NotFound'

##############################################################################

  /pes-types:

    get:

      tags:
        - Reference Data

      summary: List PES Types

      operationId: listPESTypes

      responses:

        "200":

          description: PES Types

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/PESType'

##############################################################################

  /es-types:

    get:

      tags:
        - Reference Data

      summary: List ES Types

      operationId: listESTypes

      responses:

        "200":

          description: ES Types

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/ESType'

##############################################################################

  /effects:

    get:

      tags:
        - Reference Data

      summary: List Effects

      operationId: listEffects

      responses:

        "200":

          description: Effects

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/Effect'

##############################################################################

  /formulae:

    get:

      tags:
        - Reference Data

      summary: List Formulae

      operationId: listFormulae

      responses:

        "200":

          description: Formulae

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/Formula'

##############################################################################

  /distance-rules:

    get:

      tags:
        - Reference Data

      summary: List Distance Rules

      operationId: listDistanceRules

      responses:

        "200":

          description: Distance Rules

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/DistanceRule'

##############################################################################

  /interaction-rules:

    get:

      tags:
        - Reference Data

      summary: List Interaction Rules

      operationId: listInteractionRules

      parameters:

        - name: hazardCategory
          in: query
          schema:
            type: string

        - name: pesType
          in: query
          schema:
            type: string

        - name: esType
          in: query
          schema:
            type: string

      responses:

        "200":

          description: Matching Interaction Rules

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/InteractionRule'

##############################################################################
# KNOWLEDGE
##############################################################################

  /knowledge/interactions:

    post:

      tags:
        - Knowledge

      summary: Determine applicable interaction rule

      operationId: determineInteraction

      requestBody:

        required: true

        content:

          application/json:

            schema:

              $ref: '#/components/schemas/InteractionRequest'

      responses:

        "200":

          description: Interaction identified

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/InteractionResponse'

        "400":

          $ref: '#/components/responses/BadRequest'

##############################################################################

  /knowledge/explain:

    post:

      tags:
        - Knowledge

      summary: Explain engineering decision path

      operationId: explainDecision

      requestBody:

        required: true

        content:

          application/json:

            schema:

              $ref: '#/components/schemas/InteractionRequest'

      responses:

        "200":

          description: Decision trace

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/TraceResponse'

##############################################################################
# CALCULATIONS
##############################################################################

  /calculations/distance:

    post:

      tags:
        - Calculations

      summary: Calculate required quantity distance

      operationId: calculateDistance

      requestBody:

        required: true

        content:

          application/json:

            schema:

              $ref: '#/components/schemas/DistanceRequest'

      responses:

        "200":

          description: Distance calculated

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/DistanceResponse'

        "422":

          $ref: '#/components/responses/CalculationFailed'

##############################################################################

  /calculations/neq:

    post:

      tags:
        - Calculations

      summary: Calculate maximum permitted NEQ

      operationId: calculateNEQ

      requestBody:

        required: true

        content:

          application/json:

            schema:

              $ref: '#/components/schemas/NEQRequest'

      responses:

        "200":

          description: NEQ calculated

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/NEQResponse'

##############################################################################

  /calculations/batch:

    post:

      tags:
        - Calculations

      summary: Batch calculation

      operationId: batchCalculation

      requestBody:

        required: true

        content:

          application/json:

            schema:

              type: array

              items:

                $ref: '#/components/schemas/DistanceRequest'

      responses:

        "200":

          description: Batch results

          content:

            application/json:

              schema:

                type: array

                items:

                  $ref: '#/components/schemas/DistanceResponse'

##############################################################################
# VALIDATION
##############################################################################

  /validation/scenario:

    post:

      tags:
        - Validation

      summary: Validate engineering scenario

      operationId: validateScenario

      requestBody:

        required: true

        content:

          application/json:

            schema:

              $ref: '#/components/schemas/DistanceRequest'

      responses:

        "200":

          description: Validation result

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/ValidationResponse'

##############################################################################
# ADMINISTRATION
##############################################################################

  /versions:

    get:

      tags:
        - Administration

      summary: Supported dataset versions

      operationId: listVersions

      responses:

        "200":

          description: Version information

##############################################################################

components:

  parameters:

    Id:

      name: id
      in: path
      required: true

      schema:
        type: string

    Limit:

      name: limit
      in: query

      schema:
        type: integer
        minimum: 1
        maximum: 500

    Offset:

      name: offset
      in: query

      schema:
        type: integer
        minimum: 0

##############################################################################

  responses:

    BadRequest:

      description: Invalid request

      content:

        application/json:

          schema:

            $ref: '#/components/schemas/ErrorResponse'

    NotFound:

      description: Resource not found

      content:

        application/json:

          schema:

            $ref: '#/components/schemas/ErrorResponse'

    CalculationFailed:

      description: Calculation could not be completed

      content:

        application/json:

          schema:

            $ref: '#/components/schemas/ErrorResponse'

##############################################################################

  schemas:

    HazardCategory:

      type: object

      properties:

        id:
          type: string

        code:
          type: string

        description:
          type: string

    PESType:

      type: object

      properties:

        id:
          type: string

        description:
          type: string

    ESType:

      type: object

      properties:

        id:
          type: string

        description:
          type: string

    Formula:

      type: object

      properties:

        id:
          type: string

        name:
          type: string

    Effect:

      type: object

      properties:

        id:
          type: string

        description:
          type: string

    DistanceRule:

      type: object

      properties:

        id:
          type: string

        formulaId:
          type: string

    InteractionRule:

      type: object

      properties:

        id:
          type: string

        formulaId:
          type: string

        effectId:
          type: string

    InteractionRequest:

      type: object

      required:
        - hazardCategory
        - pesType
        - esType
        - neq

      properties:

        hazardCategory:
          type: string

        pesType:
          type: string

        esType:
          type: string

        neq:
          type: number

        unit:
          type: string
          default: kg

    DistanceRequest:

      allOf:
        - $ref: '#/components/schemas/InteractionRequest'

    NEQRequest:

      type: object

      required:
        - hazardCategory
        - pesType
        - esType
        - distance

      properties:

        hazardCategory:
          type: string

        pesType:
          type: string

        esType:
          type: string

        distance:
          type: number

    InteractionResponse:

      type: object

      properties:

        interactionRule:
          type: string

        formula:
          type: string

        effect:
          type: string

        transformation:
          type: string

    DistanceResponse:

      type: object

      properties:

        distance:
          type: number

        unit:
          type: string

        trace:
          $ref: '#/components/schemas/Trace'

    NEQResponse:

      type: object

      properties:

        neq:
          type: number

        unit:
          type: string

    ValidationResponse:

      type: object

      properties:

        valid:
          type: boolean

        errors:
          type: array

          items:
            type: string

    Trace:

      type: object

      properties:

        datasetVersion:
          type: string

        interactionRule:
          type: string

        formula:
          type: string

        transformation:
          type: string

        decisionSteps:

          type: array

          items:

            type: string

    TraceResponse:

      type: object

      properties:

        trace:

          $ref: '#/components/schemas/Trace'

    HealthResponse:

      type: object

      properties:

        status:
          type: string

        version:
          type: string

    ErrorResponse:

      type: object

      properties:

        success:
          type: boolean
          default: false

        error:

          type: object

          properties:

            code:
              type: string

            message:
              type: string

            details:

              type: array

              items:
                type: string
```

## Planned HTTP Status Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 200  | Successful request               |
| 201  | Resource created (future use)    |
| 204  | Successful request with no body  |
| 400  | Invalid request                  |
| 401  | Authentication required (future) |
| 403  | Forbidden                        |
| 404  | Resource not found               |
| 409  | Version conflict                 |
| 422  | Calculation cannot be completed  |
| 429  | Rate limit exceeded              |
| 500  | Internal server error            |
| 503  | Service unavailable              |

## Planned Application Error Codes

| API Code                 | Description                                |
| ------------------------ | ------------------------------------------ |
| INVALID_REQUEST          | Malformed JSON or schema violation         |
| MISSING_FIELD            | Required field absent                      |
| INVALID_VALUE            | Field value outside permitted limits       |
| UNKNOWN_IDENTIFIER       | Unknown hazard, PES, ES or rule identifier |
| INVALID_COMBINATION      | No valid interaction exists                |
| CALCULATION_FAILED       | No valid engineering solution              |
| DATASET_VERSION_CONFLICT | Dataset version mismatch                   |
| INTERNAL_ERROR           | Unexpected server failure                  |

```
```
