import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { flatWasherModelDefinitionSchema } from "./schema"
export function parseFlatWasherModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "flatwasher",
    flatWasherModelDefinitionSchema,
    {
      id: "innerDiameter",
      innerdiameter: "innerDiameter",
      od: "outerDiameter",
      outerdiameter: "outerDiameter",
      t: "thickness",
      thickness: "thickness",
    },
  )
}
