export default function NotificationItemTasksListViewQueryOption() {
    return '$expand=ItemTaskMobileStatus_Nav,Item/Notification/NotifMobileStatus_Nav&$orderby=TaskSortNumber asc';
}
