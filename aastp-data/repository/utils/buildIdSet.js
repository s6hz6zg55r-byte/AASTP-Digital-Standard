export function buildIdSet(items, name = "Array") {

    if (!Array.isArray(items)) {
        throw new Error(
            `${name} is not an array`
        );
    }
    for (const item of items) {
        if (item.id === undefined) {
            throw new Error(
                `${name} contains an item without an 'id' property`
            );
        }
    }

    return new Set(
        items.map(item => item.id)
    );
}