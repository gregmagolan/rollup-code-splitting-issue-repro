export default [
	{
		input: ['src/main-a.js', 'src/main-b.js', 'src/main-c.js'],
		output: {
			dir: 'public',
			format: 'cjs',
		},
		experimentalCodeSplitting: true,
	}
];
