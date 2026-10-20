import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { waveWasherModelDefinitionSchema } from "./schema"
export function parseWaveWasherModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "wavewasher",
    waveWasherModelDefinitionSchema,
    {
      id: "innerDiameter",
      innerdiameter: "innerDiameter",
      od: "outerDiameter",
      outerdiameter: "outerDiameter",
      t: "thickness",
      thickness: "thickness",
      wh: "waveHeight",
      waveheight: "waveHeight",
    },
  )
}
