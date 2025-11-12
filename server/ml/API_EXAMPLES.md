# Ejemplos de API - Machine Learning

## Ejemplos con cURL

### 1. Entrenar Modelo de Predicción

```bash
curl -X POST http://localhost:3000/api/ml/train \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"amount": 100},
      {"amount": 120},
      {"amount": 140},
      {"amount": 160},
      {"amount": 180}
    ],
    "options": {
      "learningRate": 0.01,
      "epochs": 1000
    }
  }'
```

### 2. Entrenar Modelo de Serie Temporal

```bash
curl -X POST http://localhost:3000/api/ml/train-timeseries \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"sales": 100},
      {"sales": 110},
      {"sales": 120},
      {"sales": 130},
      {"sales": 140}
    ]
  }'
```

### 3. Hacer una Predicción

```bash
curl -X POST http://localhost:3000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{"input": 10}'
```

### 4. Predicciones por Lote

```bash
curl -X POST http://localhost:3000/api/ml/predict-batch \
  -H "Content-Type: application/json" \
  -d '{"inputs": [10, 20, 30, 40]}'
```

### 5. Generar Pronóstico

```bash
curl -X POST http://localhost:3000/api/ml/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "steps": 7,
    "confidence": 0.95
  }'
```

### 6. Evaluar Modelo

```bash
curl -X POST http://localhost:3000/api/ml/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"amount": 200},
      {"amount": 220},
      {"amount": 240}
    ]
  }'
```

### 7. Obtener Insights

```bash
curl http://localhost:3000/api/ml/insights
```

### 8. Obtener Estadísticas

```bash
curl -X POST http://localhost:3000/api/ml/stats \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"amount": 100},
      {"amount": 150},
      {"amount": 200},
      {"amount": 250}
    ]
  }'
```

## Ejemplos con JavaScript (Fetch)

### Entrenar y Predecir

```javascript
// Entrenar modelo
const trainingData = [
  { amount: 100 },
  { amount: 150 },
  { amount: 200 },
  { amount: 250 },
  { amount: 300 }
]

const trainResponse = await fetch('http://localhost:3000/api/ml/train', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    data: trainingData,
    options: { epochs: 1000 }
  })
})

const trainResult = await trainResponse.json()
console.log('Entrenamiento:', trainResult)

// Hacer predicción
const predResponse = await fetch('http://localhost:3000/api/ml/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 5 })
})

const prediction = await predResponse.json()
console.log('Predicción:', prediction.prediction)
```

### Pronóstico con Intervalos de Confianza

```javascript
const forecastResponse = await fetch('http://localhost:3000/api/ml/forecast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    steps: 7,
    confidence: 0.95 
  })
})

const forecast = await forecastResponse.json()

forecast.forecast.forEach((day, index) => {
  console.log(`Día ${index + 1}:`)
  console.log(`  Predicción: ${day.prediction.toFixed(2)}`)
  console.log(`  Rango: ${day.lower.toFixed(2)} - ${day.upper.toFixed(2)}`)
})
```

## Ejemplos con Python

### Usando requests

```python
import requests
import json

# Entrenar modelo
training_data = {
    "data": [
        {"amount": 100},
        {"amount": 120},
        {"amount": 140},
        {"amount": 160},
        {"amount": 180}
    ],
    "options": {
        "learningRate": 0.01,
        "epochs": 1000
    }
}

response = requests.post(
    'http://localhost:3000/api/ml/train',
    json=training_data
)

print('Entrenamiento:', response.json())

# Hacer predicción
prediction_data = {"input": 10}
response = requests.post(
    'http://localhost:3000/api/ml/predict',
    json=prediction_data
)

print('Predicción:', response.json())
```

## Respuestas Esperadas

### Entrenamiento Exitoso
```json
{
  "success": true,
  "message": "Model trained successfully",
  "model": {
    "weight": 20.5,
    "bias": 95.3,
    "trained": true
  },
  "dataPoints": 5
}
```

### Predicción
```json
{
  "success": true,
  "input": 10,
  "prediction": 300.45,
  "model": "sales_predictor"
}
```

### Pronóstico
```json
{
  "success": true,
  "steps": 3,
  "forecast": [
    {
      "prediction": 200.5,
      "lower": 180.3,
      "upper": 220.7
    },
    {
      "prediction": 220.8,
      "lower": 200.6,
      "upper": 241.0
    },
    {
      "prediction": 241.1,
      "lower": 220.9,
      "upper": 261.3
    }
  ],
  "confidence": 0.95
}
```

### Error
```json
{
  "error": "Model must be trained before making predictions"
}
```
