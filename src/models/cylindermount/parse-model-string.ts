import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { cylinderMountModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  depth: "depth",
  height: "height",
  thickness: "thickness",
  borediameter: "boreDiameter",
  holediameter: "holeDiameter",
  w: "width",
  h: "height",
  t: "thickness",
} as const
export function parseCylinderMountModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "cylindermount",
    cylinderMountModelDefinitionSchema,
    aliases,
  )
}
