import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wireMeshModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  w: "width",
  wire: "wireDiameter",
  pitchx: "pitchX",
  pitchy: "pitchY",
} as const

export function parseWireMeshModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wiremesh" || tokens[0]?.toLowerCase() !== "wiremesh") {
    throw new Error("Expected wiremesh without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wiremesh" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wiremesh`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "plainweave" || lower === "twillweave") {
      if (Object.hasOwn(props, "weaveStyle")) {
        throw new Error("Duplicate wiremesh weave style flag")
      }
      props.weaveStyle = lower
      continue
    }
    if (lower === "uncapped" || lower === "framededge") {
      if (Object.hasOwn(props, "edgeStyle")) {
        throw new Error("Duplicate wiremesh edge style flag")
      }
      props.edgeStyle = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate wiremesh property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown wiremesh token "${token}"`)
    }
  }
  return wireMeshModelDefinitionSchema.parse(props)
}
