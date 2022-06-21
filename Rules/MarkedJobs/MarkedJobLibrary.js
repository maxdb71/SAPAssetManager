export default class MarkedJobLibrary {

    /**
     * mark a job as favorite
     * @param {*} context pageProxy
     */
    static mark(context) {

        if (this.isMarked(context)) {
            //if marked job is not null, which mean this workorder already marked, thus return false
            return Promise.reject(false);
        }

        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobCreate.action').then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    /**
     * unmark a job as favorite by deleting the associated MarkedJob entity
     * @param {*} context 
     */
    static unmark(context) {
        if (!this.isMarked(context)) {
            //if marked job is null, which mean this workorder already unmarked, thus return false
            return Promise.reject(false);
        }

        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MarkedJobDelete.action').then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    static isMarked(context) {
        if (!context.binding || !context.binding.hasOwnProperty('MarkedJob')) {
            throw 'MarkedJob not expanded';
        }

        return context.binding.MarkedJob != null;
    }

}
