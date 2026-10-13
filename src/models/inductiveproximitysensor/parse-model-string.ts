import type { RawModelprinterParams } from "../../parse-model-string"
import { parseIndustrialModelParams } from "../../industrial-parameter-utils"
import { inductiveProximitySensorModelDefinitionSchema } from "./schema"
const aliases = {
  barreldiameter: "barrelDiameter",
  barrellength: "barrelLength",
  facethickness: "faceThickness",
  cablediameter: "cableDiameter",
  cablelength: "cableLength",
  nutwidth: "nutWidth",
  nutthickness: "nutThickness",
} as const
export function parseInductiveProximitySensorModelParams(
  raw: RawModelprinterParams,
) {
  return parseIndustrialModelParams(
    raw,
    "inductiveproximitysensor",
    inductiveProximitySensorModelDefinitionSchema,
    aliases,
  )
}
