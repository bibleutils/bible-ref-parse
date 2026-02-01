// @ts-nocheck
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// This class takes a string and identifies Bible passage references in that string. It's designed to handle how people actually type Bible passages and tries fairly hard to make sense of dubious possibilities.
//
// The aggressiveness is tunable, to a certain extent, using the below `options`. It's probably too aggressive for general text parsing (the "is 2" in "There is 2 much" becomes "Isa.2", for example).

// Export to whatever the current context is.
const root = this as any;

class bcv_parser {
	static initClass() {
		this.prototype.s = "";
		this.prototype.entities = [];
		this.prototype.passage = null;
		this.prototype.regexps = {};
		// ## Main Options
		this.prototype.options = {
			// ### OSIS Output
			// * `combine`:  "Matt 5, 6, 7" -> "Matt.5-Matt.7".
			// * `separate`: "Matt 5, 6, 7" -> "Matt.5,Matt.6,Matt.7".
			consecutive_combination_strategy: "combine",
			// * `b`: OSIS refs get reduced to the shortest possible. "Gen.1.1-Gen.50.26" and "Gen.1-Gen.50" -> "Gen", while "Gen.1.1-Gen.2.25" -> "Gen.1-Gen.2".
			// * `bc`: OSIS refs get reduced to complete chapters if possible, but not whole books. "Gen.1.1-Gen.50.26" -> "Gen.1-Gen.50".
			// * `bcv`: OSIS refs always include the full book, chapter, and verse. "Gen.1" -> "Gen.1.1-Gen.1.31".
			osis_compaction_strategy: "b",
	
			// ### Sequence
			// * `ignore`: ignore any books on their own in sequences ("Gen Is 1" -> "Isa.1").
			// * `include`: any books that appear on their own get parsed according to `book_alone_strategy` ("Gen Is 1" means "Gen.1-Gen.50,Isa.1" if `book_alone_strategy` is `full` or `ignore`, or "Gen.1,Isa.1" if it's `first_chapter`).
			book_sequence_strategy: "ignore",
			// * `ignore`: "Matt 99, Gen 1" sequence index starts at the valid `Gen 1`.
			// * `include`: "Matt 99, Gen 1" sequence index starts at the invalid `Matt 99`.
			invalid_sequence_strategy: "ignore",
			// * `combine`: sequential references in the text are combined into a single comma-separated OSIS string: "Gen 1, 3" → `"Gen.1,Gen.3"`.
			// * `separate`: sequential references in the text are separated into an array of their component parts: "Gen 1, 3" → `["Gen.1", "Gen.3"]`.
			sequence_combination_strategy: "combine",
			// * `us`: commas separate sequences, periods separate chapters and verses. "Matt 1, 2. 4" → "Matt.1,Matt.2.4".
			// * `eu`: periods separate sequences, commas separate chapters and verses. "Matt 1, 2. 4" → "Matt.1.2,Matt.1.4".
			punctuation_strategy: "us",
	
			// ### Potentially Invalid Input
			// * `ignore`: Include only valid passages in `parsed_entities()`.
			// * `include`: Include invalid passages in `parsed_entities()` (they still don't have OSIS values).
			invalid_passage_strategy: "ignore",
			// * `ignore`: treat non-Latin digits the same as any other character.
			// * `replace`: replace non-Latin (0-9) numeric digits with Latin digits. This replacement occurs before any book substitution.
			non_latin_digits_strategy: "ignore",
			// * Include `b` in the string to validate book order ("Revelation to Genesis" is invalid).
			// * Include `c` in the string to validate chapter existence. If omitted, strings like "Genesis 51" (which doesn't exist) return as valid. Omitting `c` means that looking up full books will return `999` as the end chapter: "Genesis to Exodus" → "Gen.1-Exod.999".
			// * Include `v` in the string to validate verse existence. If omitted, strings like `Genesis 1:100` (which doesn't exist) return as valid. Omitting `v` means that looking up full chapters will return `999` as the end verse: "Genesis 1:2 to chapter 3" → "Gen.1.2-Gen.3.999".
			// * Tested values are `b`, `bc`, `bcv`, `bv`, `c`, `cv`, `v`, and `none`. In all cases, single-chapter books still respond as single-chapter books to allow treating strings like `Obadiah 2` as `Obad.1.2`.
			passage_existence_strategy: "bcv",
			// * `error`: zero chapters ("Matthew 0") are invalid.
			// * `upgrade`: zero chapters are upgraded to 1: "Matthew 0" -> "Matt.1".
			// Unlike `zero_verse_strategy`, chapter 0 isn't allowed.
			zero_chapter_strategy: "error",
			// * `error`: zero verses ("Matthew 5:0") are invalid.
			// * `upgrade`: zero verses are upgraded to 1: "Matthew 5:0" -> "Matt.5.1".
			// * `allow`: zero verses are kept as-is: "Matthew 5:0" -> "Matt.5.0". Some traditions use 0 for Psalm titles.
			zero_verse_strategy: "error",
			// * `chapter`: treat "Jude 1" as referring to the complete book of Jude: `Jude.1`. People almost always want this output when they enter this text in a search box.
			// * `verse`: treat "Jude 1" as referring to the first verse in Jude: `Jude.1.1`. If you're parsing specialized text that follows a style guide, you may want to set this option.
			single_chapter_1_strategy: "chapter",
	
			// ### Context
			// * `ignore`: any books that appear on their own don't get parsed as books ("Gen saw" doesn't trigger a match, but "Gen 1" does).
			// * `full`: any books that appear on their own get parsed as the complete book ("Gen" means "Gen.1-Gen.50").
			// * `first_chapter`: any books that appear on their own get parsed as the first chapter ("Gen" means "Gen.1").
			book_alone_strategy: "ignore",
			// * `ignore`: any books that appear on their own in a range are ignored ("Matt-Mark 2" means "Mark.2").
			// * `include`: any books that appear on their own in a range are included as part of the range ("Matt-Mark 2" means "Matt.1-Mark.2", while "Matt 2-Mark" means "Matt.2-Mark.16").
			book_range_strategy: "ignore",
			// * `delete`: remove any digits at the end of a sequence that are preceded by spaces and immediately followed by a `\w`: "Matt 5 1Hi" -> "Matt.5". This is better for text extraction.
			// * `include`: keep any digits at the end of a sequence that are preceded by spaces and immediately followed by a `\w`: "Matt 5 1Hi" -> "Matt.5.1". This is better for query parsing.
			captive_end_digits_strategy: "delete",
			// * `verse`: treat "Jer 33-11" as "Jer.33.11" (end before start) and "Heb 13-15" as "Heb.13.15" (end range too high).
			// * `sequence`: treat them as sequences.
			end_range_digits_strategy: "verse",
	
			// ### Apocrypha
			// Don't set this value directly; use the `include_apocrypha` or `set_options` functions.
			include_apocrypha: false,
			// `c`: treat references to Psalm 151 (if using the Apocrypha) as a chapter: "Psalm 151:1" -> "Ps.151.1"
			// `b`: treat references to Psalm 151 (if using the Apocrypha) as a book: "Psalm 151:1" -> "Ps151.1.1". Be aware that for ranges starting or ending in Psalm 151, you'll get two OSISes, regardless of the `sequence_combination_strategy`: "Psalms 149-151" -> "Ps.149-Ps.150,Ps151.1" Setting this option to `b` is the only way to correctly parse OSISes that treat `Ps151` as a book.
			ps151_strategy: "c",
	
			// ### Versification System
			// Don't set this value directly; use the `versification_system` or `set_options` functions.
			// * `default`: the default ESV-style versification. Also used in AMP and NASB.
			// * `ceb`: use CEB versification, which varies mostly in the Apocrypha.
			// * `kjv`: use KJV versification, with one fewer verse in 3John. Also used in NIV and NKJV.
			// `nab`: use NAB versification, which generally follows the Septuagint.
			// * `nlt`: use NLT versification, with one extra verse in Rev. Also used in NCV.
			// * `nrsv`: use NRSV versification.
			// * `vulgate`: use Vulgate (Greek) numbering for the Psalms.
			versification_system: "default",
	
			// ### Case Sensitivity
			// Don't use this value directly; use the `set_options` function. Changing this option repeatedly will slow down execution.
			// * `none`: All matches are case-insensitive.
			// * `books`: Book names are case-sensitive. Everything else is still case-insensitive.
			case_sensitive: "none"
		};
	}

