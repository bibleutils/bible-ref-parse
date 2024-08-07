bcv_parser = require("../../js/ja_bcv_parser.js").bcv_parser

describe "Parsing", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.options.osis_compaction_strategy = "b"
		p.options.sequence_combination_strategy = "combine"

	it "should round-trip OSIS references", ->
		p.set_options osis_compaction_strategy: "bc"
		books = ["Gen","Exod","Lev","Num","Deut","Josh","Judg","Ruth","1Sam","2Sam","1Kgs","2Kgs","1Chr","2Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","Rom","1Cor","2Cor","Gal","Eph","Phil","Col","1Thess","2Thess","1Tim","2Tim","Titus","Phlm","Heb","Jas","1Pet","2Pet","1John","2John","3John","Jude","Rev"]
		for book in books
			bc = book + ".1"
			bcv = bc + ".1"
			bcv_range = bcv + "-" + bc + ".2"
			expect(p.parse(bc).osis()).toEqual bc
			expect(p.parse(bcv).osis()).toEqual bcv
			expect(p.parse(bcv_range).osis()).toEqual bcv_range

	it "should round-trip OSIS Apocrypha references", ->
		p.set_options osis_compaction_strategy: "bc", ps151_strategy: "b"
		p.include_apocrypha true
		books = ["Tob","Jdt","GkEsth","Wis","Sir","Bar","PrAzar","Sus","Bel","SgThree","EpJer","1Macc","2Macc","3Macc","4Macc","1Esd","2Esd","PrMan","Ps151"]
		for book in books
			bc = book + ".1"
			bcv = bc + ".1"
			bcv_range = bcv + "-" + bc + ".2"
			expect(p.parse(bc).osis()).toEqual bc
			expect(p.parse(bcv).osis()).toEqual bcv
			expect(p.parse(bcv_range).osis()).toEqual bcv_range
		p.set_options ps151_strategy: "bc"
		expect(p.parse("Ps151.1").osis()).toEqual "Ps.151"
		expect(p.parse("Ps151.1.1").osis()).toEqual "Ps.151.1"
		expect(p.parse("Ps151.1-Ps151.2").osis()).toEqual "Ps.151.1-Ps.151.2"
		p.include_apocrypha false
		for book in books
			bc = book + ".1"
			expect(p.parse(bc).osis()).toEqual ""

	it "should handle a preceding character", ->
		expect(p.parse(" Gen 1").osis()).toEqual "Gen.1"
		expect(p.parse("Matt5John3").osis()).toEqual "Matt.5,John.3"
		expect(p.parse("1Ps 1").osis()).toEqual ""
		expect(p.parse("11Sam 1").osis()).toEqual ""

describe "Localized book Gen (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Gen (ja)", ->
		`
		expect(p.parse("Gen 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Gen 1:1'")
		expect(p.parse("創世記 1:1").osis()).toEqual("Gen.1.1", "parsing: '創世記 1:1'")
		expect(p.parse("創世 1:1").osis()).toEqual("Gen.1.1", "parsing: '創世 1:1'")
		expect(p.parse("創 1:1").osis()).toEqual("Gen.1.1", "parsing: '創 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("GEN 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GEN 1:1'")
		expect(p.parse("創世記 1:1").osis()).toEqual("Gen.1.1", "parsing: '創世記 1:1'")
		expect(p.parse("創世 1:1").osis()).toEqual("Gen.1.1", "parsing: '創世 1:1'")
		expect(p.parse("創 1:1").osis()).toEqual("Gen.1.1", "parsing: '創 1:1'")
		`
		true
describe "Localized book Exod (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Exod (ja)", ->
		`
		expect(p.parse("出エシフト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシフト記 1:1'")
		expect(p.parse("出エシプト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシプト記 1:1'")
		expect(p.parse("出エジフト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジフト記 1:1'")
		expect(p.parse("出エジプト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジプト記 1:1'")
		expect(p.parse("出エシフト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシフト 1:1'")
		expect(p.parse("出エシプト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシプト 1:1'")
		expect(p.parse("出エジフト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジフト 1:1'")
		expect(p.parse("出エジプト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジプト 1:1'")
		expect(p.parse("Exod 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exod 1:1'")
		expect(p.parse("出 1:1").osis()).toEqual("Exod.1.1", "parsing: '出 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("出エシフト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシフト記 1:1'")
		expect(p.parse("出エシプト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシプト記 1:1'")
		expect(p.parse("出エジフト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジフト記 1:1'")
		expect(p.parse("出エジプト記 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジプト記 1:1'")
		expect(p.parse("出エシフト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシフト 1:1'")
		expect(p.parse("出エシプト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エシプト 1:1'")
		expect(p.parse("出エジフト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジフト 1:1'")
		expect(p.parse("出エジプト 1:1").osis()).toEqual("Exod.1.1", "parsing: '出エジプト 1:1'")
		expect(p.parse("EXOD 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXOD 1:1'")
		expect(p.parse("出 1:1").osis()).toEqual("Exod.1.1", "parsing: '出 1:1'")
		`
		true
describe "Localized book Bel (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Bel (ja)", ->
		`
		expect(p.parse("ヘルと竜 1:1").osis()).toEqual("Bel.1.1", "parsing: 'ヘルと竜 1:1'")
		expect(p.parse("ヘルと龍 1:1").osis()).toEqual("Bel.1.1", "parsing: 'ヘルと龍 1:1'")
		expect(p.parse("ベルと竜 1:1").osis()).toEqual("Bel.1.1", "parsing: 'ベルと竜 1:1'")
		expect(p.parse("ベルと龍 1:1").osis()).toEqual("Bel.1.1", "parsing: 'ベルと龍 1:1'")
		expect(p.parse("Bel 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel 1:1'")
		`
		true
describe "Localized book Lev (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Lev (ja)", ->
		`
		expect(p.parse("Lev 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lev 1:1'")
		expect(p.parse("レヒ記 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レヒ記 1:1'")
		expect(p.parse("レビ記 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レビ記 1:1'")
		expect(p.parse("レヒ 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レヒ 1:1'")
		expect(p.parse("レビ 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レビ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("LEV 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEV 1:1'")
		expect(p.parse("レヒ記 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レヒ記 1:1'")
		expect(p.parse("レビ記 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レビ記 1:1'")
		expect(p.parse("レヒ 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レヒ 1:1'")
		expect(p.parse("レビ 1:1").osis()).toEqual("Lev.1.1", "parsing: 'レビ 1:1'")
		`
		true
describe "Localized book Num (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Num (ja)", ->
		`
		expect(p.parse("Num 1:1").osis()).toEqual("Num.1.1", "parsing: 'Num 1:1'")
		expect(p.parse("民数記 1:1").osis()).toEqual("Num.1.1", "parsing: '民数記 1:1'")
		expect(p.parse("民数 1:1").osis()).toEqual("Num.1.1", "parsing: '民数 1:1'")
		expect(p.parse("民 1:1").osis()).toEqual("Num.1.1", "parsing: '民 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NUM 1:1").osis()).toEqual("Num.1.1", "parsing: 'NUM 1:1'")
		expect(p.parse("民数記 1:1").osis()).toEqual("Num.1.1", "parsing: '民数記 1:1'")
		expect(p.parse("民数 1:1").osis()).toEqual("Num.1.1", "parsing: '民数 1:1'")
		expect(p.parse("民 1:1").osis()).toEqual("Num.1.1", "parsing: '民 1:1'")
		`
		true
describe "Localized book Sir (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Sir (ja)", ->
		`
		expect(p.parse("シラフの子イイススの知恵書 1:1").osis()).toEqual("Sir.1.1", "parsing: 'シラフの子イイススの知恵書 1:1'")
		expect(p.parse("シラ書（集会の書） 1:1").osis()).toEqual("Sir.1.1", "parsing: 'シラ書（集会の書） 1:1'")
		expect(p.parse("ヘン・シラの智慧 1:1").osis()).toEqual("Sir.1.1", "parsing: 'ヘン・シラの智慧 1:1'")
		expect(p.parse("ヘン・シラの知恵 1:1").osis()).toEqual("Sir.1.1", "parsing: 'ヘン・シラの知恵 1:1'")
		expect(p.parse("ベン・シラの智慧 1:1").osis()).toEqual("Sir.1.1", "parsing: 'ベン・シラの智慧 1:1'")
		expect(p.parse("ベン・シラの知恵 1:1").osis()).toEqual("Sir.1.1", "parsing: 'ベン・シラの知恵 1:1'")
		expect(p.parse("集会の書 1:1").osis()).toEqual("Sir.1.1", "parsing: '集会の書 1:1'")
		expect(p.parse("Sir 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sir 1:1'")
		expect(p.parse("シラ書 1:1").osis()).toEqual("Sir.1.1", "parsing: 'シラ書 1:1'")
		expect(p.parse("シラ 1:1").osis()).toEqual("Sir.1.1", "parsing: 'シラ 1:1'")
		`
		true
describe "Localized book Wis (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Wis (ja)", ->
		`
		expect(p.parse("ソロモンの知恵書 1:1").osis()).toEqual("Wis.1.1", "parsing: 'ソロモンの知恵書 1:1'")
		expect(p.parse("ソロモンの智慧 1:1").osis()).toEqual("Wis.1.1", "parsing: 'ソロモンの智慧 1:1'")
		expect(p.parse("知恵の書 1:1").osis()).toEqual("Wis.1.1", "parsing: '知恵の書 1:1'")
		expect(p.parse("Wis 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Wis 1:1'")
		expect(p.parse("知恵 1:1").osis()).toEqual("Wis.1.1", "parsing: '知恵 1:1'")
		expect(p.parse("知 1:1").osis()).toEqual("Wis.1.1", "parsing: '知 1:1'")
		`
		true
describe "Localized book Lam (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Lam (ja)", ->
		`
		expect(p.parse("エレミヤの哀歌 1:1").osis()).toEqual("Lam.1.1", "parsing: 'エレミヤの哀歌 1:1'")
		expect(p.parse("Lam 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Lam 1:1'")
		expect(p.parse("哀歌 1:1").osis()).toEqual("Lam.1.1", "parsing: '哀歌 1:1'")
		expect(p.parse("哀 1:1").osis()).toEqual("Lam.1.1", "parsing: '哀 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("エレミヤの哀歌 1:1").osis()).toEqual("Lam.1.1", "parsing: 'エレミヤの哀歌 1:1'")
		expect(p.parse("LAM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'LAM 1:1'")
		expect(p.parse("哀歌 1:1").osis()).toEqual("Lam.1.1", "parsing: '哀歌 1:1'")
		expect(p.parse("哀 1:1").osis()).toEqual("Lam.1.1", "parsing: '哀 1:1'")
		`
		true
describe "Localized book EpJer (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: EpJer (ja)", ->
		`
		expect(p.parse("イエレミヤの達書 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'イエレミヤの達書 1:1'")
		expect(p.parse("エレミヤの手紙 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'エレミヤの手紙 1:1'")
		expect(p.parse("エレミヤの書翰 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'エレミヤの書翰 1:1'")
		expect(p.parse("エレミヤ・手 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'エレミヤ・手 1:1'")
		expect(p.parse("EpJer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'EpJer 1:1'")
		`
		true
describe "Localized book Rev (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Rev (ja)", ->
		`
		expect(p.parse("ヨハネの默示録 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ヨハネの默示録 1:1'")
		expect(p.parse("ヨハネの黙示録 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ヨハネの黙示録 1:1'")
		expect(p.parse("Rev 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rev 1:1'")
		expect(p.parse("黙示録 1:1").osis()).toEqual("Rev.1.1", "parsing: '黙示録 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨハネの默示録 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ヨハネの默示録 1:1'")
		expect(p.parse("ヨハネの黙示録 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ヨハネの黙示録 1:1'")
		expect(p.parse("REV 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REV 1:1'")
		expect(p.parse("黙示録 1:1").osis()).toEqual("Rev.1.1", "parsing: '黙示録 1:1'")
		`
		true
describe "Localized book PrMan (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: PrMan (ja)", ->
		`
		expect(p.parse("マナセのいのり 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'マナセのいのり 1:1'")
		expect(p.parse("マナセの祈り 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'マナセの祈り 1:1'")
		expect(p.parse("マナセの祈禱 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'マナセの祈禱 1:1'")
		expect(p.parse("PrMan 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'PrMan 1:1'")
		`
		true
describe "Localized book Deut (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Deut (ja)", ->
		`
		expect(p.parse("Deut 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deut 1:1'")
		expect(p.parse("申命記 1:1").osis()).toEqual("Deut.1.1", "parsing: '申命記 1:1'")
		expect(p.parse("申命 1:1").osis()).toEqual("Deut.1.1", "parsing: '申命 1:1'")
		expect(p.parse("申 1:1").osis()).toEqual("Deut.1.1", "parsing: '申 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("DEUT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUT 1:1'")
		expect(p.parse("申命記 1:1").osis()).toEqual("Deut.1.1", "parsing: '申命記 1:1'")
		expect(p.parse("申命 1:1").osis()).toEqual("Deut.1.1", "parsing: '申命 1:1'")
		expect(p.parse("申 1:1").osis()).toEqual("Deut.1.1", "parsing: '申 1:1'")
		`
		true
