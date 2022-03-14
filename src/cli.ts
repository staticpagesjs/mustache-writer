import { Script } from 'vm';
import { fileWriterOptionsFromCliParameters } from '@static-pages/file-writer';
import { mustacheWriter, MustacheWriterOptions } from './index.js';

const isFunctionLike = /^\s*(?:async)?\s*(?:\([a-zA-Z0-9_, ]*\)\s*=>|[a-zA-Z0-9_,]+\s*=>|function\s*\*?\s*[a-zA-Z0-9_,]*\s*\([a-zA-Z0-9_,]*\)\s*{)/;
const tryParseFunction = (value: string): string | { (data: Record<string, unknown>): string } => {
	if (isFunctionLike.test(value)) {
		return new Script(value).runInNewContext();
	}
	return value;
};

export const mustacheWriterOptionsFromCliParameters = (cliParams: Record<string, unknown> = {}) => {
	const { view, ...rest } = cliParams;
	const options = { ...rest } as MustacheWriterOptions;

	if (typeof view === 'string') {
		options.view = tryParseFunction(view);
	}

	return fileWriterOptionsFromCliParameters(options);
};

export const cli = (cliParams: Record<string, unknown> = {}) => mustacheWriter(mustacheWriterOptionsFromCliParameters(cliParams));
