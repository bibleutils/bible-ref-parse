import { IAssertionData, IBookAssertionsData, ITestsData } from '../types';

function makeDefaultTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it "${caseName}", ->
		${assertions.map(makeAssertion).join('\n\t\t')}`;
}

function makeBookRangesTestCase (caseName: string,  assertions: IAssertionData[]): string {
	return `it "${caseName}", ->
		p.set_options {book_alone_strategy: "full", book_range_strategy: "include"}
		${assertions.map(makeAssertion).join('\n\t\t')}`;
}

function makeHandleNextTestCase (caseName: string, assertions: IAssertionData[], lang: string): string {
	return `it "${caseName}", ->${lang === 'it' ? '\n\t\tp.set_options {case_sensitive: "books"}' : ''}
		${assertions.map(makeAssertion).join(';\n\t\t') + ';'}${lang === 'it' ? '\n\t\tp.set_options {case_sensitive: "none"}' : ''}`;
}

function makeFfTestCase (caseName: string, assertions: IAssertionData[], lang: string): string {
	return `it "${caseName}", ->${lang === 'it' ? '\n\t\tp.set_options {case_sensitive: "books"}' : ''}
		${assertions.map(makeAssertion).join('\n\t\t')}${lang === 'it' ? '\n\t\tp.set_options {case_sensitive: "none"}' : ''}`;

}

function makeNonLatinDigitsTestCase (caseName: string, assertions: IAssertionData[], nonApocryphalAssertions: IAssertionData[]): string {
	return `it "${caseName}", ->
		p.set_options non_latin_digits_strategy: "replace"
		\`
		${assertions.map(makeAssertion).join('\n\t\t')}`;
}

function makeTransTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it "${caseName}", ->
		${assertions.map(makeTransAssertion).join('\n\t\t')}`;
}

function makeBoundaryTestCase (caseName: string, assertions: IAssertionData[]): string {
	return `it "${caseName}", ->
		p.set_options {book_alone_strategy: "full"}
		${assertions.map(makeAssertion).join('\n\t\t')}`;
}

function makeAssertion (assertion: IAssertionData): string {
	return `expect(p.parse(${assertion.input}).osis()).toEqual(${assertion.expected}, "parsing: ${assertion.input.replace(/"/g, "'")}")`;
}

function makeTransAssertion (assertion: IAssertionData): string {
	return `expect(p.parse(${assertion.input}).osis_and_translations()).toEqual ${assertion.expected}`;
}

function makeBookTestCase (bookData: IBookAssertionsData, lang: string): string {
	const { osis, assertions, nonApocryphalAssertions, hasNonLatinDigits } = bookData

	let testCase = `describe "Localized book ${osis} (${lang})", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: ${osis} (${lang})", ->
		\`
		${assertions.map(makeAssertion).join('\n\t\t')}`;

	if (hasNonLatinDigits) {
		testCase += '\n\t\t\`\n\t\ttrue\n\t' + makeNonLatinDigitsTestCase(`should handle non-Latin digits in book: ${osis} (${lang})`, assertions, nonApocryphalAssertions);
	}

	if (nonApocryphalAssertions?.length > 0) {
		testCase += `\n\t\tp.include_apocrypha(false)
		${nonApocryphalAssertions.map(makeAssertion).join('\n\t\t')}`;
	}

	return testCase + '\n\t\t`\n\t\ttrue'
}

function makeBookTestCases (bookData: IBookAssertionsData[], lang: string): string {
	return bookData.map(data => makeBookTestCase(data, lang)).join('\n')
}

export function makeSpecTemplate (data: ITestsData): { bookTests: string, miscTests: string } {
	console.dir(data, { depth: null });
	const { lang, assertions } = data

	const bookTests = makeBookTestCases(assertions.book, lang);
	const miscTests = `\t${makeDefaultTestCase(`should handle ranges (${lang})`, assertions.ranges)}
	${makeDefaultTestCase(`should handle chapters (${lang})`, assertions.chapters)}
	${makeDefaultTestCase(`should handle verses (${lang})`, assertions.verses)}
	${makeDefaultTestCase(`should handle 'and' (${lang})`, assertions.sequence)}
	${makeDefaultTestCase(`should handle titles (${lang})`, assertions.title)}
	${makeFfTestCase(`should handle 'ff' (${lang})`, assertions.ff, lang)}${assertions.next.length > 0 ? `\n\t${makeHandleNextTestCase(`should handle 'next' (${lang})`, assertions.next, lang)}`  : ''}
	${makeTransTestCase(`should handle translations (${lang})`, assertions.trans)}${assertions.bookRange.length > 0 ? `\n\t${makeBookRangesTestCase(`should handle book ranges (${lang})`, assertions.bookRange)}` : ''}
	${makeBoundaryTestCase(`should handle boundaries (${lang})`, assertions.boundary)}`;

	return { bookTests, miscTests };
}

