import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSnapClipProps } from "./validate"

const shape = {
  standoffHeight: positive.default(10),
  baseOuterDiameter: positive.default(8),
  stemDiameter: positive.default(3),
  boardThickness: positive.default(1.6),
  barbOuterDiameter: positive.default(4),
  splitArrow: z.literal(true).default(true),
  screwFoot: z.literal(true).default(true),
  screwDiameter: positive.default(3),
}

export const snapClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSnapClipProps)

export const snapClipModelDefinitionSchema = z
  .object({ fn: z.literal("pcbsnapclip"), ...shape })
  .strict()
  .superRefine(validateSnapClipProps)

export type SnapClipModelPropsInput = z.input<typeof snapClipModelPropsSchema>
export type SnapClipModelProps = z.output<typeof snapClipModelPropsSchema>
export type SnapClipModelDefinition = z.output<
  typeof snapClipModelDefinitionSchema
>
