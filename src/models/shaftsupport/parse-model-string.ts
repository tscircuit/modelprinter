import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { shaftSupportModelDefinitionSchema } from "./schema"
const aliases = {
  bore: "boreDiameter",
  bw: "baseWidth",
  bd: "baseDepth",
  bt: "baseThickness",
  hw: "headWidth",
  hd: "headDepth",
  hh: "headHeight",
  ch: "centerHeight",
  ms: "mountSpacing",
  mh: "mountHoleDiameter",
  slit: "slitWidth",
  clamp: "clampHoleDiameter",
  borediameter: "boreDiameter",
  basewidth: "baseWidth",
  basedepth: "baseDepth",
  basethickness: "baseThickness",
  headwidth: "headWidth",
  headdepth: "headDepth",
  headheight: "headHeight",
  centerheight: "centerHeight",
  mountspacing: "mountSpacing",
  mountholediameter: "mountHoleDiameter",
  slitwidth: "slitWidth",
  clampholediameter: "clampHoleDiameter",
} as const
export function parseShaftSupportModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "shaftsupport",
    shaftSupportModelDefinitionSchema,
    aliases,
  )
}
