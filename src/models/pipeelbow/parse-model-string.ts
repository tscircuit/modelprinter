import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeElbowModelDefinitionSchema } from "./schema"
export function parsePipeElbowModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipeelbow",
    pipeElbowModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      leg: "legLength",
      socket: "socketDiameter",
      socketl: "socketLength",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      leglength: "legLength",
      socketdiameter: "socketDiameter",
      socketlength: "socketLength",
    },
  )
}
