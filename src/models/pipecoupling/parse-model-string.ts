import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeCouplingModelDefinitionSchema } from "./schema"
export function parsePipeCouplingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipecoupling",
    pipeCouplingModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      socket: "socketDiameter",
      l: "length",
      depth: "socketDepth",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      socketdiameter: "socketDiameter",
      length: "length",
      socketdepth: "socketDepth",
    },
  )
}
