import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { needleValveModelDefinitionSchema } from "./schema"
export function parseNeedleValveModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "needlevalve",
    needleValveModelDefinitionSchema,
    {
      bodyl: "bodyLength",
      bodyw: "bodyWidth",
      bodyh: "bodyHeight",
      bore: "boreDiameter",
      port: "portDiameter",
      portl: "portLength",
      stemh: "stemHeight",
      wheel: "wheelDiameter",
      wheelt: "wheelThickness",
      bodylength: "bodyLength",
      bodywidth: "bodyWidth",
      bodyheight: "bodyHeight",
      borediameter: "boreDiameter",
      portdiameter: "portDiameter",
      portlength: "portLength",
      stemheight: "stemHeight",
      wheeldiameter: "wheelDiameter",
      wheelthickness: "wheelThickness",
    },
  )
}
