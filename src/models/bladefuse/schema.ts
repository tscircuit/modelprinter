import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBladeFuseProps } from "./validate"

const shape = {
  regularFlatBlade: z.literal(true).default(true),
  width: positive.default(19.1),
  bodyHeight: positive.default(12),
  thickness: positive.default(5.1),
  blades: z.literal(2).default(2),
  bladeLength: positive.default(7),
  bladeWidth: positive.default(5.2),
  bladeThickness: positive.default(0.65),
  pitch: positive.default(8),
}

export const bladeFuseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBladeFuseProps)

export const bladeFuseModelDefinitionSchema = z
  .object({ fn: z.literal("bladefuse"), ...shape })
  .strict()
  .superRefine(validateBladeFuseProps)

export type BladeFuseModelPropsInput = z.input<typeof bladeFuseModelPropsSchema>
export type BladeFuseModelProps = z.output<typeof bladeFuseModelPropsSchema>
export type BladeFuseModelDefinition = z.output<
  typeof bladeFuseModelDefinitionSchema
>
