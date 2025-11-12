-- Sample Sales Data for ML Training
-- Run this if you don't have real data yet

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  cantidad INT DEFAULT 1,
  id_producto INT,
  id_cliente INT,
  FOREIGN KEY (id_producto) REFERENCES productos(id),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

-- Insert sample products
INSERT INTO productos (nombre, precio, stock) VALUES
  ('Nike Air Max', 150.00, 50),
  ('Adidas Ultraboost', 180.00, 30),
  ('Puma RS-X', 120.00, 40),
  ('Reebok Classic', 90.00, 60),
  ('New Balance 574', 110.00, 45);

-- Insert sample clients
INSERT INTO clientes (nombre, email, telefono) VALUES
  ('Juan Pérez', 'juan@email.com', '555-0001'),
  ('María García', 'maria@email.com', '555-0002'),
  ('Carlos López', 'carlos@email.com', '555-0003'),
  ('Ana Martínez', 'ana@email.com', '555-0004'),
  ('Luis Rodríguez', 'luis@email.com', '555-0005'),
  ('Sofia Torres', 'sofia@email.com', '555-0006'),
  ('Diego Ramírez', 'diego@email.com', '555-0007'),
  ('Laura Flores', 'laura@email.com', '555-0008');

-- Insert 60 days of sample sales data
-- Week 1 (January 2024)
INSERT INTO ventas (fecha, total, cantidad, id_producto, id_cliente) VALUES
  ('2024-01-01', 300.00, 2, 1, 1),  -- Holiday
  ('2024-01-02', 450.00, 3, 2, 2),
  ('2024-01-03', 360.00, 3, 3, 3),
  ('2024-01-04', 540.00, 3, 2, 4),
  ('2024-01-05', 600.00, 4, 1, 5),
  ('2024-01-06', 720.00, 4, 2, 6),  -- Weekend
  ('2024-01-07', 660.00, 6, 4, 7),  -- Weekend

-- Week 2
  ('2024-01-08', 390.00, 3, 3, 1),
  ('2024-01-09', 465.00, 3, 1, 2),
  ('2024-01-10', 435.00, 3, 5, 3),
  ('2024-01-11', 495.00, 3, 1, 4),
  ('2024-01-12', 570.00, 3, 2, 5),
  ('2024-01-13', 690.00, 4, 2, 6),  -- Weekend
  ('2024-01-14', 630.00, 5, 3, 7),  -- Weekend

-- Week 3
  ('2024-01-15', 405.00, 3, 5, 8),
  ('2024-01-16', 480.00, 4, 3, 1),
  ('2024-01-17', 450.00, 3, 1, 2),
  ('2024-01-18', 510.00, 3, 2, 3),
  ('2024-01-19', 600.00, 4, 1, 4),
  ('2024-01-20', 720.00, 4, 2, 5),  -- Weekend
  ('2024-01-21', 660.00, 6, 4, 6),  -- Weekend

-- Week 4
  ('2024-01-22', 420.00, 3, 5, 7),
  ('2024-01-23', 495.00, 3, 1, 8),
  ('2024-01-24', 465.00, 3, 3, 1),
  ('2024-01-25', 525.00, 3, 2, 2),
  ('2024-01-26', 630.00, 4, 1, 3),
  ('2024-01-27', 750.00, 5, 2, 4),  -- Weekend
  ('2024-01-28', 690.00, 6, 4, 5),  -- Weekend

-- Week 5
  ('2024-01-29', 435.00, 3, 5, 6),
  ('2024-01-30', 510.00, 4, 1, 7),
  ('2024-01-31', 480.00, 3, 3, 8),

-- February 2024
  ('2024-02-01', 540.00, 3, 2, 1),
  ('2024-02-02', 660.00, 4, 1, 2),
  ('2024-02-03', 780.00, 5, 2, 3),  -- Weekend
  ('2024-02-04', 720.00, 6, 4, 4),  -- Weekend

  ('2024-02-05', 450.00, 3, 5, 5),
  ('2024-02-06', 525.00, 4, 1, 6),
  ('2024-02-07', 495.00, 3, 3, 7),
  ('2024-02-08', 555.00, 3, 2, 8),
  ('2024-02-09', 690.00, 4, 1, 1),
  ('2024-02-10', 810.00, 5, 2, 2),  -- Weekend
  ('2024-02-11', 750.00, 6, 4, 3),  -- Weekend

  ('2024-02-12', 465.00, 3, 5, 4),
  ('2024-02-13', 540.00, 4, 1, 5),
  ('2024-02-14', 900.00, 6, 2, 6),  -- Valentine's Day
  ('2024-02-15', 570.00, 3, 2, 7),
  ('2024-02-16', 720.00, 4, 1, 8),
  ('2024-02-17', 840.00, 5, 2, 1),  -- Weekend
  ('2024-02-18', 780.00, 6, 4, 2),  -- Weekend

  ('2024-02-19', 480.00, 3, 5, 3),
  ('2024-02-20', 555.00, 4, 1, 4),
  ('2024-02-21', 510.00, 3, 3, 5),
  ('2024-02-22', 585.00, 3, 2, 6),
  ('2024-02-23', 750.00, 4, 1, 7),
  ('2024-02-24', 870.00, 5, 2, 8),  -- Weekend
  ('2024-02-25', 810.00, 6, 4, 1),  -- Weekend

  ('2024-02-26', 495.00, 3, 5, 2),
  ('2024-02-27', 570.00, 4, 1, 3),
  ('2024-02-28', 525.00, 3, 3, 4),
  ('2024-02-29', 600.00, 4, 2, 5);  -- Leap year

-- Verify data
SELECT 
  COUNT(*) as total_records,
  MIN(fecha) as first_date,
  MAX(fecha) as last_date,
  SUM(total) as total_sales,
  AVG(total) as avg_sale
FROM ventas;

-- Show daily aggregation
SELECT 
  fecha,
  COUNT(*) as num_transactions,
  SUM(total) as daily_total,
  AVG(total) as avg_transaction,
  DAYOFWEEK(fecha) as day_of_week,
  CASE WHEN DAYOFWEEK(fecha) IN (1, 7) THEN 'Weekend' ELSE 'Weekday' END as day_type
FROM ventas
GROUP BY fecha
ORDER BY fecha;
