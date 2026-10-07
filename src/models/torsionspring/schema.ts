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
const positive = length.refine((value) => value > 0, "Length must be positive")

const shape = {
  outerDiameter: positive.default(8),
  wireDiameter: positive.default(0.8),
  /** Fractional turns set the relative leg direction. */
  turns: z.number().finite().min(1).max(128).default(3.25),
  /** Axial centerline advance per turn; deliberately open coils. */
  pitch: positive.optional(),
  startLegLength: positive.default(10),
  endLegLength: positive.default(14),
  leftHand: z.boolean().default(false),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function normalize(p: Resolved) {
  return { ...p, pitch: p.pitch ?? p.wireDiameter * 1.25 }
}
function validate(p: Resolved, context: z.RefinementCtx) {
  if (p.outerDiameter < 3 * p.wireDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer diameter must be at least three wire diameters",
    })
  const pitch = p.pitch ?? p.wireDiameter * 1.25
  if (pitch < 1.1 * p.wireDiameter)
    context.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Open coils require pitch at least 1.1 times wire diameter",
    })
  if (
    !Number.isFinite(
      Math.hypot(Math.PI * (p.outerDiameter - p.wireDiameter), pitch) *
        p.turns +
        p.startLegLength +
        p.endLegLength,
    )
  )
    context.addIssue({
      code: "custom",
      message: "Spring dimensions must remain finite",
    })
}
/** Generic free-state helix with straight tangent extensions, not a load model. */
export const torsionSpringModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const torsionSpringModelDefinitionSchema = z
  .object({ fn: z.literal("torsionspring"), ...shape })
  .strict()
  .superRefine(validate)
  .transform((p) => ({ ...normalize(p), fn: p.fn }))
export type TorsionSpringModelPropsInput = z.input<
  typeof torsionSpringModelPropsSchema
>
export type TorsionSpringModelProps = z.output<
  typeof torsionSpringModelPropsSchema
>
export type TorsionSpringModelDefinition = z.output<
  typeof torsionSpringModelDefinitionSchema
>
export type TorsionSpringPoint = [number, number, number]
export function getTorsionSpringDimensions(
  input: TorsionSpringModelPropsInput,
) {
  const p = torsionSpringModelPropsSchema.parse(input)
  const meanRadius = (p.outerDiameter - p.wireDiameter) / 2
  const lengthPerTurn = Math.hypot(2 * Math.PI * meanRadius, p.pitch)
  const coilLength = lengthPerTurn * p.turns
  return {
    meanRadius,
    insideDiameter: p.outerDiameter - 2 * p.wireDiameter,
    axialAdvance: p.pitch * p.turns,
    lengthPerTurn,
    coilLength,
    centerlineLength: p.startLegLength + coilLength + p.endLegLength,
    endPhaseDegrees: (p.leftHand ? -1 : 1) * 360 * (p.turns % 1),
    pitch: p.pitch,
  }
}
/** Distance along the complete wire, starting at the free end of the first leg.
 * Coil starts at (meanRadius,0,0), advances +Z, and has a circular normal section.
 * Legs extend the exact helical tangent, including its axial slope.
 */
export function getTorsionSpringFrame(
  input: TorsionSpringModelPropsInput,
  distance: number,
) {
  const p = torsionSpringModelPropsSchema.parse(input),
    d = getTorsionSpringDimensions(p)
  if (
    !Number.isFinite(distance) ||
    distance < 0 ||
    distance > d.centerlineLength
  )
    throw new Error("Distance must be within the wire centerline")
  const coilDistance = Math.max(
    0,
    Math.min(d.coilLength, distance - p.startLegLength),
  )
  const turn = coilDistance / d.lengthPerTurn
  const hand = p.leftHand ? -1 : 1,
    angle = hand * 2 * Math.PI * (turn % 1)
  const c = Math.cos(angle),
    s = Math.sin(angle)
  const tangent: TorsionSpringPoint = [
    (-hand * 2 * Math.PI * d.meanRadius * s) / d.lengthPerTurn,
    (hand * 2 * Math.PI * d.meanRadius * c) / d.lengthPerTurn,
    p.pitch / d.lengthPerTurn,
  ]
  const normal: TorsionSpringPoint = [c, s, 0]
  const binormal: TorsionSpringPoint = [
    -tangent[2] * s,
    tangent[2] * c,
    tangent[0] * s - tangent[1] * c,
  ]
  const extension = distance - p.startLegLength - coilDistance
  const position: TorsionSpringPoint = [
    d.meanRadius * c + extension * tangent[0],
    d.meanRadius * s + extension * tangent[1],
    turn * p.pitch + extension * tangent[2],
  ]
  return { position, tangent, normal, binormal }
}
