//const repository = require("./repositoryService");
const interactionService = require("./interactionService");
const distanceRuleService = require("./distanceRuleService");
const branchResolverService = require("./branchResolverService");
const formulaService = require("./formulaService");
//const transformationService = require("./transformationService");


class AssessmentResolver {

    resolve(request, context) {

        //throw new Error("Entered assessmentResolver.resolve()");
        this.resolveInteraction(context);
        console.log("✓ Interaction resolved");

        this.resolveDistanceRule(context);
        console.log("✓ Distance Rule resolved");

        this.resolveBranch(request, context);
        console.log("✓ Branch resolved");

        this.resolveFormula(context);
        console.log("✓ Formula resolved");

        return context;

    }

    // Attach the appropriate interaction to the request
    resolveInteraction(context) {

        context.interaction = interactionService.resolve(context);

    }

    resolveDistanceRule(context) {

        context.distanceRule = distanceRuleService.resolve(context.interaction);

    }

    resolveBranch(request, context) {

        context.branch = branchResolverService.resolve(
            context.distanceRule, 
            request
        );

    }

    resolveFormula(context) {

        context.formula = formulaService.resolve(context.branch);

    }

 
}

module.exports = new AssessmentResolver();