/**
 * Sales Prediction Model using Linear Regression
 * Simple ML implementation for sales forecasting
 */

class SalesPredictor {
  constructor() {
    this.weights = null
    this.bias = 0
    this.trained = false
    this.scaleParams = { mean: 0, std: 1 }
  }

  /**
   * Normalize features using z-score normalization
   */
  normalize(data) {
    const values = data.map(d => d.x)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const std = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    )
    
    this.scaleParams = { mean, std: std || 1 }
    
    return data.map(d => ({
      x: (d.x - mean) / this.scaleParams.std,
      y: d.y
    }))
  }

  /**
   * Train the model using gradient descent
   */
  train(data, options = {}) {
    const {
      learningRate = 0.01,
      epochs = 1000,
      verbose = false
    } = options

    if (!data || data.length === 0) {
      throw new Error('Training data cannot be empty')
    }

    // Normalize data
    const normalizedData = this.normalize(data)
    
    // Initialize weights
    let weight = Math.random()
    let bias = Math.random()
    
    const n = normalizedData.length
    
    // Gradient descent
    for (let epoch = 0; epoch < epochs; epoch++) {
      let weightGradient = 0
      let biasGradient = 0
      let totalLoss = 0
      
      // Calculate gradients
      for (const point of normalizedData) {
        const prediction = weight * point.x + bias
        const error = prediction - point.y
        
        weightGradient += (2 / n) * error * point.x
        biasGradient += (2 / n) * error
        totalLoss += error * error
      }
      
      // Update parameters
      weight -= learningRate * weightGradient
      bias -= learningRate * biasGradient
      
      if (verbose && epoch % 100 === 0) {
        console.log(`Epoch ${epoch}: Loss = ${totalLoss / n}`)
      }
    }
    
    this.weights = weight
    this.bias = bias
    this.trained = true
    
    return {
      weight: this.weights,
      bias: this.bias,
      trained: true
    }
  }

  /**
   * Make predictions
   */
  predict(x) {
    if (!this.trained) {
      throw new Error('Model must be trained before making predictions')
    }
    
    const normalizedX = (x - this.scaleParams.mean) / this.scaleParams.std
    return this.weights * normalizedX + this.bias
  }

  /**
   * Predict multiple values
   */
  predictBatch(xValues) {
    return xValues.map(x => this.predict(x))
  }

  /**
   * Calculate model accuracy metrics
   */
  evaluate(testData) {
    if (!this.trained) {
      throw new Error('Model must be trained before evaluation')
    }

    let totalError = 0
    let totalSquaredError = 0
    const predictions = []

    for (const point of testData) {
      const pred = this.predict(point.x)
      const error = Math.abs(pred - point.y)
      
      totalError += error
      totalSquaredError += error * error
      predictions.push({ actual: point.y, predicted: pred, error })
    }

    const mae = totalError / testData.length
    const rmse = Math.sqrt(totalSquaredError / testData.length)

    return {
      mae,
      rmse,
      predictions
    }
  }

  /**
   * Export model parameters
   */
  export() {
    return {
      weights: this.weights,
      bias: this.bias,
      scaleParams: this.scaleParams,
      trained: this.trained
    }
  }

  /**
   * Import model parameters
   */
  import(modelData) {
    this.weights = modelData.weights
    this.bias = modelData.bias
    this.scaleParams = modelData.scaleParams
    this.trained = modelData.trained
  }
}

export default SalesPredictor
