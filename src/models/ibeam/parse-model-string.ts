import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { iBeamModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  height: "height",
  webthickness: "webThickness",
  flangethickness: "flangeThickness",
  length: "length",
  w: "width",
  h: "height",
  l: "length",
} as const
export function parseIBeamModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "ibeam",
    iBeamModelDefinitionSchema,
    aliases,
  )
}
