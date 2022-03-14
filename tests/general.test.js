const fs = require('fs');
jest.spyOn(fs, 'writeFileSync').mockImplementation();
jest.spyOn(fs, 'mkdirSync').mockImplementation();

const path = require('path');
const mustacheWriter = require('../cjs/index').default;

process.chdir(__dirname); // cwd should be in tests folder where we provide a proper folder structure.
// TODO: mock fs to provide a more stable environment for the tests?

afterEach(() => {
	jest.clearAllMocks();
});

test('can initialize a writer with default parameters', async () => {
	const writer = mustacheWriter();
	expect(writer).toBeDefined();
});

test('can render a simple template', async () => {
	const writer = mustacheWriter({
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set output dir', async () => {
	const writer = mustacheWriter({
		outDir: 'dist',
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('dist/unnamed-1.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via output.path', async () => {
	const writer = mustacheWriter({
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		output: {
			path: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.file');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via output.url', async () => {
	const writer = mustacheWriter({
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		output: {
			url: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.file.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via header.path', async () => {
	const writer = mustacheWriter({
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		header: {
			path: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via outFile option', async () => {
	const writer = mustacheWriter({
		outFile: () => 'my/output.file',
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.file');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can turn off custom markdown filter', async () => {
	const writer = mustacheWriter();

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'hello world!foo';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can configure showdown', async () => {
	const writer = mustacheWriter({
		view: 'showdown.mustache',
		showdownEnabled: [
			'path.to.body',
			'alt.stuff',
		],
		showdownOptions: {
			headerLevelStart: 2
		}
	});

	await writer({
		path: {
			to: {
				body: '# foo',
			},
		},
		alt: {
			stuff: 'bar',
		},
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = '<h2 id="foo">foo</h2><p>bar</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});
