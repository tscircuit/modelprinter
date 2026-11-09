import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { reducingBushingModelDefinitionSchema } from "./schema"
export function parseReducingBushingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "reducingbushing",
    reducingBushingModelDefinitionSchema,
    {
      od: "outerDiameter",
      largebore: "largeBoreDiameter",
      smallbore: "smallBoreDiameter",
      l: "length",
      af: "hexAcrossFlats",
      hexl: "hexLength",
      outerdiameter: "outerDiameter",
      largeborediameter: "largeBoreDiameter",
      smallborediameter: "smallBoreDiameter",
      length: "length",
      hexacrossflats: "hexAcrossFlats",
      hexlength: "hexLength",
    },
  )
}
