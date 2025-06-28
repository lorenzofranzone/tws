export default `@layer utilities {
    [data-layout] {
        [class*="-area"] {
            /* All sub *-area classes */

            &:has(>[class*="-area"]) {
                @apply subgrid-x;
            }

            >:not([class*="-area"]) {
                grid-column: var(--_area, c-main);
            }
        }
    }
}

/* Wide */
        
@utility wide-area {
    grid-column: c-full-width;
}

@utility wide-half-left-area {
    grid-column: c-full-width / center;
}

@utility wide-half-right-area {
    grid-column: center / c-full-width-end;
}

/* Container */

@utility container-area {
    grid-column: c-container;
}

@utility container-wide-left-area {
    grid-column: c-full-width / c-container-end;
}

@utility container-wide-right-area {
    grid-column: c-container / c-full-width-end;
}

@utility container-half-left-area {
    grid-column: c-container / center;
}

@utility container-half-right-area {
    grid-column: center / c-container;
}

@utility container-third-left-area {
    @media (min-width: theme('screens.tx')) {
        grid-column: c-container / span 2;
    }

    @media (min-width: theme('screens.d')) {
        grid-column: c-container / span 4;
    }
}

@utility container-two-third-right-area {
    @media (min-width: theme('screens.tx')) {
        grid-column: span 4;
    }

    @media (min-width: theme('screens.d')) {
        grid-column: span 8;
    }
}

@utility container-two-third-left-area {
    @media (min-width: theme('screens.tx')) {
        grid-column: c-container / span 4;
    }

    @media (min-width: theme('screens.d')) {
        grid-column: c-container / span 8;
    }
}

@utility container-third-right-area {
    @media (min-width: theme('screens.tx')) {
        grid-column: span 2;
    }

    @media (min-width: theme('screens.d')) {
        grid-column: span 4;
    }
}

/* Main */

@utility main-area {
    grid-column: c-main;
}

@utility half-left-area {
    grid-column: c-main / center;
}

@utility half-right-area {
    grid-column: center / c-main;
}

/* Aside */

@utility aside-left-area {
    grid-column: c-aside-left;
}

@utility aside-right-area {
    grid-column: c-aside-right;
}

/* Margin */

@utility margin-left-area {
    grid-column: c-full-width / c-container-start;
}

@utility margin-right-area {
    grid-column: c-container-end / c-full-width-end;
}`