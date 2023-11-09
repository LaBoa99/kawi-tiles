import { BehaviorSubject, Observable } from 'rxjs';

export class BehaviorListController<T> {
    private _list$ !: BehaviorSubject<T[]>;
    public subject$ !: Observable<T[]>;

    constructor(initialValue: T[]) {
        this._list$ = new BehaviorSubject<T[]>(initialValue);
        this.subject$ = this._list$.asObservable();
    }

    all(): T[] {
        return this.values
    }

    clean(): void {
        this._list$.next([])
    }

    // Obtiene un elemento del arreglo en la posición 'index'.
    get(index: number): T | undefined {
        return this.values[index];
    }

    // Agrega un elemento al final del arreglo.
    push(value: T): void {
        const values = this.values;
        values.push(value);
        this._list$.next(values);
    }

    unshift(value: T): void {
        const values = this.values;
        values.unshift(value);
        this._list$.next(values);
    }

    // Reemplaza un elemento en el arreglo en la posición 'index' con el nuevo valor 'value'.
    set(index: number, value: T): T | undefined {
        const values = this.values;
        const targetValue = values[index];
        if (targetValue) {
            values[index] = value;
            this._list$.next(values);
        }
        return targetValue;
    }

    // Elimina un elemento del arreglo en la posición 'index' y devuelve un arreglo con el elemento eliminado.
    removeAt(index: number): T | null {
        if (!this.values.length || index < 0 || index >= this.values.length) {
            return null;
        }
        const values = this.values;
        const valuesRemoved = values.splice(index, 1)[0];
        this._list$.next(values);
        return valuesRemoved;
    }

    // Obtiene una copia del arreglo actual.
    get values(): T[] {
        return [...this._list$.getValue()];
    }
}