describe "Localized book Josh (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Josh (ja)", ->
		`
		expect(p.parse("ヨシュア記 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ヨシュア記 1:1'")
		expect(p.parse("Josh 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josh 1:1'")
		expect(p.parse("ヨシュア 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ヨシュア 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨシュア記 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ヨシュア記 1:1'")
		expect(p.parse("JOSH 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSH 1:1'")
		expect(p.parse("ヨシュア 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ヨシュア 1:1'")
		`
		true
describe "Localized book Judg (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Judg (ja)", ->
		`
		expect(p.parse("Judg 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Judg 1:1'")
		expect(p.parse("士師記 1:1").osis()).toEqual("Judg.1.1", "parsing: '士師記 1:1'")
		expect(p.parse("士師 1:1").osis()).toEqual("Judg.1.1", "parsing: '士師 1:1'")
		expect(p.parse("士 1:1").osis()).toEqual("Judg.1.1", "parsing: '士 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JUDG 1:1").osis()).toEqual("Judg.1.1", "parsing: 'JUDG 1:1'")
		expect(p.parse("士師記 1:1").osis()).toEqual("Judg.1.1", "parsing: '士師記 1:1'")
		expect(p.parse("士師 1:1").osis()).toEqual("Judg.1.1", "parsing: '士師 1:1'")
		expect(p.parse("士 1:1").osis()).toEqual("Judg.1.1", "parsing: '士 1:1'")
		`
		true
describe "Localized book Ruth (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ruth (ja)", ->
		`
		expect(p.parse("Ruth 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruth 1:1'")
		expect(p.parse("ルツ記 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ルツ記 1:1'")
		expect(p.parse("ルツ 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ルツ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("RUTH 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTH 1:1'")
		expect(p.parse("ルツ記 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ルツ記 1:1'")
		expect(p.parse("ルツ 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ルツ 1:1'")
		`
		true
describe "Localized book 1Esd (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Esd (ja)", ->
		`
		expect(p.parse("エストラ第一巻 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'エストラ第一巻 1:1'")
		expect(p.parse("エスドラ第一巻 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'エスドラ第一巻 1:1'")
		expect(p.parse("エズトラ第一巻 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'エズトラ第一巻 1:1'")
		expect(p.parse("エズドラ第一巻 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'エズドラ第一巻 1:1'")
		expect(p.parse("エスラ第一書 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'エスラ第一書 1:1'")
		expect(p.parse("エズラ第一書 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'エズラ第一書 1:1'")
		expect(p.parse("1Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1Esd 1:1'")
		`
		true
describe "Localized book 2Esd (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Esd (ja)", ->
		`
		expect(p.parse("エストラ第二巻 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'エストラ第二巻 1:1'")
		expect(p.parse("エスドラ第二巻 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'エスドラ第二巻 1:1'")
		expect(p.parse("エズトラ第二巻 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'エズトラ第二巻 1:1'")
		expect(p.parse("エズドラ第二巻 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'エズドラ第二巻 1:1'")
		expect(p.parse("エスラ第二書 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'エスラ第二書 1:1'")
		expect(p.parse("エズラ第二書 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'エズラ第二書 1:1'")
		expect(p.parse("2Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2Esd 1:1'")
		`
		true
describe "Localized book Isa (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Isa (ja)", ->
		`
		expect(p.parse("イサヤ書 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イサヤ書 1:1'")
		expect(p.parse("イザヤ書 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イザヤ書 1:1'")
		expect(p.parse("Isa 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isa 1:1'")
		expect(p.parse("イサヤ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イサヤ 1:1'")
		expect(p.parse("イザヤ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イザヤ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("イサヤ書 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イサヤ書 1:1'")
		expect(p.parse("イザヤ書 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イザヤ書 1:1'")
		expect(p.parse("ISA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISA 1:1'")
		expect(p.parse("イサヤ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イサヤ 1:1'")
		expect(p.parse("イザヤ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'イザヤ 1:1'")
		`
		true
describe "Localized book 2Sam (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Sam (ja)", ->
		`
		expect(p.parse("サムエル 2 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル 2 1:1'")
		expect(p.parse("サムエル後書 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル後書 1:1'")
		expect(p.parse("サムエル記Ⅱ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル記Ⅱ 1:1'")
		expect(p.parse("サムエル記下 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル記下 1:1'")
		expect(p.parse("列王記第二巻 1:1").osis()).toEqual("2Sam.1.1", "parsing: '列王記第二巻 1:1'")
		expect(p.parse("Ⅱサムエル 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Ⅱサムエル 1:1'")
		expect(p.parse("サムエル下 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル下 1:1'")
		expect(p.parse("2Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("サムエル 2 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル 2 1:1'")
		expect(p.parse("サムエル後書 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル後書 1:1'")
		expect(p.parse("サムエル記Ⅱ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル記Ⅱ 1:1'")
		expect(p.parse("サムエル記下 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル記下 1:1'")
		expect(p.parse("列王記第二巻 1:1").osis()).toEqual("2Sam.1.1", "parsing: '列王記第二巻 1:1'")
		expect(p.parse("Ⅱサムエル 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Ⅱサムエル 1:1'")
		expect(p.parse("サムエル下 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'サムエル下 1:1'")
		expect(p.parse("2SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2SAM 1:1'")
		`
		true
describe "Localized book 1Sam (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Sam (ja)", ->
		`
		expect(p.parse("サムエル 1 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル 1 1:1'")
		expect(p.parse("サムエル前書 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル前書 1:1'")
		expect(p.parse("サムエル記Ⅰ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル記Ⅰ 1:1'")
		expect(p.parse("サムエル記上 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル記上 1:1'")
		expect(p.parse("列王記第一巻 1:1").osis()).toEqual("1Sam.1.1", "parsing: '列王記第一巻 1:1'")
		expect(p.parse("Ⅰサムエル 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Ⅰサムエル 1:1'")
		expect(p.parse("サムエル上 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル上 1:1'")
		expect(p.parse("1Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("サムエル 1 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル 1 1:1'")
		expect(p.parse("サムエル前書 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル前書 1:1'")
		expect(p.parse("サムエル記Ⅰ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル記Ⅰ 1:1'")
		expect(p.parse("サムエル記上 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル記上 1:1'")
		expect(p.parse("列王記第一巻 1:1").osis()).toEqual("1Sam.1.1", "parsing: '列王記第一巻 1:1'")
		expect(p.parse("Ⅰサムエル 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Ⅰサムエル 1:1'")
		expect(p.parse("サムエル上 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'サムエル上 1:1'")
		expect(p.parse("1SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1SAM 1:1'")
		`
		true
describe "Localized book 2Kgs (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Kgs (ja)", ->
		`
		expect(p.parse("列王記第四巻 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王記第四巻 1:1'")
		expect(p.parse("列王紀略下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王紀略下 1:1'")
		expect(p.parse("2Kgs 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2Kgs 1:1'")
		expect(p.parse("列王 2 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王 2 1:1'")
		expect(p.parse("列王紀下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王紀下 1:1'")
		expect(p.parse("列王記Ⅱ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王記Ⅱ 1:1'")
		expect(p.parse("列王記下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王記下 1:1'")
		expect(p.parse("Ⅱ列王 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Ⅱ列王 1:1'")
		expect(p.parse("列下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列下 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("列王記第四巻 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王記第四巻 1:1'")
		expect(p.parse("列王紀略下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王紀略下 1:1'")
		expect(p.parse("2KGS 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2KGS 1:1'")
		expect(p.parse("列王 2 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王 2 1:1'")
		expect(p.parse("列王紀下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王紀下 1:1'")
		expect(p.parse("列王記Ⅱ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王記Ⅱ 1:1'")
		expect(p.parse("列王記下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列王記下 1:1'")
		expect(p.parse("Ⅱ列王 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Ⅱ列王 1:1'")
		expect(p.parse("列下 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '列下 1:1'")
		`
		true
describe "Localized book 1Kgs (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Kgs (ja)", ->
		`
		expect(p.parse("列王記第三巻 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王記第三巻 1:1'")
		expect(p.parse("列王紀略上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王紀略上 1:1'")
		expect(p.parse("1Kgs 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1Kgs 1:1'")
		expect(p.parse("列王 1 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王 1 1:1'")
		expect(p.parse("列王紀上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王紀上 1:1'")
		expect(p.parse("列王記Ⅰ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王記Ⅰ 1:1'")
		expect(p.parse("列王記上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王記上 1:1'")
		expect(p.parse("Ⅰ列王 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Ⅰ列王 1:1'")
		expect(p.parse("列上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列上 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("列王記第三巻 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王記第三巻 1:1'")
		expect(p.parse("列王紀略上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王紀略上 1:1'")
		expect(p.parse("1KGS 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1KGS 1:1'")
		expect(p.parse("列王 1 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王 1 1:1'")
		expect(p.parse("列王紀上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王紀上 1:1'")
		expect(p.parse("列王記Ⅰ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王記Ⅰ 1:1'")
		expect(p.parse("列王記上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列王記上 1:1'")
		expect(p.parse("Ⅰ列王 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Ⅰ列王 1:1'")
		expect(p.parse("列上 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '列上 1:1'")
		`
		true
describe "Localized book 2Chr (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Chr (ja)", ->
		`
		expect(p.parse("歴代志略下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代志略下 1:1'")
		expect(p.parse("歴代誌 2 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代誌 2 1:1'")
		expect(p.parse("2Chr 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2Chr 1:1'")
		expect(p.parse("歴代史下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代史下 1:1'")
		expect(p.parse("歴代志下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代志下 1:1'")
		expect(p.parse("歴代誌Ⅱ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代誌Ⅱ 1:1'")
		expect(p.parse("歴代誌下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代誌下 1:1'")
		expect(p.parse("Ⅱ歴代 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ⅱ歴代 1:1'")
		expect(p.parse("歴下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴下 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("歴代志略下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代志略下 1:1'")
		expect(p.parse("歴代誌 2 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代誌 2 1:1'")
		expect(p.parse("2CHR 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2CHR 1:1'")
		expect(p.parse("歴代史下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代史下 1:1'")
		expect(p.parse("歴代志下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代志下 1:1'")
		expect(p.parse("歴代誌Ⅱ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代誌Ⅱ 1:1'")
		expect(p.parse("歴代誌下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴代誌下 1:1'")
		expect(p.parse("Ⅱ歴代 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ⅱ歴代 1:1'")
		expect(p.parse("歴下 1:1").osis()).toEqual("2Chr.1.1", "parsing: '歴下 1:1'")
		`
		true
describe "Localized book 1Chr (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Chr (ja)", ->
		`
		expect(p.parse("歴代志略上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代志略上 1:1'")
		expect(p.parse("歴代誌 1 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代誌 1 1:1'")
		expect(p.parse("1Chr 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1Chr 1:1'")
		expect(p.parse("歴代史上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代史上 1:1'")
		expect(p.parse("歴代志上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代志上 1:1'")
		expect(p.parse("歴代誌Ⅰ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代誌Ⅰ 1:1'")
		expect(p.parse("歴代誌上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代誌上 1:1'")
		expect(p.parse("Ⅰ歴代 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Ⅰ歴代 1:1'")
		expect(p.parse("歴上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴上 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("歴代志略上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代志略上 1:1'")
		expect(p.parse("歴代誌 1 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代誌 1 1:1'")
		expect(p.parse("1CHR 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1CHR 1:1'")
		expect(p.parse("歴代史上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代史上 1:1'")
		expect(p.parse("歴代志上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代志上 1:1'")
		expect(p.parse("歴代誌Ⅰ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代誌Ⅰ 1:1'")
		expect(p.parse("歴代誌上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴代誌上 1:1'")
		expect(p.parse("Ⅰ歴代 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Ⅰ歴代 1:1'")
		expect(p.parse("歴上 1:1").osis()).toEqual("1Chr.1.1", "parsing: '歴上 1:1'")
		`
		true
describe "Localized book Ezra (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ezra (ja)", ->
		`
		expect(p.parse("Ezra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezra 1:1'")
		expect(p.parse("エスラ書 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エスラ書 1:1'")
		expect(p.parse("エスラ記 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エスラ記 1:1'")
		expect(p.parse("エズラ書 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エズラ書 1:1'")
		expect(p.parse("エズラ記 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エズラ記 1:1'")
		expect(p.parse("エスラ 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エスラ 1:1'")
		expect(p.parse("エズラ 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エズラ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZRA 1:1'")
		expect(p.parse("エスラ書 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エスラ書 1:1'")
		expect(p.parse("エスラ記 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エスラ記 1:1'")
		expect(p.parse("エズラ書 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エズラ書 1:1'")
		expect(p.parse("エズラ記 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エズラ記 1:1'")
		expect(p.parse("エスラ 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エスラ 1:1'")
		expect(p.parse("エズラ 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'エズラ 1:1'")
		`
		true
describe "Localized book Neh (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Neh (ja)", ->
		`
		expect(p.parse("ネヘミヤ 記 1:1").osis()).toEqual("Neh.1.1", "parsing: 'ネヘミヤ 記 1:1'")
		expect(p.parse("ネヘミヤ記 1:1").osis()).toEqual("Neh.1.1", "parsing: 'ネヘミヤ記 1:1'")
		expect(p.parse("ネヘミヤ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'ネヘミヤ 1:1'")
		expect(p.parse("Neh 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Neh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ネヘミヤ 記 1:1").osis()).toEqual("Neh.1.1", "parsing: 'ネヘミヤ 記 1:1'")
		expect(p.parse("ネヘミヤ記 1:1").osis()).toEqual("Neh.1.1", "parsing: 'ネヘミヤ記 1:1'")
		expect(p.parse("ネヘミヤ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'ネヘミヤ 1:1'")
		expect(p.parse("NEH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEH 1:1'")
		`
		true
