export default function NotificationTasksListViewQueryOption() {
    return '$expand=Notification/NotifMobileStatus_Nav,TaskMobileStatus_Nav&$orderby=TaskSortNumber asc';
}
