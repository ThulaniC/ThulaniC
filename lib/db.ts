import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Helper function to execute raw SQL queries using tagged templates
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // For Neon serverless, we need to use tagged template literals
    // Convert parameterized query to template literal format
    let formattedQuery = query
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`
      const value = typeof param === "string" ? `'${param.replace(/'/g, "''")}'` : param
      formattedQuery = formattedQuery.replace(placeholder, value)
    })

    return await sql`${sql(formattedQuery)}`
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Better approach: Use direct tagged template literals for each function
// Users
export async function getUserByCredentials(username: string, passwordHash: string) {
  try {
    const result = await sql`
      SELECT u.*, r.name as role_name, r.permissions 
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.username = ${username} AND u.password_hash = ${passwordHash}
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Products
export async function getProducts() {
  try {
    return await sql`SELECT * FROM products ORDER BY name`
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getProductById(productId: number) {
  try {
    const result = await sql`SELECT * FROM products WHERE product_id = ${productId}`
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function updateProductPrice(productId: number, price: number, discountPrice: number | null) {
  try {
    const result = await sql`
      UPDATE products 
      SET price = ${price}, discount_price = ${discountPrice}, on_offer = ${discountPrice !== null}, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ${productId}
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Stock
export async function getStockByLocation(locationType: string, locationId: number) {
  try {
    return await sql`
      SELECT s.*, p.name as product_name, p.description, p.price, p.discount_price, p.on_offer, p.reorder_level
      FROM stocks s
      JOIN products p ON s.product_id = p.product_id
      WHERE s.location_type = ${locationType} AND s.location_id = ${locationId}
      ORDER BY p.name
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function updateStockQuantity(stockId: number, quantity: number) {
  try {
    const result = await sql`
      UPDATE stocks 
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE stock_id = ${stockId}
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getStockBelowReorderLevel(locationType: string, locationId: number) {
  try {
    return await sql`
      SELECT s.*, p.name as product_name, p.description, p.price, p.reorder_level
      FROM stocks s
      JOIN products p ON s.product_id = p.product_id
      WHERE s.location_type = ${locationType} AND s.location_id = ${locationId} AND s.quantity < p.reorder_level
      ORDER BY p.name
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Orders
export async function createOrder(
  fromType: string,
  fromId: number,
  toType: string,
  toId: number,
  isEmergency: boolean,
) {
  try {
    const result = await sql`
      INSERT INTO orders (from_type, from_id, to_type, to_id, is_emergency, status)
      VALUES (${fromType}, ${fromId}, ${toType}, ${toId}, ${isEmergency}, 'pending')
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function addOrderItem(orderId: number, productId: number, quantity: number, price: number) {
  try {
    return await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (${orderId}, ${productId}, ${quantity}, ${price})
      RETURNING *
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getOrdersByLocation(locationType: string, locationId: number, role: string) {
  try {
    if (role === "manager") {
      // Managers can see all orders
      return await sql`
        SELECT o.*, 
          CASE WHEN o.from_type = 'garage' THEN g1.name ELSE w1.name END as from_name,
          CASE WHEN o.to_type = 'garage' THEN g2.name ELSE w2.name END as to_name
        FROM orders o
        LEFT JOIN garages g1 ON o.from_type = 'garage' AND o.from_id = g1.garage_id
        LEFT JOIN warehouses w1 ON o.from_type = 'warehouse' AND o.from_id = w1.warehouse_id
        LEFT JOIN garages g2 ON o.to_type = 'garage' AND o.to_id = g2.garage_id
        LEFT JOIN warehouses w2 ON o.to_type = 'warehouse' AND o.to_id = w2.warehouse_id
        ORDER BY o.order_date DESC
      `
    } else {
      // Local staff and warehouse staff see orders related to their location
      return await sql`
        SELECT o.*, 
          CASE WHEN o.from_type = 'garage' THEN g1.name ELSE w1.name END as from_name,
          CASE WHEN o.to_type = 'garage' THEN g2.name ELSE w2.name END as to_name
        FROM orders o
        LEFT JOIN garages g1 ON o.from_type = 'garage' AND o.from_id = g1.garage_id
        LEFT JOIN warehouses w1 ON o.from_type = 'warehouse' AND o.from_id = w1.warehouse_id
        LEFT JOIN garages g2 ON o.to_type = 'garage' AND o.to_id = g2.garage_id
        LEFT JOIN warehouses w2 ON o.to_type = 'warehouse' AND o.to_id = w2.warehouse_id
        WHERE (o.from_type = ${locationType} AND o.from_id = ${locationId}) OR (o.to_type = ${locationType} AND o.to_id = ${locationId})
        ORDER BY o.order_date DESC
      `
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getOrderDetails(orderId: number) {
  try {
    return await sql`
      SELECT oi.*, p.name as product_name, p.description
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ${orderId}
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const result = await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ${orderId}
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Sales
export async function createSale(garageId: number, customerId: number, totalAmount: number) {
  try {
    const result = await sql`
      INSERT INTO sales (garage_id, customer_id, total_amount)
      VALUES (${garageId}, ${customerId}, ${totalAmount})
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function addSaleItem(
  saleId: number,
  productId: number,
  quantity: number,
  price: number,
  discount: number,
) {
  try {
    return await sql`
      INSERT INTO sale_items (sale_id, product_id, quantity, price, discount)
      VALUES (${saleId}, ${productId}, ${quantity}, ${price}, ${discount})
      RETURNING *
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getSalesByGarage(garageId: number) {
  try {
    return await sql`
      SELECT s.*, c.name as customer_name
      FROM sales s
      JOIN customers c ON s.customer_id = c.customer_id
      WHERE s.garage_id = ${garageId}
      ORDER BY s.sale_date DESC
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getSaleDetails(saleId: number) {
  try {
    return await sql`
      SELECT si.*, p.name as product_name, p.description
      FROM sale_items si
      JOIN products p ON si.product_id = p.product_id
      WHERE si.sale_id = ${saleId}
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Customers
export async function getCustomers() {
  try {
    return await sql`SELECT * FROM customers ORDER BY name`
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getCustomerById(customerId: number) {
  try {
    const result = await sql`SELECT * FROM customers WHERE customer_id = ${customerId}`
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function createCustomer(name: string, address: string, phone: string, email: string) {
  try {
    const result = await sql`
      INSERT INTO customers (name, address, phone, email)
      VALUES (${name}, ${address}, ${phone}, ${email})
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Garages
export async function getGarages() {
  try {
    return await sql`SELECT * FROM garages ORDER BY name`
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getGarageById(garageId: number) {
  try {
    const result = await sql`SELECT * FROM garages WHERE garage_id = ${garageId}`
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Warehouses
export async function getWarehouses() {
  try {
    return await sql`SELECT * FROM warehouses ORDER BY name`
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getWarehouseById(warehouseId: number) {
  try {
    const result = await sql`SELECT * FROM warehouses WHERE warehouse_id = ${warehouseId}`
    return result[0] || null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Reports
export async function getNationalSalesSummary() {
  try {
    return await sql`
      SELECT 
        g.name as garage_name,
        COUNT(s.sale_id) as total_sales,
        SUM(s.total_amount) as total_revenue,
        AVG(s.total_amount) as average_sale_value
      FROM sales s
      JOIN garages g ON s.garage_id = g.garage_id
      GROUP BY g.name
      ORDER BY total_revenue DESC
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getNationalStockSummary() {
  try {
    return await sql`
      SELECT 
        p.name as product_name,
        SUM(CASE WHEN s.location_type = 'warehouse' THEN s.quantity ELSE 0 END) as warehouse_stock,
        SUM(CASE WHEN s.location_type = 'garage' THEN s.quantity ELSE 0 END) as garage_stock,
        SUM(s.quantity) as total_stock
      FROM stocks s
      JOIN products p ON s.product_id = p.product_id
      GROUP BY p.name
      ORDER BY p.name
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getLocalSalesSummary(garageId: number) {
  try {
    return await sql`
      SELECT 
        p.name as product_name,
        COUNT(si.sale_item_id) as times_sold,
        SUM(si.quantity) as total_quantity,
        SUM(si.price * si.quantity - si.discount) as total_revenue
      FROM sale_items si
      JOIN sales s ON si.sale_id = s.sale_id
      JOIN products p ON si.product_id = p.product_id
      WHERE s.garage_id = ${garageId}
      GROUP BY p.name
      ORDER BY total_revenue DESC
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getLocalStockSummary(locationType: string, locationId: number) {
  try {
    return await sql`
      SELECT 
        p.name as product_name,
        s.quantity,
        p.reorder_level,
        CASE WHEN s.quantity < p.reorder_level THEN true ELSE false END as needs_reorder
      FROM stocks s
      JOIN products p ON s.product_id = p.product_id
      WHERE s.location_type = ${locationType} AND s.location_id = ${locationId}
      ORDER BY needs_reorder DESC, p.name
    `
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
