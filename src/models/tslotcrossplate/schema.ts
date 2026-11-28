import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotCrossPlateProps } from "./validate"

const shape = {
  width: positive.default(80),
  height: positive.default(80),
  armWidth: positive.default(20),
  thickness: positive.default(4),
  holes: z.number().int().min(5).max(9).default(5),
  holeDiameter: positive.default(5),
  holePitch: positive.default(30),
  crossShape: z.literal(true).default(true),
}

export const tSlotCrossPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotCrossPlateProps)

export const tSlotCrossPlateModelDefinitionSchema = z
  .object({ fn: z.literal("tslotcrossplate"), ...shape })
  .strict()
  .superRefine(validateTSlotCrossPlateProps)

export type TSlotCrossPlateModelPropsInput = z.input<
  typeof tSlotCrossPlateModelPropsSchema
>
export type TSlotCrossPlateModelProps = z.output<
  typeof tSlotCrossPlateModelPropsSchema
>
export type TSlotCrossPlateModelDefinition = z.output<
  typeof tSlotCrossPlateModelDefinitionSchema
>
