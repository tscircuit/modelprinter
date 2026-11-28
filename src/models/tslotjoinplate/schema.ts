import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotJoinPlateProps } from "./validate"

const shape = {
  length: positive.default(80),
  width: positive.default(20),
  thickness: positive.default(4),
  slotCount: z.number().int().min(2).max(64).default(4),
  slot: z.tuple([positive, positive]).default([5, 10]),
  pitch: positive.default(20),
}

export const tSlotJoinPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotJoinPlateProps)

export const tSlotJoinPlateModelDefinitionSchema = z
  .object({ fn: z.literal("tslotjoinplate"), ...shape })
  .strict()
  .superRefine(validateTSlotJoinPlateProps)

export type TSlotJoinPlateModelPropsInput = z.input<
  typeof tSlotJoinPlateModelPropsSchema
>
export type TSlotJoinPlateModelProps = z.output<
  typeof tSlotJoinPlateModelPropsSchema
>
export type TSlotJoinPlateModelDefinition = z.output<
  typeof tSlotJoinPlateModelDefinitionSchema
>
