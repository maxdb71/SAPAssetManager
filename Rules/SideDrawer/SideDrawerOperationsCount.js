import count from '../Operations/OperationCount';

export default function SideDrawerOperationsCount(context) {
    return count(context).then(result => {
        return context.localizeText('operations_x', [result]);
    });
}
