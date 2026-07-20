function buildIdSet(items, name = "Array") {

    if (!Array.isArray(items)) {
        throw new Error(
            `${name} is not an array`
        );
    }
    return new Set(
        items.map(item => item.id)
    );
}

module.exports = {
    buildIdSet
};