
export default function SyncErrorCloseIsVisible(context) {
    return true;
    if (context.evaluateTargetPathForAPI('#Page:-Previous')._page.id === 'ErrorArchiveAndSync' || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SlideOutMenu) {
        return false;
    }
    return true;
}
