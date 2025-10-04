/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/styles/*.css"],
	theme: {
		extend: {
			colors: {
				/** Shadcn UI */
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))"
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))"
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))"
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))"
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))"
				},

				/** Original */
				primary: {
					DEFAULT: "hsl(var(--primary))",
					accent: "hsl(var(--primary-accent))",
					"accent-hover": "hsl(var(--primary-accent-hover))",
					fg: "hsl(var(--primary-fg))",
					bg: "hsl(var(--primary-bg))",
					border: "hsl(var(--primary-border))",
					"bg-hover": "hsl(var(--primary-bg-hover))",
					hover: "hsl(var(--primary-hover))",

					//shadcn fallback
					foreground: "hsl(var(--primary-foreground))"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					accent: "hsl(var(--secondary-accent))",
					fg: "hsl(var(--secondary-fg))",
					bg: "hsl(var(--secondary-bg))",
					border: "hsl(var(--secondary-border))",
					"bg-hover": "hsl(var(--secondary-bg-hover))",
					hover: "hsl(var(--secondary-hover))",

					//shadcn fallback
					foreground: "hsl(var(--secondary-foreground))"
				},
				tertiary: {
					accent: "hsl(var(--tertiary-accent))"
				},
				inverse: {
					"primary-bg": "hsl(var(--inverse-primary-bg))",
					"secondary-bg": "hsl(var(--inverse-secondary-bg))",
					hover: "hsl(var(--inverse-hover))",
					active: "hsl(var(--inverse-active))",
					border: "hsl(var(--inverse-border))",
					muted: "hsl(var(--inverse-muted))",
					"secondary-fg": "hsl(var(--inverse-secondary-fg))",
					"primary-fg": "hsl(var(--inverse-primary-fg))"
				},
				status: {
					neutral: {
						DEFAULT: "hsl(var(--status-default))",
						hover: "hsl(var(--status-default-hover))",
						border:"hsl(var(--status-default-border))",
						muted: "hsl(var(--status-default-muted))",
						bg: "hsl(var(--status-default-bg))",
						"bg-hover": "hsl(var(--status-default-bg-hover))",
						fg: "hsl(var(--status-default-fg))"
					},
					info: {
						DEFAULT: "hsl(var(--status-info))",
						bg: "hsl(var(--status-info-bg))",
						"bg-hover": "hsl(var(--status-info-bg-hover))",
						border: "hsl(var(--status-info-border))",
						hover: "hsl(var(--status-info-hover))"
					},
					success: {
						DEFAULT: "hsl(var(--status-success))",
						bg: "hsl(var(--status-success-bg))",
						"bg-hover": "hsl(var(--status-success-bg-hover))",
						border: "hsl(var(--status-success-border))",
						hover: "hsl(var(--status-success-hover))"
					},
					warning: {
						DEFAULT: "hsl(var(--status-warning))",
						bg: "hsl(var(--status-warning-bg))",
						"bg-hover": "hsl(var(--status-warning-bg-hover))",
						border: "hsl(var(--status-warning-border))",
						hover: "hsl(var(--status-warning-hover))"
					},
					error: {
						DEFAULT: "hsl(var(--status-error))",
						bg: "hsl(var(--status-error-bg))",
						"bg-hover": "hsl(var(--status-error-bg-hover))",
						border: "hsl(var(--status-error-border))",
						"primary-border": "hsl(var(--status-error-primary-border))",
						"secondary-border": "hsl(var(--status-error-secondary-border))",
						hover: "hsl(var(--status-error-hover))"
					}
				},
				alpha: {
					10: "hsl(var(--alpha-90))",
					20: "hsl(var(--alpha-80))",
					30: "hsl(var(--alpha-70))",
					40: "hsl(var(--alpha-60))",
					50: "hsl(var(--alpha-50))",
					60: "hsl(var(--alpha-50))",
					70: "hsl(var(--alpha-30))",
					80: "hsl(var(--alpha-20))",
					90: "hsl(var(--alpha-10))",
					92: "hsl(var(--alpha-08))",
					95: "hsl(var(--alpha-05))",
					97: "hsl(var(--alpha-03))"
				},
				"alpha-high": {
					10: "hsl(var(--alpha-high-90))",
					20: "hsl(var(--alpha-high-80))",
					30: "hsl(var(--alpha-high-70))",
					40: "hsl(var(--alpha-high-60))",
					50: "hsl(var(--alpha-high-50))",
					60: "hsl(var(--alpha-high-50))",
					70: "hsl(var(--alpha-high-30))",
					80: "hsl(var(--alpha-high-20))",
					90: "hsl(var(--alpha-high-10))",
					92: "hsl(var(--alpha-high-08))",
					95: "hsl(var(--alpha-high-05))",
					97: "hsl(var(--alpha-high-03))"
				},

				shadow: {
					scroll: "hsl(222, 47%, 11%)"
				}
			},
			borderRadius: {
				lg: "var(--radius)" /** 8px */,
				md: "calc(var(--radius) - 2px)" /** 6px */,
				sm: "calc(var(--radius) - 4px)" /** 4px */,
				xs: "calc(var(--radius) - 6px)" /** 2px */
			},
			boxShadow: {
				base: "0px 1px 3px 0px rgba(15, 23, 42, 0.10), 0px 1px 2px 0px rgba(15, 23, 42, 0.06)",
				sm: "0px 1px 2px 0px rgba(15, 23, 42, 0.05)",
				md: "0px 4px 6px -1px rgba(15, 23, 42, 0.10), 0px 2px 4px -1px rgba(15, 23, 42, 0.06)",
				lg: "0px 10px 15px -3px rgba(15, 23, 42, 0.10), 0px 4px 6px -2px rgba(15, 23, 42, 0.05)",
				focus: "0px 0px 0px 1px hsl(var(--primary-bg)), 0px 0px 0px 2px hsl(var(--muted))",
				"focus-error": "0px 0px 0px 1px hsl(var(--status-error))",
				"soft-base": '0 2px 4px 0 rgba(15, 23, 42, 0.12), 0 1px 2px -1px rgba(15, 23, 42, 0.12)',
				"hard-sm": "0 1px 3px 0 rgba(2, 6, 23, 0.40), 0 0 0.5px 0 rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 rgba(255, 255, 255, 0.10) inset, 0 0 0.5px 0 rgba(2, 6, 23, 0.50)",
				"hard-base":
					"0 1px 3px 0 rgba(2, 6, 23, 0.50), 0 0 0.5px 0 rgba(255, 255, 255, 0.30) inset, 0 3px 8px 0 rgba(2, 6, 23, 0.35), 0 0.5px 0 0 rgba(255, 255, 255, 0.08) inset"
			},
			lineHeight: {
				none: "100%",
				11: "2.75rem",
				12: "3.75rem",
				13: "4.5rem",
				14: "5.5rem"
			},
			fontSize: {
				"2xs": ["0.5rem", { lineHeight: "0.5rem" }],
				base: [
					"1rem",
					{
						lineHeight: "1.375rem"
					}
				],
				lg: [
					"1.125rem",
					{
						lineHeight: "1.5rem"
					}
				],
				"4xl": [
					"2.25rem",
					{
						lineHeight: "2.75rem",
						letterSpacing: "-0.02em"
					}
				],
				"5xl": [
					"3rem",
					{
						lineHeight: "3.75rem",
						letterSpacing: "-0.02em"
					}
				],
				"6xl": [
					"3.75rem",
					{
						lineHeight: "4.5rem",
						letterSpacing: "-0.02em"
					}
				],
				"7xl": [
					"4.5rem",
					{
						lineHeight: "5.5rem",
						letterSpacing: "-0.02em"
					}
				]
			},
			fontFamily: {
				sans: ["InterVariable", "Inter", "sans-serif"]
			},
			animation: {
				"indeterminate-bar": "indeterminate-bar 1.5s cubic-bezier(.65,.815,.735,.395) infinite"
			},
			keyframes: {
				"indeterminate-bar": {
					"0%": {
						transform: "translate(-50%) scaleX(.2)"
					},
					"100%": {
						transform: "translate(100%) scaleX(1)"
					}
				}
			},
			screens: {
				touch: { raw: "(pointer: coarse)" }
			},
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': 'hsl(var(--primary-fg))',
						'--tw-prose-headings': 'hsl(var(--primary-fg))',
						'--tw-prose-lead': 'hsl(var(--primary-fg))',
						'--tw-prose-links': 'hsl(var(--primary-fg))',
						'--tw-prose-bold': 'hsl(var(--primary-fg))',
						'--tw-prose-counters': 'hsl(var(--primary-fg))',
						'--tw-prose-bullets': 'hsl(var(--primary-fg))',
						'--tw-prose-hr': 'hsl(var(--secondary-border))',
						'--tw-prose-quotes': 'hsl(var(--primary-fg))',
						'--tw-prose-quote-borders': 'hsl(var(--secondary-border))',
						'--tw-prose-captions': 'hsl(var(--primary-fg))',
						'--tw-prose-code': 'hsl(var(--primary-fg))',
						'--tw-prose-pre-code': 'hsl(var(--primary-bg))',
						'--tw-prose-pre-bg': 'hsl(var(--primary-accent))',
						'--tw-prose-th-borders': 'hsl(var(--secondary-border))',
						'--tw-prose-td-borders': 'hsl(var(--secondary-border))',
						a: {
							textUnderlineOffset: '24%'
						},
						abbr: {
							textUnderlineOffset: '24%'
						},
						ins: {
							textUnderlineOffset: '24%'
						},
						kbd: {
							color: 'hsl(var(--muted))',
							background: 'hsl(var(--secondary-bg))',
							border: '1px solid hsl(var(--secondary-border))',
							boxShadow: 'none',
							padding: '0.125rem 0.25rem',
						},
						figcaption: {
							fontStyle: 'italic'
						},
						ul: {
							marginTop: '1.25rem',
							marginLeft: '1.5rem'
						},
						ol: {
							marginTop: '1.25rem',
							marginLeft: '1.5rem'
						},
						code: {
							background: 'hsl(var(--secondary-bg-hover))',
							borderRadius: 'calc(var(--radius) - 4px)',
							padding: '0.2rem 0.3rem',
							fontWeight: '700',
							lineHeight: '1.25rem',
							fontFamily: 'Menlo',
							'&::before': {
								content: '""!important'
							},
							'&::after': {
								content: '""!important'
							}
						},
						pre: {
							border: '1px solid hsl(var(--secondary-border))'
						},
						blockquote: {
							paddingInlineStart: '1.5rem',
						},
						table: {
							marginTop: '1.25rem !important',
							marginBottom: '1.25rem',
							borderCollapse: 'collapse',
							border: '1px solid hsl(var(--secondary-border))',
							'& tbody tr:nth-child(odd)': {
								backgroundColor: 'hsl(var(--secondary-bg-hover))'
							}
						},
						th: {
							border: '1px solid hsl(var(--secondary-border))',
							padding: '0.5rem 1rem'
						},
						td: {
							border: '1px solid hsl(var(--secondary-border))',
							padding: '0.5rem 1rem'
						}
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
};
