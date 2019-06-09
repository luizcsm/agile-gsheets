abstract class WorkItem {
    id: number;
    workItemType: WorkItemType;
    parentWorkItem: number;
    title: string;
    state: WorkItemState;
    htmlLink: string;
    assignedTo: string;
    tags: Array<string>;
    version: number;
}