import libCommon from '../Library/CommonLibrary';
import AssignmentType from '../../Common/Library/AssignmentType';

/**
 * After changeset success, reset the state variables
 */
export default function ChangeSetOnFailure(pageProxy) {
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnWOChangesetFlag(pageProxy, false);
    AssignmentType.removeWorkOrderDefaultOverride();
}
