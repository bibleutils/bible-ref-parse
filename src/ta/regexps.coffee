bcv_parser::regexps.space = "[\\s\\xa0]"
bcv_parser::regexps.escaped_passage = ///
	(?:^ | [^\x1f\x1e\dA-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ] )	# Beginning of string or not in the middle of a word or immediately following another book. Only count a book if it's part of a sequence: `Matt5John3` is OK, but not `1Matt5John3`
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
				  | அதிகாரம் | மற்றும் | verse | அதி | ff | to
				  | [a-e] (?! \w )			#a-e allows 1:1a
				  | $						#or the end of the string
				 )+
		)
	///gi
# These are the only valid ways to end a potential passage match. The closing parenthesis allows for fully capturing parentheses surrounding translations (ESV**)**. The last one, `[\d\x1f]` needs not to be +; otherwise `Gen5ff` becomes `\x1f0\x1f5ff`, and `adjust_regexp_end` matches the `\x1f5` and incorrectly dangles the ff.
bcv_parser::regexps.match_end_split = ///
	  \d \W* title
	| \d \W* ff (?: [\s\xa0*]* \.)?
	| \d [\s\xa0*]* [a-e] (?! \w )
	| \x1e (?: [\s\xa0*]* [)\]\uff09] )? #ff09 is a full-width closing parenthesis
	| [\d\x1f]
	///gi
bcv_parser::regexps.control = /[\x1e\x1f]/g
bcv_parser::regexps.pre_book = "[^A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ]"

