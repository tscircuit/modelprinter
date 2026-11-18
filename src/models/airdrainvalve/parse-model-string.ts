import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airDrainValveModelDefinitionSchema } from "./schema"

export function parseAirDrainValveModelParams(raw: RawModelprinterParams) {
  return airDrainValveModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airdrainvalve",
      { l: "length", wingw: "wingWidth", hexaf: "hexAcrossFlats" },
      { thread: "thread" },
      { wing: "wing" },
    ),
  )
}
