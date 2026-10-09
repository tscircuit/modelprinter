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

/** iso10642:2019, pinned nominal dimensions; see docs/flat-head-screw.md for table choices and datum.
 * Source: https://www.westfieldfasteners.co.uk/Standards/ScrewBolt-SHCsk-M.html
 * Derived basic thread diameters use ISO metric 60-degree profile proportions.
 */
export const flatHeadScrewDimensions = {
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 6.72,
    headHeight: 1.86,
    socketAcrossFlats: 2,
    socketDepth: 1.1,
    underHeadRadius: 0.1,
    maximumThreadLength: 18,
    headAngle: 90,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.25,
    threadRootDiameter: 2.3865653389860224,
    threadPitchDiameter: 2.6752404735808355,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    headDiameter: 8.96,
    headHeight: 2.48,
    socketAcrossFlats: 2.5,
    socketDepth: 1.5,
    underHeadRadius: 0.2,
    maximumThreadLength: 20,
    headAngle: 90,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.35,
    threadRootDiameter: 3.141191474580432,
    threadPitchDiameter: 3.5453366630131695,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headDiameter: 11.2,
    headHeight: 3.1,
    socketAcrossFlats: 3,
    socketDepth: 1.9,
    underHeadRadius: 0.2,
    maximumThreadLength: 22,
    headAngle: 90,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.4,
    threadRootDiameter: 4.018504542377636,
    threadPitchDiameter: 4.480384757729337,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headDiameter: 13.44,
    headHeight: 3.72,
    socketAcrossFlats: 4,
    socketDepth: 2.2,
    underHeadRadius: 0.25,
    maximumThreadLength: 24,
    headAngle: 90,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.5,
    threadRootDiameter: 4.773130677972045,
    threadPitchDiameter: 5.350480947161671,
  },
} as const

export const flatHeadScrewMetricSizeSchema = z.enum(["M3", "M4", "M5", "M6"])
const flatHeadScrewModelPropsShape = {
  iso10642: z.literal(true).default(true),
  metricSize: flatHeadScrewMetricSizeSchema,
  length: positiveModelLengthSchema,
  thread: z.literal("full").default("full"),
  drive: z.literal("hexsocket").default("hexsocket"),
  threadHand: z.enum(["right", "left"]).default("right"),
  threadClass: z.literal("6g").default("6g"),
  threadGender: z.literal("male").default("male"),
  showThreads: z.boolean().default(true),
  diameter: positiveModelLengthSchema.optional(),
  threadPitch: positiveModelLengthSchema.optional(),
  headDiameter: positiveModelLengthSchema.optional(),
  headHeight: positiveModelLengthSchema.optional(),
  socketAcrossFlats: positiveModelLengthSchema.optional(),
  socketDepth: positiveModelLengthSchema.optional(),
  underHeadRadius: positiveModelLengthSchema.optional(),
  maximumThreadLength: positiveModelLengthSchema.optional(),
  headAngle: z.number().finite().positive().optional(),
  tipChamferAngle: z.number().finite().positive().optional(),
  threadFlankAngle: z.number().finite().positive().optional(),
  tipChamfer: positiveModelLengthSchema.optional(),
  threadRootDiameter: positiveModelLengthSchema.optional(),
  threadPitchDiameter: positiveModelLengthSchema.optional(),
}

type CheckedProps = z.output<z.ZodObject<typeof flatHeadScrewModelPropsShape>>
const validateFlatHeadScrew = (
  props: CheckedProps,
  context: z.RefinementCtx,
) => {
  const dimensions = flatHeadScrewDimensions[props.metricSize]
  for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    if (
      props[key] !== undefined &&
      Math.abs(props[key]! - dimensions[key]) > 1e-9
    ) {
      context.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key} contradicts ISO 10642:2019 ${props.metricSize}`,
      })
    }
  }
  if (props.length <= dimensions.tipChamfer) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Length must exceed the fixed tip chamfer",
    })
  }
  if (
    props.length <=
    dimensions.headHeight + dimensions.underHeadRadius + dimensions.tipChamfer
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Overall length must leave a shank beyond the countersunk head, under-head fillet and tip chamfer",
    })
  }
  if (
    props.length - dimensions.headHeight >
    dimensions.maximumThreadLength + 1e-9
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "This contract supports full-thread screws only; length exceeds the pinned thread-length range",
    })
  }
}

export const flatHeadScrewModelPropsSchema = z
  .object(flatHeadScrewModelPropsShape)
  .strict()
  .superRefine(validateFlatHeadScrew)
  .transform((props) => ({
    ...props,
    ...flatHeadScrewDimensions[props.metricSize],
  }))

export const flatHeadScrewModelDefinitionSchema = z
  .object({
    fn: z.literal("flatheadscrew"),
    ...flatHeadScrewModelPropsShape,
  })
  .strict()
  .superRefine(validateFlatHeadScrew)
  .transform((props) => ({
    ...props,
    ...flatHeadScrewDimensions[props.metricSize],
  }))

export type FlatHeadScrewMetricSize = z.infer<
  typeof flatHeadScrewMetricSizeSchema
>
export type FlatHeadScrewModelPropsInput = z.input<
  typeof flatHeadScrewModelPropsSchema
>
export type FlatHeadScrewModelProps = z.output<
  typeof flatHeadScrewModelPropsSchema
>
export type FlatHeadScrewModelDefinition = z.output<
  typeof flatHeadScrewModelDefinitionSchema
>
