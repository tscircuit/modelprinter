import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateOvalFlangeBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(20),
  length: positive.default(100),
  width: positive.default(45),
  depth: positive.default(35),
  face2Hole: z.literal(true).default(true),
  holePitch: positive.default(80),
  holeDiameter: positive.default(10),
}

export const ovalFlangeBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateOvalFlangeBearingProps)

export const ovalFlangeBearingModelDefinitionSchema = z
  .object({ fn: z.literal("ovalflangebearing"), ...shape })
  .strict()
  .superRefine(validateOvalFlangeBearingProps)

export type OvalFlangeBearingModelPropsInput = z.input<
  typeof ovalFlangeBearingModelPropsSchema
>
export type OvalFlangeBearingModelProps = z.output<
  typeof ovalFlangeBearingModelPropsSchema
>
export type OvalFlangeBearingModelDefinition = z.output<
  typeof ovalFlangeBearingModelDefinitionSchema
>
