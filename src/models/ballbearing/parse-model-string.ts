import {
  parseModelStringParams,
  type RawModelprinterParams,
} from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import {
  ballBearingModelDefinitionSchema,
  ballBearingStandardSizes,
} from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  w: "width",
  width: "width",
} as const
const flags = {
  open: "bothSidesOpen",
  bothsidesopen: "bothSidesOpen",
  shielded: "bothSidesShielded",
  bothsidesshielded: "bothSidesShielded",
  sealed: "bothSidesSealed",
  bothsidessealed: "bothSidesSealed",
  topsideopen: "topSideOpen",
  topsideshielded: "topSideShielded",
  topsidesealed: "topSideSealed",
  bottomsideopen: "bottomSideOpen",
  bottomsideshielded: "bottomSideShielded",
  bottomsidesealed: "bottomSideSealed",
} as const
const suffixes = ["", "z", "zz", "2z", "rs", "2rs"] as const

export function parseBallBearingModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  const designation = tokens[0]?.toLowerCase() ?? ""
  if (raw.fn !== "ballbearing") throw new Error("Expected ballbearing")
  const props: Record<string, unknown> = { fn: "ballbearing" }
  let suffix = ""
  if (designation !== "ballbearing") {
    // Match supported codes first: 6002rs is 6002 + RS, whereas 60022rs is 6002 + 2RS.
    const compact = designation.slice("ballbearing".length)
    const code = Object.keys(ballBearingStandardSizes)
      .sort((a, b) => b.length - a.length)
      .find(
        (candidate) =>
          compact.startsWith(candidate) &&
          suffixes.some((end) => compact === candidate + end),
      )
    if (!designation.startsWith("ballbearing") || !code)
      throw new Error(`Unsupported ballbearing designation "${designation}"`)
    props.code = code
    suffix = compact.slice(code.length)
  }
  const scopes = new Set<string>()
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    if (Object.hasOwn(flags, lower)) {
      const property = flags[lower as keyof typeof flags]
      const scope = property.startsWith("both")
        ? "both"
        : property.startsWith("top")
          ? "top"
          : "bottom"
      if (scopes.has(scope))
        throw new Error(
          `ballbearing ${scope} face flags are repeated or conflict`,
        )
      scopes.add(scope)
      props[property] = true
      continue
    }
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid ballbearing token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    if (Object.hasOwn(lengths, name))
      property = lengths[name as keyof typeof lengths]
    else if (name === "code") {
      property = "code"
      if (!/^\d+$/.test(value))
        throw new Error("Bearing code must be a complete numeric designation")
    } else throw new Error(`Unknown ballbearing token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `ballbearing property "${property}" is set more than once`,
      )
    props[property] = value
  }
  // Explicit flags override suffix defaults; token order cannot change the result.
  if (!scopes.has("both")) {
    const kind =
      suffix === "zz" || suffix === "2z"
        ? "Shielded"
        : suffix === "2rs"
          ? "Sealed"
          : "Open"
    props[`bothSides${kind}`] = true
    if (!scopes.has("bottom") && (suffix === "z" || suffix === "rs"))
      props[suffix === "z" ? "bottomSideShielded" : "bottomSideSealed"] = true
  }
  return ballBearingModelDefinitionSchema.parse(props)
}

// Expand the shortest Number representation without introducing unsupported exponent syntax.
function decimal(value: number): string {
  const source = String(value)
  if (!source.includes("e")) return source
  const [mantissa, exponent] = source.split("e")
  const [whole, fraction = ""] = mantissa!.split(".")
  const digits = whole! + fraction
  const point = whole!.length + Number(exponent)
  if (point <= 0) return `0.${"0".repeat(-point)}${digits}`
  if (point >= digits.length) return digits + "0".repeat(point - digits.length)
  return `${digits.slice(0, point)}.${digits.slice(point)}`
}

export function normalizeBallBearingModelString(value: string): string {
  const props = parseBallBearingModelParams(parseModelStringParams(value))
  const top = props.topSideOpen
    ? "open"
    : props.topSideShielded
      ? "shielded"
      : "sealed"
  const bottom = props.bottomSideOpen
    ? "open"
    : props.bottomSideShielded
      ? "shielded"
      : "sealed"
  const faces =
    top === bottom ? `bothsides${top}` : `topside${top}_bottomside${bottom}`
  return `ballbearing_id${decimal(props.innerDiameter)}mm_od${decimal(props.outerDiameter)}mm_w${decimal(props.width)}mm_${faces}`
}
