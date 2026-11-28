import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotCornerCubeProps } from "./validate"

const shape = {
  width: positive.default(20),
  height: positive.default(20),
  depth: positive.default(20),
  holeDiameter: positive.default(5),
  counterboreDiameter: positive.default(9),
  counterboreDepth: positive.default(3),
  xyzAxes: z.literal(true).default(true),
}

export const tSlotCornerCubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotCornerCubeProps)

export const tSlotCornerCubeModelDefinitionSchema = z
  .object({ fn: z.literal("tslotcornercube"), ...shape })
  .strict()
  .superRefine(validateTSlotCornerCubeProps)

export type TSlotCornerCubeModelPropsInput = z.input<
  typeof tSlotCornerCubeModelPropsSchema
>
export type TSlotCornerCubeModelProps = z.output<
  typeof tSlotCornerCubeModelPropsSchema
>
export type TSlotCornerCubeModelDefinition = z.output<
  typeof tSlotCornerCubeModelDefinitionSchema
>
