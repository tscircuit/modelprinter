import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegativeLength = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)
const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  thickness: positiveLength,
  tabWidth: positiveLength,
  tabLength: positiveLength,
  inwardTab: z.literal(true).default(true),
  custom: z.literal(true).default(true),
  tabCount: z.literal(1).default(1),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  if (p.innerDiameter >= p.outerDiameter)
    issue("The bore must leave a positive-width annular body", "innerDiameter")
  if (p.tabWidth >= p.innerDiameter)
    issue("The tab must be narrower than the bore", "tabWidth")
  if (p.tabLength >= p.innerDiameter / 2)
    issue("The inward tab must stop before the bore center", "tabLength")
  if (
    p.tabWidth < p.innerDiameter &&
    p.innerDiameter / 2 - p.tabLength >=
      Math.sqrt((p.innerDiameter / 2) ** 2 - (p.tabWidth / 2) ** 2)
  )
    issue(
      "The full rectangular tab tip must project inside the circular bore",
      "tabLength",
    )
  if (
    !Number.isFinite(
      8 *
        Math.max(
          p.innerDiameter,
          p.outerDiameter,
          p.thickness,
          p.tabWidth,
          p.tabLength,
        ) **
          3,
    )
  )
    issue("Dimensions exceed finite derived geometry limits", "innerDiameter")
}
/** Custom annular key washer centered on XY, bottom Z=0 and top Z=thickness. One rectangular tab on +X projects inward from the nominal circular bore to X=innerDiameter/2-tabLength. Tab width is along Y and the tab root overlaps the annular body. tabLength is measured radially at the tab centerline. No supplier standard is claimed. */
export const keyWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const keyWasherModelDefinitionSchema = z
  .object({ fn: z.literal("keywasher"), ...shape })
  .strict()
  .superRefine(validate)
export type KeyWasherModelPropsInput = z.input<typeof keyWasherModelPropsSchema>
export type KeyWasherModelProps = z.output<typeof keyWasherModelPropsSchema>
export type KeyWasherModelDefinition = z.output<
  typeof keyWasherModelDefinitionSchema
>

/** Normalized millimeter dimensions and installation datums. */
export function getKeyWasherDimensions(input: KeyWasherModelPropsInput) {
  const p = keyWasherModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.thickness] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.thickness,
    tabTipX: p.innerDiameter / 2 - p.tabLength,
    tabRootX: Math.sqrt((p.innerDiameter / 2) ** 2 - (p.tabWidth / 2) ** 2),
    tabMinY: -p.tabWidth / 2,
    tabMaxY: p.tabWidth / 2,
  }
}
