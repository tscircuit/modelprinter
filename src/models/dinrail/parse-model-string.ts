import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { dinRailModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  height: "height",
  thickness: "thickness",
  length: "length",
  holediameter: "holeDiameter",
  slotlength: "slotLength",
  slotpitch: "slotPitch",
  w: "width",
  h: "height",
  l: "length",
  t: "thickness",
} as const
export function parseDinRailModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "dinrail",
    dinRailModelDefinitionSchema,
    aliases,
  )
}
