import { expect } from "bun:test"
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  utimes,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { z } from "zod"
import { generateModelRegistry } from "../../scripts/generate-model-registry"
import { ModelRegistry } from "../../src/model-registry"
import { parseModelStringParams } from "../../src/parse-model-string"

const registryPath = fileURLToPath(
  new URL("../../src/model-registry.ts", import.meta.url),
)
const paramsPath = fileURLToPath(
  new URL("../../src/parse-model-string.ts", import.meta.url),
)

async function addModel(modelsDir: string, name: "alpha" | "beta") {
  const folder = join(modelsDir, name)
  await mkdir(folder, { recursive: true })
  await writeFile(
    join(folder, "schema.ts"),
    `import { z } from "zod"\nexport const ${name}Schema = z.object({ fn: z.literal(${JSON.stringify(name)}), value: z.number().int().positive().default(7) }).strict()\n`,
  )
  await writeFile(
    join(folder, "parse-model-string.ts"),
    `import type { RawModelprinterParams } from ${JSON.stringify(paramsPath)}\nimport { ${name}Schema } from "./schema"\nexport const parse = (params: RawModelprinterParams) => ${name}Schema.parse({ fn: params.fn, value: params.value === undefined ? undefined : Number(params.value) })\n`,
  )
  await writeFile(
    join(folder, "register.ts"),
    `import { defineModel, type ModelRegistry } from ${JSON.stringify(registryPath)}\nimport { ${name}Schema } from "./schema"\nimport { parse } from "./parse-model-string"\nexport const model = defineModel({ name: ${JSON.stringify(name)}, schema: ${name}Schema, parse })\nexport function register(registry: ModelRegistry): void { registry.register(model) }\n`,
  )
  await writeFile(join(folder, "index.ts"), `export * from "./schema"\n`)
}

interface GeneratedFixtureModule {
  builtinModels: readonly { name: string; schema: z.ZodType }[]
  modelDefinitionSchema: z.ZodType
  registerAllModels(registry: ModelRegistry): void
  alphaSchema?: z.ZodType
  betaSchema?: z.ZodType
}

async function loadGenerated(outputFile: string, revision: number) {
  // Bun caches imported filesystem modules across query strings. A distinct
  // adjacent filename observes each generated revision with identical imports.
  const revisionFile = join(dirname(outputFile), `revision-${revision}.ts`)
  await writeFile(revisionFile, await readFile(outputFile, "utf8"))
  try {
    return (await import(
      pathToFileURL(revisionFile).href
    )) as GeneratedFixtureModule
  } finally {
    await rm(revisionFile)
  }
}

