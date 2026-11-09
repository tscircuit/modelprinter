import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { teeBarModelDefinitionSchema } from "./schema"
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
export function parseTeeBarModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "teebar",
    teeBarModelDefinitionSchema,
    aliases,
  )
}
