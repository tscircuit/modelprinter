import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { rodEndModelDefinitionSchema } from "./schema"
const aliases = {
  hd: "headDiameter",
  bore: "boreDiameter",
  w: "headWidth",
  stem: "stemDiameter",
  sl: "stemLength",
  headdiameter: "headDiameter",
  borediameter: "boreDiameter",
  headwidth: "headWidth",
  stemdiameter: "stemDiameter",
  stemlength: "stemLength",
} as const
export function parseRodEndModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "rodend",
    rodEndModelDefinitionSchema,
    aliases,
  )
}
