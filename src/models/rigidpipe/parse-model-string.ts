import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { rigidPipeModelDefinitionSchema } from "./schema"
export function parseRigidPipeModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "rigidpipe",
    rigidPipeModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
    },
  )
}
