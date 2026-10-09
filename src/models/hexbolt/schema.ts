import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const positiveModelLengthSchema = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")

/** iso4017:2014, pinned nominal dimensions; see docs/hex-bolt.md for table choices and datum.
 * Source: https://cdn.standards.iteh.ai/samples/63206/dd63a69c4be3432aac1914bccda73b2c/ISO-4017-2014.pdf
 * Derived basic thread diameters use ISO metric 60-degree profile proportions.
 */
export const hexBoltDimensions = {
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    headAcrossFlats: 5.5,
    headHeight: 2,
    underHeadRadius: 0.1,
    headChamferAngle: 30,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.25,
    threadRootDiameter: 2.3865653389860224,
    threadPitchDiameter: 2.6752404735808355,
    headCornerDiameter: 6.3508529610858835,
    headChamferDiameter: 5.5,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    headAcrossFlats: 7,
    headHeight: 2.8,
    underHeadRadius: 0.2,
    headChamferAngle: 30,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.35,
    threadRootDiameter: 3.141191474580432,
    threadPitchDiameter: 3.5453366630131695,
    headCornerDiameter: 8.082903768654761,
    headChamferDiameter: 7,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headAcrossFlats: 8,
    headHeight: 3.5,
    underHeadRadius: 0.2,
    headChamferAngle: 30,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.4,
    threadRootDiameter: 4.018504542377636,
    threadPitchDiameter: 4.480384757729337,
    headCornerDiameter: 9.237604307034013,
    headChamferDiameter: 8,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headAcrossFlats: 10,
    headHeight: 4,
    underHeadRadius: 0.25,
    headChamferAngle: 30,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.5,
    threadRootDiameter: 4.773130677972045,
    threadPitchDiameter: 5.350480947161671,
    headCornerDiameter: 11.547005383792516,
    headChamferDiameter: 10,
  },
} as const

export const hexBoltMetricSizeSchema = z.enum(["M3", "M4", "M5", "M6"])
const hexBoltModelPropsShape = {
  iso4017: z.literal(true).default(true),
  metricSize: hexBoltMetricSizeSchema,
  length: positiveModelLengthSchema,
  thread: z.literal("full").default("full"),
  drive: z.literal("hex").default("hex"),
  threadHand: z.enum(["right", "left"]).default("right"),
  threadClass: z.literal("6g").default("6g"),
  threadGender: z.literal("male").default("male"),
  showThreads: z.boolean().default(true),
  diameter: positiveModelLengthSchema.optional(),
  threadPitch: positiveModelLengthSchema.optional(),
  headAcrossFlats: positiveModelLengthSchema.optional(),
  headHeight: positiveModelLengthSchema.optional(),
  underHeadRadius: positiveModelLengthSchema.optional(),
  headChamferAngle: z.number().finite().positive().optional(),
  tipChamferAngle: z.number().finite().positive().optional(),
  threadFlankAngle: z.number().finite().positive().optional(),
  tipChamfer: positiveModelLengthSchema.optional(),
  threadRootDiameter: positiveModelLengthSchema.optional(),
  threadPitchDiameter: positiveModelLengthSchema.optional(),
  headCornerDiameter: positiveModelLengthSchema.optional(),
  headChamferDiameter: positiveModelLengthSchema.optional(),
}

type CheckedProps = z.output<z.ZodObject<typeof hexBoltModelPropsShape>>
const validateHexBolt = (props: CheckedProps, context: z.RefinementCtx) => {
  const dimensions = hexBoltDimensions[props.metricSize]
  for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    if (
      props[key] !== undefined &&
      Math.abs(props[key]! - dimensions[key]) > 1e-9
    ) {
      context.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key} contradicts ISO 4017:2014 ${props.metricSize}`,
      })
    }
  }
  if (props.length <= dimensions.underHeadRadius + dimensions.tipChamfer) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Length must separate the under-head fillet and fixed tip chamfer",
    })
  }
}

export const hexBoltModelPropsSchema = z
  .object(hexBoltModelPropsShape)
  .strict()
  .superRefine(validateHexBolt)
  .transform((props) => ({ ...props, ...hexBoltDimensions[props.metricSize] }))

export const hexBoltModelDefinitionSchema = z
  .object({
    fn: z.literal("hexbolt"),
    ...hexBoltModelPropsShape,
  })
  .strict()
  .superRefine(validateHexBolt)
  .transform((props) => ({ ...props, ...hexBoltDimensions[props.metricSize] }))

export type HexBoltMetricSize = z.infer<typeof hexBoltMetricSizeSchema>
export type HexBoltModelPropsInput = z.input<typeof hexBoltModelPropsSchema>
export type HexBoltModelProps = z.output<typeof hexBoltModelPropsSchema>
export type HexBoltModelDefinition = z.output<
  typeof hexBoltModelDefinitionSchema
>
