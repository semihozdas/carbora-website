/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#00ff9d", // Neon Green
                "primary-hover": "#00e68e",
                "primary-glow": "rgba(0, 255, 157, 0.5)",
                "secondary": "#bc13fe", // Neon Purple
                "accent": "#00f3ff", // Cyan
                "background-dark": "#0a0a0c", // Ultra Dark
                "card-dark": "rgba(20, 20, 25, 0.7)", // Glass Dark
                "border-dark": "rgba(255, 255, 255, 0.1)",
                "text-muted": "#888899",
            },
            fontFamily: {
                "display": ["Orbitron", "sans-serif"],
                "body": ["Rajdhani", "sans-serif"],
                "sans": ["Rajdhani", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "1rem",
                "2xl": "1.5rem",
                "full": "9999px"
            },
            boxShadow: {
                'neon-green': '0 0 20px rgba(0, 255, 157, 0.3)',
                'neon-purple': '0 0 20px rgba(188, 19, 254, 0.3)',
                'neon-cyan': '0 0 20px rgba(0, 243, 255, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}