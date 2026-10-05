import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine((value) => value > 0)
const nonnegativeLength = length.refine((value) => value >= 0)

/** Selected ISO metric coarse pitches in millimeters; not a tolerance table. */
export const threadedRodCoarsePitches = {
  M2: 0.4,
  "M2.5": 0.45,
  M3: 0.5,
  M4: 0.7,
  M5: 0.8,
  M6: 1,
  M8: 1.25,
  M10: 1.5,
  M12: 1.75,
  M16: 2,
  M20: 2.5,
} as const

export const threadedRodMetricSizeSchema = z.enum([
  "M2",
  "M2.5",
  "M3",
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
  "M16",
  "M20",
])

const shape = {
  spec: z.literal("custom").default("custom"),
  metricSize: threadedRodMetricSizeSchema,
  /** Overall end-plane distance, including terminal chamfers. */
  length: positiveLength,
  thread: z.literal("full").default("full"),
  ends: z.literal("flat").default("flat"),
  /** Equal axial and radial setbacks of the two 45-degree outer chamfers. */
  chamfer: nonnegativeLength.default(0),
  threadPitch: positiveLength.optional(),
  threadHand: z.enum(["right", "left"]).default("right"),
}

type UnresolvedProps = z.output<z.ZodObject<typeof shape>>

function resolve(props: UnresolvedProps) {
  return {
    ...props,
    threadPitch:
      props.threadPitch ?? threadedRodCoarsePitches[props.metricSize],
  }
}

function validate(props: UnresolvedProps, context: z.RefinementCtx) {
  const diameter = Number(props.metricSize.slice(1))
  const pitch = resolve(props).threadPitch
  if (diameter - 1.226869 * pitch <= 0)
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message:
        "Thread pitch must leave a positive external-thread root diameter",
    })
  if (props.chamfer >= Math.min(diameter / 2, props.length / 2))
    context.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Chamfer must leave flat end faces and separate end chamfers",
    })
}

export const threadedRodModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)

export const threadedRodModelDefinitionSchema = z
  .object({ fn: z.literal("threadedrod"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((model) => ({ fn: model.fn, ...resolve(model) }))

export type ThreadedRodModelPropsInput = z.input<
  typeof threadedRodModelPropsSchema
>
export type ThreadedRodModelProps = z.output<typeof threadedRodModelPropsSchema>
export type ThreadedRodModelDefinition = z.output<
  typeof threadedRodModelDefinitionSchema
>

/** Nominal 60-degree ISO external thread profile, without tolerances or runout. */
export function getThreadedRodDimensions(input: ThreadedRodModelPropsInput) {
  const props = threadedRodModelPropsSchema.parse(input)
  const diameter = Number(props.metricSize.slice(1))
  return {
    diameter,
    length: props.length,
    threadPitch: props.threadPitch,
    pitchDiameter: diameter - 0.649519 * props.threadPitch,
    minorDiameter: diameter - 1.226869 * props.threadPitch,
    endDiameter: diameter - 2 * props.chamfer,
  }
}
