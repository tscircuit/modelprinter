import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { sphericalBearingModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  bore: "boreDiameter",
  w: "width",
  ball: "ballDiameter",
  outerdiameter: "outerDiameter",
  borediameter: "boreDiameter",
  width: "width",
  balldiameter: "ballDiameter",
} as const
export function parseSphericalBearingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "sphericalbearing",
    sphericalBearingModelDefinitionSchema,
    aliases,
  )
}
