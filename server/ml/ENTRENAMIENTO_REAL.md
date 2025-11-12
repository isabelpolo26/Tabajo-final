# 🎓 Entrenamiento con Datos Reales

## 📋 Requisitos Previos

1. **Base de datos MySQL** configurada y corriendo
2. **Tablas necesarias** en la base de datos:
   - `ventas` (id, fecha, total, cantidad, id_producto, id_cliente)
   - `productos` (id, nombre, precio, stock)
   - `clientes` (id, nombre)

3. **Variables de entorno** configuradas en `server/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=zapatillas
   ```

## 🚀 Cómo Entrenar el Modelo

### Opción 1: Con Datos Reales de la Base de Datos

```bash
cd server
npm run train
```

Este script:
1. ✅ Extrae datos de ventas de tu base de datos MySQL
2. ✅ Enriquece los datos con características adicionales
3. ✅ Agrega ventas por día
4. ✅ Divide datos en entrenamiento (80%) y prueba (20%)
5. ✅ Entrena el modelo con early stopping
6. ✅ Evalúa el modelo con métricas completas
7. ✅ Guarda el modelo entrenado
8. ✅ Muestra predicciones de ejemplo

### Opción 2: Con Datos de Ejemplo

```bash
cd server
npm run train:sample
```

Útil para probar el sistema sin datos reales.

## 📊 Estructura de Datos Esperada

### Tabla `ventas`
```sql
CREATE TABLE ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL,
  id_producto INT,
  id_cliente INT,
  FOREIGN KEY (id_producto) REFERENCES productos(id),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);
```

### Datos Mínimos Recomendados
- **Mínimo**: 10 días de datos
- **Recomendado**: 30-90 días de datos
- **Óptimo**: 6-12 meses de datos

## 🎯 Características Extraídas Automáticamente

El script extrae y calcula estas características:

1. **Temporales**:
   - Día de la semana (0-6)
   - Mes (1-12)
   - Año
   - Es fin de semana (sí/no)
   - Es día festivo (sí/no)

2. **Ventas**:
   - Total del día
   - Cantidad de productos
   - Número de clientes
   - Venta anterior (lag)
   - Promedio móvil

3. **Opcionales** (puedes agregar):
   - Promociones activas
   - Temperatura
   - Eventos especiales

## 📈 Interpretación de Resultados

### Métricas de Evaluación

**MAE (Mean Absolute Error)**
- Error promedio en unidades monetarias
- Ejemplo: MAE = 50 significa error promedio de $50

**RMSE (Root Mean Squared Error)**
- Penaliza errores grandes más fuertemente
- Siempre mayor o igual que MAE

**MAPE (Mean Absolute Percentage Error)**
- Error en porcentaje
- < 10% = Excelente
- 10-20% = Bueno
- 20-50% = Aceptable
- > 50% = Necesita mejora

**R² (Coeficiente de Determinación)**
- Qué tan bien el modelo explica la varianza
- 0.9-1.0 = Excelente
- 0.7-0.9 = Bueno
- 0.5-0.7 = Moderado
- < 0.5 = Pobre

### Ejemplo de Salida

```
🚀 Starting ML training with real database data...

📥 Step 1: Fetching sales data from database...
📊 Fetched 450 sales records from database

🔧 Step 2: Enriching data with features...
📊 Step 3: Aggregating daily sales...
   Aggregated to 45 days of data

✂️  Step 4: Splitting data (80% train, 20% test)...
   Training: 36 days
   Testing: 9 days

🎓 Step 5: Training model...
Epoch 0: Loss = 0.234567
Epoch 100: Loss = 0.123456
...
Early stopping at epoch 850

✅ Training completed!
📊 Training Results:
   - Data points: 36
   - Features: 11
   - Final loss: 0.045678

🎯 Feature Importance (Top 5):
   1. Is Weekend: 0.4523
   2. Day of Week: 0.3421
   3. Customer Count: 0.2876
   4. Promotions: 0.2345
   5. Month: 0.1987

📈 Step 6: Evaluating model on test data...
   Metrics:
   - MAE: 45.23
   - RMSE: 67.89
   - MAPE: 8.45%
   - R²: 0.8934

   Interpretation:
   ✅ Good model fit

🔮 Sample Predictions:
   Today (actual data): $1234.56
   Weekend with promotion: $2345.67
   Holiday: $2789.01

✅ Training complete! Model saved and ready to use.
```

## 🔧 Personalización

### Ajustar Días Festivos

Edita la función `checkIfHoliday()` en `trainWithRealData.js`:

```javascript
function checkIfHoliday(date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const holidays = [
    { month: 1, day: 1 },   // Año Nuevo
    { month: 5, day: 1 },   // Día del Trabajo
    { month: 7, day: 20 },  // Día de la Independencia (Colombia)
    { month: 12, day: 25 }, // Navidad
    // Agrega más festivos de tu país
  ]
  
  return holidays.some(h => h.month === month && h.day === day)
}
```

### Agregar Más Características

Modifica la función `enrichSalesData()`:

```javascript
function enrichSalesData(salesData) {
  return salesData.map((sale, index) => {
    return {
      ...sale,
      // Características existentes...
      
      // Nuevas características
      hasPromotion: sale.descuento > 0,
      seasonalFactor: getSeasonalFactor(sale.month),
      competitorPrice: getCompetitorPrice(sale.product_id),
      // etc.
    }
  })
}
```

### Ajustar Hiperparámetros

En el script, modifica las opciones de entrenamiento:

```javascript
const result = await mlService.trainSalesModel(training, {
  learningRate: 0.01,              // Velocidad de aprendizaje
  epochs: 2000,                    // Máximo de iteraciones
  earlyStoppingPatience: 50,       // Paciencia para early stopping
  verbose: true,                   // Mostrar progreso
  save: true                       // Guardar modelo
})
```

## 🐛 Solución de Problemas

### Error: "No data found"
- Verifica que las tablas existan en la base de datos
- Verifica que haya datos en la tabla `ventas`
- Revisa las credenciales en `.env`

### Error: "Connection refused"
- Asegúrate de que MySQL esté corriendo
- Verifica el puerto (por defecto 3306)
- Revisa el firewall

### Warning: "Less than 10 days of data"
- Agrega más datos históricos a la base de datos
- El modelo funcionará pero con menor precisión

### Métricas pobres (R² < 0.5)
- Necesitas más datos
- Agrega más características relevantes
- Verifica la calidad de los datos (valores nulos, outliers)

## 📝 Próximos Pasos

Después de entrenar el modelo:

1. **Usar el modelo** vía API:
   ```bash
   POST /api/ml/predict
   {
     "dayOfWeek": 6,
     "month": 12,
     "isWeekend": true,
     "promotions": 1
   }
   ```

2. **Re-entrenar periódicamente**:
   - Ejecuta `npm run train` cada semana/mes
   - Más datos = mejor modelo

3. **Monitorear rendimiento**:
   - Compara predicciones vs ventas reales
   - Ajusta características según sea necesario

4. **Integrar en tu aplicación**:
   - Dashboard con predicciones
   - Alertas de ventas bajas/altas
   - Optimización de inventario
