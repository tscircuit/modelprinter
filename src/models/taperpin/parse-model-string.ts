import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { taperPinModelDefinitionSchema } from "./schema"
export function parseTaperPinModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "taperpin",
    taperPinModelDefinitionSchema,
    {
      ld: "largeDiameter",
      largediameter: "largeDiameter",
      sd: "smallDiameter",
      smalldiameter: "smallDiameter",
      l: "length",
      length: "length",
    },
  )
}
