import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBarrelJackProps } from "./validate"

const shape = {
  boxJack: z.literal(true).default(true),
  plugOuterDiameter: positive.default(5.5),
  centerPinDiameter: positive.default(2.1),
  width: positive.default(9),
  height: positive.default(11),
  length: positive.default(14.5),
  throughHole: z.literal(true).default(true),
  horizontal: z.literal(true).default(true),
  contacts: z.literal(3).default(3),
  frontCenterRear: z.literal(true).default(true),
}

export const barrelJackModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBarrelJackProps)

export const barrelJackModelDefinitionSchema = z
  .object({ fn: z.literal("barreljack"), ...shape })
  .strict()
  .superRefine(validateBarrelJackProps)

export type BarrelJackModelPropsInput = z.input<
  typeof barrelJackModelPropsSchema
>
export type BarrelJackModelProps = z.output<typeof barrelJackModelPropsSchema>
export type BarrelJackModelDefinition = z.output<
  typeof barrelJackModelDefinitionSchema
>
