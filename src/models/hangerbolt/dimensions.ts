import {
  type HangerBoltModelPropsInput,
  hangerBoltModelPropsSchema,
} from "./schema"

export function getHangerBoltDimensions(input: HangerBoltModelPropsInput = {}) {
  const p = hangerBoltModelPropsSchema.parse(input)
  const machineMajorDiameter = Number(p.thread.slice(1))
  const unthreadedWaistLength = Math.max(
    0,
    p.length - p.machineThreadLength - p.woodThreadLength,
  )
  return {
    ...p,
    machineMajorDiameter,
    unthreadedWaistLength,
    bottomZ: -p.woodThreadLength,
    topZ: p.length - p.woodThreadLength,
  }
}
