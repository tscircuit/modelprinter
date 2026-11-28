import {
  type RelayBaseModelPropsInput,
  relayBaseModelPropsSchema,
} from "./schema"

export function getRelayBaseDimensions(input: RelayBaseModelPropsInput = {}) {
  const p = relayBaseModelPropsSchema.parse(input)
  const screwMajorDiameter = Number(p.screwThread.slice(1))
  return {
    ...p,
    screwMajorDiameter,
    dinRailWidth: 35,
    dinRailDepth: 7.5,
    bottomZ: 0,
    topZ: p.height,
  }
}
