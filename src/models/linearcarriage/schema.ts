import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
const shape = {
  width: positive.default(27),
  length: positive.default(45),
  height: positive.default(13),
  railWidth: positive.default(12),
  railHeight: positive.default(8),
  railBaseHeight: positive.default(2),
  railNeckWidth: positive.default(8),
  railNeckHeight: positive.default(2),
  clearance: positive.default(0.15),
  holeCount: z.literal(4).default(4),
  holeDiameter: positive.default(3),
  holePitchX: positive.default(20),
  holePitchY: positive.default(20),
  holeDepth: positive.default(4),
}
type Props = z.output<z.ZodObject<typeof shape>>
function validate(p: Props, c: z.RefinementCtx) {
  const issue = (message: string, path: keyof Props) =>
    c.addIssue({ code: "custom", message, path: [path] })
  const shoulder = p.railBaseHeight + p.railNeckHeight
  const top = p.railHeight + p.clearance
  const bottom = p.railBaseHeight + p.clearance
  if (
    !Number.isFinite(shoulder) ||
    shoulder <= p.railBaseHeight ||
    shoulder >= p.railHeight
  )
    issue(
      "Mating rail base, neck and head heights must be positive and finite",
      "railNeckHeight",
    )
  if (p.railNeckWidth >= p.railWidth)
    issue("The mating rail must have a narrower neck", "railNeckWidth")
  if (p.railNeckHeight <= 2 * p.clearance || shoulder - p.clearance <= bottom)
    issue(
      "Clearance must leave positive retaining lips below the rail head",
      "clearance",
    )
  if (!Number.isFinite(top) || top <= p.railHeight || top >= p.height)
    issue("The channel must leave a positive roof above the rail", "height")
  if (p.railWidth + 2 * p.clearance >= p.width)
    issue("The channel must leave side walls", "width")
  if (p.holePitchX <= p.holeDiameter || p.holePitchY <= p.holeDiameter)
    issue("The four mounting holes must remain separate", "holeDiameter")
  if (
    p.holePitchX + p.holeDiameter >= p.width ||
    p.holePitchY + p.holeDiameter >= p.length
  )
    issue("All mounting holes must retain outside edge ligaments", "holePitchX")
  if (p.holeDepth >= p.height - top)
    issue(
      "Blind mounting holes must retain material above the channel roof",
      "holeDepth",
    )
}
/** Generic clearance envelope for a waisted rail, without balls or a vendor
 * interchangeability claim. X is transverse, Y travel; Z=0 is the rail bed. */
export const linearCarriageModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const linearCarriageModelDefinitionSchema = z
  .object({ fn: z.literal("linearcarriage"), ...shape })
  .strict()
  .superRefine(validate)
export type LinearCarriageModelPropsInput = z.input<
  typeof linearCarriageModelPropsSchema
>
export type LinearCarriageModelProps = z.output<
  typeof linearCarriageModelPropsSchema
>
export type LinearCarriageModelDefinition = z.output<
  typeof linearCarriageModelDefinitionSchema
>
export function getLinearCarriageDimensions(
  input: LinearCarriageModelPropsInput = {},
) {
  const p = linearCarriageModelPropsSchema.parse(input)
  return {
    bottom: p.railBaseHeight + p.clearance,
    channelShoulder: p.railBaseHeight + p.railNeckHeight - p.clearance,
    channelTop: p.railHeight + p.clearance,
    channelNeckWidth: p.railNeckWidth + 2 * p.clearance,
    channelHeadWidth: p.railWidth + 2 * p.clearance,
    roofThickness: p.height - p.railHeight - p.clearance,
  }
}
export function getLinearCarriageMountingHoles(
  input: LinearCarriageModelPropsInput = {},
) {
  const p = linearCarriageModelPropsSchema.parse(input)
  return [-1, 1].flatMap((x) =>
    [-1, 1].map((y) => ({
      center: {
        x: (x * p.holePitchX) / 2,
        y: (y * p.holePitchY) / 2,
        z: p.height,
      },
      direction: { x: 0, y: 0, z: -1 },
      diameter: p.holeDiameter,
      depth: p.holeDepth,
    })),
  )
}
