import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { metricBoltSizeSchema } from "../../hex-socket-bolt-schema"
import { normalizeBrushDcMotorProps } from "./normalize"
import { validateBrushDcMotorProps } from "./validate"

const shape = {
  outerDiameter: positive.default(36),
  length: positive.default(60),
  shaftDiameter: positive.default(5),
  shaftLength: positive.default(15),
  face2Hole: z.literal(true).default(true),
  pitchCircleDiameter: positive.default(25),
  metricSize: metricBoltSizeSchema.default("M3"),
  roundCan: z.literal(true).default(true),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const brushDcMotorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBrushDcMotorProps)
  .transform(normalizeBrushDcMotorProps)

export const brushDcMotorModelDefinitionSchema = z
  .object({ fn: z.literal("brushdcmotor"), ...shape })
  .strict()
  .superRefine(validateBrushDcMotorProps)
  .transform(normalizeBrushDcMotorProps)

export type BrushDcMotorModelPropsInput = z.input<
  typeof brushDcMotorModelPropsSchema
>
export type BrushDcMotorModelProps = z.output<
  typeof brushDcMotorModelPropsSchema
>
export type BrushDcMotorModelDefinition = z.output<
  typeof brushDcMotorModelDefinitionSchema
>
