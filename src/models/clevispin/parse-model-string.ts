import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { clevisPinModelDefinitionSchema } from "./schema"
export function parseClevisPinModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "clevispin",
    clevisPinModelDefinitionSchema,
    {
      d: "shaftDiameter",
      shaftdiameter: "shaftDiameter",
      l: "shaftLength",
      shaftlength: "shaftLength",
      hd: "headDiameter",
      headdiameter: "headDiameter",
      hh: "headHeight",
      headheight: "headHeight",
      hol: "holeDiameter",
      holediameter: "holeDiameter",
      ho: "holeOffset",
      holeoffset: "holeOffset",
    },
  )
}
