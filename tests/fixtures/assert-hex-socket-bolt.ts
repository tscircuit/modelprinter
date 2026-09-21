import { expect } from "bun:test"
import {
  createHexSocketBoltMesh,
  hexSocketBoltDimensions,
  hexSocketBoltModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../../src"

export function assertHexSocketBolts() {
  // "parses the M3 x 6mm model and preserves raw parameters"
  {
    const builder = mp.string("hexsocketbolt_m3_l6mm")
    expect(builder.params()).toMatchObject({
      fn: "hexsocketbolt",
      m: "3",
      l: "6mm",
    })
    expect(builder.json()).toEqual({
      fn: "hexsocketbolt",
      metricSize: "M3",
      length: 6,
      showThreads: true,
    })
    expect(modelDefinitionSchema.parse(builder.json())).toEqual(builder.json())
    expect(modelprinter.getModelNames()).toContain("hexsocketbolt")
    expect(hexSocketBoltDimensions.M3).toEqual({
      diameter: 3,
      threadPitch: 0.5,
      headDiameter: 5.5,
      headHeight: 3,
      socketWidth: 2.5,
      socketDepth: 1.3,
    })
  }

  // "supports fractional metric sizes, units, and smooth shanks"
  {
    expect(
      mp.string("HEXSOCKETBOLT_M2.5_length0.6cm_nothreads").json(),
    ).toEqual({
      fn: "hexsocketbolt",
      metricSize: "M2.5",
      length: 6,
      showThreads: false,
    })
    expect(
      hexSocketBoltModelPropsSchema.parse({
        metricSize: "M3",
        length: "0.25in",
      }).length,
    ).toBeCloseTo(6.35)
  }

  for (const source of [
    "hexsocketbolt",
    "hexsocketbolt_m3",
    "hexsocketbolt_m7_l6mm",
    "hexsocketbolt_m3_l0",
    "hexsocketbolt_m3_l-6mm",
    "hexsocketbolt_m3_l",
    "hexsocketbolt_m3_l6mm_typo",
    "hexsocketbolt_m3_l6mm_threads0",
    "hexsocketbolt_m3_l6mm_threads_nothreads",
    "hexsocketbolt_m3_l6mm_length8mm",
    "hexsocketbolt_m3_m4_l6mm",
    "hexsocketbolt(3)_m3_l6mm",
  ]) {
    expect(() => mp.string(source).json()).toThrow()
  }

  // "schema rejects unknown props and nonfinite lengths"
  {
    for (const length of [NaN, Infinity, -1, 0, "nonsense"]) {
      expect(() =>
        hexSocketBoltModelPropsSchema.parse({ metricSize: "M3", length }),
      ).toThrow()
    }
    expect(() =>
      hexSocketBoltModelPropsSchema.parse({
        metricSize: "M3",
        length: 6,
        mystery: true,
      }),
    ).toThrow()
  }

  for (const metricSize of Object.keys(
    hexSocketBoltDimensions,
  ) as (keyof typeof hexSocketBoltDimensions)[]) {
    const { positions, indices } = createHexSocketBoltMesh({
      metricSize,
      length: 6,
    })
    const dims = hexSocketBoltDimensions[metricSize]
    const axes = [0, 1, 2].map((axis) =>
      positions.filter((_, i) => i % 3 === axis),
    )
    expect(Math.min(...axes[0]!)).toBeCloseTo(-dims.headDiameter / 2)
    expect(Math.max(...axes[0]!)).toBeCloseTo(dims.headDiameter / 2)
    expect(Math.min(...axes[2]!)).toBe(-6)
    expect(Math.max(...axes[2]!)).toBe(dims.headHeight)
    expect(positions.every(Number.isFinite)).toBe(true)
    const edges = new Map<string, { count: number; direction: number }>()
    let volume = 0
    let repeatedIndices = false
    for (let i = 0; i < indices.length; i += 3) {
      const tri = indices.slice(i, i + 3)
      const [a, b, c] = tri.map((v) => positions.slice(v * 3, v * 3 + 3)) as [
        number[],
        number[],
        number[],
      ]
      const cross = [
        b[1]! * c[2]! - b[2]! * c[1]!,
        b[2]! * c[0]! - b[0]! * c[2]!,
        b[0]! * c[1]! - b[1]! * c[0]!,
      ]
      volume += a.reduce((sum, v, j) => sum + v * cross[j]!, 0) / 6
      for (let j = 0; j < 3; j++) {
        const u = tri[j]!,
          v = tri[(j + 1) % 3]!
        if (u === v) repeatedIndices = true
        const key = `${Math.min(u, v)}:${Math.max(u, v)}`
        const edge = edges.get(key) ?? { count: 0, direction: 0 }
        edge.count++
        edge.direction += u < v ? 1 : -1
        edges.set(key, edge)
      }
    }
    expect(repeatedIndices).toBe(false)
    expect(
      [...edges.values()].every((e) => e.count === 2 && e.direction === 0),
    ).toBe(true)
    expect(volume).toBeGreaterThan(0)
    // The blind socket floor is at headHeight - socketDepth, with no cap
    // across the opening. Center vertices exist only at tip and floor.
    const centers = axes[2]!.filter(
      (_, i) => positions[i * 3] === 0 && positions[i * 3 + 1] === 0,
    )
    expect(centers).toEqual([-6, dims.headHeight - dims.socketDepth])
  }

  // "threading changes the shank and leaves the head geometry intact"
  {
    const threaded = createHexSocketBoltMesh({ metricSize: "M3", length: 6 })
    const smooth = createHexSocketBoltMesh({
      metricSize: "M3",
      length: 6,
      showThreads: false,
    })
    expect(threaded.indices).toEqual(smooth.indices)
    expect(threaded.positions).not.toEqual(smooth.positions)
    for (let i = 0; i < threaded.positions.length; i += 3) {
      if (threaded.positions[i + 2]! >= 0) {
        expect(threaded.positions.slice(i, i + 3)).toEqual(
          smooth.positions.slice(i, i + 3),
        )
      }
    }
    expect(() =>
      createHexSocketBoltMesh({ metricSize: "M3", length: 100000 }),
    ).toThrow("mesh resolution limit")
  }
}
