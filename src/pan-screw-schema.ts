import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"

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

/** iso7045:2011, pinned nominal dimensions; see docs/pan-screw.md for table choices and datum.
 * Source: https://cdn.standards.iteh.ai/samples/57372/08630d724c1544b195c2e6bb92cfb888/ISO-7045-2011.pdf
 * Derived basic thread diameters use ISO metric 60-degree profile proportions.
 */
export const panScrewDimensions = {
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.6,
    headHeight: 2.4,
    crownRadius: 5,
    underHeadRadius: 0.1,
    recessNumber: 1,
    recessReferenceDiameter: 3,
    recessPenetration: 1.4,
    maximumThreadLength: 25,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.25,
    threadRootDiameter: 2.3865653389860224,
    threadPitchDiameter: 2.6752404735808355,
    recessB: 0.97,
    recessE: 0.435,
    recessG: 1.27,
    recessF: 0.535,
    recessRadius: 0.5,
    recessT1: 0.34,
    recessAlpha: 138,
    recessBeta: 7,
    recessOuterWingAngle: 26.5,
    recessInnerWingAngle: 28,
    recessReferencePlaneHeight: 2.169696007084728,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    headDiameter: 8,
    headHeight: 3.1,
    crownRadius: 6.5,
    underHeadRadius: 0.2,
    recessNumber: 2,
    recessReferenceDiameter: 4.4,
    recessPenetration: 1.9,
    maximumThreadLength: 38,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.35,
    threadRootDiameter: 3.141191474580432,
    threadPitchDiameter: 3.5453366630131695,
    recessB: 1.47,
    recessE: 0.815,
    recessG: 2.29,
    recessF: 0.7,
    recessRadius: 0.6,
    recessT1: 0.61,
    recessAlpha: 140,
    recessBeta: 5.75,
    recessOuterWingAngle: 26.5,
    recessInnerWingAngle: 28,
    recessReferencePlaneHeight: 2.7163714733492106,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headDiameter: 9.5,
    headHeight: 3.7,
    crownRadius: 8,
    underHeadRadius: 0.2,
    recessNumber: 2,
    recessReferenceDiameter: 4.9,
    recessPenetration: 2.4,
    maximumThreadLength: 38,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.4,
    threadRootDiameter: 4.018504542377636,
    threadPitchDiameter: 4.480384757729337,
    recessB: 1.47,
    recessE: 0.815,
    recessG: 2.29,
    recessF: 0.7,
    recessRadius: 0.6,
    recessT1: 0.61,
    recessAlpha: 140,
    recessBeta: 5.75,
    recessOuterWingAngle: 26.5,
    recessInnerWingAngle: 28,
    recessReferencePlaneHeight: 3.315608971054121,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headDiameter: 12,
    headHeight: 4.6,
    crownRadius: 10,
    underHeadRadius: 0.25,
    recessNumber: 3,
    recessReferenceDiameter: 6.9,
    recessPenetration: 3.1,
    maximumThreadLength: 38,
    tipChamferAngle: 45,
    threadFlankAngle: 60,
    tipChamfer: 0.5,
    threadRootDiameter: 4.773130677972045,
    threadPitchDiameter: 5.350480947161671,
    recessB: 2.41,
    recessE: 2.005,
    recessG: 3.81,
    recessF: 0.825,
    recessRadius: 0.8,
    recessT1: 1.01,
    recessAlpha: 146,
    recessBeta: 5.75,
    recessOuterWingAngle: 26.5,
    recessInnerWingAngle: 28,
    recessReferencePlaneHeight: 3.986026848459362,
  },
} as const

export const panScrewMetricSizeSchema = z.enum(["M3", "M4", "M5", "M6"])
export const panScrewStandardSchema = z
  .enum(["iso7045", "iso7045:2011"])
  .default("iso7045")
  .transform(() => "iso7045:2011" as const)

const panScrewModelPropsShape = {
  standard: panScrewStandardSchema,
  metricSize: panScrewMetricSizeSchema,
  length: positiveModelLengthSchema,
  thread: z.literal("full").default("full"),
  drive: z.literal("phillips").default("phillips"),
  threadHand: z.enum(["right", "left"]).default("right"),
  threadClass: z.literal("6g").default("6g"),
  threadGender: z.literal("male").default("male"),
  showThreads: z.boolean().default(true),
  recessStandard: z.literal("iso4757:1983").default("iso4757:1983"),
  recessType: z.literal("H").default("H"),
  diameter: positiveModelLengthSchema.optional(),
  threadPitch: positiveModelLengthSchema.optional(),
  headDiameter: positiveModelLengthSchema.optional(),
  headHeight: positiveModelLengthSchema.optional(),
  crownRadius: positiveModelLengthSchema.optional(),
  underHeadRadius: positiveModelLengthSchema.optional(),
  recessNumber: z.number().finite().positive().optional(),
  recessReferenceDiameter: positiveModelLengthSchema.optional(),
  recessPenetration: positiveModelLengthSchema.optional(),
  maximumThreadLength: positiveModelLengthSchema.optional(),
  tipChamferAngle: z.number().finite().positive().optional(),
  threadFlankAngle: z.number().finite().positive().optional(),
  tipChamfer: positiveModelLengthSchema.optional(),
  threadRootDiameter: positiveModelLengthSchema.optional(),
  threadPitchDiameter: positiveModelLengthSchema.optional(),
  recessB: positiveModelLengthSchema.optional(),
  recessE: positiveModelLengthSchema.optional(),
  recessG: positiveModelLengthSchema.optional(),
  recessF: positiveModelLengthSchema.optional(),
  recessRadius: positiveModelLengthSchema.optional(),
  recessT1: positiveModelLengthSchema.optional(),
  recessAlpha: z.number().finite().positive().optional(),
  recessBeta: z.number().finite().positive().optional(),
  recessOuterWingAngle: z.number().finite().positive().optional(),
  recessInnerWingAngle: z.number().finite().positive().optional(),
  recessReferencePlaneHeight: positiveModelLengthSchema.optional(),
}

type CheckedProps = z.output<z.ZodObject<typeof panScrewModelPropsShape>>
const validatePanScrew = (props: CheckedProps, context: z.RefinementCtx) => {
  const dimensions = panScrewDimensions[props.metricSize]
  for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    if (
      props[key] !== undefined &&
      Math.abs(props[key]! - dimensions[key]) > 1e-9
    ) {
      context.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key} contradicts ${props.standard} ${props.metricSize}`,
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
  if (props.length > dimensions.maximumThreadLength + 1e-9) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "This contract supports full-thread screws only; length exceeds the pinned thread-length range",
    })
  }
}

export const panScrewModelPropsSchema = z
  .object(panScrewModelPropsShape)
  .strict()
  .superRefine(validatePanScrew)
  .transform((props) => ({ ...props, ...panScrewDimensions[props.metricSize] }))

export const panScrewModelDefinitionSchema = z
  .object({
    fn: z.literal("panscrew"),
    ...panScrewModelPropsShape,
  })
  .strict()
  .superRefine(validatePanScrew)
  .transform((props) => ({ ...props, ...panScrewDimensions[props.metricSize] }))

export type PanScrewMetricSize = z.infer<typeof panScrewMetricSizeSchema>
export type PanScrewModelPropsInput = z.input<typeof panScrewModelPropsSchema>
export type PanScrewModelProps = z.output<typeof panScrewModelPropsSchema>
export type PanScrewModelDefinition = z.output<
  typeof panScrewModelDefinitionSchema
>