bcv_parser::regexps.first = "(?:முதலாவது|Mutal[āa]vatu|1)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.second = "(?:இரண்டாம|இரண்டாவது|Ira[ṇn][ṭt][āa]vatu|2)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.third = "(?:முன்றாம்|மூன்றாவது|M[ūu][ṉn][ṛr][āa]vatu|3)\\.?#{bcv_parser::regexps.space}*"
bcv_parser::regexps.range_and = "(?:[&\u2013\u2014-]|மற்றும்|to)"
bcv_parser::regexps.range_only = "(?:[\u2013\u2014-]|to)"
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
		(?:தொ(?:டக்க[\s\xa0]*நூல்|நூ)|[AĀ]tiy[aā]kamam|ஆதியாகமம்|ஆதி|Gen)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Exod"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:வி(?:டுதலைப்[\s\xa0]*பயணம்|ப)|Y[aā]ttir[aā]kamam|யாத்திராகமம்|யாத்|Exod)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bel"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:பேல்(?:[\s\xa0]*தெய்வமும்[\s\xa0]*அரக்கப்பாம்பும்(?:[\s\xa0]*என்பவையாகும்)?)?|Bel)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:L(?:ēviyar[aā]kamam|ev(?:iyar[aā]kamam)?)|லேவி(?:ய(?:ாரகமம|ர(?:ாகமம)?)்)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Num"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எண்(?:ண(?:ிக்கை|ாகமம்))?|E[nṇ][nṇ][aā]kamam|Num)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sir"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:சீ(?:ராக்(?:கின்[\s\xa0]*ஞான|[\s\xa0]*ஆகம)ம்|ஞா)|Sir)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Wis"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:சா(?:லமோனின்[\s\xa0]*ஞானம்|ஞா)|ஞானாகமம்|Wis)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Lam"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எரேமியாவின்[\s\xa0]*புலம்பல்|Pulampal|புலம்பல்|புல(?:ம்)?|Lam)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["EpJer"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:அவை[\s\xa0]*இளைஞர்[\s\xa0]*மூவரின்[\s\xa0]*பாடல்|எரேமியாவின்[\s\xa0]*கடிதம்|எரேமியாவின்[\s\xa0]*மடல்|EpJer)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rev"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யோவானுக்கு[\s\xa0]*வெளிப்படுத்தின[\s\xa0]*விசேஷம்|Ve[lḷ]ippa[tṭ]utti[nṉ]a[\s\xa0]*Vic[eē][tṭ]a[nṅ]ka[lḷ]|வெளிப்படுத்த(?:ின[\s\xa0]*விசேடங்கள|ல)்|தி(?:ருவெளிப்பாடு|வெ)|வெளி|Rev)|(?:Ve[lḷ]ippa[tṭ]utti[nṉ]a)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrMan"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:PrMan)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Deut"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:இ(?:ணைச்[\s\xa0]*சட்டம்|ச)|Up[aā]kamam|உபாகமம்|Deut|உபா)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Josh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யோசு(?:வா(?:வின்[\s\xa0]*புத்தகம்)?)?|Y[oō]cuv[aā]|Josh)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Judg"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ந(?:ியா(?:யாதிபதிகள(?:ின்[\s\xa0]*புத்தகம்|்(?:[\s\xa0]*ஆகமம்)?))?|ீத(?:ி(?:த்[\s\xa0]*தலைவர்|பதி)கள்)?)|Niy[aā]y[aā]tipatika[lḷ]|Judg)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ruth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ரூத்(?:த(?:ின்[\s\xa0]*சரித்திரம்|ு))?|R(?:uth|ut|ūt))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:1(?:[\s\xa0]*எஸ்திராஸ்|Esd))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Esd"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:2(?:[\s\xa0]*எஸ்திராஸ்|Esd))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Isa"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ஏசா(?:யா(?:[\s\xa0]*தீர்க்கதரிசியின்[\s\xa0]*புத்தகம்)?)?|எசாயா|Ec[aā]y[aā]|எசா|Isa)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:சாமுவேலின்[\s\xa0]*இரண்டாம்[\s\xa0]*புத்தகம்|2(?:[\s\xa0]*(?:சாமுவேல|அரசுகள)்|[\s\xa0]*C[aā]muv[eē]l|[\s\xa0]*சாமு|Sam))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Sam"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:சாமுவேலின்[\s\xa0]*முதலாம்[\s\xa0]*புத்தகம்|1(?:[\s\xa0]*(?:சாமுவேல|அரசுகள)்|[\s\xa0]*C[aā]muv[eē]l|[\s\xa0]*சாமு|Sam))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:இராஜாக்களின்[\s\xa0]*இரண்டாம்[\s\xa0]*புத்தகம்|(?:2[\s\xa0]*(?:இராஜாக|அரசர)்|4[\s\xa0]*அரசு)கள்|2(?:[\s\xa0]*Ir[aā]j[aā]kka[lḷ]|[\s\xa0]*(?:இரா(?:ஜா)?|அர)|Kgs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Kgs"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:இராஜாக்களின்[\s\xa0]*முதலாம்[\s\xa0]*புத்தகம்|(?:1[\s\xa0]*(?:இராஜாக|அரசர)்|3[\s\xa0]*அரசு)கள்|1(?:[\s\xa0]*Ir[aā]j[aā]kka[lḷ]|[\s\xa0]*(?:இரா(?:ஜா)?|அர)|Kgs))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:நாளாகமத்தின்[\s\xa0]*இரண்டாம்[\s\xa0]*புத்தகம்|2(?:[\s\xa0]*(?:குறிப்பேடு|N[aā][lḷ][aā]kamam)|[\s\xa0]*நாளாகமம்|[\s\xa0]*(?:நாளா|குறி)|Chr))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Chr"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:நாளாகமத்தின்[\s\xa0]*முதலாம்[\s\xa0]*புத்தகம்|1(?:[\s\xa0]*(?:குறிப்பேடு|N[aā][lḷ][aā]kamam)|[\s\xa0]*நாளாகமம்|[\s\xa0]*(?:நாளா|குறி)|Chr))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezra"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எஸ்(?:றா(?:வின்[\s\xa0]*புத்தகம்)?|ரா)|E(?:zra|s[rṛ][aā]))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Neh"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:நெகே(?:மியா(?:வின்[\s\xa0]*புத்தகம்)?)?|Ne(?:k[eē]miy[aā]|h))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["GkEsth"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எஸ்(?:தர்[\s\xa0]*\(கி(?:ரேக்கம்)?|[\s\xa0]*\(கி)\)|GkEsth)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Esth"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எஸ்(?:தர(?:ின்[\s\xa0]*சரித்திரம)?்)?|Est(?:ar|h))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Job"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யோபு(?:டைய[\s\xa0]*சரித்திரம்)?|Y[oō]pu|Job)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["SgThree"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:இளைஞர்[\s\xa0]*மூவரின்[\s\xa0]*பாடல்|SgThree)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Song"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:சாலொமோனின்[\s\xa0]*உன்னதப்பாட்டு|இ(?:னிமைமிகு[\s\xa0]*பாடல்|பா)|உன்னத[\s\xa0]*சங்கீதம்|U[nṉ][nṉ]atapp[aā][tṭ][tṭ]u|உன்னத[\s\xa0]*பாட்டு|உன்ன|Song)|(?:உன்னதப்பாட்டு|பாடல்)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ps"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:சங(?:்(?:கீ(?:த(?:[\s\xa0]*புத்தகம|ங்கள|ம)்)?)?|கீதம்)|திருப்பாடல்கள்|திருப்பாடல்|Ca[nṅ]k[iī]tam|திபா|Ps)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["PrAzar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:அசரியா|PrAzar)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Prov"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:பழமொழி[\s\xa0]*ஆகமம்|N[iī]timo[lḻ]ika[lḷ]|நீதிமொழிகள்|நீதி|Prov|நீமொ)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eccl"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ச(?:ங்கத்[\s\xa0]*திருவுரை[\s\xa0]*ஆகமம்|பை[\s\xa0]*உரையாளர்|உ)|Piraca[nṅ]ki|பிரசங்கி|பிரச|Eccl)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jer"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எரே(?:மியா(?:[\s\xa0]*தீர்க்கதரிசியின்[\s\xa0]*புத்தகம்)?)?|ஏரேமியா|Er[eē]miy[aā]|ஏரே|Jer)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Ezek"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எசே(?:க்கியேல்(?:[\s\xa0]*தீர்க்கதரிசியின்[\s\xa0]*புத்தகம்)?)?|E(?:c[eē]kkiy[eē]l|zek))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Dan"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:தானி(?:யேல(?:ின்[\s\xa0]*புத்தகம)?்)?|T[aā][nṉ]iy[eē]l|Dan)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ஓச[ிே]யா|ஒசேயா|[OŌ]ciy[aā]|ஓச[ிே]|Hos)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Joel"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யோவே(?:ல்)?|(?:Y[oō]v[eē]|Joe)l)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Amos"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ஆமோ(?:ஸ்)?|[AĀ]m[oō]s)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Obad"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:O(?:patiy[aā]|bad)|ஒப(?:தியா|தி)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jonah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Jonah|யோனா|Y[oō][nṉ][aā])
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mic"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:மீக(?:்(?:கா)?|ா)|M(?:īk[aā]|i(?:k[aā]|c)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Nah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:நாகூ(?:ம்)?|N(?:āk[uū]m|a(?:k[uū]m|h)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hab"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:அப(?:க்கூக்கு)?|ஆபகூக்|[AĀ]pak[uū]k|Hab|ஆப)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zeph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:செப்பனியா|Ceppa[nṉ]iy[aā]|செப்|Zeph)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Hag"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ஆகா(?:ய்)?|[AĀ]k[aā]y|Hag)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Zech"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ச(?:ெக்(?:கரியா)?|கரி(?:யா)?)|Cakariy[aā]|Zech)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எபிரேயம்|மல(?:்கியா|ாக்கி)|Malkiy[aā]|மல(?:்கி|ா)|Mal)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Matt"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:மத்(?:தேயு(?:[\s\xa0]*(?:எழுதிய[\s\xa0]*(?:நற்செய்தி|சுவிசேஷம்)|நற்செய்தி))?)?|Matt(?:[eē]yu[\s\xa0]*Na[rṛ]ceyti|[eē]yu)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Mark"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:மாற்(?:கு(?:[\s\xa0]*(?:எழுதிய[\s\xa0]*(?:நற்செய்தி|சுவிசேஷம்)|நற்செய்தி))?)?|M(?:(?:ā[rṛ]ku[\s\xa0]*Na[rṛ]|a(?:ṛku[\s\xa0]*Na[rṛ]|rku[\s\xa0]*Na[rṛ]))ceyti|ā[rṛ]ku|a(?:ṛku|rku?)))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Luke"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:லூ(?:க்(?:கா(?:[\s\xa0]*(?:எழுதிய[\s\xa0]*(?:நற்செய்தி|சுவிசேஷம்)|நற்செய்தி))?)?)?|L(?:ūkk[aā][\s\xa0]*Na[rṛ]ceyti|uk(?:k[aā][\s\xa0]*Na[rṛ]ceyti|e)|ūkk[aā]|ukk[aā]))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Y[oō]va[nṉ][\s\xa0]*E[lḻ]utiya[\s\xa0]*Mutal[aā]vatu[\s\xa0]*Nirupam|யோவ(?:ான்[\s\xa0]*(?:எழுதிய[\s\xa0]*முதல(?:்[\s\xa0]*திருமுக|ாம்[\s\xa0]*கடித)|முதல்[\s\xa0]*திருமுக)|ன்[\s\xa0]*எழுதிய[\s\xa0]*முதலாவது[\s\xa0]*நிருப)ம்|(?:Mutal[aā]vatu[\s\xa0]*யோவான|(?:முதலாவது|1\.)[\s\xa0]*யோவான|1[\s\xa0]*(?:அருளப்பர|யோவான))்|1(?:[\s\xa0]*Y[oō]va[nṉ]|John)|1[\s\xa0]*யோ(?:வா)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:யோவ(?:ான்[\s\xa0]*(?:எழுதிய[\s\xa0]*இரண்டாம்[\s\xa0]*(?:திருமுக|கடித)|இரண்டாம்[\s\xa0]*திருமுக)|ன்[\s\xa0]*எழுதிய[\s\xa0]*இரண்டாவது[\s\xa0]*நிருப)ம்|Y[oō]va[nṉ][\s\xa0]*E[lḻ]utiya[\s\xa0]*Ira[nṇ][tṭ][aā]vatu[\s\xa0]*Nirupam|2(?:[\s\xa0]*(?:அருளப்பர|யோவான)்|[\s\xa0]*Y[oō]va[nṉ]|John)|2[\s\xa0]*யோ(?:வா)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3John"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:யோவ(?:ான்[\s\xa0]*(?:எழுதிய[\s\xa0]*ம(?:ுன்றாம்[\s\xa0]*திருமுக|ூன்றாம்[\s\xa0]*கடித)|மூன்றாம்[\s\xa0]*திருமுக)|ன்[\s\xa0]*எழுதிய[\s\xa0]*மூன்றாவது[\s\xa0]*நிருப)ம்|Y[oō]va[nṉ][\s\xa0]*E[lḻ]utiya[\s\xa0]*M[uū][nṉ][rṛ][aā]vatu[\s\xa0]*Nirupam|(?:(?:ம(?:ூன்றாவது|ுன்றாம்)|3\.)[\s\xa0]*யோவான|M[uū][nṉ][rṛ][aā]vatu[\s\xa0]*யோவான|3[\s\xa0]*(?:அருளப்பர|யோவான))்|3(?:[\s\xa0]*Y[oō]va[nṉ]|John)|3[\s\xa0]*யோ(?:வா)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["John"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யோவா(?:ன்[\s\xa0]*(?:எழுதிய[\s\xa0]*(?:நற்செய்தி|சுவிசேஷம்)|நற்செய்தி))?|அருளப்பர்[\s\xa0]*நற்செய்தி|Y[oō]v[aā][nṉ][\s\xa0]*Na[rṛ]ceyti|John)|(?:யோவான்|Y[oō]v[aā][nṉ])
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Acts"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:அப்(?:போ(?:ஸ்தலர(?:ுடைய[\s\xa0]*நடபடிகள்|்(?:[\s\xa0]*பணி)?))?)?|திருத்தூதர்[\s\xa0]*பணிகள்|A(?:pp[oō]stalar[\s\xa0]*Pa[nṇ]i|cts)|திப)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Rom"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:ரோம(?:ாபுரியாருக்கு[\s\xa0]*எழுதிய[\s\xa0]*கடிதம|ர)்|உரோம(?:ையருக்கு[\s\xa0]*எழுதிய[\s\xa0]*திருமுக|ருக்கு[\s\xa0]*எழுதிய[\s\xa0]*நிருப)ம்|(?:Ur[oō]marukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupa|Ro)m|Ur[oō]marukku|உரோமையர்|உரோ)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:கொரிந்தியருக்கு[\s\xa0]*எழுதிய[\s\xa0]*இரண்டா(?:வது[\s\xa0]*(?:திருமுக|நிருப)|ம்[\s\xa0]*(?:திருமுக|கடித))ம்|Korintiyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Ira[nṇ][tṭ][aā]vatu[\s\xa0]*Nirupam|2(?:[\s\xa0]*Korintiyarukku|Cor)|2[\s\xa0]*கொரிந்தியர்|2[\s\xa0]*கொ(?:ரி)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Cor"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:கொரிந்தியருக்கு[\s\xa0]*எழுதிய[\s\xa0]*முதல(?:ா(?:வது[\s\xa0]*(?:திருமுக|நிருப))?|்[\s\xa0]*திருமுக)ம்|Korintiyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Mutal[aā]vatu[\s\xa0]*Nirupam|1(?:[\s\xa0]*Korintiyarukku|[\s\xa0]*கொரிந்தியர்|Cor)|1[\s\xa0]*கொ(?:ரி)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Gal"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:கலா(?:த்(?:தியர(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:திருமுக|நிருப|கடித)ம)?்)?)?|Kal[aā]ttiyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|Kal[aā]ttiyarukku|Gal)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Eph"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எபே(?:சி(?:யர(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:திருமுக|நிருப|கடித)ம)?்)?)?|Ep(?:[eē]ciyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|[eē]ciyarukku|h))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phil"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:பிலி(?:ப்(?:பியர(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:திருமுக|நிருப|கடித)ம)?்)?)?|P(?:ilippiyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|ilippiyarukku|hil))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Col"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:கொலோ(?:ச(?:ையர(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*திருமுகம)?|ெயர(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:நிருப|கடித)ம)?)்)?|Kol[oō]ceyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|Kol[oō]ceyarukku|Col)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Tecal[oō][nṉ]ikkiyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Ira[nṇ][tṭ][aā]vatu[\s\xa0]*Nirupam|தெசலோனிக்க(?:ியருக்கு[\s\xa0]*எழுதிய[\s\xa0]*இரண்டாவது[\s\xa0]*நிருப|ருக்கு[\s\xa0]*எழுதிய[\s\xa0]*இரண்டா(?:வது|ம்)[\s\xa0]*திருமுக|ேயருக்கு[\s\xa0]*எழுதிய[\s\xa0]*இரண்டாம்[\s\xa0]*கடித)ம்|2(?:[\s\xa0]*Tecal[oō][nṉ]ikkiyarukku|[\s\xa0]*தெசலோனிக்க(?:ேய)?ர்|Thess)|2[\s\xa0]*தெச(?:லோ)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Thess"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:Tecal[oō][nṉ]ikkiyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Mutal[aā]vatu[\s\xa0]*Nirupam|தெசலோனிக்க(?:ியருக்கு[\s\xa0]*எழுதிய[\s\xa0]*முதலாவது[\s\xa0]*நிருப|ேயருக்கு[\s\xa0]*எழுதிய[\s\xa0]*முதலாம்[\s\xa0]*கடித|ருக்கு[\s\xa0]*எழுதிய[\s\xa0]*முதல்[\s\xa0]*திருமுக)ம்|1(?:[\s\xa0]*Tecal[oō][nṉ]ikkiyarukku|[\s\xa0]*தெசலோனிக்க(?:ேய)?ர்|Thess)|1[\s\xa0]*தெச(?:லோ)?)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:த(?:ிம[ொோ]த்தேயுவுக்கு[\s\xa0]*எழுதிய[\s\xa0]*இரண்டாம்[\s\xa0]*திருமுக|ீமோத்தேயுவுக்கு[\s\xa0]*எழுதிய[\s\xa0]*இரண்டா(?:வது[\s\xa0]*நிருப|ம்[\s\xa0]*கடித))ம்|T[iī]m[oō]tt[eē]yuvukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Ira[nṇ][tṭ][aā]vatu[\s\xa0]*Nirupam|2(?:[\s\xa0]*(?:T[iī]m[oō]tt[eē]yuvukku|த(?:ீமோ|ிமொ)த்தேயு)|Tim)|2[\s\xa0]*த(?:ீமோத்|ிமொ))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Tim"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:T[iī]m[oō]tt[eē]yuvukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Mutal[aā]vatu[\s\xa0]*Nirupam|த(?:ீமோத்தேயுவுக்கு[\s\xa0]*எழுதிய[\s\xa0]*முதலா(?:வது[\s\xa0]*நிருப|ம்[\s\xa0]*கடித)|ிம[ொோ]த்தேயுவுக்கு[\s\xa0]*எழுதிய[\s\xa0]*முதல்[\s\xa0]*திருமுக)ம்|1[\s\xa0]*(?:T[iī]m[oō]tt[eē]yuvukku|த(?:ீமோ|ிமொ)த்தேயு)|1[\s\xa0]*த(?:ீமோத்|ிமொ)|1Tim)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Titus"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:தீத்(?:து(?:வுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:திருமுக|நிருப|கடித)ம்|க்கு[\s\xa0]*எழுதிய[\s\xa0]*திருமுகம்)?)?|T(?:īttuvukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|it(?:tuvukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|us)|[iī]ttuvukku))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Phlm"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:பில(?:மோன(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*திருமுகம)?்|ேமோனுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:நிருப|கடித)ம்|ேமோன்|ே)?|P(?:il[eē]m[oō][nṉ]ukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupa|hl)m)|(?:Pil[eē]m[oō][nṉ]ukku)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Heb"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:எபி(?:ர(?:ே(?:யர(?:ுக்கு[\s\xa0]*எழுதிய[\s\xa0]*(?:திருமுக|கடித)ம)?்)?|ெயருக்கு[\s\xa0]*எழுதிய[\s\xa0]*நிருபம்))?|Epireyarukku[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|Epireyarukku|Heb)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jas"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யாக(?:்(?:கோபு(?:[\s\xa0]*(?:எழுதிய[\s\xa0]*(?:திருமுக|நிருப|கடித)|திருமுக)ம்)?)?|ப்பர்[\s\xa0]*திருமுகம்)|Y[aā]kk[oō]pu[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam|Y[aā]kk[oō]pu|Jas)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:P[eē]turu[\s\xa0]*E[lḻ]utiya[\s\xa0]*Ira[nṇ][tṭ][aā]vatu[\s\xa0]*Nirupam|பேதுரு[\s\xa0]*(?:எழுதிய[\s\xa0]*இரண்டா(?:ம்[\s\xa0]*(?:திருமுக|கடித)|வது[\s\xa0]*நிருப)|இரண்டாம்[\s\xa0]*திருமுக)ம்|2(?:[\s\xa0]*இராயப்பர்|[\s\xa0]*(?:பேதுரு|P[eē]turu)|Pet)|2[\s\xa0]*பேது)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Pet"]
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:P[eē]turu[\s\xa0]*E[lḻ]utiya[\s\xa0]*Mutal[aā]vatu[\s\xa0]*Nirupam|பேதுரு[\s\xa0]*(?:எழுதிய[\s\xa0]*முதல(?:ா(?:வது[\s\xa0]*நிருப|ம்[\s\xa0]*கடித)|்[\s\xa0]*திருமுக)|முதல்[\s\xa0]*திருமுக)ம்|1(?:[\s\xa0]*இராயப்பர்|[\s\xa0]*(?:பேதுரு|P[eē]turu)|Pet)|1[\s\xa0]*பேது)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jude"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:Y[uū]t[aā](?:[\s\xa0]*E[lḻ]utiya[\s\xa0]*Nirupam)?|யூதா[\s\xa0]*(?:எழுதிய[\s\xa0]*(?:நிருப|கடித)|திருமுக)ம்|யூதா|Jude)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Tob"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:த(?:ொபியாசு[\s\xa0]*ஆகமம்|ோபி(?:த்து)?)|Tob)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Jdt"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யூதி(?:த்து)?|Jdt)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Bar"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:பாரூ(?:க்கு)?|Bar)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["Sus"]
		apocrypha: true
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:சூசன்னா|Sus)
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["2Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:2(?:[\s\xa0]*மக்(?:கபேயர்)?|Macc))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["3Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:3(?:[\s\xa0]*மக்(?:கபேயர்)?|Macc))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["4Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:4(?:[\s\xa0]*மக்(?:கபேயர்)?|Macc))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["1Macc"]
		apocrypha: true
		regexp: ///(^|[^0-9A-Za-zªµºÀ-ÖØ-öø-ɏஂ-ஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹீ்ௐḀ-ỿⱠ-ⱿꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꟿ])(
		(?:1(?:[\s\xa0]*மக்(?:கபேயர்)?|Macc))
			)(?:(?=[\d\s\xa0.:,;\x1e\x1f&\(\)\uff08\uff09\[\]/"'\*=~\-\u2013\u2014])|$)///gi
	,
		osis: ["John", "Josh", "Joel", "Jonah"]
		regexp: ///(^|#{bcv_parser::regexps.pre_book})(
		(?:யோ)
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
