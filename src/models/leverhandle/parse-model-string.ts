import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { leverHandleModelDefinitionSchema } from "./schema"
const aliases = {
  length: "length",
  width: "width",
  height: "height",
  hubdiameter: "hubDiameter",
  hubheight: "hubHeight",
  borediameter: "boreDiameter",
  w: "width",
  h: "height",
  l: "length",
  bore: "boreDiameter",
} as const
export function parseLeverHandleModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "leverhandle",
    leverHandleModelDefinitionSchema,
    aliases,
  )
}
