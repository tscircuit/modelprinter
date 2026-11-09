import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { hoseBarbModelDefinitionSchema } from "./schema"
export function parseHoseBarbModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "hosebarb",
    hoseBarbModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      barbod: "barbDiameter",
      barbl: "barbLength",
      pitch: "barbPitch",
      af: "hexAcrossFlats",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      barbdiameter: "barbDiameter",
      barblength: "barbLength",
      barbpitch: "barbPitch",
      hexacrossflats: "hexAcrossFlats",
    },
  )
}
