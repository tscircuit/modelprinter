import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { pipeFlangeModelDefinitionSchema } from "./schema"
export function parsePipeFlangeModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "pipeflange",
    pipeFlangeModelDefinitionSchema,
    {
      flange: "flangeDiameter",
      bore: "boreDiameter",
      hub: "hubDiameter",
      flanget: "flangeThickness",
      hubl: "hubLength",
      bc: "boltCircleDiameter",
      hole: "boltHoleDiameter",
      bolts: "boltCount",
      flangediameter: "flangeDiameter",
      borediameter: "boreDiameter",
      hubdiameter: "hubDiameter",
      flangethickness: "flangeThickness",
      hublength: "hubLength",
      boltcirclediameter: "boltCircleDiameter",
      boltholediameter: "boltHoleDiameter",
      boltcount: "boltCount",
    },
  )
}
