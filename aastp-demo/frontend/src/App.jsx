import { useState } from "react";
import pesData from "./data/pes_types.json";
import esData from "./data/es_types.json";
import hazardData from "./data/hazard_classes.json";
import interactionData from "./data/interaction.json";
import { findInteraction } from "./ruleEngine";
import distanceRuleData from "./data/distance_rules.json";
import { resolveDistanceRule } from "./distanceRuleResolver";
import formulaData from "./data/formulas.json";
import { evaluateFormula } from "./formulaEvaluator";
import { applyTransformation } from "./transformationEngine";

function App() {
const pesTypes = Object.values(pesData.pesTypes);
const [selectedPES, setSelectedPES] = useState("");

const esTypes = esData.es_types;
const [selectedES, setSelectedES] = useState("");

const hazardClasses = Object.entries(hazardData.hazardClasses);
const [selectedHD, setSelectedHD] = useState("");

const [neq, setNeq] = useState("");
const [request, setRequest] = useState(null);

const [pesOrientation, setPesOrientation] = useState("");
const [esOrientation, setEsOrientation] = useState("");

const [distanceRuleResult, setDistanceRuleResult] = useState(null);
const [calculatedDistance, setCalculatedDistance] = useState(null);

const [interactionResult, setInteractionResult] = useState(null);
const [resolvedRule, setResolvedRule] = useState(null);

const [finalDistance, setFinalDistance] = useState(null);

const selectedHazard =
  selectedHD
    ? hazardData.hazardClasses[selectedHD]
    : null;

const handleCalculate = () => {

  const calculationRequest = {
    pes: selectedPES,
    es: selectedES,
    hazardDivision: selectedHD,
    neq: Number(neq),

    orientation: {
      pes: pesOrientation,
      es: esOrientation
    }
  };

  setRequest(calculationRequest);

  const interaction =
    findInteraction(
      interactionData,
      calculationRequest
    );

  setInteractionResult(interaction);
  if (interaction) {
    const hdRule =
      interaction.hazardDivisions[
      calculationRequest.hazardDivision
      ];
    console.log("HD Rule:", hdRule);
    setDistanceRuleResult(hdRule);
    const resolved =
      resolveDistanceRule(
        distanceRuleData,
        hdRule.distanceRule,
        calculationRequest.neq
      );
    setResolvedRule(resolved);
    if (resolved) {
      const distance = evaluateFormula(
        formulaData, resolved.branch.formula,
        {
          coefficient: resolved.branch.parameters.coefficient,
          neq: calculationRequest.neq
        }
      );
      setCalculatedDistance(distance);
      let transformedDistance = distance;
      resolved.rule.transformations.forEach(
      (transformation) => {
        transformedDistance = applyTransformation(
          transformation, transformedDistance
        );
      }
);

setFinalDistance(
  transformedDistance
);
    }
    console.log("Resolved:", resolved);
  } else {
    setDistanceRuleResult(null);
  }
};

    return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AASTP-1 Digital Demonstrator</h1>

      <h2>Calculator</h2>

      <div>
        <label>PES Type</label>
        <br />
        <select
          value={selectedPES}
          onChange={(e) => setSelectedPES(e.target.value)}
          >
          <option value="">Select PES</option>

          {pesTypes.map((pes) => (
            <option key={pes.id} value={pes.id}>
            {pes.family} ({pes.id})
            </option>
          ))}
        </select>
        <p>Selected PES: {selectedPES || "None"}</p>
        <select
          value={pesOrientation}
          onChange={(e) => setPesOrientation(e.target.value)}
        >
          <option value="">Select Orientation</option>
          <option value="front">Front</option>
          <option value="side">Side</option>
          <option value="rear">Rear</option>
        </select>
      </div>

      <br />

      <div>
        <select
          value={selectedES}
          onChange={(e) => setSelectedES(e.target.value)}
          >
          <option value="">Select ES</option>

          {esTypes.map((es) => (
            <option key={es.id} value={es.id}>
              {es.name}
            </option>
          ))}
        </select>
        <p>Selected ES: {selectedES || "None"}</p>
        <select
          value={esOrientation}
          onChange={(e) => setEsOrientation(e.target.value)}
        >
          <option value="">Select Orientation</option>
          <option value="front">Front</option>
          <option value="side">Side</option>
          <option value="rear">Rear</option>
        </select>
      </div>

      <br />

      <div>
        <label>Hazard Division</label>
        <br />
        <select
          value={selectedHD}
          onChange={(e) => setSelectedHD(e.target.value)}
        >
          <option value="">Select Hazard Class</option>

          {hazardClasses.map(([id, hd]) => (
            <option key={id} value={id}>
              {id} - {hd.name}
            </option>
          ))}
        </select>
        <p>Selected Hazard Class: {selectedHD || "None"}</p>
        {selectedHazard && (
          <div>
            <h3>Hazard Class Details</h3>

            <p>
              <strong>Name:</strong> {selectedHazard.name}
            </p>

            <p>
              <strong>Description:</strong>
                {" "}
                {selectedHazard.description}
            </p>

            <p>
              <strong>Effects:</strong>
              {" "}
              {selectedHazard.effects.join(", ")}
            </p>
          </div>
        )}
      </div>

      <br />

      <div>
        <label>NEQ (kg)</label>
        <br />
        <input
          type="number"
          value={neq}
          onChange={(e) => setNeq(e.target.value)}
          placeholder="Enter NEQ"
        />
      </div>

      <br />

      <button onClick={handleCalculate}>
        Calculate
      </button>
      <hr />

      <h2>Result</h2>

      <p>Required Distance: {" "}
        {finalDistance !== null
        ? `${finalDistance} m`
        : "-- m"
        }
      </p>

      <h2>Decision Trace</h2>

      <p>Interaction: --</p>
      {interactionResult ? (
      <div>
        <h3>Interaction Found</h3>

        <p>
          <strong>ID:</strong> {interactionResult.id}
        </p>

        <p>
          <strong>Source:</strong>
          {" "}
          Table {interactionResult.source.reference.table}
        </p>

        <p>
          <strong>Column:</strong>
          {" "}
          {interactionResult.source.reference.column}
        </p>
      </div>
      ) : (
        <p>No matching interaction found.</p>
      )}
      
      {distanceRuleResult && (
        <div>
        <h3>Distance Rule</h3>

        <p>
          <strong>Rule:</strong>
          {" "}
          {distanceRuleResult.distanceRule}
        </p>

        <p>
          <strong>Input Basis:</strong>
          {" "}
          {distanceRuleResult.inputBasis}
        </p>
        </div>
      )}
      {resolvedRule && (
        <div>

        <h3>Resolved Calculation</h3>

        <p>
          <strong>Rule:</strong>
          {" "}
          {resolvedRule.rule.id}
        </p>

        <p>
          <strong>Branch:</strong>
          {" "}
          {resolvedRule.branch.id}
        </p>

        <p>
          <strong>Formula:</strong>
          {" "}
          {resolvedRule.branch.formula}
        </p>

        <p>
          <strong>Coefficient:</strong>
          {" "}
          {resolvedRule.branch.parameters.coefficient}
        </p>

  </div>
)}
{calculatedDistance !== null && (
  <div>

    <h3>Calculated Distance</h3>

    <p>
      <strong>Raw Distance:</strong>
      {" "}
      {calculatedDistance.toFixed(2)} m
    </p>

  </div>
)}

{resolvedRule && (
  <div>

    <h3>Transformations</h3>

    <ul>
      {resolvedRule.rule.transformations.map(
        (transformation) => (
          <li key={transformation}>
            {transformation}
          </li>
        )
      )}
    </ul>

  </div>
)}

{finalDistance !== null && (
  <div>

    <h3>Final Distance</h3>

    <p>
      <strong>Distance:</strong>
      {" "}
      {finalDistance} m
    </p>

  </div>
)}

{resolvedRule && (
  <div>

    <h3>Source Reference</h3>

    <p>
      <strong>Table:</strong>
      {" "}
      {resolvedRule.rule.source.reference.Table}
    </p>

    <p>
      <strong>Row:</strong>
      {" "}
      {resolvedRule.rule.source.reference.Row}
    </p>

  </div>
)}
    </div>
  );
}
export default App;