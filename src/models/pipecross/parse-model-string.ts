import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeCrossModelDefinitionSchema } from "./schema"
export function parsePipeCrossModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipecross",
    pipeCrossModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      span: "span",
      socket: "socketDiameter",
      socketl: "socketLength",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      socketdiameter: "socketDiameter",
      socketlength: "socketLength",
    },
  )
}
