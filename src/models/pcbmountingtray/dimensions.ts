import {
  type PcbMountingTrayModelPropsInput,
  pcbMountingTrayModelPropsSchema,
} from "./schema"

/** Resolved PCB carrier tray cavity, boss centers and outward ear bounds in mm. */
export function getPcbMountingTrayDimensions(
  input: PcbMountingTrayModelPropsInput = {},
) {
  const props = pcbMountingTrayModelPropsSchema.parse(input)
  const [pitchX, pitchY] = props.holePattern
  const innerWidth = props.width - 2 * props.wallThickness
  const innerDepth = props.depth - 2 * props.wallThickness
  const earExtension = props.bossOuterDiameter * 2
  const earWidth = props.bossOuterDiameter * 3
  const overallSpanX = props.width + 2 * earExtension
  return {
    ...props,
    innerWidth,
    innerDepth,
    earExtension,
    earWidth,
    earHoleDiameter: props.bossInnerDiameter,
    earHoleCenters: [
      [-(props.width * 0.5 + earExtension * 0.5), 0],
      [props.width * 0.5 + earExtension * 0.5, 0],
    ] as [[number, number], [number, number]],
    bossCenters: [
      [-pitchX * 0.5, -pitchY * 0.5],
      [pitchX * 0.5, -pitchY * 0.5],
      [-pitchX * 0.5, pitchY * 0.5],
      [pitchX * 0.5, pitchY * 0.5],
    ] as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
    bottomZ: 0,
    floorTopZ: props.wallThickness,
    bossTopZ: props.wallThickness + props.bossHeight,
    rimTopZ: props.height,
    size: [overallSpanX, props.depth, props.height] as [number, number, number],
  }
}
