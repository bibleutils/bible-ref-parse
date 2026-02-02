import { IAssertionData, IBookAssertionsData, ITestsData } from '../types';

function makeDefaultTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it("${caseName}", function() {\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}\n\t});`;
}

function makeBookRangesTestCase (caseName: string,  assertions: IAssertionData[]): string {
	return `it("${caseName}", function() {\n\t\tp.set_options({ book_alone_strategy: "full", book_range_strategy: "include" });\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}\n\t});`;
}

function makeHandleNextTestCase (caseName: string, assertions: IAssertionData[], lang: string): string {
	return `it("${caseName}", function() {\n\t\t${lang === 'it' ? 'p.set_options({ case_sensitive: "books" });' : ''}\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}\n\t\t${lang === 'it' ? 'p.set_options({ case_sensitive: "none" });' : ''}\n\t});`;
}

function makeFfTestCase (caseName: string, assertions: IAssertionData[], lang: string): string {
	return `it("${caseName}", function() {\n\t\t${lang === 'it' ? 'p.set_options({ case_sensitive: "books" });' : ''}\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}\n\t\t${lang === 'it' ? 'p.set_options({ case_sensitive: "none" });' : ''}\n\t});`;
}

function makeNonLatinDigitsTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it("${caseName}", function() {\n\t\tp.set_options({ non_latin_digits_strategy: "replace" });\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}\n\t});`;
}

function makeTransTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it("${caseName}", function() {\n\t\t${assertions.map(makeTransAssertion).join('\n\t\t')}\n\t});`;
}

function makeBoundaryTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it("${caseName}", function() {\n\t\tp.set_options({ book_alone_strategy: "full" });\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}\n\t});`;
}

function makeAssertion (assertion: IAssertionData): string {
	return `expect(p.parse(${assertion.input}).osis()).toEqual(${assertion.expected}, "parsing: ${assertion.input.replace(/"/g, "'")}")`;
}

function makeTransAssertion (assertion: IAssertionData): string {
	return `expect(p.parse(${assertion.input}).osis_and_translations()).toEqual(${assertion.expected})`;
}

function makeBookTestCase (bookData: IBookAssertionsData, lang: string): string {
	const { osis, assertions, nonApocryphalAssertions, hasNonLatinDigits } = bookData

	let testCase = `describe("Localized book ${osis} (${lang})", function() {\n\tlet p = {};\n\tbeforeEach(function() {\n\t\tp = new bcv_parser;\n\t\tp.set_options({ book_alone_strategy: "ignore", book_sequence_strategy: "ignore", osis_compaction_strategy: "bc", captive_end_digits_strategy: "delete" });\n\t\tp.include_apocrypha(true);\n\t});\n\n\tit("should handle book: ${osis} (${lang})", function() {\n\t\t${assertions.map(makeAssertion).join('\n\t\t')}`;

	if (nonApocryphalAssertions?.length > 0) {
		testCase += `\n\t\tp.include_apocrypha(false);\n\t\t${nonApocryphalAssertions.map(makeAssertion).join('\n\t\t')}`;
	}

	testCase += `\n\t});`;

	if (hasNonLatinDigits) {
		testCase += `\n\t${makeNonLatinDigitsTestCase(`should handle non-Latin digits in book: ${osis} (${lang})`, assertions)}`;
	}

	return testCase + `\n});`;
}

function makeBookTestCases (bookData: IBookAssertionsData[], lang: string): string {
	return bookData.map(data => makeBookTestCase(data, lang)).join('\n');
}

export function makeSpecTemplate (data: ITestsData): { bookTests: string, miscTests: string } {
	const { lang, assertions } = data
	const separateChaptersTest = lang === 'en'
		? `\tit("should handle a separate-chapters semicolon break (${lang})", function() {\n\t\tp.set_options({ consecutive_combination_strategy: "separate-chapters" });\n\t\texpect(p.parse("1 John 1:9-10; 1 John 2:1").osis_and_indices()).toEqual([\n\t\t\t{osis: "1John.1.9-1John.1.10", translations: [""], indices: [0, 13]},\n\t\t\t{osis: "1John.2.1", translations: [""], indices: [15, 25]}\n\t\t]);\n\t\texpect(p.parse("Exodus 24:12; 25:8, 9, 40.").osis_and_indices()).toEqual([\n\t\t\t{osis: "Exod.24.12", translations: [""], indices: [0, 12]},\n\t\t\t{osis: "Exod.25.8-Exod.25.9", translations: [""], indices: [14, 21]},\n\t\t\t{osis: "Exod.25.40", translations: [""], indices: [23, 25]}\n\t\t]);\n\t\texpect(p.parse("Exodus 9:1-6; 10:22, 23.").osis_and_indices()).toEqual([\n\t\t\t{osis: "Exod.9.1-Exod.9.6", translations: [""], indices: [0, 12]},\n\t\t\t{osis: "Exod.10.22-Exod.10.23", translations: [""], indices: [14, 23]}\n\t\t]);\n\t});\n`
		: "";

	const bookTests = makeBookTestCases(assertions.book, lang);
	const miscTests = `\t${makeDefaultTestCase(`should handle ranges (${lang})`, assertions.ranges)}
	${makeDefaultTestCase(`should handle chapters (${lang})`, assertions.chapters)}
	${makeDefaultTestCase(`should handle verses (${lang})`, assertions.verses)}
	${makeDefaultTestCase(`should handle 'and' (${lang})`, assertions.sequence)}
	${makeDefaultTestCase(`should handle titles (${lang})`, assertions.title)}
	${makeFfTestCase(`should handle 'ff' (${lang})`, assertions.ff, lang)}
	${assertions.next.length > 0 ? `${makeHandleNextTestCase(`should handle 'next' (${lang})`, assertions.next, lang)}`  : ''}
	${makeTransTestCase(`should handle translations (${lang})`, assertions.trans)}
	${assertions.bookRange.length > 0 ? `${makeBookRangesTestCase(`should handle book ranges (${lang})`, assertions.bookRange)}` : ''}
	${makeBoundaryTestCase(`should handle boundaries (${lang})`, assertions.boundary)}
${separateChaptersTest}`;

	return { bookTests, miscTests };
}

