export function findInteraction(interactionData, request) {

  const interactions =
    Object.values(interactionData.interactionRules);

  return interactions.find((rule) => {

    const pesMatch =
      rule.conditions.pesType.includes(request.pes);

    const esMatch =
      rule.conditions.esType.includes(request.es);

    const pesOrientationMatch =
      rule.conditions.orientation.pes ===
      request.orientation.pes;

    const esOrientationMatch =
      rule.conditions.orientation.es ===
      request.orientation.es;

    const hdMatch =
      rule.hazardDivisions[
        request.hazardDivision
      ];

    return (
      pesMatch &&
      esMatch &&
      pesOrientationMatch &&
      esOrientationMatch &&
      hdMatch
    );
  });
}