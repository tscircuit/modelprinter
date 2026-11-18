import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airSlideModelDefinitionSchema } from "./schema"

export function parseAirSlideModelParams(raw: RawModelprinterParams) {
  return airSlideModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airslide",
      {
        l: "length",
        w: "width",
        h: "height",
        stroke: "stroke",
        carriagel: "carriageLength",
        extension: "extension",
      },
      { port: "portThread" },
      { rodless: ["style", "rodless"], guided: ["style", "guided"] },
    ),
  )
}
