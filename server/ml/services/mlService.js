import SalesPredictor from '../models/salesPredictor.js'
import TimeSeriesPredictor from '../models/timeSeriesPredictor.js'
import { saveModel, loadModel } from '../utils/modelStorage.js'

class MLService {
  constructor() {
    this.salesModel = new SalesPredictor()
    this.timeSeriesModel = new TimeSeriesPredictor()
    this.modelCache = new Map()
  }

  /**
   * Train sales prediction model
   */
  async trainSalesModel(SalesData, options = {}) {
    try {
      // Transform data to required format
      const trainingData = salesData.map((item, index) => ({
        x: index,
        y: item.amount || item.sales || item.value
      }))

      const result = this.salesModel.train(trainingData, options)
      
      // Save model
      if (options.save) {
        await saveModel('sales_predictor', this.salesModel.export())
      }

      return {
        success: true,
        model: result,
        dataPoints: trainingData.length
      }
    } catch (error) {
      throw new Error(`Training failed: ${error.message}`)
    }
  }

  /**
   * Train time series model
   */
  async trainTimeSeriesModel(timeSeriesData) {
    try {
      const values = timeSeriesData.map(item => 
        item.amount || item.sales || item.value
      )

      const result = this.timeSeriesModel.train(values)
      
      return {
        success: true,
        trend: result.trend,
        dataPoints: result.dataPoints
      }
    } catch (error) {
      throw new Error(`Time series training failed: ${error.message}`)
    }
  }

  /**
   * Make sales predictions
   */
  async predictSales(input) {
    try {
      if (!this.salesModel.trained) {
        throw new Error('Model not trained. Train the model first.')
      }

      const prediction = this.salesModel.predict(input)
      
      return {
        input,
        prediction: Math.max(0, prediction),
        model: 'sales_predictor'
      }
    } catch (error) {
      throw new Error(`Prediction failed: ${error.message}`)
    }
  }

  /**
   * Forecast future values
   */
  async forecastSales(steps = 7, confidence = 0.95) {
    try {
      if (!this.timeSeriesModel.trend) {
        throw new Error('Time series model not trained')
      }

      const forecast = this.timeSeriesModel.forecast(steps, confidence)
      
      return {
        steps,
        forecast,
        confidence
      }
    } catch (error) {
      throw new Error(`Forecast failed: ${error.message}`)
    }
  }

  /**
   * Evaluate model performance
   */
  async evaluateModel(testData) {
    try {
      const formattedData = testData.map((item, index) => ({
        x: index,
        y: item.amount || item.sales || item.value
      }))

      const evaluation = this.salesModel.evaluate(formattedData)
      
      return {
        metrics: {
          mae: evaluation.mae,
          rmse: evaluation.rmse
        },
        predictions: evaluation.predictions.slice(0, 10) // Return first 10
      }
    } catch (error) {
      throw new Error(`Evaluation failed: ${error.message}`)
    }
  }

  /**
   * Get model insights
   */
  getModelInsights() {
    const insights = {
      salesModel: {
        trained: this.salesModel.trained,
        parameters: this.salesModel.trained ? {
          weight: this.salesModel.weights,
          bias: this.salesModel.bias
        } : null
      },
      timeSeriesModel: {
        trained: !!this.timeSeriesModel.trend,
        trend: this.timeSeriesModel.trend
      }
    }

    return insights
  }

  /**
   * Load saved model
   */
  async loadSavedModel(modelName) {
    try {
      const modelData = await loadModel(modelName)
      
      if (modelName === 'sales_predictor') {
        this.salesModel.import(modelData)
      }
      
      return { success: true, model: modelName }
    } catch (error) {
      throw new Error(`Failed to load model: ${error.message}`)
    }
  }

  /**
   * Batch predictions
   */
  async batchPredict(inputs) {
    try {
      if (!this.salesModel.trained) {
        throw new Error('Model not trained')
      }

      const predictions = this.salesModel.predictBatch(inputs)
      
      return inputs.map((input, i) => ({
        input,
        prediction: Math.max(0, predictions[i])
      }))
    } catch (error) {
      throw new Error(`Batch prediction failed: ${error.message}`)
    }
  }
}

// Singleton instance
const mlService = new MLService()

export default mlService
