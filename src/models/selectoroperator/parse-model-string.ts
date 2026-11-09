import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { selectorOperatorModelDefinitionSchema } from "./schema"
const aliases = {
  paneldiameter: "panelDiameter",
  bezeldiameter: "bezelDiameter",
  bodylength: "bodyLength",
  knobwidth: "knobWidth",
  knobdepth: "knobDepth",
  knobheight: "knobHeight",
} as const
export function parseSelectorOperatorModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "selectoroperator",
    selectorOperatorModelDefinitionSchema,
    aliases,
  )
}
