import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { wingNutModelDefinitionSchema } from "./schema"
export function parseWingNutModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "wingnut",
    wingNutModelDefinitionSchema,
    {
      id: "boreDiameter",
      borediameter: "boreDiameter",
      af: "acrossFlats",
      acrossflats: "acrossFlats",
      h: "bodyHeight",
      bodyheight: "bodyHeight",
      s: "wingSpan",
      wingspan: "wingSpan",
      wh: "wingHeight",
      wingheight: "wingHeight",
      wt: "wingThickness",
      wingthickness: "wingThickness",
    },
  )
}
