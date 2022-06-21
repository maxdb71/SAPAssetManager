import notification from '../../NotificationLibrary';

export default function NotificationActivityDetailsGroup(context) {
    try	{
        var codeGroup = context.binding.ActivityCodeGroup;
        return notification.NotificationCodeGroupStr(context, 'CatTypeActivities', codeGroup);
    } catch (exception)	{
        return context.localizeText('unknown');
    }
}
