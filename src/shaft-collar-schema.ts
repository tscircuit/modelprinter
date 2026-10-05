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

/** Custom nominal geometry; dimensions normalize to millimeters. See docs/shaft-collar.md. */
const shape = {
  boreDiameter: positive,
  outerDiameter: positive,
  width: positive,
  screwZ: positive.optional(),
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
    screwZ: props.screwZ ?? props.width / 2,
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
  if (diameter >= p.boreDiameter)
    issue("Thread diameter must be smaller than the shaft bore")
  if (p.chamfer >= wall / 2 || p.chamfer >= p.width / 2)
    issue("Chamfer must leave material between the bore and exterior")
  if (
    p.screwZ - diameter / 2 <= p.chamfer ||
    p.screwZ + diameter / 2 >= p.width - p.chamfer
  )
    issue("Screw hole must clear both end faces and chamfers")
}

export const shaftCollarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const shaftCollarModelDefinitionSchema = z
  .object({ fn: z.literal("shaftcollar"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((props) => ({ fn: props.fn, ...resolve(props) }))
export type ShaftCollarModelPropsInput = z.input<
  typeof shaftCollarModelPropsSchema
>
export type ShaftCollarModelProps = z.output<typeof shaftCollarModelPropsSchema>
export type ShaftCollarModelDefinition = z.output<
  typeof shaftCollarModelDefinitionSchema
>

/** Nominal radial cutter reaches the bore across the full thread diameter. */
export function getShaftCollarDimensions(input: ShaftCollarModelPropsInput) {
  const p = shaftCollarModelPropsSchema.parse(input)
  const threadDiameter = hexSocketBoltDimensions[p.metricSize].diameter
  const radius = p.outerDiameter / 2
  const angle = (p.screwAngle * Math.PI) / 180
  return {
    threadDiameter,
    wallThickness: (p.outerDiameter - p.boreDiameter) / 2,
    screwHole: {
      start: [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        p.screwZ,
      ] as const,
      direction: [-Math.cos(angle), -Math.sin(angle), 0] as const,
      diameter: threadDiameter,
      depth:
        radius -
        Math.sqrt((p.boreDiameter / 2) ** 2 - (threadDiameter / 2) ** 2),
      threadPitch: p.threadPitch,
      threadHand: p.threadHand,
      threadGender: "female" as const,
      threadClass: p.threadClass,
    },
  }
}
