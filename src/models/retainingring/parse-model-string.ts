import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { retainingRingModelDefinitionSchema } from "./schema"
export function parseRetainingRingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "retainingring",
    retainingRingModelDefinitionSchema,
    {
      id: "innerDiameter",
      innerdiameter: "innerDiameter",
      od: "outerDiameter",
      outerdiameter: "outerDiameter",
      t: "thickness",
      thickness: "thickness",
      g: "gapWidth",
      gapwidth: "gapWidth",
      ld: "lugDiameter",
      lugdiameter: "lugDiameter",
      hol: "holeDiameter",
      holediameter: "holeDiameter",
    },
  )
}
