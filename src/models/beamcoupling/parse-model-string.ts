import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { beamCouplingModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  l: "length",
  bore: "boreDiameter",
  hubl: "hubLength",
  slotw: "slotWidth",
  slots: "slotCount",
  slotcount: "slotCount",
  bridgeangle: "bridgeAngle",
  outerdiameter: "outerDiameter",
  length: "length",
  borediameter: "boreDiameter",
  hublength: "hubLength",
  slotwidth: "slotWidth",
} as const
export function parseBeamCouplingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "beamcoupling",
    beamCouplingModelDefinitionSchema,
    aliases,
  )
}
