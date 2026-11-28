import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDinRailProps } from "./validate"

const shape = {
  en60715Th35x75: z.literal(true).default(true),
  width: positive.default(35),
  height: positive.default(7.5),
  length: positive.default(150),
  sheetThickness: positive.default(1),
  baseWidth: positive.default(27),
  lipWidth: positive.default(4),
  topHat: z.literal(true).default(true),
  unslotted: z.boolean().default(true),
}

export const dinRailModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDinRailProps)

export const dinRailModelDefinitionSchema = z
  .object({ fn: z.literal("dinrail"), ...shape })
  .strict()
  .superRefine(validateDinRailProps)

export type DinRailModelPropsInput = z.input<typeof dinRailModelPropsSchema>
export type DinRailModelProps = z.output<typeof dinRailModelPropsSchema>
export type DinRailModelDefinition = z.output<
  typeof dinRailModelDefinitionSchema
>
