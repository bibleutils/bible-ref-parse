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
				  | (?:titik|pamagat) (?! [a-z] )		#could be followed by a number
				  | kapitulo | talatang | pangkat | pang | kap | tal | at | k | -
				  | [a-e] (?! \w )			#a-e allows 1:1a
				  | $						#or the end of the string
				 )+
		)
	///gi
# These are the only valid ways to end a potential passage match. The closing parenthesis allows for fully capturing parentheses surrounding translations (ESV**)**. The last one, `[\d\x1f]` needs not to be +; otherwise `Gen5ff` becomes `\x1f0\x1f5ff`, and `adjust_regexp_end` matches the `\x1f5` and incorrectly dangles the ff.
bcv_parser::regexps.match_end_split = ///
	  \d \W* (?:titik|pamagat)
	| \d \W* k (?: [\s\xa0*]* \.)?
	| \d [\s\xa0*]* [a-e] (?! \w )
	| \x1e (?: [\s\xa0*]* [)\]\uff09] )? #ff09 is a full-width closing parenthesis
	| [\d\x1f]
	///gi
bcv_parser::regexps.control = /[\x1e\x1f]/g
bcv_parser::regexps.pre_book = "[^A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ]"

bcv_parser::regexps.first = "(?:Unang|Una|1|I)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.second = "(?:Ikalawang|2|II)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.third = "(?:Ikatlong|3|III)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.range_and = "(?:[&\u2013\u2014-]|at|-)"
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
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Henesis|Gen(?:esis)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Exod"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ex(?:o(?:d(?:us|o)?)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bel"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Si[\s\xa0]*Bel[\s\xa0]*at[\s\xa0]*ang[\s\xa0]*Dragon|Bel(?:[\s\xa0]*at[\s\xa0]*ang[\s\xa0]*Dragon)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Le(?:b(?:iti(?:kus|co))?|v(?:itico)?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Num"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mga[\s\xa0]*Bilang|B[ae]midbar|Bilang|Bil|Num|Blg)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sir"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ang[\s\xa0]*Karunungan[\s\xa0]*ni[\s\xa0]*Jesus,?[\s\xa0]*Anak[\s\xa0]*ni[\s\xa0]*Sirac|Karunungan[\s\xa0]*ng[\s\xa0]*Anak[\s\xa0]*ni[\s\xa0]*Sirac|E(?:k(?:kles[iy]|les[iy])astik(?:us|o)|c(?:clesiastic(?:us|o)|lesiastico))|Sir(?:\xE1(?:[ck]id[ae]s|[ck]h)|a(?:k(?:id[ae]s|h)|c(?:id[ae]s|h)))|Sir(?:\xE1[ck]id[ae]|a(?:k(?:id[ae])?|cid[ae])|\xE1[ck])?)|(?:Sirac)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lam"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Aklat[\s\xa0]*ng[\s\xa0]*Pa(?:nan|gt)aghoy|Mga[\s\xa0]*Lamentasyon|Mga[\s\xa0]*Panaghoy|Panaghoy|Panag|Lam)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["EpJer"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ang[\s\xa0]*Liham[\s\xa0]*ni[\s\xa0]*Jeremias|Liham[\s\xa0]*ni[\s\xa0]*Jeremias|(?:Li(?:[\s\xa0]*ni|h)[\s\xa0]*|Ep)Jer)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Apo[ck](?:alipsis(?:[\s\xa0]*ni[\s\xa0]*Juan)?)?|Pahayag[\s\xa0]*kay[\s\xa0]*Juan|Rebelasyon|Pah(?:ayag)?|Rev)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrMan"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ang[\s\xa0]*Panalangin[\s\xa0]*ni[\s\xa0]*Manases|Panalangin[\s\xa0]*ni[\s\xa0]*Manases|Dalangin[\s\xa0]*ni[\s\xa0]*Manases|Dasal[\s\xa0]*ni[\s\xa0]*Manases|PrMan)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Deut"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:D(?:i?yuteronomyo|e(?:yuteronomyo|ut(?:eronom(?:i(?:y[ao]|[ao])?|y?a))?)|t))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Josh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Jos(?:h(?:ua)?|u[e\xE9])?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Judg"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mga[\s\xa0]*Hukom|Hukom|Judg|Huk)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ruth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ruth?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng[\s\xa0]*E(?:sdras|zra)|[\s\xa0]*E(?:sdras|zra))|[1I]\.[\s\xa0]*E(?:sdras|zra)|1(?:[\s\xa0]*Esdras|[\s\xa0]*Ezra|[\s\xa0]*Esd|Esd)|I[\s\xa0]*E(?:sdras|zra))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang[\s\xa0]*E(?:sdras|zra)|I(?:\.[\s\xa0]*E(?:sdras|zra)|[\s\xa0]*E(?:sdras|zra)))|2(?:\.[\s\xa0]*E(?:sdras|zra)|[\s\xa0]*Esdras|[\s\xa0]*Ezra|[\s\xa0]*Esd|Esd))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Isa"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Is(?:a(?:[i\xED]a[hs]?)?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang|I\.?)[\s\xa0]*Samuel|2(?:\.[\s\xa0]*Samuel|[\s\xa0]*Samuel|[\s\xa0]*?Sam))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng)?[\s\xa0]*Samuel|[1I]\.[\s\xa0]*Samuel|1(?:[\s\xa0]*Samuel|[\s\xa0]*?Sam)|I[\s\xa0]*Samuel)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:ka(?:lawang[\s\xa0]*(?:Mga[\s\xa0]*)?|apat[\s\xa0]*Mga[\s\xa0]*)|V\.?[\s\xa0]*Mga[\s\xa0]*|I\.[\s\xa0]*(?:Mga[\s\xa0]*)?|I[\s\xa0]*(?:Mga[\s\xa0]*)?)Hari|(?:4\.|[24])[\s\xa0]*Mga[\s\xa0]*Hari|2\.[\s\xa0]*(?:Mga[\s\xa0]*)?Hari|2(?:[\s\xa0]*Hari|[\s\xa0]*Ha|Kgs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:katlong[\s\xa0]*Mga|II\.[\s\xa0]*Mga|II[\s\xa0]*Mga|\.?[\s\xa0]*Mga|\.)?[\s\xa0]*Hari|(?:Unang|Una|1\.|1)[\s\xa0]*Mga[\s\xa0]*Hari|3\.[\s\xa0]*Mga[\s\xa0]*Hari|(?:Unang|Una|1\.)[\s\xa0]*Hari|3[\s\xa0]*Mga[\s\xa0]*Hari|1(?:[\s\xa0]*Hari|[\s\xa0]*Ha|Kgs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica)|I(?:\.[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica)|[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica)))|2(?:\.[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica)|[\s\xa0]*Paralipomeno|[\s\xa0]*Mga[\s\xa0]*(?:Kronik|Cronic)a|[\s\xa0]*Chronicle|[\s\xa0]*Kronik(?:el|a)|[\s\xa0]*Cronica|[\s\xa0]*Cron?|Chr))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica)|[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica))|[1I]\.[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica)|1(?:[\s\xa0]*Paralipomeno|[\s\xa0]*Mga[\s\xa0]*(?:Kronik|Cronic)a|[\s\xa0]*Chronicle|[\s\xa0]*Kronik(?:el|a)|[\s\xa0]*Cronica|[\s\xa0]*Cron?|Chr)|I[\s\xa0]*(?:Paralipomeno|Mga[\s\xa0]*(?:Kronik|Cronic)a|Chronicle|Kronik(?:el|a)|Cronica))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezra"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:E(?:sdras|zra))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Neh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Neh(?:em[i\xED]a[hs])?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["GkEsth"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Est(?:er[\s\xa0]*(?:\(Gr(?:iy?|y)?ego\)|Gr(?:iy?|y)?ego)|g)|GkEsth)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Esth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Est(?:h(?:er)?|er)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Job"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Job)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["SgThree"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Aw(?:it[\s\xa0]*ng[\s\xa0]*(?:Tatlong[\s\xa0]*(?:B(?:anal[\s\xa0]*na[\s\xa0]*Kabataan|inata)|Kabataan(?:g[\s\xa0]*Banal)?)|3[\s\xa0]*Kabataan)|[\s\xa0]*ng[\s\xa0]*3[\s\xa0]*Kab)|Tatlong[\s\xa0]*Kabataan|SgThree)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Song"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:A(?:ng[\s\xa0]*Awit[\s\xa0]*n(?:g[\s\xa0]*mga[\s\xa0]*Awit|i[\s\xa0]*S[ao]lom[o\xF3]n)|wit[\s\xa0]*n(?:g[\s\xa0]*mga[\s\xa0]*Awit|i[\s\xa0]*S[ao]lom[o\xF3]n)|\.?[\s\xa0]*ng[\s\xa0]*A|w[\s\xa0]*ni[\s\xa0]*S)|Kantik(?:ul)?o|Song)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ps"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mga[\s\xa0]*(?:Salmo|Awit)|Awit|Ps)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Wis"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ang[\s\xa0]*Karunungan[\s\xa0]*ni[\s\xa0]*S[ao]lom[o\xF3]n|Karunungan[\s\xa0]*ni[\s\xa0]*S[ao]lom[o\xF3]n|Kar(?:unungan)?|S[ao]lom[o\xF3]n|Wis)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrAzar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ang[\s\xa0]*Panalangin[\s\xa0]*ni[\s\xa0]*Azarias|P(?:analangin[\s\xa0]*ni[\s\xa0]*Azarias|rAzar))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Prov"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mga[\s\xa0]*Kawikaan|Kawikaan|Prov|Kaw)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eccl"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ang[\s\xa0]*Mangangaral|E(?:c(?:clesiaste|l(?:es[iy]ast[e\xE9]|is[iy]aste))|kl(?:es[iy]ast[e\xE9]|is[iy]aste))s|Mangangaral|Kohelet|Manga|Ec(?:cl)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jer"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:(?:Sulat[\s\xa0]*ni[\s\xa0]*Jeremi|H[ei]r[ei]m[iy])as|Aklat[\s\xa0]*ni[\s\xa0]*Jeremia[hs]|Jeremia[hs]|Jer)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezek"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:E(?:ze(?:quiel|k[iy]el|k)?|sek[iy]el))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Dan"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Dan(?:iel)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Hos(?:e(?:ias?|as?))?|Os(?:e(?:ia[hs]|a[hs])|ei?a)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Joel"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Yole|Joel)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Amos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Am[o\xF3]s)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Obad"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Oba(?:d(?:ia[hs])?)?|Abd[i\xED]as)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jonah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Jon(?:[a\xE1][hs]?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mic"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mi(?:queas|k(?:ieas|ey?as|a[hs]|a)?|c(?:ah|a)?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Nah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Nah(?:[u\xFA]m)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hab"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Hab(?:a(?:kk?uk|cuc))?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zeph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ze(?:p(?:h(?:ania[hs])?|anias)|f(?:anias)?)|S(?:(?:e[fp]ani|ofon[i\xED])as|e[fp]ania))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hag"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Hag(?:g(?:eo|ai)|eo|ai)?|Ag(?:g?eo|ai))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zech"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Z(?:ech(?:ariah)?|ac(?:ar[i\xED]as)?)|Sacar[i\xED]as)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mal(?:a(?:qu[i\xED]as|kias|chi))?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Matt"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:M(?:a(?:buting[\s\xa0]*Balita[\s\xa0]*ayon[\s\xa0]*kay[\s\xa0]*(?:San[\s\xa0]*)?Mateo|t(?:eo|t)?)|t)|Ebanghelyo[\s\xa0]*(?:ayon[\s\xa0]*kay[\s\xa0]*|ni[\s\xa0]*(?:San[\s\xa0]*)?)Mateo)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mark"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:M(?:a(?:buting[\s\xa0]*Balita[\s\xa0]*ayon[\s\xa0]*kay[\s\xa0]*(?:San[\s\xa0]*Mar[ck]|Mar[ck])os|r(?:kos|cos|k)?)|c)|Ebanghelyo[\s\xa0]*(?:ayon[\s\xa0]*kay[\s\xa0]*Marc|ni[\s\xa0]*(?:San[\s\xa0]*Mar[ck]|Mar[ck]))os)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Luke"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mabuting[\s\xa0]*Balita[\s\xa0]*ayon[\s\xa0]*kay[\s\xa0]*(?:San[\s\xa0]*Lu[ck]|Lu[ck])as|Ebanghelyo[\s\xa0]*ayon[\s\xa0]*kay[\s\xa0]*(?:San[\s\xa0]*Lu[ck]|Lu[ck])as|Ebanghelyo[\s\xa0]*ni[\s\xa0]*San[\s\xa0]*Lu[ck]as|Lu(?:[ck]as|ke|c)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:(?:Una(?:ng)?[\s\xa0]*Jua|[1I]\.[\s\xa0]*Jua|1(?:[\s\xa0]*Jua|Joh|[\s\xa0]*J)|I[\s\xa0]*Jua)n)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:(?:I(?:kalawang|I\.?)[\s\xa0]*Jua|2(?:\.[\s\xa0]*Jua|[\s\xa0]*Jua|Joh|[\s\xa0]*J))n)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:(?:I(?:katlong|II\.?)[\s\xa0]*Jua|3(?:\.[\s\xa0]*Jua|[\s\xa0]*Jua|Joh|[\s\xa0]*J))n)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["John"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:(?:Mabuting[\s\xa0]*Balita[\s\xa0]*ayon[\s\xa0]*kay[\s\xa0]*(?:San[\s\xa0]*)?Jua|Ebanghelyo[\s\xa0]*ayon[\s\xa0]*kay[\s\xa0]*(?:San[\s\xa0]*)?Jua|Ebanghelyo[\s\xa0]*ni[\s\xa0]*San[\s\xa0]*Jua|J(?:oh|ua)?)n)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Acts"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:M(?:abuting[\s\xa0]*Balita[\s\xa0]*(?:ayon[\s\xa0]*sa|ng)[\s\xa0]*Espiritu[\s\xa0]*Santo|ga[\s\xa0]*Gawa(?:[\s\xa0]*ng[\s\xa0]*mga[\s\xa0]*A(?:postoles|lagad)|[\s\xa0]*ng[\s\xa0]*mga[\s\xa0]*Apostol|in)?)|Ebanghelyo[\s\xa0]*ng[\s\xa0]*Espiritu[\s\xa0]*Santo|G(?:awa[\s\xa0]*ng[\s\xa0]*mga[\s\xa0]*Apostol|w)|(?:Gawa[\s\xa0]*ng[\s\xa0]*Apostole|Act)s|Gawa)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rom"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Romano|(?:Mga[\s\xa0]*Taga(?:\-?[\s\xa0]*?|[\s\xa0]*)|Taga\-?[\s\xa0]*)?Roma|Rom?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:SECOND[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?o|I(?:ka(?:\-?[\s\xa0]*2[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?|lawang[\s\xa0]*(?:Mga[\s\xa0]*Taga\-?[\s\xa0]*Corint|[CK]orinti?)|[\s\xa0]*2[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?)|I(?:(?:\.[\s\xa0]*Mga[\s\xa0]*Taga\-?|[\s\xa0]*Mga[\s\xa0]*Taga\-?)[\s\xa0]*Corint|(?:\.[\s\xa0]*[CK]|[\s\xa0]*[CK])orinti?))o|2(?:(?:\.[\s\xa0]*Mga[\s\xa0]*Taga\-?|[\s\xa0]*Mga[\s\xa0]*Taga\-?)[\s\xa0]*Corinto|(?:\.[\s\xa0]*[CK]|[\s\xa0]*K)orinti?o|[\s\xa0]*Corinti?o|[\s\xa0]*?Cor))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:ka(?:\-?[\s\xa0]*1[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?|[\s\xa0]*1[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?)|\.?[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?|(?:\.[\s\xa0]*Mga[\s\xa0]*Taga\-?|[\s\xa0]*Mga[\s\xa0]*Taga\-?)[\s\xa0]*Corint|(?:\.[\s\xa0]*[CK]|[\s\xa0]*[CK])orinti?)o|(?:Unang|Una|1\.)[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?o|(?:(?:Unang|1\.)[\s\xa0]*Mga[\s\xa0]*Taga\-?|Una[\s\xa0]*Mga[\s\xa0]*Taga\-?|1[\s\xa0]*Mga[\s\xa0]*Taga\-?)[\s\xa0]*Corinto|(?:(?:Unang|1\.)[\s\xa0]*[CK]|Una[\s\xa0]*[CK]|1[\s\xa0]*K)orinti?o|1[\s\xa0]*Corinti?o|1[\s\xa0]*?Cor)|(?:1[\s\xa0]*Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*Corinti?o)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Gal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*(?:taga[\s\xa0]*)?Galacia|Mga[\s\xa0]*Taga\-?[\s\xa0]*Galasya|(?:Mga[\s\xa0]*Taga\-?[\s\xa0]*)?Galacia|Mga[\s\xa0]*Taga\-?Galacia|Taga\-?[\s\xa0]*Galacia|Taga[\s\xa0]*Galacia|Ga(?:lasyano|l)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*E[fp]esi?o|Mga[\s\xa0]*Taga\-?[\s\xa0]*E[fp]esi?o|Mga[\s\xa0]*Taga\-?Efeso|E(?:ph|f))|(?:(?:Taga(?:\-?[\s\xa0]*E[fp]esi?|[\s\xa0]*E[fp]esi?)|Mga[\s\xa0]*E[fp]esi?|E[fp]esi?)o)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phil"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*(?:Pilip(?:yano|ense)|Filipense)|Mga[\s\xa0]*Taga(?:\-?(?:[\s\xa0]*[FP]|F)|[\s\xa0]*[FP])ilipos|Taga\-?[\s\xa0]*[FP]ilipos|Mga[\s\xa0]*Pilipyano|Mga[\s\xa0]*Pilipense|Mga[\s\xa0]*Filipense|Filipos|Pilipos|Phil|Fil)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Col"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Sulat[\s\xa0]*sa[\s\xa0]*mga[\s\xa0]*[CK]olon?sense|(?:Mga[\s\xa0]*Taga(?:\-?(?:[\s\xa0]*[CK]|C)|[\s\xa0]*[CK])|Taga\-?[\s\xa0]*C|C|K)olosas|Mga[\s\xa0]*[CK]olon?sense|Col?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka))|I(?:\.[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka))|[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka))))|2(?:\.[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka))|[\s\xa0]*Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|[\s\xa0]*Tesalonicense|[\s\xa0]*Tesalonisense|[\s\xa0]*Tesalonica|[\s\xa0]*Tesalonika|(?:Thes|[\s\xa0]*The)s|[\s\xa0]*Tes))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka))|[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka)))|[1I]\.[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka))|1(?:[\s\xa0]*Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|[\s\xa0]*Tesalonicense|[\s\xa0]*Tesalonisense|[\s\xa0]*Tesalonica|[\s\xa0]*Tesalonika|(?:Thes|[\s\xa0]*The)s|[\s\xa0]*Tes)|I[\s\xa0]*(?:Mga[\s\xa0]*T(?:aga(?:\-?[\s\xa0]*Tesaloni[ck]|[\s\xa0]*Tesaloni[ck])a|esaloni[cs]ense)|Tesaloni(?:c(?:ense|a)|sense|ka)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang[\s\xa0]*(?:Kay[\s\xa0]*)?|I(?:\.[\s\xa0]*(?:Kay[\s\xa0]*)?|[\s\xa0]*(?:Kay[\s\xa0]*)?))Timoteo|2(?:\.[\s\xa0]*(?:Kay[\s\xa0]*)?Timoteo|[\s\xa0]*Kay[\s\xa0]*Timoteo|[\s\xa0]*Timoteo|[\s\xa0]*?Tim))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng[\s\xa0]*(?:Kay[\s\xa0]*)?|[\s\xa0]*(?:Kay[\s\xa0]*)?)Timoteo|[1I]\.[\s\xa0]*(?:Kay[\s\xa0]*)?Timoteo|1(?:[\s\xa0]*Kay[\s\xa0]*Timoteo|[\s\xa0]*Timoteo|[\s\xa0]*?Tim)|I[\s\xa0]*(?:Kay[\s\xa0]*)?Timoteo)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Titus"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Kay[\s\xa0]*Tito|Tit(?:us|o)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phlm"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Kay[\s\xa0]*Filemon|Filemon|(?:File|(?:Ph|F)l)m)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Heb"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Mga[\s\xa0]*(?:He|E)breo|Heb(?:reo)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jas"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:San(?:t(?:iago)?)?|Ja(?:cobo|s))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang|I\.?)[\s\xa0]*Pedro|2(?:\.[\s\xa0]*Pedro|[\s\xa0]*Pedro|[\s\xa0]*Ped|Pet))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng)?[\s\xa0]*Pedro|[1I]\.[\s\xa0]*Pedro|1(?:[\s\xa0]*Pedro|[\s\xa0]*Ped|Pet)|I[\s\xa0]*Pedro)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jude"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ju(?:das|de|d)?|Hudas)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Tob"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:T(?:ob(?:\xEDas|i(?:as|t))?|b))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jdt"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:J(?:udith?|dt))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Bar(?:u[ck]h?)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sus"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:S(?:i[\s\xa0]*Susana|u(?:sana|s)?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kalawang[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|I(?:\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)))|2(?:\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*Mga[\s\xa0]*Macabeo|[\s\xa0]*Macabeos|[\s\xa0]*Macabeo|Macc|[\s\xa0]*Mcb))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:katlong[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|II(?:\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)))|3(?:\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*Mga[\s\xa0]*Macabeo|[\s\xa0]*Macabeos|[\s\xa0]*Macabeo|Macc|[\s\xa0]*Mcb))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["4Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:I(?:kaapat[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|V(?:\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)))|4(?:\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*Mga[\s\xa0]*Macabeo|[\s\xa0]*Macabeos|[\s\xa0]*Macabeo|Macc|[\s\xa0]*Mcb))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Una(?:ng[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?))|[1I]\.[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?)|1(?:[\s\xa0]*Mga[\s\xa0]*Macabeo|[\s\xa0]*Macabeos|[\s\xa0]*Macabeo|Macc|[\s\xa0]*Mcb)|I[\s\xa0]*M(?:ga[\s\xa0]*Macabeo|acabeos?))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezek", "Ezra"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Ez)
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
