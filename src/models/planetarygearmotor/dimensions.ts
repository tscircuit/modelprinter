import {
  type PlanetaryGearmotorModelPropsInput,
  planetaryGearmotorModelPropsSchema,
} from "./schema"

export function getPlanetaryGearmotorDimensions(
  input: PlanetaryGearmotorModelPropsInput = {},
) {
  const p = planetaryGearmotorModelPropsSchema.parse(input)
  const mountThreadMajorDiameter = Number(p.mountThread.slice(1))
  return {
    ...p,
    mountThreadMajorDiameter,
    bottomZ: -p.length,
    topZ: 0,
  }
}
