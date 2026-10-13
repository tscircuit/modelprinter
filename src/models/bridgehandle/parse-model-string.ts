import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { bridgeHandleModelDefinitionSchema } from "./schema"
const aliases = {
  length: "length",
  gripdiameter: "gripDiameter",
  height: "height",
  mountingdiameter: "mountingDiameter",
  mountingheight: "mountingHeight",
  holediameter: "holeDiameter",
  h: "height",
  l: "length",
} as const
export function parseBridgeHandleModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "bridgehandle",
    bridgeHandleModelDefinitionSchema,
    aliases,
  )
}
