function test() : Array<WorkItem> {
    let config : AzureDevOpsConfig = new AzureDevOpsConfig();
    config.acessToken = "pna4uv4wzkfwmryjniloqmrsxeswwrlnnte3nftfhqwv7k7atprq";
    config.organization = "localiza";
    config.project = "Localiza";
    config.team = "Aluguel de Carros - GC Squad Verde";
    config.login = "luiz.miranda@dtidigital.com.br";

    return new AzureDevOpsWorkItemFetcher(config).listIterationWorkItems("78ea3e58-b0ae-4754-9c0c-0b22d46751d4");
}