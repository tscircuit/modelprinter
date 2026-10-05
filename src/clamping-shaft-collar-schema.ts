import { z } from "zod"
import {
  hexSocketBoltDimensions,
  metricBoltSizeSchema,
} from "./hex-socket-bolt-schema"
import { modelLengthSchema } from "./model-length-schema"

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

/** Custom nominal geometry; dimensions normalize to millimeters. See docs/clamping-shaft-collar.md. */
const shape = {
  boreDiameter: positive,
  outerDiameter: positive,
  width: positive,
  screwZ: positive.optional(),
  splitWidth: positive,
  clampX: positive.optional(),
  clearanceHoleDiameter: positive.optional(),
  mount: z.literal("singleclamp").default("singleclamp"),
  metricSize: metricBoltSizeSchema,
  threadPitch: positive.optional(),
  threadHand: z.enum(["right", "left"]).default("right"),
  threadClass: z.literal("6H").default("6H"),
  chamfer: nonnegative.default(0),
}
type InputProps = z.output<z.ZodObject<typeof shape>>

function resolve(props: InputProps) {
  const threadDiameter = hexSocketBoltDimensions[props.metricSize].diameter
  const threadPitch =
    props.threadPitch ?? hexSocketBoltDimensions[props.metricSize].threadPitch
  return {
    ...props,
    threadPitch,
    screwZ: props.screwZ ?? props.width / 2,
    clampX: props.clampX ?? (props.outerDiameter + props.boreDiameter) / 4,
    clearanceHoleDiameter: props.clearanceHoleDiameter ?? threadDiameter + 0.5,
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
  if (p.splitWidth >= p.boreDiameter)
    issue("Split width must be smaller than the shaft bore")
  if (p.clearanceHoleDiameter <= diameter)
    issue("Clearance hole diameter must exceed the thread diameter")
  const radius = p.clearanceHoleDiameter / 2
  if (
    p.clampX - radius <= p.boreDiameter / 2 ||
    p.clampX + radius >= p.outerDiameter / 2
  )
    issue(
      "Clamp hole must fit within the radial wall without intersecting the shaft bore",
    )
  if (
    p.screwZ - radius <= p.chamfer ||
    p.screwZ + radius >= p.width - p.chamfer
  )
    issue("Clamp hole must clear both end faces and chamfers")
  if (p.chamfer >= wall / 2 || p.chamfer >= p.width / 2)
    issue("Chamfer must leave material between the bore and exterior")
  const outerRadius = p.outerDiameter / 2
  if (
    p.clampX + radius < outerRadius &&
    p.splitWidth / 2 >= Math.sqrt(outerRadius ** 2 - (p.clampX + radius) ** 2)
  )
    issue("Split must leave material around both sides of the clamping bore")
}

export const clampingShaftCollarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const clampingShaftCollarModelDefinitionSchema = z
  .object({ fn: z.literal("clampingshaftcollar"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((props) => ({ fn: props.fn, ...resolve(props) }))
export type ClampingShaftCollarModelPropsInput = z.input<
  typeof clampingShaftCollarModelPropsSchema
>
export type ClampingShaftCollarModelProps = z.output<
  typeof clampingShaftCollarModelPropsSchema
>
export type ClampingShaftCollarModelDefinition = z.output<
  typeof clampingShaftCollarModelDefinitionSchema
>

/** Tangential clearance and tapped cutter cylinders on opposite sides of the slit. */
export function getClampingShaftCollarDimensions(
  input: ClampingShaftCollarModelPropsInput,
) {
  const p = clampingShaftCollarModelPropsSchema.parse(input)
  const threadDiameter = hexSocketBoltDimensions[p.metricSize].diameter
  const radius = p.outerDiameter / 2
  const clearanceExtent = Math.sqrt(
    radius ** 2 - (p.clampX - p.clearanceHoleDiameter / 2) ** 2,
  )
  const threadedExtent = Math.sqrt(
    radius ** 2 - (p.clampX - threadDiameter / 2) ** 2,
  )
  return {
    threadDiameter,
    split: {
      xMin: 0,
      xMax: radius,
      yMin: -p.splitWidth / 2,
      yMax: p.splitWidth / 2,
      zMin: 0,
      zMax: p.width,
    },
    clearanceHole: {
      start: [p.clampX, -clearanceExtent, p.screwZ] as const,
      direction: [0, 1, 0] as const,
      diameter: p.clearanceHoleDiameter,
      depth: clearanceExtent - p.splitWidth / 2,
    },
    threadedHole: {
      start: [p.clampX, p.splitWidth / 2, p.screwZ] as const,
      direction: [0, 1, 0] as const,
      diameter: threadDiameter,
      depth: threadedExtent - p.splitWidth / 2,
      threadPitch: p.threadPitch,
      threadHand: p.threadHand,
      threadGender: "female" as const,
      threadClass: p.threadClass,
    },
  }
}
