import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pillowBlockBearingModelDefinitionSchema } from "./schema"
const aliases = {
  bore: "boreDiameter",
  bw: "baseWidth",
  bd: "baseDepth",
  bt: "baseThickness",
  hd: "housingDiameter",
  ch: "centerHeight",
  ms: "mountSpacing",
  mh: "mountHoleDiameter",
  borediameter: "boreDiameter",
  basewidth: "baseWidth",
  basedepth: "baseDepth",
  basethickness: "baseThickness",
  housingdiameter: "housingDiameter",
  centerheight: "centerHeight",
  mountspacing: "mountSpacing",
  mountholediameter: "mountHoleDiameter",
} as const
export function parsePillowBlockBearingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pillowblockbearing",
    pillowBlockBearingModelDefinitionSchema,
    aliases,
  )
}