export async function assertModelRegistryGeneration() {
  const temporary = await mkdtemp(join(tmpdir(), "modelprinter-discovery-"))
  try {
    const modelsDir = join(temporary, "first/src/models")
    const outputFile = join(temporary, "first/src/generated/models.ts")
    const options = {
      modelsDir,
      outputFile,
      registryModuleSpecifier: registryPath,
    }
    await addModel(modelsDir, "alpha")
    await mkdir(join(modelsDir, "ignored/nested"), { recursive: true })
    await writeFile(
      join(modelsDir, "ignored/nested/register.ts"),
      "throw new Error('nested adapters must not be discovered')\n",
    )
    await writeFile(
      join(modelsDir, "ignored/index.ts"),
      "throw new Error('folders without adapters must not be discovered')\n",
    )

    // Link dependencies only inside the disposable fixture root. Production
    // discovery and source files are never edited by this test.
    const { symlink } = await import("node:fs/promises")
    await symlink(
      fileURLToPath(new URL("../../node_modules", import.meta.url)),
      join(temporary, "node_modules"),
      process.platform === "win32" ? "junction" : "dir",
    )
    const first = await generateModelRegistry(options)
    expect<unknown>(first.changed).toBe(true)
    expect<unknown>(first.modelDirectories).toEqual(["alpha"])
    expect<unknown>(await readFile(outputFile, "utf8")).toBe(first.source)
    const single = await loadGenerated(outputFile, 1)
    expect<unknown>(single.builtinModels.map((model) => model.name)).toEqual([
      "alpha",
    ])
    expect<unknown>(single.modelDefinitionSchema).toBe(single.alphaSchema!)
    const singleRegistry = new ModelRegistry()
    single.registerAllModels(singleRegistry)
    expect<unknown>(
      singleRegistry.parse(parseModelStringParams("alpha_value9")),
    ).toEqual({ fn: "alpha", value: 9 })
    expect<unknown>(
      single.modelDefinitionSchema.parse({ fn: "alpha" }),
    ).toEqual({ fn: "alpha", value: 7 })
    expect<unknown>(() =>
      singleRegistry.parse(parseModelStringParams("alpha_value0")),
    ).toThrow()

    const fixedTime = new Date("2001-01-01T00:00:00.000Z")
    await utimes(outputFile, fixedTime, fixedTime)
    const unchanged = await generateModelRegistry(options)
    expect<unknown>(unchanged.changed).toBe(false)
    expect<unknown>(unchanged.source).toBe(first.source)
    expect<unknown>((await stat(outputFile)).mtimeMs).toBe(fixedTime.getTime())

    await addModel(modelsDir, "beta")
    const added = await generateModelRegistry(options)
    expect<unknown>(added.changed).toBe(true)
    expect<unknown>(added.modelDirectories).toEqual(["alpha", "beta"])
    const multiple = await loadGenerated(outputFile, 2)
    const multipleRegistry = new ModelRegistry()
    multiple.registerAllModels(multipleRegistry)
    expect<unknown>(multipleRegistry.getModelNames()).toEqual(["alpha", "beta"])
    expect<unknown>(
      multipleRegistry.parse(parseModelStringParams("beta")),
    ).toEqual({ fn: "beta", value: 7 })
    expect<unknown>(
      multiple.modelDefinitionSchema.safeParse({ fn: "alpha" }).success,
    ).toBe(true)
    expect<unknown>(
      multiple.modelDefinitionSchema.safeParse({ fn: "beta" }).success,
    ).toBe(true)
    expect<unknown>(
      multiple.modelDefinitionSchema.safeParse({ fn: "unknown" }).success,
    ).toBe(false)
    expect<unknown>(multiple.alphaSchema).toBe(
      multiple.builtinModels[0]!.schema,
    )
    expect<unknown>(multiple.betaSchema).toBe(multiple.builtinModels[1]!.schema)

    // Creating the same adapters in reverse order must produce identical
    // bytes, including relative imports, independent of absolute temp paths.
    const otherModelsDir = join(temporary, "second/src/models")
    const otherOutputFile = join(temporary, "second/src/generated/models.ts")
    await addModel(otherModelsDir, "beta")
    await addModel(otherModelsDir, "alpha")
    const other = await generateModelRegistry({
      modelsDir: otherModelsDir,
      outputFile: otherOutputFile,
      registryModuleSpecifier: registryPath,
    })
    expect<unknown>(other.source).toBe(added.source)
    expect<unknown>(other.modelDirectories).toEqual(added.modelDirectories)

    await rm(join(modelsDir, "beta"), { recursive: true })
    const removed = await generateModelRegistry(options)
    expect<unknown>(removed.changed).toBe(true)
    expect<unknown>(removed.source).toBe(first.source)
    const remaining = await loadGenerated(outputFile, 3)
    const remainingRegistry = new ModelRegistry()
    remaining.registerAllModels(remainingRegistry)
    expect<unknown>(remainingRegistry.getModelNames()).toEqual(["alpha"])
    expect<unknown>(remaining.betaSchema).toBeUndefined()
    expect<unknown>(
      remaining.modelDefinitionSchema.safeParse({ fn: "beta" }).success,
    ).toBe(false)
    expect<unknown>(() =>
      remainingRegistry.parse(parseModelStringParams("beta")),
    ).toThrow('Unsupported modelprinter function "beta"')
    expect<unknown>(multipleRegistry.getModelNames()).toEqual(["alpha", "beta"])

    const previousBytes = await readFile(outputFile, "utf8")
    const previousTime = (await stat(outputFile)).mtimeMs
    await rm(join(modelsDir, "alpha"), { recursive: true })
    await expect<unknown>(generateModelRegistry(options)).rejects.toThrow(
      `No model registration adapters found in ${modelsDir}`,
    )
    expect<unknown>(await readFile(outputFile, "utf8")).toBe(previousBytes)
    expect<unknown>((await stat(outputFile)).mtimeMs).toBe(previousTime)
    expect<unknown>(
      await readdir(join(temporary, "first/src/generated")),
    ).toEqual(["models.ts"])
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
