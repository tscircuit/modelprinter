import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positive = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegative = industrialLengthSchema.refine(
  (value) => value >= 0,
  "Length must be nonnegative",
)
const shape = {
  width: positive.default(6),
  depth: positive.default(40),
  height: positive.default(35),
  wireDiameter: positive.default(3),
  screwDiameter: positive.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.wireDiameter >= p.width)
    context.addIssue({
      code: "custom",
      message: "Incompatible terminalblock dimensions: 1",
    })
  if (p.screwDiameter >= p.width)
    context.addIssue({
      code: "custom",
      message: "Incompatible terminalblock dimensions: 2",
    })
  if (p.wireDiameter >= p.height / 3)
    context.addIssue({
      code: "custom",
      message: "Incompatible terminalblock dimensions: 3",
    })
  if (p.screwDiameter >= p.depth / 4)
    context.addIssue({
      code: "custom",
      message: "Incompatible terminalblock dimensions: 4",
    })
}
export const terminalBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const terminalBlockModelDefinitionSchema = z
  .object({ fn: z.literal("terminalblock"), ...shape })
  .strict()
  .superRefine(validate)
export type TerminalBlockModelPropsInput = z.input<
  typeof terminalBlockModelPropsSchema
>
export type TerminalBlockModelProps = z.output<
  typeof terminalBlockModelPropsSchema
>
export type TerminalBlockModelDefinition = z.output<
  typeof terminalBlockModelDefinitionSchema
>
/** Single DIN terminal block with two wire-entry bores, paired slotted screw heads, center separator recess and underside rail clip recess. The insulating body is an envelope; screw thread, conductive cage and rail latching mechanics are omitted. All normalized lengths are millimeters. */
export function getTerminalBlockDimensions(
  input: TerminalBlockModelPropsInput = {},
) {
  const p = terminalBlockModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.depth, p.height + 5] as [number, number, number],
  }
}
