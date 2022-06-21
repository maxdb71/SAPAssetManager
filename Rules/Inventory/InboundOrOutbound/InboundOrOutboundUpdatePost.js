import libCom from '../../Common/Library/CommonLibrary';
import validateData from './ValidateInboundOrOutboundDelivery';
import updateHeaderStatus from './InboundOrOutboundUpdateHeaderStatus';

export default function InboundOrOutboundUpdatePost(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    const DeliveryItemsEntitySet = (type === 'IB' ? 'InboundDeliveryItems' : 'OutboundDeliveryItems');
    const DeliveryItem_Nav = (type === 'IB' ? 'InboundDeliveryItem_Nav' : 'OutboundDeliveryItem_Nav');
    const DeliverySerialsEntitySet = (type === 'IB' ? 'InboundDeliverySerials' : 'OutboundDeliverySerials');

    return validateData(context).then(valid => {
        if (valid) { 
            // Pre-set Delivery Item properties, since Batch is optional
            let props = {
                'Plant': context.binding.Plant,
                'StorageLocation': context.binding.StorageLocation,
                'PickedQuantity': (() => {
                    try {
                        return Number(context.evaluateTargetPath('#Control:QuantitySimple/#Value')) || 0;
                    } catch (exc) {
                        return 0;
                    }
                })(),
                'UOM': context.binding.UOM,
            };

            if (context.binding.MaterialPlant_Nav.BatchIndicator) {
                props.Batch = (() => {
                    try {
                        return context.evaluateTargetPath('#Control:BatchSimple/#Value') || '';
                    } catch (exc) {
                        return '';
                    }
                })();
            }

            try {
                props.StorageBin = context.evaluateTargetPath('#Control:StorageBinSimple/#Value');
            } catch (exc) {
                // Do nothing
            }

            // Update Delivery Item
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                'Target': {
                    'EntitySet': DeliveryItemsEntitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': context.binding['@odata.readLink'],
                },
                'Properties': props,
                'Headers': {
                    'OfflineOData.TransactionID': context.binding.DeliveryNum,
                },
            }}).then(() => {
                // Check if Serial Numbers exists
                let serialNumberObjects; 
                let serialNumberDeletes = [];
                if (context.binding.InboundDeliverySerial_Nav && context.binding.InboundDeliverySerial_Nav.length > 0) {
                    serialNumberObjects = context.binding.InboundDeliverySerial_Nav;
                } else if (context.binding.OutboundDeliverySerial_Nav && context.binding.OutboundDeliverySerial_Nav.length > 0) {
                    serialNumberObjects = context.binding.OutboundDeliverySerial_Nav;
                }

                if (serialNumberObjects && serialNumberObjects.length > 0) {
                    // Create Serial Number records
                    for (let a = 0; a < serialNumberObjects.length; a ++) {
                        serialNumberDeletes.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundOutbound/InboundOutboundDeliverySerialDelete.action', 'Properties': {
                            'Target': {
                                'EntitySet': DeliverySerialsEntitySet,
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink':  serialNumberObjects[a]['@odata.readLink'],
                            },
                            'Properties': {
                                'SerialNumber': serialNumberObjects[a].SerialNumber,
                            },
                            'DeleteLinks': [{
                                'Property': DeliveryItem_Nav,
                                'Target':
                                {
                                    'EntitySet': DeliveryItemsEntitySet,
                                    'ReadLink': context.binding['@odata.readLink'],
                                },
                            }],
                        }}));
                    }

                    return Promise.all(serialNumberDeletes);
                } else {
                    return Promise.resolve();
                }
            }).then(() => {
                // Check if Serial Numbers are required
                if (context.binding.MaterialPlant_Nav.SerialNumberProfile) {
                    let serialNumberCreates = [];

                    // Get all serial numbers as an array
                    let serialNumbers = (() => {
                        try {
                            return context.evaluateTargetPath('#Control:SerialNumListText/#Value').split(',');
                        } catch (exc) {
                            return [];
                        }
                    })();

                    // Create Serial Number records
                    for (let i = 0; i < serialNumbers.length; i ++) {
                        serialNumberCreates.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundOutbound/InboundOutboundDeliverySerialCreate.action', 'Properties': {
                            'Target': {
                                'EntitySet': DeliverySerialsEntitySet,
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                            },
                            'Properties': {
                                'SerialNumber': serialNumbers[i],
                            },
                            'Headers': {
                                'OfflineOData.TransactionID': context.binding.DeliveryNum,
                            },
                            'CreateLinks': [{
                                'Property': DeliveryItem_Nav,
                                'Target':
                                {
                                    'EntitySet': DeliveryItemsEntitySet,
                                    'ReadLink': context.binding['@odata.readLink'],
                                },
                            }],
                        }}));
                    }
                    return Promise.all(serialNumberCreates);
                } else {
                    return Promise.resolve();
                }            
            }).then (() => {
                return updateHeaderStatus(context, context.binding.DeliveryNum);
            }).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action').catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
                });
            });
        }
        return false;
    });
}
