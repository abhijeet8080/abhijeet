"use client";

import { AnimatePresence, motion } from "motion/react";
import { OS_MENU_TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MenuItem {
  label?: string;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
  action?: () => void;
}

interface MenuDropdownProps {
  isOpen: boolean;
  items: MenuItem[];
  className?: string;
}

export const MenuDropdown = ({
  isOpen,
  items,
  className,
}: MenuDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={OS_MENU_TRANSITION}
          className={cn(
            "absolute left-0 top-full z-50 mt-1 min-w-60 origin-top-left rounded-lg border border-white/10 bg-[#232326]/90 p-1 shadow-2xl backdrop-blur-2xl",
            className
          )}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={`divider-${i}`} className="mx-2 my-1 h-px bg-white/10" />
            ) : (
              <button
                key={`${item.label}-${i}`}
                disabled={item.disabled}
                onClick={item.action}
                className={cn(
                  "group flex w-full items-center justify-between gap-8 rounded-[5px] px-3 py-[3px] text-left text-[13px] select-none",
                  item.disabled
                    ? "cursor-default text-white/30"
                    : "cursor-default text-white/90 hover:bg-os-accent hover:text-white"
                )}
              >
                <span className="truncate">{item.label}</span>
                {item.shortcut && (
                  <span
                    className={cn(
                      "shrink-0 text-[12px]",
                      item.disabled
                        ? "text-white/25"
                        : "text-white/40 group-hover:text-white/80"
                    )}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuDropdown;