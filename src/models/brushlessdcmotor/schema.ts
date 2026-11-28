import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { metricBoltSizeSchema } from "../../hex-socket-bolt-schema"
import { normalizeBrushlessDcMotorProps } from "./normalize"
import { validateBrushlessDcMotorProps } from "./validate"

const shape = {
  outerDiameter: positive.default(42),
  length: positive.default(40),
  shaftDiameter: positive.default(5),
  shaftLength: positive.default(15),
  boltPitchCircleDiameter: positive.default(30),
  face4Hole: z.literal(true).default(true),
  metricSize: metricBoltSizeSchema.default("M3"),
  outrunner: z.literal(true).default(true),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const brushlessDcMotorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBrushlessDcMotorProps)
  .transform(normalizeBrushlessDcMotorProps)

export const brushlessDcMotorModelDefinitionSchema = z
  .object({ fn: z.literal("brushlessdcmotor"), ...shape })
  .strict()
  .superRefine(validateBrushlessDcMotorProps)
  .transform(normalizeBrushlessDcMotorProps)

export type BrushlessDcMotorModelPropsInput = z.input<
  typeof brushlessDcMotorModelPropsSchema
>
export type BrushlessDcMotorModelProps = z.output<
  typeof brushlessDcMotorModelPropsSchema
>
export type BrushlessDcMotorModelDefinition = z.output<
  typeof brushlessDcMotorModelDefinitionSchema
>
