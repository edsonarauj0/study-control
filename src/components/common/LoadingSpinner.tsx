import { Loader2Icon } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | number;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5", 
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
  "3xl": "h-12 w-12",
  "4xl": "h-16 w-16",
};

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClass = typeof size === "number" 
    ? `h-${size} w-${size}` 
    : sizeClasses[size];
    
  return (
    <Loader2Icon 
      className={`animate-spin ${sizeClass} ${className}`} 
    />
  );
}
