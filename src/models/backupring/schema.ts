import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBackupRingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  outerDiameter: positive.default(24),
  thickness: positive.default(1),
  rectangular: z.literal(true).default(true),
  splitAngleDeg: z.number().finite().default(45),
  splitGap: positive.default(0.5),
}

export const backupRingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBackupRingProps)

export const backupRingModelDefinitionSchema = z
  .object({ fn: z.literal("backupring"), ...shape })
  .strict()
  .superRefine(validateBackupRingProps)

export type BackupRingModelPropsInput = z.input<
  typeof backupRingModelPropsSchema
>
export type BackupRingModelProps = z.output<typeof backupRingModelPropsSchema>
export type BackupRingModelDefinition = z.output<
  typeof backupRingModelDefinitionSchema
>
