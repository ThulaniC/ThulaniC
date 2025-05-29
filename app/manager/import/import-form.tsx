"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Checkbox } from "../../../components/ui/checkbox"
import { Label } from "../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { AlertCircle, CheckCircle2, FileUp, Loader2 } from "lucide-react"

// Define the tables and their display order
const TABLES = [
  { name: "roles", label: "Roles", description: "User roles and permissions" },
  { name: "garages", label: "Garages", description: "Garage locations" },
  { name: "warehouses", label: "Warehouses", description: "Warehouse locations" },
  { name: "products", label: "Products", description: "Product catalog" },
  { name: "users", label: "Users", description: "System users" },
  { name: "customers", label: "Customers", description: "Customer information" },
  { name: "stocks", label: "Stocks", description: "Inventory levels" },
  { name: "sales", label: "Sales", description: "Sales transactions" },
  { name: "sale_items", label: "Sale Items", description: "Items in sales" },
  { name: "payments", label: "Payments", description: "Payment records" },
  { name: "orders", label: "Orders", description: "Orders between locations" },
  { name: "order_items", label: "Order Items", description: "Items in orders" },
]

type ImportResult = {
  table: string
  success: boolean
  rowsImported: number
  error?: string
  warnings?: string[]
}

export default function ImportForm() {
  const [files, setFiles] = useState<Record<string, File>>({})
  const [options, setOptions] = useState({
    truncate: false,
    updateExisting: true,
  })
  const [isImporting, setIsImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tableName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [tableName]: e.target.files![0],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsImporting(true)
    setResults(null)
    setError(null)

    try {
      const formData = new FormData()

      // Add options
      formData.append("truncate", options.truncate.toString())
      formData.append("updateExisting", options.updateExisting.toString())

      // Add files
      Object.entries(files).forEach(([tableName, file]) => {
        formData.append(`${tableName}.csv`, file)
      })

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Import failed")
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsImporting(false)
    }
  }

  const totalFiles = Object.keys(files).length
  const successCount = results?.filter((r) => r.success).length || 0
  const totalRowsImported = results?.reduce((sum, r) => sum + r.rowsImported, 0) || 0

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <Alert variant={successCount === results.length ? "default" : "warning"}>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Import Complete</AlertTitle>
            <AlertDescription>
              Successfully imported {successCount} of {results.length} tables ({totalRowsImported} rows total).
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Import Options</CardTitle>
            <CardDescription>Configure how data should be imported</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="truncate"
                checked={options.truncate}
                onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, truncate: checked === true }))}
              />
              <Label htmlFor="truncate" className="font-normal">
                Truncate tables before import (WARNING: This will delete all existing data)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateExisting"
                checked={options.updateExisting}
                onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, updateExisting: checked === true }))}
              />
              <Label htmlFor="updateExisting" className="font-normal">
                Update existing records (if unchecked, will skip records with existing IDs)
              </Label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CSV Files</CardTitle>
                <CardDescription>Select CSV files to import. Files must match the expected format.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {TABLES.map((table) => (
                    <div key={table.name} className="space-y-2">
                      <Label htmlFor={`file-${table.name}`} className="block">
                        {table.label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id={`file-${table.name}`}
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, table.name)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById(`file-${table.name}`)?.click()}
                        >
                          <FileUp className="mr-2 h-4 w-4" />
                          {files[table.name] ? files[table.name].name : "Select File"}
                        </Button>
                        {files[table.name] && (
                          <Badge variant="outline" className="ml-2">
                            {(files[table.name].size / 1024).toFixed(1)} KB
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{table.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {totalFiles} file{totalFiles !== 1 ? "s" : ""} selected
                </div>
                <Button type="submit" disabled={totalFiles === 0 || isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import Data"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Import Results</CardTitle>
                <CardDescription>Summary of the import operation for each table.</CardDescription>
              </CardHeader>
              <CardContent>
                {results && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Table</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Rows Imported</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.table}>
                          <TableCell className="font-medium">{result.table}</TableCell>
                          <TableCell>
                            {result.success ? (
                              <Badge variant="success" className="bg-green-500">
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Failed</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{result.rowsImported}</TableCell>
                          <TableCell>
                            {result.error && <p className="text-sm text-red-500">{result.error}</p>}
                            {result.warnings && result.warnings.length > 0 && (
                              <p className="text-sm text-amber-500">
                                {result.warnings.length} warning{result.warnings.length !== 1 ? "s" : ""}
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  )
}
