function applyTransformations(
    value,
    transformations
) {

    let result = value;

    for (const transform of transformations) {

        switch (transform) {

            case "round_up_metre":
                result = Math.ceil(result);
                break;

            case "round_down_metre":
                result = Math.floor(result);
                break;

            default:
                throw new Error(
                    `Unknown transformation: ${transform}`
                );

        }

    }

    return result;

}

module.exports = {
    applyTransformations
};