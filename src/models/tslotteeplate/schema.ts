import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotTeePlateProps } from "./validate"

const shape = {
  width: positive.default(80),
  height: positive.default(60),
  armWidth: positive.default(20),
  thickness: positive.default(4),
  holes: z.number().int().min(3).max(9).default(5),
  holeDiameter: positive.default(5),
  holePitch: positive.default(20),
  teeShape: z.literal(true).default(true),
}

export const tSlotTeePlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotTeePlateProps)

export const tSlotTeePlateModelDefinitionSchema = z
  .object({ fn: z.literal("tslotteeplate"), ...shape })
  .strict()
  .superRefine(validateTSlotTeePlateProps)

export type TSlotTeePlateModelPropsInput = z.input<
  typeof tSlotTeePlateModelPropsSchema
>
export type TSlotTeePlateModelProps = z.output<
  typeof tSlotTeePlateModelPropsSchema
>
export type TSlotTeePlateModelDefinition = z.output<
  typeof tSlotTeePlateModelDefinitionSchema
>