	// Remember default options for later use.
	constructor() {
		this.options = {};
		for (var key of Object.keys(bcv_parser.prototype.options || {})) {
			var val = bcv_parser.prototype.options[key];
			this.options[key] = val;
		}
		// If we've changed the versification system, make sure previous object invocations don't leak.
		this.versification_system(this.options.versification_system);
	}

	// ## Parse-Related Functions
	// Parse a string and prepare the object for further interrogation, depending on what's needed.
	parse(s) {
		this.reset();
		this.s = s;
		// Replace any control characters already in the string.
		s = this.replace_control_characters(s);
		// Get a string representation suitable for passing to the parser.
		[s, this.passage.books] = Array.from(this.match_books(s));
		// Replace potential BCVs one at a time to reduce processing time on long strings.
		[this.entities] = Array.from(this.match_passages(s));
		// Allow chaining.
		return this;
	}

	// Parse a string and prepare the object for further interrogation, depending on what's needed. The second argument is a string that serves as the context for the first argument. If there's a valid partial match at the beginning of the first argument, then it will parse it using the supplied `context`. For example, `parse_string_with_context("verse 2", "Genesis 3").osis()` = `Gen.3.2`. You'd use this when you have some text that looks like it's a partial reference, and you already know the context.
	parse_with_context(s, context) {
		let entities;
		this.reset();
		[context, this.passage.books] = Array.from(this.match_books(this.replace_control_characters(context)));
		[entities, context] = Array.from(this.match_passages(context));
		this.reset();
		this.s = s;
		// Replace any control characters already in the string.
		s = this.replace_control_characters(s);
		// Get a string representation suitable for passing to the parser.
		[s, this.passage.books] = Array.from(this.match_books(s));
		this.passage.books.push({
			value: "",
			parsed: [],
			start_index: 0,
			type: "context",
			context
		});
		// Reconstruct the string, adding in the context. Because we've already called `match_books`, the resulting offsets will reflect the original string and not the new string.
		s = "\x1f" + (this.passage.books.length - 1) + "/9\x1f" + s;
		// Replace potential BCVs one at a time to reduce processing time on long strings.
		[this.entities] = Array.from(this.match_passages(s));
		// Allow chaining.
		return this;
	}

	// If we have a new string to parse, reset any values from previous parses.
	reset() {
		this.s = "";
		this.entities = [];
		if (this.passage) {
			this.passage.books = [];
			return this.passage.indices = {};
		} else {
			this.passage = new bcv_passage;
			this.passage.options = this.options;
			return this.passage.translations = this.translations;
		}
	}

	// ## Options-Related Functions
	// Override default options.
	set_options(options) {
		for (var key of Object.keys(options || {})) {
			// The drawback with this approach is that calling `include_apocrypha`, `versification_system`, and `case_sensitive` could regenerate `@regexps.books` three times.
			var val = options[key];
			if ((key === "include_apocrypha") || (key === "versification_system") || (key === "case_sensitive")) {
				this[key](val);
			} else {
				this.options[key] = val;
			}
		}
		return this;
	}

	// Whether to use books and abbreviations from the Apocrypha. Takes a boolean argument: `true` to include the Apocrypha and `false` to not. Defaults to `false`. Returns the `bcv_parser` object.
	include_apocrypha(arg) {
		if ((arg == null) || ((arg !== true) && (arg !== false))) { return this; }
		this.options.include_apocrypha = arg;
		this.regexps.books = this.regexps.get_books(arg, this.options.case_sensitive);
		for (var translation of Object.keys(this.translations || {})) {
			if ((translation === "aliases") || (translation === "alternates")) { continue; }
			// If the `Ps` array in the `chapters` object doesn't exist, create it so that we can add Ps 151 to the end of it.
			if (this.translations[translation].chapters == null) { this.translations[translation].chapters = {}; }
			if (this.translations[translation].chapters["Ps"] == null) { this.translations[translation].chapters["Ps"] = bcv_utils.shallow_clone_array(this.translations["default"].chapters["Ps"]); }
			// Add Ps 151 to the end of Psalms. The assumption here is that Ps151 always only is one chapter long.
			if (arg === true) {
				var verse_count;
				if (this.translations[translation].chapters["Ps151"] != null) {
					verse_count = this.translations[translation].chapters["Ps151"][0];
				} else {
					verse_count = this.translations["default"].chapters["Ps151"][0];
				}
				this.translations[translation].chapters["Ps"][150] = verse_count;
			// Remove Ps 151 from the end of Psalms.
			} else {
				if (this.translations[translation].chapters["Ps"].length === 151) { this.translations[translation].chapters["Ps"].pop(); }
			}
		}
		return this;
	}

