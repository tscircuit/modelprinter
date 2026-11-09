import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { sprocketModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  root: "rootDiameter",
  w: "width",
  bore: "boreDiameter",
  teeth: "toothCount",
  hub: "hubDiameter",
  hh: "hubHeight",
  outerdiameter: "outerDiameter",
  rootdiameter: "rootDiameter",
  width: "width",
  borediameter: "boreDiameter",
  toothcount: "toothCount",
  hubdiameter: "hubDiameter",
  hubheight: "hubHeight",
} as const
export function parseSprocketModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "sprocket",
    sprocketModelDefinitionSchema,
    aliases,
  )
}
