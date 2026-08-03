//const { repository } = require("@aastp/core-data");
import { repository } from "@aastp/core-data";


test("loads PES collection", () => {
    const collection = repository.getCollection("pesTypes");

    expect(Array.isArray(collection)).toBe(true);
    expect(collection.length).toBeGreaterThan(0);
});

test("finds a PES by ID", () => {
    const pes = repository.findById("pesTypes", "PES001");

    expect(pes).not.toBeNull();
    expect(pes.id).toBe("PES001");
});

test("throws for an unknown dataset", () => {
    expect(() => {
        repository.getCollection("unknownDataset");
    }).toThrow();
});

test("returns null for an unknown ID", () => {
    const result = repository.findById(
        "pesTypes",
        "DOES_NOT_EXIST"
    );

    expect(result).toBeNull();
});

test("returns the available dataset list", () => {

    const datasets =
        repository.getAvailableDatasets();

    expect(datasets).toContain("pesTypes");
    expect(datasets).toContain("esTypes");

});

test("returns the same cached dataset instance", () => {

    const first =
        repository.getDataset("pesTypes");

    const second =
        repository.getDataset("pesTypes");

    expect(first).toBe(second);

});