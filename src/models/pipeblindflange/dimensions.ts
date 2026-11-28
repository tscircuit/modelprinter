import {
  type PipeBlindFlangeModelPropsInput,
  pipeBlindFlangeModelPropsSchema,
} from "./schema"

export function getPipeBlindFlangeDimensions(
  input: PipeBlindFlangeModelPropsInput = {},
) {
  const p = pipeBlindFlangeModelPropsSchema.parse(input)
  return {
    ...p,
    rimLigament: (p.outerDiameter - p.boltCircleDiameter - p.holeDiameter) / 2,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
