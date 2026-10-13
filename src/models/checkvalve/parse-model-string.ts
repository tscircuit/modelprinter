import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { checkValveModelDefinitionSchema } from "./schema"
export function parseCheckValveModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "checkvalve",
    checkValveModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      endod: "endDiameter",
      af: "hexAcrossFlats",
      nutl: "nutLength",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      enddiameter: "endDiameter",
      hexacrossflats: "hexAcrossFlats",
      nutlength: "nutLength",
    },
  )
}
