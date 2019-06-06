abstract class WorkItem {
    readonly id: number;
    readonly workItemType: string;
    readonly parentWorkItem: number;
    title: string;
    state: string;
    readonly htmlLink: string;
    assignedTo: string;
    tags: Array<string>;
}