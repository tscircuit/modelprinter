import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { ballValveModelDefinitionSchema } from "./schema"
export function parseBallValveModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "ballvalve",
    ballValveModelDefinitionSchema,
    {
      od: "outerDiameter",
      bore: "boreDiameter",
      l: "length",
      endod: "endDiameter",
      handlel: "handleLength",
      handlew: "handleWidth",
      stemh: "stemHeight",
      handlet: "handleThickness",
      outerdiameter: "outerDiameter",
      borediameter: "boreDiameter",
      length: "length",
      enddiameter: "endDiameter",
      handlelength: "handleLength",
      handlewidth: "handleWidth",
      stemheight: "stemHeight",
      handlethickness: "handleThickness",
    },
  )
}
