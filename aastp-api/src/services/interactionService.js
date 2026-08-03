import { repositoryService } from "@aastp/core-data";

function process(context) {

    context.interaction = findApplicableInteraction(context);
    
    return context; 

}

function findApplicableInteraction(context) {

    const criteria = {
        pesType: context.resolvedEntities.pesType.id,
        esType: context.resolvedEntities.esType.id,
        pesOrientation: context.request.pesOrientation,
        esOrientation: context.request.esOrientation
    };

    const interaction =
        repositoryService.findInteraction(criteria);

    if (!interaction) {
        throw new Error(
            "No matching interaction rule was found."
        );
    }

    return interaction;
}

export default { process };