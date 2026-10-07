import { z } from "zod"
import { positiveGearLengthSchema as length } from "../../gear-parameter-schemas"
import { nemaMotorDimensions } from "../../nema-motor-schema"

/** Common NEMA mounting interfaces; the bracket dimensions are custom defaults.
 * The existing motor reference table supplies the 31/47.14 mm square patterns,
 * 22/38.1 mm pilots, and representative 42.3/56.4 mm motor-face envelopes.
 */
export const nemaMotorMountDimensions = {
  17: {
    width: 50,
    height: 60,
    baseDepth: 40,
    thickness: 3,
    axisHeight: 30,
    mountingHoleSpacing: nemaMotorDimensions[17].mountingHoleSpacing,
    mountingHoleDiameter: 3.5,
    shaftClearanceDiameter: nemaMotorDimensions[17].pilotDiameter + 1,
    baseHoleSpacing: 30,
    baseHoleDiameter: 5.5,
    baseHoleOffset: 20,
  },
  23: {
    width: 70,
    height: 80,
    baseDepth: 50,
    thickness: 4,
    axisHeight: 40,
    mountingHoleSpacing: nemaMotorDimensions[23].mountingHoleSpacing,
    mountingHoleDiameter: 5.5,
    shaftClearanceDiameter: nemaMotorDimensions[23].pilotDiameter + 1,
    baseHoleSpacing: 45,
    baseHoleDiameter: 5.5,
    baseHoleOffset: 25,
  },
} as const

const shape = {
  nemaSize: z.union([z.literal(17), z.literal(23)]).default(17),
  width: length.optional(),
  height: length.optional(),
  baseDepth: length.optional(),
  thickness: length.optional(),
  /** Shaft-axis height above the bottom base mounting plane. */
  axisHeight: length.optional(),
  /** Fixed common square pattern; an explicit conflicting span is rejected. */
  mountingHoleSpacing: length.optional(),
  mountingHoleDiameter: length.optional(),
  /** One through opening clears both the shaft and its projecting pilot boss. */
  shaftClearanceDiameter: length.optional(),
  /** Two base holes, centered across X at +/- half this spacing. */
  baseHoleSpacing: length.optional(),
  baseHoleDiameter: length.optional(),
  /** Distance from motor face Z=0 toward the base free end at negative Z. */
  baseHoleOffset: length.optional(),
}

function resolve(input: z.output<z.ZodObject<typeof shape>>) {
  const defaults = nemaMotorMountDimensions[input.nemaSize]
  return {
    nemaSize: input.nemaSize,
    width: input.width ?? defaults.width,
    height: input.height ?? defaults.height,
    baseDepth: input.baseDepth ?? defaults.baseDepth,
    thickness: input.thickness ?? defaults.thickness,
    axisHeight: input.axisHeight ?? defaults.axisHeight,
    mountingHoleSpacing:
      input.mountingHoleSpacing ?? defaults.mountingHoleSpacing,
    mountingHoleDiameter:
      input.mountingHoleDiameter ?? defaults.mountingHoleDiameter,
    shaftClearanceDiameter:
      input.shaftClearanceDiameter ?? defaults.shaftClearanceDiameter,
    baseHoleSpacing: input.baseHoleSpacing ?? defaults.baseHoleSpacing,
    baseHoleDiameter: input.baseHoleDiameter ?? defaults.baseHoleDiameter,
    baseHoleOffset: input.baseHoleOffset ?? defaults.baseHoleOffset,
  }
}

export type NemaMotorMountModelProps = ReturnType<typeof resolve>

