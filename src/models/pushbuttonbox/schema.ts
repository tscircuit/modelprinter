import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validatePushbuttonBoxProps } from "./validate"

const shape = {
  width: positive.default(80),
  depth: positive.default(80),
  height: positive.default(65),
  wallThickness: positive.default(3),
  cornerRadius: nonNegative.default(4),
  lidThickness: positive.default(3),
  cutoutDiameter: positive.default(22.5),
  screwOnLid: z.literal(true).default(true),
  screws: z.literal(4).default(4),
  holePitchX: positive.default(62),
  holePitchY: positive.default(62),
}

export const pushbuttonBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePushbuttonBoxProps)

export const pushbuttonBoxModelDefinitionSchema = z
  .object({ fn: z.literal("pushbuttonbox"), ...shape })
  .strict()
  .superRefine(validatePushbuttonBoxProps)

export type PushbuttonBoxModelPropsInput = z.input<
  typeof pushbuttonBoxModelPropsSchema
>
export type PushbuttonBoxModelProps = z.output<
  typeof pushbuttonBoxModelPropsSchema
>
export type PushbuttonBoxModelDefinition = z.output<
  typeof pushbuttonBoxModelDefinitionSchema
>
