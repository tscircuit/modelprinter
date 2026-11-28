import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { extensionSpringModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  wire: "wireDiameter",
  wirediameter: "wireDiameter",
  bodyl: "bodyLength",
  bodylength: "bodyLength",
  hookid: "hookInnerDiameter",
  hookinnerdiameter: "hookInnerDiameter",
} as const

export function parseExtensionSpringModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "extensionspring" ||
    !/^extensionspring$/i.test(tokens[0] ?? "")
  ) {
    throw new Error("Expected extensionspring without an inline value")
  }

  const props: Record<string, unknown> = { fn: "extensionspring" }
  const seen = new Set<string>()

  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    if (lower === "custom" || lower === "free") {
      const prop = lower
      if (seen.has(prop)) {
        throw new Error(`Duplicate extension spring property "${prop}"`)
      }
      seen.add(prop)
      props[prop] = true
      continue
    }
    if (lower === "fullcircle" || lower === "fullcirclehook") {
      if (seen.has("fullCircleHook")) {
        throw new Error('Duplicate extension spring property "fullCircleHook"')
      }
      seen.add("fullCircleHook")
      props.fullCircleHook = true
      continue
    }
    if (lower === "aligned" || lower === "perpendicular") {
      if (seen.has("hooksAligned")) {
        throw new Error("Duplicate or conflicting hook plane flag")
      }
      seen.add("hooksAligned")
      props.hooksAligned = lower === "aligned"
      continue
    }
    if (lower === "lefthanded" || lower === "righthanded") {
      if (seen.has("leftHanded")) {
        throw new Error("Duplicate or conflicting extension spring handedness")
      }
      seen.add("leftHanded")
      props.leftHanded = lower === "lefthanded"
      continue
    }

    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2] ?? ""
    if (!name) {
      throw new Error(`Invalid extension spring token "${token}"`)
    }

    let property: string
    let parsed: unknown = value

    if (name === "turns") {
      property = "turns"
      if (!/^\d+$/.test(value)) {
        throw new Error("Extension spring turns must be a positive integer")
      }
      parsed = Number(value)
    } else if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
    } else {
      throw new Error(`Unknown extension spring token "${token}"`)
    }

    if (seen.has(property)) {
      throw new Error(`Duplicate extension spring property "${property}"`)
    }
    seen.add(property)
    props[property] = parsed
  }

  return extensionSpringModelDefinitionSchema.parse(props)
}
