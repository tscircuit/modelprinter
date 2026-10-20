import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { flangeBearingModelDefinitionSchema } from "./schema"
const aliases = {
  bore: "boreDiameter",
  fw: "flangeWidth",
  ft: "flangeThickness",
  hd: "housingDiameter",
  hh: "housingHeight",
  ms: "mountSpacing",
  mh: "mountHoleDiameter",
  borediameter: "boreDiameter",
  flangewidth: "flangeWidth",
  flangethickness: "flangeThickness",
  housingdiameter: "housingDiameter",
  housingheight: "housingHeight",
  mountspacing: "mountSpacing",
  mountholediameter: "mountHoleDiameter",
} as const
export function parseFlangeBearingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "flangebearing",
    flangeBearingModelDefinitionSchema,
    aliases,
  )
}
