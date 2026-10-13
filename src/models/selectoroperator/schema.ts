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
  panelDiameter: positive.default(22),
  bezelDiameter: positive.default(30),
  bodyLength: positive.default(35),
  knobWidth: positive.default(28),
  knobDepth: positive.default(10),
  knobHeight: positive.default(15),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.panelDiameter >= p.bezelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible selectoroperator dimensions: 1",
    })
  if (p.knobDepth >= p.knobWidth)
    context.addIssue({
      code: "custom",
      message: "Incompatible selectoroperator dimensions: 2",
    })
  if (p.knobWidth > p.bezelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible selectoroperator dimensions: 3",
    })
  if (p.knobHeight >= p.bodyLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible selectoroperator dimensions: 4",
    })
}
export const selectorOperatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const selectorOperatorModelDefinitionSchema = z
  .object({ fn: z.literal("selectoroperator"), ...shape })
  .strict()
  .superRefine(validate)
export type SelectorOperatorModelPropsInput = z.input<
  typeof selectorOperatorModelPropsSchema
>
export type SelectorOperatorModelProps = z.output<
  typeof selectorOperatorModelPropsSchema
>
export type SelectorOperatorModelDefinition = z.output<
  typeof selectorOperatorModelDefinitionSchema
>
/** Panel selector switch operator with mounting barrel, bezel, raised bar grip and two rear terminals. The grip is aligned with X at its nominal position; detents and switching contacts are omitted. All normalized lengths are millimeters. */
export function getSelectorOperatorDimensions(
  input: SelectorOperatorModelPropsInput = {},
) {
  const p = selectorOperatorModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.bezelDiameter,
      p.bezelDiameter,
      p.bodyLength + 3 + p.knobHeight + 7,
    ] as [number, number, number],
  }
}
