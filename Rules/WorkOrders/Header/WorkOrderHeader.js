import libForm from '../../Common/Library/FormatLibrary';

export default function WorkOrderHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.OrderId,
        context.localizeText('workorder'));
}
