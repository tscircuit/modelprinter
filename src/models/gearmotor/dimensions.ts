import {
  type GearMotorModelPropsInput,
  gearMotorModelPropsSchema,
} from "./schema"

export function getGearMotorDimensions(input: GearMotorModelPropsInput = {}) {
  const p = gearMotorModelPropsSchema.parse(input)
  const gearboxLength = p.bodyLength * 0.35
  const motorCanLength = p.bodyLength - gearboxLength
  const overallLength = p.bodyLength + p.shaftLength
  return {
    ...p,
    gearboxLength,
    motorCanLength,
    overallLength,
    rearZ: -p.bodyLength,
    mountFaceZ: 0,
    shaftTipZ: p.shaftLength,
  }
}
