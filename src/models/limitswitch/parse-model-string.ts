import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { limitSwitchModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  depth: "depth",
  height: "height",
  actuatorlength: "actuatorLength",
  rollerdiameter: "rollerDiameter",
  leverthickness: "leverThickness",
  holediameter: "holeDiameter",
  w: "width",
  h: "height",
} as const
export function parseLimitSwitchModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "limitswitch",
    limitSwitchModelDefinitionSchema,
    aliases,
  )
}
