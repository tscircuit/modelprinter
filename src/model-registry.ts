import type { z } from "zod"
import type { RawModelprinterParams } from "./parse-model-string"

/** The discriminator shared by every normalized model definition. */
export type RegisteredModelDefinition = {
  fn: string
  [property: string]: unknown
}

type IsUnion<Value, Whole = Value> = Value extends Whole
  ? [Whole] extends [Value]
    ? false
    : true
  : never

type LowercaseLetter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"

type HasLiteralLetters<Name extends string> = string extends Name
  ? false
  : Name extends ""
    ? true
    : Name extends `${infer First}${infer Rest}`
      ? First extends LowercaseLetter
        ? HasLiteralLetters<Rest>
        : false
      : false

type LiteralModelName<Name extends string> = [Name] extends [""]
  ? never
  : string extends Name
    ? never
    : true extends IsUnion<Name>
      ? never
      : HasLiteralLetters<Name> extends true
        ? Name
        : never

export type ModelRegistration<
  Name extends string = string,
  Schema extends z.ZodType<{ fn: Name }, z.ZodTypeDef, unknown> = z.ZodType<
    { fn: Name },
    z.ZodTypeDef,
    unknown
  >,
> = {
  readonly name: Name
  readonly schema: Schema
  /** Validate and normalize raw parameters with the model's schema. */
  readonly parse: (params: RawModelprinterParams) => z.output<NoInfer<Schema>>
}

/** Preserve the literal name and schema output without widening either. */
export function defineModel<
  const Name extends string,
  Schema extends z.ZodType<{ fn: NoInfer<Name> }, z.ZodTypeDef, unknown>,
>(
  model: ModelRegistration<Name, Schema> & {
    readonly name: LiteralModelName<NoInfer<Name>>
  },
): ModelRegistration<Name, Schema> {
  return model
}

/** Explicit registrations belong to this instance, never to globalThis. */
export class ModelRegistry {
  private readonly models = new Map<string, ModelRegistration>()

  register<
    const Name extends string,
    Schema extends z.ZodType<{ fn: NoInfer<Name> }, z.ZodTypeDef, unknown>,
  >(
    model: ModelRegistration<Name, Schema> & {
      readonly name: LiteralModelName<NoInfer<Name>>
    },
  ): void {
    if (typeof model.name !== "string" || !/^[a-z]+$/.test(model.name)) {
      throw new Error("Model names must contain only lowercase letters")
    }
    if (this.models.has(model.name)) {
      throw new Error(
        `Modelprinter function "${model.name}" is already registered`,
      )
    }
    // Snapshot the descriptor so later changes to its object cannot replace
    // an instance's registered parser or name.
    this.models.set(model.name, {
      name: model.name,
      schema: model.schema,
      parse: model.parse,
    })
  }

  getModelNames(): string[] {
    return [...this.models.keys()]
  }

  parse(params: RawModelprinterParams): RegisteredModelDefinition {
    const model = this.models.get(params.fn)
    if (!model) {
      throw new Error(`Unsupported modelprinter function "${params.fn}"`)
    }
    // A parser owns its schema validation and normalization. Re-parsing its
    // output would repeat transforms and could change existing behavior.
    const definition = model.parse(params)
    if (
      definition === null ||
      typeof definition !== "object" ||
      Array.isArray(definition) ||
      definition.fn !== model.name
    ) {
      throw new Error(
        `Parser for "${model.name}" must return a model with fn "${model.name}"`,
      )
    }
    return definition
  }
}
