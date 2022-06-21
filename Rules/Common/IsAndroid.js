export default function IsAndroid(context) {
    if (context.nativescript.platformModule.isAndroid) {
        return true;
    } else {
        return false;
    }
}
