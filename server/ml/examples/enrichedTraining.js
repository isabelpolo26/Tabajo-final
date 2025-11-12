/**
 * Example: Training with enriched data
 * Demonstrates how to use multiple features for better predictions
 */

import mlService from '../services/mlService.js'

// Sample enriched sales data with multiple features
const enrichedSalesData = [
  // Week 1
  { date: '2024-01-01', amount: 1200, dayOfWeek: 1, month: 1, isWeekend: false, isHoliday: true, promotions: 1, temperature: 15, customerCount: 120 },
  { date: '2024-01-02', amount: 1500, dayOfWeek: 2, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 16, customerCount: 150 },
  { date: '2024-01-03', amount: 1400, dayOfWeek: 3, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 14, customerCount: 140 },
  { date: '2024-01-04', amount: 1600, dayOfWeek: 4, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 17, customerCount: 160 },
  { date: '2024-01-05', amount: 1800, dayOfWeek: 5, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 18, customerCount: 180 },
  { date: '2024-01-06', amount: 2200, dayOfWeek: 6, month: 1, isWeekend: true, isHoliday: false, promotions: 1, temperature: 19, customerCount: 220 },
  { date: '2024-01-07', amount: 2000, dayOfWeek: 0, month: 1, isWeekend: true, isHoliday: false, promotions: 0, temperature: 18, customerCount: 200 },
  
  // Week 2
  { date: '2024-01-08', amount: 1300, dayOfWeek: 1, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 16, customerCount: 130 },
  { date: '2024-01-09', amount: 1550, dayOfWeek: 2, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 17, customerCount: 155 },
  { date: '2024-01-10', amount: 1450, dayOfWeek: 3, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 15, customerCount: 145 },
  { date: '2024-01-11', amount: 1650, dayOfWeek: 4, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 18, customerCount: 165 },
  { date: '2024-01-12', amount: 1900, dayOfWeek: 5, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 19, customerCount: 190 },
  { date: '2024-01-13', amount: 2300, dayOfWeek: 6, month: 1, isWeekend: true, isHoliday: false, promotions: 1, temperature: 20, customerCount: 230 },
  { date: '2024-01-14', amount: 2100, dayOfWeek: 0, month: 1, isWeekend: true, isHoliday: false, promotions: 0, temperature: 19, customerCount: 210 },
  
  // Week 3
  { date: '2024-01-15', amount: 1350, dayOfWeek: 1, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 17, customerCount: 135 },
  { date: '2024-01-16', amount: 1600, dayOfWeek: 2, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 18, customerCount: 160 },
  { date: '2024-01-17', amount: 1500, dayOfWeek: 3, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 16, customerCount: 150 },
  { date: '2024-01-18', amount: 1700, dayOfWeek: 4, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 19, customerCount: 170 },
  { date: '2024-01-19', amount: 2000, dayOfWeek: 5, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 20, customerCount: 200 },
  { date: '2024-01-20', amount: 2400, dayOfWeek: 6, month: 1, isWeekend: true, isHoliday: false, promotions: 1, temperature: 21, customerCount: 240 },
  { date: '2024-01-21', amount: 2200, dayOfWeek: 0, month: 1, isWeekend: true, isHoliday: false, promotions: 0, temperature: 20, customerCount: 220 },
  
  // Week 4
  { date: '2024-01-22', amount: 1400, dayOfWeek: 1, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 18, customerCount: 140 },
  { date: '2024-01-23', amount: 1650, dayOfWeek: 2, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 19, customerCount: 165 },
  { date: '2024-01-24', amount: 1550, dayOfWeek: 3, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 17, customerCount: 155 },
  { date: '2024-01-25', amount: 1750, dayOfWeek: 4, month: 1, isWeekend: false, isHoliday: false, promotions: 0, temperature: 20, customerCount: 175 },
  { date: '2024-01-26', amount: 2100, dayOfWeek: 5, month: 1, isWeekend: false, isHoliday: false, promotions: 1, temperature: 21, customerCount: 210 },
  { date: '2024-01-27', amount: 2500, dayOfWeek: 6, month: 1, isWeekend: true, isHoliday: false, promotions: 1, temperature: 22, customerCount: 250 },
  { date: '2024-01-28', amount: 2300, dayOfWeek: 0, month: 1, isWeekend: true, isHoliday: false, promotions: 0, temperature: 21, customerCount: 230 },
  
  // Additional month data
  { date: '2024-02-01', amount: 1450, dayOfWeek: 4, month: 2, isWeekend: false, isHoliday: false, promotions: 0, temperature: 19, customerCount: 145 },
  { date: '2024-02-02', amount: 2200, dayOfWeek: 5, month: 2, isWeekend: false, isHoliday: false, promotions: 1, temperature: 20, customerCount: 220 },
  { date: '2024-02-03', amount: 2600, dayOfWeek: 6, month: 2, isWeekend: true, isHoliday: false, promotions: 1, temperature: 23, customerCount: 260 }
]

async function trainWithEnrichedData() {
  console.log('🚀 Training model with enriched data...\n')
  
  try {
    // Train the model
    const result = await mlService.trainSalesModel(enrichedSalesData, {
      learningRate: 0.01,
      epochs: 2000,
      verbose: true,
      save: true
    })
    
    console.log('\n✅ Training completed!')
    console.log('📊 Results:')
    console.log(`   - Data points: ${result.dataPoints}`)
    console.log(`   - Features: ${result.model.numFeatures}`)
    console.log(`   - Final loss: ${result.model.finalLoss}`)
    
    console.log('\n🎯 Feature Importance:')
    result.featureImportance.forEach((feature, i) => {
      console.log(`   ${i + 1}. ${feature.feature}: ${feature.importance}`)
    })
    
    // Test predictions
    console.log('\n🔮 Making predictions...')
    
    const testCases = [
      { desc: 'Weekday, no promotion', data: { dayOfWeek: 2, month: 2, isWeekend: false, promotions: 0, temperature: 18, customerCount: 150 } },
      { desc: 'Weekend with promotion', data: { dayOfWeek: 6, month: 2, isWeekend: true, promotions: 1, temperature: 22, customerCount: 250 } },
      { desc: 'Holiday', data: { dayOfWeek: 1, month: 2, isWeekend: false, isHoliday: true, promotions: 1, temperature: 20, customerCount: 200 } }
    ]
    
    for (const test of testCases) {
      const prediction = await mlService.predictSales(test.data)
      console.log(`   ${test.desc}: $${prediction.prediction.toFixed(2)}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the example
trainWithEnrichedData()

export { enrichedSalesData, trainWithEnrichedData }
