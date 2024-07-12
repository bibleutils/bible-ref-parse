bcv_parser::regexps.space = "[\\s\\xa0]"
bcv_parser::regexps.escaped_passage = ///
	(?:^ | [^\x1f\x1e\dA-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ] )	# Beginning of string or not in the middle of a word or immediately following another book. Only count a book if it's part of a sequence: `Matt5John3` is OK, but not `1Matt5John3`
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
				  | [\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014]
				  | title (?! [a-z] )		#could be followed by a number
				  | поглавља | стихови | глава | стих | ff | - | и
				  | [aаб] (?! \w )			#a-e allows 1:1a
				  | $						#or the end of the string
				 )+
		)
	///gi
# These are the only valid ways to end a potential passage match. The closing parenthesis allows for fully capturing parentheses surrounding translations (ESV**)**. The last one, `[\d\x1f]` needs not to be +; otherwise `Gen5ff` becomes `\x1f0\x1f5ff`, and `adjust_regexp_end` matches the `\x1f5` and incorrectly dangles the ff.
bcv_parser::regexps.match_end_split = ///
	  \d \W* title
	| \d \W* ff (?: [\s\xa0*]* \.)?
	| \d [\s\xa0*]* [aаб] (?! \w )
	| \x1e (?: [\s\xa0*]* [)\]\uff09] )? #ff09 is a full-width closing parenthesis
	| [\d\x1f]
	///gi
bcv_parser::regexps.control = /[\x1e\x1f]/g
bcv_parser::regexps.pre_book = "[^A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ]"

