import type { RawModelprinterParams } from "./parse-model-string"
import { spacerModelDefinitionSchema } from "./spacer-schema"

const spacerPropertyByToken = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
} as const

export const parseSpacerModelParams = (raw: RawModelprinterParams) => {
  if (raw.fn !== "spacer") {
    throw new Error(`Expected spacer params, got "${raw.fn}"`)
  }
  const tokens = raw.string.split("_")
  if (tokens[0]?.toLowerCase() !== "spacer") {
    throw new Error("The spacer function does not accept an inline value")
  }

  const props: Record<string, unknown> = {}
  for (const token of tokens.slice(1)) {
    const name = token.match(/^[a-z]+/i)?.[0]?.toLowerCase()
    if (!name || !Object.hasOwn(spacerPropertyByToken, name)) {
      throw new Error(`Unknown spacer model token "${token}"`)
    }
    const property =
      spacerPropertyByToken[name as keyof typeof spacerPropertyByToken]
    if (property in props) {
      throw new Error(`Spacer property "${property}" is set more than once`)
    }
    props[property] = raw[name]
  }
  return spacerModelDefinitionSchema.parse({ fn: "spacer", ...props })
}
