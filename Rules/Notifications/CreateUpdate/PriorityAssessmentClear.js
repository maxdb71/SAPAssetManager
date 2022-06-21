/**
* Clears the Event Priority Matrix assessment form
* @param {IClientAPI} context
*/
export default function PriorityAssessmentClear(context) {
    // Clear EMP Data
    delete context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP;

    // Indicate EMP has been intentionally changed
    context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMPChanged = true;

    // Convenience declaration
    let fdcControl = context.getPageProxy().getControls()[0]._control;

    // Get all of the section contexts in the FDC
    let sectionContexts = fdcControl.sectionsContexts;
    // Skip first and last section when iterating
    for (let i = 1; i < sectionContexts.length - 1; i ++) {
        // Clear first picker (Consequence)
        fdcControl.getCellsForSection(i)[1].setValue('', false);

        // Clear second picker (Likelihood)
        fdcControl.getCellsForSection(i)[2].setValue('', false);
    }

    // Populate Assessment Priority/Consequence/Likelihood/Final Due Date
    fdcControl.getCellsForSection(0)[0].setValue('');
    fdcControl.getCellsForSection(0)[1].setValue('');
    fdcControl.getCellsForSection(0)[2].setValue('');
    fdcControl.getCellsForSection(0)[3].setValue('');
}
