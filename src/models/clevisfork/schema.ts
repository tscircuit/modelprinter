import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateClevisForkProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  length: positive.default(35),
  slotGap: positive.default(8),
  armThickness: positive.default(6),
  armHeight: positive.default(12),
  armLength: positive.default(18),
  pinDiameter: positive.default(6),
  holeOffset: positive.default(6),
  shankOuterDiameter: positive.default(10),
  threadDepth: positive.default(12),
}

export const clevisForkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateClevisForkProps)

export const clevisForkModelDefinitionSchema = z
  .object({ fn: z.literal("clevisfork"), ...shape })
  .strict()
  .superRefine(validateClevisForkProps)

export type ClevisForkModelPropsInput = z.input<
  typeof clevisForkModelPropsSchema
>
export type ClevisForkModelProps = z.output<typeof clevisForkModelPropsSchema>
export type ClevisForkModelDefinition = z.output<
  typeof clevisForkModelDefinitionSchema
>
