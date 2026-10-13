import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  wheelDiameter: positiveLength.default(32),
  wheelWidth: positiveLength.default(14),
  studDiameter: positiveLength.default(10),
  studLength: positiveLength.default(26),
  socketDiameter: positiveLength.default(5),
  rollerCount: z.number().int().min(2).max(64).default(10),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.wheelDiameter <= p.studDiameter * 2.2)
    context.addIssue({
      code: "custom",
      message: "The wheel must leave radial space for races and rollers",
    })
  if (p.wheelWidth <= p.socketDiameter)
    context.addIssue({
      code: "custom",
      message: "Wheel width must exceed the drive-socket diameter",
    })
  if (p.socketDiameter >= p.studDiameter)
    context.addIssue({
      code: "custom",
      message: "Drive socket must remain smaller than the stud",
    })
  if (p.studLength <= p.studDiameter)
    context.addIssue({
      code: "custom",
      message: "Stud length must exceed the stud diameter",
    })
  if (
    (p.wheelDiameter * 0.82 - p.studDiameter * 1.45) * 0.4 >=
    2 *
      ((p.wheelDiameter * 0.82 + p.studDiameter * 1.45) / 4) *
      Math.sin(Math.PI / p.rollerCount)
  )
    context.addIssue({
      code: "custom",
      message:
        "Adjacent cam-follower rollers must have positive circumferential clearance",
    })
}
export const camFollowerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const camFollowerModelDefinitionSchema = z
  .object({ fn: z.literal("camfollower"), ...shape })
  .strict()
  .superRefine(validate)
export type CamFollowerModelPropsInput = z.input<
  typeof camFollowerModelPropsSchema
>
export type CamFollowerModelProps = z.output<typeof camFollowerModelPropsSchema>
export type CamFollowerModelDefinition = z.output<
  typeof camFollowerModelDefinitionSchema
>
/** Stud-mounted cam follower with an exposed open roller race and hex drive socket. Stud is on Z, from Z=0 to studLength; wheel sits above it. Smooth stud represents the thread major-diameter envelope, not a screw thread. All lengths are normalized to millimeters. */
export function getCamFollowerDimensions(
  input: CamFollowerModelPropsInput = {},
) {
  const p = camFollowerModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.wheelDiameter, p.wheelDiameter, p.studLength + p.wheelWidth] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.studLength + p.wheelWidth,
  }
}
