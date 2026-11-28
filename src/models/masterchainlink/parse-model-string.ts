import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { masterChainLinkModelDefinitionSchema } from "./schema"

const lengths = {
  pitch: "pitch",
  p: "pitch",
  w: "width",
  width: "width",
  pind: "pinDiameter",
  innerw: "innerWidth",
} as const

export function parseMasterChainLinkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "masterchainlink" ||
    tokens[0]?.toLowerCase() !== "masterchainlink"
  ) {
    throw new Error("Expected masterchainlink without an inline value")
  }
  const props: Record<string, unknown> = { fn: "masterchainlink" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for masterchainlink`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "springclip") {
      property = "springClip"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown masterchainlink token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate masterchainlink property "${property}"`)
    }
    props[property] = parsed
  }
  return masterChainLinkModelDefinitionSchema.parse(props)
}
