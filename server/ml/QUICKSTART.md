# Guía de Inicio Rápido - ML Module

## 🚀 Inicio Rápido

### 1. Iniciar el Servidor

```bash
cd server
npm start
```

El servidor estará disponible en `http://localhost:3000`

### 2. Probar el Módulo ML

Ejecuta el script de prueba:

```bash
node server/ml/test/mlTest.js
```

### 3. Usar la API

#### Paso 1: Entrenar el modelo

```bash
curl -X POST http://localhost:3000/api/ml/train \
  -H "Content-Type: application/json" \
  -d '{"data":[{"amount":100},{"amount":150},{"amount":200}]}'
```

#### Paso 2: Hacer una predicción

```bash
curl -X POST http://localhost:3000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{"input":3}'
```

## 📊 Ejemplo Completo

```javascript
// 1. Preparar datos de ventas
const salesData = [
  { amount: 100 },  // Día 0
  { amount: 120 },  // Día 1
  { amount: 140 },  // Día 2
  { amount: 160 },  // Día 3
  { amount: 180 }   // Día 4
]

// 2. Entrenar modelo
const response = await fetch('http://localhost:3000/api/ml/train', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: salesData })
})

// 3. Predecir ventas del día 5
const prediction = await fetch('http://localhost:3000/api/ml/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 5 })
})

const result = await prediction.json()
console.log('Ventas predichas para el día 5:', result.prediction)
// Resultado esperado: ~200
```

## 🎯 Casos de Uso

### 1. Predicción de Ventas Diarias

```javascript
// Entrenar con datos históricos
const historicalSales = [
  { amount: 1000 },
  { amount: 1200 },
  { amount: 1100 },
  { amount: 1300 },
  { amount: 1250 }
]

await mlService.trainSalesModel(historicalSales)

// Predecir próximo día
const nextDay = await mlService.predictSales(5)
```

### 2. Pronóstico Semanal

```javascript
// Entrenar modelo de serie temporal
await mlService.trainTimeSeriesModel(historicalSales)

// Generar pronóstico para 7 días
const weekForecast = await mlService.forecastSales(7, 0.95)

weekForecast.forecast.forEach((day, i) => {
  console.log(`Día ${i+1}: ${day.prediction} (±${day.upper - day.prediction})`)
})
```

### 3. Análisis de Tendencias

```javascript
// Obtener insights del modelo
const insights = mlService.getModelInsights()

if (insights.timeSeriesModel.trend.slope > 0) {
  console.log('📈 Tendencia al alza')
} else {
  console.log('📉 Tendencia a la baja')
}
```

## 🔧 Configuración Avanzada

### Ajustar Hiperparámetros

```javascript
await mlService.trainSalesModel(data, {
  learningRate: 0.01,  // Tasa de aprendizaje (default: 0.01)
  epochs: 2000,        // Iteraciones (default: 1000)
  verbose: true,       // Mostrar progreso (default: false)
  save: true          // Guardar modelo (default: false)
})
```

### Evaluar Precisión

```javascript
// Dividir datos en entrenamiento y prueba
const trainData = salesData.slice(0, 8)
const testData = salesData.slice(8)

// Entrenar
await mlService.trainSalesModel(trainData)

// Evaluar
const evaluation = await mlService.evaluateModel(testData)
console.log('Error promedio:', evaluation.metrics.mae)
console.log('RMSE:', evaluation.metrics.rmse)
```

## 📱 Integración con React

```jsx
import { useState, useEffect } from 'react'
import mlService from './services/mlService'

function SalesPrediction() {
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    async function train() {
      const data = [
        { amount: 100 },
        { amount: 150 },
        { amount: 200 }
      ]
      
      await mlService.trainModel(data)
      const result = await mlService.predict(3)
      setPrediction(result.prediction)
    }
    
    train()
  }, [])

  return (
    <div>
      <h2>Predicción de Ventas</h2>
      {prediction && <p>Próxima venta: ${prediction.toFixed(2)}</p>}
    </div>
  )
}
```

## 🐛 Solución de Problemas

### Error: "Model must be trained"
- Asegúrate de entrenar el modelo antes de hacer predicciones
- Verifica que los datos de entrenamiento sean válidos

### Error: "Need at least 3 data points"
- Proporciona al menos 3 puntos de datos para el entrenamiento
- Verifica que los datos no contengan valores nulos

### Predicciones incorrectas
- Aumenta el número de epochs (ej: 2000)
- Ajusta la tasa de aprendizaje (ej: 0.001)
- Verifica la calidad de los datos de entrenamiento

## 📚 Recursos Adicionales

- [README.md](./README.md) - Documentación completa
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Ejemplos de API
- [basicUsage.js](./examples/basicUsage.js) - Ejemplos de código
