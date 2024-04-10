bcv_parser::regexps.space = "[\\s\\xa0]"
bcv_parser::regexps.escaped_passage = ///
	(?:^ | [^\x1f\x1e\dA-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ] )	# Beginning of string or not in the middle of a word or immediately following another book. Only count a book if it's part of a sequence: `Matt5John3` is OK, but not `1Matt5John3`
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
				  | see#{bcv_parser::regexps.space}+also | ff(?![a-z0-9]) | f(?![a-z0-9]) | chapters | chapter | through | compare | chapts | verses | chpts | chapt | chaps | verse | chap | thru | also | chp | chs | cha | and | see | ver | vss | ch | to | cf | vs | vv | v
				  | [a-e] (?! \w )			#a-e allows 1:1a
				  | $						#or the end of the string
				 )+
		)
	///gi
# These are the only valid ways to end a potential passage match. The closing parenthesis allows for fully capturing parentheses surrounding translations (ESV**)**. The last one, `[\d\x1f]` needs not to be +; otherwise `Gen5ff` becomes `\x1f0\x1f5ff`, and `adjust_regexp_end` matches the `\x1f5` and incorrectly dangles the ff.
bcv_parser::regexps.match_end_split = ///
	  \d \W* title
	| \d \W* (?:ff(?![a-z0-9])|f(?![a-z0-9])) (?: [\s\xa0*]* \.)?
	| \d [\s\xa0*]* [a-e] (?! \w )
	| \x1e (?: [\s\xa0*]* [)\]\uff09] )? #ff09 is a full-width closing parenthesis
	| [\d\x1f]
	///gi
bcv_parser::regexps.control = /[\x1e\x1f]/g
bcv_parser::regexps.pre_book = "[^A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ]"

