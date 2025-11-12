/**
 * Sales Prediction Model using Multiple Linear Regression
 * Enhanced ML implementation for sales forecasting with multiple features
 */

class SalesPredictor {
  constructor() {
    this.weights = null
    this.bias = 0
    this.trained = false
    this.scaleParams = []
    this.featureNames = []
    this.history = { losses: [], epochs: [] }
  }

  /**
   * Extract features from data point
   */
  extractFeatures(dataPoint, index, allData) {
    const features = []
    
    // Basic features
    features.push(index) // Time index
    features.push(dataPoint.amount || dataPoint.sales || dataPoint.value || 0)
    
    // Additional features if available
    if (dataPoint.dayOfWeek !== undefined) features.push(dataPoint.dayOfWeek)
    if (dataPoint.month !== undefined) features.push(dataPoint.month)
    if (dataPoint.isWeekend !== undefined) features.push(dataPoint.isWeekend ? 1 : 0)
    if (dataPoint.isHoliday !== undefined) features.push(dataPoint.isHoliday ? 1 : 0)
    if (dataPoint.promotions !== undefined) features.push(dataPoint.promotions)
    if (dataPoint.temperature !== undefined) features.push(dataPoint.temperature)
    if (dataPoint.customerCount !== undefined) features.push(dataPoint.customerCount)
    
    // Lag features (previous values)
    if (index > 0 && allData[index - 1]) {
      const prevValue = allData[index - 1].amount || allData[index - 1].sales || allData[index - 1].value || 0
      features.push(prevValue)
    } else {
      features.push(0)
    }
    
    // Moving average (last 3 periods)
    if (index >= 2) {
      const last3 = allData.slice(Math.max(0, index - 3), index)
        .map(d => d.amount || d.sales || d.value || 0)
      const avg = last3.reduce((a, b) => a + b, 0) / last3.length
      features.push(avg)
    } else {
      features.push(features[1] || 0)
    }
    
    return features
  }

  /**
   * Normalize features using z-score normalization
   */
  normalize(data) {
    const numFeatures = data[0].x.length
    this.scaleParams = []
    
    // Calculate mean and std for each feature
    for (let f = 0; f < numFeatures; f++) {
      const values = data.map(d => d.x[f])
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      const std = Math.sqrt(variance) || 1
      
      this.scaleParams.push({ mean, std })
    }
    
    // Normalize all features
    return data.map(d => ({
      x: d.x.map((val, f) => (val - this.scaleParams[f].mean) / this.scaleParams[f].std),
      y: d.y
    }))
  }

  /**
   * Train the model using gradient descent with multiple features
   */
  train(data, options = {}) {
    const {
      learningRate = 0.01,
      epochs = 2000,
      verbose = false,
      earlyStoppingPatience = 50,
      minDelta = 0.0001
    } = options

    if (!data || data.length === 0) {
      throw new Error('Training data cannot be empty')
    }

    // Transform data to include multiple features
    const transformedData = data.map((item, index) => {
      const features = this.extractFeatures(item, index, data)
      return {
        x: features,
        y: item.amount || item.sales || item.value || 0
      }
    })

    // Normalize data
    const normalizedData = this.normalize(transformedData)
    
    const numFeatures = normalizedData[0].x.length
    
    // Initialize weights for each feature
    this.weights = Array(numFeatures).fill(0).map(() => Math.random() * 0.01)
    this.bias = Math.random() * 0.01
    
    const n = normalizedData.length
    this.history = { losses: [], epochs: [] }
    
    let bestLoss = Infinity
    let patienceCounter = 0
    
    // Gradient descent with early stopping
    for (let epoch = 0; epoch < epochs; epoch++) {
      const weightGradients = Array(numFeatures).fill(0)
      let biasGradient = 0
      let totalLoss = 0
      
      // Calculate gradients
      for (const point of normalizedData) {
        // Forward pass
        let prediction = this.bias
        for (let f = 0; f < numFeatures; f++) {
          prediction += this.weights[f] * point.x[f]
        }
        
        const error = prediction - point.y
        
        // Backward pass
        for (let f = 0; f < numFeatures; f++) {
          weightGradients[f] += (2 / n) * error * point.x[f]
        }
        biasGradient += (2 / n) * error
        totalLoss += error * error
      }
      
      const avgLoss = totalLoss / n
      
      // Update parameters
      for (let f = 0; f < numFeatures; f++) {
        this.weights[f] -= learningRate * weightGradients[f]
      }
      this.bias -= learningRate * biasGradient
      
      // Track history
      if (epoch % 10 === 0) {
        this.history.losses.push(avgLoss)
        this.history.epochs.push(epoch)
      }
      
      // Early stopping
      if (avgLoss < bestLoss - minDelta) {
        bestLoss = avgLoss
        patienceCounter = 0
      } else {
        patienceCounter++
      }
      
      if (patienceCounter >= earlyStoppingPatience) {
        if (verbose) {
          console.log(`Early stopping at epoch ${epoch}`)
        }
        break
      }
      
      if (verbose && epoch % 100 === 0) {
        console.log(`Epoch ${epoch}: Loss = ${avgLoss.toFixed(6)}`)
      }
    }
    
    this.trained = true
    
    return {
      weights: this.weights,
      bias: this.bias,
      numFeatures,
      finalLoss: this.history.losses[this.history.losses.length - 1],
      trained: true
    }
  }

