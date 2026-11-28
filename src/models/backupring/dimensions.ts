import {
  type BackupRingModelPropsInput,
  backupRingModelPropsSchema,
} from "./schema"

export function getBackupRingDimensions(input: BackupRingModelPropsInput = {}) {
  const p = backupRingModelPropsSchema.parse(input)
  const radialWidth = (p.outerDiameter - p.innerDiameter) / 2
  return {
    ...p,
    radialWidth,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
