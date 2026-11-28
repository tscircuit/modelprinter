import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFuseBlockProps } from "./validate"

const shape = {
  fuseDiameter: positive.default(10),
  fuseLength: positive.default(38),
  width: positive.default(25),
  length: positive.default(60),
  height: positive.default(18),
  clipOuterDiameter: positive.default(10),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(4),
  holePitch: positive.default(48),
}

export const fuseBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFuseBlockProps)

export const fuseBlockModelDefinitionSchema = z
  .object({ fn: z.literal("fuseblock"), ...shape })
  .strict()
  .superRefine(validateFuseBlockProps)

export type FuseBlockModelPropsInput = z.input<typeof fuseBlockModelPropsSchema>
export type FuseBlockModelProps = z.output<typeof fuseBlockModelPropsSchema>
export type FuseBlockModelDefinition = z.output<
  typeof fuseBlockModelDefinitionSchema
>
