import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBadgeProps {
    text: string;
    color?: string;
    href?: string;
    className?: string;
}

export default function AnimatedBadge({
    text,
    color = "#22d3ee",
    href,
    className,
}: AnimatedBadgeProps) {
    return (
        <a
            href={href}
            className={cn(
                "group relative inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-900",
                className
            )}
        >
            <div className="relative flex h-2 w-2 items-center justify-center">
                <div
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: color }}
                />
                <div
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>

            <span>{text}</span>

            <svg
                className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>

            {/* Light Streak Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
                <svg className="absolute left-0 top-0 h-full w-full">
                    <defs>
                        <radialGradient
                            id="badge-gradient"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(16 16) rotate(90) scale(16)"
                        >
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <mask id="badge-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="9999" fill="black" />
                        </mask>
                    </defs>
                    <circle
                        cx="0"
                        cy="0"
                        r="16"
                        fill="url(#badge-gradient)"
                        className="animate-spin-slow origin-center opacity-0 transition-opacity duration-500 group-hover:opacity-30"
                        style={{
                            animationDuration: '3s',
                            transformBox: 'fill-box',
                            transformOrigin: 'center'
                        }}
                    />
                </svg>
            </div>
        </a>
    );
}
