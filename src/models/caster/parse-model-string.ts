import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { casterModelDefinitionSchema } from "./schema"
const aliases = {
  wheeldiameter: "wheelDiameter",
  wheelwidth: "wheelWidth",
  axlediameter: "axleDiameter",
  forkthickness: "forkThickness",
  platewidth: "plateWidth",
  platelength: "plateLength",
  platethickness: "plateThickness",
  overallheight: "overallHeight",
  holediameter: "holeDiameter",
} as const
export function parseCasterModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "caster",
    casterModelDefinitionSchema,
    aliases,
  )
}
