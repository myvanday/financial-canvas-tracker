
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#01362e',  // Dark green as primary button color
					light: '#95e362',    // Light green
					foreground: '#ffffff' // White text on primary
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                finance: {
                    'money': '#B4E4A5',        // Pastel green for Money
                    'savings': '#A9D6E5',      // Pastel blue for Savings
                    'investments': '#FFD59E',  // Pastel orange for Investments
                    'physical': '#E6B8FF',     // Pastel purple for Physical Assets
                    'dark-green': '#01362e',   // Dark green for buttons
                    'light-green': '#95e362',  // Light green accent
                    'light-gray': '#F4F4F6',   // Light gray
                    'gray': '#A8AAA6',         // Gray
                    'positive': '#34A853',     // For positive growth
                    'negative': '#EA4335',     // For negative growth
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in': {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in': 'slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
			},
            backgroundImage: {
                'gradient-money': 'linear-gradient(135deg, #D1F0C2 0%, #B4E4A5 100%)',
                'gradient-savings': 'linear-gradient(135deg, #C1E3F0 0%, #A9D6E5 100%)',
                'gradient-investments': 'linear-gradient(135deg, #FFE9BE 0%, #FFD59E 100%)',
                'gradient-physical': 'linear-gradient(135deg, #F2D5FF 0%, #E6B8FF 100%)',
                'gradient-primary': 'linear-gradient(135deg, #01362e 0%, #0A5043 100%)',
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
