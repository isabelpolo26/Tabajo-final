# Machine Learning Module

Este módulo proporciona capacidades de Machine Learning para predicción de ventas y análisis de series temporales.

## Características

### Modelos Disponibles

1. **SalesPredictor** - Regresión lineal para predicción de ventas
   - Entrenamiento con gradient descent
   - Normalización de datos
   - Predicciones individuales y por lotes

2. **TimeSeriesPredictor** - Análisis de series temporales
   - Detección de tendencias
   - Promedios móviles
   - Pronósticos con intervalos de confianza
   - Análisis de estacionalidad

## API Endpoints

### Entrenar Modelo
```
POST /api/ml/train
Body: {
  "data": [
    { "amount": 100 },
    { "amount": 150 },
    { "amount": 200 }
  ],
  "options": {
    "learningRate": 0.01,
    "epochs": 1000,
    "save": true
  }
}
```

### Entrenar Serie Temporal
```
POST /api/ml/train-timeseries
Body: {
  "data": [
    { "sales": 100 },
    { "sales": 150 },
    { "sales": 200 }
  ]
}
```

### Hacer Predicción
```
POST /api/ml/predict
Body: {
  "input": 10
}
```

### Predicciones por Lote
```
POST /api/ml/predict-batch
Body: {
  "inputs": [10, 20, 30, 40]
}
```

### Pronóstico
```
POST /api/ml/forecast
Body: {
  "steps": 7,
  "confidence": 0.95
}
```

### Evaluar Modelo
```
POST /api/ml/evaluate
Body: {
  "data": [
    { "amount": 100 },
    { "amount": 150 }
  ]
}
```

### Obtener Insights
```
GET /api/ml/insights
```

### Estadísticas de Datos
```
POST /api/ml/stats
Body: {
  "data": [
    { "amount": 100 },
    { "amount": 150 }
  ]
}
```

## Uso Básico

### Ejemplo de Entrenamiento y Predicción

```javascript
// 1. Entrenar el modelo
const trainingData = [
  { amount: 100 },
  { amount: 150 },
  { amount: 200 },
  { amount: 250 },
  { amount: 300 }
]

await fetch('http://localhost:3000/api/ml/train', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: trainingData })
})

// 2. Hacer predicción
const prediction = await fetch('http://localhost:3000/api/ml/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 5 })
})

const result = await prediction.json()
console.log('Predicción:', result.prediction)
```

## Utilidades

### Preprocesamiento de Datos

- `cleanData()` - Limpia y valida datos
- `trainTestSplit()` - Divide datos en entrenamiento y prueba
- `minMaxNormalize()` - Normaliza datos al rango 0-1
- `calculateStats()` - Calcula estadísticas básicas
- `removeOutliers()` - Elimina valores atípicos
- `fillMissing()` - Rellena valores faltantes
- `createTimeFeatures()` - Crea características temporales
- `aggregateByPeriod()` - Agrega datos por período

### Almacenamiento de Modelos

Los modelos entrenados se guardan en `server/data/models/` como archivos JSON.

## Métricas de Evaluación

- **MAE** (Mean Absolute Error) - Error absoluto medio
- **RMSE** (Root Mean Square Error) - Raíz del error cuadrático medio

## Notas

- Los modelos requieren al menos 3 puntos de datos para entrenamiento
- Los datos se normalizan automáticamente durante el entrenamiento
- Las predicciones siempre devuelven valores no negativos
- Los modelos se pueden guardar y cargar para uso posterior
