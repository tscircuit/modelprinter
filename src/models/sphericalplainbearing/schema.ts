import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSphericalPlainBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  outerDiameter: positive.default(35),
  width: positive.default(16),
  misalignmentAngle: z.number().gt(0).max(30).default(8),
  radial: z.literal(true).default(true),
  closure: z.enum(["open", "sealed"]).default("open"),
}

export const sphericalPlainBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSphericalPlainBearingProps)

export const sphericalPlainBearingModelDefinitionSchema = z
  .object({ fn: z.literal("sphericalplainbearing"), ...shape })
  .strict()
  .superRefine(validateSphericalPlainBearingProps)

export type SphericalPlainBearingModelPropsInput = z.input<
  typeof sphericalPlainBearingModelPropsSchema
>
export type SphericalPlainBearingModelProps = z.output<
  typeof sphericalPlainBearingModelPropsSchema
>
export type SphericalPlainBearingModelDefinition = z.output<
  typeof sphericalPlainBearingModelDefinitionSchema
>
