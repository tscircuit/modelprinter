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
  .refine((value) => value > 0, "Length must be positive")
const turnCount = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER)
const shape = {
  spec: z.literal("custom").default("custom"),
  outerDiameter: length,
  wireDiameter: length,
  freeLength: length,
  totalTurns: turnCount.min(3),
  /** Closed-ground ends have exactly one inactive turn at each end. */
  activeTurns: turnCount.optional(),
  ends: z.literal("closedground").default("closedground"),
  hand: z.enum(["right", "left"]).default("right"),
  state: z.literal("free").default("free"),
}
function validate(
  props: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (props.outerDiameter <= 2 * props.wireDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Outer diameter must exceed twice the wire diameter to leave a positive bore",
    })
  if (
    props.activeTurns !== undefined &&
    props.activeTurns !== props.totalTurns - 2
  )
    context.addIssue({
      code: "custom",
      path: ["activeTurns"],
      message: "Closed-ground ends require totalTurns = activeTurns + 2",
    })
  const solidHeight = props.totalTurns * props.wireDiameter
  if (!Number.isFinite(solidHeight) || props.freeLength <= solidHeight)
    context.addIssue({
      code: "custom",
      path: ["freeLength"],
      message:
        "Free length must exceed the finite solid height totalTurns * wireDiameter",
    })
}
function normalize<T extends z.output<z.ZodObject<typeof shape>>>(props: T) {
  return { ...props, activeTurns: props.activeTurns ?? props.totalTurns - 2 }
}
/** Custom construction version 1, defined exactly in docs/compression-spring.md. */
export const compressionSpringModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const compressionSpringModelDefinitionSchema = z
  .object({ fn: z.literal("compressionspring"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(normalize)
export type CompressionSpringModelPropsInput = z.input<
  typeof compressionSpringModelPropsSchema
>
export type CompressionSpringModelProps = z.output<
  typeof compressionSpringModelPropsSchema
>
export type CompressionSpringModelDefinition = z.output<
  typeof compressionSpringModelDefinitionSchema
>

/** Resolved nominal lengths in mm, using the documented radial/axial wire section. */
export function getCompressionSpringDimensions(
  input: CompressionSpringModelPropsInput,
) {
  const props = compressionSpringModelPropsSchema.parse(input)
  return {
    outerDiameter: props.outerDiameter,
    wireDiameter: props.wireDiameter,
    insideDiameter: props.outerDiameter - 2 * props.wireDiameter,
    meanDiameter: props.outerDiameter - props.wireDiameter,
    freeLength: props.freeLength,
    totalTurns: props.totalTurns,
    activeTurns: props.activeTurns,
    endTurns: 1,
    endPitch: props.wireDiameter,
    activePitch:
      (props.freeLength - 2 * props.wireDiameter) / props.activeTurns,
    solidHeight: props.totalTurns * props.wireDiameter,
    availableTravel: props.freeLength - props.totalTurns * props.wireDiameter,
    lowerBearingZ: 0,
    upperBearingZ: props.freeLength,
  }
}

/** A point on the nominal wire centerline. `turn` runs from 0 to totalTurns.
 * This produces reference coordinates only; no geometry or mesh is generated.
 */
export function getCompressionSpringCenterlinePoint(
  input: CompressionSpringModelPropsInput,
  turn: number,
) {
  const props = compressionSpringModelPropsSchema.parse(input)
  if (!Number.isFinite(turn) || turn < 0 || turn > props.totalTurns)
    throw new Error("Turn coordinate must be finite and within [0,totalTurns]")
  const radius = (props.outerDiameter - props.wireDiameter) / 2
  const pitch = (props.freeLength - 2 * props.wireDiameter) / props.activeTurns
  const phase = (props.hand === "right" ? 1 : -1) * 2 * Math.PI * (turn % 1)
  const z =
    turn <= 1
      ? props.wireDiameter * turn
      : turn >= props.totalTurns - 1
        ? props.freeLength - props.wireDiameter * (props.totalTurns - turn)
        : props.wireDiameter + pitch * (turn - 1)
  return { x: radius * Math.cos(phase), y: radius * Math.sin(phase), z }
}
