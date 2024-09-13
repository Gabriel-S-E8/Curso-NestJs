export function add(a: number, b: number) {
    return a + b;
}

describe("Initial test", () => {
    test("add function", () => {
        expect(add(1, 2)).toEqual(3)
    })
})