import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const positiveLength = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")

/** ISO 4162:2012 head envelope: Figures 1–3 and Table 1, checked against the identical GOST ISO 4162-2014 adoption; docs/flange-bolt.md distinguishes full-thread extension. */
export const flangeboltDimensions = {
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headAcrossFlats: 7,
    headHeight: 5.6,
    flangeDiameter: 11.4,
    flangeThickness: 1,
    underHeadRadius: 0.2,
    tipChamfer: 0.4,
    headChamferAngle: 30,
    headChamferDiameter: 7,
    headCornerDiameter: 8.082903768654761,
    flangeSlopeAngle: 22.5,
    threadRootDiameter: 4.018504542377636,
    threadPitchDiameter: 4.480384757729337,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headAcrossFlats: 8,
    headHeight: 6.8,
    flangeDiameter: 13.6,
    flangeThickness: 1.1,
    underHeadRadius: 0.25,
    tipChamfer: 0.5,
    headChamferAngle: 30,
    headChamferDiameter: 8,
    headCornerDiameter: 9.237604307034013,
    flangeSlopeAngle: 22.5,
    threadRootDiameter: 4.773130677972045,
    threadPitchDiameter: 5.350480947161671,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    headAcrossFlats: 10,
    headHeight: 8.5,
    flangeDiameter: 17,
    flangeThickness: 1.2,
    underHeadRadius: 0.4,
    tipChamfer: 0.625,
    headChamferAngle: 30,
    headChamferDiameter: 10,
    headCornerDiameter: 11.547005383792516,
    flangeSlopeAngle: 22.5,
    threadRootDiameter: 6.466413347465057,
    threadPitchDiameter: 7.188101183952089,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    headAcrossFlats: 13,
    headHeight: 9.7,
    flangeDiameter: 20.8,
    flangeThickness: 1.5,
    underHeadRadius: 0.4,
    tipChamfer: 0.75,
    headChamferAngle: 30,
    headChamferDiameter: 13,
    headCornerDiameter: 15.01110699893027,
    flangeSlopeAngle: 22.5,
    threadRootDiameter: 8.159696016958067,
    threadPitchDiameter: 9.025721420742506,
  },
} as const
export const flangeboltMetricSizeSchema = z.enum(["M5", "M6", "M8", "M10"])
const shape = {
  iso4162: z.literal(true).default(true),
  metricSize: flangeboltMetricSizeSchema,
  length: positiveLength,
  fullThread: z.literal(true).default(true),
  plainFace: z.literal(true).default(true),
  leftHand: z.boolean().default(false),
  showThreads: z.boolean().default(true),
  diameter: positiveLength.optional(),
  threadPitch: positiveLength.optional(),
  headAcrossFlats: positiveLength.optional(),
  headHeight: positiveLength.optional(),
  flangeDiameter: positiveLength.optional(),
  flangeThickness: positiveLength.optional(),
  underHeadRadius: positiveLength.optional(),
  tipChamfer: positiveLength.optional(),
  headChamferAngle: z.number().finite().positive().optional(),
  headChamferDiameter: positiveLength.optional(),
  headCornerDiameter: positiveLength.optional(),
  flangeSlopeAngle: z.number().finite().positive().optional(),
  threadRootDiameter: positiveLength.optional(),
  threadPitchDiameter: positiveLength.optional(),
}
type Unresolved = z.output<z.ZodObject<typeof shape>>
const validate = (props: Unresolved, context: z.RefinementCtx) => {
  const dimensions = flangeboltDimensions[props.metricSize]
  for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    if (
      props[key] !== undefined &&
      Math.abs(props[key]! - dimensions[key]) > 1e-9
    )
      context.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key} contradicts ISO 4162:2012 ${props.metricSize}`,
      })
  }
  if (props.length <= dimensions.underHeadRadius + dimensions.tipChamfer)
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Length must leave material between fixed end features",
    })
}
export const flangeboltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform((props) => ({
    ...props,
    ...flangeboltDimensions[props.metricSize],
  }))
export const flangeboltModelDefinitionSchema = z
  .object({ fn: z.literal("flangebolt"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((props) => ({
    ...props,
    ...flangeboltDimensions[props.metricSize],
  }))
export type FlangeBoltMetricSize = z.infer<typeof flangeboltMetricSizeSchema>
export type FlangeBoltModelPropsInput = z.input<
  typeof flangeboltModelPropsSchema
>
export type FlangeBoltModelProps = z.output<typeof flangeboltModelPropsSchema>
export type FlangeBoltModelDefinition = z.output<
  typeof flangeboltModelDefinitionSchema
>
