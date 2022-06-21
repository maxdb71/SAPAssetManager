import receipt from './SetSTOGoodsReceipt';
import issue from './SetSTOIssue';
import allowIssue from './AllowIssueForSTO';

export default function SetSTOTransactionWrapper(context) {
    if (allowIssue(context)) {
        return issue(context); //Supplying plant matches user's default plant, so do an issue
    }
    return receipt(context);
}
