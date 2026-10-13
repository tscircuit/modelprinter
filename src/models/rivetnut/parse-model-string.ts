import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { rivetNutModelDefinitionSchema } from "./schema"
export function parseRivetNutModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "rivetnut",
    rivetNutModelDefinitionSchema,
    {
      id: "boreDiameter",
      borediameter: "boreDiameter",
      d: "bodyDiameter",
      bodydiameter: "bodyDiameter",
      l: "bodyLength",
      bodylength: "bodyLength",
      fd: "flangeDiameter",
      flangediameter: "flangeDiameter",
      ft: "flangeThickness",
      flangethickness: "flangeThickness",
    },
  )
}
