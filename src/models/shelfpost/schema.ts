import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateShelfPostProps } from "./validate"

const shape = {
  outerDiameter: positive.default(25),
  wallThickness: positive.default(1.5),
  length: positive.default(600),
  groovePitch: positive.default(25),
  grooveWidth: positive.default(2),
  grooveDepth: positive.default(1),
  firstGrooveZ: positive.default(25),
}

export const shelfPostModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateShelfPostProps)

export const shelfPostModelDefinitionSchema = z
  .object({ fn: z.literal("shelfpost"), ...shape })
  .strict()
  .superRefine(validateShelfPostProps)

export type ShelfPostModelPropsInput = z.input<typeof shelfPostModelPropsSchema>
export type ShelfPostModelProps = z.output<typeof shelfPostModelPropsSchema>
export type ShelfPostModelDefinition = z.output<
  typeof shelfPostModelDefinitionSchema
>
