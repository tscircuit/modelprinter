import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { needleBearingModelDefinitionSchema } from "./schema"
const aliases = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
  race: "raceThickness",
  rollers: "rollerCount",
  innerdiameter: "innerDiameter",
  outerdiameter: "outerDiameter",
  width: "width",
  racethickness: "raceThickness",
  rollercount: "rollerCount",
} as const
export function parseNeedleBearingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "needlebearing",
    needleBearingModelDefinitionSchema,
    aliases,
  )
}
