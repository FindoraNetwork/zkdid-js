import { CacheType, DID } from '../types';
interface CacheDataType {
    [CacheType.DID]: DID;
    [CacheType.CIRCUIT]: string;
    [CacheType.ZKCredential]: string;
}
export declare const getContentByKey: <T extends CacheType>(eCacheType: T, key: string) => CacheDataType[T] | null;
export declare const setContentByKey: <T extends CacheType>(eCacheType: T, key: string, data: CacheDataType[T]) => void;
export {};
