import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { hairpinCotterModelDefinitionSchema } from "./schema"
export function parseHairpinCotterModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "hairpincotter",
    hairpinCotterModelDefinitionSchema,
    {
      d: "wireDiameter",
      wirediameter: "wireDiameter",
      l: "length",
      length: "length",
      ld: "loopDiameter",
      loopdiameter: "loopDiameter",
    },
  )
}
