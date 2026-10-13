import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { tSlotNutModelDefinitionSchema } from "./schema"
export function parseTSlotNutModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "tslotnut",
    tSlotNutModelDefinitionSchema,
    {
      id: "boreDiameter",
      borediameter: "boreDiameter",
      w: "baseWidth",
      basewidth: "baseWidth",
      l: "length",
      length: "length",
      bh: "baseHeight",
      baseheight: "baseHeight",
      nw: "neckWidth",
      neckwidth: "neckWidth",
      nh: "neckHeight",
      neckheight: "neckHeight",
    },
  )
}
