import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { woodruffKeyModelDefinitionSchema } from "./schema"
const aliases = {
  diameter: "diameter",
  thickness: "thickness",
  height: "height",
  h: "height",
  d: "diameter",
  t: "thickness",
} as const
export function parseWoodruffKeyModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "woodruffkey",
    woodruffKeyModelDefinitionSchema,
    aliases,
  )
}
