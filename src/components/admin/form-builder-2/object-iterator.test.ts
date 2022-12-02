import { objectIterator, ObjectIteratorChain } from "./object-iterator";

const testDummy = {
  title: "Un Casa",
  listingType: ["CASA", "LOTE", "BODEGA"],
  price: {
    amount: 1000,
    currency: ["USD", "MXN"],
  },
  public: true,
};

describe("@form-builder/object-iterator", () => {
  it("Can successfully iterate through testDummy", () => {
    const iterator = objectIterator(testDummy);

    expect(iterator.next().value).toEqual(["title", "Un Casa"]);
    expect(iterator.next().next().value).toEqual([
      "listingType",
      ["CASA", "LOTE", "BODEGA"],
    ]);
    expect(iterator.next().next().next().value).toEqual([
      "price",
      {
        amount: 1000,
        currency: ["USD", "MXN"],
      },
    ]);
    expect(iterator.next().next().next().next().value).toEqual(["public", true]);
  });
});

describe("@form-builder/ObjectIteratorChain", () => {
  it("Can successfully iterate through testDummy", () => {
    const iterator = new ObjectIteratorChain().push(testDummy);

    expect(iterator.next().value).toEqual(["title", "Un Casa"]);
    expect(iterator.next().value).toEqual([
      "listingType",
      ["CASA", "LOTE", "BODEGA"],
    ]);
    expect(iterator.next().value).toEqual([
      "price",
      {
        amount: 1000,
        currency: ["USD", "MXN"],
      },
    ]);
    expect(iterator.next().value).toEqual(["public", true]);

  });

  it("Can dynamically add new iterators", () => {
    const iterator = new ObjectIteratorChain().push(testDummy);

    expect(iterator.next().value).toEqual(["title", "Un Casa"]);

    iterator.push({coordinates: [10, 100]})

    expect(iterator.next().value).toEqual(["coordinates", [10, 100]]);

    expect(iterator.next().done).toBe(true)

    iterator.pop();

    expect(iterator.next().done).toBe(true);
  })
});
