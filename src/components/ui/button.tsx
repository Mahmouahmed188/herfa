import * as React from "react"
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "default";
    size?: "default" | "sm" | "lg" | "icon";
}

function Button({
    className,
    children,
    variant = "primary",
    size = "default",
    ...props
}: ButtonProps) {

    // Map legacy variants to new styles or keep them distinct
    const variantStyles = {
        primary: "bg-primary text-black hover:opacity-90",
        default: "bg-primary text-black hover:opacity-90", // Alias for primary
        outline: "border border-surfaceBorder bg-transparent hover:bg-surfaceDark text-white",
        secondary: "bg-surfaceDark text-white hover:bg-surfaceDark/80 border border-surfaceBorder",
        ghost: "hover:bg-surfaceDark hover:text-white text-gray-300",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
    };

    const sizeStyles = {
        default: "h-12 px-6 py-3 rounded-xl",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-xl px-8",
        icon: "h-10 w-10 rounded-xl p-2 flex items-center justify-center", // Adjusted for icon buttons
    };

    // Fallback if variant/size is not found (though Typescript should prevent this)
    const selectedVariant = variantStyles[variant as keyof typeof variantStyles] || variantStyles.primary;
    const selectedSize = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                selectedVariant,
                selectedSize,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export { Button };
export default Button;
