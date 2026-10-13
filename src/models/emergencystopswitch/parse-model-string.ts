import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { emergencyStopSwitchModelDefinitionSchema } from "./schema"
const aliases = {
  paneldiameter: "panelDiameter",
  headdiameter: "headDiameter",
  bodylength: "bodyLength",
  headheight: "headHeight",
  collardiameter: "collarDiameter",
} as const
export function parseEmergencyStopSwitchModelParams(
  raw: RawModelprinterParams,
) {
  return parseIndustrialModelParams(
    raw,
    "emergencystopswitch",
    emergencyStopSwitchModelDefinitionSchema,
    aliases,
  )
}
