async function processExecution(message) {
    const execution = await prisma.execution.findUnique({
        where: { id: executionId },
    });
    if (!execution) {
        console.log("Execution not found");
        return;
    }
    const workflow = await prisma.workflow.findUnique({
        where: { id: execution.workflowId },
    });
}
export {};
//# sourceMappingURL=index.js.map