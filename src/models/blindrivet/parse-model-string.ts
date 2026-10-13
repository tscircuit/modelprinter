import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { blindRivetModelDefinitionSchema } from "./schema"
export function parseBlindRivetModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "blindrivet",
    blindRivetModelDefinitionSchema,
    {
      d: "bodyDiameter",
      bodydiameter: "bodyDiameter",
      l: "bodyLength",
      bodylength: "bodyLength",
      fd: "flangeDiameter",
      flangediameter: "flangeDiameter",
      ft: "flangeThickness",
      flangethickness: "flangeThickness",
      md: "mandrelDiameter",
      mandreldiameter: "mandrelDiameter",
      ml: "mandrelLength",
      mandrellength: "mandrelLength",
    },
  )
}
