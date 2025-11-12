/**
 * Training with Real Database Data
 * Extracts sales data from MySQL and trains the ML model
 */

import pool from '../../config/db.js'
import mlService from '../services/mlService.js'

/**
 * Fetch real sales data from database
 */
async function fetchSalesData() {
  try {
    // Query to get sales data with all relevant information
    const [rows] = await pool.query(`
      SELECT 
        v.id,
        v.fecha as date,
        v.total as amount,
        v.cantidad as quantity,
        v.id_producto as product_id,
        v.id_cliente as customer_id,
        DAYOFWEEK(v.fecha) - 1 as dayOfWeek,
        MONTH(v.fecha) as month,
        YEAR(v.fecha) as year,
        CASE WHEN DAYOFWEEK(v.fecha) IN (1, 7) THEN 1 ELSE 0 END as isWeekend,
        p.precio as product_price,
        p.stock,
        c.nombre as customer_name
      FROM ventas v
      LEFT JOIN productos p ON v.id_producto = p.id
      LEFT JOIN clientes c ON v.id_cliente = c.id
      ORDER BY v.fecha ASC
    `)

    console.log(`📊 Fetched ${rows.length} sales records from database`)
    return rows
  } catch (error) {
    console.error('❌ Error fetching data:', error.message)
    
    // If tables don't exist, return sample data structure
    console.log('⚠️  Using sample data structure. Please adjust query to match your tables.')
    return []
  }
}

/**
 * Enrich sales data with additional features
 */
function enrichSalesData(salesData) {
  return salesData.map((sale, index) => {
    const date = new Date(sale.date)
    
    // Calculate if it's a holiday (customize based on your country)
    const isHoliday = checkIfHoliday(date)
    
    // Get previous sales for lag features
    const previousSale = index > 0 ? salesData[index - 1] : null
    
    return {
      ...sale,
      amount: parseFloat(sale.amount) || 0,
      dayOfWeek: sale.dayOfWeek !== undefined ? sale.dayOfWeek : date.getDay(),
      month: sale.month || date.getMonth() + 1,
      year: sale.year || date.getFullYear(),
      isWeekend: sale.isWeekend === 1 || date.getDay() === 0 || date.getDay() === 6,
      isHoliday,
      promotions: 0, // Add logic to detect promotions if available
      temperature: 20, // Add weather API integration if needed
      customerCount: 1, // Can be aggregated from daily data
      previousAmount: previousSale ? parseFloat(previousSale.amount) : 0
    }
  })
}

/**
 * Check if date is a holiday (customize for your region)
 */
function checkIfHoliday(date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // Example holidays (adjust for your country)
  const holidays = [
    { month: 1, day: 1 },   // New Year
    { month: 5, day: 1 },   // Labor Day
    { month: 12, day: 25 }, // Christmas
    // Add more holidays
  ]
  
  return holidays.some(h => h.month === month && h.day === day)
}

/**
 * Aggregate daily sales
 */
function aggregateDailySales(salesData) {
  const dailyMap = new Map()
  
  salesData.forEach(sale => {
    const dateKey = new Date(sale.date).toISOString().split('T')[0]
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: sale.date,
        amount: 0,
        quantity: 0,
        customerCount: 0,
        dayOfWeek: sale.dayOfWeek,
        month: sale.month,
        year: sale.year,
        isWeekend: sale.isWeekend,
        isHoliday: sale.isHoliday,
        promotions: sale.promotions,
        temperature: sale.temperature
      })
    }
    
    const daily = dailyMap.get(dateKey)
    daily.amount += parseFloat(sale.amount) || 0
    daily.quantity += parseInt(sale.quantity) || 0
    daily.customerCount += 1
  })
  
  return Array.from(dailyMap.values()).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )
}

/**
 * Split data into training and testing sets
 */
function splitData(data, testRatio = 0.2) {
  const splitIndex = Math.floor(data.length * (1 - testRatio))
  
  return {
    training: data.slice(0, splitIndex),
    testing: data.slice(splitIndex)
  }
}

/**
 * Main training function
 */
