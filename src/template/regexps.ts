// @ts-nocheck
const heregex = (pattern: string) => {
	let out = "";
	let inClass = false;
	let escaped = false;
	for (let i = 0; i < pattern.length; i++) {
		const ch = pattern[i];
		if (escaped) {
			out += ch;
			escaped = false;
			continue;
		}
		if (ch === "\\") {
			out += ch;
			escaped = true;
			continue;
		}
		if (!inClass && ch === "[") {
			inClass = true;
			out += ch;
			continue;
		}
		if (inClass && ch === "]") {
			inClass = false;
			out += ch;
			continue;
		}
		if (!inClass && ch === "#") {
			while (i < pattern.length && pattern[i] !== "\n") {
				i += 1;
			}
			continue;
		}
		if (!inClass && /\s/.test(ch)) {
			continue;
		}
		out += ch;
	}
	return out;
};

bcv_parser.prototype.regexps.space = "[\\s\\xa0]";
bcv_parser.prototype.regexps.escaped_passage = RegExp(heregex(String.raw`
	(?:^ | $PRE_PASSAGE_ALLOWED_CHARACTERS )	# Beginning of string or not in the middle of a word or immediately following another book. Only count a book if it's part of a sequence: \`Matt5John3\` is OK, but not \`1Matt5John3\`
		(
			# Start inverted book/chapter (cb)
			(?:
				  (?: ch (?: apters? | a?pts?\.? | a?p?s?\.? )? \s*
					\d+ \s* (?: [\u2013\u2014\-] | through | thru | to) \s* \d+ \s*
					(?: from | of | in ) (?: \s+ the \s+ book \s+ of )?\s* )
				| (?: ch (?: apters? | a?pts?\.? | a?p?s?\.? )? \s*
					\d+ \s*
					(?: from | of | in ) (?: \s+ the \s+ book \s+ of )?\s* )
				| (?: \d+ (?: th | nd | st ) \s*
					ch (?: apter | a?pt\.? | a?p?\.? )? \s* #no plurals here since it's a single chapter
					(?: from | of | in ) (?: \s+ the \s+ book \s+ of )? \s* )
			)? # End inverted book/chapter (cb)
			\x1f(\d+)(?:/\d+)?\x1f		#book
				(?:
				    /\d+\x1f				#special Psalm chapters
				  | $VALID_CHARACTERS
				  | $TITLE (?! [a-z] )		#could be followed by a number
				  | $PASSAGE_COMPONENTS
				  | $AB (?! \w )			#a-e allows 1:1a
				  | $						#or the end of the string
				 )+
		)
`), "gi");
// These are the only valid ways to end a potential passage match. The closing parenthesis allows for fully capturing parentheses surrounding translations (ESV**)**. The last one, `[\d\x1f]` needs not to be +; otherwise `Gen5ff` becomes `\x1f0\x1f5ff`, and `adjust_regexp_end` matches the `\x1f5` and incorrectly dangles the ff.
bcv_parser.prototype.regexps.match_end_split = RegExp(heregex(String.raw`
	  \d \W* $TITLE
	| \d \W* $NEXT (?: [\s\xa0*]* \.)?
	| \d \W* $FF (?: [\s\xa0*]* \.)?
	| \d [\s\xa0*]* $AB (?! \w )
	| \x1e (?: [\s\xa0*]* [)\]\uff09] )? #ff09 is a full-width closing parenthesis
	| [\d\x1f]
`), "gi");
bcv_parser.prototype.regexps.control = /[\x1e\x1f]/g;
bcv_parser.prototype.regexps.pre_book = "$PRE_BOOK_ALLOWED_CHARACTERS";

bcv_parser.prototype.regexps.first = `$FIRST\\.?${bcv_parser.prototype.regexps.space}*`;
bcv_parser.prototype.regexps.second = `$SECOND\\.?${bcv_parser.prototype.regexps.space}*`;
bcv_parser.prototype.regexps.third = `$THIRD\\.?${bcv_parser.prototype.regexps.space}*`;
bcv_parser.prototype.regexps.range_and = `(?:[&\\u2013\\u2014-]|$AND|$TO)`;
bcv_parser.prototype.regexps.range_only = `(?:[\\u2013\\u2014-]|$TO)`;
// Each book regexp should return two parenthesized objects: an optional preliminary character and the book itself.
bcv_parser.prototype.regexps.get_books = function(include_apocrypha: boolean, case_sensitive: string) {
	const books = [
		{
			osis: ["Ps"],
			apocrypha: true,
			extra: "2",
			regexp: RegExp(`(\\b)(Ps151)(?=\\.1)`, "g") // Case-sensitive because we only want to match a valid OSIS.
		},
$BOOK_REGEXPS
	];
	// Short-circuit the look if we know we want all the books.
	if (include_apocrypha === true && case_sensitive === "none") {
		return books;
	}
	// Filter out books in the Apocrypha if we don't want them. `Array.map` isn't supported below IE9.
	const out = [];
	for (const book of books) {
		if (include_apocrypha === false && book.apocrypha != null && book.apocrypha === true) {
			continue;
		}
		if (case_sensitive === "books") {
			book.regexp = new RegExp(book.regexp.source, "g");
		}
		out.push(book);
	}
	return out;
};

// Default to not using the Apocrypha
bcv_parser.prototype.regexps.books = bcv_parser.prototype.regexps.get_books(false, "none");
