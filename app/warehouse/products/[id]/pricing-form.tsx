"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

type Product = {
  product_id: number
  name: string
  description: string
  price: number
  discount_price: number | null
  on_offer: boolean
  reorder_level: number
}

type PricingFormProps = {
  product: Product
}

export default function PricingForm({ product }: PricingFormProps) {
  const router = useRouter()
  const [price, setPrice] = useState(product.price)
  const [onOffer, setOnOffer] = useState(product.on_offer)
  const [discountPrice, setDiscountPrice] = useState(product.discount_price || product.price * 0.9)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    if (price <= 0) {
      setError("Price must be greater than 0")
      setIsSubmitting(false)
      return
    }

    if (onOffer && (discountPrice <= 0 || discountPrice >= price)) {
      setError("Discount price must be greater than 0 and less than the regular price")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/products/${product.product_id}/price`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          discountPrice: onOffer ? discountPrice : null,
          onOffer,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product pricing")
      }

      setSuccess("Product pricing updated successfully")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating product pricing")
    } finally {
      setIsSubmitting(false)
    }
  }

  const discountPercentage = ((price - discountPrice) / price) * 100

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Regular Price (£)</Label>
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch id="on-offer" checked={onOffer} onCheckedChange={setOnOffer} />
          <Label htmlFor="on-offer" className="font-normal">
            Put this product on offer
          </Label>
        </div>

        {onOffer && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="discount-price">Discount Price (£)</Label>
            <Input
              id="discount-price"
              type="number"
              min="0.01"
              step="0.01"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              required={onOffer}
            />
            {price > 0 && discountPrice > 0 && discountPrice < price && (
              <p className="text-sm text-muted-foreground mt-1">
                This is a {discountPercentage.toFixed(1)}% discount from the regular price.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Pricing"}
        </Button>
      </div>
    </form>
  )
}
