export default function WorkOrdersCount(sectionProxy) {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', '').then((count) => {
        return count;
    });
}
