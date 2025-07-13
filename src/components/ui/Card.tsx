import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-md bg-card text-card-foreground shadow-sm p-4 flex flex-col",
  {
    variants: {
      size: {
        "6x6": "col-span-6 row-span-6",
        "4x6": "col-span-4 row-span-6",
        "2x6": "col-span-2 row-span-6",
        "1x1": "col-span-1 row-span-1",
        "3x3": "col-span-3 row-span-3",
        "2x3": "col-span-2 row-span-3",
        "3x2": "col-span-3 row-span-2",
        "6x3": "col-span-6 row-span-3"
      }
    },
    defaultVariants: {
      size: "6x6"
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ size, className }))} {...props} />
  )
)
Card.displayName = "Card"

export { Card, cardVariants }
