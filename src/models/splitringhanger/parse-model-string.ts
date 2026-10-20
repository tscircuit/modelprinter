import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { splitRingHangerModelDefinitionSchema } from "./schema"
const aliases = {
  pipediameter: "pipeDiameter",
  bandthickness: "bandThickness",
  bandwidth: "bandWidth",
  gap: "gap",
  lugwidth: "lugWidth",
  holediameter: "holeDiameter",
} as const
export function parseSplitRingHangerModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "splitringhanger",
    splitRingHangerModelDefinitionSchema,
    aliases,
  )
}
