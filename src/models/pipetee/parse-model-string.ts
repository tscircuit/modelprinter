import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeTeeModelDefinitionSchema } from "./schema"
export function parsePipeTeeModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipetee",
    pipeTeeModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      branch: "branchLength",
      socket: "socketDiameter",
      socketl: "socketLength",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      branchlength: "branchLength",
      socketdiameter: "socketDiameter",
      socketlength: "socketLength",
    },
  )
}
