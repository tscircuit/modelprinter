import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { spacerModelDefinitionSchema } from "./schema"

const aliases = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  chamfer: "chamfer",
  edgechamfer: "chamfer",
} as const
export function parseSpacerModelParams(raw: RawModelprinterParams) {
  const [root, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "spacer" || root?.toLowerCase() !== "spacer")
    throw new Error("Expected spacer without an inline value")
  const props: Record<string, unknown> = { fn: "spacer" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown
    if (key === "round" && value === "") {
      property = "round"
      parsed = true
    } else if (key && Object.hasOwn(aliases, key) && value) {
      property = aliases[key as keyof typeof aliases]
      parsed = value
    } else throw new Error(`Unknown or malformed spacer token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate spacer property "${property}"`)
    props[property] = parsed
  }
  return spacerModelDefinitionSchema.parse(props)
}
