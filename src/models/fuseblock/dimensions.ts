import {
  type FuseBlockModelPropsInput,
  fuseBlockModelPropsSchema,
} from "./schema"

export function getFuseBlockDimensions(input: FuseBlockModelPropsInput = {}) {
  const p = fuseBlockModelPropsSchema.parse(input)
  const installedTopZ = p.height + p.fuseDiameter / 2
  return {
    ...p,
    installedTopZ,
    bottomZ: 0,
    topZ: p.height,
  }
}
