import React from 'react';

export function AppleMark({ className = '', size = 20, title = 'Apple' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 384 512"
            role="img"
            aria-label={title}
        >
            <path
                fill="currentColor"
                d="M318.7 268.6c-.3-57.2 46.7-84.6 48.8-85.9-26.6-38.8-68-44.2-82.6-44.8-35.2-3.6-68.6 20.7-86.4 20.7-17.8 0-45.5-20.2-74.8-19.7-38.5.6-74.1 22.4-93.9 56.8-40 69.4-10.2 172.2 28.7 228.5 19 27.6 41.6 58.6 71.3 57.5 28.6-1.1 39.4-18.5 73.9-18.5 34.5 0 44.2 18.5 74.5 17.9 30.8-.6 50.3-28 69.1-55.7 21.8-31.9 30.7-62.8 31-64.4-.7-.3-59.4-22.8-59.7-90.4zM259.7 93.7c15.7-19 26.3-45.4 23.4-71.7-22.6.9-49.9 15.1-66.1 34.1-14.5 16.7-27.2 43.4-23.8 69 25.2 2 50.7-12.8 66.5-31.4z"
            />
        </svg>
    );
}

export function AndroidMark({ className = '', size = 20, title = 'Android' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            role="img"
            aria-label={title}
        >
            <path
                fill="currentColor"
                d="M17.6 9.48l1.84-3.18a.5.5 0 10-.86-.5l-1.88 3.25A7.93 7.93 0 0012 7.5c-1.65 0-3.19.5-4.46 1.36L5.66 5.8a.5.5 0 10-.86.5l1.84 3.18A7.48 7.48 0 003 15.5V19a2 2 0 002 2h1v2a1 1 0 002 0v-2h8v2a1 1 0 002 0v-2h1a2 2 0 002-2v-3.5c0-2.35-1.07-4.47-2.8-6.02zM8.5 14a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z"
            />
        </svg>
    );
}

