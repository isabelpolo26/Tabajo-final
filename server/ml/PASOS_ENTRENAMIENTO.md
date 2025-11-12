# 📋 Pasos para Entrenar el Modelo con Datos Reales

## Paso 1: Preparar la Base de Datos ✅

### Opción A: Si ya tienes datos
```bash
# Verifica que tengas datos
npm run check:db
```

### Opción B: Si NO tienes datos
```bash
# Carga datos de ejemplo
mysql -u root -p zapatillas < server/data/sample_sales_data.sql

# Verifica que se cargaron
npm run check:db
```

**Resultado esperado:**
```
✅ Connected to database successfully
✅ Found 60 records in ventas table
✅ Good amount of data for training!
```

---

## Paso 2: Entrenar el Modelo 🎓

```bash
npm run train
```

**Esto tomará 1-2 minutos y verás:**

```
🚀 Starting ML training with real database data...

📥 Step 1: Fetching sales data from database...
📊 Fetched 60 sales records from database

🔧 Step 2: Enriching data with features...
📊 Step 3: Aggregating daily sales...
   Aggregated to 60 days of data

✂️  Step 4: Splitting data (80% train, 20% test)...
   Training: 48 days
   Testing: 12 days

🎓 Step 5: Training model...
Epoch 0: Loss = 0.234567
Epoch 100: Loss = 0.123456
Epoch 200: Loss = 0.089012
...
Early stopping at epoch 850

✅ Training completed!
```

---

## Paso 3: Revisar Resultados 📊

El script mostrará automáticamente:

### A. Información del Modelo
```
📊 Training Results:
   - Data points: 48
   - Features: 11
   - Final loss: 0.045678
```

### B. Importancia de Características
```
🎯 Feature Importance (Top 5):
   1. Is Weekend: 0.4523      ← Fin de semana es el factor más importante
   2. Day of Week: 0.3421     ← Día de la semana
   3. Customer Count: 0.2876  ← Número de clientes
   4. Promotions: 0.2345      ← Promociones
   5. Month: 0.1987           ← Mes del año
```

### C. Métricas de Evaluación
```
📈 Evaluating model on test data...
   Metrics:
   - MAE: 45.23        ← Error promedio de $45.23
   - RMSE: 67.89       ← Error cuadrático
   - MAPE: 8.45%       ← Error del 8.45% (¡Excelente!)
   - R²: 0.8934        ← Explica el 89% de la varianza (¡Muy bueno!)

   Interpretation:
   ✅ Good model fit
```

### D. Predicciones de Ejemplo
```
🔮 Sample Predictions:
   Today (actual data): $1234.56
   Weekend with promotion: $2345.67
   Holiday: $2789.01
```

---

## Paso 4: Usar el Modelo 🚀

### En tu código JavaScript:
```javascript
import mlService from './ml/services/mlService.js'

// Hacer una predicción
const prediction = await mlService.predictSales({
  dayOfWeek: 6,        // Sábado
  month: 12,           // Diciembre
  isWeekend: true,     // Es fin de semana
  isHoliday: false,
  promotions: 1,       // 1 promoción activa
  temperature: 22,
  customerCount: 150
})

console.log(`Predicción: $${prediction.prediction.toFixed(2)}`)
```

### Vía API:
```bash
curl -X POST http://localhost:3000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": 6,
    "month": 12,
    "isWeekend": true,
    "promotions": 1
  }'
```

---

## 🔄 Re-entrenar el Modelo

### ¿Cuándo re-entrenar?

- **Semanalmente**: Si tienes muchas ventas diarias
- **Mensualmente**: Para la mayoría de negocios
- **Cuando cambien patrones**: Nueva temporada, cambio de estrategia

### Cómo re-entrenar:
```bash
# Simplemente ejecuta de nuevo
npm run train
```

El modelo anterior será reemplazado con el nuevo.

---

## ❓ Solución de Problemas

### Error: "No data found"
```bash
# 1. Verifica la conexión
npm run check:db

# 2. Revisa las credenciales
cat server/.env

# 3. Verifica que MySQL esté corriendo
# Windows: services.msc → busca MySQL
```

### Error: "Connection refused"
```bash
# MySQL no está corriendo
# Inícialo desde services.msc (Windows)
# O desde la terminal
```

### Warning: "Less than 10 days of data"
```bash
# Opción 1: Agrega más datos reales
# Opción 2: Usa datos de ejemplo
mysql -u root -p zapatillas < server/data/sample_sales_data.sql
```

### Métricas pobres (R² < 0.5)
**Causas comunes:**
- Muy pocos datos (< 30 días)
- Datos de mala calidad (muchos nulos)
- Patrones muy irregulares

**Soluciones:**
- Recolecta más datos
- Limpia datos atípicos
- Agrega más características relevantes

---

## 📈 Interpretación de Métricas

### MAPE (Error Porcentual)
- **< 10%** = ✨ Excelente
- **10-20%** = ✅ Bueno
- **20-50%** = ⚠️ Aceptable
- **> 50%** = ❌ Necesita mejora

### R² (Calidad del Ajuste)
- **0.9-1.0** = ✨ Excelente
- **0.7-0.9** = ✅ Bueno
- **0.5-0.7** = ⚠️ Moderado
- **< 0.5** = ❌ Pobre

---

## 💡 Consejos

1. **Más datos = Mejor modelo**
   - Mínimo: 10 días
   - Recomendado: 30-90 días
   - Óptimo: 6-12 meses

2. **Calidad sobre cantidad**
   - Datos limpios y consistentes
   - Sin valores nulos
   - Sin outliers extremos

3. **Re-entrena regularmente**
   - Los patrones cambian con el tiempo
   - Nuevos datos mejoran el modelo

4. **Monitorea el rendimiento**
   - Compara predicciones vs ventas reales
   - Ajusta si las métricas empeoran

---

## ✅ Checklist Final

- [ ] Base de datos configurada y con datos
- [ ] Ejecutado `npm run check:db` exitosamente
- [ ] Ejecutado `npm run train` exitosamente
- [ ] Métricas revisadas (R² > 0.7 es bueno)
- [ ] Predicciones de prueba funcionando
- [ ] Modelo integrado en la aplicación

**¡Listo! Tu modelo está entrenado y funcionando.** 🎉
