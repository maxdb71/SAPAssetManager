
const highPrioritySuffix = 'HighPriority';

export default class {

    /**
     * Returns true if priority indicates a high priority item
     * @param {String} priority 
     */
    static isHighPriority(priority) {
        return (priority === '1' || priority === '2');
    }

    /**
     * Returns the icon in 'High Priority' state
     * @param {String} icon 
     */
    static getHighPriorityIcon(icon) {
        return icon + highPrioritySuffix;
    }

    /**
     * Retrieve the appropriate icon based on 
     * @param {*} context 
     * @param {*} icon 
     */
    static getIcon(context, icon) {
        let priority = context.binding.Priority;
        if (this.isHighPriority(priority)) {
            return this.getHighPriorityIcon(icon);
        }
        return icon;
    }

}
