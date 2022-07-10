import * as fs from 'fs';
import * as path from 'path';
import showdown from 'showdown';
import { render } from 'mustache';
import { fileWriter, FileWriterOptions } from '@static-pages/file-writer';

export type MustacheWriterOptions = {
	view?: string | { (data: Record<string, unknown>): string };
	viewsDir?: string | string[];
	showdownEnabled?: string[];
	showdownOptions?: showdown.ConverterOptions;
} & Omit<FileWriterOptions, 'renderer'>;

export const mustacheWriter = (options: MustacheWriterOptions = {}) => {
	const {
		view = 'main.mustache',
		viewsDir = 'views',
		showdownEnabled = [],
		showdownOptions = {},
		...rest
	} = options;

	if (typeof view !== 'string' && typeof view !== 'function')
		throw new Error('mustache-writer \'view\' option expects a string or a function.');

	if (typeof viewsDir !== 'string' && !(Array.isArray(viewsDir) && viewsDir.every(x => typeof x === 'string')))
		throw new Error('mustache-writer \'viewsDir\' option expects a string or string[].');

	if (!Array.isArray(showdownEnabled))
		throw new Error('mustache-writer \'showdownEnabled\' option expects an array of strings.');

	if (typeof showdownOptions !== 'object' || !showdownOptions)
		throw new Error('mustache-writer \'showdownOptions\' option expects an object.');

	// Provide a built-in markdown filter
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let applyMd = (x: Record<string, unknown>, _p: string[]): void => undefined;
	if (showdownEnabled) {
		const converter = new showdown.Converter({
			simpleLineBreaks: true,
			ghCompatibleHeaderId: true,
			customizedHeaderId: true,
			tables: true,
			...showdownOptions,
		});

		applyMd = (o: Record<string, unknown>, p: string[]) => {
			const nextKey = p.shift();
			if (
				typeof nextKey === 'undefined'
				|| typeof o !== 'object'
				|| !o
				|| !Object.hasOwnProperty.call(o, nextKey)
			) return;

			const nextVal = o[nextKey] as Record<string, unknown> | string;
			if (typeof nextVal === 'string') {
				o[nextKey] = converter.makeHtml(nextVal);
			} else if (typeof o === 'object' && o && Object.hasOwnProperty.call(o, nextKey)) {
				applyMd(nextVal, p);
			}
		};
	}

	const viewsDirArray = Array.isArray(viewsDir) ? viewsDir : [viewsDir];

	const writer = fileWriter({
		...rest,
		renderer: data => {
			const resolvedView = typeof view === 'function' ? view(data) : view;
			const viewDir = viewsDirArray.find(x => fs.existsSync(path.resolve(x, resolvedView)));
			if (typeof viewDir === 'undefined') {
				throw new Error(`mustache-writer failed to render template '${view}', no such file found in 'viewsDir'.`);
			}
			for (const objectPath of showdownEnabled) {
				applyMd(data, objectPath.split('.'));
			}
			return render(
				fs.readFileSync(path.resolve(viewDir, resolvedView), 'utf-8'),
				data
			);
		},
	});

	return (data: Record<string, unknown>): Promise<void> => writer(data);
};

export default mustacheWriter;
