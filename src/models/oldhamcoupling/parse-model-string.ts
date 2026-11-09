import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { oldhamCouplingModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  l: "length",
  bore: "boreDiameter",
  hubl: "hubLength",
  slotw: "slotWidth",
  slotd: "slotDepth",
  clearance: "clearance",
  outerdiameter: "outerDiameter",
  length: "length",
  borediameter: "boreDiameter",
  hublength: "hubLength",
  slotwidth: "slotWidth",
  slotdepth: "slotDepth",
} as const
export function parseOldhamCouplingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "oldhamcoupling",
    oldhamCouplingModelDefinitionSchema,
    aliases,
  )
}
