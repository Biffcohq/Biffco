export type Ok<T> = { readonly ok: true; readonly value: T }
export type Err<E> = { readonly ok: false; readonly error: E }

export type Result<T, E = Error> = Ok<T> | Err<E>

// ─── Constructores ───────────────────────────────────────────────
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value })
export const err = <E>(error: E): Err<E> => ({ ok: false, error })

// ─── Helpers ─────────────────────────────────────────────────────
export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.ok === true
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.ok === false

// ─── Mapear el value si es Ok ────────────────────────────────────
export const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> =>
  result.ok ? ok(fn(result.value)) : result
