import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { toothedWasherModelDefinitionSchema } from "./schema"
export function parseToothedWasherModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "toothedwasher",
    toothedWasherModelDefinitionSchema,
    {
      id: "innerDiameter",
      innerdiameter: "innerDiameter",
      od: "outerDiameter",
      outerdiameter: "outerDiameter",
      t: "thickness",
      thickness: "thickness",
      td: "toothDepth",
      toothdepth: "toothDepth",
    },
  )
}
