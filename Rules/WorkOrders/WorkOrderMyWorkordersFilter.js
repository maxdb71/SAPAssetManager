import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrderMyWorkordersFilter(context) {
    return { name: 'OrderMobileStatus_Nav/CreateUserGUID', values: [{ReturnValue: libCom.getUserGuid(context), DisplayValue: context.localizeText('my_workorders')}]};
}