function validate(p: NemaMotorMountModelProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof NemaMotorMountModelProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const motor = nemaMotorDimensions[p.nemaSize]
  if (
    !Number.isFinite(
      p.width + p.height + p.baseDepth + p.thickness + p.axisHeight,
    )
  ) {
    issue("Bracket extents must remain finite", "height")
    return
  }
  if (Math.abs(p.mountingHoleSpacing - motor.mountingHoleSpacing) > 1e-8)
    issue(
      `NEMA${p.nemaSize} requires the common ${motor.mountingHoleSpacing} mm square mounting pattern`,
      "mountingHoleSpacing",
    )
  if (p.width < motor.bodyWidth)
    issue("Bracket width must cover the representative motor face", "width")
  if (p.axisHeight <= motor.bodyWidth / 2 + p.thickness)
    issue("Motor envelope must clear the top of the base leg", "axisHeight")
  if (p.height - p.axisHeight < motor.bodyWidth / 2)
    issue(
      "Upright must cover the top of the representative motor face",
      "height",
    )
  if (p.shaftClearanceDiameter <= motor.pilotDiameter)
    issue(
      "Shaft opening must exceed the projecting motor pilot diameter",
      "shaftClearanceDiameter",
    )
  if (p.mountingHoleDiameter <= motor.mountingHoleDiameter)
    issue(
      "Mounting holes must provide clearance around the nominal motor fixing diameter",
      "mountingHoleDiameter",
    )
  const r = p.mountingHoleDiameter / 2
  const opening = p.shaftClearanceDiameter / 2
  if (p.mountingHoleSpacing / Math.SQRT2 <= opening + r)
    issue(
      "Motor mounting holes must leave material around the pilot opening",
      "shaftClearanceDiameter",
    )
  if (p.mountingHoleSpacing <= p.mountingHoleDiameter)
    issue(
      "Motor mounting holes must not touch each other",
      "mountingHoleDiameter",
    )
  if (Math.max(p.mountingHoleSpacing / 2 + r, opening) >= p.width / 2)
    issue("Upright openings must leave material at both side edges", "width")
  if (
    Math.max(p.mountingHoleSpacing / 2 + r, opening) >=
    p.height - p.axisHeight
  )
    issue("Upright openings must leave material at the top edge", "height")
  if (
    Math.max(p.mountingHoleSpacing / 2 + r, opening) >=
    p.axisHeight - p.thickness
  )
    issue("Upright openings must clear the base and solid corner", "axisHeight")
  const baseRadius = p.baseHoleDiameter / 2
  if (p.baseHoleSpacing <= p.baseHoleDiameter)
    issue("Base holes must not touch each other", "baseHoleSpacing")
  if (p.baseHoleSpacing + p.baseHoleDiameter >= p.width)
    issue(
      "Base holes must leave material at the width edges",
      "baseHoleSpacing",
    )
  if (p.baseHoleOffset <= baseRadius)
    issue(
      "Base holes must clear the upright and solid corner",
      "baseHoleOffset",
    )
  if (p.baseHoleOffset + baseRadius >= p.baseDepth)
    issue("Base holes must leave material at the free base edge", "baseDepth")
}

/** A rigid sharp-corner 90-degree L bracket, in millimeters.
 * Origin is the motor mounting face and shaft axis, matching the NEMA motor.
 * +Z follows the shaft; the upright occupies Z=0..thickness and the base
 * extends toward -Z beneath the motor. +Y is up and width is centered on X.
 */
export const nemaMotorMountModelPropsSchema = z
  .object(shape)
  .strict()
  .transform(resolve)
  .superRefine(validate)
export const nemaMotorMountModelDefinitionSchema = z
  .object({ fn: z.literal("nemamotormount"), ...shape })
  .strict()
  .transform(({ fn, ...props }) => ({ fn, ...resolve(props) }))
  .superRefine(validate)
export type NemaMotorMountModelPropsInput = z.input<
  typeof nemaMotorMountModelPropsSchema
>
export type NemaMotorMountModelDefinition = z.output<
  typeof nemaMotorMountModelDefinitionSchema
>

/** Hole centers are on entry faces; direction and depth point through material. */
export function getNemaMotorMountHoles(
  input: NemaMotorMountModelPropsInput = {},
) {
  const p = nemaMotorMountModelPropsSchema.parse(input)
  const motor = [-1, 1].flatMap((x) =>
    [-1, 1].map((y) => ({
      interface: "motor" as const,
      center: {
        x: (x * p.mountingHoleSpacing) / 2,
        y: (y * p.mountingHoleSpacing) / 2,
        z: 0,
      },
      direction: { x: 0, y: 0, z: 1 },
      diameter: p.mountingHoleDiameter,
      depth: p.thickness,
    })),
  )
  const base = [-1, 1].map((x) => ({
    interface: "base" as const,
    center: {
      x: (x * p.baseHoleSpacing) / 2,
      y: -p.axisHeight + p.thickness,
      z: -p.baseHoleOffset,
    },
    direction: { x: 0, y: -1, z: 0 },
    diameter: p.baseHoleDiameter,
    depth: p.thickness,
  }))
  return [...motor, ...base]
}

export function getNemaMotorMountReferencePoints(
  input: NemaMotorMountModelPropsInput = {},
) {
  const p = nemaMotorMountModelPropsSchema.parse(input)
  return {
    motorface: {
      position: { x: 0, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: 1 },
    },
    shaftaxis: {
      position: { x: 0, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: 1 },
    },
    baseface: {
      position: { x: 0, y: -p.axisHeight, z: (p.thickness - p.baseDepth) / 2 },
      direction: { x: 0, y: -1, z: 0 },
    },
  }
}
