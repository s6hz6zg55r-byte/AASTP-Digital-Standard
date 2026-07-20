export function evaluateFormula(
  formulaData,
  formulaId,
  parameters
) {

  const formula =
    formulaData.formulas[formulaId];

  if (!formula) {
    return null;
  }

  switch (formulaId) {

    case "cube_root":
      return (
        parameters.coefficient *
        Math.cbrt(parameters.neq)
      );

    case "cube_root_squared":
      return (
        parameters.coefficient *
        Math.pow(
          parameters.neq,
          2 / 3
        )
      );

    case "square_root":
      return (
        parameters.coefficient *
        Math.sqrt(parameters.neq)
      );

    case "constant_distance":
      return parameters.distance;

    default:
      return null;
  }
}