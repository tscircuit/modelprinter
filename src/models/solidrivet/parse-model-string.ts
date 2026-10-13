import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { solidRivetModelDefinitionSchema } from "./schema"
export function parseSolidRivetModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "solidrivet",
    solidRivetModelDefinitionSchema,
    {
      d: "shaftDiameter",
      shaftdiameter: "shaftDiameter",
      l: "shaftLength",
      shaftlength: "shaftLength",
      hd: "headDiameter",
      headdiameter: "headDiameter",
      hh: "headHeight",
      headheight: "headHeight",
    },
  )
}
