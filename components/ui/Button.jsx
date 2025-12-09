import { cn } from "@/lib/utils";

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(167,139,250,0.3)]",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost:
      "hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
