import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFootCupProps } from "./validate"

const shape = {
  innerDiameter: positive.default(30),
  outerDiameter: positive.default(40),
  height: positive.default(10),
  floorThickness: positive.default(3),
  mounts: z.literal(2).default(2),
  holeDiameter: positive.default(3),
  holePitch: positive.default(50),
}

export const footCupModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFootCupProps)

export const footCupModelDefinitionSchema = z
  .object({ fn: z.literal("footcup"), ...shape })
  .strict()
  .superRefine(validateFootCupProps)

export type FootCupModelPropsInput = z.input<typeof footCupModelPropsSchema>
export type FootCupModelProps = z.output<typeof footCupModelPropsSchema>
export type FootCupModelDefinition = z.output<
  typeof footCupModelDefinitionSchema
>
