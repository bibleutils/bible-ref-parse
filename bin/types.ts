export enum Variable {
	FIRST = '$FIRST',
	SECOND = '$SECOND',
	THIRD = '$THIRD',
	FOURTH = '$FOURTH',
	FIFTH = '$FIFTH',
	GOSPEL = '$GOSPEL',
	AB = '$AB',
	AND = '$AND',
	CHAPTER = '$CHAPTER',
	FF = '$FF',
	NEXT = '$NEXT',
	TITLE = '$TITLE',
	TRANS = '$TRANS',
	TO = '$TO',
	VERSE = '$VERSE',
	UNICODE_BLOCK = '$UNICODE_BLOCK',
	COLLAPSE_COMBINING_CHARACTERS = '$COLLAPSE_COMBINING_CHARACTERS',
	BOUNDARY_CHARACTERS = '$BOUNDARY_CHARACTERS',
	ALLOWED_CHARACTERS = '$ALLOWED_CHARACTERS',
	PRE_BOOK = '$PRE_BOOK',
	POST_BOOK = '$POST_BOOK',
	PRE_BOOK_ALLOWED_CHARACTERS = '$PRE_BOOK_ALLOWED_CHARACTERS',
	POST_BOOK_ALLOWED_CHARACTERS = '$POST_BOOK_ALLOWED_CHARACTERS',
	PRE_PASSAGE_ALLOWED_CHARACTERS = '$PRE_PASSAGE_ALLOWED_CHARACTERS',
	LANG_ISOS = '$LANG_ISOS',
	LANG = '$LANG',
	FORCE_OSIS_ABBREV = '$FORCE_OSIS_ABBREV',
}

export type IInputDataVariables = {
	[Variable.FIRST]: string[];
	[Variable.SECOND]: string[];
	[Variable.THIRD]: string[];
	[Variable.FOURTH]: string[];
	[Variable.FIFTH]: string[];
	[Variable.GOSPEL]: string[];
	[Variable.AB]: string[];
	[Variable.AND]: string[];
	[Variable.CHAPTER]: string[];
	[Variable.FF]: string[];
	[Variable.NEXT]: string[];
	[Variable.TITLE]: string[];
	[Variable.TRANS]: string[];
	[Variable.TO]: string[];
	[Variable.VERSE]: string[];
	[Variable.UNICODE_BLOCK]: string[];
	[Variable.COLLAPSE_COMBINING_CHARACTERS]: boolean;
	[Variable.BOUNDARY_CHARACTERS]?: string[];
	[Variable.ALLOWED_CHARACTERS]: string[];
	[Variable.PRE_BOOK]: string[];
	[Variable.POST_BOOK]: string[];
	[Variable.PRE_BOOK_ALLOWED_CHARACTERS]: string[];
	[Variable.POST_BOOK_ALLOWED_CHARACTERS]: string[];
	[Variable.PRE_PASSAGE_ALLOWED_CHARACTERS]: string[];
	[Variable.LANG_ISOS]: string[];
	[Variable.FORCE_OSIS_ABBREV]: string[];
}

export type IBook = {
	osis: string;
	abbrevs: string[];
}

export type IData = {
	variables: Partial<IInputDataVariables>;
	books: IBook[];
	order: string[];
	preferredBookNames: IBook[];
}

export type Ref = {
	osis: string;
	apocrypha: boolean;
}

export type IAssertionData = {
	input: string;
	expected: any;
}

export type IBookAssertionsData = {
	osis: string;
	hasNonLatinDigits: boolean;
	assertions: IAssertionData[];
	nonApocryphalAssertions: IAssertionData[];
}

export type ITestsData = {
	lang: string;
	assertions: {
		book: IBookAssertionsData[];
		ranges: IAssertionData[];
		chapters: IAssertionData[];
		verses: IAssertionData[];
		sequence: IAssertionData[];
		title: IAssertionData[];
		ff: IAssertionData[];
		next: IAssertionData[];
		trans: IAssertionData[];
		bookRange: IAssertionData[];
		boundary: IAssertionData[];
	},
}

export type ITestCaseOptions = {
	includeApocrypha: boolean;
}
