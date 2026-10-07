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
  style: z.enum(["flanged", "cylindrical"]).default("flanged"),
  bodyDiameter: positiveLength.default(12),
  length: positiveLength.default(15),
  radialClearance: nonnegativeLength.default(0.05),
  boreChamfer: nonnegativeLength.default(1.5),
  flangeDiameter: nonnegativeLength.optional(),
  flangeThickness: nonnegativeLength.optional(),
  mountHoleCount: z.union([z.literal(0), z.literal(4)]).optional(),
  mountHoleDiameter: nonnegativeLength.optional(),
  mountHoleCircleDiameter: nonnegativeLength.optional(),
}
type UnresolvedProps = z.output<z.ZodObject<typeof shape>>
function resolve(props: UnresolvedProps) {
  const flanged = props.style === "flanged"
  const mountHoleCount = props.mountHoleCount ?? (flanged ? 4 : 0)
  return {
    ...resolveThread(props),
    flangeDiameter: props.flangeDiameter ?? (flanged ? 22 : 0),
    flangeThickness: props.flangeThickness ?? (flanged ? 3 : 0),
    mountHoleCount,
    mountHoleDiameter: props.mountHoleDiameter ?? (mountHoleCount ? 3.5 : 0),
    mountHoleCircleDiameter:
      props.mountHoleCircleDiameter ?? (mountHoleCount ? 16 : 0),
  }
}
function validate(input: UnresolvedProps, context: z.RefinementCtx) {
  validateThread(input, context)
  const props = resolve(input)
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const rootDiameter = 8.5 + 2 * props.radialClearance
  const mouthDiameter = 6 + 2 * props.radialClearance + 2 * props.boreChamfer
  if (props.bodyDiameter <= Math.max(rootDiameter, mouthDiameter))
    issue(
      "bodyDiameter",
      "Body must leave a positive wall outside the thread and bore mouth",
    )
  if (props.boreChamfer !== 0 && props.boreChamfer < 1.25)
    issue(
      "boreChamfer",
      "A bore lead-in must clear the full nominal thread depth (at least1.25mm), or be zero",
    )
  if (props.boreChamfer >= props.length / 2)
    issue("boreChamfer", "Bore chamfers must remain separate")
  if (props.style === "cylindrical") {
    if (
      props.flangeDiameter !== 0 ||
      props.flangeThickness !== 0 ||
      props.mountHoleCount !== 0
    )
      issue(
        "style",
        "Cylindrical nuts cannot have a flange or flange mounting holes",
      )
  } else {
    if (props.flangeDiameter <= props.bodyDiameter)
      issue("flangeDiameter", "Flange must be wider than the body")
    if (props.flangeThickness <= 0 || props.flangeThickness >= props.length)
      issue(
        "flangeThickness",
        "Flange thickness must be positive and less than overall length",
      )
  }
  if (props.mountHoleCount === 0) {
    if (props.mountHoleDiameter !== 0 || props.mountHoleCircleDiameter !== 0)
      issue(
        "mountHoleCount",
        "Zero holes requires zero hole diameter and bolt-circle diameter",
      )
  } else {
    const inside = props.mountHoleCircleDiameter - props.mountHoleDiameter
    const outside = props.mountHoleCircleDiameter + props.mountHoleDiameter
    if (
      props.mountHoleDiameter <= 0 ||
      inside <= props.bodyDiameter ||
      outside >= props.flangeDiameter
    )
      issue(
        "mountHoleCircleDiameter",
        "Mounting holes must leave positive ligaments to the body and flange rim",
      )
    if (props.mountHoleDiameter >= props.mountHoleCircleDiameter / Math.SQRT2)
      issue("mountHoleDiameter", "Adjacent mounting holes must remain separate")
  }
}
export const leadScrewNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const leadScrewNutModelDefinitionSchema = z
  .object({ fn: z.literal("leadscrewnut"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(({ fn, ...props }) => ({ fn, ...resolve(props) }))
export type LeadScrewNutModelPropsInput = z.input<
  typeof leadScrewNutModelPropsSchema
>
export type LeadScrewNutModelProps = z.output<
  typeof leadScrewNutModelPropsSchema
>
export type LeadScrewNutModelDefinition = z.output<
  typeof leadScrewNutModelDefinitionSchema
>
/** Flange underside/mounting plane Z=0; body top Z=length; holes at +X,+Y,-X,-Y. */
export function getLeadScrewNutDimensions(input: LeadScrewNutModelPropsInput) {
  const props = leadScrewNutModelPropsSchema.parse(input)
  const thread = threadDimensions(props)
  return {
    ...thread,
    boreMinorDiameter: thread.internalMinorDiameter + 2 * props.radialClearance,
    boreMajorDiameter: thread.internalMajorDiameter + 2 * props.radialClearance,
    borePitchDiameter: thread.pitchDiameter + 2 * props.radialClearance,
    mouthDiameter:
      thread.internalMinorDiameter +
      2 * props.radialClearance +
      2 * props.boreChamfer,
    bodyDiameter: props.bodyDiameter,
    length: props.length,
    flangeDiameter: props.flangeDiameter,
    flangeThickness: props.flangeThickness,
    mountHoleCount: props.mountHoleCount,
    mountHoleDiameter: props.mountHoleDiameter,
    mountHoleCircleDiameter: props.mountHoleCircleDiameter,
    bearingZ: 0,
    topZ: props.length,
    mountHoleCenters: Array.from(
      { length: props.mountHoleCount },
      (_, i) =>
        [
          (props.mountHoleCircleDiameter / 2) * Math.cos((i * Math.PI) / 2),
          (props.mountHoleCircleDiameter / 2) * Math.sin((i * Math.PI) / 2),
        ] as const,
    ),
  }
}
