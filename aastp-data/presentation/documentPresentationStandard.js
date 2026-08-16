/**
 * =============================================================================
 * Document Presentation Standard
 * =============================================================================
 *
 * Name
 * ----
 * AASTP Document Presentation Standard
 *
 * Purpose
 * -------
 * Defines the common presentation standard used by all generated engineering
 * documents within the AASTP digital platform.
 *
 * The standard provides a renderer-independent definition of document
 * presentation semantics. Individual renderers (PDF, Markdown, HTML, etc.)
 * interpret this standard according to the capabilities of their output format.
 *
 * Scope
 * -----
 * This standard governs:
 *
 * • Page layout
 * • Typography
 * • Colour palette
 * • Spacing
 * • Borders
 * • Tables
 * • Lists
 * • Navigation
 * • Headers and footers
 * • Reusable document components
 *
 * It deliberately does NOT define document content.
 *
 * Design Principles
 * -----------------
 * • Renderer independent
 * • Semantic rather than implementation based
 * • Single source of truth
 * • Extensible
 * • Backwards compatible wherever practical
 *
 * Dependencies
 * ------------
 * None
 *
 * Future Extension Points
 * -----------------------
 * • Accessibility profiles
 * • Organisation branding
 * • Additional output profiles
 * • Internationalisation
 *
 * =============================================================================
 */

export const DOCUMENT_PRESENTATION_STANDARD = Object.freeze({

    /*
    ============================================================================
    Identity
    ============================================================================
    */
    identity: {
        name:
            "AASTP Document Presentation Standard",
        version:
            "1.0.0",
        description:
            "Common presentation standard for generated AASTP engineering documents."
    },

    /*
    ===============================================================================
    Document
    ===============================================================================
    */

    document: {
        title:
            "AASTP Validation Report",
        author:
            "AASTP Digital Engineering Platform",
        creator:
            "AASTP Document Generation Service",
        producer:
            "AASTP Document Generation Service",
        subject:
            "Validation Report",
        language:
            "en"
    },

    /*
    ============================================================================
    Page Layout
    ============================================================================
    */
    page: {
        size:
            "A4",
        orientation:
            "portrait",
        margins: {
            top: 25,
            right: 25,
            bottom: 25,
            left: 25
        }
    },

    /*
    ============================================================================
    Typography
    ============================================================================
    */
    typography: {
        fonts: {
            primary:
                "Helvetica",
            monospace:
                "Courier"
        },
        styles: {
            title: {
                font:
                    "primary",
                size:
                    24,
                bold:
                    true,
                colour:
                    "primary",
                spacing:
                    "section",
                alignment:
                    "center"
            },
            heading1: {
                font:
                    "primary",
                size:
                    18,
                bold:
                    true
            },
            heading2: {
                font:
                    "primary",
                size:
                    16,
                bold:
                    true
            },
            heading3: {
                font:
                    "primary",
                size:
                    14,
                bold:
                    true
            },
            body: {
                font:
                    "primary",
                size:
                    11,
                bold:
                    false,
                colour:
                    "secondary",
                spacing:
                    "paragraph",
                alignment:
                    "left"
            },
            monospace: {
                font:
                    "monospace",
                size:
                    10,
                bold:
                    false
            }
        }
    },

    /*
    ============================================================================
    Colour Palette
    ============================================================================
    */
    palette: {
        primary:
            "#003366",
        secondary:
            "#4F4F4F",
        border:
            "#C8C8C8",
        pass:
            "#2E7D32",
        warning:
            "#F9A825",
        error:
            "#C62828",
        hyperlink:
            "#1565C0"
    },

    /*
    ===============================================================================
    Spacing
    ===============================================================================
    */
    spacing: {
        paragraph: 12,
        section: 18,
        heading: 10,
        table: 8,
        list: 6,
        page: 24

    },

    /*
    ===============================================================================
    Borders
    ===============================================================================
    */
    borders: {
        standard: {
            width: 1,
            colour: "border"
        },
        emphasis: {
            width: 2,
            colour: "primary"
        }
    },

    /*
    ===============================================================================
    Tables
    ===============================================================================
    */
    tables: {
        border: "standard",
        borders: {
            outer: true,
            horizontal: true,
            vertical: false
        },
        alignment: {
            text: "left",
            number: "right",
            status: "center"
        },
        rowHeight: 24,
        padding: {        
            horizontal:
                4,
            vertical:
                3
        },
        alternateRows:
            true,
        repeatHeader:
            true,
        header: {
            style:
                "heading3",
            background:
                "primary",
            foreground:
                "#FFFFFF"
        },
        body: {
            style:
                "body"
        },
        caption: {
            style:
                "heading3"
        },
        typography: {
            header: {
                style: "body",
                size: 9,
                bold: true
            },
            body: {
                style: "body",
                size: 8
            }
        }
    },

    /*
    ===============================================================================
    Lists
    ===============================================================================
    */

    lists: {
        unordered: {
            indent:
                20,
            bullet:
                "•"         
            },
        ordered: {           
            indent:
            20
        }

    },

    /*
    ===============================================================================
    Navigation
    ===============================================================================
    */
    navigation: {
        bookmarks:
            true,
        internalLinks:
            true,
        backToTopLinks:
            true,
        tableOfContents:
            false
    },

    /*
    ===============================================================================
    Headers
    ===============================================================================
    */
    pageHeaders: {
        enabled:
            true,
        style:
            "body",
        content: {
            left:
                "AASTP-1",
            centre:
                "",
            right:
                ""
        }
    },

    /*
    ===============================================================================
    Footers
    ===============================================================================
    */
    pageFooters: {
        enabled:
            true,
        style:
            "body",
        pageNumbers:
            true,
        content: {
            left:
                "",
            centre:
                "",
            right:
                ""
        }
    },

})
