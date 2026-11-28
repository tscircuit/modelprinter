import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateWallCaseProps } from "./validate"

const shape = {
  width: positive.default(200),
  depth: positive.default(80),
  height: positive.default(250),
  wallThickness: positive.default(3),
  cornerRadius: nonNegative.default(3),
  leftPivotDoor: z.literal(true).default(true),
  mounts: z.literal(4).default(4),
  holeDiameter: positive.default(6),
  holePitchX: positive.default(180),
  holePitchY: positive.default(220),
}

export const wallCaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWallCaseProps)

export const wallCaseModelDefinitionSchema = z
  .object({ fn: z.literal("wallcase"), ...shape })
  .strict()
  .superRefine(validateWallCaseProps)

export type WallCaseModelPropsInput = z.input<typeof wallCaseModelPropsSchema>
export type WallCaseModelProps = z.output<typeof wallCaseModelPropsSchema>
export type WallCaseModelDefinition = z.output<
  typeof wallCaseModelDefinitionSchema
>
