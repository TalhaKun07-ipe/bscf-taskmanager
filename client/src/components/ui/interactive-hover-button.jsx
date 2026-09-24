import React from "react";
import { ArrowRightChunkyIcon } from "@/components/icons/CustomStyleIcons";
import { cn } from "@/lib/utils";

const InteractiveHoverButton = React.forwardRef(
  ({ text, children, className, ...props }, ref) => {
    const label = text || children || "Button";

    return (
      <button
        ref={ref}
        className={cn(
          "group relative min-w-24 sm:min-w-28 md:min-w-32 cursor-pointer overflow-hidden rounded-full border border-orange-500/30 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-center text-xs font-semibold text-zinc-900 shadow-2xs transition-all duration-300 hover:border-orange-500 hover:shadow-sm active:scale-95 shrink-0 select-none",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {label}
        </span>
        <div className="absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-1.5 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <span className="font-semibold">{label}</span>
          <ArrowRightChunkyIcon className="w-3.5 h-3.5 shrink-0" />
        </div>
        <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-orange-600 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2] group-hover:bg-orange-600"></div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
