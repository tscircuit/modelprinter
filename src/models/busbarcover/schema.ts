import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBusbarCoverProps } from "./validate"

const shape = {
  length: positive.default(100),
  innerWidth: positive.default(30),
  innerHeight: positive.default(20),
  thickness: positive.default(2),
  lipWidth: positive.default(2),
  inwardUChannel: z.literal(true).default(true),
}

export const busbarCoverModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBusbarCoverProps)

export const busbarCoverModelDefinitionSchema = z
  .object({ fn: z.literal("busbarcover"), ...shape })
  .strict()
  .superRefine(validateBusbarCoverProps)

export type BusbarCoverModelPropsInput = z.input<
  typeof busbarCoverModelPropsSchema
>
export type BusbarCoverModelProps = z.output<typeof busbarCoverModelPropsSchema>
export type BusbarCoverModelDefinition = z.output<
  typeof busbarCoverModelDefinitionSchema
>
