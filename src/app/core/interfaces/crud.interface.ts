export interface CRUD<T> {
    create(item: T): T
    readAll(): T[]
    read(key: string, value: any): T | null | undefined
    update(key: string, value: any, item: T): T | null | undefined
    delete(key: string, value: any): boolean;
    remove(item: T): boolean
}