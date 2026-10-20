import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { wireDuctModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  height: "height",
  length: "length",
  thickness: "thickness",
  slotwidth: "slotWidth",
  slotpitch: "slotPitch",
  holediameter: "holeDiameter",
  w: "width",
  h: "height",
  l: "length",
  t: "thickness",
} as const
export function parseWireDuctModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "wireduct",
    wireDuctModelDefinitionSchema,
    aliases,
  )
}