describe "Localized book GkEsth (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: GkEsth (ja)", ->
		`
		expect(p.parse("エステル書殘篇 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'エステル書殘篇 1:1'")
		expect(p.parse("エステル記補遺 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'エステル記補遺 1:1'")
		expect(p.parse("GkEsth 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'GkEsth 1:1'")
		`
		true
describe "Localized book Esth (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Esth (ja)", ->
		`
		expect(p.parse("エステル 記 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル 記 1:1'")
		expect(p.parse("エステル書 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル書 1:1'")
		expect(p.parse("エステル記 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル記 1:1'")
		expect(p.parse("Esth 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esth 1:1'")
		expect(p.parse("エステル 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("エステル 記 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル 記 1:1'")
		expect(p.parse("エステル書 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル書 1:1'")
		expect(p.parse("エステル記 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル記 1:1'")
		expect(p.parse("ESTH 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTH 1:1'")
		expect(p.parse("エステル 1:1").osis()).toEqual("Esth.1.1", "parsing: 'エステル 1:1'")
		`
		true
describe "Localized book Job (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Job (ja)", ->
		`
		expect(p.parse("ヨフ 記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨフ 記 1:1'")
		expect(p.parse("ヨブ 記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨブ 記 1:1'")
		expect(p.parse("Job 1:1").osis()).toEqual("Job.1.1", "parsing: 'Job 1:1'")
		expect(p.parse("ヨフ記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨフ記 1:1'")
		expect(p.parse("ヨブ記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨブ記 1:1'")
		expect(p.parse("ヨフ 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨフ 1:1'")
		expect(p.parse("ヨブ 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨブ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨフ 記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨフ 記 1:1'")
		expect(p.parse("ヨブ 記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨブ 記 1:1'")
		expect(p.parse("JOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JOB 1:1'")
		expect(p.parse("ヨフ記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨフ記 1:1'")
		expect(p.parse("ヨブ記 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨブ記 1:1'")
		expect(p.parse("ヨフ 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨフ 1:1'")
		expect(p.parse("ヨブ 1:1").osis()).toEqual("Job.1.1", "parsing: 'ヨブ 1:1'")
		`
		true
describe "Localized book Ps (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ps (ja)", ->
		`
		expect(p.parse("詩篇/聖詠 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩篇/聖詠 1:1'")
		expect(p.parse("Ps 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Ps 1:1'")
		expect(p.parse("詩篇 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩篇 1:1'")
		expect(p.parse("詩編 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩編 1:1'")
		expect(p.parse("詩 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("詩篇/聖詠 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩篇/聖詠 1:1'")
		expect(p.parse("PS 1:1").osis()).toEqual("Ps.1.1", "parsing: 'PS 1:1'")
		expect(p.parse("詩篇 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩篇 1:1'")
		expect(p.parse("詩編 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩編 1:1'")
		expect(p.parse("詩 1:1").osis()).toEqual("Ps.1.1", "parsing: '詩 1:1'")
		`
		true
describe "Localized book PrAzar (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: PrAzar (ja)", ->
		`
		expect(p.parse("アサルヤの祈り 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'アサルヤの祈り 1:1'")
		expect(p.parse("アザルヤの祈り 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'アザルヤの祈り 1:1'")
		expect(p.parse("PrAzar 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'PrAzar 1:1'")
		`
		true
describe "Localized book Prov (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Prov (ja)", ->
		`
		expect(p.parse("箴言 知恵の泉 1:1").osis()).toEqual("Prov.1.1", "parsing: '箴言 知恵の泉 1:1'")
		expect(p.parse("Prov 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Prov 1:1'")
		expect(p.parse("格言の書 1:1").osis()).toEqual("Prov.1.1", "parsing: '格言の書 1:1'")
		expect(p.parse("箴言 1:1").osis()).toEqual("Prov.1.1", "parsing: '箴言 1:1'")
		expect(p.parse("格 1:1").osis()).toEqual("Prov.1.1", "parsing: '格 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("箴言 知恵の泉 1:1").osis()).toEqual("Prov.1.1", "parsing: '箴言 知恵の泉 1:1'")
		expect(p.parse("PROV 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PROV 1:1'")
		expect(p.parse("格言の書 1:1").osis()).toEqual("Prov.1.1", "parsing: '格言の書 1:1'")
		expect(p.parse("箴言 1:1").osis()).toEqual("Prov.1.1", "parsing: '箴言 1:1'")
		expect(p.parse("格 1:1").osis()).toEqual("Prov.1.1", "parsing: '格 1:1'")
		`
		true
describe "Localized book Eccl (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Eccl (ja)", ->
		`
		expect(p.parse("コヘレトのことは 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレトのことは 1:1'")
		expect(p.parse("コヘレトのことば 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレトのことば 1:1'")
		expect(p.parse("コヘレトの言葉 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレトの言葉 1:1'")
		expect(p.parse("伝道者の書 1:1").osis()).toEqual("Eccl.1.1", "parsing: '伝道者の書 1:1'")
		expect(p.parse("Eccl 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eccl 1:1'")
		expect(p.parse("コヘレト 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレト 1:1'")
		expect(p.parse("伝道の書 1:1").osis()).toEqual("Eccl.1.1", "parsing: '伝道の書 1:1'")
		expect(p.parse("伝道者の 1:1").osis()).toEqual("Eccl.1.1", "parsing: '伝道者の 1:1'")
		expect(p.parse("傳道之書 1:1").osis()).toEqual("Eccl.1.1", "parsing: '傳道之書 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("コヘレトのことは 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレトのことは 1:1'")
		expect(p.parse("コヘレトのことば 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレトのことば 1:1'")
		expect(p.parse("コヘレトの言葉 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレトの言葉 1:1'")
		expect(p.parse("伝道者の書 1:1").osis()).toEqual("Eccl.1.1", "parsing: '伝道者の書 1:1'")
		expect(p.parse("ECCL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCL 1:1'")
		expect(p.parse("コヘレト 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'コヘレト 1:1'")
		expect(p.parse("伝道の書 1:1").osis()).toEqual("Eccl.1.1", "parsing: '伝道の書 1:1'")
		expect(p.parse("伝道者の 1:1").osis()).toEqual("Eccl.1.1", "parsing: '伝道者の 1:1'")
		expect(p.parse("傳道之書 1:1").osis()).toEqual("Eccl.1.1", "parsing: '傳道之書 1:1'")
		`
		true
describe "Localized book SgThree (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: SgThree (ja)", ->
		`
		expect(p.parse("三人の若者の賛歌 1:1").osis()).toEqual("SgThree.1.1", "parsing: '三人の若者の賛歌 1:1'")
		expect(p.parse("SgThree 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'SgThree 1:1'")
		expect(p.parse("三童兒の歌 1:1").osis()).toEqual("SgThree.1.1", "parsing: '三童兒の歌 1:1'")
		`
		true
describe "Localized book Song (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Song (ja)", ->
		`
		expect(p.parse("Song 1:1").osis()).toEqual("Song.1.1", "parsing: 'Song 1:1'")
		expect(p.parse("諸歌の歌 1:1").osis()).toEqual("Song.1.1", "parsing: '諸歌の歌 1:1'")
		expect(p.parse("雅歌 1:1").osis()).toEqual("Song.1.1", "parsing: '雅歌 1:1'")
		expect(p.parse("雅 1:1").osis()).toEqual("Song.1.1", "parsing: '雅 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SONG 1:1").osis()).toEqual("Song.1.1", "parsing: 'SONG 1:1'")
		expect(p.parse("諸歌の歌 1:1").osis()).toEqual("Song.1.1", "parsing: '諸歌の歌 1:1'")
		expect(p.parse("雅歌 1:1").osis()).toEqual("Song.1.1", "parsing: '雅歌 1:1'")
		expect(p.parse("雅 1:1").osis()).toEqual("Song.1.1", "parsing: '雅 1:1'")
		`
		true
describe "Localized book Jer (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jer (ja)", ->
		`
		expect(p.parse("エレミヤ書 1:1").osis()).toEqual("Jer.1.1", "parsing: 'エレミヤ書 1:1'")
		expect(p.parse("ヱレミヤ記 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ヱレミヤ記 1:1'")
		expect(p.parse("エレミヤ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'エレミヤ 1:1'")
		expect(p.parse("Jer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jer 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("エレミヤ書 1:1").osis()).toEqual("Jer.1.1", "parsing: 'エレミヤ書 1:1'")
		expect(p.parse("ヱレミヤ記 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ヱレミヤ記 1:1'")
		expect(p.parse("エレミヤ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'エレミヤ 1:1'")
		expect(p.parse("JER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JER 1:1'")
		`
		true
describe "Localized book Ezek (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ezek (ja)", ->
		`
		expect(p.parse("エセキエル書 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エセキエル書 1:1'")
		expect(p.parse("エゼキエル書 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エゼキエル書 1:1'")
		expect(p.parse("エセキエル 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エセキエル 1:1'")
		expect(p.parse("エゼキエル 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エゼキエル 1:1'")
		expect(p.parse("Ezek 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezek 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("エセキエル書 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エセキエル書 1:1'")
		expect(p.parse("エゼキエル書 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エゼキエル書 1:1'")
		expect(p.parse("エセキエル 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エセキエル 1:1'")
		expect(p.parse("エゼキエル 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'エゼキエル 1:1'")
		expect(p.parse("EZEK 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEK 1:1'")
		`
		true
describe "Localized book Dan (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Dan (ja)", ->
		`
		expect(p.parse("タニエル書 1:1").osis()).toEqual("Dan.1.1", "parsing: 'タニエル書 1:1'")
		expect(p.parse("ダニエル書 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ダニエル書 1:1'")
		expect(p.parse("タニエル 1:1").osis()).toEqual("Dan.1.1", "parsing: 'タニエル 1:1'")
		expect(p.parse("ダニエル 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ダニエル 1:1'")
		expect(p.parse("Dan 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dan 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("タニエル書 1:1").osis()).toEqual("Dan.1.1", "parsing: 'タニエル書 1:1'")
		expect(p.parse("ダニエル書 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ダニエル書 1:1'")
		expect(p.parse("タニエル 1:1").osis()).toEqual("Dan.1.1", "parsing: 'タニエル 1:1'")
		expect(p.parse("ダニエル 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ダニエル 1:1'")
		expect(p.parse("DAN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DAN 1:1'")
		`
		true
describe "Localized book Hos (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Hos (ja)", ->
		`
		expect(p.parse("ホセアしょ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ホセアしょ 1:1'")
		expect(p.parse("ホセア書 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ホセア書 1:1'")
		expect(p.parse("Hos 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hos 1:1'")
		expect(p.parse("ホセア 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ホセア 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ホセアしょ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ホセアしょ 1:1'")
		expect(p.parse("ホセア書 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ホセア書 1:1'")
		expect(p.parse("HOS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOS 1:1'")
		expect(p.parse("ホセア 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ホセア 1:1'")
		`
		true
describe "Localized book Joel (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Joel (ja)", ->
		`
		expect(p.parse("よえるしょ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'よえるしょ 1:1'")
		expect(p.parse("Joel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joel 1:1'")
		expect(p.parse("ヨエル書 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ヨエル書 1:1'")
		expect(p.parse("ヨエル 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ヨエル 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("よえるしょ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'よえるしょ 1:1'")
		expect(p.parse("JOEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOEL 1:1'")
		expect(p.parse("ヨエル書 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ヨエル書 1:1'")
		expect(p.parse("ヨエル 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ヨエル 1:1'")
		`
		true
describe "Localized book Amos (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Amos (ja)", ->
		`
		expect(p.parse("アモスしょ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'アモスしょ 1:1'")
		expect(p.parse("Amos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amos 1:1'")
		expect(p.parse("アモス書 1:1").osis()).toEqual("Amos.1.1", "parsing: 'アモス書 1:1'")
		expect(p.parse("アモス 1:1").osis()).toEqual("Amos.1.1", "parsing: 'アモス 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("アモスしょ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'アモスしょ 1:1'")
		expect(p.parse("AMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOS 1:1'")
		expect(p.parse("アモス書 1:1").osis()).toEqual("Amos.1.1", "parsing: 'アモス書 1:1'")
		expect(p.parse("アモス 1:1").osis()).toEqual("Amos.1.1", "parsing: 'アモス 1:1'")
		`
		true
