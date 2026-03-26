export type Ok<T> = {
    readonly ok: true;
    readonly value: T;
};
export type Err<E> = {
    readonly ok: false;
    readonly error: E;
};
export type Result<T, E = Error> = Ok<T> | Err<E>;
export declare const ok: <T>(value: T) => Ok<T>;
export declare const err: <E>(error: E) => Err<E>;
export declare const isOk: <T, E>(r: Result<T, E>) => r is Ok<T>;
export declare const isErr: <T, E>(r: Result<T, E>) => r is Err<E>;
export declare const mapResult: <T, U, E>(result: Result<T, E>, fn: (value: T) => U) => Result<U, E>;
//# sourceMappingURL=result.d.ts.map