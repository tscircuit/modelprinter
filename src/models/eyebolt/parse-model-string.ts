import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { eyeBoltModelDefinitionSchema } from "./schema"
export function parseEyeBoltModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "eyebolt",
    eyeBoltModelDefinitionSchema,
    {
      d: "shaftDiameter",
      shaftdiameter: "shaftDiameter",
      l: "shaftLength",
      shaftlength: "shaftLength",
      id: "eyeInnerDiameter",
      eyeinnerdiameter: "eyeInnerDiameter",
      wd: "eyeWireDiameter",
      eyewirediameter: "eyeWireDiameter",
    },
  )
}
