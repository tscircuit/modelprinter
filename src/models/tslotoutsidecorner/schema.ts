import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateTSlotOutsideCornerProps } from "./validate"

const shape = {
  width: positive.default(40),
  /** Equal external leg extents measured from the virtual outside corner X=Z=0. */
  legLength: positive.default(40),
  thickness: positive.default(4),
  angle: z.literal(90).default(90),
  holeCount: z.literal(4).default(4),
  holeDiameter: positive.default(5),
  holePitch: positive.default(20),
  holeOffset: positive.default(20),
  bendRadius: nonnegative.default(4),
}

export const tSlotOutsideCornerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotOutsideCornerProps)

export const tSlotOutsideCornerModelDefinitionSchema = z
  .object({ fn: z.literal("tslotoutsidecorner"), ...shape })
  .strict()
  .superRefine(validateTSlotOutsideCornerProps)

export type TSlotOutsideCornerModelPropsInput = z.input<
  typeof tSlotOutsideCornerModelPropsSchema
>
export type TSlotOutsideCornerModelProps = z.output<
  typeof tSlotOutsideCornerModelPropsSchema
>
export type TSlotOutsideCornerModelDefinition = z.output<
  typeof tSlotOutsideCornerModelDefinitionSchema
>
