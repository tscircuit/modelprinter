import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import {
  type BobbinMountMetricSize,
  validateBobbinMountProps,
} from "./validate"

export const bobbinMountMetricSizeSchema = z.enum([
  "M3",
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])

const shape = {
  outerDiameter: positive.default(25),
  height: positive.default(20),
  studDiameter: positive.optional(),
  studLength: positive.default(15),
  studStud: z.literal(true).default(true),
  metricSize: bobbinMountMetricSizeSchema.default("M6"),
}

function resolveStudDiameter<
  T extends { studDiameter?: number; metricSize: BobbinMountMetricSize },
>(props: T) {
  return {
    ...props,
    studDiameter: props.studDiameter ?? Number(props.metricSize.slice(1)),
  }
}

export const bobbinMountModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBobbinMountProps)
  .transform(resolveStudDiameter)

export const bobbinMountModelDefinitionSchema = z
  .object({ fn: z.literal("bobbinmount"), ...shape })
  .strict()
  .superRefine(validateBobbinMountProps)
  .transform(resolveStudDiameter)

export type BobbinMountModelPropsInput = z.input<
  typeof bobbinMountModelPropsSchema
>
export type BobbinMountModelProps = z.output<typeof bobbinMountModelPropsSchema>
export type BobbinMountModelDefinition = z.output<
  typeof bobbinMountModelDefinitionSchema
>
