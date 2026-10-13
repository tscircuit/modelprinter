import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { drawLatchModelDefinitionSchema } from "./schema"
const aliases = {
  length: "length",
  width: "width",
  basethickness: "baseThickness",
  handleheight: "handleHeight",
  wirediameter: "wireDiameter",
  holediameter: "holeDiameter",
  w: "width",
  l: "length",
} as const
export function parseDrawLatchModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "drawlatch",
    drawLatchModelDefinitionSchema,
    aliases,
  )
}
