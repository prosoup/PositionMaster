test('trainModel should train the model with given data', async () => {
    const strategyHub = new StrategyHub('path/to/model');
    await strategyHub.trainModel([[1, 2], [3, 4]], [5, 6]);
    expect(strategyHub.model).toBeDefined();
});
