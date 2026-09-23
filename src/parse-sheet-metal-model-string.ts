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
  const tokens = raw.string.split("_")
  if (tokens[0] !== "sheetmetal") throw new Error("Expected sheetmetal")
  for (const token of tokens.slice(1)) {
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
  return sheetMetalModelDefinitionSchema.parse({ fn: "sheetmetal", ...props })
}
