import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pressureSwitchModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  depth: "depth",
  height: "height",
  portdiameter: "portDiameter",
  portlength: "portLength",
  w: "width",
  h: "height",
} as const
export function parsePressureSwitchModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pressureswitch",
    pressureSwitchModelDefinitionSchema,
    aliases,
  )
}
