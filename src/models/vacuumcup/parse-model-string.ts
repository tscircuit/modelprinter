import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { vacuumCupModelDefinitionSchema } from "./schema"

export function parseVacuumCupModelParams(raw: RawModelprinterParams) {
  return vacuumCupModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "vacuumcup",
      { od: "outerDiameter", h: "height", bellows: "bellows" },
      { thread: "thread" },
      {},
    ),
  )
}
