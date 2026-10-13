import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { vacuumCupModelDefinitionSchema } from "./schema"
const aliases = {
  diameter: "diameter",
  height: "height",
  neckdiameter: "neckDiameter",
  necklength: "neckLength",
  wallthickness: "wallThickness",
  borediameter: "boreDiameter",
  d: "diameter",
  h: "height",
} as const
export function parseVacuumCupModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "vacuumcup",
    vacuumCupModelDefinitionSchema,
    aliases,
  )
}
