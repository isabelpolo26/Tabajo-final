/**
 * Ejemplos básicos de uso del módulo ML
 */

import mlService from '../services/mlService.js'

// Ejemplo 1: Entrenar y predecir ventas
async function example1() {
  console.log('=== Ejemplo 1: Predicción de Ventas ===\n')
  
  // Datos de ventas históricas
  const salesData = [
    { amount: 100 },
    { amount: 120 },
    { amount: 140 },
    { amount: 160 },
    { amount: 180 },
    { amount: 200 },
    { amount: 220 }
  ]
  
  // Entrenar modelo
  console.log('Entrenando modelo...')
  const training = await mlService.trainSalesModel(salesData, {
    learningRate: 0.01,
    epochs: 1000
  })
  console.log('Modelo entrenado:', training)
  
  // Hacer predicción
  console.log('\nHaciendo predicción para el día 8...')
  const prediction = await mlService.predictSales(7)
  console.log('Predicción:', prediction)
}

// Ejemplo 2: Serie temporal con pronóstico
async function example2() {
  console.log('\n=== Ejemplo 2: Pronóstico de Serie Temporal ===\n')
  
  const timeSeriesData = [
    { sales: 100 },
    { sales: 110 },
    { sales: 105 },
    { sales: 120 },
    { sales: 130 },
    { sales: 125 },
    { sales: 140 }
  ]
  
  // Entrenar modelo de serie temporal
  console.log('Entrenando modelo de serie temporal...')
  const training = await mlService.trainTimeSeriesModel(timeSeriesData)
  console.log('Modelo entrenado:', training)
  
  // Hacer pronóstico para 5 días
  console.log('\nGenerando pronóstico para 5 días...')
  const forecast = await mlService.forecastSales(5, 0.95)
  console.log('Pronóstico:', forecast)
}

// Ejemplo 3: Evaluación del modelo
async function example3() {
  console.log('\n=== Ejemplo 3: Evaluación del Modelo ===\n')
  
  // Datos de entrenamiento
  const trainingData = [
    { amount: 100 },
    { amount: 150 },
    { amount: 200 },
    { amount: 250 },
    { amount: 300 }
  ]
  
  // Datos de prueba
  const testData = [
    { amount: 350 },
    { amount: 400 }
  ]
  
  // Entrenar
  await mlService.trainSalesModel(trainingData)
  
  // Evaluar
  console.log('Evaluando modelo...')
  const evaluation = await mlService.evaluateModel(testData)
  console.log('Métricas:', evaluation.metrics)
  console.log('Predicciones vs Reales:', evaluation.predictions)
}

// Ejemplo 4: Predicciones por lote
async function example4() {
  console.log('\n=== Ejemplo 4: Predicciones por Lote ===\n')
  
  const trainingData = [
    { amount: 50 },
    { amount: 100 },
    { amount: 150 },
    { amount: 200 }
  ]
  
  await mlService.trainSalesModel(trainingData)
  
  // Predecir múltiples valores
  const inputs = [5, 10, 15, 20]
  console.log('Haciendo predicciones para:', inputs)
  
  const predictions = await mlService.batchPredict(inputs)
  console.log('Resultados:', predictions)
}

// Ejecutar ejemplos
async function runExamples() {
  try {
    await example1()
    await example2()
    await example3()
    await example4()
    
    console.log('\n✓ Todos los ejemplos completados')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Descomentar para ejecutar
// runExamples()

export { example1, example2, example3, example4, runExamples }
