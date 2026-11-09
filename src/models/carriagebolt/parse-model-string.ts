import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { carriageBoltModelDefinitionSchema } from "./schema"
export function parseCarriageBoltModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "carriagebolt",
    carriageBoltModelDefinitionSchema,
    {
      d: "shaftDiameter",
      shaftdiameter: "shaftDiameter",
      l: "shaftLength",
      shaftlength: "shaftLength",
      nw: "neckWidth",
      neckwidth: "neckWidth",
      nh: "neckHeight",
      neckheight: "neckHeight",
      hd: "headDiameter",
      headdiameter: "headDiameter",
      hh: "headHeight",
      headheight: "headHeight",
    },
  )
}
