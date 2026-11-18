import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airValveManifoldModelDefinitionSchema } from "./schema"

export function parseAirValveManifoldModelParams(raw: RawModelprinterParams) {
  return airValveManifoldModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airvalvemanifold",
      {
        l: "length",
        w: "width",
        h: "height",
        stations: "stations",
        pitch: "stationPitch",
      },
      { port: "portThread" },
      {},
    ),
  )
}