async function trainWithRealData() {
  console.log('🚀 Starting ML training with real database data...\n')
  
  try {
    // Step 1: Fetch data
    console.log('📥 Step 1: Fetching sales data from database...')
    const rawSalesData = await fetchSalesData()
    
    if (rawSalesData.length === 0) {
      console.log('⚠️  No data found. Please check your database connection and tables.')
      console.log('   Expected tables: ventas, productos, clientes')
      return
    }
    
    // Step 2: Enrich data
    console.log('🔧 Step 2: Enriching data with features...')
    const enrichedData = enrichSalesData(rawSalesData)
    
    // Step 3: Aggregate by day
    console.log('📊 Step 3: Aggregating daily sales...')
    const dailyData = aggregateDailySales(enrichedData)
    console.log(`   Aggregated to ${dailyData.length} days of data`)
    
    if (dailyData.length < 10) {
      console.log('⚠️  Warning: Less than 10 days of data. Model may not be accurate.')
      console.log('   Recommendation: Collect at least 30 days of data for better results.')
    }
    
    // Step 4: Split data
    console.log('✂️  Step 4: Splitting data (80% train, 20% test)...')
    const { training, testing } = splitData(dailyData)
    console.log(`   Training: ${training.length} days`)
    console.log(`   Testing: ${testing.length} days`)
    
    // Step 5: Train model
    console.log('\n🎓 Step 5: Training model...')
    const result = await mlService.trainSalesModel(training, {
      learningRate: 0.01,
      epochs: 2000,
      verbose: true,
      earlyStoppingPatience: 50,
      save: true
    })
    
    console.log('\n✅ Training completed!')
    console.log('📊 Training Results:')
    console.log(`   - Data points: ${result.dataPoints}`)
    console.log(`   - Features: ${result.model.numFeatures}`)
    console.log(`   - Final loss: ${result.model.finalLoss?.toFixed(6) || 'N/A'}`)
    
    // Step 6: Feature importance
    console.log('\n🎯 Feature Importance (Top 5):')
    result.featureImportance.slice(0, 5).forEach((feature, i) => {
      console.log(`   ${i + 1}. ${feature.feature}: ${feature.importance}`)
    })
    
    // Step 7: Evaluate on test set
    if (testing.length > 0) {
      console.log('\n📈 Step 6: Evaluating model on test data...')
      const evaluation = await mlService.evaluateModel(testing)
      
      console.log('   Metrics:')
      console.log(`   - MAE: ${evaluation.metrics.mae}`)
      console.log(`   - RMSE: ${evaluation.metrics.rmse}`)
      console.log(`   - MAPE: ${evaluation.metrics.mape}`)
      console.log(`   - R²: ${evaluation.metrics.r2}`)
      
      // Interpretation
      const r2 = parseFloat(evaluation.metrics.r2)
      console.log('\n   Interpretation:')
      if (r2 > 0.9) {
        console.log('   ✨ Excellent model fit!')
      } else if (r2 > 0.7) {
        console.log('   ✅ Good model fit')
      } else if (r2 > 0.5) {
        console.log('   ⚠️  Moderate fit - consider adding more data or features')
      } else {
        console.log('   ❌ Poor fit - model needs improvement')
      }
    }
    
    // Step 8: Make sample predictions
    console.log('\n🔮 Sample Predictions:')
    
    const today = new Date()
    const predictions = [
      {
        desc: 'Today (actual data)',
        data: {
          dayOfWeek: today.getDay(),
          month: today.getMonth() + 1,
          isWeekend: today.getDay() === 0 || today.getDay() === 6,
          isHoliday: false,
          promotions: 0,
          temperature: 20,
          customerCount: 100
        }
      },
      {
        desc: 'Weekend with promotion',
        data: {
          dayOfWeek: 6,
          month: today.getMonth() + 1,
          isWeekend: true,
          isHoliday: false,
          promotions: 1,
          temperature: 22,
          customerCount: 150
        }
      },
      {
        desc: 'Holiday',
        data: {
          dayOfWeek: 1,
          month: 12,
          isWeekend: false,
          isHoliday: true,
          promotions: 1,
          temperature: 20,
          customerCount: 200
        }
      }
    ]
    
    for (const pred of predictions) {
      const prediction = await mlService.predictSales(pred.data)
      console.log(`   ${pred.desc}: $${prediction.prediction.toFixed(2)}`)
    }
    
    console.log('\n✅ Training complete! Model saved and ready to use.')
    console.log('💡 Use the model via API: POST /api/ml/predict')
    
  } catch (error) {
    console.error('\n❌ Error during training:', error.message)
    console.error(error.stack)
  } finally {
    // Close database connection
    await pool.end()
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  trainWithRealData()
}

export { trainWithRealData, fetchSalesData, enrichSalesData, aggregateDailySales }
