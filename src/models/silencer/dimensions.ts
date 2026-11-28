import {
  type SilencerModelPropsInput,
  silencerModelPropsSchema,
} from "./schema"

export function getSilencerDimensions(input: SilencerModelPropsInput = {}) {
  const p = silencerModelPropsSchema.parse(input)
  return {
    ...p,
    hexCircumscribedDiameter: p.hexAcrossFlats / Math.cos(Math.PI / 6),
  }
}
