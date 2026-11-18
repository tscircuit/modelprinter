import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airRegulatorModelDefinitionSchema } from "./schema"

export function parseAirRegulatorModelParams(raw: RawModelprinterParams) {
  return airRegulatorModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airregulator",
      {
        l: "length",
        w: "width",
        h: "height",
        knobod: "knobDiameter",
        knobl: "knobLength",
      },
      { port: "portThread", inlet: "inletThread", outlet: "outletThread" },
      {
        filterbowl: "filterBowl",
        gauge: "gauge",
        relieving: "relieving",
        inline: ["layout", "inline"],
        axialradial: ["layout", "axialradial"],
      },
    ),
  )
}
