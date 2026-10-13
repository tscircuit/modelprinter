import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { couplingNutModelDefinitionSchema } from "./schema"
export function parseCouplingNutModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "couplingnut",
    couplingNutModelDefinitionSchema,
    {
      id: "boreDiameter",
      borediameter: "boreDiameter",
      af: "acrossFlats",
      acrossflats: "acrossFlats",
      h: "height",
      height: "height",
    },
  )
}