	// Use an alternate versification system. Takes a string argument; the built-in options are: `default` to use KJV-style versification and `vulgate` to use the Vulgate (Greek) Psalm numbering. English offers several other versification systems; see the Readme for details.
	versification_system(system) {
		let book, chapter_list;
		if ((system == null) || (this.translations[system] == null)) { return this; }
		// If we've already changed the `versification_system` once, we need to do some cleanup before we change it to something else.
		if (this.translations.alternates.default != null) {
			// If we're changing to the default from something else, make sure we reset it to the correct values.
			if (system === "default") {
				if (this.translations.alternates.default.order != null) {
					this.translations.default.order = bcv_utils.shallow_clone(this.translations.alternates.default.order);
				}
				for (book of Object.keys(this.translations.alternates.default.chapters || {})) {
					chapter_list = this.translations.alternates.default.chapters[book];
					this.translations.default.chapters[book] = bcv_utils.shallow_clone_array(chapter_list);
				}
			// Make sure the `versification_system` is reset to the default before applying any changes--alternate systems only include differences from the default.
			} else {
				this.versification_system("default");
			}
		}
		if (this.translations.alternates.default == null) { this.translations.alternates.default = {order: null, chapters: {}}; }
		// If we're updating the book order (e.g., to mix the Apocrypha into the Old Testament)...
		if ((system !== "default") && (this.translations[system].order != null)) {
			// Save the existing default order so we can get it back later if necessary. We want to do everything nondestructively.
			if (this.translations.alternates.default.order == null) { this.translations.alternates.default.order = bcv_utils.shallow_clone(this.translations.default.order); }
			// The `order` key should always contain the full order; too many things can go wrong if we try to merge the old order and the new one.
			this.translations.default.order = bcv_utils.shallow_clone(this.translations[system].order);
		}
		// If we're updating the number of chapters in a book or the number of verses in a chapter...
		if ((system !== "default") && (this.translations[system].chapters != null)) {
			// Loop through only the books that are changing.
			for (book of Object.keys(this.translations[system].chapters || {})) {
				// Save the existing default order so we can get it back later. Only set it the first time.
				chapter_list = this.translations[system].chapters[book];
				if (this.translations.alternates.default.chapters[book] == null) { this.translations.alternates.default.chapters[book] = bcv_utils.shallow_clone_array(this.translations.default.chapters[book]); }
				this.translations.default.chapters[book] = bcv_utils.shallow_clone_array(chapter_list);
			}
		}
		// Depending on the order of operations, the cloned list could be inconsistent with the current state. For example, if we called `versification_system`, we've cached 150 Psalms. If we then call `include_apocrypha(true)`, we now have 151 Psalms. If we then call `versification_system` again, we're back, incorrectly, to 150 Psalms because that's what was cached.
		this.options.versification_system = system;
		this.include_apocrypha(this.options.include_apocrypha);
		return this;
	}

	// Whether to treat books as case-sensitive. Valid values are `none` and `books`.
	case_sensitive(arg) {
		if ((arg == null) || ((arg !== "none") && (arg !== "books"))) { return this; }
		// If nothing is changing, don't bother continuing
		if (arg === this.options.case_sensitive) { return this; }
		this.options.case_sensitive = arg;
		this.regexps.books = this.regexps.get_books(this.options.include_apocrypha, arg);
		return this;
	}

	// ## Administrative Functions
	// Return translation information so that we don't have to reach into semi-private objects to grab the data we need.
	translation_info(new_translation) {
		let book;
		if (new_translation == null) { new_translation = "default"; }
		if ((new_translation != null) && ((this.translations.aliases[new_translation] != null ? this.translations.aliases[new_translation].alias : undefined) != null)) {
			new_translation = this.translations.aliases[new_translation].alias;
		}
		if ((new_translation == null) || (this.translations[new_translation] == null)) { new_translation = "default"; }
		const old_translation = this.options.versification_system;
		if (new_translation !== old_translation) { this.versification_system(new_translation); }
		const out = {
			alias: new_translation,
			books: [],
			chapters: {},
			order: bcv_utils.shallow_clone(this.translations.default.order)
		};
		for (book of Object.keys(this.translations.default.chapters || {})) {
			var chapter_list = this.translations.default.chapters[book];
			out.chapters[book] = bcv_utils.shallow_clone_array(chapter_list);
		}
		for (book of Object.keys(out.order || {})) {
			var id = out.order[book];
			out.books[id-1] = book;
		}
		if (new_translation !== old_translation) { this.versification_system(old_translation); }
		return out;
	}

	// ## Parsing-Related Functions
	// Replace control characters and spaces since we replace books with a specific character pattern. The string changes, but the length stays the same so that indices remain valid. If we want to use Latin numbers rather than non-Latin ones, replace them here.
	replace_control_characters(s) {
		s = s.replace(this.regexps.control, " ");
		s = s.replace(/\uFF1A/g, ":");
		s = s.replace(/\uFF1B/g, ";");
		if (this.options.non_latin_digits_strategy === "replace") {
			s = s.replace(/[٠۰߀०০੦૦୦0౦೦൦๐໐༠၀႐០᠐᥆᧐᪀᪐᭐᮰᱀᱐꘠꣐꤀꧐꩐꯰０]/g, "0");
			s = s.replace(/[١۱߁१১੧૧୧௧౧೧൧๑໑༡၁႑១᠑᥇᧑᪁᪑᭑᮱᱁᱑꘡꣑꤁꧑꩑꯱１]/g, "1");
			s = s.replace(/[٢۲߂२২੨૨୨௨౨೨൨๒໒༢၂႒២᠒᥈᧒᪂᪒᭒᮲᱂᱒꘢꣒꤂꧒꩒꯲２]/g, "2");
			s = s.replace(/[٣۳߃३৩੩૩୩௩౩೩൩๓໓༣၃႓៣᠓᥉᧓᪃᪓᭓᮳᱃᱓꘣꣓꤃꧓꩓꯳３]/g, "3");
			s = s.replace(/[٤۴߄४৪੪૪୪௪౪೪൪๔໔༤၄႔៤᠔᥊᧔᪄᪔᭔᮴᱄᱔꘤꣔꤄꧔꩔꯴４]/g, "4");
			s = s.replace(/[٥۵߅५৫੫૫୫௫౫೫൫๕໕༥၅႕៥᠕᥋᧕᪅᪕᭕᮵᱅᱕꘥꣕꤅꧕꩕꯵５]/g, "5");
			s = s.replace(/[٦۶߆६৬੬૬୬௬౬೬൬๖໖༦၆႖៦᠖᥌᧖᪆᪖᭖᮶᱆᱖꘦꣖꤆꧖꩖꯶６]/g, "6");
			s = s.replace(/[٧۷߇७৭੭૭୭௭౭೭൭๗໗༧၇႗៧᠗᥍᧗᪇᪗᭗᮷᱇᱗꘧꣗꤇꧗꩗꯷７]/g, "7");
			s = s.replace(/[٨۸߈८৮੮૮୮௮౮೮൮๘໘༨၈႘៨᠘᥎᧘᪈᪘᭘᮸᱈᱘꘨꣘꤈꧘꩘꯸８]/g, "8");
			s = s.replace(/[٩۹߉९৯੯૯୯௯౯೯൯๙໙༩၉႙៩᠙᥏᧙᪉᪙᭙᮹᱉᱙꘩꣙꤉꧙꩙꯹９]/g, "9");
		}
		return s;
	}

	// Find and replace instances of Bible books.
	match_books(s) {
		const books = [];
		// Replace all book strings.
		for (var book of Array.from(this.regexps.books)) {
			var has_replacement = false;
			// Using array concatenation instead of replacing text directly didn't offer performance improvements in tests of the approach.
			s = s.replace(book.regexp, function(full, prev, bk) {
				has_replacement = true;
				// `value` contains the raw string; `book.osis` is the osis value for the book.
				books.push({value: bk, parsed: book.osis, type: "book"});
				const extra = (book.extra != null) ? `/${book.extra}` : "";
				return `${prev}\x1f${books.length - 1}${extra}\x1f`;
			});
			// If we've already replaced all possible books in the string, we don't need to check any further.
			if ((has_replacement === true) && /^[\s\x1f\d:.,;\-\u2013\u2014]+$/.test(s)) {
				break;
			}
		}
		// Replace translations.
		s = s.replace(this.regexps.translations, function(match) {
			books.push({value: match, parsed: match.toLowerCase(), type: "translation"});
			return `\x1e${books.length - 1}\x1e`;
		});
		return [s, this.get_book_indices(books, s)];
	}

