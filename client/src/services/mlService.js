/**
 * ML Service - Cliente para interactuar con la API de Machine Learning
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class MLServiceClient {
  /**
   * Entrenar modelo de predicción de ventas
   */
  async trainModel(data, options = {}) {
    const response = await fetch(`${API_URL}/ml/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, options })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Training failed')
    }
    
    return response.json()
  }

  /**
   * Entrenar modelo de serie temporal
   */
  async trainTimeSeries(data) {
    const response = await fetch(`${API_URL}/ml/train-timeseries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Training failed')
    }
    
    return response.json()
  }

  /**
   * Hacer una predicción
   */
  async predict(input) {
    const response = await fetch(`${API_URL}/ml/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Prediction failed')
    }
    
    return response.json()
  }

  /**
   * Predicciones por lote
   */
  async predictBatch(inputs) {
    const response = await fetch(`${API_URL}/ml/predict-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Batch prediction failed')
    }
    
    return response.json()
  }

  /**
   * Generar pronóstico
   */
  async forecast(steps = 7, confidence = 0.95) {
    const response = await fetch(`${API_URL}/ml/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps, confidence })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Forecast failed')
    }
    
    return response.json()
  }

  /**
   * Evaluar modelo
   */
  async evaluate(data) {
    const response = await fetch(`${API_URL}/ml/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Evaluation failed')
    }
    
    return response.json()
  }

  /**
   * Obtener insights del modelo
   */
  async getInsights() {
    const response = await fetch(`${API_URL}/ml/insights`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get insights')
    }
    
    return response.json()
  }

  /**
   * Obtener estadísticas de datos
   */
  async getStats(data) {
    const response = await fetch(`${API_URL}/ml/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get stats')
    }
    
    return response.json()
  }
}

export default new MLServiceClient()
