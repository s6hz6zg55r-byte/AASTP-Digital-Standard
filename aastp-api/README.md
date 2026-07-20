# AASTP API

## Overview

The AASTP API provides a REST interface to the AASTP knowledge engine.

It exposes explosive safety data, interaction rules, calculation services, and traceable engineering decisions through a standards-based HTTP API.

The API is designed to support:

- Web applications
- Excel add-ins
- Desktop applications
- Mobile applications
- National implementations
- Research projects

The project separates the **knowledge engine** from the REST interface so that the underlying calculation engine can be reused by multiple client applications.

---

## Project Status

Current version:

> Development (v0.1)

This project is under active development.

---

## Project Structure

```
AASTP-API/

src/
│
├── app.js
├── server.js
│
├── data/
├── engine/
├── middleware/
├── routes/
├── services/
└── utils/

tests/

docs/

package.json
README.md
```

---

## Prerequisites

- Node.js 24+
- npm

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

---

## Running the API

Development mode

```bash
npm run dev
```

Production mode

```bash
npm start
```

---

## Current Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | / | API status |

Additional endpoints will be introduced as the project develops.

---

## Design Principles

The project follows several architectural principles:

- Separation of data, services and calculation engine
- Traceable engineering calculations
- JSON-based knowledge representation
- RESTful API design
- Modular architecture
- Standards-first development

---

## Future Features

Planned capabilities include:

- Hazard category lookup
- PES lookup
- ES lookup
- Distance calculations
- NEQ calculations
- Rule explanations
- Validation services
- Swagger/OpenAPI documentation
- Excel integration
- React demonstration application

---

## Licence

Licence to be determined.

---

## Author

Chris Harbert