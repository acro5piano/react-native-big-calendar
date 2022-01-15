interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {
}
/** @private */
declare type _DeepPartialObject<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type DeepPartial<T> = T extends Function ? T : T extends Array<infer U> ? _DeepPartialArray<U> : T extends object ? _DeepPartialObject<T> : T | undefined;
export {};
