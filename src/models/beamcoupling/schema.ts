import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (v) => v > 0,
  "Length must be positive",
)
const shape = {
  outerDiameter: positiveLength.default(25),
  length: positiveLength.default(30),
  boreDiameter: positiveLength.default(8),
  hubLength: positiveLength.default(7),
  slotWidth: positiveLength.default(1),
  slotCount: z.number().int().min(2).max(20).default(6),
  bridgeAngle: z.number().finite().min(20).max(120).default(60),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.boreDiameter >= p.outerDiameter)
    context.addIssue({
      code: "custom",
      message: "Bore must be smaller than the coupling diameter",
    })
  if ((p.slotCount + 1) * p.slotWidth >= p.length - 2 * p.hubLength)
    context.addIssue({
      code: "custom",
      message: "Slots must leave axial flexure material between solid end hubs",
    })
  const bounds = [
    p.outerDiameter,
    p.length,
    p.boreDiameter,
    p.hubLength,
    p.slotWidth,
  ]
  if (!Number.isFinite(bounds.reduce((sum, value) => sum + value, 0)))
    context.addIssue({
      code: "custom",
      message: "Combined dimensions must remain finite",
    })
}
export const beamCouplingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const beamCouplingModelDefinitionSchema = z
  .object({ fn: z.literal("beamcoupling"), ...shape })
  .strict()
  .superRefine(validate)
export type BeamCouplingModelPropsInput = z.input<
  typeof beamCouplingModelPropsSchema
>
export type BeamCouplingModelProps = z.output<
  typeof beamCouplingModelPropsSchema
>
export type BeamCouplingModelDefinition = z.output<
  typeof beamCouplingModelDefinitionSchema
>
/** Coaxial beam coupling with staggered transverse flexure slots and intact radial bridges. Slots alternate by 90 degrees; this represents a slotted beam coupling, not a continuous machined helix. All lengths normalize to millimeters. */
export function getBeamCouplingDimensions(
  input: BeamCouplingModelPropsInput = {},
) {
  const p = beamCouplingModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
    flexureLength: p.length - 2 * p.hubLength,
    slotPitch: (p.length - 2 * p.hubLength) / (p.slotCount + 1),
  }
}
