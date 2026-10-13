import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { jawCouplingModelDefinitionSchema } from "./schema"
const aliases = {
  od: "outerDiameter",
  l: "length",
  bore: "boreDiameter",
  hubl: "hubLength",
  jawd: "jawDepth",
  jawcount: "jawCount",
  outerdiameter: "outerDiameter",
  length: "length",
  borediameter: "boreDiameter",
  hublength: "hubLength",
  jawdepth: "jawDepth",
} as const
export function parseJawCouplingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "jawcoupling",
    jawCouplingModelDefinitionSchema,
    aliases,
  )
}