	// Get the string index for all the books / translations, adding the start index as a new key.
	get_book_indices(books, s) {
		let match;
		let add_index = 0;
		const re = new RegExp(`\
([\\x1f\\x1e])\
(\\d+)\
(?:/\\d+)?\
\\1\
`, 'g');
		while ((match = re.exec(s))) {
			// Keep track of the actual start index.
			books[match[2]].start_index = match.index + add_index;
			// Add the difference between the real length of the book and what we replaced it with (`match[0]` is the replacement).
			add_index += books[match[2]].value.length - match[0].length;
		}
		return books;
	}

	// Create an array of all the potential bcv matches in the string.
	match_passages(s) {
		let match;
		let entities = [];
		let post_context = {};
		while ((match = this.regexps.escaped_passage.exec(s))) {
			// * `match[0]` includes the preceding character (if any) for bounding.
			// * `match[1]` is the full match minus the character preceding the match used for bounding.
			// * `match[2]` is the book id.
			let accum;
			var [full, part, book_id] = Array.from(match);
			// Adjust the `index` to use the `part` offset rather than the `full` offset. We use it below for `captive_end_digits`.
			var original_part_length = part.length;
			match.index += full.length - original_part_length;
			// Remove most three+-character digits at the end; they won't match.
			if ((/\s[2-9]\d\d\s*$|\s\d{4,}\s*$/).test(part)) {
				part = part.replace(/\s+\d+\s*$/, "");
			}
			// Clean up the end of the match to avoid irrelevant context.
			if (!/[\d\x1f\x1e)]$/.test(part)) {
				// Remove superfluous characters from the end of the match.
				part = this.replace_match_end(part);
			}
			if (this.options.captive_end_digits_strategy === "delete") {
				// If the match ends with a space+digit and is immediately followed by a word character, ignore the space+digit: `Matt 1, 2Text`.
				var next_char = match.index + part.length;
				if ((s.length > next_char) && /^\w/.test(s.substr(next_char, 1))) { part = part.replace(/[\s*]+\d+$/, ""); }
				// If the match ends with a translation indicator, remove any numbers afterward. This situation generally occurs in cases like, "Ps 1:1 ESV 1 Blessed is...", where the final `1` is a verse number that's part of the text.
				part = part.replace(/(\x1e[)\]]?)[\s*]*\d+$/, "$1");
			}
			// Though PEG.js doesn't have to be case-sensitive, using the case-insensitive feature involves some repeated processing. By lower-casing here, we only pay the cost once. The grammar for words like "also" is case-sensitive; we can safely lowercase ascii letters without changing indices. We don't just call .toLowerCase() because it could affect the length of the string if it contains certain characters; maintaining the indices is the most important thing.
			part = part.replace(/[A-Z]+/g, capitals => capitals.toLowerCase());
			// If we're in a chapter-book situation, the first character won't be a book control character, which would throw off the `start_index`.
			var start_index_adjust = part.substr(0, 1) === "\x1f" ? 0 : part.split("\x1f")[0].length;
			// * `match` is important for the length and whether it contains control characters, neither of which we've changed inconsistently with the original string. The `part` may be shorter than originally matched, but that's only to remove unneeded characters at the end.
			// * `grammar` is the external PEG parser. The `@options.punctuation_strategy` determines which punctuation is used for sequences and `cv` separators.
			var passage = {value: grammar.parse(part, {punctuation_strategy: this.options.punctuation_strategy}), type: "base", start_index: this.passage.books[book_id].start_index - start_index_adjust, match: part};
			// Are we looking at a single book on its own that could be part of a range like "1-2 Sam"?
			if ((this.options.book_alone_strategy === "full") &&
			(this.options.book_range_strategy === "include") &&
			(passage.value[0].type === "b") &&
			// Either it's on its own or a translation sequence follows it, making it effectively on its own.
			((passage.value.length === 1) || ((passage.value.length > 1) && (passage.value[1].type === "translation_sequence"))) &&
			(start_index_adjust === 0) &&
			((this.passage.books[book_id].parsed.length === 1) || ((this.passage.books[book_id].parsed.length > 1) &&
			(this.passage.books[book_id].parsed[1].type === "translation"))) &&
			/^[234]/.test(this.passage.books[book_id].parsed[0])) {
				this.create_book_range(s, passage, book_id);
			}
			// Handle each passage individually to prevent context leakage (e.g., translations back-propagating through unrelated entities).
			[accum, post_context] = Array.from(this.passage.handle_obj(passage));
			entities = entities.concat(accum);
			// Move the next RegExp iteration to start earlier if we didn't use everything we thought we were going to.
			var regexp_index_adjust = this.adjust_regexp_end(accum,original_part_length, part.length);
			if (regexp_index_adjust > 0) { this.regexps.escaped_passage.lastIndex -= regexp_index_adjust; }
		}
		return [entities, post_context];
	}

	// Handle the objects returned from the grammar to produce entities for further processing. We may need to adjust the `RegExp.lastIndex` if we discarded characters from the end of the match or if, after parsing, we're ignoring some of them--especially with ending parenthetical statements like "Luke 8:1-3; 24:10 (and Matthew 14:1-12 and Luke 23:7-12 for background)".
	adjust_regexp_end(accum, old_length, new_length) {
		let regexp_index_adjust = 0;
		if (accum.length > 0) {
			// `accum` uses an off-by-one end index compared to the RegExp object. "and Psa3" means `lastIndex` = 8, `old_length` and `new_length` are both 4 (omitting "and " and leaving "Psa3"), and the `accum` end index is 3. We end up with 4 - 3 - 1 = 0, or no adjustment. Compare "and Psa3 and", where the last " and" is originally considered part of the regexp. In this case, `regexp_index_adjust` is 4: 8 ("Psa3 and") - 3 ("Psa3") - 1.
			regexp_index_adjust = old_length - accum[accum.length-1].indices[1] - 1;
		} else if (old_length !== new_length) {
			regexp_index_adjust = old_length - new_length;
		}
		return regexp_index_adjust;
	}

	// Remove unnecessary characters from the end of the match.
	replace_match_end(part) {
		// Split the string on valid ending characters. Remove whatever's leftover at the end of the string. It would be easier to do `part.split(@regexps.match_end_split).pop()`, but IE doesn't handle empty strings at the end.
		let match;
		let remove = part.length;
		while ((match = this.regexps.match_end_split.exec(part))) {
			remove = match.index + match[0].length;
		}
		if (remove < part.length) {
			part = part.substr(0, remove);
		}
		return part;
	}

	// If a book is on its own, check whether it's preceded by something that indicates it's a book range like "1-2 Samuel".
	create_book_range(s, passage, book_id) {
		const cases = [bcv_parser.prototype.regexps.first, bcv_parser.prototype.regexps.second, bcv_parser.prototype.regexps.third];
		const limit = parseInt(this.passage.books[book_id].parsed[0].substr(0, 1), 10);
		for (let i = 1, end = limit, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
			var range_regexp = i === (limit - 1) ? bcv_parser.prototype.regexps.range_and : bcv_parser.prototype.regexps.range_only;
			var prev = s.match(new RegExp(`(?:^|\\W)(${cases[i-1]}\\s*${range_regexp}\\s*)\\x1f${book_id}\\x1f`, 'i'));
			if (prev != null) { return this.add_book_range_object(passage, prev, i); }
		}
		return false;
	}

	// Create a fake object that can be parsed to show the correct result.
	add_book_range_object(passage, prev, start_book_number) {
		const {
            length
        } = prev[1];
		passage.value[0] = {
			type: "b_range_pre",
			value: [{type: "b_pre", value: start_book_number.toString(), indices: [prev.index, prev.index + length]}, passage.value[0]],
			indices: [0, passage.value[0].indices[1] + length]
		};
		// Adjust the indices of the original result so they reflect the new content.
		passage.value[0].value[1].indices[0] += length;
		passage.value[0].value[1].indices[1] += length;
		// These two are the most important ones; the `absolute_indices` function uses them.
		passage.start_index -= length;
		passage.match = prev[1] + passage.match;
		if (passage.value.length === 1) { return; }
		// If there are subsequent objects, also adjust their offsets.
		return (() => {
			const result = [];
			for (let i = 1, end = passage.value.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
				if (passage.value[i].value == null) { continue; }
				// If it's an `integer` type, `passage.value[i].value` is a scalar rather than an object, so we only need to adjust the indices for the top-level object.
				if ((passage.value[i].value[0] != null ? passage.value[i].value[0].indices : undefined) != null) {
					passage.value[i].value[0].indices[0] += length;
					passage.value[i].value[0].indices[1] += length;
				}
				passage.value[i].indices[0] += length;
				result.push(passage.value[i].indices[1] += length);
			}
			return result;
		})();
	}

	// ## Output-Related Functions
	// Return a single OSIS string (comma-separated) for all the references in the whole input string.
	osis() {
		const out = [];
		for (var osis of Array.from(this.parsed_entities())) {
			if (osis.osis.length > 0) { out.push(osis.osis); }
		}
		return out.join(",");
	}

	// Return an array of `[OSIS, TRANSLATIONS]` for each reference (combined according to `options`).
	osis_and_translations() {
		const out = [];
		for (var osis of Array.from(this.parsed_entities())) {
			if (osis.osis.length > 0) { out.push([osis.osis, osis.translations.join(",")]); }
		}
		return out;
	}

	// Return an array of `{osis: OSIS, indices:[START, END], translations: [TRANSLATIONS]}` objects for each reference (combined according to `options`).
	osis_and_indices() {
		const out = [];
		for (var osis of Array.from(this.parsed_entities())) {
			if (osis.osis.length > 0) {
				const entry: any = {osis: osis.osis, translations: osis.translations, indices: osis.indices};
				if (osis.osises != null) { entry.osises = osis.osises; }
				out.push(entry);
			}
		}
		return out;
	}

	// Return all objects, probably for additional processing.
	parsed_entities() {
		let out = [];
		for (let entity_id = 0, end = this.entities.length, asc = 0 <= end; asc ? entity_id < end : entity_id > end; asc ? entity_id++ : entity_id--) {
			var entity = this.entities[entity_id];
			// Be sure to include any translation identifiers in the indices we report back, but only if the translation immediately follows the previous entity.
			if (entity.type && (entity.type === "translation_sequence") && (out.length > 0) && (entity_id === (out[out.length-1].entity_id + 1))) {
				out[out.length-1].indices[1] = entity.absolute_indices[1];
			}
			if (entity.passages == null) { continue; }
			if (this.options.consecutive_combination_strategy === "separate-chapters") {
				const semicolon_segments = this.split_text_by_semicolon(entity.absolute_indices);
				if (semicolon_segments.length > 1) {
					for (const segment of Array.from(semicolon_segments)) {
						const sub_parser = new bcv_parser;
						sub_parser.set_options({...this.options});
						sub_parser.parse(segment.text);
						for (const sub of Array.from(sub_parser.parsed_entities())) {
							if (sub.osis.length === 0) { continue; }
							const indices = [sub.indices[0] + segment.offset, sub.indices[1] + segment.offset];
							const entry: any = {osis: sub.osis, translations: sub.translations, indices, entity_id};
							if (sub.osises != null) { entry.osises = sub.osises; }
							out.push(entry);
						}
					}
					continue;
				}
			}
			if (((entity.type === "b") && (this.options.book_alone_strategy === "ignore")) || ((entity.type === "b_range") && (this.options.book_range_strategy === "ignore")) || (entity.type === "context")) { continue; }
			// A given entity, even if part of a sequence, always only has one set of translations associated with it.
			var translations = [];
			var translation_alias = null;
			if (entity.passages[0].translations != null) {
				for (var translation of Array.from(entity.passages[0].translations)) {
					var translation_osis = (translation.osis != null ? translation.osis.length : undefined) > 0 ? translation.osis : "";
					if (translation_alias == null) { translation_alias = translation.alias; }
					translations.push(translation_osis);
				}
			} else {
				translations = [""];
				translation_alias = "default";
			}
			var osises = [];
			var nonCombinableOsises = [];
			var {
                length
            } = entity.passages;
			for (var j = 0, i = j, end1 = length, asc1 = 0 <= end1; asc1 ? j < end1 : j > end1; asc1 ? j++ : j--, i = j) {
				var passage = entity.passages[i];
				// The `type` is usually only set in a sequence.
				if (passage.type == null) { passage.type = entity.type; }
				if (passage.valid.valid === false) {
					if ((this.options.invalid_sequence_strategy === "ignore") && (entity.type === "sequence")) {
						this.snap_sequence("ignore", entity, osises, i, length);
					}
					// Stop here if we're ignoring invalid passages.
					if (this.options.invalid_passage_strategy === "ignore") { continue; }
				}
				// If indicated in `@options`, exclude stray start/end books, resetting the parent indices as needed.
				if (((passage.type === "b") || (passage.type === "b_range")) && (this.options.book_sequence_strategy === "ignore") && (entity.type === "sequence")) {
					this.snap_sequence("book", entity, osises, i, length);
					continue;
				}
				if (((passage.type === "b_range_start") || (passage.type === "range_end_b")) && (this.options.book_range_strategy === "ignore")) {
						this.snap_range(entity, i);
					}
				if (passage.absolute_indices == null) { passage.absolute_indices = entity.absolute_indices; }

				if ((this.options.consecutive_combination_strategy === 'separate-chapters') && (passage.start.c !== passage.end.c)) {
					osises.push({
						osis: passage.valid.valid ? this.to_osis(passage.start, passage.end, translation_alias) : "",
						osises: this.get_osises_by_chapter({osis: "", start: passage.start, end: passage.end}, translation_alias),
						type: passage.type,
						indices: passage.absolute_indices,
						translations,
						start: passage.start,
						end: passage.end,
						enclosed_indices: passage.enclosed_absolute_indices,
						entity_id,
						entities: [passage]});
				} else {
					osises.push({
						osis: passage.valid.valid ? this.to_osis(passage.start, passage.end, translation_alias) : "",
						type: passage.type,
						indices: passage.absolute_indices,
						translations,
						start: passage.start,
						end: passage.end,
						enclosed_indices: passage.enclosed_absolute_indices,
						entity_id,
						entities: [passage]});
				}
			}
			// Don't return an empty object.
			if ((osises.length === 0) && (nonCombinableOsises.length === 0)) { continue; }
			if ((this.options.consecutive_combination_strategy === "combine") || (this.options.consecutive_combination_strategy === "separate-chapters")) {
				if (osises.length > 1) {
					osises = this.combine_consecutive_passages(osises, translation_alias);
				}
				osises = osises.concat(nonCombinableOsises).sort((osis1, osis2) => osis1.indices[0] - osis2.indices[0]);
			}
			if (this.options.consecutive_combination_strategy === "separate-chapters") {
				for (osis of Array.from(osises)) {
					if (osis.osis.length === 0) { continue; }
					const osises_by_chapter = this.get_osises_by_chapter(osis, translation_alias);
					if (osises_by_chapter.length > 1) { osis.osises = osises_by_chapter; }
				}
			}
			// Add the osises array to the existing array.
			if (this.options.sequence_combination_strategy === "separate") {
				out = out.concat(osises);
			// Add the OSIS string and some data to the array.
			} else {
				if ((this.options.consecutive_combination_strategy === "separate-chapters") && (entity.type === "sequence")) {
					const groups = this.group_osises_by_semicolon(osises);
					if (groups.length > 1) {
						for (const group of Array.from(groups)) {
							if (group.length === 0) { continue; }
							const group_last_i = group.length - 1;
							const indices = [group[0].indices[0], group[group_last_i].indices[1]];
							if ((group[group_last_i].enclosed_indices != null) && (group[group_last_i].enclosed_indices[1] >= 0)) {
								indices[1] = group[group_last_i].enclosed_indices[1];
							}
							const strings = [];
							let osises_by_chapter: string[] = [];
							for (osis of Array.from(group)) {
								if (osis.osis.length > 0) { strings.push(osis.osis); }
								if (osis.osises != null) { osises_by_chapter = osises_by_chapter.concat(osis.osises); }
							}
							const out_entry: any = {osis: strings.join(","), indices, translations, entity_id, entities: group};
							if (osises_by_chapter.length > 0) { out_entry.osises = osises_by_chapter; }
							out.push(out_entry);
						}
						continue;
					}
				}
				var osis;
				var strings = [];
				var last_i = osises.length - 1;
				// Adjust the end index to match a closing parenthesis when presented with `enclosed` entities. These entities always start mid-sequence (unless there's a book we're ignoring), so we don't need to worry about the start index.
				if ((osises[last_i].enclosed_indices != null) && (osises[last_i].enclosed_indices[1] >= 0)) { entity.absolute_indices[1] = osises[last_i].enclosed_indices[1]; }
				for (osis of Array.from(osises)) {
					if (osis.osis.length > 0) { strings.push(osis.osis); }
				}
				let osises_by_chapter: string[] = [];
				if (this.options.consecutive_combination_strategy === "separate-chapters") {
					for (osis of Array.from(osises)) {
						if (osis.osises != null) { osises_by_chapter = osises_by_chapter.concat(osis.osises); }
					}
				}
				const out_entry: any = {osis: strings.join(","), indices: entity.absolute_indices, translations, entity_id, entities: osises};
				if (osises_by_chapter.length > 0) { out_entry.osises = osises_by_chapter; }
				out.push(out_entry);
			}
		}
		return out;
	}

	to_osis(start, end, translation) {
		// If it's just a book on its own, how we deal with it depends on whether we want to return just the first chapter or the complete book.
		let out;
		if ((end.c == null) && (end.v == null) && (start.b === end.b) && (start.c == null) && (start.v == null) && (this.options.book_alone_strategy === "first_chapter")) { end.c = 1; }
		const osis = {start: "", end: ""};
		// If no start chapter or verse, assume the first possible.
		if (start.c == null) { start.c = 1; }
		if (start.v == null) { start.v = 1; }
		// If no end chapter or verse, assume the last possible. If it's a single-chapter book, always use the first chapter for consistency with other `passage_existence_strategy` results (which do respect the single-chapter length).
		if (end.c == null) {
			if ((this.options.passage_existence_strategy.indexOf("c") >= 0) || ((this.passage.translations[translation].chapters[end.b] != null) && (this.passage.translations[translation].chapters[end.b].length === 1))) {
				end.c = this.passage.translations[translation].chapters[end.b].length;
			} else {
				end.c = 999;
			}
		}
		if (end.v == null) {
			if ((this.passage.translations[translation].chapters[end.b][end.c - 1] != null) && (this.options.passage_existence_strategy.indexOf("v") >= 0)) {
				end.v = this.passage.translations[translation].chapters[end.b][end.c - 1];
			} else {
				end.v = 999;
			}
		}
		if (this.options.include_apocrypha && (this.options.ps151_strategy === "b") && (((start.c === 151) && (start.b === "Ps")) || ((end.c === 151) && (end.b === "Ps")))) {
			this.fix_ps151(start, end, translation);
		}
		// If it's a complete book or range of complete books and we want the shortest possible OSIS, return just the book names. The `end.c` and `end.v` equaling 999 is for when the `passage_existence_strategy` sets them to 999, indicating that we should treat it as a complete book or chapter.
		if ((this.options.osis_compaction_strategy === "b") &&
		(start.c === 1) &&
		(start.v === 1) &&
		(((end.c === 999) && (end.v === 999)) ||
		((end.c === this.passage.translations[translation].chapters[end.b].length) &&
		(this.options.passage_existence_strategy.indexOf("c") >= 0) &&
		((end.v === 999) ||
		((end.v === this.passage.translations[translation].chapters[end.b][end.c - 1]) && (this.options.passage_existence_strategy.indexOf("v") >= 0)))
		))) {
			osis.start = start.b;
			osis.end = end.b;
		// If it's a complete chapter or range of complete chapters and we want a short OSIS, return just the books and chapters. We only care when `osis_compaction_strategy` isn't `bcv` (i.e., length 3) because `bcv` is always fully specified.
		} else if ((this.options.osis_compaction_strategy.length <= 2) &&
		(start.v === 1) &&
		((end.v === 999) ||
		((end.v === this.passage.translations[translation].chapters[end.b][end.c - 1]) && (this.options.passage_existence_strategy.indexOf("v") >= 0))
		)) {
			osis.start = start.b + "." + start.c.toString();
			osis.end = end.b + "." + end.c.toString();
		// Otherwise, return the full BCV reference for both.
		} else {
			osis.start = start.b + "." + start.c.toString() + "." + start.v.toString();
			osis.end = end.b + "." + end.c.toString() + "." + end.v.toString();
		}
		// If it's the same verse ("Gen.1.1-Gen.1.1"), chapter ("Gen.1-Gen.1") or book ("Gen-Gen"), return just the start so we don't end up with an empty range.
		if (osis.start === osis.end) {
			out = osis.start;
		// Otherwise return the range.
		} else {
			out = osis.start + "-" + osis.end;
		}
		if (start.extra != null) { out = start.extra + "," + out; }
		if (end.extra != null) { out += "," + end.extra; }
		return out;
	}

	get_osises_by_chapter(passage, translation) {
		if ((passage == null) || (passage.start == null) || (passage.end == null)) { return []; }
		if ((passage.start.b == null) || (passage.end.b == null) || (passage.start.c == null) || (passage.end.c == null)) {
			return (passage.osis != null) && (passage.osis.length > 0) ? [passage.osis] : [];
		}
		if ((passage.start.b !== passage.end.b) || (passage.start.c === passage.end.c)) {
			return (passage.osis != null) && (passage.osis.length > 0) ? [passage.osis] : [];
		}
		const out = [];
		for (let c = passage.start.c, end = passage.end.c, asc = passage.start.c <= end; asc ? c <= end : c >= end; asc ? c++ : c--) {
			const passageStartVerse = c === passage.start.c ? passage.start.v : 1;
			const passageEndVerse = c === passage.end.c ? passage.end.v : this.translations[translation].chapters[passage.start.b][c - 1];
			const passageStart = {
				b: passage.start.b,
				c,
				v: passage.start.type === "bcv" ? passageStartVerse : null,
				type: passage.start.type
			};
			const passageEnd = {
				b: passage.end.b,
				c,
				v: passage.start.type === "bcv" ? passageEndVerse : null,
				type: passage.start.type
			};
			out.push(this.to_osis(passageStart, passageEnd, translation));
		}
		return out;
	}

	get_separator_between(prev_indices, next_indices) {
		if ((this.s == null) || (prev_indices == null) || (next_indices == null)) { return ""; }
		const start = prev_indices[1] + 1;
		const end = next_indices[0];
		if (end <= start) { return ""; }
		return this.s.slice(start, end);
	}

	has_semicolon_separator(prev_osis, next_osis) {
		const between = this.get_separator_between(prev_osis.indices, next_osis.indices);
		return /[;；]/.test(between);
	}

	group_osises_by_semicolon(osises) {
		const out = [];
		let current = [];
		for (const osis of Array.from(osises)) {
			if (current.length === 0) {
				current.push(osis);
				continue;
			}
			if (this.has_semicolon_separator(current[current.length - 1], osis)) {
				out.push(current);
				current = [osis];
			} else {
				current.push(osis);
			}
		}
		if (current.length > 0) { out.push(current); }
		return out;
	}

	split_text_by_semicolon(absolute_indices) {
		if ((this.s == null) || (absolute_indices == null) || (absolute_indices[0] == null) || (absolute_indices[1] == null)) { return []; }
		const text = this.s.slice(absolute_indices[0], absolute_indices[1]);
		if (!/[;；]/.test(text)) { return [{text, offset: absolute_indices[0]}]; }
		const segments = [];
		let start = 0;
		for (let i = 0, end = text.length; i < end; i++) {
			const ch = text[i];
			if ((ch === ";") || (ch === "；")) {
				if (i > start) {
					segments.push({text: text.slice(start, i), offset: absolute_indices[0] + start});
				}
				start = i + 1;
			}
		}
		if (start < text.length) {
			segments.push({text: text.slice(start), offset: absolute_indices[0] + start});
		}
		return segments;
	}

	// If we want to treat Ps151 as a book rather than a chapter, we have to do some gymnastics to make sure it returns properly.
	fix_ps151(start, end, translation) {
		// Ps151 doesn't necessarily get promoted into the translation chapter list because during the string parsing, we treat it as `Ps` rather than `Ps151`.
		if ((translation !== "default") && ((this.translations[translation] != null ? this.translations[translation].chapters["Ps151"] : undefined) == null)) {
			this.passage.promote_book_to_translation("Ps151", translation);
		}
		if ((start.c === 151) && (start.b === "Ps")) {
			// If the whole range is in Ps151, we can just reset both sets of books and chapters; we don't have to worry about odd ranges.
			if ((end.c === 151) && (end.b === "Ps")) {
				start.b = "Ps151";
				start.c = 1;
				end.b = "Ps151";
				return end.c = 1;
			// Otherwise, we generate the OSIS for Ps151 and then set the beginning of the range to the next book. We assume that the next book is Prov, which isn't necessarily the case. I'm not aware of a canon that doesn't place Prov after Ps, however.
			} else {
				// This is the string we're going to prepend to our final output.
				start.extra = this.to_osis({b: "Ps151", c: 1, v: start.v}, {b: "Ps151", c: 1, v: this.passage.translations[translation].chapters["Ps151"][0]}, translation);
				start.b = "Prov";
				start.c = 1;
				return start.v = 1;
			}
		// We know that end is in Ps151 and start is beforehand.
		} else {
			// This is the string we're going to append to the final output.
			end.extra = this.to_osis({b: "Ps151", c: 1, v: 1}, {b: "Ps151", c: 1, v: end.v}, translation);
			// Set the end of the range to be the end of Ps.150, which immediately precedes Ps151.
			end.c = 150;
			return end.v = this.passage.translations[translation].chapters["Ps"][149];
		}
	}

	// If we have the correct `option` set (checked before calling this function), merge passages that refer to sequential verses: Gen 1, 2 -> Gen 1-2. It works for any combination of books, chapters, and verses.
	combine_consecutive_passages(osises, translation) {
		const out = [];
		let prev = {};
		const last_i = osises.length - 1;
		let enclosed_sequence_start = -1;
		let has_enclosed = false;
		for (let i = 0, end = last_i, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
			var osis = osises[i];
			if (osis.osis.length > 0) {
				var prev_i = out.length - 1;
				var is_enclosed_last = false;
				if ((prev_i >= 0) && this.has_semicolon_separator(out[prev_i], osis)) {
					out.push(osis);
					prev = {b: osis.end.b, c: osis.end.c, v: osis.end.v};
					continue;
				}
				// Record the start index of the enclosed sequence for use in future iterations.
				if (osis.enclosed_indices[0] !== enclosed_sequence_start) {
					enclosed_sequence_start = osis.enclosed_indices[0];
				}
				// If we're in an enclosed sequence and it's either the last item in the sequence or the next item in the sequence isn't part of the same enclosed sequence, then we've reached the end of the enclosed sequence.
				if ((enclosed_sequence_start >= 0) && ((i === last_i) || (osises[i+1].enclosed_indices[0] !== osis.enclosed_indices[0]))) {
					is_enclosed_last = true;
					// We may need to adjust the indices later.
					has_enclosed = true;
				}
				// Pretend like the previous `end` and existing `start` don't exist.
				if (this.is_verse_consecutive(prev, osis.start, translation)) {
					out[prev_i].end = osis.end;
					// Set the enclosed indices if it's last or at the end of a sequence of enclosed indices. Otherwise only extend the indices to the actual indices--e.g., `Ps 117 (118, 120)`, should only extend to after `118`.
					out[prev_i].is_enclosed_last = is_enclosed_last;
					out[prev_i].indices[1] = osis.indices[1];
					out[prev_i].enclosed_indices[1] = osis.enclosed_indices[1];
					out[prev_i].osis = this.to_osis(out[prev_i].start, osis.end, translation);
				} else {
					out.push(osis);
				}
				prev = {b: osis.end.b, c: osis.end.c, v: osis.end.v};
			} else {
				out.push(osis);
				prev = {};
			}
		}
		if (has_enclosed) { this.snap_enclosed_indices(out); }
		return out;
	}

	// If there's an enclosed reference--e.g., Ps 1 (2)--and we've combined consecutive passages in such a way that the enclosed reference is fully inside the sequence (i.e., if it starts before the enclosed sequence), then make sure the end index for the passage includes the necessary closing punctuation.
	snap_enclosed_indices(osises) {
		for (var osis of Array.from(osises)) {
			if (osis.is_enclosed_last != null) {
				if ((osis.enclosed_indices[0] < 0) && osis.is_enclosed_last) {
					osis.indices[1] = osis.enclosed_indices[1];
				}
				delete osis.is_enclosed_last;
			}
		}
		return osises;
	}

	// Given two fully specified objects (complete bcvs), find whether they're sequential.
	is_verse_consecutive(prev, check, translation) {
		if (prev.b == null) { return false; }
		// A translation doesn't always have an `order` set. If it doesn't, then use the default order.
		const translation_order = (this.passage.translations[translation].order != null) ? this.passage.translations[translation].order : this.passage.translations.default.order;
		if (prev.b === check.b) {
			if (prev.c === check.c) {
				if (prev.v === (check.v - 1)) { return true; }
			} else if ((check.v === 1) && (prev.c === (check.c - 1))) {
				if (prev.v === this.passage.translations[translation].chapters[prev.b][prev.c - 1]) { return true; }
			}
		} else if ((check.c === 1) && (check.v === 1) && (translation_order[prev.b] === (translation_order[check.b] - 1))) {
			if ((prev.c === this.passage.translations[translation].chapters[prev.b].length) && (prev.v === this.passage.translations[translation].chapters[prev.b][prev.c - 1])) { return true; }
		}
		return false;
	}

	// Snap the start/end index of the range when it includes a book on its own and `@options.book_range_strategy` is `ignore`.
	snap_range(entity, passage_i) {
		// If the book is at the start of the range, we want to ignore the first part of the range.
		let entity_i, source_entity, type;
		if ((entity.type === "b_range_start") || ((entity.type === "sequence") && (entity.passages[passage_i].type === "b_range_start"))) {
			entity_i = 1;
			source_entity = "end";
			type = "b_range_start";
		// If the book is at the end of the range, we want to ignore the end of the range.
		} else {
			entity_i = 0;
			source_entity = "start";
			type = "range_end_b";
		}
		const target_entity = source_entity === "end" ? "start" : "end";
		// Rewrite either the start or the end of the range to match the opposite. In effect, we're changing it from a range to a single point.
		for (var key of Object.keys(entity.passages[passage_i][target_entity] || {})) {
			entity.passages[passage_i][target_entity][key] = entity.passages[passage_i][source_entity][key];
		}
		if (entity.type === "sequence") {
			// This can be too long if a range is converted into a sequence where it ends with an open book range (`Matt 10-Rev`) that we want to ignore. At this point, the `passages` and `value` keys can get out-of-sync.
			if (passage_i >= entity.value.length) { passage_i = entity.value.length - 1; }
			const pluck = this.passage.pluck(type, entity.value[passage_i]);
			// The `pluck` can be null if we've already overwritten its `type` in a previous recursion. This process is unusual, but can happen in "Proverbs 31:2. Vs 10 to dan".
			if (pluck != null) {
				const temp = this.snap_range(pluck, 0);
				// Move the indices to exclude what we've omitted. We want to move it even if it isn't the last one in case there are multiple books at the end--this way it'll use the correct indices.
				if (passage_i === 0) {
					entity.absolute_indices[0] = temp.absolute_indices[0];
				} else {
					entity.absolute_indices[1] = temp.absolute_indices[1];
				}
			}
		// If it's not a sequence, change the `type` and `absolute_indices` to exclude the book we're omitting.
		} else {
			entity.original_type = entity.type;
			entity.type = entity.value[entity_i].type;
			entity.absolute_indices = [entity.value[entity_i].absolute_indices[0], entity.value[entity_i].absolute_indices[1]];
		}
		return entity;
	}

	// Snap the start/end index of the entity or surrounding passages when there's a lone book or invalid item in a sequence.
	snap_sequence(type, entity, osises, i, length) {
		const passage = entity.passages[i];
		// If the passage is the first thing in the sequence and something is after it, snap the start index of the whole entity to the start index of the next item.
		//
		// But we only want to do this if it's followed by a book (if it's "Matt, 5", we want to be sure to include "Matt" as part of the indices and bypass this step). We can tell if that's the case if the `type` of what follows starts with `b` or if it's a `range` starting in a different book. The tricky part occurs when we have several invalid references at the start (Matt 29, 30, Acts 1)--we need to find the first value that's a book. If there's a valid item before the next book, abort.
		if ((passage.absolute_indices[0] === entity.absolute_indices[0]) && (i < (length - 1)) && (this.get_snap_sequence_i(entity.passages, i, length) !== i)) {
			entity.absolute_indices[0] = entity.passages[i + 1].absolute_indices[0];
			this.remove_absolute_indices(entity.passages, i + 1);
		// If the passage is the last thing in a sequence (but not the only one), snap the entity end index to the end index of the previous valid item. To handle multiple items at the end, snap back to the last known good item if available.
		} else if ((passage.absolute_indices[1] === entity.absolute_indices[1]) && (i > 0)) {
			entity.absolute_indices[1] = osises.length > 0 ? osises[osises.length - 1].indices[1] : entity.passages[i - 1].absolute_indices[1];
		// Otherwise, if the next item doesn't start with a book, link the start index of the current passage to the next one because we're including the current passage as part of the next one. In "Eph. 4. Gen, Matt, 6", the `Matt, ` should be part of the `6`, but "Eph. 4. Gen, Matt, 1cor6" should exclude `Matt`.
		} else if ((type === "book") && (i < (length - 1)) && !this.starts_with_book(entity.passages[i + 1])) {
			entity.passages[i + 1].absolute_indices[0] = passage.absolute_indices[0];
		}
		// Return something only for unit testing.
		return entity;
	}

	// Identify whether there are any valid items between the current item and the next book.
	get_snap_sequence_i(passages, i, length) {
		for (let start = i + 1, j = start, end = length, asc = start <= end; asc ? j < end : j > end; asc ? j++ : j--) {
			if (this.starts_with_book(passages[j])) { return j; }
			if (passages[j].valid.valid) { return i; }
		}
		return i;
	}

	// Given a passage, does it start with a book? It never takes a sequence as an argument.
	starts_with_book(passage) {
		if (passage.type.substr(0, 1) === "b") { return true; }
		if (((passage.type === "range") || (passage.type === "ff")) && (passage.start.type.substr(0, 1) === "b")) { return true; }
		return false;
	}

	// Remove absolute indices from the given passage to the end of the sequence. We do this when we don't want to include the end of a sequence in the sequence (most likely because it's invalid or a book on its own).
	remove_absolute_indices(passages, i) {
		if (passages[i].enclosed_absolute_indices[0] < 0) { return false; }
		const [start, end] = Array.from(passages[i].enclosed_absolute_indices);
		for (var passage of Array.from(passages.slice(i ))) {
			if ((passage.enclosed_absolute_indices[0] === start) && (passage.enclosed_absolute_indices[1] === end)) {
				passage.enclosed_absolute_indices = [-1, -1];
			} else {
				break;
			}
		}
		return true;
	}
}
bcv_parser.initClass();

root.bcv_parser = bcv_parser;
