export function applyTransformation(
  transformationId,
  value,
  parameters = {}
) {

  switch (transformationId) {

    case "round_up_metre":
      return Math.ceil(value);

    case "round_down_metre":
      return Math.floor(value);

    case "minimum":
      return Math.max(
        value,
        parameters.limit
      );

    default:
      return value;
  }
}