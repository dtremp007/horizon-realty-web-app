import { pipe } from "rambda"

describe("Function can apply an array of transformer functions to filters", () => {
    it("successfully applies an array of functions to an array of numbers", () => {
        const numbers = [5,4,3,2,1]

        const transformers = [
            (n: number[]) => n.sort(),
            (n: number[]) => n.map(n => ++n)
        ]
    const transform = pipe.apply(null, transformers)
    expect(transform(numbers)).toEqual([2,3,4,5,6])
    })

    it("works with filters", () => {

        const filter = [
            {
                id: "price",
                min: 0,
                max: 1000,
                fallback: [] as number[],
                position: 2,
            },
            {
                id: "price",
                min: 10,
                max: 2000,
                fallback: [] as number[],
                position: 1,
            }
        ]

        const filter_output = [
            {
                id: "price",
                min: 10,
                max: 2000,
                fallback: [10,2000],
                position: 1,
            },
            {
                id: "price",
                min: 0,
                max: 1000,
                fallback: [0,1000],
                position: 2,
            },
        ]

        type Filters = typeof filter;
        const transformers = [
            (filters: Filters) => filters.sort((a,b) => a.position - b.position),
            (filters: Filters) => filters.map(f => {
                f.fallback = [f.min,f.max]
                return f
            }),
        ]

    const transform = pipe.apply(null, transformers)
    expect(transform(filter)).toStrictEqual(filter_output)
    })
})

export{}
