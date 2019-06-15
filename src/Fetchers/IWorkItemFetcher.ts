interface IWorkItemFetcher {
    listIterationWorkItems(iteration: string) : Array<WorkItem>;
    getWorkItemById(id: number) : WorkItem;
}