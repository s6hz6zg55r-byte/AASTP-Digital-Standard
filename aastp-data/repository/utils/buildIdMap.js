export function buildIdMap(
    items,
    key = "id", 
    name = "Array") 
    {

    if (!Array.isArray(items)) {
        throw new Error(`${name} is not an array`);
    }
    for (const item of items) {
        if (item[key] === undefined) {
            throw new Error(`${name} contains an item without an '${key}' property`);
        }
    }

    return new Map(
        items.map(item => [
            item[key], 
            item])
    );
}