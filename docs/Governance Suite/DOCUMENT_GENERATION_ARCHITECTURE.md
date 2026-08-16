# Document Generation Architecture

## 1. Purpose

The Document Generation Architecture defines the services, standards and components responsible for transforming governed AASTP engineering data into consistent, professionally formatted engineering documents.

The objective is to ensure that all generated publications originate directly from the authoritative digital data model rather than manually maintained documents.

This architecture provides a sustainable publishing capability capable of producing engineering assurance reports, technical references, interaction tables and future nationally tailored publications from a single authoritative source.

---

# 2. Design Principles

The Document Generation Architecture is governed by the following principles.

## 2.1 Single Source of Truth

Documents shall always be generated from the authoritative digital model.

Generated documents shall never become the authoritative engineering source.

---

## 2.2 Separation of Responsibilities

Document content, presentation and rendering shall remain separate concerns.

- Document Models define **what** information is presented.
- The Document Presentation Standard defines **how** information is presented.
- Renderers determine **how the presentation standard is implemented** for a particular output format.

---

## 2.3 Renderer Independence

The same Document Model shall be capable of producing multiple output formats without modification.

Examples include:

- PDF
- Markdown
- HTML
- Future document formats

---

## 2.4 Consistent Presentation

All generated documents shall conform to the Document Presentation Standard.

Individual documents shall not implement their own formatting rules.

---

## 2.5 Extensibility

The architecture shall support future document types without modification to existing document generators wherever practical.

---

# 3. Architecture

```
Engineering Data
        │
        ▼
Document Models
        │
        ▼
Document Presentation Standard
        │
        ▼
Renderers
        │
        ├───────────────┐
        │               │
        ▼               ▼
Markdown            PDF
                        │
                        ▼
                 Future Formats
```

---

# 4. Components

## 4.1 Engineering Data

The authoritative engineering data held within the JSON repositories.

This includes:

- Engineering repositories
- Knowledge layer
- Validation results
- Calculated engineering outputs

Engineering data remains the single source of truth.

---

## 4.2 Document Models

Document Models determine the information to be presented.

A Document Model contains no presentation logic.

Examples include:

- Validation Report
- Interaction Tables
- Formula Reference
- Hazard Category Catalogue
- Data Dictionary
- Engineering Handbook

---

## 4.3 Document Presentation Standard

The Document Presentation Standard defines the common presentation rules used by every generated document.

It governs:

- Page layout
- Typography
- Colour palette
- Tables
- Lists
- Navigation
- Page headers
- Page footers
- Reusable document components
- Output profiles

The standard is renderer independent.

---

## 4.4 Renderers

Renderers transform Document Models into output formats.

Examples include:

- Markdown Renderer
- PDF Renderer
- HTML Renderer (future)

Renderers shall consume the Document Presentation Standard.

They shall not define document presentation.

---

# 5. Presentation Hierarchy

The presentation system follows a layered architecture.

```
Presentation Resources
        │
        ▼
Presentation Elements
        │
        ▼
Document Components
        │
        ▼
Document Models
        │
        ▼
Renderers
```

## 5.1 Presentation Resources

Reusable presentation resources.

Examples:

- Typography
- Colour Palette
- Page Layout

---

## 5.2 Presentation Elements

Presentation behaviours constructed from resources.

Examples:

- Tables
- Lists
- Navigation
- Page Headers
- Page Footers

---

## 5.3 Document Components

Reusable engineering document building blocks.

Examples:

- Cover Page
- Report Summary
- Validation Level Summary
- Statistics Table
- Warning List
- Error List
- Appendix
- Revision History

---

## 5.4 Document Models

Complete engineering documents assembled from reusable components.

---

## 5.5 Renderers

Implement the Document Presentation Standard for specific output formats.

---

# 6. Current Document Models

The following document models are currently planned.

| Document Model | Status |
|----------------|--------|
| Validation Report | In Development |
| Interaction Tables | Planned |
| Formula Reference | Planned |
| Hazard Category Catalogue | Planned |
| Engineering Handbook | Planned |
| Data Dictionary | Planned |
| National Publications | Planned |

---

# 7. Repository Responsibilities

## aastp-data

Responsible for:

- Engineering data
- Validation framework
- Engineering assurance reports
- Document models supporting engineering assurance

---

## aastp-api

Responsible for:

- Document generation services
- Publication generation
- REST API integration
- User-facing document production

---

## aastp-common (planned)

Responsible for:

- Shared presentation standards
- Shared rendering utilities
- Common document components
- Shared engineering constants where appropriate

---

# 8. Future Development

Future enhancements are expected to include:

- PDF bookmark generation
- Automatic table of contents generation
- Accessibility profiles
- National branding profiles
- Internationalisation
- Multiple document themes
- Digitally signed engineering publications
- Revision history generation
- Automated publication pipelines

---

# 9. Relationship to the AASTP Platform

The Document Generation Architecture forms one component of the wider digital platform.

```
Knowledge Layer
        │
        ▼
JSON Data Layer
        │
        ▼
Validation Framework
        │
        ▼
Engineering Assurance
        │
        ├──────────────┐
        │              │
        ▼              ▼
Validation Reports   REST API
                           │
                           ▼
             Document Generation Architecture
                           │
                           ▼
               Engineering Publications
```

The architecture ensures that all generated engineering publications originate from validated, governed engineering data while maintaining complete separation between engineering content, presentation standards and rendering implementation.