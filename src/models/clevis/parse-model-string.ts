import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { clevisModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  l: "length",
  h: "height",
  gap: "gap",
  back: "backThickness",
  pin: "pinDiameter",
  mount: "mountDiameter",
  width: "width",
  length: "length",
  height: "height",
  backthickness: "backThickness",
  pindiameter: "pinDiameter",
  mountdiameter: "mountDiameter",
} as const
export function parseClevisModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "clevis",
    clevisModelDefinitionSchema,
    aliases,
  )
}
