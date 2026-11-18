import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { rotaryAirActuatorModelDefinitionSchema } from "./schema"

export function parseRotaryAirActuatorModelParams(raw: RawModelprinterParams) {
  return rotaryAirActuatorModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "rotaryairactuator",
      {
        l: "length",
        w: "width",
        h: "height",
        shaftd: "shaftDiameter",
        shaftl: "shaftLength",
        travel: "travel",
        angle: "angle",
      },
      { port: "portThread" },
      {
        rackandpinion: ["mechanism", "rackandpinion"],
        vane: ["mechanism", "vane"],
      },
    ),
  )
}