  /**
   * Make predictions with multiple features
   */
  predict(input) {
    if (!this.trained) {
      throw new Error('Model must be trained before making predictions')
    }
    
    // Handle both single value and feature array
    let features
    if (typeof input === 'number') {
      // Simple input - create basic features
      features = [input, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    } else if (Array.isArray(input)) {
      features = input
    } else {
      // Object with properties
      features = this.extractFeatures(input, 0, [input])
    }
    
    // Normalize features
    const normalizedFeatures = features.map((val, f) => {
      if (f < this.scaleParams.length) {
        return (val - this.scaleParams[f].mean) / this.scaleParams[f].std
      }
      return val
    })
    
    // Calculate prediction
    let prediction = this.bias
    for (let f = 0; f < Math.min(this.weights.length, normalizedFeatures.length); f++) {
      prediction += this.weights[f] * normalizedFeatures[f]
    }
    
    return prediction
  }

  /**
   * Predict multiple values
   */
  predictBatch(inputs) {
    return inputs.map(input => this.predict(input))
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
    let totalActual = 0
    let totalPercentError = 0
    const predictions = []

    for (let i = 0; i < testData.length; i++) {
      const point = testData[i]
      const actual = point.y || point.amount || point.sales || point.value
      const pred = this.predict(point.x || point)
      const error = Math.abs(pred - actual)
      const percentError = actual !== 0 ? (error / Math.abs(actual)) * 100 : 0
      
      totalError += error
      totalSquaredError += error * error
      totalActual += actual
      totalPercentError += percentError
      
      predictions.push({ 
        actual, 
        predicted: pred, 
        error,
        percentError: percentError.toFixed(2) + '%'
      })
    }

    const n = testData.length
    const mae = totalError / n
    const rmse = Math.sqrt(totalSquaredError / n)
    const mape = totalPercentError / n
    
    // Calculate R² score
    const meanActual = totalActual / n
    let ssTotal = 0
    let ssResidual = 0
    
    for (let i = 0; i < n; i++) {
      const actual = testData[i].y || testData[i].amount || testData[i].sales || testData[i].value
      const pred = predictions[i].predicted
      ssTotal += Math.pow(actual - meanActual, 2)
      ssResidual += Math.pow(actual - pred, 2)
    }
    
    const r2 = 1 - (ssResidual / (ssTotal || 1))

    return {
      mae: mae.toFixed(2),
      rmse: rmse.toFixed(2),
      mape: mape.toFixed(2) + '%',
      r2: r2.toFixed(4),
      predictions: predictions.slice(0, 10)
    }
  }

  /**
   * Get training history
   */
  getHistory() {
    return this.history
  }

  /**
   * Get feature importance
   */
  getFeatureImportance() {
    if (!this.trained) {
      return null
    }
    
    const featureNames = [
      'Time Index',
      'Base Value',
      'Day of Week',
      'Month',
      'Is Weekend',
      'Is Holiday',
      'Promotions',
      'Temperature',
      'Customer Count',
      'Previous Value',
      'Moving Average'
    ]
    
    return this.weights.map((weight, i) => ({
      feature: featureNames[i] || `Feature ${i}`,
      weight: weight.toFixed(4),
      importance: Math.abs(weight).toFixed(4)
    })).sort((a, b) => parseFloat(b.importance) - parseFloat(a.importance))
  }

  /**
   * Export model parameters
   */
  export() {
    return {
      weights: this.weights,
      bias: this.bias,
      scaleParams: this.scaleParams,
      trained: this.trained,
      history: this.history
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
    this.history = modelData.history || { losses: [], epochs: [] }
  }
}

export default SalesPredictor
