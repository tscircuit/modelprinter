import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { shoulderBoltModelDefinitionSchema } from "./schema"
export function parseShoulderBoltModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "shoulderbolt",
    shoulderBoltModelDefinitionSchema,
    {
      sd: "shoulderDiameter",
      shoulderdiameter: "shoulderDiameter",
      sl: "shoulderLength",
      shoulderlength: "shoulderLength",
      td: "threadDiameter",
      threaddiameter: "threadDiameter",
      tl: "threadLength",
      threadlength: "threadLength",
      hd: "headDiameter",
      headdiameter: "headDiameter",
      hh: "headHeight",
      headheight: "headHeight",
    },
  )
}
