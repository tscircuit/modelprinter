export interface As568ORingSpec {
  size: string
  innerDiameterInch: number
  crossSectionInch: number
  innerDiameter: number
  crossSectionDiameter: number
}

const IN_MM = 25.4

const RAW_AS568_SPECS: readonly [string, number, number][] = [
  ["006", 0.114, 0.07],
  ["008", 0.176, 0.07],
  ["010", 0.239, 0.07],
  ["012", 0.364, 0.07],
  ["014", 0.489, 0.07],
  ["016", 0.614, 0.07],
  ["110", 0.362, 0.103],
  ["112", 0.487, 0.103],
  ["114", 0.612, 0.103],
  ["116", 0.737, 0.103],
  ["210", 0.734, 0.139],
  ["212", 0.859, 0.139],
  ["214", 0.984, 0.139],
  ["216", 1.109, 0.139],
  ["218", 1.234, 0.139],
  ["220", 1.359, 0.139],
]

export const AS568_ORING_TABLE: readonly As568ORingSpec[] = RAW_AS568_SPECS.map(
  ([size, innerDiameterInch, crossSectionInch]) => ({
    size,
    innerDiameterInch,
    crossSectionInch,
    innerDiameter: innerDiameterInch * IN_MM,
    crossSectionDiameter: crossSectionInch * IN_MM,
  }),
)

export function findAs568ORingSpec(size: string): As568ORingSpec | null {
  const normalized = size.trim().padStart(3, "0")
  return AS568_ORING_TABLE.find((entry) => entry.size === normalized) ?? null
}
