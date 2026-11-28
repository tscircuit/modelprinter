import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateIBeamProps } from "./validate"

const shape = {
  height: positive.default(80),
  width: positive.default(46),
  webThickness: positive.default(3.8),
  flangeThickness: positive.default(5.2),
  rootRadius: nonnegative.default(5),
  length: positive.default(300),
  ipe80: z.literal(true).default(true),
  en10365: z.literal(true).default(true),
}

export const iBeamModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateIBeamProps)

export const iBeamModelDefinitionSchema = z
  .object({ fn: z.literal("ibeam"), ...shape })
  .strict()
  .superRefine(validateIBeamProps)

export type IBeamModelPropsInput = z.input<typeof iBeamModelPropsSchema>
export type IBeamModelProps = z.output<typeof iBeamModelPropsSchema>
export type IBeamModelDefinition = z.output<typeof iBeamModelDefinitionSchema>
