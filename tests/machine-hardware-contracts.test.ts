import { expect, test } from "bun:test"
import { parseModelStringParams } from "../src/parse-model-string"
import { ModelRegistry } from "../src/model-registry"
import { machineHardwareContracts } from "./fixtures/machine-hardware-models"

for (const item of machineHardwareContracts) {
  test(`${item.name}: defaults, units, registration and roundtrip`, () => {
    const defaults = item.defaults as unknown as Record<string, number>
    expect<unknown>(item.schema.parse({})).toEqual(defaults)
    const registry = new ModelRegistry()
    item.register(registry)
    expect<unknown>(registry.getModelNames()).toEqual([item.name])
    expect<unknown>(
      registry.parse(parseModelStringParams(item.source)),
    ).toEqual({ fn: item.name, ...defaults })
    const unitInput = Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [
        key,
        ["spokes", "lobes", "bladeCount"].includes(key) ? value : `${value}mm`,
      ]),
    )
    expect<unknown>(item.schema.parse(unitInput)).toEqual(defaults)
    const inches = defaults[item.first]! / 25.4
    const normalized = item.schema.parse({
      ...defaults,
      [item.first]: `${inches}in`,
    }) as unknown as Record<string, number>
    expect<unknown>(normalized[item.first]).toBeCloseTo(
      defaults[item.first]!,
      9,
    )
    const definition = registry.parse(parseModelStringParams(item.source))
    expect<unknown>(item.definition.parse(definition)).toEqual(definition)
    expect<unknown>(item.parse(parseModelStringParams(item.name))).toEqual(
      definition,
    )
  })
  test(`${item.name}: strict decimal, unknown, duplicate and impossible geometry validation`, () => {
    for (const value of [0, -1, Infinity, NaN, "1e3mm", "12oops", "0.001mm"])
      expect<unknown>(() =>
        item.schema.parse({ [item.first]: value }),
      ).toThrow()
    for (const input of [{ typo: 1 }, item.invalid])
      expect<unknown>(() => item.schema.parse(input)).toThrow()
    expect<unknown>(() => item.definition.parse({ fn: "unknown" })).toThrow()
    const value = (item.defaults as unknown as Record<string, number>)[
      item.first
    ]
    for (const source of [
      `${item.name}_typo1mm`,
      `${item.name}_${item.first.toLowerCase()}${value}mm_${item.first.toLowerCase()}${value}mm`,
      `${item.name}_${item.first.toLowerCase()}(1mm)`,
      `${item.name}12`,
    ])
      expect<unknown>(() =>
        item.parse(parseModelStringParams(source)),
      ).toThrow()
    for (const [key, value] of Object.entries(item.defaults)) {
      if (["spokes", "lobes", "bladeCount"].includes(key)) {
        expect<unknown>(() => item.schema.parse({ [key]: 2 })).toThrow()
        expect<unknown>(() =>
          item.schema.parse({ [key]: value + 0.5 }),
        ).toThrow()
        expect<unknown>(() => item.schema.parse({ [key]: 30 })).toThrow()
        expect<unknown>(() =>
          item.parse(
            parseModelStringParams(`${item.name}_${key.toLowerCase()}6mm`),
          ),
        ).toThrow()
      }
    }
  })
}
