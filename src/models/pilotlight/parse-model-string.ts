import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pilotLightModelDefinitionSchema } from "./schema"
const aliases = {
  paneldiameter: "panelDiameter",
  lensdiameter: "lensDiameter",
  bodylength: "bodyLength",
  lensheight: "lensHeight",
} as const
export function parsePilotLightModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pilotlight",
    pilotLightModelDefinitionSchema,
    aliases,
  )
}
