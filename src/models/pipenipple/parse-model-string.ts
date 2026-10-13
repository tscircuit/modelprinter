import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeNippleModelDefinitionSchema } from "./schema"
export function parsePipeNippleModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipenipple",
    pipeNippleModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      threadl: "threadLength",
      shoulder: "shoulderDiameter",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      threadlength: "threadLength",
      shoulderdiameter: "shoulderDiameter",
    },
  )
}
