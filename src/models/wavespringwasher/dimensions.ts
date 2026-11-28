import {
  type WaveSpringWasherModelPropsInput,
  waveSpringWasherModelPropsSchema,
} from "./schema"

export function getWaveSpringWasherDimensions(
  input: WaveSpringWasherModelPropsInput = {},
) {
  const p = waveSpringWasherModelPropsSchema.parse(input)
  return {
    ...p,
    waveAmplitude: (p.freeHeight - p.stripThickness) / 2,
    bottomZ: 0,
    topZ: p.freeHeight,
  }
}
