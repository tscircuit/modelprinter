import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { roundBarModelDefinitionSchema } from "./schema"
const aliases = {
  diameter: "diameter",
  length: "length",
  chamfer: "chamfer",
  l: "length",
  d: "diameter",
} as const
export function parseRoundBarModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "roundbar",
    roundBarModelDefinitionSchema,
    aliases,
  )
}
