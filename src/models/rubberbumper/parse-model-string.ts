import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { rubberBumperModelDefinitionSchema } from "./schema"
const aliases = {
  diameter: "diameter",
  height: "height",
  holediameter: "holeDiameter",
  counterborediameter: "counterboreDiameter",
  counterboredepth: "counterboreDepth",
  h: "height",
  d: "diameter",
} as const
export function parseRubberBumperModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "rubberbumper",
    rubberBumperModelDefinitionSchema,
    aliases,
  )
}
