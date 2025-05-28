export default `@layer base {
    html,
    body {
        height: 100%;
        overflow-x: hidden;
    }
}

@layer utilities {
    [data-layout] {
        min-height: 100dvh;
        display: grid;
        grid-template-rows: var(--_rows);
        grid-template-columns: var(--_cols);
        column-gap: var(--layout-gap-x);
        grid-auto-rows: auto;
        align-items: start;
        align-content: start;

        /* Base Layout */

        &:has(:not([id*="aside"])) {
            --_rows: [r-header] auto [r-main] 1fr [r-footer] auto;
            @apply grid-layout-columns;
        }

        /* Sidebar left */

        &:has(#aside-left):not(#aside-right) {
            --_rows: [r-header] auto [r-aside-left] auto [r-main] 1fr [r-footer] auto;
            --_cols: [c-full-width-start] var(--layout-extra-margin-width) [c-container-start c-main-start c-aside-left-start]
                repeat(var(--layout-main-columns-half-count), minmax(0, 1fr)) [c-center]
                repeat(var(--layout-main-columns-half-count), minmax(0, 1fr)) [c-container-end c-main-end c-aside-left-end]
                var(--layout-extra-margin-width) [c-full-width-end];

            @media (min-width: theme('screens.d')) {
                --_rows: [r-header] auto [r-main r-aside-left] 1fr [r-footer] auto;
                --_cols: [c-full-width-start] minmax(0, 1fr) [c-container-start c-aside-left-start]
                    repeat(var(--layout-single-aside-columns-count), minmax(0, var(--layout-column-width)))
                    [c-aside-left-end c-main-start]
                    repeat(var(--layout-main-columns-half-count), minmax(0, var(--layout-column-width)))
                    [c-center]
                    repeat(var(--layout-main-columns-half-count), minmax(0, var(--layout-column-width)))
                    [c-main-end c-container-end]
                    minmax(0, 1fr) [c-full-width-end];
            }
        }

        /* Sidebar right */

        &:has(#aside-right):not(#aside-left) {
            --_rows: [r-header] auto [r-main] auto [r-aside-right] 1fr [r-footer] auto;
            --_cols: [c-full-width-start] var(--layout-extra-margin-width) [c-container-start c-main-start c-aside-right-start]
                repeat(var(--layout-main-columns-half-count), minmax(0.5rem, 1fr)) [c-center]
                repeat(var(--layout-main-columns-half-count), minmax(0, 1fr)) [c-container-end c-main-end c-aside-right-end]
                var(--layout-extra-margin-width) [c-full-width-end];

            @media (min-width: theme('screens.d')) {
                --_rows: [r-header] auto [r-main r-aside-right] 1fr [r-footer] auto;
                --_cols: [c-full-width-start] minmax(0, 1fr) [c-container-start c-main-start]
                    repeat(var(--layout-main-columns-half-count), minmax(0, var(--layout-column-width)))
                    [c-center]
                    repeat(var(--layout-main-columns-half-count), minmax(0, var(--layout-column-width))) [c-main-end
                    c-aside-right-start]
                    repeat(var(--layout-single-aside-columns-count), minmax(0, var(--layout-column-width)))
                    [c-aside-right-end c-container-end] minmax(0, 1fr) [c-full-width-end];
            }
        }

        /* Sidebar left and right */

        &:has(#aside-left):has(#aside-right) {
            --_rows: [r-header] auto [r-aside-left] auto [r-main] auto [r-aside-right] 1fr [r-footer] auto;
            --_cols: [c-full-width-start] var(--layout-extra-margin-width) [c-container-start c-main-start c-aside-left-start
                c-aside-right-start] repeat(var(--layout-main-columns-half-count), minmax(0, 1fr)) [c-center]
                repeat(var(--layout-main-columns-half-count), minmax(0, 1fr)) [c-container-end c-main-end c-aside-left-end
                c-aside-right-end] var(--layout-extra-margin-width) [c-full-width-end];

            @media (min-width: theme('screens.d')) {
                --_rows: [r-header] auto [r-main r-aside-left r-aside-right] 1fr [r-footer] auto;
                --_cols: [c-full-width-start] minmax(0, 1fr) [c-container-start c-aside-left-start]
                    repeat(var(--layout-aside-left-columns-count), minmax(0, var(--layout-column-width)))
                    [c-aside-left-end c-main-start]
                    repeat(var(--layout-main-columns-half-count-with-2-aside), minmax(0, var(--layout-column-width)))
                    [c-center]
                    repeat(var(--layout-main-columns-half-count-with-2-aside), minmax(0, var(--layout-column-width)))
                    [c-main-end
                    c-aside-right-start]
                    repeat(var(--layout-aside-right-columns-count), minmax(0, var(--layout-column-width)))
                    [c-aside-right-end c-container-end] minmax(0, 1fr) [c-full-width-end];
            }
        }
    }
}`