import { fromPromise, fromThrowable, type ResultAsync } from "neverthrow"

export function attempt<T, E = Error>(promise: Promise<T>) {
   return fromPromise(promise, err => err as E)
}

export function attemptSync<T, E = Error>(func: () => T) {
   return fromThrowable(func, err => err as E)()
}

export async function unwrap<T, E>(result: ResultAsync<T, E>): Promise<T> {
   const resolved = await result
   if (resolved.isErr()) throw resolved.error
   return resolved.value
}
