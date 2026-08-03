//const repositoryService = require("@services/repositoryService");
import { repositoryService } from "@aastp/core-data";

describe("RepositoryService", () => {

    describe("Collection Retrieval", () => {
        
        test("returns PES collection", () => {

            const collection = repositoryService.getPesTypes();

            expect(Array.isArray(collection)).toBe(true);

        });

        test("returns ES collection", () => {

    const collection = repositoryService.getEsTypes();

    expect(Array.isArray(collection)).toBe(true);

        });

        test("returns Hazard Categories", () => {

    const collection = repositoryService.getHazardCategories();

    expect(Array.isArray(collection)).toBe(true);

        });

        test("returns Orientation Types", () => {

    const collection = repositoryService.getOrientationTypes();

    expect(Array.isArray(collection)).toBe(true);

        });

        test("returns ECM Protection Ratings", () => {

    const collection = repositoryService.getEcmProtectionRatings();

    expect(Array.isArray(collection)).toBe(true);

        });
    
    });

    describe("Object Lookup", () => {

        test("finds a PES by ID", () => {

    const pes = repositoryService.getPesTypes()[0];
    const result =
        repositoryService.findPesTypeById(pes.id);

    expect(result).toEqual(pes);

        });

        test("returns null for an unknown PES", () => {

    const pes =
        repositoryService.findPesTypeById("INVALID");

    expect(pes).toBeNull();

        });

        test("finds a ES by ID", () => {

    const es = repositoryService.getEsTypes()[0];
    const result =
        repositoryService.findEsTypeById(es.id);

    expect(result).toEqual(es);

        });

        test("returns null for an unknown ES", () => {

    const es =
        repositoryService.findEsTypeById("INVALID");

    expect(es).toBeNull();

        });

        test("finds an Orientation by ID", () => {

    const orientation = repositoryService.getOrientationTypes()[0];
    const result =
        repositoryService.findOrientationTypeById(orientation.id);

    expect(result).toEqual(orientation);

        });

        test("returns null for an unknown Orientation", () => {

    const orientation =
        repositoryService.findOrientationTypeById("INVALID");

    expect(orientation).toBeNull();

        });

        test("finds a Hazard Category by ID", () => {

    const hazard = repositoryService.getHazardCategories()[0];
    const result =
        repositoryService.findHazardById(hazard.id);

    expect(result).toEqual(hazard);

        });

        test("returns null for an unknown Hazard", () => {

    const hazard =
        repositoryService.findHazardById("INVALID");

    expect(hazard).toBeNull();

        });

        test("finds a ECM Protection Rating by ID", () => {

    const ecm = repositoryService.getEcmProtectionRatings()[0];
    const result =
        repositoryService.findEcmProtectionRatingById(ecm.id);

    expect(result).toEqual(ecm);

        });

        test("returns null for an unknown ECM Protection Rating", () => {

    const ecm =
        repositoryService.findEcmProtectionRatingById("INVALID");

    expect(ecm).toBeNull();

        });

        test("finds a Formula by ID", () => {

    const form =
        repositoryService.findFormulaById("FORM001");

    expect(form).not.toBeNull();
    expect(form.id).toBe("FORM001");

        });

        test("returns null for an unknown Formula", () => {

    const form =
        repositoryService.findFormulaById("INVALID");

    expect(form).toBeNull();

        });

        test("finds a Distance Rule by ID", () => {

    const dr =
        repositoryService.findDistanceRuleById("BD01");

    expect(dr).not.toBeNull();
    expect(dr.id).toBe("BD01");

        });

        test("returns null for an unknown Distance Rule", () => {

    const dr =
        repositoryService.findDistanceRuleById("INVALID");

    expect(dr).toBeNull();

        });

        test("finds a Structure by ID", () => {

    const structure =
        repositoryService.findStructureById("STR001");

    expect(structure).not.toBeNull();
    expect(structure.id).toBe("STR001");

        });

        test("returns null for an unknown Structure", () => {

    const structure =
        repositoryService.findStructureById("INVALID");

    expect(structure).toBeNull();

        });

        test("finds an Orientation by ID", () => {

    const orientation =
        repositoryService.findOrientationTypeById("OR001");

    expect(orientation).not.toBeNull();
    expect(orientation.id).toBe("OR001");

        });

        test("returns null for an unknown Orientation", () => {

    const orientation =
        repositoryService.findOrientationTypeById("INVALID");

    expect(orientation).toBeNull();

        });

        test("finds an Effect by ID", () => {

    const effect =
        repositoryService.findEffectById("EFF001");

    expect(effect).not.toBeNull();
    expect(effect.id).toBe("EFF001");

        });

        test("returns null for an unknown Effect", () => {

    const effect =
        repositoryService.findEffectById("INVALID");

    expect(effect).toBeNull();

        });

    });

    describe("Domain Queries", () => {

        test("finds an interaction for a valid context", () => {

    const interaction =
    repositoryService.findInteraction({
        pesType: "PES001",
        pesOrientation: "rear",
        esType: "ES001",
        esOrientation: "rear",
        hazard: "1.1",
        neq: 1000
    });

    expect(interaction).not.toBeNull();

        });

        test("doesn't fin an interaction for an invalid context", () => {

    const interaction =
    repositoryService.findInteraction({
        pesType: "INVALID",
        pesOrientation: "rear",
        esType: "ES001",
        esOrientation: "rear",
        hazard: "1.1",
        neq: 1000
    });

    expect(interaction).toBeNull();

        });

    });

})