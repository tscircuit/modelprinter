import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateShelfSplitSleeveProps } from "./validate"

const shape = {
  innerDiameter: positive.default(25),
  height: positive.default(30),
  bottomOuterDiameter: positive.default(35),
  topOuterDiameter: positive.default(33),
  ridgeHeight: positive.default(1),
  ridgeWidth: positive.default(2),
  ridgeZ: positive.default(15),
  seamTabs: z.number().int().min(1).max(4).default(2),
  tabWidth: positive.default(4),
  tabHeight: positive.default(2),
}

export const shelfSplitSleeveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateShelfSplitSleeveProps)

export const shelfSplitSleeveModelDefinitionSchema = z
  .object({ fn: z.literal("shelfsplitsleeve"), ...shape })
  .strict()
  .superRefine(validateShelfSplitSleeveProps)

export type ShelfSplitSleeveModelPropsInput = z.input<
  typeof shelfSplitSleeveModelPropsSchema
>
export type ShelfSplitSleeveModelProps = z.output<
  typeof shelfSplitSleeveModelPropsSchema
>
export type ShelfSplitSleeveModelDefinition = z.output<
  typeof shelfSplitSleeveModelDefinitionSchema
>
