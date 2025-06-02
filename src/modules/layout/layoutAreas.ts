export default `/* Wide */

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
}

@layer utilities {
    [data-layout] {
        /* Wide */

        .wide-area {
            @apply wide-area;
        }

        .wide-half-left-area {
            @apply wide-half-left-area;
        }

        .wide-half-right-area {
            @apply wide-half-right-area;
        }

        /* Container */

        .container-area {
            @apply container-area;
        }

        .container-wide-left-area {
            @apply container-wide-left-area;
        }

        .container-wide-right-area {
            @apply container-wide-right-area;
        }

        /* Main */

        .main-area {
            @apply main-area;
        }

        .half-left-area {
            @apply half-left-area;
        }

        .half-right-area {
            @apply half-right-area;
        }

        /* Aside */

        .aside-left-area {
            @apply aside-left-area;
        }

        .aside-right-area {
            @apply aside-right-area;
        }

        /* Margin */

        .margin-left-area {
            @apply margin-left-area;
        }

        .margin-right-area {
            @apply margin-right-area;
        }
    }
}`