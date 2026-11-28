import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDinRailClipProps } from "./validate"

const shape = {
  th35x75: z.literal(true).default(true),
  width: positive.default(20),
  depth: positive.default(35),
  height: positive.default(8),
  thickness: positive.default(1),
  hooks: z.literal(2).default(2),
  holeDiameter: positive.default(4),
  springLeaf: z.literal(true).default(true),
}

export const dinRailClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDinRailClipProps)

export const dinRailClipModelDefinitionSchema = z
  .object({ fn: z.literal("dinrailclip"), ...shape })
  .strict()
  .superRefine(validateDinRailClipProps)

export type DinRailClipModelPropsInput = z.input<
  typeof dinRailClipModelPropsSchema
>
export type DinRailClipModelProps = z.output<typeof dinRailClipModelPropsSchema>
export type DinRailClipModelDefinition = z.output<
  typeof dinRailClipModelDefinitionSchema
>
