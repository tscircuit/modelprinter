import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { squareKeyModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  height: "height",
  length: "length",
  chamfer: "chamfer",
  w: "width",
  h: "height",
  l: "length",
} as const
export function parseSquareKeyModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "squarekey",
    squareKeyModelDefinitionSchema,
    aliases,
  )
}
