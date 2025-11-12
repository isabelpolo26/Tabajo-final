# 🚀 Inicio Rápido - Entrenamiento con Datos Reales

## Pasos Simples

### 1. Verificar Base de Datos
```bash
cd server
npm run check:db
```

Esto te mostrará:
- ✅ Si la conexión funciona
- 📊 Cuántos datos tienes
- 📅 Rango de fechas
- 🔍 Estructura de tablas

### 2. Entrenar el Modelo
```bash
npm run train
```

El script automáticamente:
- Extrae datos de tu base de datos
- Enriquece con características
- Entrena el modelo
- Evalúa el rendimiento
- Guarda el modelo

### 3. Ver Resultados

El script mostrará:
```
✅ Training completed!
📊 Training Results:
   - Data points: 36
   - Features: 11
   - Final loss: 0.045678

🎯 Feature Importance (Top 5):
   1. Is Weekend: 0.4523
   2. Day of Week: 0.3421
   ...

📈 Metrics:
   - MAE: 45.23
   - RMSE: 67.89
   - MAPE: 8.45%
   - R²: 0.8934
```

## 📋 Requisitos Mínimos

1. **MySQL corriendo** con base de datos `zapatillas`
2. **Tabla ventas** con al menos:
   - `id` (INT)
   - `fecha` (DATE)
   - `total` (DECIMAL)
3. **Al menos 10 registros** de ventas (recomendado: 30+)

## 🔧 Configuración Rápida

Si no tienes datos aún, crea la tabla:

```sql
CREATE TABLE ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  cantidad INT DEFAULT 1,
  id_producto INT,
  id_cliente INT
);

-- Insertar datos de ejemplo
INSERT INTO ventas (fecha, total, cantidad) VALUES
  ('2024-01-01', 1200.00, 2),
  ('2024-01-02', 1500.00, 3),
  ('2024-01-03', 1400.00, 2),
  -- ... más datos
```

## ❓ Problemas Comunes

### "No data found"
```bash
# Verifica la conexión
npm run check:db

# Revisa el archivo .env
cat .env
```

### "Connection refused"
```bash
# Verifica que MySQL esté corriendo
# Windows:
services.msc  # Busca MySQL

# O inicia MySQL manualmente
```

### "Less than 10 days of data"
- Agrega más registros a la tabla ventas
- O usa datos de ejemplo: `npm run train:sample`

## 📚 Más Información

- [ENTRENAMIENTO_REAL.md](./ENTRENAMIENTO_REAL.md) - Guía completa
- [MEJORAS_MODELO.md](./MEJORAS_MODELO.md) - Detalles técnicos
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Uso del modelo

## 🎯 Siguiente Paso

Una vez entrenado, usa el modelo en tu aplicación:

```javascript
// En tu código
import mlService from './ml/services/mlService.js'

const prediction = await mlService.predictSales({
  dayOfWeek: 6,
  month: 12,
  isWeekend: true,
  promotions: 1
})

console.log(`Predicción: $${prediction.prediction}`)
```
