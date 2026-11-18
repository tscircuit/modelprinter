import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airReliefValveModelDefinitionSchema } from "./schema"

export function parseAirReliefValveModelParams(raw: RawModelprinterParams) {
  return airReliefValveModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airreliefvalve",
      {
        l: "length",
        w: "width",
        h: "height",
        knobod: "knobDiameter",
        gaugeod: "gaugeDiameter",
      },
      { port: "portThread", gaugeport: "gaugePortThread" },
      { gauge: "gauge" },
    ),
  )
}
