import { z } from "zod"
import {
  positiveGearLengthSchema as positive,
  nonnegativeGearLengthSchema as nonnegative,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive,
  height: positive,
  thickness: positive,
  length: positive,
  innerRadius: nonnegative,
  holeCount: z.number().finite().int().min(1).max(256),
  holeDiameter: positive,
  pitch: positive,
  endOffset: positive,
  legOffset: positive,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const largestDimension = Math.max(
    ...Object.values(p).filter(
      (value): value is number => typeof value === "number",
    ),
  )
  if (!Number.isFinite((4 * largestDimension) ** 3)) {
    issue(
      "Dimensions must permit finite derived coordinates and volume",
      "width",
    )
    return
  }
  if (p.innerRadius + p.thickness >= Math.min(p.width, p.height))
    issue("The bend must leave a straight portion on both legs", "innerRadius")
  if (p.legOffset - p.holeDiameter / 2 <= p.innerRadius + p.thickness)
    issue("Leg holes must lie wholly beyond the bend tangents", "legOffset")
  if (p.legOffset + p.holeDiameter / 2 >= Math.min(p.width, p.height))
    issue("Leg holes must leave material at both free edges", "legOffset")
  if (p.pitch <= p.holeDiameter && p.holeCount > 1)
    issue("Hole pitch must leave material between consecutive holes", "pitch")
  if (p.endOffset <= p.holeDiameter / 2)
    issue(
      "The first hole must leave material at the first cut end",
      "endOffset",
    )
  if (
    p.endOffset + (p.holeCount - 1) * p.pitch + p.holeDiameter / 2 >=
    p.length
  )
    issue("The last hole must leave material at the far cut end", "length")
}
/** Constant-thickness equal or unequal L-section with round holes in both legs. XY envelope is centered; the outside heel is at minimum X/Y and cut ends are Z=0 and Z=length. Inside bend radius is innerRadius; outside radius is innerRadius+thickness. Each leg hole center is legOffset from the outside heel and Z=endOffset+i*pitch. All lengths normalize to millimeters. All dimensions are required. */
export const perforatedAngleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const perforatedAngleModelDefinitionSchema = z
  .object({ fn: z.literal("perforatedangle"), ...shape })
  .strict()
  .superRefine(validate)
export type PerforatedAngleModelPropsInput = z.input<
  typeof perforatedAngleModelPropsSchema
>
export type PerforatedAngleModelProps = z.output<
  typeof perforatedAngleModelPropsSchema
>
export type PerforatedAngleModelDefinition = z.output<
  typeof perforatedAngleModelDefinitionSchema
>
export function getPerforatedAngleDimensions(
  input: PerforatedAngleModelPropsInput,
) {
  const p = perforatedAngleModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
    holeCenters: Array.from({ length: p.holeCount }, (_, i) => {
      const z = p.endOffset + i * p.pitch
      return {
        horizontal: [
          p.legOffset - p.width / 2,
          p.thickness / 2 - p.height / 2,
          z,
        ] as [number, number, number],
        vertical: [
          p.thickness / 2 - p.width / 2,
          p.legOffset - p.height / 2,
          z,
        ] as [number, number, number],
      }
    }),
  }
}
