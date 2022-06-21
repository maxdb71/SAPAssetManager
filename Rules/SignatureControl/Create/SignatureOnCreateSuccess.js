/**
* Do some housekeeping before actually creating the links
* @param {IClientAPI} context
*/
import signatureCreateBDKLink from '../Save/SignatureCreateBDSLink';
import SignatureRunConfirmationLAM from '../Create/SignatureRunConfirmationLAM';

export default function SignatureOnCreateSuccess(context) {
    context.getPageProxy().getClientData().isWOSigned = true;
    return signatureCreateBDKLink(context).then(() => {
        return SignatureRunConfirmationLAM(context);
    });
}
