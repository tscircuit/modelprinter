import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { gearRackModelDefinitionSchema } from "./schema"
const aliases = {
  pitch: "pitch",
  teeth: "toothCount",
  w: "width",
  h: "baseHeight",
  th: "toothHeight",
  mh: "mountHoleDiameter",
  toothcount: "toothCount",
  width: "width",
  baseheight: "baseHeight",
  toothheight: "toothHeight",
  mountholediameter: "mountHoleDiameter",
} as const
export function parseGearRackModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "gearrack",
    gearRackModelDefinitionSchema,
    aliases,
  )
}
