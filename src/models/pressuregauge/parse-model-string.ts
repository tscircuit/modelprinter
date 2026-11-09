import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pressureGaugeModelDefinitionSchema } from "./schema"
const aliases = {
  diameter: "diameter",
  depth: "depth",
  stemdiameter: "stemDiameter",
  stemlength: "stemLength",
  d: "diameter",
} as const
export function parsePressureGaugeModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pressuregauge",
    pressureGaugeModelDefinitionSchema,
    aliases,
  )
}
