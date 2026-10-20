import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { camFollowerModelDefinitionSchema } from "./schema"
const aliases = {
  od: "wheelDiameter",
  w: "wheelWidth",
  stud: "studDiameter",
  sl: "studLength",
  socket: "socketDiameter",
  rollers: "rollerCount",
  wheeldiameter: "wheelDiameter",
  wheelwidth: "wheelWidth",
  studdiameter: "studDiameter",
  studlength: "studLength",
  socketdiameter: "socketDiameter",
  rollercount: "rollerCount",
} as const
export function parseCamFollowerModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "camfollower",
    camFollowerModelDefinitionSchema,
    aliases,
  )
}
