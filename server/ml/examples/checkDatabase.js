/**
 * Database Connection and Data Check
 * Verifies database connection and shows available data
 */

import pool from '../../config/db.js'

async function checkDatabase() {
  console.log('🔍 Checking database connection and data...\n')
  
  try {
    // Test connection
    console.log('1️⃣  Testing database connection...')
    const connection = await pool.getConnection()
    console.log('   ✅ Connected to database successfully')
    connection.release()
    
    // Check tables
    console.log('\n2️⃣  Checking tables...')
    const [tables] = await pool.query('SHOW TABLES')
    console.log(`   Found ${tables.length} tables:`)
    tables.forEach(table => {
      const tableName = Object.values(table)[0]
      console.log(`   - ${tableName}`)
    })
    
    // Check ventas table
    console.log('\n3️⃣  Checking ventas table...')
    try {
      const [ventasCount] = await pool.query('SELECT COUNT(*) as count FROM ventas')
      const count = ventasCount[0].count
      console.log(`   ✅ Found ${count} records in ventas table`)
      
      if (count === 0) {
        console.log('   ⚠️  Warning: No data in ventas table')
        console.log('   💡 Add some sales data before training the model')
      } else if (count < 10) {
        console.log('   ⚠️  Warning: Less than 10 records')
        console.log('   💡 Recommended: At least 30 records for good results')
      } else if (count < 30) {
        console.log('   ⚠️  Limited data: Model will work but may not be very accurate')
        console.log('   💡 Recommended: 30-90 days of data')
      } else {
        console.log('   ✅ Good amount of data for training!')
      }
      
      // Show date range
      const [dateRange] = await pool.query(`
        SELECT 
          MIN(fecha) as first_date,
          MAX(fecha) as last_date,
          DATEDIFF(MAX(fecha), MIN(fecha)) as days_span
        FROM ventas
      `)
      
      if (dateRange[0].first_date) {
        console.log(`   📅 Date range: ${dateRange[0].first_date} to ${dateRange[0].last_date}`)
        console.log(`   📊 Span: ${dateRange[0].days_span} days`)
      }
      
      // Show sample data
      console.log('\n4️⃣  Sample data (first 5 records):')
      const [samples] = await pool.query(`
        SELECT 
          id,
          fecha,
          total,
          cantidad,
          id_producto,
          id_cliente
        FROM ventas
        ORDER BY fecha DESC
        LIMIT 5
      `)
      
      console.table(samples)
      
      // Check for required columns
      console.log('\n5️⃣  Checking table structure...')
      const [columns] = await pool.query('DESCRIBE ventas')
      const columnNames = columns.map(col => col.Field)
      
      const requiredColumns = ['id', 'fecha', 'total']
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col))
      
      if (missingColumns.length > 0) {
        console.log(`   ❌ Missing required columns: ${missingColumns.join(', ')}`)
      } else {
        console.log('   ✅ All required columns present')
      }
      
      console.log('   Available columns:', columnNames.join(', '))
      
      // Check productos table
      console.log('\n6️⃣  Checking productos table...')
      try {
        const [productCount] = await pool.query('SELECT COUNT(*) as count FROM productos')
        console.log(`   ✅ Found ${productCount[0].count} products`)
      } catch (error) {
        console.log('   ⚠️  productos table not found or error:', error.message)
      }
      
      // Check clientes table
      console.log('\n7️⃣  Checking clientes table...')
      try {
        const [clientCount] = await pool.query('SELECT COUNT(*) as count FROM clientes')
        console.log(`   ✅ Found ${clientCount[0].count} clients`)
      } catch (error) {
        console.log('   ⚠️  clientes table not found or error:', error.message)
      }
      
      // Summary
      console.log('\n' + '='.repeat(50))
      console.log('📋 SUMMARY')
      console.log('='.repeat(50))
      
      if (count >= 30) {
        console.log('✅ Database is ready for training!')
        console.log('💡 Run: npm run train')
      } else if (count >= 10) {
        console.log('⚠️  Database has limited data')
        console.log('💡 You can train but results may vary')
        console.log('💡 Run: npm run train')
      } else {
        console.log('❌ Not enough data for training')
        console.log('💡 Add at least 10 sales records first')
      }
      
    } catch (error) {
      console.log('   ❌ Error accessing ventas table:', error.message)
      console.log('   💡 Make sure the table exists and has the correct structure')
    }
    
  } catch (error) {
    console.error('\n❌ Database error:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Check if MySQL is running')
    console.log('   2. Verify credentials in server/.env')
    console.log('   3. Make sure database exists')
    console.log('   4. Check firewall settings')
  } finally {
    await pool.end()
  }
}

// Run check
checkDatabase()

export default checkDatabase