bcv_parser::regexps.first = "(?:1st|1|I|First)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.second = "(?:2nd|2|II|Second)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.third = "(?:3rd|3|III|Third)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.range_and = "(?:[&\u2013\u2014-]|(?:and|compare|cf|see#{bcv_parser::regexps.space}+also|also|see)|(?:through|thru|to))"
bcv_parser::regexps.range_only = "(?:[\u2013\u2014-]|(?:through|thru|to))"
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
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:G(?:e(?:n(?:n(?:(?:i[ei]s[eiu]|is[eiu]|si)s|e(?:is(?:[eiu]s)?|es[eiu]s|s[eiu]s))|(?:eis[eiu]|esu|si)s|(?:ee|i[ei])s[eiu]s|es[ei]s|is[eiu]s|es[ei]|eis)?)?|n))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Exod"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ex(?:o(?:d(?:[iu]s|[es])?)?|d)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bel"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Bel(?:[\s\xa0]*(?:and[\s\xa0]*(?:the[\s\xa0]*(?:S(?:erpent|nake)|Dragon)|S(?:erpent|nake)|Dragon)|&[\s\xa0]*(?:the[\s\xa0]*(?:S(?:erpent|nake)|Dragon)|S(?:erpent|nake)|Dragon)))?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:L(?:iv[ei]t[ei]?cus|e(?:v(?:it[ei]?cus|et[ei]?cus|i)?)?|v))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Num"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:N(?:u(?:m(?:b(?:ers?)?)?)?|m))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sir"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Wisdom[\s\xa0]*of[\s\xa0]*Jesus(?:,[\s\xa0]*Son[\s\xa0]*of|[\s\xa0]*(?:Son[\s\xa0]*of|ben))[\s\xa0]*Sirach|Wisdom[\s\xa0]*of[\s\xa0]*Jesus(?:,[\s\xa0]*Son[\s\xa0]*of|[\s\xa0]*(?:Son[\s\xa0]*of|ben))[\s\xa0]*Sirach|Ecc(?:l[eu]siasticu)?s|Ben[\s\xa0]*Sira|Ecclus|Sirach|Sir)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Wis"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Wis(?:d(?:om)?|om)?[\s\xa0]*of[\s\xa0]*Solomon|Wis(?:(?:d(?:om)?)?[\s\xa0]*of[\s\xa0]*Solomon|om[\s\xa0]*of[\s\xa0]*Solomon|d(?:om)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lam"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:L(?:a(?:m(?:[ei]ntations?)?)?|m))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["EpJer"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*(?:Ep(?:istle|\.)?|Let(?:ter|\.)?)[\s\xa0]*of[\s\xa0]*Jeremiah|Ep(?:istle[\s\xa0]*of[\s\xa0]*Jeremiah|istle[\s\xa0]*of[\s\xa0]*Jeremy|[\s\xa0]*of[\s\xa0]*Jeremiah|[\s\xa0]*?Jer)|(?:Let(?:ter|\.)|Ep\.)[\s\xa0]*of[\s\xa0]*Jeremiah|Let[\s\xa0]*of[\s\xa0]*Jeremiah)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:R(?:e(?:v(?:elations?|[ao]lations?|lations?|el)?)?|v))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrMan"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Pr(?:ayer(?:s[\s\xa0]*(?:of[\s\xa0]*)?|[\s\xa0]*(?:of[\s\xa0]*)?)|[\s\xa0]*(?:of[\s\xa0]*)?)Manasseh|Pr(?:ayer(?:s[\s\xa0]*(?:of[\s\xa0]*)?|[\s\xa0]*(?:of[\s\xa0]*)?)Manasseh|[\s\xa0]*of[\s\xa0]*Manasseh|[\s\xa0]*Manasseh|[\s\xa0]*?Man))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Deut"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:D(?:uet[eo]rono?my|uut(?:[eo]rono?|rono?)my|e(?:u(?:t[eo]rono?my|trono?my|t)?|et(?:[eo]rono?|rono?)my)|uetrono?my|(?:ue)?t))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Josh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:o(?:ush?ua|s(?:h?ua|h)?)|sh))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Judg"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:udg(?:es)?|d?gs|d?g))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ruth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:R(?:u(?:th?)?|th?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*Esd(?:r(?:as)?)?|(?:1(?:st)?|I)\.[\s\xa0]*Esd(?:r(?:as)?)?|(?:1(?:st)?|I)[\s\xa0]*Esd(?:r(?:as)?)?|1Esd)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*Esd(?:r(?:as)?)?|(?:2(?:nd)?|II)\.[\s\xa0]*Esd(?:r(?:as)?)?|(?:2(?:nd)?|II)[\s\xa0]*Esd(?:r(?:as)?)?|2Esd)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Isa"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:I(?:s(?:i[ai](?:[ai](?:[ai]ha?|ha?)|ha?)|a(?:i[ai](?:[ai]ha?|ha?)|a(?:[ai](?:[ai]ha?|ha?)|ha?)|isha?|i?ha?|i)?|sah|iha)?|a))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:2[\s\xa0]*Sma)|(?:2[\s\xa0]*Sm)|(?:Second[\s\xa0]*(?:Kingdoms|S(?:amu[ae]l[ls]|a(?:m(?:u[ae]l)?)?|ma|m))|(?:2(?:nd)?|II)\.[\s\xa0]*(?:Kingdoms|S(?:amu[ae]l[ls]|a(?:m(?:u[ae]l)?)?|ma|m))|(?:2nd|II)[\s\xa0]*(?:Kingdoms|S(?:amu[ae]l[ls]|a(?:m(?:u[ae]l)?)?|ma|m))|2(?:[\s\xa0]*Kingdoms|[\s\xa0]*Samu[ae]l[ls]|[\s\xa0]*S(?:a(?:m(?:u[ae]l)?)?)?|Sam))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:1[\s\xa0]*Sma)|(?:1[\s\xa0]*Sm)|(?:First[\s\xa0]*(?:Kingdoms|S(?:amu[ae]l[ls]|a(?:m(?:u[ae]l)?)?|ma|m))|(?:1(?:st)?|I)\.[\s\xa0]*(?:Kingdoms|S(?:amu[ae]l[ls]|a(?:m(?:u[ae]l)?)?|ma|m))|(?:1st|I)[\s\xa0]*(?:Kingdoms|S(?:amu[ae]l[ls]|a(?:m(?:u[ae]l)?)?|ma|m))|1(?:[\s\xa0]*Kingdoms|[\s\xa0]*Samu[ae]l[ls]|[\s\xa0]*S(?:a(?:m(?:u[ae]l)?)?)?|Sam))|(?:Samu[ae]l[ls]?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Fourth[\s\xa0]*Kingdoms|(?:4(?:th)?|IV)\.[\s\xa0]*Kingdoms|(?:(?:Second|2\.)[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2nd(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|II(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|2[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)s|(?:4(?:th)?|IV)[\s\xa0]*Kingdoms|(?:Second|2\.)[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2nd(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|II(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|2[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|2Kgs)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Third[\s\xa0]*Kingdoms|(?:III|3(?:rd)?)\.[\s\xa0]*Kingdoms|(?:III|3(?:rd)?)[\s\xa0]*Kingdoms|(?:(?:First|1(?:st)?\.)[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?|1(?:st)?[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?|I(?:\.[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)|ng?|g)?))s|(?:First|1(?:st)?\.)[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|1(?:st)?[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|I(?:\.[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?|[\s\xa0]*K(?:i(?:ng?|g)?|ng?|g)?)|1Kgs)|(?:K(?:in(?:gs)?|n?gs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:2[\s\xa0]*C(?:hr(?:on(?:ocle|ic(?:le|al))s|n)|ron[io]cles))|(?:2[\s\xa0]*C(?:hron[io]|ron[io])cle)|(?:2[\s\xa0]*Chron)|(?:2[\s\xa0]*Chro)|(?:2[\s\xa0]*?Chr)|(?:Second[\s\xa0]*(?:Paralipomenon|C(?:h(?:oron[io]cles|r(?:onicals|onicles|onocles|n))|h(?:oron[io]cle|r(?:onicle|onocle|on?)?)|(?:oron[io]|ron[io])cles|oron[io]cle|ron(?:[io]cle)?))|(?:2(?:nd)?|II)\.[\s\xa0]*(?:Paralipomenon|C(?:h(?:oron[io]cles|r(?:onicals|onicles|onocles|n))|h(?:oron[io]cle|r(?:onicle|onocle|on?)?)|(?:oron[io]|ron[io])cles|oron[io]cle|ron(?:[io]cle)?))|(?:2nd|II)[\s\xa0]*(?:Paralipomenon|C(?:h(?:oron[io]cles|r(?:onicals|onicles|onocles|n))|h(?:oron[io]cle|r(?:onicle|onocle|on?)?)|(?:oron[io]|ron[io])cles|oron[io]cle|ron(?:[io]cle)?))|2[\s\xa0]*(?:Paralipomenon|C(?:h?oron[io]cles|h?oron[io]cle|ron|h)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:1[\s\xa0]*C(?:(?:oron[io]|ron[io])cles|hr(?:on(?:ocle|ic(?:le|al))s|n)))|(?:1[\s\xa0]*C(?:hron[io]|ron[io])cle)|(?:1[\s\xa0]*Chron)|(?:1[\s\xa0]*Chro)|(?:1[\s\xa0]*?Chr)|(?:First[\s\xa0]*(?:Paralipomenon|C(?:h(?:oron[io]cles|r(?:onicles|onocles|onicals|n))|h(?:oronocle|r(?:onicle|onocle|on?)?)|(?:oron[io]|ron[io])cles|(?:oron[io]|ron[io])cle|ron))|(?:1(?:st)?|I)\.[\s\xa0]*(?:Paralipomenon|C(?:h(?:oron[io]cles|r(?:onicles|onocles|onicals|n))|h(?:oronocle|r(?:onicle|onocle|on?)?)|(?:oron[io]|ron[io])cles|(?:oron[io]|ron[io])cle|ron))|(?:1st|I)[\s\xa0]*(?:Paralipomenon|C(?:h(?:oron[io]cles|r(?:onicles|onocles|onicals|n))|h(?:oronocle|r(?:onicle|onocle|on?)?)|(?:oron[io]|ron[io])cles|(?:oron[io]|ron[io])cle|ron))|1[\s\xa0]*Paralipomenon|1[\s\xa0]*Choron[io]cles|1[\s\xa0]*Ch(?:oronocle)?|(?:1[\s\xa0]*Coron[io]|Choroni)cle|1[\s\xa0]*Cron)|(?:Paralipomenon|C(?:(?:h(?:oron[io]cle|ron(?:ic(?:al|le)|ocle))|(?:oron[io]|ron[io])cle)s|(?:h(?:orono|ron[io])|oron[io]|ron[io])cle))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezra"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:E(?:zra?|sra))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Neh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ne(?:h(?:[ei]m(?:i(?:a[ai]h|i[ai]?h|a?h|a)|a(?:[ai][ai]?)?h)|amiah|amia)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["GkEsth"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Esther[\s\xa0]*\(Greek\)|G(?:r(?:eek[\s\xa0]*Esther|[\s\xa0]*Esth)|r(?:eek[\s\xa0]*Esth?|[\s\xa0]*Est)|k[\s\xa0]*?Esth|k[\s\xa0]*Est))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Esth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Es(?:t(?:h(?:er|r)?|er)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Job"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Jo?b)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ps"]
		extra: "1"
		regexp: ///(\b)((?:
			  (?: (?: 1 [02-5] | [2-9] )? (?: 1 #{bcv_parser::regexps.space}* st | 2 #{bcv_parser::regexps.space}* nd | 3 #{bcv_parser::regexps.space}* rd ) ) # Allow 151st Psalm
			| 1? 1 [123] #{bcv_parser::regexps.space}* th
			| (?: 150 | 1 [0-4] [04-9] | [1-9] [04-9] | [4-9] )  #{bcv_parser::regexps.space}* th
			)
			#{bcv_parser::regexps.space}* Psalm
			)\b///gi
	,
		osis: ["Ps"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:P(?:(?:s(?:malm|lalm|a(?:ml?m|l(?:m[alm]|am)|llm|alm)|lam|ml)|a(?:sl|ls)m)s?|l(?:s(?:sss|a?m)s?|a(?:s(?:m(?:as?|s)?|s)?|m(?:a?s)?|as?)|s(?:ss?|a)|ms)|s(?:mals|a(?:m(?:l[as]|s)|l(?:m|a)?s|aa)|lm[ms]|[ms]m)|(?:a(?:s(?:ml|s)|m[ls]|l[lm])|s(?:lma|a(?:ma|am)))s|s(?:mal|a(?:ml?|l(?:m|a)?)?|ma?|l[am]|s)?|asms)|Salms?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrAzar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Pr(?:ayer(?:s[\s\xa0]*of[\s\xa0]*Azariah?|[\s\xa0]*of[\s\xa0]*Azariah?)|[\s\xa0]*of[\s\xa0]*Azariah?)|Prayer(?:s[\s\xa0]*of[\s\xa0]*Azariah?|[\s\xa0]*of[\s\xa0]*Azariah?)|Pr[\s\xa0]*of[\s\xa0]*Azariah?|Pr(?:[\s\xa0]*Aza|Aza?)r|Azariah?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Prov"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Provebs)|(?:P(?:r(?:o(?:bv?erbs|verbs|v(?:erb)?)?|(?:e?ver|v)bs|e?verb|vb|v)?|or?verbs|v)|Oroverbs)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eccl"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ec(?:c(?:l(?:es(?:i(?:a(?:ia?stes|(?:sti|at)es|astes|s?tes|ste?|te)|(?:ias|s)?tes)|(?:sia|ai?)stes|(?:sai|aia)stes|(?:sia|ai)tes)?)?)?|lesiaiastes|les(?:sia|i)stes|lesiastes|less?iates|lesiaste|l)?|Qo(?:heleth|h)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["SgThree"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:The[\s\xa0]*Song[\s\xa0]*of[\s\xa0]*(?:the[\s\xa0]*(?:Three[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s)|3[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s))|Three[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s)|3[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s))|S(?:\.[\s\xa0]*(?:of[\s\xa0]*(?:Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|[\s\xa0]*(?:of[\s\xa0]*(?:Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|Th(?:ree(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y))|3(?:\.[\s\xa0]*(?:Ch|Y)|[\s\xa0]*(?:Ch|Y)))|(?:ong[\s\xa0]*|ng[\s\xa0]*|g[\s\xa0]*?)Three|g[\s\xa0]*Thr))|(?:Song[\s\xa0]*of[\s\xa0]*(?:the[\s\xa0]*(?:Three[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s)|3[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s))|Three[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s)|3[\s\xa0]*(?:Holy[\s\xa0]*Children|Young[\s\xa0]*Men|(?:Youth|Jew)s)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Song"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Song(?:s[\s\xa0]*of[\s\xa0]*S(?:o(?:lom[ao]ns?|ngs?)|alom[ao]ns?)|[\s\xa0]*of[\s\xa0]*S(?:o(?:lom[ao]ns?|ngs?)|alom[ao]ns?))|S(?:[\s\xa0]*of[\s\xa0]*S|n?gs?|o[Sln]|o|S))|(?:Song(?:s(?:[\s\xa0]*of[\s\xa0]*S(?:alom[ao]ns?|o(?:lom[ao]ns?|ngs?)))?|[\s\xa0]*of[\s\xa0]*S(?:alom[ao]ns?|o(?:lom[ao]ns?|ngs?)))?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jer"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:e(?:r(?:e(?:m(?:a(?:ia?)?h|i(?:ha|ah|ih|h|a|e)?))?|amiha|amiah|(?:im(?:i[ai]|a)|a(?:m[ai]i|ia)|m[im]a)h|amih|amia|(?:imi|ama)h)?)?|r))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezek"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:E(?:z(?:e[ei]ki?el|i(?:[ei]ki?|ki?)el|ek(?:i[ae]|e)l|ek?|k)|x[ei](?:[ei]ki?|ki?)el))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Dan"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:D(?:a(?:n(?:i[ae]l)?)?|[ln]))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:H(?:o(?:s(?:ea)?)?|s))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Joel"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:oel?|l))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Amos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Am(?:os?|s)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Obad"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ob(?:a(?:d(?:iah?)?)?|idah|d)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jonah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:on(?:ah)?|nh))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mic"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mi(?:c(?:hah?|ah?)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Nah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Na(?:h(?:um?)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hab"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Hab(?:bak(?:k[au]kk?|[au]kk?)|ak(?:k[au]kk?|[au]kk?)|k)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zeph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Z(?:e(?:p(?:h(?:an(?:aiah?|iah?))?)?|faniah?)|a(?:ph|f)aniah?|ph?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hag"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:H(?:ag(?:g(?:ia[hi]|ai)?|ai)?|gg?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zech"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Z(?:ec(?:h(?:[ae]r(?:i(?:a?h|ih|a)|a[ai]?h))?)?|a(?:c(?:h(?:[ae]r(?:i(?:a?h|ih|a)|a[ai]?h))?)?|kariah)|(?:ekaria|c)h|ekaria|c))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mal(?:ichi|ac(?:hi?|i))?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Matt"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)|t(?:\.[\s\xa0]*M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)|[\s\xa0]*M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)))|M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)|t(?:\.[\s\xa0]*M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)|[\s\xa0]*M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)))|M(?:at(?:t(?:th|h[ht])i?ew|h(?:[ht](?:[ht]i?|i)?|i)?ew|t(?:t|h)?iew|th?we|t(?:t|h)?ew|t)?|t)))|Mtt)|(?:Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)|t(?:\.[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)|[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)))|M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)|t(?:\.[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)|[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)))|M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)))|S(?:aint[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)|t(?:\.[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)|[\s\xa0]*M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t)))|M(?:at(?:h[ht][ht]i?ew|t(?:h[ht]i?ew|t(?:hi?|i)?ew|h?iew|h?we|h?ew)?|h[ht]?iew|h[ht]?ew)?|t))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mark"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:ark?|rk?|k)|t(?:\.[\s\xa0]*M(?:ark?|rk?|k)|[\s\xa0]*M(?:ark?|rk?|k)))|M(?:ark?|rk?|k))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:ark?|rk?|k)|t(?:\.[\s\xa0]*M(?:ark?|rk?|k)|[\s\xa0]*M(?:ark?|rk?|k)))|M(?:ark?|rk?|k))))|(?:Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:ark?|rk?|k)|t(?:\.[\s\xa0]*M(?:ark?|rk?|k)|[\s\xa0]*M(?:ark?|rk?|k)))|M(?:ark?|rk?|k))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*M(?:ark?|rk?|k)|t(?:\.[\s\xa0]*M(?:ark?|rk?|k)|[\s\xa0]*M(?:ark?|rk?|k)))|M(?:ark?|rk?|k)))|S(?:aint[\s\xa0]*M(?:ark?|rk?|k)|t(?:\.[\s\xa0]*M(?:ark?|rk?|k)|[\s\xa0]*M(?:ark?|rk?|k)))|M(?:ark?|rk?|k))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Luke"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*L(?:u(?:ke?)?|k)|t(?:\.[\s\xa0]*L(?:u(?:ke?)?|k)|[\s\xa0]*L(?:u(?:ke?)?|k)))|L(?:u(?:ke?)?|k))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*L(?:u(?:ke?)?|k)|t(?:\.[\s\xa0]*L(?:u(?:ke?)?|k)|[\s\xa0]*L(?:u(?:ke?)?|k)))|L(?:u(?:ke?)?|k))))|(?:Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*L(?:u(?:ke?)?|k)|t(?:\.[\s\xa0]*L(?:u(?:ke?)?|k)|[\s\xa0]*L(?:u(?:ke?)?|k)))|L(?:u(?:ke?)?|k))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*L(?:u(?:ke?)?|k)|t(?:\.[\s\xa0]*L(?:u(?:ke?)?|k)|[\s\xa0]*L(?:u(?:ke?)?|k)))|L(?:u(?:ke?)?|k)))|S(?:aint[\s\xa0]*L(?:u(?:ke?)?|k)|t(?:\.[\s\xa0]*L(?:u(?:ke?)?|k)|[\s\xa0]*L(?:u(?:ke?)?|k)))|L(?:u(?:ke?)?|k))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|(?:1(?:st)?|I)\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|(?:1(?:st)?|I)[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|1John)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|(?:2(?:nd)?|II)\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|(?:2(?:nd)?|II)[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|2John)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Third[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|(?:III|3(?:rd)?)\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|(?:III|3(?:rd)?)[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)?|h[ho]n|phn|h?n|h)|3John)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["John"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|t(?:\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)))|J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|t(?:\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)))|J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h))))|(?:Gospel[\s\xa0]*(?:according[\s\xa0]*to[\s\xa0]*(?:S(?:aint[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|t(?:\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)))|J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h))|of[\s\xa0]*(?:S(?:aint[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|t(?:\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)))|J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)))|S(?:aint[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|t(?:\.[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)|[\s\xa0]*J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h)))|J(?:o(?:phn|nh|h[mn]|on|h)|h[ho]n|phn|h?n|h))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Acts"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:The[\s\xa0]*Acts[\s\xa0]*of[\s\xa0]*the[\s\xa0]*Apostles|Ac(?:ts[\s\xa0]*of[\s\xa0]*the[\s\xa0]*Apostles|tsss|t(?:ss?)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rom"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:R(?:o(?:m(?:a(?:n(?:ds|s)?|sn)|s)?|amns|s)?|pmans|m(?:n?s|n)?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*C(?:o(?:r(?:i(?:inthii?ans|(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ia|ai))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|n(?:thia?ns|t(?:h(?:ian)?)?)?)|(?:(?:rin?tha|ntha)i|nithaia|ninthai|nthia)ns|(?:(?:rin?|nin?)th|nthi|anth)ians|n(?:ithai?|intha|thi)ns|thians|th(?:ian)?)?)?|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)|(?:2(?:nd)?|II)\.[\s\xa0]*C(?:o(?:r(?:i(?:inthii?ans|(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ia|ai))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|n(?:thia?ns|t(?:h(?:ian)?)?)?)|(?:(?:rin?tha|ntha)i|nithaia|ninthai|nthia)ns|(?:(?:rin?|nin?)th|nthi|anth)ians|n(?:ithai?|intha|thi)ns|thians|th(?:ian)?)?)?|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)|(?:2(?:nd)?|II)[\s\xa0]*C(?:o(?:r(?:i(?:inthii?ans|(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ia|ai))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|n(?:thia?ns|t(?:h(?:ian)?)?)?)|(?:(?:rin?tha|ntha)i|nithaia|ninthai|nthia)ns|(?:(?:rin?|nin?)th|nthi|anth)ians|n(?:ithai?|intha|thi)ns|thians|th(?:ian)?)?)?|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)|2Cor)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*C(?:o(?:r(?:i(?:inthii?ans|(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ia|ai))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|n(?:thia?ns|t(?:h(?:ian)?)?)?)|(?:(?:rin?tha|ntha)i|nithaia|ninthai|nthia)ns|(?:(?:rin?|nin?)th|nthi|anth)ians|n(?:ithai?|intha|thi)ns|thians|th(?:ian)?)?)?|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)|(?:1(?:st)?|I)\.[\s\xa0]*C(?:o(?:r(?:i(?:inthii?ans|(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ia|ai))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|n(?:thia?ns|t(?:h(?:ian)?)?)?)|(?:(?:rin?tha|ntha)i|nithaia|ninthai|nthia)ns|(?:(?:rin?|nin?)th|nthi|anth)ians|n(?:ithai?|intha|thi)ns|thians|th(?:ian)?)?)?|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)|(?:1(?:st)?|I)[\s\xa0]*C(?:o(?:r(?:i(?:inthii?ans|(?:n(?:th(?:i(?:an[ao]|na)|ai?n)|ith(?:ina|an))|th[ai]n)s|(?:n(?:t(?:h(?:i(?:a[ai]|o)|aia)|i[ao])|ith(?:ia|ai))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|n(?:thia?ns|t(?:h(?:ian)?)?)?)|(?:(?:rin?tha|ntha)i|nithaia|ninthai|nthia)ns|(?:(?:rin?|nin?)th|nthi|anth)ians|n(?:ithai?|intha|thi)ns|thians|th(?:ian)?)?)?|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns)|1Cor)|(?:C(?:or(?:i(?:inthii?ans|(?:n(?:ith(?:ina|an)|th(?:i(?:an[ao]|na)|ai?n))|th[ai]n)s|(?:n(?:ith(?:ai|ia)|t(?:h(?:aia|i(?:a[ai]|o))|i[ao]))|th(?:ia|ai))ns|(?:n(?:thi|[an]th)i|th(?:ii|o))ans|nthoi?ans|nthi(?:a?ns|an))|(?:(?:rin?tha|ntha)i|ninthai|nithaia|(?:(?:rin?|nin?)th|nthi)ia|n(?:intha|ithai?|thi)|nthia)ns)|hor(?:inth(?:ai|ia|i)|(?:a?n|i)thia)ns))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Gal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:G(?:a(?:l(?:lati[ao]?ns|a(?:t(?:(?:i(?:on[an]|nan|an[ai])|o?n)s|(?:i(?:oa|a[ai])|oa)ns|ii[ao]?ns|a(?:i[ao]?n|[ao]n|n)?s|i(?:on?|na?|an?)s|ian)?)?)?)?|l))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:E(?:sphesians|p(?:e(?:he)?sians|h(?:i?sians|es(?:ian[ds]|ains))|hesions|h(?:i?sian|e(?:s(?:ian|ain)?)?|s)?)?|hp(?:[ei]sians)?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phil"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Phlpp)|(?:Ph(?:i(?:l(?:l(?:(?:l(?:ipi|i?pp|p)ia|p(?:ie|a))ns|i(?:p(?:p(?:(?:pia|ai)ns|i(?:(?:[ei]a)?ns|a(?:ins|ns?))|eans?|ans)|(?:i(?:ea|a[ai])|aia|iia)ns|(?:ia|ai?|ea)ns|ie?ns|(?:ia|ai?|ea)n)?)?|(?:li|p)?pians|(?:li|p)?pian)|(?:ipp(?:pi|e)a|ip(?:p(?:ia|[ai])|ai?)|(?:i|p)?pia)ns|(?:ip(?:pai|e)a|ippia[ai]|(?:ipp?ii|ppii|pppi|pe)a|ipp?ie|ipaia|pai)ns|(?:ipp(?:pi|e)a|ip(?:p(?:ia|[ai])|ai?)|(?:i|p)?pia)n|(?:ip(?:pai|e)|i?pi)ns|i(?:pp?)?|pan|pp?)?)?|lipp?ians|lipp?|l?p))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Col"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:C(?:al(?:l(?:os(?:sia|i[ao])|asi[ao])|(?:[ao]s|[ao])si[ao])ns|o(?:lossians|l(?:oss(?:io|a)|(?:as|l[ao]|[ao])si[ao])ns|l(?:oss(?:ian)?)?)?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a|e)ns|[ao]ns|[ao]n|ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|elonains|[eo]lonian|olonins)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|sss|ss|s)?|(?:2(?:nd)?|II)\.[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a|e)ns|[ao]ns|[ao]n|ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|elonains|[eo]lonian|olonins)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|sss|ss|s)?|(?:2(?:nd)?|II)[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a|e)ns|[ao]ns|[ao]n|ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|elonains|[eo]lonian|olonins)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|sss|ss|s)?|2Thess)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a|e)ns|[ao]ns|[ao]n|ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|elonains|[eo]lonian|olonins)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|sss|ss|s)?|(?:1(?:st)?|I)\.[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a|e)ns|[ao]ns|[ao]n|ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|elonains|[eo]lonian|olonins)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|sss|ss|s)?|(?:1(?:st)?|I)[\s\xa0]*Th(?:es(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a|e)ns|[ao]ns|[ao]n|ns)|(?:(?:oi?|e)a|cie|aia)ns|a(?:ins?|ns))|lonians)|(?:[eo]lonian)?s|elonains|[eo]lonian|olonins)?|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins)?|sss|ss|s)?|1Thess)|(?:Thes(?:s(?:al(?:on(?:i(?:c(?:i[ae]|a)ns|(?:io|[ao]a)ns|[ao]ns|[ao]n|ns)|(?:cie|oi?a|aia|ea)ns|a(?:ins?|ns))|lonians)|[eo]lonians|elonains|[eo]lonian|olonins)|(?:al(?:oni[ci]|loni)a|alonio|elonai)ns|[aeo]lonians|[aeo]lonian|alonins))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*T(?:himoth?y|imoth?y|omothy|i(?:m(?:oth)?)?|m)|(?:2(?:nd)?|II)\.[\s\xa0]*T(?:himoth?y|imoth?y|omothy|i(?:m(?:oth)?)?|m)|(?:2(?:nd)?|II)[\s\xa0]*T(?:himoth?y|imoth?y|omothy|i(?:m(?:oth)?)?|m)|2Tim)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*T(?:himoth?y|imoth?y|omothy|i(?:m(?:oth)?)?|m)|(?:1(?:st)?|I)\.[\s\xa0]*T(?:himoth?y|imoth?y|omothy|i(?:m(?:oth)?)?|m)|(?:1(?:st)?|I)[\s\xa0]*T(?:himoth?y|imoth?y|omothy|i(?:m(?:oth)?)?|m)|1Tim)|(?:Timothy?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Titus"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ti(?:t(?:us)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phlm"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ph(?:ile(?:m(?:on)?)?|l[ei]mon|l?mn|l?m))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Heb"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:H(?:(?:w[ew]breww?|w?breww?)s|e(?:[ew]breww?s|b(?:(?:r(?:eww|we|rw)|w(?:re|er)|ew[erw]|erw)s|r(?:ew?|w)?s|rew)?)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jas"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:a(?:m(?:es?)?|s)?|ms?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|(?:2(?:nd)?|II)\.[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|(?:2(?:nd)?|II)[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|2Pet)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|(?:1(?:st)?|I)\.[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|(?:1(?:st)?|I)[\s\xa0]*P(?:e(?:t(?:er?|r)?|r)?|tr?)?|1Pet)|(?:Peter)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jude"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ju?de)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Tob"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:T(?:ob(?:i(?:as|t)?|t)?|b))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jdt"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:ud(?:ith?|th?)|d(?:ith?|th?)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:B(?:ar(?:uch)?|r))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sus"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:S(?:us(?:annah|anna)?|hoshana))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Second[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:2(?:nd)?|II)\.[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:2nd|II)[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|2(?:[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c|[\s\xa0]*Ma))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Third[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:III|3(?:rd)?)\.[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:III|3rd)[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|3(?:[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["4Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Fourth[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:4(?:th)?|IV)\.[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:4th|IV)[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|4(?:[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:First[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:1(?:st)?|I)\.[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:1st|I)[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|1(?:[\s\xa0]*Mac(?:c(?:cabbbe|abe(?:ee?)?s)|c(?:ca|ab)bbe[es]?|c(?:ca|ab)be(?:e[es]?|s)?|ab(?:b(?:e(?:(?:ee?)?s|ee?)?|be(?:e[es]?|s)?)|e(?:(?:ee?)?s|ee?)?)|cabe(?:ee?)?|cc?)?|(?:Mac|[\s\xa0]*M)c|[\s\xa0]*Ma))|(?:Maccabees)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezek", "Ezra"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ez)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hab", "Hag"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ha)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Heb", "Hab"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Hb)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["John", "Jonah", "Job", "Josh", "Joel"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Jo)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jude", "Judg"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:ud?|d))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Matt", "Mark", "Mal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ma)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phil", "Phlm"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ph)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zeph", "Zech"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ze)
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
