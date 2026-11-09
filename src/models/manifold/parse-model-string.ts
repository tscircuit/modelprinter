import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { manifoldModelDefinitionSchema } from "./schema"
export function parseManifoldModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "manifold",
    manifoldModelDefinitionSchema,
    {
      l: "length",
      w: "width",
      h: "height",
      bore: "boreDiameter",
      port: "portDiameter",
      pitch: "portPitch",
      ports: "portCount",
      hole: "mountingHoleDiameter",
      length: "length",
      width: "width",
      height: "height",
      borediameter: "boreDiameter",
      portdiameter: "portDiameter",
      portpitch: "portPitch",
      portcount: "portCount",
      mountingholediameter: "mountingHoleDiameter",
    },
  )
}
