import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pushbuttonOperatorModelDefinitionSchema } from "./schema"
const aliases = {
  paneldiameter: "panelDiameter",
  bezeldiameter: "bezelDiameter",
  buttondiameter: "buttonDiameter",
  bodylength: "bodyLength",
  buttonheight: "buttonHeight",
} as const
export function parsePushbuttonOperatorModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pushbuttonoperator",
    pushbuttonOperatorModelDefinitionSchema,
    aliases,
  )
}
