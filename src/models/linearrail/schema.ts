import { z } from "zod"
import {
  positiveGearLengthSchema as positive,
  nonnegativeGearLengthSchema as nonnegative,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive.default(12),
  height: positive.default(8),
  length: positive.default(100),
  baseHeight: positive.default(2),
  neckWidth: positive.default(8),
  neckHeight: positive.default(2),
  chamfer: nonnegative.default(0.5),
  holeCount: z.number().int().min(1).max(512).default(4),
  holeDiameter: positive.default(3.5),
  holePitch: positive.default(25),
  firstHoleOffset: positive.default(12.5),
  counterboreDiameter: nonnegative.default(6),
  counterboreDepth: nonnegative.default(3),
}
type Props = z.output<z.ZodObject<typeof shape>>
function validate(p: Props, c: z.RefinementCtx) {
  const issue = (message: string, path: keyof Props) =>
    c.addIssue({ code: "custom", message, path: [path] })
  const shoulder = p.baseHeight + p.neckHeight
  if (
    !Number.isFinite(shoulder) ||
    shoulder <= p.baseHeight ||
    shoulder >= p.height
  )
    issue(
      "The base, neck and upper head must have positive finite heights",
      "neckHeight",
    )
  if (p.neckWidth >= p.width)
    issue("The neck must be narrower than the head and base", "neckWidth")
  if (p.chamfer >= Math.min(p.width / 2, p.height - shoulder))
    issue("Top chamfers must retain the upper head", "chamfer")
  if (p.holeDiameter >= p.neckWidth)
    issue("Mounting holes must retain neck walls", "holeDiameter")
  if ((p.counterboreDiameter === 0) !== (p.counterboreDepth === 0))
    issue(
      "Disable counterbores with both diameter and depth zero",
      "counterboreDepth",
    )
  if (p.counterboreDepth > 0) {
    if (
      p.counterboreDiameter <= p.holeDiameter ||
      p.counterboreDiameter >= p.width - 2 * p.chamfer
    )
      issue(
        "Counterbores must be wider than the hole and contained in the top face",
        "counterboreDiameter",
      )
    if (p.counterboreDepth >= p.height - shoulder)
      issue(
        "Counterbores must stop above the neck shoulder",
        "counterboreDepth",
      )
  }
  const diameter = Math.max(p.holeDiameter, p.counterboreDiameter)
  const last = p.firstHoleOffset + (p.holeCount - 1) * p.holePitch
  if (
    !Number.isFinite(last) ||
    p.firstHoleOffset <= diameter / 2 ||
    last + diameter / 2 >= p.length
  )
    issue(
      "The exact mounting pattern must leave material at both rail ends",
      "firstHoleOffset",
    )
  if (p.holeCount > 1 && p.holePitch <= diameter)
    issue("Neighboring mounting cuts must remain separate", "holePitch")
}
/** Generic waisted rail. X spans the width, Y runs from zero to length,
 * and Z=0 is the rail-bed mounting datum. No supplier profile is implied. */
export const linearRailModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const linearRailModelDefinitionSchema = z
  .object({ fn: z.literal("linearrail"), ...shape })
  .strict()
  .superRefine(validate)
export type LinearRailModelPropsInput = z.input<
  typeof linearRailModelPropsSchema
>
export type LinearRailModelProps = z.output<typeof linearRailModelPropsSchema>
export type LinearRailModelDefinition = z.output<
  typeof linearRailModelDefinitionSchema
>
export function getLinearRailDimensions(input: LinearRailModelPropsInput = {}) {
  const p = linearRailModelPropsSchema.parse(input)
  return {
    neckBottom: p.baseHeight,
    headBottom: p.baseHeight + p.neckHeight,
    lastHoleOffset: p.firstHoleOffset + (p.holeCount - 1) * p.holePitch,
    lastEndMargin:
      p.length - p.firstHoleOffset - (p.holeCount - 1) * p.holePitch,
    headHeight: p.height - p.baseHeight - p.neckHeight,
  }
}
export function getLinearRailMountingHoles(
  input: LinearRailModelPropsInput = {},
) {
  const p = linearRailModelPropsSchema.parse(input)
  return Array.from({ length: p.holeCount }, (_, index) => ({
    center: { x: 0, y: p.firstHoleOffset + index * p.holePitch, z: p.height },
    direction: { x: 0, y: 0, z: -1 },
    diameter: p.holeDiameter,
    depth: p.height,
    counterboreDiameter: p.counterboreDiameter,
    counterboreDepth: p.counterboreDepth,
  }))
}
