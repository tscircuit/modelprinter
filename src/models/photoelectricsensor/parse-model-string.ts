import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { photoelectricSensorModelDefinitionSchema } from "./schema"
const aliases = {
  width: "width",
  depth: "depth",
  height: "height",
  lensdiameter: "lensDiameter",
  cablediameter: "cableDiameter",
  mountholediameter: "mountHoleDiameter",
  w: "width",
  h: "height",
} as const
export function parsePhotoelectricSensorModelParams(
  raw: RawModelprinterParams,
) {
  return parseIndustrialModelParams(
    raw,
    "photoelectricsensor",
    photoelectricSensorModelDefinitionSchema,
    aliases,
  )
}
