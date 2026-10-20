import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { detentPinModelDefinitionSchema } from "./schema"
const aliases = {
  shaftdiameter: "shaftDiameter",
  shaftlength: "shaftLength",
  headdiameter: "headDiameter",
  headheight: "headHeight",
  balldiameter: "ballDiameter",
  balloffset: "ballOffset",
  ringdiameter: "ringDiameter",
  ringwire: "ringWire",
} as const
export function parseDetentPinModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "detentpin",
    detentPinModelDefinitionSchema,
    aliases,
  )
}
