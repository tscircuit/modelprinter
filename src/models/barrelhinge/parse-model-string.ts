import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { barrelHingeModelDefinitionSchema } from "./schema"
const aliases = {
  height: "height",
  barreldiameter: "barrelDiameter",
  pindiameter: "pinDiameter",
  leafwidth: "leafWidth",
  leafthickness: "leafThickness",
  holediameter: "holeDiameter",
  h: "height",
} as const
export function parseBarrelHingeModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "barrelhinge",
    barrelHingeModelDefinitionSchema,
    aliases,
  )
}
