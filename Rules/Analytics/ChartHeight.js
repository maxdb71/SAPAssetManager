export default function ChartHeight(context) {
    if (context.nativescript.platformModule.isAndroid && context.nativescript.platformModule.device.deviceType === 'Phone') {
        return '290';
    } else {
        return '500';
    }
}
