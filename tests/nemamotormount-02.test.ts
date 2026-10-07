import { expect, test } from "bun:test"
import {
  getNemaMotorMountHoles,
  getNemaMotorMountReferencePoints,
  getNemaMotorReferencePoints,
} from "../src"

test("nemamotormount shares the motor mounting-face datum and defines all six through holes", () => {
  for (const nemaSize of [17, 23] as const) {
    const refs = getNemaMotorMountReferencePoints({ nemaSize })
    expect(refs.motorface).toEqual(
      getNemaMotorReferencePoints({ nemaSize }).frontface,
    )
    expect(refs.shaftaxis).toEqual(refs.motorface)
    expect(refs.baseface.position.y).toBe(nemaSize === 17 ? -30 : -40)
    const holes = getNemaMotorMountHoles({ nemaSize })
    const span = nemaSize === 17 ? 31 : 47.14
    expect(holes.slice(0, 4).map((h) => h.center)).toEqual(
      [-1, 1].flatMap((x) =>
        [-1, 1].map((y) => ({ x: (x * span) / 2, y: (y * span) / 2, z: 0 })),
      ),
    )
    for (const hole of holes.slice(0, 4)) {
      expect(hole.direction).toEqual({ x: 0, y: 0, z: 1 })
      expect(hole.depth).toBe(nemaSize === 17 ? 3 : 4)
    }
    expect(holes.slice(4).map((h) => h.center)).toEqual(
      nemaSize === 17
        ? [
            { x: -15, y: -27, z: -20 },
            { x: 15, y: -27, z: -20 },
          ]
        : [
            { x: -22.5, y: -36, z: -25 },
            { x: 22.5, y: -36, z: -25 },
          ],
    )
    for (const hole of holes.slice(4))
      expect(hole.direction).toEqual({ x: 0, y: -1, z: 0 })
  }
})
