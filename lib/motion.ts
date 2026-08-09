/** Shared motion language for abhi os — one easing curve for the whole system. */
export const OS_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Standard panel/window transition (open, close, minimize, restore). */
export const OS_TRANSITION = { duration: 0.22, ease: OS_EASE };

/** Lightweight dropdown/popover transition. */
export const OS_MENU_TRANSITION = { duration: 0.18, ease: OS_EASE };
