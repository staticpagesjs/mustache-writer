const fs = require('fs');
jest.spyOn(fs, 'writeFileSync').mockImplementation();
jest.spyOn(fs, 'mkdirSync').mockImplementation();

const path = require('path');
const mustacheWriter = require('../cjs/index').cli;

process.chdir(__dirname); // cwd should be in tests folder where we provide a proper folder structure.
// TODO: mock fs to provide a more stable environment for the tests?

afterEach(() => {
	jest.clearAllMocks();
});

test('cli: can initialize a writer with default parameters', async () => {
	const writer = await mustacheWriter();
	expect(writer).toBeDefined();
});

test('cli: can render a simple template', async () => {
	const writer = await mustacheWriter({
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

test('cli: can set output dir', async () => {
	const writer = await mustacheWriter({
		showdownEnabled: [
			'body',
		],
		outDir: 'dist'
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('dist/unnamed-1.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('cli: can set outfile name via output.path', async () => {
	const writer = await mustacheWriter({
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

test('cli: can set outfile name via output.url', async () => {
	const writer = await mustacheWriter({
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

test('cli: can set outfile name via header.path', async () => {
	const writer = await mustacheWriter({
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

test('cli: can set outfile name via outFile option', async () => {
	const writer = await mustacheWriter({
		outFile: '() => "my/output.file"',
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

test('cli: can turn off custom markdown filter', async () => {
	const writer = mustacheWriter();

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'hello world!foo';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('cli: can configure showdown', async () => {
	const writer = await mustacheWriter({
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
