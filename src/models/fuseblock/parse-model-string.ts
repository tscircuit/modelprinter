import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { fuseBlockModelDefinitionSchema } from "./schema"

const lengths = {
  fused: "fuseDiameter",
  fusel: "fuseLength",
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  clipod: "clipOuterDiameter",
  hole: "holeDiameter",
  holed: "holeDiameter",
  hp: "holePitch",
  holepitch: "holePitch",
} as const

export function parseFuseBlockModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "fuseblock" || tokens[0]?.toLowerCase() !== "fuseblock") {
    throw new Error("Expected fuseblock without an inline value")
  }
  const props: Record<string, unknown> = { fn: "fuseblock" }
  for (const token of tokens.slice(1)) {
    const fuseTuple = token.match(/^fuse\(([^,()]+),([^,()]+)\)$/i)
    if (fuseTuple) {
      const [, rawD = "", rawL = ""] = fuseTuple
      if (
        Object.hasOwn(props, "fuseDiameter") ||
        Object.hasOwn(props, "fuseLength")
      ) {
        throw new Error("Duplicate fuse(...) in fuseblock string")
      }
      props.fuseDiameter = rawD.trim()
      props.fuseLength = rawL.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for fuseblock`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName === "holes") {
      property = "holes"
      parsed = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else {
      throw new Error(`Unknown fuseblock token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate fuseblock property "${property}"`)
    }
    props[property] = parsed
  }
  return fuseBlockModelDefinitionSchema.parse(props)
}
