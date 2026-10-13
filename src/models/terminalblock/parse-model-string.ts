import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { terminalBlockModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  depth: "depth",
  height: "height",
  wirediameter: "wireDiameter",
  screwdiameter: "screwDiameter",
  w: "width",
  h: "height",
} as const
export function parseTerminalBlockModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "terminalblock",
    terminalBlockModelDefinitionSchema,
    aliases,
  )
}
