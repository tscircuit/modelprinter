import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBarrelNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  outerDiameter: positive.default(10),
  length: positive.default(14),
  holeOffset: positive.default(7),
  slotWidth: positive.default(1),
  slotDepth: positive.default(2),
  transverse: z.literal(true).default(true),
  slotted: z.literal(true).default(true),
}

export const barrelNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBarrelNutProps)

export const barrelNutModelDefinitionSchema = z
  .object({ fn: z.literal("barrelnut"), ...shape })
  .strict()
  .superRefine(validateBarrelNutProps)

export type BarrelNutModelPropsInput = z.input<typeof barrelNutModelPropsSchema>
export type BarrelNutModelProps = z.output<typeof barrelNutModelPropsSchema>
export type BarrelNutModelDefinition = z.output<
  typeof barrelNutModelDefinitionSchema
>
