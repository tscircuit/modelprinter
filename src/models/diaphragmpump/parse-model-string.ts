import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { diaphragmPumpModelDefinitionSchema } from "./schema"

export function parseDiaphragmPumpModelParams(raw: RawModelprinterParams) {
  return diaphragmPumpModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "diaphragmpump",
      {
        l: "length",
        w: "width",
        h: "height",
        hoseid: "hoseInnerDiameter",
        headl: "headLength",
        motorod: "motorDiameter",
        barbpitch: "barbPitch",
        barbl: "barbLength",
        mountpitchx: "mountPitchX",
        mountpitchy: "mountPitchY",
      },
      {},
      {
        brusheddc: ["motor", "brusheddc"],
        brushlessdc: ["motor", "brushlessdc"],
      },
    ),
  )
}
