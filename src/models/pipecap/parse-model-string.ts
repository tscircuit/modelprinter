import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeCapModelDefinitionSchema } from "./schema"
export function parsePipeCapModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipecap",
    pipeCapModelDefinitionSchema,
    {
      od: "outerDiameter",
      socket: "socketDiameter",
      l: "length",
      floor: "floorThickness",
      af: "hexAcrossFlats",
      outerdiameter: "outerDiameter",
      socketdiameter: "socketDiameter",
      length: "length",
      floorthickness: "floorThickness",
      hexacrossflats: "hexAcrossFlats",
    },
  )
}
