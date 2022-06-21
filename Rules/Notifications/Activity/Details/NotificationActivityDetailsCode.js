import notification from '../../NotificationLibrary';

export default function NotificationTaskDetailsCode(context) {
    try	{
        var code = context.binding.ActivityCode;
        var codeGroup = context.binding.ActivityCodeGroup;
        return notification.NotificationCodeStr(context, 'CatTypeActivities', codeGroup, code);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