describe "Localized book Obad (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Obad (ja)", ->
		`
		expect(p.parse("オハテヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテヤしょ 1:1'")
		expect(p.parse("オハデヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデヤしょ 1:1'")
		expect(p.parse("オバテヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテヤしょ 1:1'")
		expect(p.parse("オバデヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデヤしょ 1:1'")
		expect(p.parse("オハテア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテア書 1:1'")
		expect(p.parse("オハテヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテヤ書 1:1'")
		expect(p.parse("オハデア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデア書 1:1'")
		expect(p.parse("オハデヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデヤ書 1:1'")
		expect(p.parse("オバテア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテア書 1:1'")
		expect(p.parse("オバテヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテヤ書 1:1'")
		expect(p.parse("オバデア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデア書 1:1'")
		expect(p.parse("オバデヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデヤ書 1:1'")
		expect(p.parse("Obad 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obad 1:1'")
		expect(p.parse("オハテヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテヤ 1:1'")
		expect(p.parse("オハデヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデヤ 1:1'")
		expect(p.parse("オバテヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテヤ 1:1'")
		expect(p.parse("オバデヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデヤ 1:1'")
		expect(p.parse("オハ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハ 1:1'")
		expect(p.parse("オバ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("オハテヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテヤしょ 1:1'")
		expect(p.parse("オハデヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデヤしょ 1:1'")
		expect(p.parse("オバテヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテヤしょ 1:1'")
		expect(p.parse("オバデヤしょ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデヤしょ 1:1'")
		expect(p.parse("オハテア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテア書 1:1'")
		expect(p.parse("オハテヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテヤ書 1:1'")
		expect(p.parse("オハデア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデア書 1:1'")
		expect(p.parse("オハデヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデヤ書 1:1'")
		expect(p.parse("オバテア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテア書 1:1'")
		expect(p.parse("オバテヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテヤ書 1:1'")
		expect(p.parse("オバデア書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデア書 1:1'")
		expect(p.parse("オバデヤ書 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデヤ書 1:1'")
		expect(p.parse("OBAD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBAD 1:1'")
		expect(p.parse("オハテヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハテヤ 1:1'")
		expect(p.parse("オハデヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハデヤ 1:1'")
		expect(p.parse("オバテヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバテヤ 1:1'")
		expect(p.parse("オバデヤ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバデヤ 1:1'")
		expect(p.parse("オハ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オハ 1:1'")
		expect(p.parse("オバ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'オバ 1:1'")
		`
		true
describe "Localized book Jonah (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jonah (ja)", ->
		`
		expect(p.parse("Jonah 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonah 1:1'")
		expect(p.parse("ヨナしょ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ヨナしょ 1:1'")
		expect(p.parse("ヨナ書 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ヨナ書 1:1'")
		expect(p.parse("ヨナ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ヨナ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JONAH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAH 1:1'")
		expect(p.parse("ヨナしょ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ヨナしょ 1:1'")
		expect(p.parse("ヨナ書 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ヨナ書 1:1'")
		expect(p.parse("ヨナ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ヨナ 1:1'")
		`
		true
describe "Localized book Mic (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Mic (ja)", ->
		`
		expect(p.parse("ミカしょ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'ミカしょ 1:1'")
		expect(p.parse("Mic 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mic 1:1'")
		expect(p.parse("ミカ書 1:1").osis()).toEqual("Mic.1.1", "parsing: 'ミカ書 1:1'")
		expect(p.parse("ミカ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'ミカ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ミカしょ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'ミカしょ 1:1'")
		expect(p.parse("MIC 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIC 1:1'")
		expect(p.parse("ミカ書 1:1").osis()).toEqual("Mic.1.1", "parsing: 'ミカ書 1:1'")
		expect(p.parse("ミカ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'ミカ 1:1'")
		`
		true
describe "Localized book Nah (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Nah (ja)", ->
		`
		expect(p.parse("ナホムしょ 1:1").osis()).toEqual("Nah.1.1", "parsing: 'ナホムしょ 1:1'")
		expect(p.parse("ナホム書 1:1").osis()).toEqual("Nah.1.1", "parsing: 'ナホム書 1:1'")
		expect(p.parse("Nah 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nah 1:1'")
		expect(p.parse("ナホム 1:1").osis()).toEqual("Nah.1.1", "parsing: 'ナホム 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ナホムしょ 1:1").osis()).toEqual("Nah.1.1", "parsing: 'ナホムしょ 1:1'")
		expect(p.parse("ナホム書 1:1").osis()).toEqual("Nah.1.1", "parsing: 'ナホム書 1:1'")
		expect(p.parse("NAH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAH 1:1'")
		expect(p.parse("ナホム 1:1").osis()).toEqual("Nah.1.1", "parsing: 'ナホム 1:1'")
		`
		true
describe "Localized book Hab (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Hab (ja)", ->
		`
		expect(p.parse("ハハククしょ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハハククしょ 1:1'")
		expect(p.parse("ハバククしょ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハバククしょ 1:1'")
		expect(p.parse("ハハクク書 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハハクク書 1:1'")
		expect(p.parse("ハバクク書 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハバクク書 1:1'")
		expect(p.parse("ハハクク 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハハクク 1:1'")
		expect(p.parse("ハバクク 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハバクク 1:1'")
		expect(p.parse("Hab 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Hab 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ハハククしょ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハハククしょ 1:1'")
		expect(p.parse("ハバククしょ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハバククしょ 1:1'")
		expect(p.parse("ハハクク書 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハハクク書 1:1'")
		expect(p.parse("ハバクク書 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハバクク書 1:1'")
		expect(p.parse("ハハクク 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハハクク 1:1'")
		expect(p.parse("ハバクク 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ハバクク 1:1'")
		expect(p.parse("HAB 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HAB 1:1'")
		`
		true
describe "Localized book Zeph (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Zeph (ja)", ->
		`
		expect(p.parse("セファニヤしょ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニヤしょ 1:1'")
		expect(p.parse("ゼファニヤしょ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニヤしょ 1:1'")
		expect(p.parse("セファニア書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニア書 1:1'")
		expect(p.parse("セファニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニヤ書 1:1'")
		expect(p.parse("ゼファニア書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニア書 1:1'")
		expect(p.parse("ゼファニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニヤ書 1:1'")
		expect(p.parse("セハニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セハニヤ書 1:1'")
		expect(p.parse("セパニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セパニヤ書 1:1'")
		expect(p.parse("セファニア 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニア 1:1'")
		expect(p.parse("ゼハニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼハニヤ書 1:1'")
		expect(p.parse("ゼパニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼパニヤ書 1:1'")
		expect(p.parse("ゼファニア 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニア 1:1'")
		expect(p.parse("Zeph 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zeph 1:1'")
		expect(p.parse("セハニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セハニヤ 1:1'")
		expect(p.parse("セパニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セパニヤ 1:1'")
		expect(p.parse("ゼハニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼハニヤ 1:1'")
		expect(p.parse("ゼパニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼパニヤ 1:1'")
		expect(p.parse("セファ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファ 1:1'")
		expect(p.parse("ゼファ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("セファニヤしょ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニヤしょ 1:1'")
		expect(p.parse("ゼファニヤしょ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニヤしょ 1:1'")
		expect(p.parse("セファニア書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニア書 1:1'")
		expect(p.parse("セファニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニヤ書 1:1'")
		expect(p.parse("ゼファニア書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニア書 1:1'")
		expect(p.parse("ゼファニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニヤ書 1:1'")
		expect(p.parse("セハニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セハニヤ書 1:1'")
		expect(p.parse("セパニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セパニヤ書 1:1'")
		expect(p.parse("セファニア 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファニア 1:1'")
		expect(p.parse("ゼハニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼハニヤ書 1:1'")
		expect(p.parse("ゼパニヤ書 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼパニヤ書 1:1'")
		expect(p.parse("ゼファニア 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファニア 1:1'")
		expect(p.parse("ZEPH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPH 1:1'")
		expect(p.parse("セハニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セハニヤ 1:1'")
		expect(p.parse("セパニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セパニヤ 1:1'")
		expect(p.parse("ゼハニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼハニヤ 1:1'")
		expect(p.parse("ゼパニヤ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼパニヤ 1:1'")
		expect(p.parse("セファ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'セファ 1:1'")
		expect(p.parse("ゼファ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ゼファ 1:1'")
		`
		true
describe "Localized book Hag (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Hag (ja)", ->
		`
		expect(p.parse("ハカイしょ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハカイしょ 1:1'")
		expect(p.parse("ハガイしょ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハガイしょ 1:1'")
		expect(p.parse("ハカイ書 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハカイ書 1:1'")
		expect(p.parse("ハガイ書 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハガイ書 1:1'")
		expect(p.parse("Hag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hag 1:1'")
		expect(p.parse("ハカイ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハカイ 1:1'")
		expect(p.parse("ハガイ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハガイ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ハカイしょ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハカイしょ 1:1'")
		expect(p.parse("ハガイしょ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハガイしょ 1:1'")
		expect(p.parse("ハカイ書 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハカイ書 1:1'")
		expect(p.parse("ハガイ書 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハガイ書 1:1'")
		expect(p.parse("HAG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAG 1:1'")
		expect(p.parse("ハカイ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハカイ 1:1'")
		expect(p.parse("ハガイ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ハガイ 1:1'")
		`
		true
describe "Localized book Zech (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Zech (ja)", ->
		`
		expect(p.parse("セカリヤしょ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'セカリヤしょ 1:1'")
		expect(p.parse("ゼカリヤしょ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ゼカリヤしょ 1:1'")
		expect(p.parse("セカリヤ書 1:1").osis()).toEqual("Zech.1.1", "parsing: 'セカリヤ書 1:1'")
		expect(p.parse("ゼカリヤ書 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ゼカリヤ書 1:1'")
		expect(p.parse("Zech 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zech 1:1'")
		expect(p.parse("セカリヤ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'セカリヤ 1:1'")
		expect(p.parse("ゼカリヤ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ゼカリヤ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("セカリヤしょ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'セカリヤしょ 1:1'")
		expect(p.parse("ゼカリヤしょ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ゼカリヤしょ 1:1'")
		expect(p.parse("セカリヤ書 1:1").osis()).toEqual("Zech.1.1", "parsing: 'セカリヤ書 1:1'")
		expect(p.parse("ゼカリヤ書 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ゼカリヤ書 1:1'")
		expect(p.parse("ZECH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECH 1:1'")
		expect(p.parse("セカリヤ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'セカリヤ 1:1'")
		expect(p.parse("ゼカリヤ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ゼカリヤ 1:1'")
		`
		true
describe "Localized book Mal (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Mal (ja)", ->
		`
		expect(p.parse("マラキ書 1:1").osis()).toEqual("Mal.1.1", "parsing: 'マラキ書 1:1'")
		expect(p.parse("Mal 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Mal 1:1'")
		expect(p.parse("マラキ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'マラキ 1:1'")
		expect(p.parse("マラ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'マラ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("マラキ書 1:1").osis()).toEqual("Mal.1.1", "parsing: 'マラキ書 1:1'")
		expect(p.parse("MAL 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MAL 1:1'")
		expect(p.parse("マラキ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'マラキ 1:1'")
		expect(p.parse("マラ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'マラ 1:1'")
		`
		true
describe "Localized book Matt (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Matt (ja)", ->
		`
		expect(p.parse("マタイによる福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイによる福音書 1:1'")
		expect(p.parse("マタイの福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイの福音書 1:1'")
		expect(p.parse("マタイ傳福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ傳福音書 1:1'")
		expect(p.parse("マタイ福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ福音書 1:1'")
		expect(p.parse("Matt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matt 1:1'")
		expect(p.parse("マタイ伝 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ伝 1:1'")
		expect(p.parse("マタイ書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ書 1:1'")
		expect(p.parse("マタイ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("マタイによる福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイによる福音書 1:1'")
		expect(p.parse("マタイの福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイの福音書 1:1'")
		expect(p.parse("マタイ傳福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ傳福音書 1:1'")
		expect(p.parse("マタイ福音書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ福音書 1:1'")
		expect(p.parse("MATT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATT 1:1'")
		expect(p.parse("マタイ伝 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ伝 1:1'")
		expect(p.parse("マタイ書 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ書 1:1'")
		expect(p.parse("マタイ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'マタイ 1:1'")
		`
		true
describe "Localized book Mark (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Mark (ja)", ->
		`
		expect(p.parse("マルコによる福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコによる福音書 1:1'")
		expect(p.parse("マルコの福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコの福音書 1:1'")
		expect(p.parse("マルコ傳福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ傳福音書 1:1'")
		expect(p.parse("マルコ福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ福音書 1:1'")
		expect(p.parse("Mark 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mark 1:1'")
		expect(p.parse("マルコ伝 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ伝 1:1'")
		expect(p.parse("マルコ書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ書 1:1'")
		expect(p.parse("マルコ 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("マルコによる福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコによる福音書 1:1'")
		expect(p.parse("マルコの福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコの福音書 1:1'")
		expect(p.parse("マルコ傳福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ傳福音書 1:1'")
		expect(p.parse("マルコ福音書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ福音書 1:1'")
		expect(p.parse("MARK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARK 1:1'")
		expect(p.parse("マルコ伝 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ伝 1:1'")
		expect(p.parse("マルコ書 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ書 1:1'")
		expect(p.parse("マルコ 1:1").osis()).toEqual("Mark.1.1", "parsing: 'マルコ 1:1'")
		`
		true
