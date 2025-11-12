/**
 * Test básico del módulo ML
 * Ejecutar con: node server/ml/test/mlTest.js
 */

import mlService from '../services/mlService.js'

async function runTests() {
  console.log('🧪 Iniciando pruebas del módulo ML\n')
  
  try {
    // Test 1: Entrenar modelo
    console.log('Test 1: Entrenamiento del modelo')
    const trainingData = [
      { amount: 100 },
      { amount: 120 },
      { amount: 140 },
      { amount: 160 },
      { amount: 180 }
    ]
    
    const trainResult = await mlService.trainSalesModel(trainingData, {
      learningRate: 0.01,
      epochs: 1000
    })
    console.log('✓ Modelo entrenado:', trainResult.model)
    
    // Test 2: Hacer predicción
    console.log('\nTest 2: Predicción')
    const prediction = await mlService.predictSales(5)
    console.log('✓ Predicción para input 5:', prediction.prediction.toFixed(2))
    
    // Test 3: Predicciones por lote
    console.log('\nTest 3: Predicciones por lote')
    const batchPredictions = await mlService.batchPredict([6, 7, 8])
    console.log('✓ Predicciones por lote:')
    batchPredictions.forEach(p => {
      console.log(`  Input ${p.input}: ${p.prediction.toFixed(2)}`)
    })
    
    // Test 4: Serie temporal
    console.log('\nTest 4: Serie temporal')
    const timeSeriesData = [
      { sales: 100 },
      { sales: 110 },
      { sales: 120 },
      { sales: 130 },
      { sales: 140 }
    ]
    
    const tsResult = await mlService.trainTimeSeriesModel(timeSeriesData)
    console.log('✓ Modelo de serie temporal entrenado')
    console.log('  Tendencia:', tsResult.trend)
    
    // Test 5: Pronóstico
    console.log('\nTest 5: Pronóstico')
    const forecast = await mlService.forecastSales(3, 0.95)
    console.log('✓ Pronóstico para 3 pasos:')
    forecast.forecast.forEach((f, i) => {
      console.log(`  Día ${i + 1}: ${f.prediction.toFixed(2)} (${f.lower.toFixed(2)} - ${f.upper.toFixed(2)})`)
    })
    
    // Test 6: Evaluación
    console.log('\nTest 6: Evaluación del modelo')
    const testData = [
      { amount: 200 },
      { amount: 220 }
    ]
    
    const evaluation = await mlService.evaluateModel(testData)
    console.log('✓ Métricas de evaluación:')
    console.log('  MAE:', evaluation.metrics.mae.toFixed(2))
    console.log('  RMSE:', evaluation.metrics.rmse.toFixed(2))
    
    // Test 7: Insights
    console.log('\nTest 7: Insights del modelo')
    const insights = mlService.getModelInsights()
    console.log('✓ Insights obtenidos:')
    console.log('  Modelo de ventas entrenado:', insights.salesModel.trained)
    console.log('  Modelo de serie temporal entrenado:', insights.timeSeriesModel.trained)
    
    console.log('\n✅ Todas las pruebas pasaron exitosamente!')
    
  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error.message)
    process.exit(1)
  }
}

runTests()
