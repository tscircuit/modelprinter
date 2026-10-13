import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeUnionModelDefinitionSchema } from "./schema"
export function parsePipeUnionModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipeunion",
    pipeUnionModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      af: "nutAcrossFlats",
      nutl: "nutLength",
      endod: "endDiameter",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      nutacrossflats: "nutAcrossFlats",
      nutlength: "nutLength",
      enddiameter: "endDiameter",
    },
  )
}
