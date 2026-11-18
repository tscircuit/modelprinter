import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airFlowControlValveModelDefinitionSchema } from "./schema"

export function parseAirFlowControlValveModelParams(
  raw: RawModelprinterParams,
) {
  return airFlowControlValveModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airflowcontrolvalve",
      { tubeod: "tubeOuterDiameter", l: "length", w: "width", h: "height" },
      { thread: "thread" },
      {
        elbow: ["shape", "elbow"],
        straight: ["shape", "straight"],
        meterin: ["metering", "meterin"],
        meterout: ["metering", "meterout"],
      },
    ),
  )
}