describe "Localized book Luke (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Luke (ja)", ->
		`
		expect(p.parse("ルカによる福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカによる福音書 1:1'")
		expect(p.parse("ルカの福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカの福音書 1:1'")
		expect(p.parse("ルカ傳福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ傳福音書 1:1'")
		expect(p.parse("ルカ福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ福音書 1:1'")
		expect(p.parse("Luke 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luke 1:1'")
		expect(p.parse("ルカ伝 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ伝 1:1'")
		expect(p.parse("ルカ書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ書 1:1'")
		expect(p.parse("ルカ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ルカによる福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカによる福音書 1:1'")
		expect(p.parse("ルカの福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカの福音書 1:1'")
		expect(p.parse("ルカ傳福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ傳福音書 1:1'")
		expect(p.parse("ルカ福音書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ福音書 1:1'")
		expect(p.parse("LUKE 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKE 1:1'")
		expect(p.parse("ルカ伝 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ伝 1:1'")
		expect(p.parse("ルカ書 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ書 1:1'")
		expect(p.parse("ルカ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ルカ 1:1'")
		`
		true
describe "Localized book 1John (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1John (ja)", ->
		`
		expect(p.parse("ヨハネの第一の手紙 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの第一の手紙 1:1'")
		expect(p.parse("ヨハネの第一の書 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの第一の書 1:1'")
		expect(p.parse("ヨハネの手紙Ⅰ 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの手紙Ⅰ 1:1'")
		expect(p.parse("ヨハネの手紙一 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの手紙一 1:1'")
		expect(p.parse("1John 1:1").osis()).toEqual("1John.1.1", "parsing: '1John 1:1'")
		expect(p.parse("Ⅰ ヨハネ 1:1").osis()).toEqual("1John.1.1", "parsing: 'Ⅰ ヨハネ 1:1'")
		expect(p.parse("ヨハネ第一 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネ第一 1:1'")
		expect(p.parse("一ヨハネ 1:1").osis()).toEqual("1John.1.1", "parsing: '一ヨハネ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨハネの第一の手紙 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの第一の手紙 1:1'")
		expect(p.parse("ヨハネの第一の書 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの第一の書 1:1'")
		expect(p.parse("ヨハネの手紙Ⅰ 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの手紙Ⅰ 1:1'")
		expect(p.parse("ヨハネの手紙一 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネの手紙一 1:1'")
		expect(p.parse("1JOHN 1:1").osis()).toEqual("1John.1.1", "parsing: '1JOHN 1:1'")
		expect(p.parse("Ⅰ ヨハネ 1:1").osis()).toEqual("1John.1.1", "parsing: 'Ⅰ ヨハネ 1:1'")
		expect(p.parse("ヨハネ第一 1:1").osis()).toEqual("1John.1.1", "parsing: 'ヨハネ第一 1:1'")
		expect(p.parse("一ヨハネ 1:1").osis()).toEqual("1John.1.1", "parsing: '一ヨハネ 1:1'")
		`
		true
describe "Localized book 2John (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2John (ja)", ->
		`
		expect(p.parse("ヨハネの第二の手紙 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの第二の手紙 1:1'")
		expect(p.parse("ヨハネの第二の書 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの第二の書 1:1'")
		expect(p.parse("ヨハネの手紙Ⅱ 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの手紙Ⅱ 1:1'")
		expect(p.parse("ヨハネの手紙二 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの手紙二 1:1'")
		expect(p.parse("2John 1:1").osis()).toEqual("2John.1.1", "parsing: '2John 1:1'")
		expect(p.parse("Ⅱ ヨハネ 1:1").osis()).toEqual("2John.1.1", "parsing: 'Ⅱ ヨハネ 1:1'")
		expect(p.parse("ヨハネ第二 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネ第二 1:1'")
		expect(p.parse("二ヨハネ 1:1").osis()).toEqual("2John.1.1", "parsing: '二ヨハネ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨハネの第二の手紙 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの第二の手紙 1:1'")
		expect(p.parse("ヨハネの第二の書 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの第二の書 1:1'")
		expect(p.parse("ヨハネの手紙Ⅱ 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの手紙Ⅱ 1:1'")
		expect(p.parse("ヨハネの手紙二 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネの手紙二 1:1'")
		expect(p.parse("2JOHN 1:1").osis()).toEqual("2John.1.1", "parsing: '2JOHN 1:1'")
		expect(p.parse("Ⅱ ヨハネ 1:1").osis()).toEqual("2John.1.1", "parsing: 'Ⅱ ヨハネ 1:1'")
		expect(p.parse("ヨハネ第二 1:1").osis()).toEqual("2John.1.1", "parsing: 'ヨハネ第二 1:1'")
		expect(p.parse("二ヨハネ 1:1").osis()).toEqual("2John.1.1", "parsing: '二ヨハネ 1:1'")
		`
		true
describe "Localized book 3John (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 3John (ja)", ->
		`
		expect(p.parse("ヨハネの第三の手紙 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの第三の手紙 1:1'")
		expect(p.parse("ヨハネの手紙三章 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの手紙三章 1:1'")
		expect(p.parse("ヨハネの第三の書 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの第三の書 1:1'")
		expect(p.parse("ヨハネの手紙Ⅲ 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの手紙Ⅲ 1:1'")
		expect(p.parse("ヨハネの手紙三 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの手紙三 1:1'")
		expect(p.parse("3John 1:1").osis()).toEqual("3John.1.1", "parsing: '3John 1:1'")
		expect(p.parse("Ⅲ ヨハネ 1:1").osis()).toEqual("3John.1.1", "parsing: 'Ⅲ ヨハネ 1:1'")
		expect(p.parse("三ヨハネ 1:1").osis()).toEqual("3John.1.1", "parsing: '三ヨハネ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨハネの第三の手紙 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの第三の手紙 1:1'")
		expect(p.parse("ヨハネの手紙三章 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの手紙三章 1:1'")
		expect(p.parse("ヨハネの第三の書 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの第三の書 1:1'")
		expect(p.parse("ヨハネの手紙Ⅲ 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの手紙Ⅲ 1:1'")
		expect(p.parse("ヨハネの手紙三 1:1").osis()).toEqual("3John.1.1", "parsing: 'ヨハネの手紙三 1:1'")
		expect(p.parse("3JOHN 1:1").osis()).toEqual("3John.1.1", "parsing: '3JOHN 1:1'")
		expect(p.parse("Ⅲ ヨハネ 1:1").osis()).toEqual("3John.1.1", "parsing: 'Ⅲ ヨハネ 1:1'")
		expect(p.parse("三ヨハネ 1:1").osis()).toEqual("3John.1.1", "parsing: '三ヨハネ 1:1'")
		`
		true
describe "Localized book John (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: John (ja)", ->
		`
		expect(p.parse("ヨハネによる福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネによる福音書 1:1'")
		expect(p.parse("ヨハネの福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネの福音書 1:1'")
		expect(p.parse("ヨハネ傳福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ傳福音書 1:1'")
		expect(p.parse("ヨハネ福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ福音書 1:1'")
		expect(p.parse("John 1:1").osis()).toEqual("John.1.1", "parsing: 'John 1:1'")
		expect(p.parse("ヨハネ伝 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ伝 1:1'")
		expect(p.parse("ヨハネ 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヨハネによる福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネによる福音書 1:1'")
		expect(p.parse("ヨハネの福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネの福音書 1:1'")
		expect(p.parse("ヨハネ傳福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ傳福音書 1:1'")
		expect(p.parse("ヨハネ福音書 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ福音書 1:1'")
		expect(p.parse("JOHN 1:1").osis()).toEqual("John.1.1", "parsing: 'JOHN 1:1'")
		expect(p.parse("ヨハネ伝 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ伝 1:1'")
		expect(p.parse("ヨハネ 1:1").osis()).toEqual("John.1.1", "parsing: 'ヨハネ 1:1'")
		`
		true
describe "Localized book Acts (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Acts (ja)", ->
		`
		expect(p.parse("使徒の働き 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒の働き 1:1'")
		expect(p.parse("使徒言行録 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒言行録 1:1'")
		expect(p.parse("Acts 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Acts 1:1'")
		expect(p.parse("使徒行伝 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒行伝 1:1'")
		expect(p.parse("使徒行傳 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒行傳 1:1'")
		expect(p.parse("使徒行録 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒行録 1:1'")
		expect(p.parse("使徒書 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒書 1:1'")
		expect(p.parse("使徒 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("使徒の働き 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒の働き 1:1'")
		expect(p.parse("使徒言行録 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒言行録 1:1'")
		expect(p.parse("ACTS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ACTS 1:1'")
		expect(p.parse("使徒行伝 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒行伝 1:1'")
		expect(p.parse("使徒行傳 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒行傳 1:1'")
		expect(p.parse("使徒行録 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒行録 1:1'")
		expect(p.parse("使徒書 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒書 1:1'")
		expect(p.parse("使徒 1:1").osis()).toEqual("Acts.1.1", "parsing: '使徒 1:1'")
		`
		true
describe "Localized book Rom (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Rom (ja)", ->
		`
		expect(p.parse("ローマの信徒への手紙 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマの信徒への手紙 1:1'")
		expect(p.parse("ローマ人への手紙 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ人への手紙 1:1'")
		expect(p.parse("ロマ人への書 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ロマ人への書 1:1'")
		expect(p.parse("ローマ人へ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ人へ 1:1'")
		expect(p.parse("ローマ書 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ書 1:1'")
		expect(p.parse("Rom 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rom 1:1'")
		expect(p.parse("ローマ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ローマの信徒への手紙 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマの信徒への手紙 1:1'")
		expect(p.parse("ローマ人への手紙 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ人への手紙 1:1'")
		expect(p.parse("ロマ人への書 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ロマ人への書 1:1'")
		expect(p.parse("ローマ人へ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ人へ 1:1'")
		expect(p.parse("ローマ書 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ書 1:1'")
		expect(p.parse("ROM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROM 1:1'")
		expect(p.parse("ローマ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ローマ 1:1'")
		`
		true
describe "Localized book 2Cor (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Cor (ja)", ->
		`
		expect(p.parse("コリントの信徒への手紙二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリントの信徒への手紙二 1:1'")
		expect(p.parse("コリント人への第二の手紙 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への第二の手紙 1:1'")
		expect(p.parse("コリント人への後の書 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への後の書 1:1'")
		expect(p.parse("コリント人への手紙Ⅱ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への手紙Ⅱ 1:1'")
		expect(p.parse("コリント人への手紙二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への手紙二 1:1'")
		expect(p.parse("コリント人への第二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への第二 1:1'")
		expect(p.parse("Ⅱ コリント人へ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ⅱ コリント人へ 1:1'")
		expect(p.parse("コリント 2 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント 2 1:1'")
		expect(p.parse("コリント後書 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント後書 1:1'")
		expect(p.parse("コリント第二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント第二 1:1'")
		expect(p.parse("2Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("コリントの信徒への手紙二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリントの信徒への手紙二 1:1'")
		expect(p.parse("コリント人への第二の手紙 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への第二の手紙 1:1'")
		expect(p.parse("コリント人への後の書 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への後の書 1:1'")
		expect(p.parse("コリント人への手紙Ⅱ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への手紙Ⅱ 1:1'")
		expect(p.parse("コリント人への手紙二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への手紙二 1:1'")
		expect(p.parse("コリント人への第二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント人への第二 1:1'")
		expect(p.parse("Ⅱ コリント人へ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ⅱ コリント人へ 1:1'")
		expect(p.parse("コリント 2 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント 2 1:1'")
		expect(p.parse("コリント後書 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント後書 1:1'")
		expect(p.parse("コリント第二 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'コリント第二 1:1'")
		expect(p.parse("2COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2COR 1:1'")
		`
		true
describe "Localized book 1Cor (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Cor (ja)", ->
		`
		expect(p.parse("コリントの信徒への手紙一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリントの信徒への手紙一 1:1'")
		expect(p.parse("コリント人への第一の手紙 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への第一の手紙 1:1'")
		expect(p.parse("コリント人への前の書 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への前の書 1:1'")
		expect(p.parse("コリント人への手紙Ⅰ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への手紙Ⅰ 1:1'")
		expect(p.parse("コリント人への手紙一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への手紙一 1:1'")
		expect(p.parse("コリント人への第一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への第一 1:1'")
		expect(p.parse("コリント第一の手紙 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント第一の手紙 1:1'")
		expect(p.parse("Ⅰ コリント人へ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Ⅰ コリント人へ 1:1'")
		expect(p.parse("コリント 1 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント 1 1:1'")
		expect(p.parse("コリント前書 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント前書 1:1'")
		expect(p.parse("コリント第一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント第一 1:1'")
		expect(p.parse("1Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("コリントの信徒への手紙一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリントの信徒への手紙一 1:1'")
		expect(p.parse("コリント人への第一の手紙 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への第一の手紙 1:1'")
		expect(p.parse("コリント人への前の書 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への前の書 1:1'")
		expect(p.parse("コリント人への手紙Ⅰ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への手紙Ⅰ 1:1'")
		expect(p.parse("コリント人への手紙一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への手紙一 1:1'")
		expect(p.parse("コリント人への第一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント人への第一 1:1'")
		expect(p.parse("コリント第一の手紙 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント第一の手紙 1:1'")
		expect(p.parse("Ⅰ コリント人へ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Ⅰ コリント人へ 1:1'")
		expect(p.parse("コリント 1 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント 1 1:1'")
		expect(p.parse("コリント前書 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント前書 1:1'")
		expect(p.parse("コリント第一 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'コリント第一 1:1'")
		expect(p.parse("1COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1COR 1:1'")
		`
		true
