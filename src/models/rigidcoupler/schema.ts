import { z } from "zod"
import {
  hexSocketBoltDimensions,
  metricBoltSizeSchema,
} from "../../hex-socket-bolt-schema"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(
        /^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete length with a supported unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positive = length.refine((value) => value > 0, "Length must be positive")
const nonnegative = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)

/** Custom nominal geometry; dimensions normalize to millimeters. See docs/rigid-coupler.md. */
const shape = {
  boreDiameter: positive,
  outerDiameter: positive,
  boreBDiameter: positive.optional(),
  length: positive,
  screwCount: z.literal(4).default(4),
  screwEndOffset: positive.optional(),
  screwAngle: z.number().finite().default(0),
  mount: z.literal("setscrew").default("setscrew"),
  metricSize: metricBoltSizeSchema,
  threadPitch: positive.optional(),
  threadHand: z.enum(["right", "left"]).default("right"),
  threadClass: z.literal("6H").default("6H"),
  chamfer: nonnegative.default(0),
}
type InputProps = z.output<z.ZodObject<typeof shape>>

function resolve(props: InputProps) {
  const threadPitch =
    props.threadPitch ?? hexSocketBoltDimensions[props.metricSize].threadPitch
  return {
    ...props,
    threadPitch,
    boreBDiameter: props.boreBDiameter ?? props.boreDiameter,
    screwEndOffset: props.screwEndOffset ?? props.length / 4,
    screwAngle: ((props.screwAngle % 360) + 360) % 360,
  }
}

function validate(props: InputProps, context: z.RefinementCtx) {
  const p = resolve(props)
  const issue = (message: string) =>
    context.addIssue({ code: "custom", message })
  const diameter = hexSocketBoltDimensions[p.metricSize].diameter
  if (!Number.isFinite(p.outerDiameter ** 2))
    issue("Derived dimensions must be finite")
  const wall = (p.outerDiameter - p.boreDiameter) / 2
  if (wall <= 0) issue("Outer diameter must exceed the bore diameter")
  if (p.threadPitch >= diameter)
    issue("Thread pitch must be smaller than its nominal diameter")
  const minimumWall =
    (p.outerDiameter - Math.max(p.boreDiameter, p.boreBDiameter)) / 2
  if (minimumWall <= 0)
    issue("Both bores must be smaller than the outer diameter")
  if (Math.SQRT2 * diameter >= Math.min(p.boreDiameter, p.boreBDiameter))
    issue(
      "Both bores must separate the perpendicular screw holes with material",
    )
  if (p.chamfer >= minimumWall / 2 || p.chamfer >= p.length / 2)
    issue("Chamfer must leave material between the bore and exterior")
  if (p.screwEndOffset - diameter / 2 <= p.chamfer)
    issue("Screw holes must clear the end chamfers")
  if (p.length - 2 * p.screwEndOffset <= diameter)
    issue("Each end must have a separate, nonintersecting screw-hole plane")
}

export const rigidCouplerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const rigidCouplerModelDefinitionSchema = z
  .object({ fn: z.literal("rigidcoupler"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((props) => ({ fn: props.fn, ...resolve(props) }))
export type RigidCouplerModelPropsInput = z.input<
  typeof rigidCouplerModelPropsSchema
>
export type RigidCouplerModelProps = z.output<
  typeof rigidCouplerModelPropsSchema
>
export type RigidCouplerModelDefinition = z.output<
  typeof rigidCouplerModelDefinitionSchema
>

/** Four radial cutter cylinders, ordered end A at 0/90 degrees, then end B. */
export function getRigidCouplerDimensions(input: RigidCouplerModelPropsInput) {
  const p = rigidCouplerModelPropsSchema.parse(input)
  const threadDiameter = hexSocketBoltDimensions[p.metricSize].diameter
  const radius = p.outerDiameter / 2
  const screwHoles = [
    { bore: p.boreDiameter, z: p.screwEndOffset, angle: p.screwAngle },
    { bore: p.boreDiameter, z: p.screwEndOffset, angle: p.screwAngle + 90 },
    {
      bore: p.boreBDiameter,
      z: p.length - p.screwEndOffset,
      angle: p.screwAngle,
    },
    {
      bore: p.boreBDiameter,
      z: p.length - p.screwEndOffset,
      angle: p.screwAngle + 90,
    },
  ].map((hole) => {
    const angle = (hole.angle * Math.PI) / 180
    return {
      start: [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        hole.z,
      ] as const,
      direction: [-Math.cos(angle), -Math.sin(angle), 0] as const,
      diameter: threadDiameter,
      depth:
        radius - Math.sqrt((hole.bore / 2) ** 2 - (threadDiameter / 2) ** 2),
      threadPitch: p.threadPitch,
      threadHand: p.threadHand,
      threadGender: "female" as const,
      threadClass: p.threadClass,
    }
  })
  return {
    threadDiameter,
    boreADepth: p.length / 2,
    boreBDepth: p.length / 2,
    screwHoles,
  }
}
