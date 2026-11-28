import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateThumbNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(4),
  outerDiameter: positive.default(12),
  height: positive.default(6),
  knurlPitch: positive.default(1),
  chamfer: nonnegative.default(0.5),
  boreStyle: z.enum(["through", "blind"]).default("through"),
  knurlStyle: z
    .enum(["straightknurl", "diamondknurl"])
    .default("straightknurl"),
}

export const thumbNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateThumbNutProps)

export const thumbNutModelDefinitionSchema = z
  .object({ fn: z.literal("thumbnut"), ...shape })
  .strict()
  .superRefine(validateThumbNutProps)

export type ThumbNutModelPropsInput = z.input<typeof thumbNutModelPropsSchema>
export type ThumbNutModelProps = z.output<typeof thumbNutModelPropsSchema>
export type ThumbNutModelDefinition = z.output<
  typeof thumbNutModelDefinitionSchema
>
