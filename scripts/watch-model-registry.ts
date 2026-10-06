import { watch } from "node:fs"
import { fileURLToPath } from "node:url"
import { generateModelRegistry } from "./generate-model-registry"

await generateModelRegistry()

let timer: ReturnType<typeof setTimeout> | undefined
let generation = Promise.resolve()

watch(
  fileURLToPath(new URL("../src", import.meta.url)),
  { recursive: true },
  (_event, filename) => {
    if (filename !== null && !/^models(?:[/\\]|$)/.test(filename.toString())) {
      return
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      generation = generation
        .then(async () => {
          const { changed } = await generateModelRegistry()
          if (changed) console.log("Regenerated model registry")
        })
        .catch((error) => {
          console.error("Model registry generation failed:", error)
          process.exitCode = 1
        })
    }, 75)
  },
)

console.log("Watching src/models for model additions and removals")
