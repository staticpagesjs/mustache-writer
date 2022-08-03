import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import rimraf from 'rimraf';
import { mustacheWriter } from '../esm/index.js';

// cwd should be in tests folder where we provide a proper folder structure.
process.chdir(path.dirname(fileURLToPath(import.meta.url)));

// TODO: mock fs to provide a more stable environment for the tests?

afterEach(() => {
	rimraf.sync('dist');
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
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set output dir', async () => {
	const writer = mustacheWriter({
		outDir: 'dist',
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set outfile name via url', async () => {
	const writer = mustacheWriter({
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		url: 'my/output.file',
		body: 'foo',
	});

	const expectedPath = 'dist/my/output.file.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
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

	const expectedPath = 'dist/my/output.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set outfile name via outFile option', async () => {
	const writer = mustacheWriter({
		outFile: () => 'my/output.file',
		showdownEnabled: [
			'body',
		]
	});

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/my/output.file';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can turn off custom markdown filter', async () => {
	const writer = mustacheWriter();

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'hello world!foo';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
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
		url: 'unnamed',
		path: {
			to: {
				body: '# foo',
			},
		},
		alt: {
			stuff: 'bar',
		},
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = '<h2 id="foo">foo</h2><p>bar</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});
