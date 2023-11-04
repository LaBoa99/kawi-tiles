export enum KEYBOARD {
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
    I = "i",
    J = "j",
    K = "k",
    L = "l",
    M = "m",
    N = "n",
    O = "o",
    P = "p",
    Q = "q",
    R = "r",
    S = "s",
    T = "t",
    U = "u",
    V = "v",
    W = "w",
    X = "x",
    Y = "y",
    Z = "z",
    CTRL = "Control",
    ALT = "Alt",
    ENTER = "Enter",
    ESC = "Escape"
}

export function isInKeyboard(key: string): asserts key is KEYBOARD {
    if (!Object.values(KEYBOARD).includes(key as any)) {
        throw new Error("Invalid key")
    }
}
