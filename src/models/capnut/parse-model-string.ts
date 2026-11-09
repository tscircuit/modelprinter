import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { capNutModelDefinitionSchema } from "./schema"
export function parseCapNutModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "capnut",
    capNutModelDefinitionSchema,
    {
      id: "boreDiameter",
      borediameter: "boreDiameter",
      af: "acrossFlats",
      acrossflats: "acrossFlats",
      h: "bodyHeight",
      bodyheight: "bodyHeight",
      ch: "capHeight",
      capheight: "capHeight",
      wt: "wallThickness",
      wallthickness: "wallThickness",
    },
  )
}
