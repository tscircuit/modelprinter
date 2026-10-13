import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { flowMeterModelDefinitionSchema } from "./schema"
const aliases = {
  length: "length",
  diameter: "diameter",
  borediameter: "boreDiameter",
  enddiameter: "endDiameter",
  endlength: "endLength",
  floatdiameter: "floatDiameter",
  d: "diameter",
  l: "length",
} as const
export function parseFlowMeterModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "flowmeter",
    flowMeterModelDefinitionSchema,
    aliases,
  )
}
