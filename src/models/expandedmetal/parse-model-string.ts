import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { expandedMetalModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  length: "length",
  thickness: "thickness",
  diamondwidth: "diamondWidth",
  diamondlength: "diamondLength",
  strandwidth: "strandWidth",
  framewidth: "frameWidth",
  w: "width",
  l: "length",
  t: "thickness",
} as const
export function parseExpandedMetalModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "expandedmetal",
    expandedMetalModelDefinitionSchema,
    aliases,
  )
}
