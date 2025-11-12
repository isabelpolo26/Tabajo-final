import express from 'express'
import mlService from '../ml/services/mlService.js'
import { cleanData, trainTestSplit, calculateStats } from '../ml/utils/dataPreprocessor.js'

const router = express.Router()

/**
 * Train sales prediction model
 * POST /api/ml/train
 */
router.post('/ml/train', async (req, res) => {
  try {
    const { data, options } = req.body

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid data. Provide an array of sales data.' 
      })
    }

    // Clean and prepare data
    const cleanedData = cleanData(data)
    
    if (cleanedData.length < 3) {
      return res.status(400).json({ 
        error: 'Need at least 3 valid data points for training' 
      })
    }

    // Train model
    const result = await mlService.trainSalesModel(cleanedData, options)

    res.json({
      success: true,
      message: 'Model trained successfully',
      ...result
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Train time series model
 * POST /api/ml/train-timeseries
 */
router.post('/ml/train-timeseries', async (req, res) => {
  try {
    const { data } = req.body

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid data' 
      })
    }

    const cleanedData = cleanData(data)
    const result = await mlService.trainTimeSeriesModel(cleanedData)

    res.json({
      success: true,
      message: 'Time series model trained successfully',
      ...result
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Make a prediction
 * POST /api/ml/predict
 */
router.post('/ml/predict', async (req, res) => {
  try {
    const { input } = req.body

    if (typeof input !== 'number') {
      return res.status(400).json({ 
        error: 'Input must be a number' 
      })
    }

    const result = await mlService.predictSales(input)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Batch predictions
 * POST /api/ml/predict-batch
 */
router.post('/ml/predict-batch', async (req, res) => {
  try {
    const { inputs } = req.body

    if (!Array.isArray(inputs)) {
      return res.status(400).json({ 
        error: 'Inputs must be an array of numbers' 
      })
    }

    const result = await mlService.batchPredict(inputs)

    res.json({
      success: true,
      predictions: result
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Forecast future values
 * POST /api/ml/forecast
 */
router.post('/ml/forecast', async (req, res) => {
  try {
    const { steps = 7, confidence = 0.95 } = req.body

    const result = await mlService.forecastSales(steps, confidence)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Evaluate model
 * POST /api/ml/evaluate
 */
router.post('/ml/evaluate', async (req, res) => {
  try {
    const { data } = req.body

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        error: 'Invalid test data' 
      })
    }

    const cleanedData = cleanData(data)
    const result = await mlService.evaluateModel(cleanedData)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Get model insights
 * GET /api/ml/insights
 */
router.get('/ml/insights', (req, res) => {
  try {
    const insights = mlService.getModelInsights()

    res.json({
      success: true,
      insights
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

/**
 * Get data statistics
 * POST /api/ml/stats
 */
router.post('/ml/stats', (req, res) => {
  try {
    const { data } = req.body

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        error: 'Invalid data' 
      })
    }

    const cleanedData = cleanData(data)
    const stats = calculateStats(cleanedData)

    res.json({
      success: true,
      stats
    })
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    })
  }
})

export default router
