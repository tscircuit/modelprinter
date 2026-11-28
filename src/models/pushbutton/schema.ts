import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePushbuttonProps } from "./validate"

const shape = {
  cutoutDiameter: positive.default(22.5),
  bodyOuterDiameter: positive.default(22),
  rearLength: positive.default(40),
  headOuterDiameter: positive.default(28),
  headHeight: positive.default(5),
  roundMomentary: z.literal(true).default(true),
  threadNut: z.literal(true).default(true),
  rearBlock: z.literal(true).default(true),
}

export const pushbuttonModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePushbuttonProps)

export const pushbuttonModelDefinitionSchema = z
  .object({ fn: z.literal("pushbutton"), ...shape })
  .strict()
  .superRefine(validatePushbuttonProps)

export type PushbuttonModelPropsInput = z.input<
  typeof pushbuttonModelPropsSchema
>
export type PushbuttonModelProps = z.output<typeof pushbuttonModelPropsSchema>
export type PushbuttonModelDefinition = z.output<
  typeof pushbuttonModelDefinitionSchema
>
