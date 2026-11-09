import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { toggleClampModelDefinitionSchema } from "./schema"
const aliases = {
  length: "length",
  width: "width",
  basethickness: "baseThickness",
  handleheight: "handleHeight",
  armlength: "armLength",
  paddiameter: "padDiameter",
  holediameter: "holeDiameter",
  w: "width",
  l: "length",
} as const
export function parseToggleClampModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "toggleclamp",
    toggleClampModelDefinitionSchema,
    aliases,
  )
}
