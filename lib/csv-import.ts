import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Define import order to maintain referential integrity
const IMPORT_ORDER = [
  "roles",
  "garages",
  "warehouses",
  "products",
  "users",
  "customers",
  "stocks",
  "sales",
  "sale_items",
  "payments",
  "orders",
  "order_items",
]

// Define table schemas for validation
const TABLE_SCHEMAS: Record<string, { columns: string[]; primaryKey: string }> = {
  roles: {
    columns: ["role_id", "name", "permissions"],
    primaryKey: "role_id",
  },
  garages: {
    columns: ["garage_id", "name", "address", "phone", "email"],
    primaryKey: "garage_id",
  },
  warehouses: {
    columns: ["warehouse_id", "name", "address", "phone", "email"],
    primaryKey: "warehouse_id",
  },
  products: {
    columns: ["product_id", "name", "description", "price", "discount_price", "on_offer", "reorder_level"],
    primaryKey: "product_id",
  },
  users: {
    columns: ["user_id", "username", "password_hash", "email", "location_id", "location_type", "role_id"],
    primaryKey: "user_id",
  },
  customers: {
    columns: ["customer_id", "name", "address", "phone", "email"],
    primaryKey: "customer_id",
  },
  stocks: {
    columns: ["stock_id", "product_id", "location_id", "location_type", "quantity"],
    primaryKey: "stock_id",
  },
  sales: {
    columns: ["sale_id", "garage_id", "customer_id", "total_amount", "sale_date", "status"],
    primaryKey: "sale_id",
  },
  sale_items: {
    columns: ["sale_item_id", "sale_id", "product_id", "quantity", "price", "discount"],
    primaryKey: "sale_item_id",
  },
  payments: {
    columns: ["payment_id", "sale_id", "amount", "payment_method", "payment_date"],
    primaryKey: "payment_id",
  },
  orders: {
    columns: ["order_id", "from_id", "from_type", "to_id", "to_type", "status", "is_emergency", "order_date"],
    primaryKey: "order_id",
  },
  order_items: {
    columns: ["order_item_id", "order_id", "product_id", "quantity", "price"],
    primaryKey: "order_item_id",
  },
}

// Type for import results
export type ImportResult = {
  table: string
  success: boolean
  rowsImported: number
  error?: string
  warnings?: string[]
}

/**
 * Parse CSV content into an array of objects (simple implementation)
 */
export function parseCSV(content: string): Record<string, any>[] {
  const lines = content.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must contain at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const data: Record<string, any>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => {
      v = v.trim()
      // Remove quotes if present
      if (v.startsWith('"') && v.endsWith('"')) {
        v = v.slice(1, -1)
      }
      // Convert empty strings to null
      if (v === "") return null
      // Try to convert to number if it looks like a number
      if (!isNaN(Number(v)) && v !== "") return Number(v)
      // Convert boolean strings
      if (v === "true") return true
      if (v === "false") return false
      return v
    })

    if (values.length === headers.length) {
      const row: Record<string, any> = {}
      headers.forEach((header, index) => {
        row[header] = values[index]
      })
      data.push(row)
    }
  }

  return data
}

/**
 * Validate CSV data against table schema
 */
export function validateCSVData(tableName: string, data: Record<string, any>[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const schema = TABLE_SCHEMAS[tableName]

  if (!schema) {
    errors.push(`Unknown table: ${tableName}`)
    return { valid: false, errors }
  }

  // Check if data is empty
  if (!data.length) {
    errors.push("CSV file contains no data rows")
    return { valid: false, errors }
  }

  // Check if all required columns are present
  const firstRow = data[0]
  const missingColumns = schema.columns.filter((col) => !(col in firstRow))
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(", ")}`)
  }

  // Check for duplicate primary keys
  const primaryKeys = new Set()
  data.forEach((row, index) => {
    const pkValue = row[schema.primaryKey]
    if (primaryKeys.has(pkValue)) {
      errors.push(`Duplicate primary key (${schema.primaryKey}=${pkValue}) at row ${index + 2}`)
    }
    primaryKeys.add(pkValue)
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Import data into a specific table
 */
export async function importTableData(
  tableName: string,
  data: Record<string, any>[],
  options: { truncate?: boolean; updateExisting?: boolean } = {},
): Promise<ImportResult> {
  const { truncate = false, updateExisting = true } = options
  const schema = TABLE_SCHEMAS[tableName]
  const warnings: string[] = []

  try {
    // Validate data
    const { valid, errors } = validateCSVData(tableName, data)
    if (!valid) {
      return {
        table: tableName,
        success: false,
        rowsImported: 0,
        error: `Validation failed: ${errors.join("; ")}`,
      }
    }

    // Begin transaction
    await sql`BEGIN`

    // Optionally truncate table
    if (truncate) {
      await sql`TRUNCATE TABLE ${sql(tableName)} CASCADE`
    }

    // Import each row
    let rowsImported = 0
    for (const row of data) {
      const columns = Object.keys(row).filter((col) => schema.columns.includes(col))
      const values = columns.map((col) => row[col])

      if (updateExisting) {
        // Use upsert (INSERT ... ON CONFLICT DO UPDATE)
        const updateSet = columns
          .filter((col) => col !== schema.primaryKey)
          .map((col) => `${col} = EXCLUDED.${col}`)
          .join(", ")

        // Build the query dynamically
        const columnsList = columns.join(", ")
        const valuesList = values.map((_, i) => `$${i + 1}`).join(", ")

        const query = `
          INSERT INTO ${tableName} (${columnsList})
          VALUES (${valuesList})
          ON CONFLICT (${schema.primaryKey})
          DO UPDATE SET ${updateSet}
        `

        // Use sql.query for parameterized queries
        await sql.query(query, values)
      } else {
        // Simple insert, skip if primary key exists
        try {
          const columnsList = columns.join(", ")
          const valuesList = values.map((_, i) => `$${i + 1}`).join(", ")
          const query = `INSERT INTO ${tableName} (${columnsList}) VALUES (${valuesList})`

          await sql.query(query, values)
        } catch (error) {
          if ((error as Error).message.includes("duplicate key")) {
            warnings.push(`Skipped row with existing primary key: ${row[schema.primaryKey]}`)
            continue
          }
          throw error
        }
      }
      rowsImported++
    }

    // Commit transaction
    await sql`COMMIT`

    return {
      table: tableName,
      success: true,
      rowsImported,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    // Rollback on error
    await sql`ROLLBACK`
    console.error(`Error importing ${tableName}:`, error)
    return {
      table: tableName,
      success: false,
      rowsImported: 0,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Import multiple CSV files in the correct order
 */
export async function importCSVFiles(
  files: Record<string, string>,
  options: { truncate?: boolean; updateExisting?: boolean } = {},
): Promise<ImportResult[]> {
  const results: ImportResult[] = []

  // Import tables in the correct order
  for (const tableName of IMPORT_ORDER) {
    if (files[tableName]) {
      try {
        const data = parseCSV(files[tableName])
        const result = await importTableData(tableName, data, options)
        results.push(result)

        // Stop on critical error
        if (!result.success && ["roles", "garages", "warehouses", "products"].includes(tableName)) {
          break
        }
      } catch (error) {
        results.push({
          table: tableName,
          success: false,
          rowsImported: 0,
          error: error instanceof Error ? error.message : String(error),
        })
        break
      }
    }
  }

  return results
}
