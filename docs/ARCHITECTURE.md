### Repository Architecture

The AASTP Project is organised as a collection of independent but related components, each with a clearly defined responsibility. The repository structure is designed to separate the AASTP knowledge base from the software that consumes it, allowing each component to evolve independently while maintaining a single authoritative source of truth.

```
AASTP-PROJECT/
│
├── README.md
├── docs/
│
├── aastp-api/
├── aastp-data/
└── aastp-demo/
```

The repository follows the principle that **every file has one obvious home**. Each component owns a specific responsibility and should not duplicate the responsibilities of another component.

---

### Repository Responsibilities

#### `aastp-data`

The `aastp-data` project is the authoritative implementation of the AASTP knowledge base.

It contains:

* JSON datasets
* JSON Schemas
* Validation tools
* Data documentation
* Traceability information
* Standards implementation guidance

No application logic should be contained within this project. Its sole purpose is to represent and validate the AASTP data model.

#### `aastp-api`

The `aastp-api` project provides a REST interface to the knowledge contained within `aastp-data`.

It contains:

* API source code
* Rule evaluation engine
* Formula engine
* Service layer
* API documentation
* Automated API tests
* Deployment configuration

The API is a consumer of the data layer and must not contain duplicated copies of the knowledge base.

#### `aastp-demo`

The `aastp-demo` project provides reference client applications demonstrating how external software can interact with the API.

This project exists solely as an example consumer and must not implement independent business logic that duplicates the API.

---

### Dependency Rules

Dependencies flow in one direction only.

```
aastp-data
      │
      ▼
aastp-api
      │
      ▼
aastp-demo
```

The following dependency rules apply:

* `aastp-data` has no dependency on any other project.
* `aastp-api` depends on `aastp-data`.
* `aastp-demo` depends on `aastp-api`.
* Circular dependencies between projects are not permitted.

This ensures the knowledge base remains independent of any implementation technology.

---

### Documentation Structure

Documentation is maintained alongside the component it describes.

| Location               | Purpose                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| `README.md`            | Project overview and navigation                                               |
| `docs/`                | Project-wide architecture, roadmap and governance                             |
| `aastp-api/docs/`      | API documentation, OpenAPI specification, deployment and operational guidance |
| `aastp-data/docs/`     | Data model, schema documentation, validation rules and standards maintenance  |
| `aastp-demo/README.md` | Demonstrator setup and usage                                                  |

---

### Repository Principles

The following principles govern the organisation of the repository.

1. **Single Source of Truth**
   Every dataset, schema and validator exists in only one location within the repository.

2. **Separation of Responsibilities**
   Data, application logic and user interfaces are maintained as independent components with clearly defined responsibilities.

3. **Stable Public Interfaces**
   Components communicate through well-defined interfaces. Internal implementation details should not leak across project boundaries.

4. **Documentation Lives with the Code**
   Documentation should be maintained alongside the component it describes to ensure it remains accurate and versioned with the implementation.

5. **Extensibility**
   The repository structure should support future editions of AASTP, additional APIs, alternative client applications and new tooling without requiring significant reorganisation.

6. **Maintainability**
   Repository structure should remain stable over time. New functionality should fit naturally within the existing architecture rather than requiring structural changes.

---

I would make one small addition that reflects the vision you've described for this project over many conversations:

> **Mission Statement**
>
> The AASTP Project aims to provide an open, traceable and standards-compliant digital implementation of the AASTP explosive safety regulations. By separating the knowledge base from its software implementations, the project enables governments, software developers and standards custodians to build interoperable applications from a common, authoritative source of truth.

That statement explains not just *what* the repository contains, but *why* it exists. I think it sets the tone for the entire project and will help future contributors understand the broader objective beyond the code itself.
