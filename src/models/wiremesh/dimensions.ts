import {
  type WireMeshModelPropsInput,
  wireMeshModelPropsSchema,
} from "./schema"

export function getWireMeshDimensions(input: WireMeshModelPropsInput = {}) {
  const p = wireMeshModelPropsSchema.parse(input)
  return {
    ...p,
    apertureX: p.pitchX - p.wireDiameter,
    apertureY: p.pitchY - p.wireDiameter,
    envelopeThickness: 2 * p.wireDiameter,
  }
}