describe "Localized book Gal (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Gal (ja)", ->
		`
		expect(p.parse("カラテヤの信徒への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤの信徒への手紙 1:1'")
		expect(p.parse("ガラテヤの信徒への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤの信徒への手紙 1:1'")
		expect(p.parse("カラテヤ人への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ人への手紙 1:1'")
		expect(p.parse("ガラテヤ人への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ人への手紙 1:1'")
		expect(p.parse("カラテヤ人への書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ人への書 1:1'")
		expect(p.parse("ガラテヤ人への書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ人への書 1:1'")
		expect(p.parse("カラテヤ人へ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ人へ 1:1'")
		expect(p.parse("ガラテヤ人へ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ人へ 1:1'")
		expect(p.parse("カラテヤ書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ書 1:1'")
		expect(p.parse("ガラテヤ書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ書 1:1'")
		expect(p.parse("カラテヤ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ 1:1'")
		expect(p.parse("ガラテヤ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ 1:1'")
		expect(p.parse("Gal 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Gal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("カラテヤの信徒への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤの信徒への手紙 1:1'")
		expect(p.parse("ガラテヤの信徒への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤの信徒への手紙 1:1'")
		expect(p.parse("カラテヤ人への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ人への手紙 1:1'")
		expect(p.parse("ガラテヤ人への手紙 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ人への手紙 1:1'")
		expect(p.parse("カラテヤ人への書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ人への書 1:1'")
		expect(p.parse("ガラテヤ人への書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ人への書 1:1'")
		expect(p.parse("カラテヤ人へ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ人へ 1:1'")
		expect(p.parse("ガラテヤ人へ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ人へ 1:1'")
		expect(p.parse("カラテヤ書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ書 1:1'")
		expect(p.parse("ガラテヤ書 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ書 1:1'")
		expect(p.parse("カラテヤ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'カラテヤ 1:1'")
		expect(p.parse("ガラテヤ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ガラテヤ 1:1'")
		expect(p.parse("GAL 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GAL 1:1'")
		`
		true
describe "Localized book Eph (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Eph (ja)", ->
		`
		expect(p.parse("エフェソの信徒への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソの信徒への手紙 1:1'")
		expect(p.parse("エフェソ人への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソ人への手紙 1:1'")
		expect(p.parse("エヘソ人への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ人への手紙 1:1'")
		expect(p.parse("エペソ人への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ人への手紙 1:1'")
		expect(p.parse("エヘソ人への書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ人への書 1:1'")
		expect(p.parse("エペソ人への書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ人への書 1:1'")
		expect(p.parse("エフェソ書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソ書 1:1'")
		expect(p.parse("エヘソ人へ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ人へ 1:1'")
		expect(p.parse("エペソ人へ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ人へ 1:1'")
		expect(p.parse("エフェソ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソ 1:1'")
		expect(p.parse("エヘソ書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ書 1:1'")
		expect(p.parse("エペソ書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ書 1:1'")
		expect(p.parse("Eph 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Eph 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("エフェソの信徒への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソの信徒への手紙 1:1'")
		expect(p.parse("エフェソ人への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソ人への手紙 1:1'")
		expect(p.parse("エヘソ人への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ人への手紙 1:1'")
		expect(p.parse("エペソ人への手紙 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ人への手紙 1:1'")
		expect(p.parse("エヘソ人への書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ人への書 1:1'")
		expect(p.parse("エペソ人への書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ人への書 1:1'")
		expect(p.parse("エフェソ書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソ書 1:1'")
		expect(p.parse("エヘソ人へ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ人へ 1:1'")
		expect(p.parse("エペソ人へ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ人へ 1:1'")
		expect(p.parse("エフェソ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エフェソ 1:1'")
		expect(p.parse("エヘソ書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エヘソ書 1:1'")
		expect(p.parse("エペソ書 1:1").osis()).toEqual("Eph.1.1", "parsing: 'エペソ書 1:1'")
		expect(p.parse("EPH 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPH 1:1'")
		`
		true
describe "Localized book Phil (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Phil (ja)", ->
		`
		expect(p.parse("フィリヒの信徒への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒの信徒への手紙 1:1'")
		expect(p.parse("フィリピの信徒への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピの信徒への手紙 1:1'")
		expect(p.parse("フィリヒ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒ人への手紙 1:1'")
		expect(p.parse("フィリピ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピ人への手紙 1:1'")
		expect(p.parse("ヒリヒ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ人への手紙 1:1'")
		expect(p.parse("ヒリピ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ人への手紙 1:1'")
		expect(p.parse("ピリヒ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ人への手紙 1:1'")
		expect(p.parse("ピリピ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ人への手紙 1:1'")
		expect(p.parse("ヒリヒ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ人への書 1:1'")
		expect(p.parse("ヒリピ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ人への書 1:1'")
		expect(p.parse("ピリヒ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ人への書 1:1'")
		expect(p.parse("ピリピ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ人への書 1:1'")
		expect(p.parse("ヒリヒ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ人へ 1:1'")
		expect(p.parse("ヒリピ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ人へ 1:1'")
		expect(p.parse("ピリヒ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ人へ 1:1'")
		expect(p.parse("ピリピ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ人へ 1:1'")
		expect(p.parse("フィリヒ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒ書 1:1'")
		expect(p.parse("フィリピ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピ書 1:1'")
		expect(p.parse("Phil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Phil 1:1'")
		expect(p.parse("ヒリヒ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ書 1:1'")
		expect(p.parse("ヒリピ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ書 1:1'")
		expect(p.parse("ピリヒ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ書 1:1'")
		expect(p.parse("ピリピ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ書 1:1'")
		expect(p.parse("フィリヒ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒ 1:1'")
		expect(p.parse("フィリピ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピ 1:1'")
		expect(p.parse("ヒリヒ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ 1:1'")
		expect(p.parse("ヒリピ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ 1:1'")
		expect(p.parse("ピリヒ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ 1:1'")
		expect(p.parse("ピリピ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("フィリヒの信徒への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒの信徒への手紙 1:1'")
		expect(p.parse("フィリピの信徒への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピの信徒への手紙 1:1'")
		expect(p.parse("フィリヒ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒ人への手紙 1:1'")
		expect(p.parse("フィリピ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピ人への手紙 1:1'")
		expect(p.parse("ヒリヒ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ人への手紙 1:1'")
		expect(p.parse("ヒリピ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ人への手紙 1:1'")
		expect(p.parse("ピリヒ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ人への手紙 1:1'")
		expect(p.parse("ピリピ人への手紙 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ人への手紙 1:1'")
		expect(p.parse("ヒリヒ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ人への書 1:1'")
		expect(p.parse("ヒリピ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ人への書 1:1'")
		expect(p.parse("ピリヒ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ人への書 1:1'")
		expect(p.parse("ピリピ人への書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ人への書 1:1'")
		expect(p.parse("ヒリヒ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ人へ 1:1'")
		expect(p.parse("ヒリピ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ人へ 1:1'")
		expect(p.parse("ピリヒ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ人へ 1:1'")
		expect(p.parse("ピリピ人へ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ人へ 1:1'")
		expect(p.parse("フィリヒ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒ書 1:1'")
		expect(p.parse("フィリピ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピ書 1:1'")
		expect(p.parse("PHIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHIL 1:1'")
		expect(p.parse("ヒリヒ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ書 1:1'")
		expect(p.parse("ヒリピ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ書 1:1'")
		expect(p.parse("ピリヒ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ書 1:1'")
		expect(p.parse("ピリピ書 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ書 1:1'")
		expect(p.parse("フィリヒ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリヒ 1:1'")
		expect(p.parse("フィリピ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'フィリピ 1:1'")
		expect(p.parse("ヒリヒ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリヒ 1:1'")
		expect(p.parse("ヒリピ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ヒリピ 1:1'")
		expect(p.parse("ピリヒ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリヒ 1:1'")
		expect(p.parse("ピリピ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ピリピ 1:1'")
		`
		true
describe "Localized book Col (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Col (ja)", ->
		`
		expect(p.parse("コロサイの信徒への手紙 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイの信徒への手紙 1:1'")
		expect(p.parse("コロサイ人への手紙 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ人への手紙 1:1'")
		expect(p.parse("コロサイ人への書 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ人への書 1:1'")
		expect(p.parse("コロサイ人へ 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ人へ 1:1'")
		expect(p.parse("コロサイ書 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ書 1:1'")
		expect(p.parse("コロサイ 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ 1:1'")
		expect(p.parse("Col 1:1").osis()).toEqual("Col.1.1", "parsing: 'Col 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("コロサイの信徒への手紙 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイの信徒への手紙 1:1'")
		expect(p.parse("コロサイ人への手紙 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ人への手紙 1:1'")
		expect(p.parse("コロサイ人への書 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ人への書 1:1'")
		expect(p.parse("コロサイ人へ 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ人へ 1:1'")
		expect(p.parse("コロサイ書 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ書 1:1'")
		expect(p.parse("コロサイ 1:1").osis()).toEqual("Col.1.1", "parsing: 'コロサイ 1:1'")
		expect(p.parse("COL 1:1").osis()).toEqual("Col.1.1", "parsing: 'COL 1:1'")
		`
		true
describe "Localized book 2Thess (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Thess (ja)", ->
		`
		expect(p.parse("テサロニケの信徒への手紙二 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケの信徒への手紙二 1:1'")
		expect(p.parse("テサロニケ人への第二の手紙 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への第二の手紙 1:1'")
		expect(p.parse("テサロニケ人への後の書 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への後の書 1:1'")
		expect(p.parse("テサロニケ人への手紙Ⅱ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への手紙Ⅱ 1:1'")
		expect(p.parse("テサロニケ人への手紙二 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への手紙二 1:1'")
		expect(p.parse("Ⅱ テサロニケ人へ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ⅱ テサロニケ人へ 1:1'")
		expect(p.parse("テサロニケ 2 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ 2 1:1'")
		expect(p.parse("テサロニケ後書 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ後書 1:1'")
		expect(p.parse("2Thess 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2Thess 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("テサロニケの信徒への手紙二 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケの信徒への手紙二 1:1'")
		expect(p.parse("テサロニケ人への第二の手紙 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への第二の手紙 1:1'")
		expect(p.parse("テサロニケ人への後の書 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への後の書 1:1'")
		expect(p.parse("テサロニケ人への手紙Ⅱ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への手紙Ⅱ 1:1'")
		expect(p.parse("テサロニケ人への手紙二 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ人への手紙二 1:1'")
		expect(p.parse("Ⅱ テサロニケ人へ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ⅱ テサロニケ人へ 1:1'")
		expect(p.parse("テサロニケ 2 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ 2 1:1'")
		expect(p.parse("テサロニケ後書 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'テサロニケ後書 1:1'")
		expect(p.parse("2THESS 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2THESS 1:1'")
		`
		true
describe "Localized book 1Thess (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Thess (ja)", ->
		`
		expect(p.parse("テサロニケの信徒への手紙一 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケの信徒への手紙一 1:1'")
		expect(p.parse("テサロニケ人への第一の手紙 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への第一の手紙 1:1'")
		expect(p.parse("テサロニケ人への前の書 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への前の書 1:1'")
		expect(p.parse("テサロニケ人への手紙Ⅰ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への手紙Ⅰ 1:1'")
		expect(p.parse("テサロニケ人への手紙一 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への手紙一 1:1'")
		expect(p.parse("Ⅰ テサロニケ人へ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Ⅰ テサロニケ人へ 1:1'")
		expect(p.parse("テサロニケ 1 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ 1 1:1'")
		expect(p.parse("テサロニケ前書 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ前書 1:1'")
		expect(p.parse("1Thess 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1Thess 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("テサロニケの信徒への手紙一 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケの信徒への手紙一 1:1'")
		expect(p.parse("テサロニケ人への第一の手紙 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への第一の手紙 1:1'")
		expect(p.parse("テサロニケ人への前の書 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への前の書 1:1'")
		expect(p.parse("テサロニケ人への手紙Ⅰ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への手紙Ⅰ 1:1'")
		expect(p.parse("テサロニケ人への手紙一 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ人への手紙一 1:1'")
		expect(p.parse("Ⅰ テサロニケ人へ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Ⅰ テサロニケ人へ 1:1'")
		expect(p.parse("テサロニケ 1 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ 1 1:1'")
		expect(p.parse("テサロニケ前書 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'テサロニケ前書 1:1'")
		expect(p.parse("1THESS 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1THESS 1:1'")
		`
		true
describe "Localized book 2Tim (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Tim (ja)", ->
		`
		expect(p.parse("テモテヘの第二の手紙 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテヘの第二の手紙 1:1'")
		expect(p.parse("テモテへの後の書 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテへの後の書 1:1'")
		expect(p.parse("テモテへの手紙Ⅱ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテへの手紙Ⅱ 1:1'")
		expect(p.parse("テモテへの手紙二 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテへの手紙二 1:1'")
		expect(p.parse("Ⅱ テモテへ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Ⅱ テモテへ 1:1'")
		expect(p.parse("テモテ 2 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテ 2 1:1'")
		expect(p.parse("テモテ後書 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテ後書 1:1'")
		expect(p.parse("テモテ第二 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテ第二 1:1'")
		expect(p.parse("2Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2Tim 1:1'")
		expect(p.parse("二テモテ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '二テモテ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("テモテヘの第二の手紙 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテヘの第二の手紙 1:1'")
		expect(p.parse("テモテへの後の書 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテへの後の書 1:1'")
		expect(p.parse("テモテへの手紙Ⅱ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテへの手紙Ⅱ 1:1'")
		expect(p.parse("テモテへの手紙二 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテへの手紙二 1:1'")
		expect(p.parse("Ⅱ テモテへ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Ⅱ テモテへ 1:1'")
		expect(p.parse("テモテ 2 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテ 2 1:1'")
		expect(p.parse("テモテ後書 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテ後書 1:1'")
		expect(p.parse("テモテ第二 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'テモテ第二 1:1'")
		expect(p.parse("2TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2TIM 1:1'")
		expect(p.parse("二テモテ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '二テモテ 1:1'")
		`
		true
