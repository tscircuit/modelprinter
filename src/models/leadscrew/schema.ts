import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegativeLength = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)

/** De-facto TR8/P2 variants; ISO 2901:2016 profile, not an ISO 2902 size-table claim. */
const sizes = {
  TR8x2: { diameter: 8, pitch: 2, lead: 2, starts: 1 },
  "TR8x8(P2)": { diameter: 8, pitch: 2, lead: 8, starts: 4 },
} as const

const threadShape = {
  profile: z
    .enum(["iso2901", "iso2901:2016"])
    .default("iso2901")
    .transform(() => "iso2901:2016" as const),
  threadSize: z.enum(["TR8x2", "TR8x8(P2)"]),
  threadPitch: positiveLength.optional(),
  threadLead: positiveLength.optional(),
  threadStarts: z.union([z.literal(1), z.literal(4)]).optional(),
  threadHand: z.enum(["right", "left"]).default("right"),
}
function validateThread(
  props: z.output<z.ZodObject<typeof threadShape>>,
  context: z.RefinementCtx,
) {
  const size = sizes[props.threadSize]
  for (const [property, expected] of [
    ["threadPitch", size.pitch],
    ["threadLead", size.lead],
    ["threadStarts", size.starts],
  ] as const) {
    const value = props[property]
    if (value !== undefined && Math.abs(value - expected) > 1e-9)
      context.addIssue({
        code: "custom",
        path: [property],
        message:
          "Pitch, lead and starts must agree with the selected TR designation (lead = pitch × starts)",
      })
  }
}
function resolveThread<T extends z.output<z.ZodObject<typeof threadShape>>>(
  props: T,
) {
  const size = sizes[props.threadSize]
  return {
    ...props,
    threadPitch: size.pitch,
    threadLead: size.lead,
    threadStarts: size.starts,
  }
}

/** ISO 2901:2016 clause 6/Table 2, P=2: ac=0.25; sharp nominal design-profile corners. */
function threadDimensions(props: ReturnType<typeof resolveThread>) {
  const diameter = sizes[props.threadSize].diameter
  const pitch = props.threadPitch
  const crestClearance = 0.25
  return {
    diameter,
    threadPitch: pitch,
    threadLead: props.threadLead,
    threadStarts: props.threadStarts,
    includedAngle: 30,
    crestClearance,
    pitchDiameter: diameter - pitch / 2,
    externalMinorDiameter: diameter - pitch - 2 * crestClearance,
    internalMinorDiameter: diameter - pitch,
    internalMajorDiameter: diameter + 2 * crestClearance,
  }
}

const shape = {
  ...threadShape,
  length: positiveLength,
  chamfer: nonnegativeLength.default(0.25),
}
type UnresolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(props: UnresolvedProps, context: z.RefinementCtx) {
  validateThread(props, context)
  if (props.chamfer >= Math.min(props.length / 2, 4))
    context.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Chamfer must leave end faces and separate end chamfers",
    })
}
export const leadScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolveThread)
export const leadScrewModelDefinitionSchema = z
  .object({ fn: z.literal("leadscrew"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(resolveThread)
export type LeadScrewModelPropsInput = z.input<typeof leadScrewModelPropsSchema>
export type LeadScrewModelProps = z.output<typeof leadScrewModelPropsSchema>
export type LeadScrewModelDefinition = z.output<
  typeof leadScrewModelDefinitionSchema
>
/** Z=0 and Z=length are end planes. Right hand advances +X→+Y with increasing Z. */
export function getLeadScrewDimensions(input: LeadScrewModelPropsInput) {
  const props = leadScrewModelPropsSchema.parse(input)
  return {
    ...threadDimensions(props),
    length: props.length,
    endDiameter: 8 - 2 * props.chamfer,
    bottomZ: 0,
    topZ: props.length,
  }
}
