import { expandModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags } from "./string-flags"
import { panScrewModelDefinitionSchema } from "./schema"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"

const aliases: Record<string, string> = {
  m: "metricSize",
  metricsize: "metricSize",
  l: "length",
  length: "length",
  thread: "thread",
  drive: "drive",
  threadhand: "threadHand",
  threadclass: "threadClass",
  threadgender: "threadGender",
  diameter: "diameter",
  threadpitch: "threadPitch",
  headdiameter: "headDiameter",
  headheight: "headHeight",
  crownradius: "crownRadius",
  underheadradius: "underHeadRadius",
  recessnumber: "recessNumber",
  recessreferencediameter: "recessReferenceDiameter",
  recesspenetration: "recessPenetration",
  maximumthreadlength: "maximumThreadLength",
  tipchamferangle: "tipChamferAngle",
  threadflankangle: "threadFlankAngle",
  tipchamfer: "tipChamfer",
  threadrootdiameter: "threadRootDiameter",
  threadpitchdiameter: "threadPitchDiameter",
  recessb: "recessB",
  recesse: "recessE",
  recessg: "recessG",
  recessf: "recessF",
  recessradius: "recessRadius",
  recesst1: "recessT1",
  recessalpha: "recessAlpha",
  recessbeta: "recessBeta",
  recessouterwingangle: "recessOuterWingAngle",
  recessinnerwingangle: "recessInnerWingAngle",
  recessreferenceplaneheight: "recessReferencePlaneHeight",
  d: "diameter",
  headh: "headHeight",
  headd: "headDiameter",
}
const selectors = new Set([
  "thread",
  "drive",
  "threadHand",
  "threadClass",
  "threadGender",
])

export const parsePanScrewModelParams = (raw: RawModelprinterParams) => {
  if (raw.fn !== "panscrew")
    throw new Error(`Expected panscrew params, got "${raw.fn}"`)
  const [root, ...tokens] = splitModelStringTokens(
    expandModelStringFlags(raw.string, stringFlags),
  )
  if (root?.toLowerCase() !== "panscrew")
    throw new Error("The panscrew function does not accept an inline value")
  const props: Record<string, unknown> = {}
  for (const token of tokens) {
    const flag = token.toLowerCase()
    if (flag === "iso7045" || flag === "iso4757") {
      if (flag in props)
        throw new Error(`Property ${flag} is set more than once`)
      props[flag] = true
      continue
    }
    const match =
      token.match(/^(recesst1)(.*)$/i) ?? token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    let property: string
    let parsed: unknown
    if (key === "threads" || key === "nothreads") {
      if (value !== "")
        throw new Error(`Token "${key}" does not accept a value`)
      property = "showThreads"
      parsed = key === "threads"
    } else {
      property = key ? (aliases[key] ?? "") : ""
      if (!property || !value)
        throw new Error(`Unknown or missing panscrew token "${token}"`)
      if (selectors.has(property)) {
        const selector = value.match(/^\(([^()]+)\)$/)?.[1]
        if (!selector)
          throw new Error(`Token "${key}" requires a parenthesized selector`)
        parsed = selector.toLowerCase()
      } else if (property === "metricSize") {
        const size =
          key === "m" ? value : value.match(/^\((m\d+)\)$/i)?.[1]?.slice(1)
        if (!size || !/^\d+$/.test(size)) throw new Error("Invalid metric size")
        parsed = `M${size}`
      } else {
        // Length grammar deliberately excludes mm()'s permissive numeric prefixes.
        if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:mm|cm|m|in|inch)?$/i.test(value)) {
          throw new Error(`Invalid dimension token "${token}"`)
        }
        parsed = [
          "recessNumber",
          "tipChamferAngle",
          "threadFlankAngle",
          "recessAlpha",
          "recessBeta",
          "recessOuterWingAngle",
          "recessInnerWingAngle",
        ].includes(property)
          ? Number(value)
          : value
      }
    }
    if (property in props)
      throw new Error(`Property "${property}" is set more than once`)
    props[property] = parsed
  }
  return panScrewModelDefinitionSchema.parse({ fn: "panscrew", ...props })
}
