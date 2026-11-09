import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { bulkheadFittingModelDefinitionSchema } from "./schema"
export function parseBulkheadFittingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "bulkheadfitting",
    bulkheadFittingModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      flange: "flangeDiameter",
      flanget: "flangeThickness",
      af: "nutAcrossFlats",
      nutt: "nutThickness",
      gap: "panelGap",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      flangediameter: "flangeDiameter",
      flangethickness: "flangeThickness",
      nutacrossflats: "nutAcrossFlats",
      nutthickness: "nutThickness",
      panelgap: "panelGap",
    },
  )
}
