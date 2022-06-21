import toolbarCaption from './MobileStatus/OperationMobileStatusToolBarCaption';

export default function WorkOrderOperationDetailsOnReturning(context) {
    return toolbarCaption(context).then(caption => {
        context.setToolbarItemCaption('IssuePartTbI', caption);
    });
}
