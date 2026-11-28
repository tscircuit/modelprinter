import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateReedCapsuleProps } from "./validate"

const shape = {
  outerDiameter: positive.default(3),
  bodyLength: positive.default(15),
  leadOuterDiameter: positive.default(0.5),
  leadLength: positive.default(10),
  axialGlass: z.literal(true).default(true),
  contacts: z.literal(2).default(2),
  throughHole: z.literal(true).default(true),
}

export const reedCapsuleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateReedCapsuleProps)

export const reedCapsuleModelDefinitionSchema = z
  .object({ fn: z.literal("reedcapsule"), ...shape })
  .strict()
  .superRefine(validateReedCapsuleProps)

export type ReedCapsuleModelPropsInput = z.input<
  typeof reedCapsuleModelPropsSchema
>
export type ReedCapsuleModelProps = z.output<typeof reedCapsuleModelPropsSchema>
export type ReedCapsuleModelDefinition = z.output<
  typeof reedCapsuleModelDefinitionSchema
>
