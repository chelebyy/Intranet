import React from 'react';
import { cn } from '@/lib/utils';

interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The content to be wrapped by the glow border
     */
    children: React.ReactNode;
    /**
     * First color of the glow gradient
     * @default "#06b6d4" (cyan-500)
     */
    color1?: string;
    /**
     * Second color of the glow gradient
     * @default "#ef4444" (red-500)
     */
    color2?: string;
    /**
     * Duration of the rotation animation in seconds
     * @default 2
     */
    duration?: number;
    /**
     * Border radius class for the container
     * @default "rounded-lg"
     */
    borderRadius?: string;
}

export function GlowBorder({
    children,
    className,
    color1 = "#06b6d4",
    color2 = "#ef4444",
    duration = 2,
    borderRadius = "rounded-lg",
    ...props
}: Readonly<GlowBorderProps>) {
    return (
        <div
            className={cn(
                "relative inline-block overflow-hidden p-[1px]",
                borderRadius,
                className
            )}
            {...props}
        >
            {/* Gradient Layer 1 */}
            <div
                className="absolute inset-[-1000%] animate-[spin_linear_infinite]"
                style={{
                    animationDuration: `${duration}s`,
                    background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${color1} 50%, transparent 100%)`
                }}
            />

            {/* Gradient Layer 2 (Delayed) */}
            <div
                className="absolute inset-[-1000%] animate-[spin_linear_infinite]"
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `-${duration / 2}s`,
                    background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${color2} 50%, transparent 100%)`
                }}
            />

            {/* Content Container */}
            <div className={cn(
                "relative z-20 h-full w-full bg-white dark:bg-slate-900",
                // Adjust inner border radius to match outer container minus padding
                // This is an approximation, usually inheriting or using slightly smaller radius works best
                "rounded-[inherit]"
            )}>
                {children}
            </div>
        </div>
    );
}
