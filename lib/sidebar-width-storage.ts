export const SIDEBAR_WIDTH_STORAGE_KEY = "arc_sidebar_width_px"
export const SIDEBAR_WIDTH_MIN_PX = 200
export const SIDEBAR_WIDTH_MAX_PX = 560
export const SIDEBAR_WIDTH_DEFAULT_PX = 264
/** Applied on `document.documentElement` before paint + kept in sync when width changes. */
export const SIDEBAR_WIDTH_CSS_VAR = "--arc-sidebar-width"

export function clampSidebarWidthPx(width: number): number {
  return Math.min(
    SIDEBAR_WIDTH_MAX_PX,
    Math.max(SIDEBAR_WIDTH_MIN_PX, Math.round(width)),
  )
}

/**
 * Runs synchronously in <head> so the first paint uses the stored width (no flash).
 * Must match `clampSidebarWidthPx` / storage key above.
 */
export function getSidebarWidthBootstrapScript(): string {
  const key = JSON.stringify(SIDEBAR_WIDTH_STORAGE_KEY)
  const prop = JSON.stringify(SIDEBAR_WIDTH_CSS_VAR)
  return `(function(){try{var r=localStorage.getItem(${key});if(r==null)return;var n=parseInt(r,10);if(!isFinite(n))return;n=Math.min(${SIDEBAR_WIDTH_MAX_PX},Math.max(${SIDEBAR_WIDTH_MIN_PX},Math.round(n)));document.documentElement.style.setProperty(${prop},n+"px")}catch(e){}})();`
}
