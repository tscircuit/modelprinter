import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { hingeModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  length: "length",
  leafthickness: "leafThickness",
  barreldiameter: "barrelDiameter",
  pindiameter: "pinDiameter",
  holediameter: "holeDiameter",
  w: "width",
  l: "length",
} as const
export function parseHingeModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "hinge",
    hingeModelDefinitionSchema,
    aliases,
  )
}
