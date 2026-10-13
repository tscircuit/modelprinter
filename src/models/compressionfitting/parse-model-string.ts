import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { compressionFittingModelDefinitionSchema } from "./schema"
export function parseCompressionFittingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "compressionfitting",
    compressionFittingModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      tube: "tubeDiameter",
      af: "nutAcrossFlats",
      nutl: "nutLength",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      tubediameter: "tubeDiameter",
      nutacrossflats: "nutAcrossFlats",
      nutlength: "nutLength",
    },
  )
}
