import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { hoseClampModelDefinitionSchema } from "./schema"
export function parseHoseClampModelParams(raw: RawModelprinterParams) {
  return parseIndustrialModelParams(
    raw,
    "hoseclamp",
    hoseClampModelDefinitionSchema,
    {
      id: "innerDiameter",
      bandt: "bandThickness",
      bandw: "bandWidth",
      housingl: "housingLength",
      housingw: "housingWidth",
      housingh: "housingHeight",
      innerdiameter: "innerDiameter",
      bandthickness: "bandThickness",
      bandwidth: "bandWidth",
      housinglength: "housingLength",
      housingwidth: "housingWidth",
      housingheight: "housingHeight",
    },
  )
}