bcv_parser::regexps.first = "(?:Прва|1|I|1)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.second = "(?:Друга|2|II|2)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.third = "(?:Трећом|Трећа|3|III|3)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.range_and = "(?:[&\u2013\u2014-]|и|-)"
bcv_parser::regexps.range_only = "(?:[\u2013\u2014-]|-)"
# Each book regexp should return two parenthesized objects: an optional preliminary character and the book itself.
bcv_parser::regexps.get_books = (include_apocrypha, case_sensitive) ->
	books = [
		osis: ["Ps"]
		apocrypha: true
		extra: "2"
		regexp: ///(\b)( # Don't match a preceding \d like usual because we only want to match a valid OSIS, which will never have a preceding digit.
			Ps151
			# Always follwed by ".1"; the regular Psalms parser can handle `Ps151` on its own.
			)(?=\.1)///g # Case-sensitive because we only want to match a valid OSIS.
	,
		osis: ["Gen"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:П(?:рва[\s\xa0]*Мојс(?:ијева)?|ост(?:ање)?)|(?:1\.|I)\.[\s\xa0]*Мојс(?:ијева)?|(?:1\.?|I)[\s\xa0]*Мојс(?:ијева)?|Gen)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Exod"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*Мојс(?:ијева)?|(?:II|2\.)\.[\s\xa0]*Мојс(?:ијева)?|(?:II|2\.?)[\s\xa0]*Мојс(?:ијева)?|Излазак|Егзодус|Exod|Изл)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bel"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Bel)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lev"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Трећ(?:ом[\s\xa0]*Мојс(?:ијева)?|а[\s\xa0]*Мојс(?:ијева)?)|(?:III|3\.)\.[\s\xa0]*Мојс(?:ијева)?|(?:III|3\.?)[\s\xa0]*Мојс(?:ијева)?|Левитска|Лев|Lev)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Num"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Четврта[\s\xa0]*Мојс(?:ијева)?|(?:IV|4\.)\.[\s\xa0]*Мојс(?:ијева)?|(?:IV|4\.?)[\s\xa0]*Мојс(?:ијева)?|Бројеви|Num|Бр)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sir"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Премудрости[\s\xa0]*Исуса[\s\xa0]*сина[\s\xa0]*Сирахова|Еклезијастикус|Сирина|Сир|ИсС|Sir)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Wis"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Прем(?:удорсти[\s\xa0]*Соломонове|[\s\xa0]*Сол)|Мудрости[\s\xa0]*Соломонове|Мудрости|Wis)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lam"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Плач(?:[\s\xa0]*Јеремијин)?|Lam)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["EpJer"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:П(?:осланица[\s\xa0]*Јеремијина|исма[\s\xa0]*Јеремије)|EpJer)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Отк(?:р(?:овење[\s\xa0]*Јованово|ивење(?:[\s\xa0]*Јованово)?))?|Rev)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrMan"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Молитва[\s\xa0]*Манасијина|PrMan)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Deut"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:П(?:он(?:овљени[\s\xa0]*закони|з)|ета[\s\xa0]*Мојс(?:ијева)?)|(?:5\.|V)\.[\s\xa0]*Мојсијева|(?:5\.?|V)[\s\xa0]*Мојсијева|(?:(?:5\.|V)\.|5\.?|V)[\s\xa0]*Мојс|Deut)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Josh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:И(?:сус[\s\xa0]*Навин|Нав)|Josh)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Judg"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Суд(?:иј[ае])?|Judg)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ruth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Рута?|Ruth)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:Је|Е)здрина|(?:1\.|I)\.[\s\xa0]*(?:Је|Е)здрина|(?:1\.|I)[\s\xa0]*(?:Је|Е)здрина|1(?:[\s\xa0]*Јездрина|[\s\xa0]*Ездрина|[\s\xa0]*Јез|Esd))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:Је|Е)здрина|(?:II|2\.)\.[\s\xa0]*(?:Је|Е)здрина|(?:II|2\.)[\s\xa0]*(?:Је|Е)здрина|2(?:[\s\xa0]*Јездрина|[\s\xa0]*Ездрина|[\s\xa0]*Јез|Esd))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Isa"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ис(?:аија)?|Isa)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:краљевим|Самуилов)а|(?:II|2\.)\.[\s\xa0]*(?:краљевим|Самуилов)а|(?:II|2\.)[\s\xa0]*(?:краљевим|Самуилов)а|2(?:[\s\xa0]*краљевима|[\s\xa0]*Самуилова|[\s\xa0]*Сам|Sam))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:краљевим|Самуилов)а|(?:1\.|I)\.[\s\xa0]*(?:краљевим|Самуилов)а|(?:1\.|I)[\s\xa0]*(?:краљевим|Самуилов)а|1(?:[\s\xa0]*краљевима|[\s\xa0]*Самуилова|[\s\xa0]*Сам|Sam))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Четврта[\s\xa0]*краљев(?:ств|им)а|(?:Друга|(?:II|2\.)\.|II|2\.|2)[\s\xa0]*о[\s\xa0]*царевима|(?:IV|4\.)\.[\s\xa0]*краљев(?:ств|им)а|(?:Друга[\s\xa0]*(?:краљ|Цар)|(?:II|2\.)\.[\s\xa0]*(?:краљ|Цар)|(?:II|2\.)[\s\xa0]*(?:краљ|Цар)|2[\s\xa0]*(?:краљ|Цар))ева|(?:IV|4\.?)[\s\xa0]*краљев(?:ств|им)а|2(?:[\s\xa0]*Цар|Kgs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Трећ(?:ом[\s\xa0]*краљев(?:ств|им)|а[\s\xa0]*краљев(?:ств|им))а|(?:Прва|1\.\.|1\.?|I\.?)[\s\xa0]*о[\s\xa0]*царевима|(?:III|3\.)\.[\s\xa0]*краљев(?:ств|им)а|(?:III|3\.?)[\s\xa0]*краљев(?:ств|им)а|(?:(?:Прва|1\.\.)[\s\xa0]*(?:краљ|Цар)|1(?:\.[\s\xa0]*(?:краљ|Цар)|[\s\xa0]*(?:краљ|Цар))|I(?:\.[\s\xa0]*(?:краљ|Цар)|[\s\xa0]*(?:краљ|Цар)))ева|1(?:[\s\xa0]*Цар|Kgs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:Паралипоменону|(?:днев|хро)ника)|(?:II|2\.)\.[\s\xa0]*(?:Паралипоменону|(?:днев|хро)ника)|(?:II|2\.)[\s\xa0]*(?:Паралипоменону|(?:днев|хро)ника)|2(?:[\s\xa0]*Паралипоменону|[\s\xa0]*Дневника|[\s\xa0]*хроника|[\s\xa0]*(?:хро|Д)н|Chr))|(?:2[\s\xa0]*дневника)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:Паралипоменону|(?:днев|хро)ника)|(?:1\.|I)\.[\s\xa0]*(?:Паралипоменону|(?:днев|хро)ника)|(?:1\.|I)[\s\xa0]*(?:Паралипоменону|(?:днев|хро)ника)|1(?:[\s\xa0]*Паралипоменону|[\s\xa0]*Дневника|[\s\xa0]*хроника|[\s\xa0]*(?:хро|Д)н|Chr))|(?:1[\s\xa0]*дневника)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezra"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Езрина|Јездра|Ezra|Езр)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Neh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Нем(?:ија)?|Neh)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["GkEsth"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:GkEsth)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Esth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јест(?:ира)?|Естер|Esth)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Job"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јов|Job)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ps"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Пс(?:ал(?:ми(?:[\s\xa0]*Давидови)?|ам))?|Ps)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrAzar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:PrAzar)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Prov"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Пр(?:иче[\s\xa0]*Солом[оу]нове)?|Изреке|Prov)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eccl"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Проп(?:оведник)?|Eccl)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["SgThree"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:SgThree)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Song"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:П(?:есма[\s\xa0]*(?:над[\s\xa0]*песмам|Соломонов)а|нп)|Song)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jer"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Je(?:vrejima|r)|Јер(?:емија)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezek"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јез(?:екиљ)?|Ezek)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Dan"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Дан(?:ило)?|Dan)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Хошеа|Ос(?:ија)?|Hos)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Joel"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јои[лљ]|Joel)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Amos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ам(?:ос)?|Amos)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Obad"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Авд(?:иј[ае])?|Obad)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jonah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Jonah|Јона)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mic"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Мих(?:еј)?|Mic)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Nah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Наум|Nah)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hab"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ав(?:акум)?|Hab)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zeph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Соф(?:ониј[ае])?|Zeph)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hag"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Аг(?:еј)?|Hag)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zech"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Зах(?:арија)?|Zech)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Мал(?:ахија)?|Mal)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Matt"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јеванђеље[\s\xa0]*по[\s\xa0]*Матеју|Еванђеље[\s\xa0]*по[\s\xa0]*Матеју|М(?:атеја|т)|Матеј|Matt)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:II|2\.)\.[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:II|2\.)[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|2(?:[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|Macc|[\s\xa0]*Мк))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Трећ(?:ом[\s\xa0]*Мака(?:веј(?:ск)?|бејац)|а[\s\xa0]*Мака(?:веј(?:ск)?|бејац))а|(?:III|3\.)\.[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:III|3\.)[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|3(?:[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|Macc|[\s\xa0]*Мк))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["4Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Четврта[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:IV|4\.)\.[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:IV|4\.)[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|4(?:[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|Macc|[\s\xa0]*Мк))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:1\.|I)\.[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|(?:1\.|I)[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|1(?:[\s\xa0]*Мака(?:веј(?:ск)?|бејац)а|Macc|[\s\xa0]*Мк))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mark"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јеванђеље[\s\xa0]*по[\s\xa0]*Марку|Еванђеље[\s\xa0]*по[\s\xa0]*Марку|М(?:арк[oо]|к)|Mark)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Luke"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Јеванђеље[\s\xa0]*по[\s\xa0]*Луки|Еванђеље[\s\xa0]*по[\s\xa0]*Луки|Л(?:ук[aа]|к)|Luke)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|(?:1\.|I)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|(?:1\.|I)[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|1(?:[\s\xa0]*посланица[\s\xa0]*Јованова|[\s\xa0]*Јованова|John|[\s\xa0]*Јн))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|(?:II|2\.)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|(?:II|2\.)[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|2(?:[\s\xa0]*посланица[\s\xa0]*Јованова|[\s\xa0]*Јованова|John|[\s\xa0]*Јн))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Трећ(?:ом[\s\xa0]*(?:посланица[\s\xa0]*)?|а[\s\xa0]*(?:посланица[\s\xa0]*)?)Јованова|(?:III|3\.)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|(?:III|3\.)[\s\xa0]*(?:посланица[\s\xa0]*)?Јованова|3(?:[\s\xa0]*посланица[\s\xa0]*Јованова|[\s\xa0]*Јованова|John|[\s\xa0]*Јн))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["John"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ј(?:еванђеље[\s\xa0]*по[\s\xa0]*Јовану|(?:ова)?н)|Еванђеље[\s\xa0]*по[\s\xa0]*Јовану|John)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Acts"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Д(?:ела(?:[\s\xa0]*Апостолска)?|ап)|Acts)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rom"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Римљанима|Римљанима|Рим|Rom)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:посланица[\s\xa0]*)?Коринћанима|(?:II|2\.)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Коринћанима|(?:II|2\.)[\s\xa0]*(?:посланица[\s\xa0]*)?Коринћанима|2(?:[\s\xa0]*посланица[\s\xa0]*Коринћанима|[\s\xa0]*Коринћанима|[\s\xa0]*Кор|Cor))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:посланица[\s\xa0]*)?Коринћанима|(?:1\.|I)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Коринћанима|(?:1\.|I)[\s\xa0]*(?:посланица[\s\xa0]*)?Коринћанима|1(?:[\s\xa0]*посланица[\s\xa0]*Коринћанима|[\s\xa0]*Коринћанима|[\s\xa0]*Кор|Cor))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Gal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Гала(?:ћан|т)има|Гала(?:ћан|т)има|Гал|Gal)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Ефесцима|Ефесцима|Eph|Еф)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phil"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Филипљанима|Фили[бп]љанима|Phil|Флп)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Col"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Колошанима|Колошанима|Кол|Col)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:посланица[\s\xa0]*)?Солуњанима|(?:II|2\.)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Солуњанима|(?:II|2\.)[\s\xa0]*(?:посланица[\s\xa0]*)?Солуњанима|2(?:[\s\xa0]*посланица[\s\xa0]*Солуњанима|[\s\xa0]*Солуњанима|Thess|[\s\xa0]*Сол))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:посланица[\s\xa0]*)?Солуњанима|(?:1\.|I)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Солуњанима|(?:1\.|I)[\s\xa0]*(?:посланица[\s\xa0]*)?Солуњанима|1(?:[\s\xa0]*посланица[\s\xa0]*Солуњанима|[\s\xa0]*Солуњанима|Thess|[\s\xa0]*Сол))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:посланица[\s\xa0]*Тимоте|Тимот[еи])ју|(?:II|2\.)\.[\s\xa0]*(?:посланица[\s\xa0]*Тимоте|Тимот[еи])ју|(?:II|2\.)[\s\xa0]*(?:посланица[\s\xa0]*Тимоте|Тимот[еи])ју|2(?:[\s\xa0]*посланица[\s\xa0]*Тимотеју|[\s\xa0]*Тимот[еи]ју|[\s\xa0]*Тим|Tim))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:1Tim)|(?:Прва(?:[\s\xa0]*(?:посланица[\s\xa0]*)?Тимотеју)?|(?:1\.\.?|I\.?)[\s\xa0]*(?:посланица[\s\xa0]*)?Тимотеју|1[\s\xa0]*посланица[\s\xa0]*Тимотеју|1[\s\xa0]*Тимотеју|Тимотију|1(?:[\s\xa0]*Тим)?|I)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Titus"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Титу|Titus|Титу|Тит)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phlm"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Филимону|Филимону|Phlm|Фил)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Heb"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Јеврејима|Jevrejima|Јеврејима|Јев|Heb)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jas"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Јаковљева|Јаковљева|Јаковова|Јак(?:ов)?|Jas)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Друга[\s\xa0]*(?:посланица[\s\xa0]*)?Петрова|(?:II|2\.)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Петрова|(?:II|2\.)[\s\xa0]*(?:посланица[\s\xa0]*)?Петрова|2(?:[\s\xa0]*посланица[\s\xa0]*Петрова|[\s\xa0]*Петрова|[\s\xa0]*Петр?|Pet))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏЀ-ҁ҃-҇Ҋ-ԧḀ-ỿⱠ-Ɀⷠ-ⷿꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Прва[\s\xa0]*(?:посланица[\s\xa0]*)?Петрова|(?:1\.|I)\.[\s\xa0]*(?:посланица[\s\xa0]*)?Петрова|(?:1\.|I)[\s\xa0]*(?:посланица[\s\xa0]*)?Петрова|1(?:[\s\xa0]*посланица[\s\xa0]*Петрова|[\s\xa0]*Петрова|[\s\xa0]*Петр?|Pet))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jude"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Посланица[\s\xa0]*Јудина|Ј(?:аковљевог|уде|д)|Јудина|Jude)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Tob"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Књига[\s\xa0]*Товијина|Тобија|Товит|Тов|Tob)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jdt"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Књига[\s\xa0]*о[\s\xa0]*Јудити|Јудита|Јуд|Jdt)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Варух|Барух|Вар|Bar)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sus"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Sus)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	]
	# Short-circuit the look if we know we want all the books.
	return books if include_apocrypha is true and case_sensitive is "none"
	# Filter out books in the Apocrypha if we don't want them. `Array.map` isn't supported below IE9.
	out = []
	for book in books
		continue if include_apocrypha is false and book.apocrypha? and book.apocrypha is true
		if case_sensitive is "books"
			book.regexp = new RegExp book.regexp.source, "g"
		out.push book
	out

# Default to not using the Apocrypha
bcv_parser::regexps.books = bcv_parser::regexps.get_books false, "none"
