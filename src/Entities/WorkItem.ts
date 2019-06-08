abstract class WorkItem {
    id: number;
    workItemType: string;
    parentWorkItem: number;
    title: string;
    state: string;
    htmlLink: string;
    assignedTo: string;
    tags: Array<string>;
    version: number;
}