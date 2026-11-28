import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDrawnCupBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(10),
  outerDiameter: positive.default(14),
  width: positive.default(12),
  rows: z.literal(1).default(1),
  innerRing: z.number().int().min(0).max(1).default(0),
  cupStyle: z.enum(["openended", "closedend"]).default("openended"),
}

export const drawnCupBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDrawnCupBearingProps)

export const drawnCupBearingModelDefinitionSchema = z
  .object({ fn: z.literal("drawncupbearing"), ...shape })
  .strict()
  .superRefine(validateDrawnCupBearingProps)

export type DrawnCupBearingModelPropsInput = z.input<
  typeof drawnCupBearingModelPropsSchema
>
export type DrawnCupBearingModelProps = z.output<
  typeof drawnCupBearingModelPropsSchema
>
export type DrawnCupBearingModelDefinition = z.output<
  typeof drawnCupBearingModelDefinitionSchema
>
