import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateEnclosureLidProps } from "./validate"

const shape = {
  width: positive.default(100),
  depth: positive.default(70),
  thickness: positive.default(2),
  cornerRadius: nonNegative.default(3),
  rimWidth: positive.default(2),
  rimDepth: positive.default(6),
  holes: z.literal(4).default(4),
  holeDiameter: positive.default(3),
  holePitchX: positive.default(88),
  holePitchY: positive.default(58),
}

export const enclosureLidModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEnclosureLidProps)

export const enclosureLidModelDefinitionSchema = z
  .object({ fn: z.literal("enclosurelid"), ...shape })
  .strict()
  .superRefine(validateEnclosureLidProps)

export type EnclosureLidModelPropsInput = z.input<
  typeof enclosureLidModelPropsSchema
>
export type EnclosureLidModelProps = z.output<
  typeof enclosureLidModelPropsSchema
>
export type EnclosureLidModelDefinition = z.output<
  typeof enclosureLidModelDefinitionSchema
>
