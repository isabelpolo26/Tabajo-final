  /**
 * Time Series Prediction Model
 * Uses moving averages and trend analysis
 */

class TimeSeriesPredictor {
  constructor() {
    this.data = []
    this.trend = null
    this.seasonality = null
  }

  /**
   * Calculate moving average
   */
  movingAverage(data, window = 3) {
    const result = []
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        result.push(null)
      } else {
        const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0)
        result.push(sum / window)
      }
    }
    return result
  }

  /**
   * Calculate exponential moving average
   */
  exponentialMovingAverage(data, alpha = 0.3) {
    const result = [data[0]]
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1])
    }
    return result
  }

  /**
   * Detect trend using linear regression
   */
  detectTrend(data) {
    const n = data.length
    const x = Array.from({ length: n }, (_, i) => i)
    
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = data.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    return { slope, intercept }
  }

  /**
   * Train the model
   */
  train(data) {
    if (!data || data.length < 3) {
      throw new Error('Need at least 3 data points for training')
    }

    this.data = data
    this.trend = this.detectTrend(data)
    
    return {
      trend: this.trend,
      dataPoints: data.length
    }
  }

  /**
   * Predict future values
   */
  predict(steps = 1) {
    if (!this.trend) {
      throw new Error('Model must be trained before making predictions')
    }

    const lastIndex = this.data.length - 1
    const predictions = []
    
    for (let i = 1; i <= steps; i++) {
      const x = lastIndex + i
      const value = this.trend.slope * x + this.trend.intercept
      predictions.push(Math.max(0, value)) // Ensure non-negative predictions
    }
    
    return predictions
  }

  /**
   * Get forecast with confidence intervals
   */
  forecast(steps = 1, confidence = 0.95) {
    const predictions = this.predict(steps)
    
    // Calculate standard deviation of residuals
    const fitted = this.data.map((_, i) => 
      this.trend.slope * i + this.trend.intercept
    )
    const residuals = this.data.map((val, i) => val - fitted[i])
    const stdDev = Math.sqrt(
      residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length
    )
    
    // Z-score for confidence interval
    const zScore = confidence === 0.95 ? 1.96 : 2.576
    const margin = zScore * stdDev
    
    return predictions.map(pred => ({
      prediction: pred,
      lower: Math.max(0, pred - margin),
      upper: pred + margin
    }))
  }

  /**
   * Analyze seasonality patterns
   */
  analyzeSeasonality(period = 7) {
    if (this.data.length < period * 2) {
      return null
    }

    const detrended = this.data.map((val, i) => 
      val - (this.trend.slope * i + this.trend.intercept)
    )

    const seasonalPattern = []
    for (let i = 0; i < period; i++) {
      const values = []
      for (let j = i; j < detrended.length; j += period) {
        values.push(detrended[j])
      }
      seasonalPattern.push(
        values.reduce((a, b) => a + b, 0) / values.length
      )
    }

    this.seasonality = seasonalPattern
    return seasonalPattern
  }
}

export default TimeSeriesPredictor
