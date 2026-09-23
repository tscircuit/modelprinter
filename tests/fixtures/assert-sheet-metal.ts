import { expect } from "bun:test"
import { createSheetMetalMesh, mp } from "../../src"
import { sheetMetalExamples } from "./sheet-metal-examples"

export function assertSheetMetal() {
  expect(
    mp.string("sheetmetal_channel_w28mm_l24mm_h14mm_t1mm_r2mm").json(),
  ).toMatchObject({
    fn: "sheetmetal",
    profile: "channel",
    width: 28,
    baseLength: 24,
  })
  expect(
    mp
      .string("sheetmetal_plate_w20_l20_hole1(r3mm_bottomface_leftofcenter3mm)")
      .json(),
  ).toMatchObject({
    holes: [{ panel: "base", shape: "round", diameter: 6, u: -3, v: 0 }],
  })
  expect(
    mp
      .string(
        "sheetmetal_channel_w28_l24_slot1(l10_w2_leftface_rightofcenter3_abovecenter2_vertical)",
      )
      .json(),
  ).toMatchObject({
    holes: [
      {
        panel: "left",
        shape: "slot",
        length: 10,
        width: 2,
        u: 2,
        v: -3,
        axis: "u",
      },
    ],
  })
  expect(
    mp
      .string("sheetmetal_angle_w28_l24_hole1(d2_angledface_rightofcenter3)")
      .json(),
  ).toMatchObject({ holes: [{ panel: "right", diameter: 2, u: 0, v: 3 }] })
  for (const feature of [
    "hole1(r2)",
    "hole1(r2_leftface)",
    "hole1(r2_bottomface_angledface)",
    "hole1(r2_d4_bottomface)",
    "hole1(r2_bottomface_leftofcenter2_rightofcenter3)",
    "hole1(r2_bottomface_leftofcenter-2)",
    "hole1(r2_bottomface_unknown)",
    "slot1(l2_w4_bottomface)",
    "slot1(l4_bottomface)",
    "hole1(r0_bottomface)",
    "slot1(l4_w2_bottomface_horizontal_vertical)",
    "hole1(r2_bottomface",
    "hole0(r2_bottomface)",
    "hole1(r2_bottomface)_hole1(r2_bottomface)",
    "hole1(r2__bottomface)",
  ])
    expect(
      () => mp.string(`sheetmetal_plate_w20_l20_${feature}`).json(),
      feature,
    ).toThrow()
  for (const props of sheetMetalExamples) {
    const mesh = createSheetMetalMesh(props)
    // Check the emitted surface, welding triangle corners geometrically.
    const edges = new Map<string, { count: number; balance: number }>()
    let volume = 0
    for (let i = 0; i < mesh.indices.length; i += 3) {
      const points = mesh.indices
        .slice(i, i + 3)
        .map((index) => mesh.positions.slice(index * 3, index * 3 + 3))
      const [a, b, c] = points as [number[], number[], number[]]
      volume +=
        (a[0]! * (b[1]! * c[2]! - b[2]! * c[1]!) +
          a[1]! * (b[2]! * c[0]! - b[0]! * c[2]!) +
          a[2]! * (b[0]! * c[1]! - b[1]! * c[0]!)) /
        6
      const keys = points.map((point) =>
        point.map((n) => Math.round(n * 1e7)).join(","),
      )
      for (let j = 0; j < 3; j++) {
        const a = keys[j]!,
          b = keys[(j + 1) % 3]!
        expect(a).not.toBe(b)
        const key = [a, b].sort().join("|"),
          edge = edges.get(key) ?? { count: 0, balance: 0 }
        edge.count++
        edge.balance += a < b ? 1 : -1
        edges.set(key, edge)
      }
    }
    expect(volume).toBeGreaterThan(100)
    for (const [key, edge] of edges.entries())
      expect(edge, `${props.profile}: ${key}`).toEqual({ count: 2, balance: 0 })
  }
  expect(() =>
    createSheetMetalMesh({
      width: 10,
      baseLength: 10,
      holes: [{ panel: "base", shape: "round", diameter: 4, u: 4, v: 0 }],
    }),
  ).toThrow("edge")
  expect(() =>
    createSheetMetalMesh({
      width: 10,
      baseLength: 10,
      holes: [{ panel: "right", shape: "round", diameter: 2, u: 0, v: 0 }],
    }),
  ).toThrow("panel")
  expect(() => mp.string("sheetmetal_angle_w10_w12_l10").json()).toThrow(
    "Duplicate",
  )
}
