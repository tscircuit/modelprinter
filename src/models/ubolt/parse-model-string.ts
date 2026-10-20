import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { uBoltModelDefinitionSchema } from "./schema"
export function parseUBoltModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(raw, "ubolt", uBoltModelDefinitionSchema, {
    d: "rodDiameter",
    roddiameter: "rodDiameter",
    s: "legSpacing",
    legspacing: "legSpacing",
    l: "legLength",
    leglength: "legLength",
  })
}
