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

/** ISO 4029:2003 Table 1 nominal/minimum dimensions; docs/set-screw.md documents nominal cup and thread choices. */
export const setscrewDimensions = {
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    socketAcrossFlats: 1.5,
    socketDepth: 2,
    cupDiameter: 1.4,
    cupDepth: 0.40414518843273806,
    pointTaperLength: 0.8,
    mouthChamfer: 0.25,
    threadRootDiameter: 2.3865653389860224,
    threadPitchDiameter: 2.6752404735808355,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    socketAcrossFlats: 2,
    socketDepth: 2.5,
    cupDiameter: 2,
    cupDepth: 0.5773502691896258,
    pointTaperLength: 1.0,
    mouthChamfer: 0.35,
    threadRootDiameter: 3.141191474580432,
    threadPitchDiameter: 3.5453366630131695,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    socketAcrossFlats: 2.5,
    socketDepth: 3,
    cupDiameter: 2.5,
    cupDepth: 0.7216878364870323,
    pointTaperLength: 1.25,
    mouthChamfer: 0.4,
    threadRootDiameter: 4.018504542377636,
    threadPitchDiameter: 4.480384757729337,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    socketAcrossFlats: 3,
    socketDepth: 3.5,
    cupDiameter: 3,
    cupDepth: 0.8660254037844387,
    pointTaperLength: 1.5,
    mouthChamfer: 0.5,
    threadRootDiameter: 4.773130677972045,
    threadPitchDiameter: 5.350480947161671,
  },
} as const
export const setscrewMetricSizeSchema = z.enum(["M3", "M4", "M5", "M6"])
const shape = {
  iso4029: z.literal(true).default(true),
  metricSize: setscrewMetricSizeSchema,
  length: positiveLength,
  hexSocket: z.literal(true).default(true),
  cupPoint: z.literal(true).default(true),
  leftHand: z.boolean().default(false),
  showThreads: z.boolean().default(true),
  diameter: positiveLength.optional(),
  threadPitch: positiveLength.optional(),
  socketAcrossFlats: positiveLength.optional(),
  socketDepth: positiveLength.optional(),
  cupDiameter: positiveLength.optional(),
  cupDepth: positiveLength.optional(),
  pointTaperLength: positiveLength.optional(),
  mouthChamfer: positiveLength.optional(),
  threadRootDiameter: positiveLength.optional(),
  threadPitchDiameter: positiveLength.optional(),
}
type Unresolved = z.output<z.ZodObject<typeof shape>>
const validate = (props: Unresolved, context: z.RefinementCtx) => {
  const dimensions = setscrewDimensions[props.metricSize]
  for (const key of Object.keys(dimensions) as (keyof typeof dimensions)[]) {
    if (
      props[key] !== undefined &&
      Math.abs(props[key]! - dimensions[key]) > 1e-9
    )
      context.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key} contradicts ISO 4029:2003 ${props.metricSize}`,
      })
  }
  if (
    props.length <=
    dimensions.socketDepth + dimensions.cupDepth + dimensions.pointTaperLength
  )
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Length must leave material between fixed end features",
    })
}
export const setscrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform((props) => ({ ...props, ...setscrewDimensions[props.metricSize] }))
export const setscrewModelDefinitionSchema = z
  .object({ fn: z.literal("setscrew"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((props) => ({ ...props, ...setscrewDimensions[props.metricSize] }))
export type SetScrewMetricSize = z.infer<typeof setscrewMetricSizeSchema>
export type SetScrewModelPropsInput = z.input<typeof setscrewModelPropsSchema>
export type SetScrewModelProps = z.output<typeof setscrewModelPropsSchema>
export type SetScrewModelDefinition = z.output<
  typeof setscrewModelDefinitionSchema
>
