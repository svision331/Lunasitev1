'use client';

import { useEffect } from 'react';

export function CustomCursor() {
    useEffect(() => {
        // Apply custom cursor to all elements
        const style = document.createElement('style');
        style.innerHTML = `
      html, body, * {
        cursor: url('/images/ice-heart-cursor.png') 16 16, auto !important;
      }
      
      button, a, [role="button"] {
        cursor: url('/images/ice-heart-cursor.png') 16 16, pointer !important;
      }
      
      input, textarea {
        cursor: url('/images/ice-heart-cursor.png') 16 16, text !important;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return null;
}
