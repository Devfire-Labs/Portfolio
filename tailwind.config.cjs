const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			serif: ['PT Serif', 'serif'],
		},
		extend: {
			animation: {
				'spin-slow': 'spin 7s linear infinite',
			},
		},
	},
	plugins: [],
};

module.exports = config;
