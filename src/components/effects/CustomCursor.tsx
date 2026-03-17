'use client';

import { useEffect } from 'react';

export function CustomCursor() {
    useEffect(() => {
        // Apply custom cursor to all elements
        const style = document.createElement('style');
        style.innerHTML = `
      html, body, * {
        cursor: none !important;
      }
      a, button, [role="button"], input, select, textarea {
        cursor: none !important;
      }
      p, h1, h2, h3, h4, h5, h6, span {
        cursor: none !important;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return null;
}
