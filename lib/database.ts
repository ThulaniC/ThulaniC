import { Pool } from "pg"

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log("Executed query", { text, duration, rows: res.rowCount })
  return res
}

// Garage-related database functions
export async function getGarages() {
  const result = await query("SELECT * FROM garages")
  return result.rows
}

export async function getGarageById(id: number) {
  const result = await query("SELECT * FROM garages WHERE garage_id = $1", [id])
  return result.rows[0]
}

// Inventory-related database functions
export async function getInventoryByGarage(garageId: number) {
  const result = await query(
    `
    SELECT i.*, p.name, p.description, p.national_price 
    FROM inventory i
    JOIN parts p ON i.part_id = p.part_id
    WHERE i.garage_id = $1
  `,
    [garageId],
  )
  return result.rows
}

export async function updateInventoryQuantity(inventoryId: number, quantity: number) {
  const result = await query("UPDATE inventory SET quantity = $1 WHERE inventory_id = $2 RETURNING *", [
    quantity,
    inventoryId,
  ])
  return result.rows[0]
}

// Parts-related database functions
export async function getParts() {
  const result = await query("SELECT * FROM parts")
  return result.rows
}

export async function getPartById(id: number) {
  const result = await query("SELECT * FROM parts WHERE part_id = $1", [id])
  return result.rows[0]
}

export async function updatePartPrice(partId: number, price: number) {
  const result = await query("UPDATE parts SET national_price = $1 WHERE part_id = $2 RETURNING *", [price, partId])
  return result.rows[0]
}

// Sales-related database functions
export async function createSale(garageId: number, customerId: number, totalAmount: number, paymentMethod: string) {
  const result = await query(
    "INSERT INTO sales (garage_id, customer_id, sale_date, total_amount, payment_method) VALUES ($1, $2, NOW(), $3, $4) RETURNING *",
    [garageId, customerId, totalAmount, paymentMethod],
  )
  return result.rows[0]
}

export async function addSaleItem(saleId: number, partId: number, quantity: number, unitPrice: number) {
  const result = await query(
    "INSERT INTO sale_items (sale_id, part_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING *",
    [saleId, partId, quantity, unitPrice],
  )
  return result.rows[0]
}

// Order-related database functions
export async function createOrder(garageId: number, orderType: string) {
  const result = await query(
    "INSERT INTO orders (garage_id, order_date, status, order_type) VALUES ($1, NOW(), $2, $3) RETURNING *",
    [garageId, "pending", orderType],
  )
  return result.rows[0]
}

export async function addOrderItem(orderId: number, partId: number, quantity: number) {
  const result = await query("INSERT INTO order_items (order_id, part_id, quantity) VALUES ($1, $2, $3) RETURNING *", [
    orderId,
    partId,
    quantity,
  ])
  return result.rows[0]
}

export async function updateOrderStatus(orderId: number, status: string) {
  const result = await query("UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *", [status, orderId])
  return result.rows[0]
}

// Customer-related database functions
export async function getCustomers() {
  const result = await query("SELECT * FROM customers")
  return result.rows
}

export async function createCustomer(name: string, contact: string, address: string) {
  const result = await query("INSERT INTO customers (name, contact, address) VALUES ($1, $2, $3) RETURNING *", [
    name,
    contact,
    address,
  ])
  return result.rows[0]
}

// Reporting functions
export async function getNationalSalesSummary(startDate: string, endDate: string) {
  const result = await query(
    `
    SELECT 
      SUM(total_amount) as total_sales,
      COUNT(*) as total_orders,
      AVG(total_amount) as average_order_value
    FROM sales
    WHERE sale_date BETWEEN $1 AND $2
  `,
    [startDate, endDate],
  )
  return result.rows[0]
}

export async function getGarageSalesSummary(garageId: number, startDate: string, endDate: string) {
  const result = await query(
    `
    SELECT 
      SUM(total_amount) as total_sales,
      COUNT(*) as total_orders,
      AVG(total_amount) as average_order_value
    FROM sales
    WHERE garage_id = $1 AND sale_date BETWEEN $2 AND $3
  `,
    [garageId, startDate, endDate],
  )
  return result.rows[0]
}

export async function getNationalStockSummary() {
  const result = await query(`
    SELECT 
      p.category,
      SUM(i.quantity) as total_quantity,
      SUM(i.quantity * p.national_price) as total_value
    FROM inventory i
    JOIN parts p ON i.part_id = p.part_id
    GROUP BY p.category
  `)
  return result.rows
}
