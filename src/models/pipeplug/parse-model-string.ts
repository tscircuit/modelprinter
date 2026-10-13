import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipePlugModelDefinitionSchema } from "./schema"
export function parsePipePlugModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipeplug",
    pipePlugModelDefinitionSchema,
    {
      d: "diameter",
      l: "length",
      af: "headAcrossFlats",
      head: "headHeight",
      diameter: "diameter",
      length: "length",
      headacrossflats: "headAcrossFlats",
      headheight: "headHeight",
    },
  )
}
