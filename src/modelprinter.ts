import { registerAllModels, type ModelDefinition } from "./generated/models"
import { ModelRegistry } from "./model-registry"
import {
  parseModelStringParams,
  type RawModelprinterParams,
} from "./parse-model-string"

const registry = new ModelRegistry()
registerAllModels(registry)

const modelParamsToJson = (params: RawModelprinterParams): ModelDefinition =>
  // Only the generated built-ins populate this private registry. Their
  // schemas also define the generated ModelDefinition union.
  registry.parse(params) as ModelDefinition

export const string = (value: string) => {
  const params = registry.normalize(parseModelStringParams(value))
  return {
    params: () => params,
    json: () => modelParamsToJson(params),
  }
}

export const parseModelString = (value: string): ModelDefinition =>
  string(value).json()

export const modelprinter = {
  string,
  getModelNames: () => registry.getModelNames(),
}

/** Compact alias matching footprinter's familiar `fp.string(...)` API. */
export const mp = modelprinter
