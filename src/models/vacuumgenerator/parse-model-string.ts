import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { vacuumGeneratorModelDefinitionSchema } from "./schema"

export function parseVacuumGeneratorModelParams(raw: RawModelprinterParams) {
  return vacuumGeneratorModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "vacuumgenerator",
      { l: "length", w: "width", h: "height", tubeod: "tubeOuterDiameter" },
      { exhaust: "exhaustThread" },
      {
        venturi: "venturi",
        inline: ["shape", "inline"],
        block: ["shape", "block"],
      },
    ),
  )
}
