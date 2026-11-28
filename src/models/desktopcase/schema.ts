import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateDesktopCaseProps } from "./validate"

const shape = {
  width: positive.default(160),
  depth: positive.default(120),
  height: positive.default(50),
  wallThickness: positive.default(2),
  cornerRadius: nonNegative.default(4),
  bezelDepth: positive.default(5),
  bottomScrewLid: z.literal(true).default(true),
  screws: z.literal(4).default(4),
  holePitchX: positive.default(140),
  holePitchY: positive.default(100),
}

export const desktopCaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDesktopCaseProps)

export const desktopCaseModelDefinitionSchema = z
  .object({ fn: z.literal("desktopcase"), ...shape })
  .strict()
  .superRefine(validateDesktopCaseProps)

export type DesktopCaseModelPropsInput = z.input<
  typeof desktopCaseModelPropsSchema
>
export type DesktopCaseModelProps = z.output<typeof desktopCaseModelPropsSchema>
export type DesktopCaseModelDefinition = z.output<
  typeof desktopCaseModelDefinitionSchema
>
