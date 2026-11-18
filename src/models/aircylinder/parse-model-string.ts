import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airCylinderModelDefinitionSchema } from "./schema"

export function parseAirCylinderModelParams(raw: RawModelprinterParams) {
  return airCylinderModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "aircylinder",
      {
        l: "length",
        w: "width",
        h: "height",
        bore: "boreDiameter",
        od: "outerDiameter",
        stroke: "stroke",
        rodd: "rodDiameter",
        rodout: "retractedRodLength",
        extension: "extension",
      },
      { port: "portThread" },
      {
        round: ["bodyStyle", "round"],
        compact: ["bodyStyle", "compact"],
        tierod: ["bodyStyle", "tierod"],
        singleacting: ["action", "singleacting"],
        doubleacting: ["action", "doubleacting"],
      },
    ),
  )
}
