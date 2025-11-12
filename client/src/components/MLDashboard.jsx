import { useState } from 'react'
import mlService from '../services/mlService'

function MLDashboard() {
  const [salesData, setSalesData] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTrain = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Parse sales data
      const data = salesData
        .split(',')
        .map(val => ({ amount: parseFloat(val.trim()) }))
        .filter(item => !isNaN(item.amount))
      
      if (data.length < 3) {
        throw new Error('Se necesitan al menos 3 valores')
      }
      
      // Train both models
      await mlService.trainModel(data)
      await mlService.trainTimeSeries(data)
      
      alert('Modelos entrenados exitosamente')
      
      // Get insights
      const insightsData = await mlService.getInsights()
      setInsights(insightsData.insights)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePredict = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const input = parseInt(prompt('Ingrese el valor de entrada:'))
      if (isNaN(input)) return
      
      const result = await mlService.predict(input)
      setPrediction(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForecast = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const steps = parseInt(prompt('¿Cuántos días pronosticar?', '7'))
      if (isNaN(steps)) return
      
      const result = await mlService.forecast(steps)
      setForecast(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🤖 Machine Learning Dashboard</h1>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          background: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Entrenar Modelo</h2>
        <p>Ingrese valores de ventas separados por comas:</p>
        <textarea
          value={salesData}
          onChange={(e) => setSalesData(e.target.value)}
          placeholder="100, 120, 140, 160, 180, 200"
          style={{ 
            width: '100%', 
            height: '80px', 
            padding: '10px',
            fontSize: '14px'
          }}
        />
        <button 
          onClick={handleTrain}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {loading ? 'Entrenando...' : 'Entrenar Modelos'}
        </button>
      </div>

      {insights && (
        <div style={{ 
          marginBottom: '30px',
          padding: '15px',
          background: '#f0f8ff',
          borderRadius: '4px'
        }}>
          <h3>📊 Insights del Modelo</h3>
          <div>
            <strong>Modelo de Ventas:</strong> {insights.salesModel.trained ? '✓ Entrenado' : '✗ No entrenado'}
          </div>
          {insights.salesModel.trained && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <div>Peso: {insights.salesModel.parameters.weight.toFixed(4)}</div>
              <div>Sesgo: {insights.salesModel.parameters.bias.toFixed(4)}</div>
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <strong>Modelo de Serie Temporal:</strong> {insights.timeSeriesModel.trained ? '✓ Entrenado' : '✗ No entrenado'}
          </div>
          {insights.timeSeriesModel.trend && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <div>Pendiente: {insights.timeSeriesModel.trend.slope.toFixed(4)}</div>
              <div>Intercepto: {insights.timeSeriesModel.trend.intercept.toFixed(4)}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2>Predicciones</h2>
        <button 
          onClick={handlePredict}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Hacer Predicción
        </button>
        <button 
          onClick={handleForecast}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Generar Pronóstico
        </button>
      </div>

      {prediction && (
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          background: '#e8f5e9',
          borderRadius: '4px'
        }}>
          <h3>🎯 Predicción</h3>
          <div>Entrada: {prediction.input}</div>
          <div>Predicción: <strong>{prediction.prediction.toFixed(2)}</strong></div>
        </div>
      )}

      {forecast && (
        <div style={{ 
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '4px'
        }}>
          <h3>📈 Pronóstico ({forecast.steps} días)</h3>
          <div style={{ marginTop: '10px' }}>
            {forecast.forecast.map((item, index) => (
              <div key={index} style={{ 
                padding: '8px',
                marginBottom: '5px',
                background: 'white',
                borderRadius: '3px'
              }}>
                <strong>Día {index + 1}:</strong> {item.prediction.toFixed(2)}
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                  (Rango: {item.lower.toFixed(2)} - {item.upper.toFixed(2)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MLDashboard
