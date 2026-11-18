import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airGripperModelDefinitionSchema } from "./schema"

export function parseAirGripperModelParams(raw: RawModelprinterParams) {
  return airGripperModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airgripper",
      {
        l: "length",
        w: "width",
        h: "height",
        jaws: "jaws",
        jawtravel: "jawTravel",
        opening: "opening",
        jawangle: "jawAngle",
        travel: "travel",
      },
      { port: "portThread" },
      { parallel: ["style", "parallel"], angular: ["style", "angular"] },
    ),
  )
}
