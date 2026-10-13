import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { springPinModelDefinitionSchema } from "./schema"
export function parseSpringPinModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "springpin",
    springPinModelDefinitionSchema,
    {
      od: "outerDiameter",
      outerdiameter: "outerDiameter",
      l: "length",
      length: "length",
      wt: "wallThickness",
      wallthickness: "wallThickness",
      g: "gapWidth",
      gapwidth: "gapWidth",
    },
  )
}
