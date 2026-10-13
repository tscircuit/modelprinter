import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pneumaticCylinderModelDefinitionSchema } from "./schema"
const aliases = {
  borediameter: "boreDiameter",
  bodylength: "bodyLength",
  roddiameter: "rodDiameter",
  stroke: "stroke",
  extension: "extension",
  endcaplength: "endCapLength",
  portdiameter: "portDiameter",
} as const
export function parsePneumaticCylinderModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pneumaticcylinder",
    pneumaticCylinderModelDefinitionSchema,
    aliases,
  )
}
