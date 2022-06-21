import ConfirmationDateFromOData from '../ConfirmationDateFromOData';

export default function ConfirmationsDateDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, true);
    return context.formatDate(offsetOdataDate.date());
}
