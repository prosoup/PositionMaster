import * as tf from '@tensorflow/tfjs-node';

export class PositionOptimizer {
    model: tf.LayersModel;

    // Constructor: Load pre-trained model
    constructor(modelPath: string) {
        this.model = await tf.loadLayersModel(modelPath); // Load pre-trained model asynchronously
    }

    // Train the model using provided dataset (data and labels)
    async trainModel(trainingData: number[], trainingLabels: number[], epochs: number = 50, batchSize: number = 32): Promise<void> {
        const inputTensor = tf.tensor2d(trainingData);
        const labelTensor = tf.tensor2d(trainingLabels, [trainingLabels.length, 1]);

        this.model.compile({
            optimizer: 'adam',
            loss: 'meanSquaredError',
            metrics: ['accuracy'],
        });

        await this.model.fit(inputTensor, labelTensor, {
            epochs,
            batchSize,
        });
        console.log('Model training complete');
    }

    // Predict the optimized position based on input data
    async optimizePosition(data: number[]): Promise<number> {
        const inputTensor = tf.tensor2d([data]);
        const prediction = this.model.predict(inputTensor) as tf.Tensor;
        const optimizedLiquidity = prediction.dataSync()[0];
        return optimizedLiquidity;
    }

    // Evaluate the model's performance using test data
    async evaluateModel(testData: number[], testLabels: number[]): Promise<any> {
        const inputTensor = tf.tensor2d(testData);
        const labelTensor = tf.tensor2d(testLabels, [testLabels.length, 1]);

        const evaluation = await this.model.evaluate(inputTensor, labelTensor);
        console.log('Model evaluation metrics:', evaluation);
        return evaluation;
    }

    // Save the trained model to a specific path
    async saveModel(savePath: string): Promise<void> {
        await this.model.save(`file://${savePath}`);
        console.log('Model saved at', savePath);
    }

    // Load a new pre-trained model from a given path
    async loadModel(modelPath: string): Promise<void> {
        this.model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Model loaded from', modelPath);
    }

    // Add an additional layer for more complex features if needed
    addLayer(layerConfig: tf.layers.Layer): void {
        const newModel = tf.sequential();
        newModel.add(this.model);
        newModel.add(layerConfig); // Adding new layer
        this.model = newModel;
        console.log('Layer added to the model');
    }
}

// Usage example:
const positionOptimizer = new PositionOptimizer('path/to/model');

// Training the model
const trainingData = [[100, 200], [150, 250], [200, 300]]; // Example training data
const trainingLabels = [500, 600, 700]; // Example target values
positionOptimizer.trainModel(trainingData, trainingLabels);

// Making predictions
const data = [120, 220]; // Example input data
positionOptimizer.optimizePosition(data).then(optimizedLiquidity => {
    console.log('Optimized Liquidity:', optimizedLiquidity);
});

// Saving the model
positionOptimizer.saveModel('path/to/save/model');
