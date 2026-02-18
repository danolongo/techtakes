import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
    children: ReactNode;
    className?: string;
    gradientColor?: string;
}

export function MagicCard({ children, className, gradientColor = "#262626" }: MagicCardProps) {
    return (
        <div
            className={cn(
                "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 px-6 py-6 shadow-2xl backdrop-blur-md",
                className
            )}
        >
            <div className="relative z-10">{children}</div>
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${gradientColor}, transparent 40%)`,
                }}
            />
        </div>
    );
}
