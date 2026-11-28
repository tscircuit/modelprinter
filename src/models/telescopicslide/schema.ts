import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTelescopicSlideProps } from "./validate"

const shape = {
  length: positive.default(300),
  width: positive.default(40),
  height: positive.default(15),
  stages: z.union([z.literal(2), z.literal(3)]).default(3),
  sideHoles: z.literal(true).default(true),
  holeDiameter: positive.default(4),
  holePitch: positive.default(100),
  ballRace: z.literal(true).default(true),
}

export const telescopicSlideModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTelescopicSlideProps)

export const telescopicSlideModelDefinitionSchema = z
  .object({ fn: z.literal("telescopicslide"), ...shape })
  .strict()
  .superRefine(validateTelescopicSlideProps)

export type TelescopicSlideModelPropsInput = z.input<
  typeof telescopicSlideModelPropsSchema
>
export type TelescopicSlideModelProps = z.output<
  typeof telescopicSlideModelPropsSchema
>
export type TelescopicSlideModelDefinition = z.output<
  typeof telescopicSlideModelDefinitionSchema
>
