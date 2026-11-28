import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBusbarSupportProps } from "./validate"

const shape = {
  width: positive.default(35),
  depth: positive.default(25),
  height: positive.default(30),
  seatWidth: positive.default(15),
  seatDepth: positive.default(6),
  flangeThickness: positive.default(5),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(4),
  holePitch: positive.default(25),
  saddle: z.literal(true).default(true),
}

export const busbarSupportModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBusbarSupportProps)

export const busbarSupportModelDefinitionSchema = z
  .object({ fn: z.literal("busbarsupport"), ...shape })
  .strict()
  .superRefine(validateBusbarSupportProps)

export type BusbarSupportModelPropsInput = z.input<
  typeof busbarSupportModelPropsSchema
>
export type BusbarSupportModelProps = z.output<
  typeof busbarSupportModelPropsSchema
>
export type BusbarSupportModelDefinition = z.output<
  typeof busbarSupportModelDefinitionSchema
>
