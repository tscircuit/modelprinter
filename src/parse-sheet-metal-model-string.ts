import { splitModelStringTokens } from "./split-model-string-tokens"
import { parseSheetMetalFeature } from "./parse-sheet-metal-feature"
import { sheetMetalModelDefinitionSchema } from "./sheet-metal-schema"
import type { RawModelprinterParams } from "./parse-model-string"

const lengths: Record<string, string> = {
  w: "width",
  l: "baseLength",
  h: "flangeHeight",
  t: "thickness",
  r: "insideBendRadius",
}
export function parseSheetMetalModelParams(raw: RawModelprinterParams) {
  const props: Record<string, unknown> = {}
  const tokens = splitModelStringTokens(raw.string)
  if (tokens[0] !== "sheetmetal") throw new Error("Expected sheetmetal")
  const features: string[] = []
  const featureNames = new Set<string>()
  for (const token of tokens.slice(1)) {
    if (/^(hole|slot)[1-9]\d*\(/.test(token)) {
      const name = token.slice(0, token.indexOf("("))
      if (featureNames.has(name)) throw new Error(`Duplicate feature "${name}"`)
      featureNames.add(name)
      features.push(token)
      continue
    }
    if (["plate", "angle", "channel"].includes(token)) {
      if (props.profile) throw new Error("Duplicate sheet metal profile")
      props.profile = token
      continue
    }
    const key = lengths[token[0]!]
    if (!key || token.length < 2)
      throw new Error(`Unknown sheet metal token "${token}"`)
    if (key in props) throw new Error(`Duplicate sheet metal property "${key}"`)
    props[key] = token.slice(1)
  }
  const definition = sheetMetalModelDefinitionSchema.parse({
    fn: "sheetmetal",
    ...props,
  })
  definition.holes = features.map((feature) =>
    parseSheetMetalFeature(feature, definition.profile),
  )
  return definition
}
