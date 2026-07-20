function buildIdMap(items, name = "Array") {

    if (!Array.isArray(items)) {
        throw new Error(`${name} is not an array`);
    }

    return new Map(
        items.map(item => [item.id, item])
    );

}

module.exports = {
    buildIdMap
};