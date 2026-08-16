export function formatStatus(status) {

    switch (status) {

        case "PASS":
            return "✓ PASS";

        case "WARNING":
            return "⚠ WARNING";

        case "FAIL":
            return "✗ FAIL";

        default:
            return status;

    }

}