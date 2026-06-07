import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

/**
 * Reference primitive, intentionally NOT the default shadcn Button. It sets the
 * house style other components should match: token-driven colors, a deliberate
 * radius and weight, denser padding, and a real focus-visible ring. When you pull
 * more shadcn components (`pnpm dlx shadcn@latest add ...`), retune them to this -
 * do not ship the defaults. See the shadcn-ui skill and docs/engineering/FRONTEND.md.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border border-border bg-background hover:bg-secondary hover:text-secondary-foreground',
        ghost: 'hover:bg-secondary hover:text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // For use on a dark/foreground-colored band (e.g. a closing CTA), where the normal
        // primary/outline variants would not contrast. Ring offset flips to the dark surface.
        inverse:
          'bg-background text-foreground hover:bg-background/90 focus-visible:ring-background focus-visible:ring-offset-foreground',
        inverseOutline:
          'border border-background/30 text-background hover:bg-background/10 focus-visible:ring-background focus-visible:ring-offset-foreground',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
