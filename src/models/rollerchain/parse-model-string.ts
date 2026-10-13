import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { rollerChainModelDefinitionSchema } from "./schema"
const aliases = {
  pitch: "pitch",
  links: "linkCount",
  roller: "rollerDiameter",
  w: "width",
  pin: "pinDiameter",
  plate: "plateThickness",
  linkcount: "linkCount",
  rollerdiameter: "rollerDiameter",
  width: "width",
  pindiameter: "pinDiameter",
  platethickness: "plateThickness",
} as const
export function parseRollerChainModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "rollerchain",
    rollerChainModelDefinitionSchema,
    aliases,
  )
}
