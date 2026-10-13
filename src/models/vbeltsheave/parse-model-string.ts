import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { vBeltSheaveModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  bore: "boreDiameter",
  w: "width",
  grooves: "grooveCount",
  depth: "grooveDepth",
  gw: "grooveWidth",
  hub: "hubDiameter",
  hh: "hubHeight",
  outerdiameter: "outerDiameter",
  borediameter: "boreDiameter",
  width: "width",
  groovecount: "grooveCount",
  groovedepth: "grooveDepth",
  groovewidth: "grooveWidth",
  hubdiameter: "hubDiameter",
  hubheight: "hubHeight",
} as const
export function parseVBeltSheaveModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "vbeltsheave",
    vBeltSheaveModelDefinitionSchema,
    aliases,
  )
}
