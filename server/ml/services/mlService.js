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
   * Train sales prediction model with enhanced features
   */
  async trainSalesModel(salesData, options = {}) {
    try {
      if (!salesData || salesData.length < 3) {
        throw new Error('Need at least 3 data points for training')
      }

      // Enrich data with additional features if not present
      const enrichedData = salesData.map((item, index) => {
        const date = item.date ? new Date(item.date) : new Date()
        
        return {
          ...item,
          dayOfWeek: item.dayOfWeek !== undefined ? item.dayOfWeek : date.getDay(),
          month: item.month !== undefined ? item.month : date.getMonth() + 1,
          isWeekend: item.isWeekend !== undefined ? item.isWeekend : (date.getDay() === 0 || date.getDay() === 6),
          isHoliday: item.isHoliday || false,
          promotions: item.promotions || 0,
          temperature: item.temperature || 20,
          customerCount: item.customerCount || 0
        }
      })

      const result = this.salesModel.train(enrichedData, {
        learningRate: options.learningRate || 0.01,
        epochs: options.epochs || 2000,
        verbose: options.verbose || false,
        earlyStoppingPatience: options.earlyStoppingPatience || 50
      })
      
      // Save model
      if (options.save) {
        await saveModel('sales_predictor', this.salesModel.export())
      }

      return {
        success: true,
        model: result,
        dataPoints: enrichedData.length,
        featureImportance: this.salesModel.getFeatureImportance(),
        history: this.salesModel.getHistory()
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
   * Evaluate model performance with comprehensive metrics
   */
  async evaluateModel(testData) {
    try {
      // Enrich test data with features
      const enrichedData = testData.map((item, index) => {
        const date = item.date ? new Date(item.date) : new Date()
        
        return {
          ...item,
          dayOfWeek: item.dayOfWeek !== undefined ? item.dayOfWeek : date.getDay(),
          month: item.month !== undefined ? item.month : date.getMonth() + 1,
          isWeekend: item.isWeekend !== undefined ? item.isWeekend : (date.getDay() === 0 || date.getDay() === 6),
          isHoliday: item.isHoliday || false,
          promotions: item.promotions || 0,
          temperature: item.temperature || 20,
          customerCount: item.customerCount || 0
        }
      })

      const evaluation = this.salesModel.evaluate(enrichedData)
      
      return {
        metrics: {
          mae: evaluation.mae,
          rmse: evaluation.rmse,
          mape: evaluation.mape,
          r2: evaluation.r2
        },
        predictions: evaluation.predictions,
        featureImportance: this.salesModel.getFeatureImportance()
      }
    } catch (error) {
      throw new Error(`Evaluation failed: ${error.message}`)
    }
  }

  /**
   * Get model insights with feature importance
   */
  getModelInsights() {
    const insights = {
      salesModel: {
        trained: this.salesModel.trained,
        parameters: this.salesModel.trained ? {
          weights: this.salesModel.weights,
          bias: this.salesModel.bias,
          numFeatures: this.salesModel.weights ? this.salesModel.weights.length : 0
        } : null,
        featureImportance: this.salesModel.trained ? this.salesModel.getFeatureImportance() : null,
        trainingHistory: this.salesModel.trained ? this.salesModel.getHistory() : null
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
