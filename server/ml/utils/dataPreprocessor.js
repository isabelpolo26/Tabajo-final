/**
 * Data preprocessing utilities for ML models
 */

/**
 * Clean and validate data
 */
export function cleanData(data) {
  return data.filter(item => {
    // Remove null, undefined, or invalid entries
    if (!item) return false
    
    const value = item.amount || item.sales || item.value
    return typeof value === 'number' && !isNaN(value) && isFinite(value)
  })
}

/**
 * Split data into train and test sets
 */
export function trainTestSplit(data, testSize = 0.2) {
  const splitIndex = Math.floor(data.length * (1 - testSize))
  
  return {
    train: data.slice(0, splitIndex),
    test: data.slice(splitIndex)
  }
}

/**
 * Normalize data to 0-1 range
 */
export function minMaxNormalize(data) {
  const values = data.map(d => d.value || d.amount || d.sales)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  
  return {
    normalized: data.map(d => {
      const val = d.value || d.amount || d.sales
      return {
        ...d,
        normalized: (val - min) / range
      }
    }),
    params: { min, max, range }
  }
}

/**
 * Denormalize data back to original scale
 */
export function denormalize(normalizedValue, params) {
  return normalizedValue * params.range + params.min
}

/**
 * Calculate basic statistics
 */
export function calculateStats(data) {
  const values = data.map(d => d.value || d.amount || d.sales)
  const n = values.length
  
  const mean = values.reduce((a, b) => a + b, 0) / n
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
  const stdDev = Math.sqrt(variance)
  
  const sorted = [...values].sort((a, b) => a - b)
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)]
  
  return {
    count: n,
    mean,
    median,
    stdDev,
    variance,
    min: Math.min(...values),
    max: Math.max(...values)
  }
}

/**
 * Remove outliers using IQR method
 */
export function removeOutliers(data) {
  const values = data.map(d => d.value || d.amount || d.sales)
  const sorted = [...values].sort((a, b) => a - b)
  
  const q1Index = Math.floor(sorted.length * 0.25)
  const q3Index = Math.floor(sorted.length * 0.75)
  
  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1
  
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  
  return data.filter(d => {
    const val = d.value || d.amount || d.sales
    return val >= lowerBound && val <= upperBound
  })
}

/**
 * Fill missing values with mean
 */
export function fillMissing(data, method = 'mean') {
  const values = data
    .map(d => d.value || d.amount || d.sales)
    .filter(v => v !== null && v !== undefined)
  
  let fillValue
  if (method === 'mean') {
    fillValue = values.reduce((a, b) => a + b, 0) / values.length
  } else if (method === 'median') {
    const sorted = [...values].sort((a, b) => a - b)
    fillValue = sorted[Math.floor(sorted.length / 2)]
  } else {
    fillValue = 0
  }
  
  return data.map(d => {
    const val = d.value || d.amount || d.sales
    if (val === null || val === undefined || isNaN(val)) {
      return { ...d, value: fillValue, filled: true }
    }
    return d
  })
}

/**
 * Create time-based features
 */
export function createTimeFeatures(data, dateField = 'date') {
  return data.map(item => {
    const date = new Date(item[dateField])
    
    return {
      ...item,
      dayOfWeek: date.getDay(),
      dayOfMonth: date.getDate(),
      month: date.getMonth() + 1,
      quarter: Math.floor(date.getMonth() / 3) + 1,
      year: date.getFullYear(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    }
  })
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod(data, period = 'day', dateField = 'date') {
  const groups = {}
  
  data.forEach(item => {
    const date = new Date(item[dateField])
    let key
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      default:
        key = date.toISOString().split('T')[0]
    }
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  })
  
  return Object.entries(groups).map(([key, items]) => ({
    period: key,
    count: items.length,
    total: items.reduce((sum, item) => sum + (item.value || item.amount || item.sales), 0),
    average: items.reduce((sum, item) => sum + (item.value || item.amount || item.sales), 0) / items.length
  }))
}
