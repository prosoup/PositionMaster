import * as tf from '@tensorflow/tfjs-node';

interface Strategy {
    name: string;
    description: string;
    data: number[];
    performance: number;
    evaluate: (data: number[]) => Promise<number>;
}

export class StrategyHub {
    strategies: Map<string, Strategy> = new Map();
    model: tf.LayersModel;

    constructor(modelPath: string) {
        this.model = await tf.loadLayersModel(modelPath); // Load pre-trained model
    }

    // Add a new strategy to the hub
    addStrategy(name: string, description: string, data: number[]): void {
        const strategy: Strategy = {
            name,
            description,
            data,
            performance: 0,
            evaluate: this.evaluateStrategy
        };
        this.strategies.set(name, strategy);
        console.log(`Strategy '${name}' added to the hub.`);
    }

    // Evaluate a strategy's performance using the AI model
    async evaluateStrategy(data: number[]): Promise<number> {
        const inputTensor = tf.tensor2d([data]);
        const prediction = this.model.predict(inputTensor) as tf.Tensor;
        const strategyPerformance = prediction.dataSync()[0];
        return strategyPerformance;
    }

    // Evaluate and update performance for all strategies
    async evaluateAllStrategies(): Promise<void> {
        for (let [name, strategy] of this.strategies) {
            const performance = await strategy.evaluate(strategy.data);
            strategy.performance = performance;
            console.log(`Strategy '${name}' performance: ${performance}`);
        }
    }

    // Get the best performing strategy
    getBestStrategy(): Strategy | null {
        let bestStrategy: Strategy | null = null;
        let bestPerformance = -Infinity;

        this.strategies.forEach((strategy) => {
            if (strategy.performance > bestPerformance) {
                bestPerformance = strategy.performance;
                bestStrategy = strategy;
            }
        });

        return bestStrategy;
    }

    // Save all strategies to a JSON file
    async saveStrategies(savePath: string): Promise<void> {
        const strategiesData = Array.from(this.strategies.values()).map(strategy => ({
            name: strategy.name,
            description: strategy.description,
            data: strategy.data,
            performance: strategy.performance
        }));

        const fs = require('fs');
        fs.writeFileSync(savePath, JSON.stringify(strategiesData, null, 2));
        console.log('Strategies saved to', savePath);
    }

    // Load strategies from a JSON file
    async loadStrategies(loadPath: string): Promise<void> {
        const fs = require('fs');
        const strategiesData = JSON.parse(fs.readFileSync(loadPath, 'utf8'));

        strategiesData.forEach((strategyData: any) => {
            const { name, description, data } = strategyData;
            this.addStrategy(name, description, data);
        });

        console.log('Strategies loaded from', loadPath);
    }

    // Create a custom strategy using a modular approach
    createCustomStrategy(name: string, description: string, strategyBlocks: Function[]): void {
        let strategyData: number[] = [];
        
        strategyBlocks.forEach(block => {
            strategyData.push(block());
        });

        this.addStrategy(name, description, strategyData);
        console.log(`Custom strategy '${name}' created.`);
    }
}

// Usage example:
const strategyHub = new StrategyHub('path/to/model');

// Adding a predefined strategy
strategyHub.addStrategy('Liquidity Boost', 'This strategy aims to maximize liquidity depth for higher yield.', [100, 200, 300]);

// Evaluating all strategies
strategyHub.evaluateAllStrategies();

// Fetching the best strategy
const bestStrategy = strategyHub.getBestStrategy();
console.log('Best strategy:', bestStrategy);

// Saving strategies
strategyHub.saveStrategies('path/to/save/strategies.json');

// Creating a custom strategy
strategyHub.createCustomStrategy('Dynamic Rebalance', 'This strategy adjusts liquidity positions dynamically based on market conditions.', [
    () => Math.random() * 100,  // Example strategy block (random value for illustration)
    () => Math.random() * 100   // Example strategy block (random value for illustration)
]);

