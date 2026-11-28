import { expect, test } from "bun:test"
import {
  getPcbMountingTrayDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  pcbMountingTrayModelDefinitionSchema,
  pcbMountingTrayModelPropsSchema,
} from "../src"

test("pcbmountingtray resolves open carrier tray, four bosses and two side ears", () => {
  const parsed = mp
    .string(
      "pcbmountingtray_w100mm_d80mm_h12mm_wall2mm_bossod6mm_bossid3mm_bossh5mm_hp(88mm,68mm)_ears2",
    )
    .json()
  if (parsed.fn !== "pcbmountingtray") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "pcbmountingtray",
    width: 100,
    depth: 80,
    height: 12,
    wallThickness: 2,
    bossOuterDiameter: 6,
    bossInnerDiameter: 3,
    bossHeight: 5,
    holePattern: [88, 68],
    earCount: 2,
  })
  expect(mp.string("pcbmountingtray").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pcbMountingTrayModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("pcbmountingtray")

  const dims = getPcbMountingTrayDimensions()
  expect(dims.innerWidth).toBe(96)
  expect(dims.innerDepth).toBe(76)
  expect(dims.floorTopZ).toBe(2)
  expect(dims.bossTopZ).toBe(7)
  expect(dims.rimTopZ).toBe(12)
  expect(dims.bossCenters).toEqual([
    [-44, -34],
    [44, -34],
    [-44, 34],
    [44, 34],
  ])
  expect(dims.earHoleCenters).toEqual([
    [-56, 0],
    [56, 0],
  ])
})

test("pcbmountingtray normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "PCBMOUNTINGTRAY_WIDTH12CM_DEPTH10CM_HEIGHT1.5CM_WALLTHICKNESS2.5MM_BOSSOUTERDIAMETER7MM_BOSSINNERDIAMETER3.2MM_BOSSHEIGHT6MM_HOLEPATTERN(10CM,8CM)_EARCOUNT2",
    )
    .json()
  if (custom.fn !== "pcbmountingtray") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "pcbmountingtray",
    width: 120,
    depth: 100,
    height: 15,
    wallThickness: 2.5,
    bossOuterDiameter: 7,
    bossInnerDiameter: 3.2,
    bossHeight: 6,
    holePattern: [100, 80],
    earCount: 2,
  })
  const { fn, ...props } = custom
  expect(pcbMountingTrayModelPropsSchema.parse(props)).toEqual(props)
})

test("pcbmountingtray rejects oversized bosses, wall collisions and invalid ear counts", () => {
  for (const badStr of [
    "pcbmountingtray100",
    "pcbmountingtray_w100mm_width100mm",
    "pcbmountingtray_d40mm_wall20mm",
    "pcbmountingtray_h2mm_wall2mm",
    "pcbmountingtray_bossod6mm_bossid6mm",
    "pcbmountingtray_h8mm_wall2mm_bossh7mm",
    "pcbmountingtray_w100mm_wall2mm_bossod6mm_hp(92mm,68mm)",
    "pcbmountingtray_ears4",
    "pcbmountingtray_hp(88mm)",
    "pcbmountingtray_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { bossOuterDiameter: 6, bossInnerDiameter: 6 },
    {
      width: 100,
      wallThickness: 2,
      bossOuterDiameter: 6,
      holePattern: [92, 68],
    },
    { earCount: 4 },
  ]) {
    expect(pcbMountingTrayModelPropsSchema.safeParse(badProps).success).toBe(
      false,
    )
  }
})