describe "Localized book 1Tim (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Tim (ja)", ->
		`
		expect(p.parse("テモテヘの第一の手紙 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテヘの第一の手紙 1:1'")
		expect(p.parse("テモテへの前の書 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテへの前の書 1:1'")
		expect(p.parse("テモテへの手紙Ⅰ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテへの手紙Ⅰ 1:1'")
		expect(p.parse("テモテへの手紙一 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテへの手紙一 1:1'")
		expect(p.parse("Ⅰ テモテへ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Ⅰ テモテへ 1:1'")
		expect(p.parse("テモテ 1 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテ 1 1:1'")
		expect(p.parse("テモテ前書 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテ前書 1:1'")
		expect(p.parse("テモテ第一 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテ第一 1:1'")
		expect(p.parse("1Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1Tim 1:1'")
		expect(p.parse("一テモテ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '一テモテ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("テモテヘの第一の手紙 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテヘの第一の手紙 1:1'")
		expect(p.parse("テモテへの前の書 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテへの前の書 1:1'")
		expect(p.parse("テモテへの手紙Ⅰ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテへの手紙Ⅰ 1:1'")
		expect(p.parse("テモテへの手紙一 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテへの手紙一 1:1'")
		expect(p.parse("Ⅰ テモテへ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Ⅰ テモテへ 1:1'")
		expect(p.parse("テモテ 1 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテ 1 1:1'")
		expect(p.parse("テモテ前書 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテ前書 1:1'")
		expect(p.parse("テモテ第一 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'テモテ第一 1:1'")
		expect(p.parse("1TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1TIM 1:1'")
		expect(p.parse("一テモテ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '一テモテ 1:1'")
		`
		true
describe "Localized book Titus (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Titus (ja)", ->
		`
		expect(p.parse("ティトに達する書 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ティトに達する書 1:1'")
		expect(p.parse("テトスへのてかみ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへのてかみ 1:1'")
		expect(p.parse("テトスへのてがみ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへのてがみ 1:1'")
		expect(p.parse("テトスへの手紙 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへの手紙 1:1'")
		expect(p.parse("テトスヘの手紙 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスヘの手紙 1:1'")
		expect(p.parse("テトスへの書 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへの書 1:1'")
		expect(p.parse("Titus 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titus 1:1'")
		expect(p.parse("テトスへ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへ 1:1'")
		expect(p.parse("テトス書 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトス書 1:1'")
		expect(p.parse("テトス 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトス 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ティトに達する書 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ティトに達する書 1:1'")
		expect(p.parse("テトスへのてかみ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへのてかみ 1:1'")
		expect(p.parse("テトスへのてがみ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへのてがみ 1:1'")
		expect(p.parse("テトスへの手紙 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへの手紙 1:1'")
		expect(p.parse("テトスヘの手紙 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスヘの手紙 1:1'")
		expect(p.parse("テトスへの書 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへの書 1:1'")
		expect(p.parse("TITUS 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUS 1:1'")
		expect(p.parse("テトスへ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトスへ 1:1'")
		expect(p.parse("テトス書 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトス書 1:1'")
		expect(p.parse("テトス 1:1").osis()).toEqual("Titus.1.1", "parsing: 'テトス 1:1'")
		`
		true
describe "Localized book Phlm (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Phlm (ja)", ->
		`
		expect(p.parse("フィレモンへの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'フィレモンへの手紙 1:1'")
		expect(p.parse("ヒレモンへの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンへの手紙 1:1'")
		expect(p.parse("ヒレモンヘの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンヘの手紙 1:1'")
		expect(p.parse("ピレモンへの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンへの手紙 1:1'")
		expect(p.parse("ピレモンヘの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンヘの手紙 1:1'")
		expect(p.parse("ヒレモンへの書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンへの書 1:1'")
		expect(p.parse("ピレモンへの書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンへの書 1:1'")
		expect(p.parse("フィレモン書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'フィレモン書 1:1'")
		expect(p.parse("ヒレモンへ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンへ 1:1'")
		expect(p.parse("ヒレモン書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモン書 1:1'")
		expect(p.parse("ピレモンへ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンへ 1:1'")
		expect(p.parse("ピレモン書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモン書 1:1'")
		expect(p.parse("フィレモン 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'フィレモン 1:1'")
		expect(p.parse("Phlm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Phlm 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("フィレモンへの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'フィレモンへの手紙 1:1'")
		expect(p.parse("ヒレモンへの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンへの手紙 1:1'")
		expect(p.parse("ヒレモンヘの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンヘの手紙 1:1'")
		expect(p.parse("ピレモンへの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンへの手紙 1:1'")
		expect(p.parse("ピレモンヘの手紙 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンヘの手紙 1:1'")
		expect(p.parse("ヒレモンへの書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンへの書 1:1'")
		expect(p.parse("ピレモンへの書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンへの書 1:1'")
		expect(p.parse("フィレモン書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'フィレモン書 1:1'")
		expect(p.parse("ヒレモンへ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモンへ 1:1'")
		expect(p.parse("ヒレモン書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ヒレモン書 1:1'")
		expect(p.parse("ピレモンへ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモンへ 1:1'")
		expect(p.parse("ピレモン書 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ピレモン書 1:1'")
		expect(p.parse("フィレモン 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'フィレモン 1:1'")
		expect(p.parse("PHLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHLM 1:1'")
		`
		true
describe "Localized book Heb (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Heb (ja)", ->
		`
		expect(p.parse("ヘフライ人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフライ人への手紙 1:1'")
		expect(p.parse("ヘブライ人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブライ人への手紙 1:1'")
		expect(p.parse("へフル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へフル人への手紙 1:1'")
		expect(p.parse("へブル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へブル人への手紙 1:1'")
		expect(p.parse("ヘフル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル人への手紙 1:1'")
		expect(p.parse("ヘブル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル人への手紙 1:1'")
		expect(p.parse("ヘフル人への書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル人への書 1:1'")
		expect(p.parse("ヘブル人への書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル人への書 1:1'")
		expect(p.parse("ヘフライ書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフライ書 1:1'")
		expect(p.parse("ヘフル人へ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル人へ 1:1'")
		expect(p.parse("ヘブライ書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブライ書 1:1'")
		expect(p.parse("ヘブル人へ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル人へ 1:1'")
		expect(p.parse("ヘフライ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフライ 1:1'")
		expect(p.parse("ヘフル書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル書 1:1'")
		expect(p.parse("ヘブライ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブライ 1:1'")
		expect(p.parse("ヘブル書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル書 1:1'")
		expect(p.parse("Heb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heb 1:1'")
		expect(p.parse("へフル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へフル 1:1'")
		expect(p.parse("へブル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へブル 1:1'")
		expect(p.parse("ヘフル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル 1:1'")
		expect(p.parse("ヘブル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヘフライ人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフライ人への手紙 1:1'")
		expect(p.parse("ヘブライ人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブライ人への手紙 1:1'")
		expect(p.parse("へフル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へフル人への手紙 1:1'")
		expect(p.parse("へブル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へブル人への手紙 1:1'")
		expect(p.parse("ヘフル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル人への手紙 1:1'")
		expect(p.parse("ヘブル人への手紙 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル人への手紙 1:1'")
		expect(p.parse("ヘフル人への書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル人への書 1:1'")
		expect(p.parse("ヘブル人への書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル人への書 1:1'")
		expect(p.parse("ヘフライ書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフライ書 1:1'")
		expect(p.parse("ヘフル人へ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル人へ 1:1'")
		expect(p.parse("ヘブライ書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブライ書 1:1'")
		expect(p.parse("ヘブル人へ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル人へ 1:1'")
		expect(p.parse("ヘフライ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフライ 1:1'")
		expect(p.parse("ヘフル書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル書 1:1'")
		expect(p.parse("ヘブライ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブライ 1:1'")
		expect(p.parse("ヘブル書 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル書 1:1'")
		expect(p.parse("HEB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEB 1:1'")
		expect(p.parse("へフル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へフル 1:1'")
		expect(p.parse("へブル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'へブル 1:1'")
		expect(p.parse("ヘフル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘフル 1:1'")
		expect(p.parse("ヘブル 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ヘブル 1:1'")
		`
		true
describe "Localized book Jas (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jas (ja)", ->
		`
		expect(p.parse("ヤコフからの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフからの手紙 1:1'")
		expect(p.parse("ヤコブからの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブからの手紙 1:1'")
		expect(p.parse("ヤコフの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフの手紙 1:1'")
		expect(p.parse("ヤコブの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブの手紙 1:1'")
		expect(p.parse("ヤコフの書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフの書 1:1'")
		expect(p.parse("ヤコブの書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブの書 1:1'")
		expect(p.parse("ヤコフ書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフ書 1:1'")
		expect(p.parse("ヤコブ書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブ書 1:1'")
		expect(p.parse("Jas 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jas 1:1'")
		expect(p.parse("ヤコフ 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフ 1:1'")
		expect(p.parse("ヤコブ 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヤコフからの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフからの手紙 1:1'")
		expect(p.parse("ヤコブからの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブからの手紙 1:1'")
		expect(p.parse("ヤコフの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフの手紙 1:1'")
		expect(p.parse("ヤコブの手紙 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブの手紙 1:1'")
		expect(p.parse("ヤコフの書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフの書 1:1'")
		expect(p.parse("ヤコブの書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブの書 1:1'")
		expect(p.parse("ヤコフ書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフ書 1:1'")
		expect(p.parse("ヤコブ書 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブ書 1:1'")
		expect(p.parse("JAS 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAS 1:1'")
		expect(p.parse("ヤコフ 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコフ 1:1'")
		expect(p.parse("ヤコブ 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ヤコブ 1:1'")
		`
		true
describe "Localized book 2Pet (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Pet (ja)", ->
		`
		expect(p.parse("ヘテロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロの第二の手紙 1:1'")
		expect(p.parse("ヘトロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘトロの第二の手紙 1:1'")
		expect(p.parse("ペテロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロの第二の手紙 1:1'")
		expect(p.parse("ペトロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペトロの第二の手紙 1:1'")
		expect(p.parse("ヘテロの後の書 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロの後の書 1:1'")
		expect(p.parse("ヘテロの手紙Ⅱ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロの手紙Ⅱ 1:1'")
		expect(p.parse("ヘトロの手紙二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘトロの手紙二 1:1'")
		expect(p.parse("ペテロの後の書 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロの後の書 1:1'")
		expect(p.parse("ペテロの手紙Ⅱ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロの手紙Ⅱ 1:1'")
		expect(p.parse("ペトロの手紙二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペトロの手紙二 1:1'")
		expect(p.parse("Ⅱ ヘテロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Ⅱ ヘテロ 1:1'")
		expect(p.parse("Ⅱ ペテロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Ⅱ ペテロ 1:1'")
		expect(p.parse("ヘテロ第二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロ第二 1:1'")
		expect(p.parse("ヘトロ 2 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘトロ 2 1:1'")
		expect(p.parse("ペテロ第二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロ第二 1:1'")
		expect(p.parse("ペトロ 2 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペトロ 2 1:1'")
		expect(p.parse("2Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pet 1:1'")
		expect(p.parse("二ヘトロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: '二ヘトロ 1:1'")
		expect(p.parse("二ペトロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: '二ペトロ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヘテロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロの第二の手紙 1:1'")
		expect(p.parse("ヘトロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘトロの第二の手紙 1:1'")
		expect(p.parse("ペテロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロの第二の手紙 1:1'")
		expect(p.parse("ペトロの第二の手紙 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペトロの第二の手紙 1:1'")
		expect(p.parse("ヘテロの後の書 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロの後の書 1:1'")
		expect(p.parse("ヘテロの手紙Ⅱ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロの手紙Ⅱ 1:1'")
		expect(p.parse("ヘトロの手紙二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘトロの手紙二 1:1'")
		expect(p.parse("ペテロの後の書 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロの後の書 1:1'")
		expect(p.parse("ペテロの手紙Ⅱ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロの手紙Ⅱ 1:1'")
		expect(p.parse("ペトロの手紙二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペトロの手紙二 1:1'")
		expect(p.parse("Ⅱ ヘテロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Ⅱ ヘテロ 1:1'")
		expect(p.parse("Ⅱ ペテロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Ⅱ ペテロ 1:1'")
		expect(p.parse("ヘテロ第二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘテロ第二 1:1'")
		expect(p.parse("ヘトロ 2 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ヘトロ 2 1:1'")
		expect(p.parse("ペテロ第二 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペテロ第二 1:1'")
		expect(p.parse("ペトロ 2 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ペトロ 2 1:1'")
		expect(p.parse("2PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PET 1:1'")
		expect(p.parse("二ヘトロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: '二ヘトロ 1:1'")
		expect(p.parse("二ペトロ 1:1").osis()).toEqual("2Pet.1.1", "parsing: '二ペトロ 1:1'")
		`
		true
