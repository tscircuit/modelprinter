import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pushConnectFittingModelDefinitionSchema } from "./schema"
export function parsePushConnectFittingModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pushconnectfitting",
    pushConnectFittingModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      tube: "tubeDiameter",
      collet: "colletDiameter",
      colletl: "colletLength",
      af: "hexAcrossFlats",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      tubediameter: "tubeDiameter",
      colletdiameter: "colletDiameter",
      colletlength: "colletLength",
      hexacrossflats: "hexAcrossFlats",
    },
  )
}
