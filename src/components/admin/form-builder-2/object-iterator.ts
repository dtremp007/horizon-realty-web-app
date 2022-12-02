import { Schema } from "./types";
import { tail } from "rambda";
import { ValuesOf } from "@tiptap/react";

export function objectIterator(schema: Schema) {
  const next = <T>(schema: [string, T][]) => {
    if (schema.length === 0) {
      return { done: true, next: () => next([]) };
    }

    return {
      done: false,
      value: schema[0],
      next: () => next(tail(schema)),
    };
  };

  return {
    next: () => next(Object.entries(schema)),
  };
}

export class ObjectIterator {
  private entries: IterableIterator<[number, [string, ValuesOf<Schema>]]>;

  constructor(obj: Schema) {
    this.entries = Object.entries(obj).entries();
  }

  next(): IteratorResult<[string, ValuesOf<Schema>]> {
    const iteratorResult = this.entries.next()

    return { done: iteratorResult.done, value: typeof iteratorResult.value !== "undefined" ? iteratorResult.value[1] : undefined };
  }

  [Symbol.iterator]() {
    return {next: () => this.next()}
  }
}

export class ObjectIteratorChain {
  private iterators: ObjectIterator[];

  constructor() {
    this.iterators = [];
  }

  push(obj: Schema) {
    this.iterators.push(new ObjectIterator(obj));
    return this;
  }

  pop() {
    this.iterators.pop();
    return this;
  }

  next(): IteratorResult<[string, ValuesOf<Schema>]> {
    if (this.iterators.length > 0) {
        return this.iterators.at(-1)!.next()
    } else {
        return {done: true, value: undefined}
    }
  }
}
