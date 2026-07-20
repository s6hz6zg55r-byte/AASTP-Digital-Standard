// The purpose of this function is to confirm that all IDs are unique
function validateUniqueIds(items, errors, name = "items") {

    const ids = new Set();

    for (const item of items) {

        if (ids.has(item.id)) {
            errors.push(
                `Duplicate ${name} id '${item.id}'.`
            );
        }

        ids.add(item.id);
    }
}

module.exports = {
    validateUniqueIds
};