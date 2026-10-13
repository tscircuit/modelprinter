import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { solenoidValveModelDefinitionSchema } from "./schema"
const aliases = {
  length: "length",
  width: "width",
  height: "height",
  coilwidth: "coilWidth",
  coilheight: "coilHeight",
  portdiameter: "portDiameter",
  w: "width",
  h: "height",
  l: "length",
} as const
export function parseSolenoidValveModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "solenoidvalve",
    solenoidValveModelDefinitionSchema,
    aliases,
  )
}
