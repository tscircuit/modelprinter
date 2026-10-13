import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { cylindricalRollerBearingModelDefinitionSchema } from "./schema"
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
export function parseCylindricalRollerBearingModelParams(
  raw: RawModelprinterParams,
) {
  return parseIndustrialModelParams(
    raw,
    "cylindricalrollerbearing",
    cylindricalRollerBearingModelDefinitionSchema,
    aliases,
  )
}
