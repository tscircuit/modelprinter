import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateGuardPostClampProps } from "./validate"

const shape = {
  insideWidth: positive.default(40),
  insideDepth: positive.default(40),
  height: positive.default(35),
  wallThickness: positive.default(5),
  earWidth: positive.default(15),
  earThickness: positive.default(8),
  earHoles: z.literal(2).default(2),
  holeDiameter: positive.default(8.5),
  earPitch: positive.default(60),
}

export const guardPostClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGuardPostClampProps)

export const guardPostClampModelDefinitionSchema = z
  .object({ fn: z.literal("guardpostclamp"), ...shape })
  .strict()
  .superRefine(validateGuardPostClampProps)

export type GuardPostClampModelPropsInput = z.input<
  typeof guardPostClampModelPropsSchema
>
export type GuardPostClampModelProps = z.output<
  typeof guardPostClampModelPropsSchema
>
export type GuardPostClampModelDefinition = z.output<
  typeof guardPostClampModelDefinitionSchema
>
