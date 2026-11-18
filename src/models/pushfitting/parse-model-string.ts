import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { pushFittingModelDefinitionSchema } from "./schema"

export function parsePushFittingModelParams(raw: RawModelprinterParams) {
  return pushFittingModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "pushfitting",
      {
        tubeod: "tubeOuterDiameter",
        l: "length",
        bodyod: "bodyDiameter",
        threadl: "threadLength",
        branchl: "branchLength",
        hexaf: "hexAcrossFlats",
      },
      { thread: "thread" },
      {
        straight: ["shape", "straight"],
        elbow: ["shape", "elbow"],
        tee: ["shape", "tee"],
        male: ["threadGender", "male"],
        female: ["threadGender", "female"],
      },
    ),
  )
}