describe "Localized book 1Pet (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Pet (ja)", ->
		`
		expect(p.parse("ヘテロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロの第一の手紙 1:1'")
		expect(p.parse("ヘトロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘトロの第一の手紙 1:1'")
		expect(p.parse("ペテロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロの第一の手紙 1:1'")
		expect(p.parse("ペトロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペトロの第一の手紙 1:1'")
		expect(p.parse("ヘテロの前の書 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロの前の書 1:1'")
		expect(p.parse("ヘテロの手紙Ⅰ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロの手紙Ⅰ 1:1'")
		expect(p.parse("ヘトロの手紙一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘトロの手紙一 1:1'")
		expect(p.parse("ペテロの前の書 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロの前の書 1:1'")
		expect(p.parse("ペテロの手紙Ⅰ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロの手紙Ⅰ 1:1'")
		expect(p.parse("ペトロの手紙一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペトロの手紙一 1:1'")
		expect(p.parse("Ⅰ ヘテロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Ⅰ ヘテロ 1:1'")
		expect(p.parse("Ⅰ ペテロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Ⅰ ペテロ 1:1'")
		expect(p.parse("ヘテロ第一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロ第一 1:1'")
		expect(p.parse("ヘトロ 1 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘトロ 1 1:1'")
		expect(p.parse("ペテロ第一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロ第一 1:1'")
		expect(p.parse("ペトロ 1 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペトロ 1 1:1'")
		expect(p.parse("1Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pet 1:1'")
		expect(p.parse("一ヘトロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: '一ヘトロ 1:1'")
		expect(p.parse("一ペトロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: '一ペトロ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ヘテロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロの第一の手紙 1:1'")
		expect(p.parse("ヘトロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘトロの第一の手紙 1:1'")
		expect(p.parse("ペテロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロの第一の手紙 1:1'")
		expect(p.parse("ペトロの第一の手紙 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペトロの第一の手紙 1:1'")
		expect(p.parse("ヘテロの前の書 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロの前の書 1:1'")
		expect(p.parse("ヘテロの手紙Ⅰ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロの手紙Ⅰ 1:1'")
		expect(p.parse("ヘトロの手紙一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘトロの手紙一 1:1'")
		expect(p.parse("ペテロの前の書 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロの前の書 1:1'")
		expect(p.parse("ペテロの手紙Ⅰ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロの手紙Ⅰ 1:1'")
		expect(p.parse("ペトロの手紙一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペトロの手紙一 1:1'")
		expect(p.parse("Ⅰ ヘテロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Ⅰ ヘテロ 1:1'")
		expect(p.parse("Ⅰ ペテロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Ⅰ ペテロ 1:1'")
		expect(p.parse("ヘテロ第一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘテロ第一 1:1'")
		expect(p.parse("ヘトロ 1 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ヘトロ 1 1:1'")
		expect(p.parse("ペテロ第一 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペテロ第一 1:1'")
		expect(p.parse("ペトロ 1 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ペトロ 1 1:1'")
		expect(p.parse("1PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PET 1:1'")
		expect(p.parse("一ヘトロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: '一ヘトロ 1:1'")
		expect(p.parse("一ペトロ 1:1").osis()).toEqual("1Pet.1.1", "parsing: '一ペトロ 1:1'")
		`
		true
describe "Localized book Jude (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jude (ja)", ->
		`
		expect(p.parse("ユタからの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタからの手紙 1:1'")
		expect(p.parse("ユダからの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダからの手紙 1:1'")
		expect(p.parse("ユタの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタの手紙 1:1'")
		expect(p.parse("ユダの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダの手紙 1:1'")
		expect(p.parse("Jude 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jude 1:1'")
		expect(p.parse("ユタの書 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタの書 1:1'")
		expect(p.parse("ユダの書 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダの書 1:1'")
		expect(p.parse("ユタ 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタ 1:1'")
		expect(p.parse("ユダ 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ユタからの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタからの手紙 1:1'")
		expect(p.parse("ユダからの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダからの手紙 1:1'")
		expect(p.parse("ユタの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタの手紙 1:1'")
		expect(p.parse("ユダの手紙 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダの手紙 1:1'")
		expect(p.parse("JUDE 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDE 1:1'")
		expect(p.parse("ユタの書 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタの書 1:1'")
		expect(p.parse("ユダの書 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダの書 1:1'")
		expect(p.parse("ユタ 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユタ 1:1'")
		expect(p.parse("ユダ 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ユダ 1:1'")
		`
		true
describe "Localized book Tob (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Tob (ja)", ->
		`
		expect(p.parse("トヒト書 1:1").osis()).toEqual("Tob.1.1", "parsing: 'トヒト書 1:1'")
		expect(p.parse("トヒト記 1:1").osis()).toEqual("Tob.1.1", "parsing: 'トヒト記 1:1'")
		expect(p.parse("トビト書 1:1").osis()).toEqual("Tob.1.1", "parsing: 'トビト書 1:1'")
		expect(p.parse("トビト記 1:1").osis()).toEqual("Tob.1.1", "parsing: 'トビト記 1:1'")
		expect(p.parse("Tob 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tob 1:1'")
		expect(p.parse("トヒト 1:1").osis()).toEqual("Tob.1.1", "parsing: 'トヒト 1:1'")
		expect(p.parse("トビト 1:1").osis()).toEqual("Tob.1.1", "parsing: 'トビト 1:1'")
		`
		true
describe "Localized book Jdt (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jdt (ja)", ->
		`
		expect(p.parse("ユティト記 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'ユティト記 1:1'")
		expect(p.parse("ユディト記 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'ユディト記 1:1'")
		expect(p.parse("ユティト 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'ユティト 1:1'")
		expect(p.parse("ユテト書 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'ユテト書 1:1'")
		expect(p.parse("ユディト 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'ユディト 1:1'")
		expect(p.parse("ユデト書 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'ユデト書 1:1'")
		expect(p.parse("Jdt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Jdt 1:1'")
		`
		true
describe "Localized book Bar (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Bar (ja)", ->
		`
		expect(p.parse("ワルフの預言書 1:1").osis()).toEqual("Bar.1.1", "parsing: 'ワルフの預言書 1:1'")
		expect(p.parse("ハルク書 1:1").osis()).toEqual("Bar.1.1", "parsing: 'ハルク書 1:1'")
		expect(p.parse("バルク書 1:1").osis()).toEqual("Bar.1.1", "parsing: 'バルク書 1:1'")
		expect(p.parse("Bar 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bar 1:1'")
		expect(p.parse("ハルク 1:1").osis()).toEqual("Bar.1.1", "parsing: 'ハルク 1:1'")
		expect(p.parse("バルク 1:1").osis()).toEqual("Bar.1.1", "parsing: 'バルク 1:1'")
		`
		true
describe "Localized book Sus (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Sus (ja)", ->
		`
		expect(p.parse("スサンナ物語 1:1").osis()).toEqual("Sus.1.1", "parsing: 'スサンナ物語 1:1'")
		expect(p.parse("スザンナ物語 1:1").osis()).toEqual("Sus.1.1", "parsing: 'スザンナ物語 1:1'")
		expect(p.parse("スサンナ 1:1").osis()).toEqual("Sus.1.1", "parsing: 'スサンナ 1:1'")
		expect(p.parse("スザンナ 1:1").osis()).toEqual("Sus.1.1", "parsing: 'スザンナ 1:1'")
		expect(p.parse("Sus 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Sus 1:1'")
		`
		true
describe "Localized book 2Macc (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Macc (ja)", ->
		`
		expect(p.parse("マカヒー第二書 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカヒー第二書 1:1'")
		expect(p.parse("マカビー第二書 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカビー第二書 1:1'")
		expect(p.parse("マカハイ 2 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカハイ 2 1:1'")
		expect(p.parse("マカハイ記2 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカハイ記2 1:1'")
		expect(p.parse("マカハイ記下 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカハイ記下 1:1'")
		expect(p.parse("マカバイ 2 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカバイ 2 1:1'")
		expect(p.parse("マカバイ記2 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカバイ記2 1:1'")
		expect(p.parse("マカバイ記下 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカバイ記下 1:1'")
		expect(p.parse("2Macc 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2Macc 1:1'")
		expect(p.parse("マカハイ下 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカハイ下 1:1'")
		expect(p.parse("マカバイ下 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'マカバイ下 1:1'")
		`
		true
describe "Localized book 3Macc (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 3Macc (ja)", ->
		`
		expect(p.parse("マカヒー第三書 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'マカヒー第三書 1:1'")
		expect(p.parse("マカビー第三書 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'マカビー第三書 1:1'")
		expect(p.parse("マカハイ 3 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'マカハイ 3 1:1'")
		expect(p.parse("マカハイ記3 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'マカハイ記3 1:1'")
		expect(p.parse("マカバイ 3 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'マカバイ 3 1:1'")
		expect(p.parse("マカバイ記3 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'マカバイ記3 1:1'")
		expect(p.parse("3Macc 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3Macc 1:1'")
		`
		true
describe "Localized book 4Macc (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 4Macc (ja)", ->
		`
		expect(p.parse("マカヒー第四書 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'マカヒー第四書 1:1'")
		expect(p.parse("マカビー第四書 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'マカビー第四書 1:1'")
		expect(p.parse("マカハイ 4 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'マカハイ 4 1:1'")
		expect(p.parse("マカハイ記4 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'マカハイ記4 1:1'")
		expect(p.parse("マカバイ 4 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'マカバイ 4 1:1'")
		expect(p.parse("マカバイ記4 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'マカバイ記4 1:1'")
		expect(p.parse("4Macc 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4Macc 1:1'")
		`
		true
describe "Localized book 1Macc (ja)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Macc (ja)", ->
		`
		expect(p.parse("マカヒー第一書 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカヒー第一書 1:1'")
		expect(p.parse("マカビー第一書 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカビー第一書 1:1'")
		expect(p.parse("マカハイ 1 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカハイ 1 1:1'")
		expect(p.parse("マカハイ記1 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカハイ記1 1:1'")
		expect(p.parse("マカハイ記上 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカハイ記上 1:1'")
		expect(p.parse("マカバイ 1 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカバイ 1 1:1'")
		expect(p.parse("マカバイ記1 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカバイ記1 1:1'")
		expect(p.parse("マカバイ記上 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカバイ記上 1:1'")
		expect(p.parse("1Macc 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1Macc 1:1'")
		expect(p.parse("マカハイ上 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカハイ上 1:1'")
		expect(p.parse("マカバイ上 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'マカバイ上 1:1'")
		`
		true

describe "Miscellaneous tests", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore", book_sequence_strategy: "ignore", osis_compaction_strategy: "bc", captive_end_digits_strategy: "delete"
		p.include_apocrypha true

	it "should return the expected language", ->
		expect(p.languages).toEqual ["ja"]

	it "should handle ranges (ja)", ->
		expect(p.parse("Titus 1:1 ～ 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 ～ 2'")
		expect(p.parse("Matt 1～2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1～2'")
		expect(p.parse("Phlm 2 ～ 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 ～ 3'")
		expect(p.parse("Titus 1:1 ~ 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 ~ 2'")
		expect(p.parse("Matt 1~2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1~2'")
		expect(p.parse("Phlm 2 ~ 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 ~ 3'")
	it "should handle chapters (ja)", ->
		expect(p.parse("Titus 1:1, 章 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, 章 2'")
		expect(p.parse("Matt 3:4 章 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 章 6'")
	it "should handle verses (ja)", ->
		expect(p.parse("Exod 1:1 節 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 節 3'")
		expect(p.parse("Phlm 節 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm 節 6'")
	it "should handle 'and' (ja)", ->
		expect(p.parse("Exod 1:1 and 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 and 3'")
		expect(p.parse("Phlm 2 AND 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 AND 6'")
	it "should handle titles (ja)", ->
		expect(p.parse("Ps 3 title, 4:2, 5:title").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 title, 4:2, 5:title'")
		expect(p.parse("PS 3 TITLE, 4:2, 5:TITLE").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 TITLE, 4:2, 5:TITLE'")
	it "should handle 'ff' (ja)", ->
		expect(p.parse("Rev 3ff, 4:2ff").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3ff, 4:2ff'")
		expect(p.parse("REV 3 FF, 4:2 FF").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'REV 3 FF, 4:2 FF'")
	it "should handle translations (ja)", ->
		expect(p.parse("Lev 1 (JLB)").osis_and_translations()).toEqual [["Lev.1", "JLB"]]
		expect(p.parse("lev 1 jlb").osis_and_translations()).toEqual [["Lev.1", "JLB"]]
	it "should handle boundaries (ja)", ->
		p.set_options {book_alone_strategy: "full"}
		expect(p.parse("\u2014Matt\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\u2014Matt\u2014'")
		expect(p.parse("\u201cMatt 1:1\u201d").osis()).toEqual("Matt.1.1", "parsing: '\u201cMatt 1:1\u201d'")
