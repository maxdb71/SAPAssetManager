import MarkedJobLibrary from '../../MarkedJobs/MarkedJobLibrary';

export default function Icon(context) {
    try {
        // TODO: get "is marked" api call
        if (MarkedJobLibrary.isMarked(context)) {
            return 'ActionIsMarked';
        }
    } catch (Error) {
        return 'ActionNotMarked';
    }
    // Else, this is item is not marked
    return 'ActionNotMarked';
}
