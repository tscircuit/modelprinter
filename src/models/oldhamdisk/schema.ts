import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateOldhamDiskProps } from "./validate"

const shape = {
  outerDiameter: positive.default(30),
  width: positive.default(10),
  tongueWidth: positive.default(8),
  tongueHeight: positive.default(3),
  orthogonalTongues: z.literal(true).default(true),
  floating: z.literal(true).default(true),
}

export const oldhamDiskModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateOldhamDiskProps)

export const oldhamDiskModelDefinitionSchema = z
  .object({ fn: z.literal("oldhamdisk"), ...shape })
  .strict()
  .superRefine(validateOldhamDiskProps)

export type OldhamDiskModelPropsInput = z.input<
  typeof oldhamDiskModelPropsSchema
>
export type OldhamDiskModelProps = z.output<typeof oldhamDiskModelPropsSchema>
export type OldhamDiskModelDefinition = z.output<
  typeof oldhamDiskModelDefinitionSchema
>
