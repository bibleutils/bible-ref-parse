bcv_parser = require("../../js/hu_bcv_parser.js").bcv_parser

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

describe "Localized book Gen (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Gen (hu)", ->
		`
		expect(p.parse("Elso Mozes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Elso Mozes 1:1'")
		expect(p.parse("Elso Mózes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Elso Mózes 1:1'")
		expect(p.parse("Első Mozes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Első Mozes 1:1'")
		expect(p.parse("Első Mózes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Első Mózes 1:1'")
		expect(p.parse("1. Mozes 1:1").osis()).toEqual("Gen.1.1", "parsing: '1. Mozes 1:1'")
		expect(p.parse("1. Mózes 1:1").osis()).toEqual("Gen.1.1", "parsing: '1. Mózes 1:1'")
		expect(p.parse("I. Mozes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I. Mozes 1:1'")
		expect(p.parse("I. Mózes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I. Mózes 1:1'")
		expect(p.parse("Teremtes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Teremtes 1:1'")
		expect(p.parse("Teremtés 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Teremtés 1:1'")
		expect(p.parse("1 Mozes 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 Mozes 1:1'")
		expect(p.parse("1 Mózes 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 Mózes 1:1'")
		expect(p.parse("I Mozes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I Mozes 1:1'")
		expect(p.parse("I Mózes 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I Mózes 1:1'")
		expect(p.parse("Mozes I 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Mozes I 1:1'")
		expect(p.parse("Mózes I 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Mózes I 1:1'")
		expect(p.parse("1 Moz 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 Moz 1:1'")
		expect(p.parse("1 Móz 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 Móz 1:1'")
		expect(p.parse("1 Mz 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 Mz 1:1'")
		expect(p.parse("Gen 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Gen 1:1'")
		expect(p.parse("Ter 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Ter 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO MOZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ELSO MOZES 1:1'")
		expect(p.parse("ELSO MÓZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ELSO MÓZES 1:1'")
		expect(p.parse("ELSŐ MOZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ELSŐ MOZES 1:1'")
		expect(p.parse("ELSŐ MÓZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ELSŐ MÓZES 1:1'")
		expect(p.parse("1. MOZES 1:1").osis()).toEqual("Gen.1.1", "parsing: '1. MOZES 1:1'")
		expect(p.parse("1. MÓZES 1:1").osis()).toEqual("Gen.1.1", "parsing: '1. MÓZES 1:1'")
		expect(p.parse("I. MOZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I. MOZES 1:1'")
		expect(p.parse("I. MÓZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I. MÓZES 1:1'")
		expect(p.parse("TEREMTES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'TEREMTES 1:1'")
		expect(p.parse("TEREMTÉS 1:1").osis()).toEqual("Gen.1.1", "parsing: 'TEREMTÉS 1:1'")
		expect(p.parse("1 MOZES 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 MOZES 1:1'")
		expect(p.parse("1 MÓZES 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 MÓZES 1:1'")
		expect(p.parse("I MOZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I MOZES 1:1'")
		expect(p.parse("I MÓZES 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I MÓZES 1:1'")
		expect(p.parse("MOZES I 1:1").osis()).toEqual("Gen.1.1", "parsing: 'MOZES I 1:1'")
		expect(p.parse("MÓZES I 1:1").osis()).toEqual("Gen.1.1", "parsing: 'MÓZES I 1:1'")
		expect(p.parse("1 MOZ 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 MOZ 1:1'")
		expect(p.parse("1 MÓZ 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 MÓZ 1:1'")
		expect(p.parse("1 MZ 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 MZ 1:1'")
		expect(p.parse("GEN 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GEN 1:1'")
		expect(p.parse("TER 1:1").osis()).toEqual("Gen.1.1", "parsing: 'TER 1:1'")
		`
		true
describe "Localized book Exod (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Exod (hu)", ->
		`
		expect(p.parse("Masodik Mozes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Masodik Mozes 1:1'")
		expect(p.parse("Masodik Mózes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Masodik Mózes 1:1'")
		expect(p.parse("Második Mozes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Második Mozes 1:1'")
		expect(p.parse("Második Mózes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Második Mózes 1:1'")
		expect(p.parse("II. Mozes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II. Mozes 1:1'")
		expect(p.parse("II. Mózes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II. Mózes 1:1'")
		expect(p.parse("Kivonulas 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Kivonulas 1:1'")
		expect(p.parse("Kivonulás 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Kivonulás 1:1'")
		expect(p.parse("2. Mozes 1:1").osis()).toEqual("Exod.1.1", "parsing: '2. Mozes 1:1'")
		expect(p.parse("2. Mózes 1:1").osis()).toEqual("Exod.1.1", "parsing: '2. Mózes 1:1'")
		expect(p.parse("II Mozes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II Mozes 1:1'")
		expect(p.parse("II Mózes 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II Mózes 1:1'")
		expect(p.parse("Mozes II 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Mozes II 1:1'")
		expect(p.parse("Mózes II 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Mózes II 1:1'")
		expect(p.parse("2 Mozes 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 Mozes 1:1'")
		expect(p.parse("2 Mózes 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 Mózes 1:1'")
		expect(p.parse("2 Moz 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 Moz 1:1'")
		expect(p.parse("2 Móz 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 Móz 1:1'")
		expect(p.parse("2 Mz 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 Mz 1:1'")
		expect(p.parse("Exod 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exod 1:1'")
		expect(p.parse("Kiv 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Kiv 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK MOZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'MASODIK MOZES 1:1'")
		expect(p.parse("MASODIK MÓZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'MASODIK MÓZES 1:1'")
		expect(p.parse("MÁSODIK MOZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'MÁSODIK MOZES 1:1'")
		expect(p.parse("MÁSODIK MÓZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'MÁSODIK MÓZES 1:1'")
		expect(p.parse("II. MOZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II. MOZES 1:1'")
		expect(p.parse("II. MÓZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II. MÓZES 1:1'")
		expect(p.parse("KIVONULAS 1:1").osis()).toEqual("Exod.1.1", "parsing: 'KIVONULAS 1:1'")
		expect(p.parse("KIVONULÁS 1:1").osis()).toEqual("Exod.1.1", "parsing: 'KIVONULÁS 1:1'")
		expect(p.parse("2. MOZES 1:1").osis()).toEqual("Exod.1.1", "parsing: '2. MOZES 1:1'")
		expect(p.parse("2. MÓZES 1:1").osis()).toEqual("Exod.1.1", "parsing: '2. MÓZES 1:1'")
		expect(p.parse("II MOZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II MOZES 1:1'")
		expect(p.parse("II MÓZES 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II MÓZES 1:1'")
		expect(p.parse("MOZES II 1:1").osis()).toEqual("Exod.1.1", "parsing: 'MOZES II 1:1'")
		expect(p.parse("MÓZES II 1:1").osis()).toEqual("Exod.1.1", "parsing: 'MÓZES II 1:1'")
		expect(p.parse("2 MOZES 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 MOZES 1:1'")
		expect(p.parse("2 MÓZES 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 MÓZES 1:1'")
		expect(p.parse("2 MOZ 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 MOZ 1:1'")
		expect(p.parse("2 MÓZ 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 MÓZ 1:1'")
		expect(p.parse("2 MZ 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 MZ 1:1'")
		expect(p.parse("EXOD 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXOD 1:1'")
		expect(p.parse("KIV 1:1").osis()).toEqual("Exod.1.1", "parsing: 'KIV 1:1'")
		`
		true
describe "Localized book Bel (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Bel (hu)", ->
		`
		expect(p.parse("Baal es a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal es a sarkany 1:1'")
		expect(p.parse("Baal es a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal es a sarkány 1:1'")
		expect(p.parse("Baal es a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal es a sárkany 1:1'")
		expect(p.parse("Baal es a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal es a sárkány 1:1'")
		expect(p.parse("Baal és a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal és a sarkany 1:1'")
		expect(p.parse("Baal és a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal és a sarkány 1:1'")
		expect(p.parse("Baal és a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal és a sárkany 1:1'")
		expect(p.parse("Baal és a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baal és a sárkány 1:1'")
		expect(p.parse("Baál es a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál es a sarkany 1:1'")
		expect(p.parse("Baál es a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál es a sarkány 1:1'")
		expect(p.parse("Baál es a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál es a sárkany 1:1'")
		expect(p.parse("Baál es a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál es a sárkány 1:1'")
		expect(p.parse("Baál és a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál és a sarkany 1:1'")
		expect(p.parse("Baál és a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál és a sarkány 1:1'")
		expect(p.parse("Baál és a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál és a sárkany 1:1'")
		expect(p.parse("Baál és a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Baál és a sárkány 1:1'")
		expect(p.parse("Bel es a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel es a sarkany 1:1'")
		expect(p.parse("Bel es a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel es a sarkány 1:1'")
		expect(p.parse("Bel es a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel es a sárkany 1:1'")
		expect(p.parse("Bel es a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel es a sárkány 1:1'")
		expect(p.parse("Bel és a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel és a sarkany 1:1'")
		expect(p.parse("Bel és a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel és a sarkány 1:1'")
		expect(p.parse("Bel és a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel és a sárkany 1:1'")
		expect(p.parse("Bel és a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel és a sárkány 1:1'")
		expect(p.parse("Bél es a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél es a sarkany 1:1'")
		expect(p.parse("Bél es a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél es a sarkány 1:1'")
		expect(p.parse("Bél es a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél es a sárkany 1:1'")
		expect(p.parse("Bél es a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél es a sárkány 1:1'")
		expect(p.parse("Bél és a sarkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél és a sarkany 1:1'")
		expect(p.parse("Bél és a sarkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél és a sarkány 1:1'")
		expect(p.parse("Bél és a sárkany 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél és a sárkany 1:1'")
		expect(p.parse("Bél és a sárkány 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél és a sárkány 1:1'")
		expect(p.parse("Bel 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel 1:1'")
		expect(p.parse("Bél 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bél 1:1'")
		`
		true
describe "Localized book Lev (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Lev (hu)", ->
		`
		expect(p.parse("Harmadik Mozes 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Harmadik Mozes 1:1'")
		expect(p.parse("Harmadik Mózes 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Harmadik Mózes 1:1'")
		expect(p.parse("III. Mozes 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III. Mozes 1:1'")
		expect(p.parse("III. Mózes 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III. Mózes 1:1'")
		expect(p.parse("III Mozes 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III Mozes 1:1'")
		expect(p.parse("III Mózes 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III Mózes 1:1'")
		expect(p.parse("Mozes III 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Mozes III 1:1'")
		expect(p.parse("Mózes III 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Mózes III 1:1'")
		expect(p.parse("3. Mozes 1:1").osis()).toEqual("Lev.1.1", "parsing: '3. Mozes 1:1'")
		expect(p.parse("3. Mózes 1:1").osis()).toEqual("Lev.1.1", "parsing: '3. Mózes 1:1'")
		expect(p.parse("3 Mozes 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 Mozes 1:1'")
		expect(p.parse("3 Mózes 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 Mózes 1:1'")
		expect(p.parse("Levitak 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Levitak 1:1'")
		expect(p.parse("Leviták 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Leviták 1:1'")
		expect(p.parse("3 Moz 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 Moz 1:1'")
		expect(p.parse("3 Móz 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 Móz 1:1'")
		expect(p.parse("3 Mz 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 Mz 1:1'")
		expect(p.parse("Lev 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lev 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HARMADIK MOZES 1:1").osis()).toEqual("Lev.1.1", "parsing: 'HARMADIK MOZES 1:1'")
		expect(p.parse("HARMADIK MÓZES 1:1").osis()).toEqual("Lev.1.1", "parsing: 'HARMADIK MÓZES 1:1'")
		expect(p.parse("III. MOZES 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III. MOZES 1:1'")
		expect(p.parse("III. MÓZES 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III. MÓZES 1:1'")
		expect(p.parse("III MOZES 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III MOZES 1:1'")
		expect(p.parse("III MÓZES 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III MÓZES 1:1'")
		expect(p.parse("MOZES III 1:1").osis()).toEqual("Lev.1.1", "parsing: 'MOZES III 1:1'")
		expect(p.parse("MÓZES III 1:1").osis()).toEqual("Lev.1.1", "parsing: 'MÓZES III 1:1'")
		expect(p.parse("3. MOZES 1:1").osis()).toEqual("Lev.1.1", "parsing: '3. MOZES 1:1'")
		expect(p.parse("3. MÓZES 1:1").osis()).toEqual("Lev.1.1", "parsing: '3. MÓZES 1:1'")
		expect(p.parse("3 MOZES 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 MOZES 1:1'")
		expect(p.parse("3 MÓZES 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 MÓZES 1:1'")
		expect(p.parse("LEVITAK 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEVITAK 1:1'")
		expect(p.parse("LEVITÁK 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEVITÁK 1:1'")
		expect(p.parse("3 MOZ 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 MOZ 1:1'")
		expect(p.parse("3 MÓZ 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 MÓZ 1:1'")
		expect(p.parse("3 MZ 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 MZ 1:1'")
		expect(p.parse("LEV 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEV 1:1'")
		`
		true
describe "Localized book Num (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Num (hu)", ->
		`
		expect(p.parse("IV. Mozes 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV. Mozes 1:1'")
		expect(p.parse("IV. Mózes 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV. Mózes 1:1'")
		expect(p.parse("4. Mozes 1:1").osis()).toEqual("Num.1.1", "parsing: '4. Mozes 1:1'")
		expect(p.parse("4. Mózes 1:1").osis()).toEqual("Num.1.1", "parsing: '4. Mózes 1:1'")
		expect(p.parse("IV Mozes 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV Mozes 1:1'")
		expect(p.parse("IV Mózes 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV Mózes 1:1'")
		expect(p.parse("Mozes IV 1:1").osis()).toEqual("Num.1.1", "parsing: 'Mozes IV 1:1'")
		expect(p.parse("Mózes IV 1:1").osis()).toEqual("Num.1.1", "parsing: 'Mózes IV 1:1'")
		expect(p.parse("4 Mozes 1:1").osis()).toEqual("Num.1.1", "parsing: '4 Mozes 1:1'")
		expect(p.parse("4 Mózes 1:1").osis()).toEqual("Num.1.1", "parsing: '4 Mózes 1:1'")
		expect(p.parse("Szamok 1:1").osis()).toEqual("Num.1.1", "parsing: 'Szamok 1:1'")
		expect(p.parse("Számok 1:1").osis()).toEqual("Num.1.1", "parsing: 'Számok 1:1'")
		expect(p.parse("4 Moz 1:1").osis()).toEqual("Num.1.1", "parsing: '4 Moz 1:1'")
		expect(p.parse("4 Móz 1:1").osis()).toEqual("Num.1.1", "parsing: '4 Móz 1:1'")
		expect(p.parse("4 Mz 1:1").osis()).toEqual("Num.1.1", "parsing: '4 Mz 1:1'")
		expect(p.parse("Szam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Szam 1:1'")
		expect(p.parse("Szám 1:1").osis()).toEqual("Num.1.1", "parsing: 'Szám 1:1'")
		expect(p.parse("Num 1:1").osis()).toEqual("Num.1.1", "parsing: 'Num 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IV. MOZES 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV. MOZES 1:1'")
		expect(p.parse("IV. MÓZES 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV. MÓZES 1:1'")
		expect(p.parse("4. MOZES 1:1").osis()).toEqual("Num.1.1", "parsing: '4. MOZES 1:1'")
		expect(p.parse("4. MÓZES 1:1").osis()).toEqual("Num.1.1", "parsing: '4. MÓZES 1:1'")
		expect(p.parse("IV MOZES 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV MOZES 1:1'")
		expect(p.parse("IV MÓZES 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV MÓZES 1:1'")
		expect(p.parse("MOZES IV 1:1").osis()).toEqual("Num.1.1", "parsing: 'MOZES IV 1:1'")
		expect(p.parse("MÓZES IV 1:1").osis()).toEqual("Num.1.1", "parsing: 'MÓZES IV 1:1'")
		expect(p.parse("4 MOZES 1:1").osis()).toEqual("Num.1.1", "parsing: '4 MOZES 1:1'")
		expect(p.parse("4 MÓZES 1:1").osis()).toEqual("Num.1.1", "parsing: '4 MÓZES 1:1'")
		expect(p.parse("SZAMOK 1:1").osis()).toEqual("Num.1.1", "parsing: 'SZAMOK 1:1'")
		expect(p.parse("SZÁMOK 1:1").osis()).toEqual("Num.1.1", "parsing: 'SZÁMOK 1:1'")
		expect(p.parse("4 MOZ 1:1").osis()).toEqual("Num.1.1", "parsing: '4 MOZ 1:1'")
		expect(p.parse("4 MÓZ 1:1").osis()).toEqual("Num.1.1", "parsing: '4 MÓZ 1:1'")
		expect(p.parse("4 MZ 1:1").osis()).toEqual("Num.1.1", "parsing: '4 MZ 1:1'")
		expect(p.parse("SZAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'SZAM 1:1'")
		expect(p.parse("SZÁM 1:1").osis()).toEqual("Num.1.1", "parsing: 'SZÁM 1:1'")
		expect(p.parse("NUM 1:1").osis()).toEqual("Num.1.1", "parsing: 'NUM 1:1'")
		`
		true
describe "Localized book Wis (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Wis (hu)", ->
		`
		expect(p.parse("Salamon bolcsessege 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Salamon bolcsessege 1:1'")
		expect(p.parse("Salamon bolcsessége 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Salamon bolcsessége 1:1'")
		expect(p.parse("Salamon bölcsessege 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Salamon bölcsessege 1:1'")
		expect(p.parse("Salamon bölcsessége 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Salamon bölcsessége 1:1'")
		expect(p.parse("Bolcsesseg 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Bolcsesseg 1:1'")
		expect(p.parse("Bolcsesség 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Bolcsesség 1:1'")
		expect(p.parse("Bölcsesseg 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Bölcsesseg 1:1'")
		expect(p.parse("Bölcsesség 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Bölcsesség 1:1'")
		expect(p.parse("Bolcs 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Bolcs 1:1'")
		expect(p.parse("Bölcs 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Bölcs 1:1'")
		expect(p.parse("Wis 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Wis 1:1'")
		`
		true
describe "Localized book Lam (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Lam (hu)", ->
		`
		expect(p.parse("Jeremias siralmai 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Jeremias siralmai 1:1'")
		expect(p.parse("Jeremiás siralmai 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Jeremiás siralmai 1:1'")
		expect(p.parse("Jeremias sir 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Jeremias sir 1:1'")
		expect(p.parse("Jeremiás sir 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Jeremiás sir 1:1'")
		expect(p.parse("Siralmak 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Siralmak 1:1'")
		expect(p.parse("Siralm 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Siralm 1:1'")
		expect(p.parse("Siral 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Siral 1:1'")
		expect(p.parse("Lam 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Lam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JEREMIAS SIRALMAI 1:1").osis()).toEqual("Lam.1.1", "parsing: 'JEREMIAS SIRALMAI 1:1'")
		expect(p.parse("JEREMIÁS SIRALMAI 1:1").osis()).toEqual("Lam.1.1", "parsing: 'JEREMIÁS SIRALMAI 1:1'")
		expect(p.parse("JEREMIAS SIR 1:1").osis()).toEqual("Lam.1.1", "parsing: 'JEREMIAS SIR 1:1'")
		expect(p.parse("JEREMIÁS SIR 1:1").osis()).toEqual("Lam.1.1", "parsing: 'JEREMIÁS SIR 1:1'")
		expect(p.parse("SIRALMAK 1:1").osis()).toEqual("Lam.1.1", "parsing: 'SIRALMAK 1:1'")
		expect(p.parse("SIRALM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'SIRALM 1:1'")
		expect(p.parse("SIRAL 1:1").osis()).toEqual("Lam.1.1", "parsing: 'SIRAL 1:1'")
		expect(p.parse("LAM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'LAM 1:1'")
		`
		true
describe "Localized book Sir (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Sir (hu)", ->
		`
		expect(p.parse("Sirak bolcsessege 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirak bolcsessege 1:1'")
		expect(p.parse("Sirak bolcsessége 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirak bolcsessége 1:1'")
		expect(p.parse("Sirak bölcsessege 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirak bölcsessege 1:1'")
		expect(p.parse("Sirak bölcsessége 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirak bölcsessége 1:1'")
		expect(p.parse("Sirák bolcsessege 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirák bolcsessege 1:1'")
		expect(p.parse("Sirák bolcsessége 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirák bolcsessége 1:1'")
		expect(p.parse("Sirák bölcsessege 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirák bölcsessege 1:1'")
		expect(p.parse("Sirák bölcsessége 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirák bölcsessége 1:1'")
		expect(p.parse("Ecclesiasticus 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ecclesiasticus 1:1'")
		expect(p.parse("Sirak fia 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirak fia 1:1'")
		expect(p.parse("Sirák fia 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirák fia 1:1'")
		expect(p.parse("Sir 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sir 1:1'")
		`
		true
describe "Localized book EpJer (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: EpJer (hu)", ->
		`
		expect(p.parse("Jeremias levele 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Jeremias levele 1:1'")
		expect(p.parse("Jeremiás levele 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Jeremiás levele 1:1'")
		expect(p.parse("EpJer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'EpJer 1:1'")
		`
		true
describe "Localized book Rev (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Rev (hu)", ->
		`
		expect(p.parse("Janos jelenesei 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Janos jelenesei 1:1'")
		expect(p.parse("Janos jelenései 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Janos jelenései 1:1'")
		expect(p.parse("János jelenesei 1:1").osis()).toEqual("Rev.1.1", "parsing: 'János jelenesei 1:1'")
		expect(p.parse("János jelenései 1:1").osis()).toEqual("Rev.1.1", "parsing: 'János jelenései 1:1'")
		expect(p.parse("Apokalipszis 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apokalipszis 1:1'")
		expect(p.parse("Jelenesek 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Jelenesek 1:1'")
		expect(p.parse("Jelenések 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Jelenések 1:1'")
		expect(p.parse("Jel 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Jel 1:1'")
		expect(p.parse("Rev 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rev 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JANOS JELENESEI 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JANOS JELENESEI 1:1'")
		expect(p.parse("JANOS JELENÉSEI 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JANOS JELENÉSEI 1:1'")
		expect(p.parse("JÁNOS JELENESEI 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JÁNOS JELENESEI 1:1'")
		expect(p.parse("JÁNOS JELENÉSEI 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JÁNOS JELENÉSEI 1:1'")
		expect(p.parse("APOKALIPSZIS 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOKALIPSZIS 1:1'")
		expect(p.parse("JELENESEK 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JELENESEK 1:1'")
		expect(p.parse("JELENÉSEK 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JELENÉSEK 1:1'")
		expect(p.parse("JEL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'JEL 1:1'")
		expect(p.parse("REV 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REV 1:1'")
		`
		true
describe "Localized book PrMan (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: PrMan (hu)", ->
		`
		expect(p.parse("Manasse imadsaga 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manasse imadsaga 1:1'")
		expect(p.parse("Manasse imadsága 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manasse imadsága 1:1'")
		expect(p.parse("Manasse imádsaga 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manasse imádsaga 1:1'")
		expect(p.parse("Manasse imádsága 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manasse imádsága 1:1'")
		expect(p.parse("Manassé imadsaga 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manassé imadsaga 1:1'")
		expect(p.parse("Manassé imadsága 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manassé imadsága 1:1'")
		expect(p.parse("Manassé imádsaga 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manassé imádsaga 1:1'")
		expect(p.parse("Manassé imádsága 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manassé imádsága 1:1'")
		expect(p.parse("Manassze imaja 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manassze imaja 1:1'")
		expect(p.parse("Manassze imája 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Manassze imája 1:1'")
		expect(p.parse("PrMan 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'PrMan 1:1'")
		`
		true
describe "Localized book Deut (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Deut (hu)", ->
		`
		expect(p.parse("Masodik torvenykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik torvenykonyv 1:1'")
		expect(p.parse("Masodik torvenykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik torvenykönyv 1:1'")
		expect(p.parse("Masodik torvénykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik torvénykonyv 1:1'")
		expect(p.parse("Masodik torvénykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik torvénykönyv 1:1'")
		expect(p.parse("Masodik törvenykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik törvenykonyv 1:1'")
		expect(p.parse("Masodik törvenykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik törvenykönyv 1:1'")
		expect(p.parse("Masodik törvénykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik törvénykonyv 1:1'")
		expect(p.parse("Masodik törvénykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Masodik törvénykönyv 1:1'")
		expect(p.parse("Második torvenykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második torvenykonyv 1:1'")
		expect(p.parse("Második torvenykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második torvenykönyv 1:1'")
		expect(p.parse("Második torvénykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második torvénykonyv 1:1'")
		expect(p.parse("Második torvénykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második torvénykönyv 1:1'")
		expect(p.parse("Második törvenykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második törvenykonyv 1:1'")
		expect(p.parse("Második törvenykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második törvenykönyv 1:1'")
		expect(p.parse("Második törvénykonyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második törvénykonyv 1:1'")
		expect(p.parse("Második törvénykönyv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Második törvénykönyv 1:1'")
		expect(p.parse("Mozes otodik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes otodik konyve 1:1'")
		expect(p.parse("Mozes otodik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes otodik könyve 1:1'")
		expect(p.parse("Mozes otödik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes otödik konyve 1:1'")
		expect(p.parse("Mozes otödik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes otödik könyve 1:1'")
		expect(p.parse("Mozes ötodik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes ötodik konyve 1:1'")
		expect(p.parse("Mozes ötodik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes ötodik könyve 1:1'")
		expect(p.parse("Mozes ötödik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes ötödik konyve 1:1'")
		expect(p.parse("Mozes ötödik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes ötödik könyve 1:1'")
		expect(p.parse("Mózes otodik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes otodik konyve 1:1'")
		expect(p.parse("Mózes otodik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes otodik könyve 1:1'")
		expect(p.parse("Mózes otödik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes otödik konyve 1:1'")
		expect(p.parse("Mózes otödik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes otödik könyve 1:1'")
		expect(p.parse("Mózes ötodik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes ötodik konyve 1:1'")
		expect(p.parse("Mózes ötodik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes ötodik könyve 1:1'")
		expect(p.parse("Mózes ötödik konyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes ötödik konyve 1:1'")
		expect(p.parse("Mózes ötödik könyve 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes ötödik könyve 1:1'")
		expect(p.parse("5 Mozes 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 Mozes 1:1'")
		expect(p.parse("5 Mózes 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 Mózes 1:1'")
		expect(p.parse("Mozes V 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mozes V 1:1'")
		expect(p.parse("Mózes V 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Mózes V 1:1'")
		expect(p.parse("5 Moz 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 Moz 1:1'")
		expect(p.parse("5 Móz 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 Móz 1:1'")
		expect(p.parse("MTorv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MTorv 1:1'")
		expect(p.parse("MTörv 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MTörv 1:1'")
		expect(p.parse("5 Mz 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 Mz 1:1'")
		expect(p.parse("Deut 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deut 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK TORVENYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TORVENYKONYV 1:1'")
		expect(p.parse("MASODIK TORVENYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TORVENYKÖNYV 1:1'")
		expect(p.parse("MASODIK TORVÉNYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TORVÉNYKONYV 1:1'")
		expect(p.parse("MASODIK TORVÉNYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TORVÉNYKÖNYV 1:1'")
		expect(p.parse("MASODIK TÖRVENYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TÖRVENYKONYV 1:1'")
		expect(p.parse("MASODIK TÖRVENYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TÖRVENYKÖNYV 1:1'")
		expect(p.parse("MASODIK TÖRVÉNYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TÖRVÉNYKONYV 1:1'")
		expect(p.parse("MASODIK TÖRVÉNYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MASODIK TÖRVÉNYKÖNYV 1:1'")
		expect(p.parse("MÁSODIK TORVENYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TORVENYKONYV 1:1'")
		expect(p.parse("MÁSODIK TORVENYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TORVENYKÖNYV 1:1'")
		expect(p.parse("MÁSODIK TORVÉNYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TORVÉNYKONYV 1:1'")
		expect(p.parse("MÁSODIK TORVÉNYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TORVÉNYKÖNYV 1:1'")
		expect(p.parse("MÁSODIK TÖRVENYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TÖRVENYKONYV 1:1'")
		expect(p.parse("MÁSODIK TÖRVENYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TÖRVENYKÖNYV 1:1'")
		expect(p.parse("MÁSODIK TÖRVÉNYKONYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TÖRVÉNYKONYV 1:1'")
		expect(p.parse("MÁSODIK TÖRVÉNYKÖNYV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÁSODIK TÖRVÉNYKÖNYV 1:1'")
		expect(p.parse("MOZES OTODIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES OTODIK KONYVE 1:1'")
		expect(p.parse("MOZES OTODIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES OTODIK KÖNYVE 1:1'")
		expect(p.parse("MOZES OTÖDIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES OTÖDIK KONYVE 1:1'")
		expect(p.parse("MOZES OTÖDIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES OTÖDIK KÖNYVE 1:1'")
		expect(p.parse("MOZES ÖTODIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES ÖTODIK KONYVE 1:1'")
		expect(p.parse("MOZES ÖTODIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES ÖTODIK KÖNYVE 1:1'")
		expect(p.parse("MOZES ÖTÖDIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES ÖTÖDIK KONYVE 1:1'")
		expect(p.parse("MOZES ÖTÖDIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES ÖTÖDIK KÖNYVE 1:1'")
		expect(p.parse("MÓZES OTODIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES OTODIK KONYVE 1:1'")
		expect(p.parse("MÓZES OTODIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES OTODIK KÖNYVE 1:1'")
		expect(p.parse("MÓZES OTÖDIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES OTÖDIK KONYVE 1:1'")
		expect(p.parse("MÓZES OTÖDIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES OTÖDIK KÖNYVE 1:1'")
		expect(p.parse("MÓZES ÖTODIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES ÖTODIK KONYVE 1:1'")
		expect(p.parse("MÓZES ÖTODIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES ÖTODIK KÖNYVE 1:1'")
		expect(p.parse("MÓZES ÖTÖDIK KONYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES ÖTÖDIK KONYVE 1:1'")
		expect(p.parse("MÓZES ÖTÖDIK KÖNYVE 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES ÖTÖDIK KÖNYVE 1:1'")
		expect(p.parse("5 MOZES 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 MOZES 1:1'")
		expect(p.parse("5 MÓZES 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 MÓZES 1:1'")
		expect(p.parse("MOZES V 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MOZES V 1:1'")
		expect(p.parse("MÓZES V 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MÓZES V 1:1'")
		expect(p.parse("5 MOZ 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 MOZ 1:1'")
		expect(p.parse("5 MÓZ 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 MÓZ 1:1'")
		expect(p.parse("MTORV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MTORV 1:1'")
		expect(p.parse("MTÖRV 1:1").osis()).toEqual("Deut.1.1", "parsing: 'MTÖRV 1:1'")
		expect(p.parse("5 MZ 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 MZ 1:1'")
		expect(p.parse("DEUT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUT 1:1'")
		`
		true
describe "Localized book Josh (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Josh (hu)", ->
		`
		expect(p.parse("Jozsue 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Jozsue 1:1'")
		expect(p.parse("Jozsué 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Jozsué 1:1'")
		expect(p.parse("Józsue 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Józsue 1:1'")
		expect(p.parse("Józsué 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Józsué 1:1'")
		expect(p.parse("Josh 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josh 1:1'")
		expect(p.parse("Jozs 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Jozs 1:1'")
		expect(p.parse("Józs 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Józs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JOZSUE 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOZSUE 1:1'")
		expect(p.parse("JOZSUÉ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOZSUÉ 1:1'")
		expect(p.parse("JÓZSUE 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JÓZSUE 1:1'")
		expect(p.parse("JÓZSUÉ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JÓZSUÉ 1:1'")
		expect(p.parse("JOSH 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSH 1:1'")
		expect(p.parse("JOZS 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOZS 1:1'")
		expect(p.parse("JÓZS 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JÓZS 1:1'")
		`
		true
describe "Localized book Judg (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Judg (hu)", ->
		`
		expect(p.parse("Birak 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Birak 1:1'")
		expect(p.parse("Birák 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Birák 1:1'")
		expect(p.parse("Bírak 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Bírak 1:1'")
		expect(p.parse("Bírák 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Bírák 1:1'")
		expect(p.parse("Judg 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Judg 1:1'")
		expect(p.parse("Bir 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Bir 1:1'")
		expect(p.parse("Bír 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Bír 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("BIRAK 1:1").osis()).toEqual("Judg.1.1", "parsing: 'BIRAK 1:1'")
		expect(p.parse("BIRÁK 1:1").osis()).toEqual("Judg.1.1", "parsing: 'BIRÁK 1:1'")
		expect(p.parse("BÍRAK 1:1").osis()).toEqual("Judg.1.1", "parsing: 'BÍRAK 1:1'")
		expect(p.parse("BÍRÁK 1:1").osis()).toEqual("Judg.1.1", "parsing: 'BÍRÁK 1:1'")
		expect(p.parse("JUDG 1:1").osis()).toEqual("Judg.1.1", "parsing: 'JUDG 1:1'")
		expect(p.parse("BIR 1:1").osis()).toEqual("Judg.1.1", "parsing: 'BIR 1:1'")
		expect(p.parse("BÍR 1:1").osis()).toEqual("Judg.1.1", "parsing: 'BÍR 1:1'")
		`
		true
describe "Localized book Ruth (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ruth (hu)", ->
		`
		expect(p.parse("Ruth 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruth 1:1'")
		expect(p.parse("Rut 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Rut 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("RUTH 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTH 1:1'")
		expect(p.parse("RUT 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUT 1:1'")
		`
		true
describe "Localized book 1Esd (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Esd (hu)", ->
		`
		expect(p.parse("Elso Ezdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Elso Ezdras 1:1'")
		expect(p.parse("Elso Ezdrás 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Elso Ezdrás 1:1'")
		expect(p.parse("Első Ezdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Első Ezdras 1:1'")
		expect(p.parse("Első Ezdrás 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Első Ezdrás 1:1'")
		expect(p.parse("1. Ezdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Ezdras 1:1'")
		expect(p.parse("1. Ezdrás 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Ezdrás 1:1'")
		expect(p.parse("I. Ezdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Ezdras 1:1'")
		expect(p.parse("I. Ezdrás 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Ezdrás 1:1'")
		expect(p.parse("1 Ezdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ezdras 1:1'")
		expect(p.parse("1 Ezdrás 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ezdrás 1:1'")
		expect(p.parse("Elso Ezd 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Elso Ezd 1:1'")
		expect(p.parse("Első Ezd 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Első Ezd 1:1'")
		expect(p.parse("Ezdras I 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Ezdras I 1:1'")
		expect(p.parse("Ezdrás I 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Ezdrás I 1:1'")
		expect(p.parse("I Ezdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Ezdras 1:1'")
		expect(p.parse("I Ezdrás 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Ezdrás 1:1'")
		expect(p.parse("1. Ezd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Ezd 1:1'")
		expect(p.parse("I. Ezd 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Ezd 1:1'")
		expect(p.parse("1 Ezd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ezd 1:1'")
		expect(p.parse("I Ezd 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Ezd 1:1'")
		expect(p.parse("1Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1Esd 1:1'")
		`
		true
describe "Localized book 2Esd (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Esd (hu)", ->
		`
		expect(p.parse("Masodik Ezdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Masodik Ezdras 1:1'")
		expect(p.parse("Masodik Ezdrás 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Masodik Ezdrás 1:1'")
		expect(p.parse("Második Ezdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Második Ezdras 1:1'")
		expect(p.parse("Második Ezdrás 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Második Ezdrás 1:1'")
		expect(p.parse("Masodik Ezd 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Masodik Ezd 1:1'")
		expect(p.parse("Második Ezd 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Második Ezd 1:1'")
		expect(p.parse("II. Ezdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Ezdras 1:1'")
		expect(p.parse("II. Ezdrás 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Ezdrás 1:1'")
		expect(p.parse("2. Ezdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Ezdras 1:1'")
		expect(p.parse("2. Ezdrás 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Ezdrás 1:1'")
		expect(p.parse("Ezdras II 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Ezdras II 1:1'")
		expect(p.parse("Ezdrás II 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Ezdrás II 1:1'")
		expect(p.parse("II Ezdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Ezdras 1:1'")
		expect(p.parse("II Ezdrás 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Ezdrás 1:1'")
		expect(p.parse("2 Ezdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ezdras 1:1'")
		expect(p.parse("2 Ezdrás 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ezdrás 1:1'")
		expect(p.parse("II. Ezd 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Ezd 1:1'")
		expect(p.parse("2. Ezd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Ezd 1:1'")
		expect(p.parse("II Ezd 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Ezd 1:1'")
		expect(p.parse("2 Ezd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ezd 1:1'")
		expect(p.parse("2Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2Esd 1:1'")
		`
		true
describe "Localized book Isa (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Isa (hu)", ->
		`
		expect(p.parse("Ezsaias 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ezsaias 1:1'")
		expect(p.parse("Ezsaiás 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ezsaiás 1:1'")
		expect(p.parse("Ézsaias 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ézsaias 1:1'")
		expect(p.parse("Ézsaiás 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ézsaiás 1:1'")
		expect(p.parse("Esaias 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Esaias 1:1'")
		expect(p.parse("Esaiás 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Esaiás 1:1'")
		expect(p.parse("Izajas 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Izajas 1:1'")
		expect(p.parse("Izajás 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Izajás 1:1'")
		expect(p.parse("Ésaias 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ésaias 1:1'")
		expect(p.parse("Ésaiás 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ésaiás 1:1'")
		expect(p.parse("Ezs 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ezs 1:1'")
		expect(p.parse("Isa 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isa 1:1'")
		expect(p.parse("Ézs 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ézs 1:1'")
		expect(p.parse("Iz 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Iz 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZSAIAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'EZSAIAS 1:1'")
		expect(p.parse("EZSAIÁS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'EZSAIÁS 1:1'")
		expect(p.parse("ÉZSAIAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ÉZSAIAS 1:1'")
		expect(p.parse("ÉZSAIÁS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ÉZSAIÁS 1:1'")
		expect(p.parse("ESAIAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ESAIAS 1:1'")
		expect(p.parse("ESAIÁS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ESAIÁS 1:1'")
		expect(p.parse("IZAJAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'IZAJAS 1:1'")
		expect(p.parse("IZAJÁS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'IZAJÁS 1:1'")
		expect(p.parse("ÉSAIAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ÉSAIAS 1:1'")
		expect(p.parse("ÉSAIÁS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ÉSAIÁS 1:1'")
		expect(p.parse("EZS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'EZS 1:1'")
		expect(p.parse("ISA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISA 1:1'")
		expect(p.parse("ÉZS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ÉZS 1:1'")
		expect(p.parse("IZ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'IZ 1:1'")
		`
		true
describe "Localized book 2Sam (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Sam (hu)", ->
		`
		expect(p.parse("Masodik Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Masodik Samuel 1:1'")
		expect(p.parse("Masodik Sámuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Masodik Sámuel 1:1'")
		expect(p.parse("Második Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Második Samuel 1:1'")
		expect(p.parse("Második Sámuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Második Sámuel 1:1'")
		expect(p.parse("Masodik Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Masodik Sam 1:1'")
		expect(p.parse("Masodik Sám 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Masodik Sám 1:1'")
		expect(p.parse("Második Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Második Sam 1:1'")
		expect(p.parse("Második Sám 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Második Sám 1:1'")
		expect(p.parse("II. Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Samuel 1:1'")
		expect(p.parse("II. Sámuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Sámuel 1:1'")
		expect(p.parse("2. Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Samuel 1:1'")
		expect(p.parse("2. Sámuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Sámuel 1:1'")
		expect(p.parse("II Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Samuel 1:1'")
		expect(p.parse("II Sámuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Sámuel 1:1'")
		expect(p.parse("Samuel II 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Samuel II 1:1'")
		expect(p.parse("Sámuel II 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Sámuel II 1:1'")
		expect(p.parse("2 Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Samuel 1:1'")
		expect(p.parse("2 Sámuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Sámuel 1:1'")
		expect(p.parse("II. Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Sam 1:1'")
		expect(p.parse("II. Sám 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Sám 1:1'")
		expect(p.parse("2. Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Sam 1:1'")
		expect(p.parse("2. Sám 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Sám 1:1'")
		expect(p.parse("II Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Sam 1:1'")
		expect(p.parse("II Sám 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Sám 1:1'")
		expect(p.parse("2 Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Sam 1:1'")
		expect(p.parse("2 Sám 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Sám 1:1'")
		expect(p.parse("2Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MASODIK SAMUEL 1:1'")
		expect(p.parse("MASODIK SÁMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MASODIK SÁMUEL 1:1'")
		expect(p.parse("MÁSODIK SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MÁSODIK SAMUEL 1:1'")
		expect(p.parse("MÁSODIK SÁMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MÁSODIK SÁMUEL 1:1'")
		expect(p.parse("MASODIK SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MASODIK SAM 1:1'")
		expect(p.parse("MASODIK SÁM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MASODIK SÁM 1:1'")
		expect(p.parse("MÁSODIK SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MÁSODIK SAM 1:1'")
		expect(p.parse("MÁSODIK SÁM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'MÁSODIK SÁM 1:1'")
		expect(p.parse("II. SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SAMUEL 1:1'")
		expect(p.parse("II. SÁMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SÁMUEL 1:1'")
		expect(p.parse("2. SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SAMUEL 1:1'")
		expect(p.parse("2. SÁMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SÁMUEL 1:1'")
		expect(p.parse("II SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SAMUEL 1:1'")
		expect(p.parse("II SÁMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SÁMUEL 1:1'")
		expect(p.parse("SAMUEL II 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'SAMUEL II 1:1'")
		expect(p.parse("SÁMUEL II 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'SÁMUEL II 1:1'")
		expect(p.parse("2 SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAMUEL 1:1'")
		expect(p.parse("2 SÁMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SÁMUEL 1:1'")
		expect(p.parse("II. SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SAM 1:1'")
		expect(p.parse("II. SÁM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SÁM 1:1'")
		expect(p.parse("2. SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SAM 1:1'")
		expect(p.parse("2. SÁM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SÁM 1:1'")
		expect(p.parse("II SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SAM 1:1'")
		expect(p.parse("II SÁM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SÁM 1:1'")
		expect(p.parse("2 SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAM 1:1'")
		expect(p.parse("2 SÁM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SÁM 1:1'")
		expect(p.parse("2SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2SAM 1:1'")
		`
		true
describe "Localized book 1Sam (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Sam (hu)", ->
		`
		expect(p.parse("Elso Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Elso Samuel 1:1'")
		expect(p.parse("Elso Sámuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Elso Sámuel 1:1'")
		expect(p.parse("Első Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Első Samuel 1:1'")
		expect(p.parse("Első Sámuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Első Sámuel 1:1'")
		expect(p.parse("1. Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Samuel 1:1'")
		expect(p.parse("1. Sámuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Sámuel 1:1'")
		expect(p.parse("I. Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Samuel 1:1'")
		expect(p.parse("I. Sámuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Sámuel 1:1'")
		expect(p.parse("1 Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Samuel 1:1'")
		expect(p.parse("1 Sámuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Sámuel 1:1'")
		expect(p.parse("Elso Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Elso Sam 1:1'")
		expect(p.parse("Elso Sám 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Elso Sám 1:1'")
		expect(p.parse("Első Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Első Sam 1:1'")
		expect(p.parse("Első Sám 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Első Sám 1:1'")
		expect(p.parse("I Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Samuel 1:1'")
		expect(p.parse("I Sámuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Sámuel 1:1'")
		expect(p.parse("Samuel I 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Samuel I 1:1'")
		expect(p.parse("Sámuel I 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Sámuel I 1:1'")
		expect(p.parse("1. Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Sam 1:1'")
		expect(p.parse("1. Sám 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Sám 1:1'")
		expect(p.parse("I. Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Sam 1:1'")
		expect(p.parse("I. Sám 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Sám 1:1'")
		expect(p.parse("1 Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Sam 1:1'")
		expect(p.parse("1 Sám 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Sám 1:1'")
		expect(p.parse("I Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Sam 1:1'")
		expect(p.parse("I Sám 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Sám 1:1'")
		expect(p.parse("1Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSO SAMUEL 1:1'")
		expect(p.parse("ELSO SÁMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSO SÁMUEL 1:1'")
		expect(p.parse("ELSŐ SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSŐ SAMUEL 1:1'")
		expect(p.parse("ELSŐ SÁMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSŐ SÁMUEL 1:1'")
		expect(p.parse("1. SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SAMUEL 1:1'")
		expect(p.parse("1. SÁMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SÁMUEL 1:1'")
		expect(p.parse("I. SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SAMUEL 1:1'")
		expect(p.parse("I. SÁMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SÁMUEL 1:1'")
		expect(p.parse("1 SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAMUEL 1:1'")
		expect(p.parse("1 SÁMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SÁMUEL 1:1'")
		expect(p.parse("ELSO SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSO SAM 1:1'")
		expect(p.parse("ELSO SÁM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSO SÁM 1:1'")
		expect(p.parse("ELSŐ SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSŐ SAM 1:1'")
		expect(p.parse("ELSŐ SÁM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ELSŐ SÁM 1:1'")
		expect(p.parse("I SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SAMUEL 1:1'")
		expect(p.parse("I SÁMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SÁMUEL 1:1'")
		expect(p.parse("SAMUEL I 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'SAMUEL I 1:1'")
		expect(p.parse("SÁMUEL I 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'SÁMUEL I 1:1'")
		expect(p.parse("1. SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SAM 1:1'")
		expect(p.parse("1. SÁM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SÁM 1:1'")
		expect(p.parse("I. SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SAM 1:1'")
		expect(p.parse("I. SÁM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SÁM 1:1'")
		expect(p.parse("1 SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAM 1:1'")
		expect(p.parse("1 SÁM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SÁM 1:1'")
		expect(p.parse("I SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SAM 1:1'")
		expect(p.parse("I SÁM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SÁM 1:1'")
		expect(p.parse("1SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1SAM 1:1'")
		`
		true
describe "Localized book 2Kgs (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Kgs (hu)", ->
		`
		expect(p.parse("Masodik Kiralyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Masodik Kiralyok 1:1'")
		expect(p.parse("Masodik Királyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Masodik Királyok 1:1'")
		expect(p.parse("Második Kiralyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Második Kiralyok 1:1'")
		expect(p.parse("Második Királyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Második Királyok 1:1'")
		expect(p.parse("II. Kiralyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Kiralyok 1:1'")
		expect(p.parse("II. Királyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Királyok 1:1'")
		expect(p.parse("2. Kiralyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Kiralyok 1:1'")
		expect(p.parse("2. Királyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Királyok 1:1'")
		expect(p.parse("II Kiralyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Kiralyok 1:1'")
		expect(p.parse("II Királyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Királyok 1:1'")
		expect(p.parse("Kiralyok II 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Kiralyok II 1:1'")
		expect(p.parse("Királyok II 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Királyok II 1:1'")
		expect(p.parse("Masodik Kir 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Masodik Kir 1:1'")
		expect(p.parse("Második Kir 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Második Kir 1:1'")
		expect(p.parse("2 Kiralyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Kiralyok 1:1'")
		expect(p.parse("2 Királyok 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Királyok 1:1'")
		expect(p.parse("II. Kir 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Kir 1:1'")
		expect(p.parse("2. Kir 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Kir 1:1'")
		expect(p.parse("II Kir 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Kir 1:1'")
		expect(p.parse("2 Kir 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Kir 1:1'")
		expect(p.parse("2Kgs 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK KIRALYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'MASODIK KIRALYOK 1:1'")
		expect(p.parse("MASODIK KIRÁLYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'MASODIK KIRÁLYOK 1:1'")
		expect(p.parse("MÁSODIK KIRALYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'MÁSODIK KIRALYOK 1:1'")
		expect(p.parse("MÁSODIK KIRÁLYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'MÁSODIK KIRÁLYOK 1:1'")
		expect(p.parse("II. KIRALYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. KIRALYOK 1:1'")
		expect(p.parse("II. KIRÁLYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. KIRÁLYOK 1:1'")
		expect(p.parse("2. KIRALYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. KIRALYOK 1:1'")
		expect(p.parse("2. KIRÁLYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. KIRÁLYOK 1:1'")
		expect(p.parse("II KIRALYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II KIRALYOK 1:1'")
		expect(p.parse("II KIRÁLYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II KIRÁLYOK 1:1'")
		expect(p.parse("KIRALYOK II 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'KIRALYOK II 1:1'")
		expect(p.parse("KIRÁLYOK II 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'KIRÁLYOK II 1:1'")
		expect(p.parse("MASODIK KIR 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'MASODIK KIR 1:1'")
		expect(p.parse("MÁSODIK KIR 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'MÁSODIK KIR 1:1'")
		expect(p.parse("2 KIRALYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 KIRALYOK 1:1'")
		expect(p.parse("2 KIRÁLYOK 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 KIRÁLYOK 1:1'")
		expect(p.parse("II. KIR 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. KIR 1:1'")
		expect(p.parse("2. KIR 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. KIR 1:1'")
		expect(p.parse("II KIR 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II KIR 1:1'")
		expect(p.parse("2 KIR 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 KIR 1:1'")
		expect(p.parse("2KGS 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2KGS 1:1'")
		`
		true
describe "Localized book 1Kgs (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Kgs (hu)", ->
		`
		expect(p.parse("Elso Kiralyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Elso Kiralyok 1:1'")
		expect(p.parse("Elso Királyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Elso Királyok 1:1'")
		expect(p.parse("Első Kiralyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Első Kiralyok 1:1'")
		expect(p.parse("Első Királyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Első Királyok 1:1'")
		expect(p.parse("1. Kiralyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Kiralyok 1:1'")
		expect(p.parse("1. Királyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Királyok 1:1'")
		expect(p.parse("I. Kiralyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Kiralyok 1:1'")
		expect(p.parse("I. Királyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Királyok 1:1'")
		expect(p.parse("1 Kiralyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Kiralyok 1:1'")
		expect(p.parse("1 Királyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Királyok 1:1'")
		expect(p.parse("I Kiralyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Kiralyok 1:1'")
		expect(p.parse("I Királyok 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Királyok 1:1'")
		expect(p.parse("Kiralyok I 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Kiralyok I 1:1'")
		expect(p.parse("Királyok I 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Királyok I 1:1'")
		expect(p.parse("Elso Kir 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Elso Kir 1:1'")
		expect(p.parse("Első Kir 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Első Kir 1:1'")
		expect(p.parse("1. Kir 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Kir 1:1'")
		expect(p.parse("I. Kir 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Kir 1:1'")
		expect(p.parse("1 Kir 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Kir 1:1'")
		expect(p.parse("I Kir 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Kir 1:1'")
		expect(p.parse("1Kgs 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO KIRALYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ELSO KIRALYOK 1:1'")
		expect(p.parse("ELSO KIRÁLYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ELSO KIRÁLYOK 1:1'")
		expect(p.parse("ELSŐ KIRALYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ELSŐ KIRALYOK 1:1'")
		expect(p.parse("ELSŐ KIRÁLYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ELSŐ KIRÁLYOK 1:1'")
		expect(p.parse("1. KIRALYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. KIRALYOK 1:1'")
		expect(p.parse("1. KIRÁLYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. KIRÁLYOK 1:1'")
		expect(p.parse("I. KIRALYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. KIRALYOK 1:1'")
		expect(p.parse("I. KIRÁLYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. KIRÁLYOK 1:1'")
		expect(p.parse("1 KIRALYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 KIRALYOK 1:1'")
		expect(p.parse("1 KIRÁLYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 KIRÁLYOK 1:1'")
		expect(p.parse("I KIRALYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I KIRALYOK 1:1'")
		expect(p.parse("I KIRÁLYOK 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I KIRÁLYOK 1:1'")
		expect(p.parse("KIRALYOK I 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'KIRALYOK I 1:1'")
		expect(p.parse("KIRÁLYOK I 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'KIRÁLYOK I 1:1'")
		expect(p.parse("ELSO KIR 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ELSO KIR 1:1'")
		expect(p.parse("ELSŐ KIR 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ELSŐ KIR 1:1'")
		expect(p.parse("1. KIR 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. KIR 1:1'")
		expect(p.parse("I. KIR 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. KIR 1:1'")
		expect(p.parse("1 KIR 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 KIR 1:1'")
		expect(p.parse("I KIR 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I KIR 1:1'")
		expect(p.parse("1KGS 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1KGS 1:1'")
		`
		true
describe "Localized book 2Chr (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Chr (hu)", ->
		`
		expect(p.parse("Masodik Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Masodik Kronika 1:1'")
		expect(p.parse("Masodik Krónika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Masodik Krónika 1:1'")
		expect(p.parse("Második Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Második Kronika 1:1'")
		expect(p.parse("Második Krónika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Második Krónika 1:1'")
		expect(p.parse("Masodik Kron 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Masodik Kron 1:1'")
		expect(p.parse("Masodik Krón 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Masodik Krón 1:1'")
		expect(p.parse("Második Kron 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Második Kron 1:1'")
		expect(p.parse("Második Krón 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Második Krón 1:1'")
		expect(p.parse("II. Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Kronika 1:1'")
		expect(p.parse("II. Krónika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Krónika 1:1'")
		expect(p.parse("Kronikak II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Kronikak II 1:1'")
		expect(p.parse("Kronikák II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Kronikák II 1:1'")
		expect(p.parse("Krónikak II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Krónikak II 1:1'")
		expect(p.parse("Krónikák II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Krónikák II 1:1'")
		expect(p.parse("2. Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Kronika 1:1'")
		expect(p.parse("2. Krónika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Krónika 1:1'")
		expect(p.parse("II Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Kronika 1:1'")
		expect(p.parse("II Krónika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Krónika 1:1'")
		expect(p.parse("2 Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Kronika 1:1'")
		expect(p.parse("2 Krónika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Krónika 1:1'")
		expect(p.parse("II. Kron 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Kron 1:1'")
		expect(p.parse("II. Krón 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Krón 1:1'")
		expect(p.parse("2. Kron 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Kron 1:1'")
		expect(p.parse("2. Krón 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Krón 1:1'")
		expect(p.parse("II Kron 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Kron 1:1'")
		expect(p.parse("II Krón 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Krón 1:1'")
		expect(p.parse("2 Kron 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Kron 1:1'")
		expect(p.parse("2 Krón 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Krón 1:1'")
		expect(p.parse("2Chr 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MASODIK KRONIKA 1:1'")
		expect(p.parse("MASODIK KRÓNIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MASODIK KRÓNIKA 1:1'")
		expect(p.parse("MÁSODIK KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MÁSODIK KRONIKA 1:1'")
		expect(p.parse("MÁSODIK KRÓNIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MÁSODIK KRÓNIKA 1:1'")
		expect(p.parse("MASODIK KRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MASODIK KRON 1:1'")
		expect(p.parse("MASODIK KRÓN 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MASODIK KRÓN 1:1'")
		expect(p.parse("MÁSODIK KRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MÁSODIK KRON 1:1'")
		expect(p.parse("MÁSODIK KRÓN 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MÁSODIK KRÓN 1:1'")
		expect(p.parse("II. KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. KRONIKA 1:1'")
		expect(p.parse("II. KRÓNIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. KRÓNIKA 1:1'")
		expect(p.parse("KRONIKAK II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'KRONIKAK II 1:1'")
		expect(p.parse("KRONIKÁK II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'KRONIKÁK II 1:1'")
		expect(p.parse("KRÓNIKAK II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'KRÓNIKAK II 1:1'")
		expect(p.parse("KRÓNIKÁK II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'KRÓNIKÁK II 1:1'")
		expect(p.parse("2. KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. KRONIKA 1:1'")
		expect(p.parse("2. KRÓNIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. KRÓNIKA 1:1'")
		expect(p.parse("II KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II KRONIKA 1:1'")
		expect(p.parse("II KRÓNIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II KRÓNIKA 1:1'")
		expect(p.parse("2 KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 KRONIKA 1:1'")
		expect(p.parse("2 KRÓNIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 KRÓNIKA 1:1'")
		expect(p.parse("II. KRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. KRON 1:1'")
		expect(p.parse("II. KRÓN 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. KRÓN 1:1'")
		expect(p.parse("2. KRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. KRON 1:1'")
		expect(p.parse("2. KRÓN 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. KRÓN 1:1'")
		expect(p.parse("II KRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II KRON 1:1'")
		expect(p.parse("II KRÓN 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II KRÓN 1:1'")
		expect(p.parse("2 KRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 KRON 1:1'")
		expect(p.parse("2 KRÓN 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 KRÓN 1:1'")
		expect(p.parse("2CHR 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2CHR 1:1'")
		`
		true
describe "Localized book 1Chr (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Chr (hu)", ->
		`
		expect(p.parse("Elso Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Elso Kronika 1:1'")
		expect(p.parse("Elso Krónika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Elso Krónika 1:1'")
		expect(p.parse("Első Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Első Kronika 1:1'")
		expect(p.parse("Első Krónika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Első Krónika 1:1'")
		expect(p.parse("1. Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Kronika 1:1'")
		expect(p.parse("1. Krónika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Krónika 1:1'")
		expect(p.parse("I. Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Kronika 1:1'")
		expect(p.parse("I. Krónika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Krónika 1:1'")
		expect(p.parse("Kronikak I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Kronikak I 1:1'")
		expect(p.parse("Kronikák I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Kronikák I 1:1'")
		expect(p.parse("Krónikak I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Krónikak I 1:1'")
		expect(p.parse("Krónikák I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Krónikák I 1:1'")
		expect(p.parse("1 Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Kronika 1:1'")
		expect(p.parse("1 Krónika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Krónika 1:1'")
		expect(p.parse("Elso Kron 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Elso Kron 1:1'")
		expect(p.parse("Elso Krón 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Elso Krón 1:1'")
		expect(p.parse("Első Kron 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Első Kron 1:1'")
		expect(p.parse("Első Krón 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Első Krón 1:1'")
		expect(p.parse("I Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Kronika 1:1'")
		expect(p.parse("I Krónika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Krónika 1:1'")
		expect(p.parse("1. Kron 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Kron 1:1'")
		expect(p.parse("1. Krón 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Krón 1:1'")
		expect(p.parse("I. Kron 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Kron 1:1'")
		expect(p.parse("I. Krón 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Krón 1:1'")
		expect(p.parse("1 Kron 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Kron 1:1'")
		expect(p.parse("1 Krón 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Krón 1:1'")
		expect(p.parse("I Kron 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Kron 1:1'")
		expect(p.parse("I Krón 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Krón 1:1'")
		expect(p.parse("1Chr 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSO KRONIKA 1:1'")
		expect(p.parse("ELSO KRÓNIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSO KRÓNIKA 1:1'")
		expect(p.parse("ELSŐ KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSŐ KRONIKA 1:1'")
		expect(p.parse("ELSŐ KRÓNIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSŐ KRÓNIKA 1:1'")
		expect(p.parse("1. KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. KRONIKA 1:1'")
		expect(p.parse("1. KRÓNIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. KRÓNIKA 1:1'")
		expect(p.parse("I. KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. KRONIKA 1:1'")
		expect(p.parse("I. KRÓNIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. KRÓNIKA 1:1'")
		expect(p.parse("KRONIKAK I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'KRONIKAK I 1:1'")
		expect(p.parse("KRONIKÁK I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'KRONIKÁK I 1:1'")
		expect(p.parse("KRÓNIKAK I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'KRÓNIKAK I 1:1'")
		expect(p.parse("KRÓNIKÁK I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'KRÓNIKÁK I 1:1'")
		expect(p.parse("1 KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 KRONIKA 1:1'")
		expect(p.parse("1 KRÓNIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 KRÓNIKA 1:1'")
		expect(p.parse("ELSO KRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSO KRON 1:1'")
		expect(p.parse("ELSO KRÓN 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSO KRÓN 1:1'")
		expect(p.parse("ELSŐ KRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSŐ KRON 1:1'")
		expect(p.parse("ELSŐ KRÓN 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ELSŐ KRÓN 1:1'")
		expect(p.parse("I KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I KRONIKA 1:1'")
		expect(p.parse("I KRÓNIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I KRÓNIKA 1:1'")
		expect(p.parse("1. KRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. KRON 1:1'")
		expect(p.parse("1. KRÓN 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. KRÓN 1:1'")
		expect(p.parse("I. KRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. KRON 1:1'")
		expect(p.parse("I. KRÓN 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. KRÓN 1:1'")
		expect(p.parse("1 KRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 KRON 1:1'")
		expect(p.parse("1 KRÓN 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 KRÓN 1:1'")
		expect(p.parse("I KRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I KRON 1:1'")
		expect(p.parse("I KRÓN 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I KRÓN 1:1'")
		expect(p.parse("1CHR 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1CHR 1:1'")
		`
		true
describe "Localized book Ezra (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ezra (hu)", ->
		`
		expect(p.parse("Ezsdras 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezsdras 1:1'")
		expect(p.parse("Ezsdrás 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezsdrás 1:1'")
		expect(p.parse("Ezra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezra 1:1'")
		expect(p.parse("Ezsd 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezsd 1:1'")
		expect(p.parse("Ezd 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezd 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZSDRAS 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZSDRAS 1:1'")
		expect(p.parse("EZSDRÁS 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZSDRÁS 1:1'")
		expect(p.parse("EZRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZRA 1:1'")
		expect(p.parse("EZSD 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZSD 1:1'")
		expect(p.parse("EZD 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZD 1:1'")
		`
		true
describe "Localized book Neh (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Neh (hu)", ->
		`
		expect(p.parse("Nehemias 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemias 1:1'")
		expect(p.parse("Nehemiás 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemiás 1:1'")
		expect(p.parse("Neh 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Neh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NEHEMIAS 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMIAS 1:1'")
		expect(p.parse("NEHEMIÁS 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMIÁS 1:1'")
		expect(p.parse("NEH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEH 1:1'")
		`
		true
describe "Localized book GkEsth (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: GkEsth (hu)", ->
		`
		expect(p.parse("Eszter konyvenek kiegeszitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegeszitese 1:1'")
		expect(p.parse("Eszter konyvenek kiegeszitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegeszitése 1:1'")
		expect(p.parse("Eszter konyvenek kiegeszítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegeszítese 1:1'")
		expect(p.parse("Eszter konyvenek kiegeszítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegeszítése 1:1'")
		expect(p.parse("Eszter konyvenek kiegészitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegészitese 1:1'")
		expect(p.parse("Eszter konyvenek kiegészitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegészitése 1:1'")
		expect(p.parse("Eszter konyvenek kiegészítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegészítese 1:1'")
		expect(p.parse("Eszter konyvenek kiegészítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvenek kiegészítése 1:1'")
		expect(p.parse("Eszter konyvének kiegeszitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegeszitese 1:1'")
		expect(p.parse("Eszter konyvének kiegeszitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegeszitése 1:1'")
		expect(p.parse("Eszter konyvének kiegeszítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegeszítese 1:1'")
		expect(p.parse("Eszter konyvének kiegeszítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegeszítése 1:1'")
		expect(p.parse("Eszter konyvének kiegészitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegészitese 1:1'")
		expect(p.parse("Eszter konyvének kiegészitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegészitése 1:1'")
		expect(p.parse("Eszter konyvének kiegészítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegészítese 1:1'")
		expect(p.parse("Eszter konyvének kiegészítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter konyvének kiegészítése 1:1'")
		expect(p.parse("Eszter könyvenek kiegeszitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegeszitese 1:1'")
		expect(p.parse("Eszter könyvenek kiegeszitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegeszitése 1:1'")
		expect(p.parse("Eszter könyvenek kiegeszítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegeszítese 1:1'")
		expect(p.parse("Eszter könyvenek kiegeszítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegeszítése 1:1'")
		expect(p.parse("Eszter könyvenek kiegészitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegészitese 1:1'")
		expect(p.parse("Eszter könyvenek kiegészitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegészitése 1:1'")
		expect(p.parse("Eszter könyvenek kiegészítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegészítese 1:1'")
		expect(p.parse("Eszter könyvenek kiegészítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvenek kiegészítése 1:1'")
		expect(p.parse("Eszter könyvének kiegeszitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegeszitese 1:1'")
		expect(p.parse("Eszter könyvének kiegeszitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegeszitése 1:1'")
		expect(p.parse("Eszter könyvének kiegeszítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegeszítese 1:1'")
		expect(p.parse("Eszter könyvének kiegeszítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegeszítése 1:1'")
		expect(p.parse("Eszter könyvének kiegészitese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegészitese 1:1'")
		expect(p.parse("Eszter könyvének kiegészitése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegészitése 1:1'")
		expect(p.parse("Eszter könyvének kiegészítese 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegészítese 1:1'")
		expect(p.parse("Eszter könyvének kiegészítése 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Eszter könyvének kiegészítése 1:1'")
		expect(p.parse("GkEsth 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'GkEsth 1:1'")
		`
		true
describe "Localized book Esth (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Esth (hu)", ->
		`
		expect(p.parse("Eszter 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Eszter 1:1'")
		expect(p.parse("Esth 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esth 1:1'")
		expect(p.parse("Eszt 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Eszt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ESZTER 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESZTER 1:1'")
		expect(p.parse("ESTH 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTH 1:1'")
		expect(p.parse("ESZT 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESZT 1:1'")
		`
		true
describe "Localized book Job (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Job (hu)", ->
		`
		expect(p.parse("Job 1:1").osis()).toEqual("Job.1.1", "parsing: 'Job 1:1'")
		expect(p.parse("Jób 1:1").osis()).toEqual("Job.1.1", "parsing: 'Jób 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JOB 1:1'")
		expect(p.parse("JÓB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JÓB 1:1'")
		`
		true
describe "Localized book Ps (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ps (hu)", ->
		`
		expect(p.parse("Zsoltarok 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Zsoltarok 1:1'")
		expect(p.parse("Zsoltárok 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Zsoltárok 1:1'")
		expect(p.parse("Zsolt 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Zsolt 1:1'")
		expect(p.parse("Zsol 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Zsol 1:1'")
		expect(p.parse("Ps 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Ps 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZSOLTAROK 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ZSOLTAROK 1:1'")
		expect(p.parse("ZSOLTÁROK 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ZSOLTÁROK 1:1'")
		expect(p.parse("ZSOLT 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ZSOLT 1:1'")
		expect(p.parse("ZSOL 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ZSOL 1:1'")
		expect(p.parse("PS 1:1").osis()).toEqual("Ps.1.1", "parsing: 'PS 1:1'")
		`
		true
describe "Localized book PrAzar (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: PrAzar (hu)", ->
		`
		expect(p.parse("Azarias imadsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azarias imadsaga 1:1'")
		expect(p.parse("Azarias imadsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azarias imadsága 1:1'")
		expect(p.parse("Azarias imádsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azarias imádsaga 1:1'")
		expect(p.parse("Azarias imádsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azarias imádsága 1:1'")
		expect(p.parse("Azariás imadsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azariás imadsaga 1:1'")
		expect(p.parse("Azariás imadsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azariás imadsága 1:1'")
		expect(p.parse("Azariás imádsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azariás imádsaga 1:1'")
		expect(p.parse("Azariás imádsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azariás imádsága 1:1'")
		expect(p.parse("Azárias imadsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azárias imadsaga 1:1'")
		expect(p.parse("Azárias imadsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azárias imadsága 1:1'")
		expect(p.parse("Azárias imádsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azárias imádsaga 1:1'")
		expect(p.parse("Azárias imádsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azárias imádsága 1:1'")
		expect(p.parse("Azáriás imadsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azáriás imadsaga 1:1'")
		expect(p.parse("Azáriás imadsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azáriás imadsága 1:1'")
		expect(p.parse("Azáriás imádsaga 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azáriás imádsaga 1:1'")
		expect(p.parse("Azáriás imádsága 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azáriás imádsága 1:1'")
		expect(p.parse("Azarias imaja 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azarias imaja 1:1'")
		expect(p.parse("Azarias imája 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azarias imája 1:1'")
		expect(p.parse("Azariás imaja 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azariás imaja 1:1'")
		expect(p.parse("Azariás imája 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azariás imája 1:1'")
		expect(p.parse("Azárias imaja 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azárias imaja 1:1'")
		expect(p.parse("Azárias imája 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azárias imája 1:1'")
		expect(p.parse("Azáriás imaja 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azáriás imaja 1:1'")
		expect(p.parse("Azáriás imája 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Azáriás imája 1:1'")
		expect(p.parse("PrAzar 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'PrAzar 1:1'")
		`
		true
describe "Localized book Prov (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Prov (hu)", ->
		`
		expect(p.parse("Peldabeszedek 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Peldabeszedek 1:1'")
		expect(p.parse("Peldabeszédek 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Peldabeszédek 1:1'")
		expect(p.parse("Példabeszedek 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Példabeszedek 1:1'")
		expect(p.parse("Példabeszédek 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Példabeszédek 1:1'")
		expect(p.parse("Peld 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Peld 1:1'")
		expect(p.parse("Prov 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Prov 1:1'")
		expect(p.parse("Péld 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Péld 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PELDABESZEDEK 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PELDABESZEDEK 1:1'")
		expect(p.parse("PELDABESZÉDEK 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PELDABESZÉDEK 1:1'")
		expect(p.parse("PÉLDABESZEDEK 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PÉLDABESZEDEK 1:1'")
		expect(p.parse("PÉLDABESZÉDEK 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PÉLDABESZÉDEK 1:1'")
		expect(p.parse("PELD 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PELD 1:1'")
		expect(p.parse("PROV 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PROV 1:1'")
		expect(p.parse("PÉLD 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PÉLD 1:1'")
		`
		true
describe "Localized book Eccl (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Eccl (hu)", ->
		`
		expect(p.parse("Predikator 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Predikator 1:1'")
		expect(p.parse("Predikátor 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Predikátor 1:1'")
		expect(p.parse("Prédikator 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Prédikator 1:1'")
		expect(p.parse("Prédikátor 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Prédikátor 1:1'")
		expect(p.parse("Eccl 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eccl 1:1'")
		expect(p.parse("Pred 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Pred 1:1'")
		expect(p.parse("Préd 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Préd 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PREDIKATOR 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PREDIKATOR 1:1'")
		expect(p.parse("PREDIKÁTOR 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PREDIKÁTOR 1:1'")
		expect(p.parse("PRÉDIKATOR 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PRÉDIKATOR 1:1'")
		expect(p.parse("PRÉDIKÁTOR 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PRÉDIKÁTOR 1:1'")
		expect(p.parse("ECCL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCL 1:1'")
		expect(p.parse("PRED 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PRED 1:1'")
		expect(p.parse("PRÉD 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PRÉD 1:1'")
		`
		true
describe "Localized book SgThree (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: SgThree (hu)", ->
		`
		expect(p.parse("Harom fiatalember eneke 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Harom fiatalember eneke 1:1'")
		expect(p.parse("Harom fiatalember éneke 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Harom fiatalember éneke 1:1'")
		expect(p.parse("Három fiatalember eneke 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Három fiatalember eneke 1:1'")
		expect(p.parse("Három fiatalember éneke 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Három fiatalember éneke 1:1'")
		expect(p.parse("SgThree 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'SgThree 1:1'")
		`
		true
describe "Localized book Song (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Song (hu)", ->
		`
		expect(p.parse("Salamon eneke 1:1").osis()).toEqual("Song.1.1", "parsing: 'Salamon eneke 1:1'")
		expect(p.parse("Salamon éneke 1:1").osis()).toEqual("Song.1.1", "parsing: 'Salamon éneke 1:1'")
		expect(p.parse("Enekek eneke 1:1").osis()).toEqual("Song.1.1", "parsing: 'Enekek eneke 1:1'")
		expect(p.parse("Enekek éneke 1:1").osis()).toEqual("Song.1.1", "parsing: 'Enekek éneke 1:1'")
		expect(p.parse("Énekek eneke 1:1").osis()).toEqual("Song.1.1", "parsing: 'Énekek eneke 1:1'")
		expect(p.parse("Énekek éneke 1:1").osis()).toEqual("Song.1.1", "parsing: 'Énekek éneke 1:1'")
		expect(p.parse("Song 1:1").osis()).toEqual("Song.1.1", "parsing: 'Song 1:1'")
		expect(p.parse("En 1:1").osis()).toEqual("Song.1.1", "parsing: 'En 1:1'")
		expect(p.parse("Én 1:1").osis()).toEqual("Song.1.1", "parsing: 'Én 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SALAMON ENEKE 1:1").osis()).toEqual("Song.1.1", "parsing: 'SALAMON ENEKE 1:1'")
		expect(p.parse("SALAMON ÉNEKE 1:1").osis()).toEqual("Song.1.1", "parsing: 'SALAMON ÉNEKE 1:1'")
		expect(p.parse("ENEKEK ENEKE 1:1").osis()).toEqual("Song.1.1", "parsing: 'ENEKEK ENEKE 1:1'")
		expect(p.parse("ENEKEK ÉNEKE 1:1").osis()).toEqual("Song.1.1", "parsing: 'ENEKEK ÉNEKE 1:1'")
		expect(p.parse("ÉNEKEK ENEKE 1:1").osis()).toEqual("Song.1.1", "parsing: 'ÉNEKEK ENEKE 1:1'")
		expect(p.parse("ÉNEKEK ÉNEKE 1:1").osis()).toEqual("Song.1.1", "parsing: 'ÉNEKEK ÉNEKE 1:1'")
		expect(p.parse("SONG 1:1").osis()).toEqual("Song.1.1", "parsing: 'SONG 1:1'")
		expect(p.parse("EN 1:1").osis()).toEqual("Song.1.1", "parsing: 'EN 1:1'")
		expect(p.parse("ÉN 1:1").osis()).toEqual("Song.1.1", "parsing: 'ÉN 1:1'")
		`
		true
describe "Localized book Jer (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jer (hu)", ->
		`
		expect(p.parse("Jeremias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jeremias 1:1'")
		expect(p.parse("Jeremiás 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jeremiás 1:1'")
		expect(p.parse("Jer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jer 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JEREMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JEREMIAS 1:1'")
		expect(p.parse("JEREMIÁS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JEREMIÁS 1:1'")
		expect(p.parse("JER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JER 1:1'")
		`
		true
describe "Localized book Ezek (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Ezek (hu)", ->
		`
		expect(p.parse("Ezekiel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezekiel 1:1'")
		expect(p.parse("Ezékiel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezékiel 1:1'")
		expect(p.parse("Ezek 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezek 1:1'")
		expect(p.parse("Ez 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ez 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZEKIEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEKIEL 1:1'")
		expect(p.parse("EZÉKIEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZÉKIEL 1:1'")
		expect(p.parse("EZEK 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEK 1:1'")
		expect(p.parse("EZ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZ 1:1'")
		`
		true
describe "Localized book Dan (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Dan (hu)", ->
		`
		expect(p.parse("Daniel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Daniel 1:1'")
		expect(p.parse("Dániel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dániel 1:1'")
		expect(p.parse("Dan 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dan 1:1'")
		expect(p.parse("Dán 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dán 1:1'")
		expect(p.parse("Dn 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("DANIEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DANIEL 1:1'")
		expect(p.parse("DÁNIEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DÁNIEL 1:1'")
		expect(p.parse("DAN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DAN 1:1'")
		expect(p.parse("DÁN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DÁN 1:1'")
		expect(p.parse("DN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DN 1:1'")
		`
		true
describe "Localized book Hos (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Hos (hu)", ->
		`
		expect(p.parse("Hoseas 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hoseas 1:1'")
		expect(p.parse("Hoseás 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hoseás 1:1'")
		expect(p.parse("Hóseas 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hóseas 1:1'")
		expect(p.parse("Hóseás 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hóseás 1:1'")
		expect(p.parse("Ozeas 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ozeas 1:1'")
		expect(p.parse("Ozeás 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ozeás 1:1'")
		expect(p.parse("Hos 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hos 1:1'")
		expect(p.parse("Hós 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hós 1:1'")
		expect(p.parse("Oz 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Oz 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HOSEAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEAS 1:1'")
		expect(p.parse("HOSEÁS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEÁS 1:1'")
		expect(p.parse("HÓSEAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HÓSEAS 1:1'")
		expect(p.parse("HÓSEÁS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HÓSEÁS 1:1'")
		expect(p.parse("OZEAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OZEAS 1:1'")
		expect(p.parse("OZEÁS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OZEÁS 1:1'")
		expect(p.parse("HOS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOS 1:1'")
		expect(p.parse("HÓS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HÓS 1:1'")
		expect(p.parse("OZ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OZ 1:1'")
		`
		true
describe "Localized book Joel (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Joel (hu)", ->
		`
		expect(p.parse("Joel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joel 1:1'")
		expect(p.parse("Joél 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joél 1:1'")
		expect(p.parse("Jóel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Jóel 1:1'")
		expect(p.parse("Jóél 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Jóél 1:1'")
		expect(p.parse("Jo 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Jo 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JOEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOEL 1:1'")
		expect(p.parse("JOÉL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOÉL 1:1'")
		expect(p.parse("JÓEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JÓEL 1:1'")
		expect(p.parse("JÓÉL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JÓÉL 1:1'")
		expect(p.parse("JO 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JO 1:1'")
		`
		true
describe "Localized book Amos (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Amos (hu)", ->
		`
		expect(p.parse("Amosz 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amosz 1:1'")
		expect(p.parse("Ámosz 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Ámosz 1:1'")
		expect(p.parse("Amos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amos 1:1'")
		expect(p.parse("Amós 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amós 1:1'")
		expect(p.parse("Ámos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Ámos 1:1'")
		expect(p.parse("Ámós 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Ámós 1:1'")
		expect(p.parse("Am 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Am 1:1'")
		expect(p.parse("Ám 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Ám 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("AMOSZ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOSZ 1:1'")
		expect(p.parse("ÁMOSZ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ÁMOSZ 1:1'")
		expect(p.parse("AMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOS 1:1'")
		expect(p.parse("AMÓS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMÓS 1:1'")
		expect(p.parse("ÁMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ÁMOS 1:1'")
		expect(p.parse("ÁMÓS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ÁMÓS 1:1'")
		expect(p.parse("AM 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AM 1:1'")
		expect(p.parse("ÁM 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ÁM 1:1'")
		`
		true
describe "Localized book Obad (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Obad (hu)", ->
		`
		expect(p.parse("Abdias 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Abdias 1:1'")
		expect(p.parse("Abdiás 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Abdiás 1:1'")
		expect(p.parse("Obad 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obad 1:1'")
		expect(p.parse("Abd 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Abd 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ABDIAS 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ABDIAS 1:1'")
		expect(p.parse("ABDIÁS 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ABDIÁS 1:1'")
		expect(p.parse("OBAD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBAD 1:1'")
		expect(p.parse("ABD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ABD 1:1'")
		`
		true
describe "Localized book Jonah (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jonah (hu)", ->
		`
		expect(p.parse("Jonah 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonah 1:1'")
		expect(p.parse("Jonas 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonas 1:1'")
		expect(p.parse("Jonás 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonás 1:1'")
		expect(p.parse("Jónas 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jónas 1:1'")
		expect(p.parse("Jónás 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jónás 1:1'")
		expect(p.parse("Jon 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jon 1:1'")
		expect(p.parse("Jón 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jón 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JONAH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAH 1:1'")
		expect(p.parse("JONAS 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAS 1:1'")
		expect(p.parse("JONÁS 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONÁS 1:1'")
		expect(p.parse("JÓNAS 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JÓNAS 1:1'")
		expect(p.parse("JÓNÁS 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JÓNÁS 1:1'")
		expect(p.parse("JON 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JON 1:1'")
		expect(p.parse("JÓN 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JÓN 1:1'")
		`
		true
describe "Localized book Mic (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Mic (hu)", ->
		`
		expect(p.parse("Mikeas 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikeas 1:1'")
		expect(p.parse("Mikeás 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikeás 1:1'")
		expect(p.parse("Mic 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mic 1:1'")
		expect(p.parse("Mik 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mik 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MIKEAS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKEAS 1:1'")
		expect(p.parse("MIKEÁS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKEÁS 1:1'")
		expect(p.parse("MIC 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIC 1:1'")
		expect(p.parse("MIK 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIK 1:1'")
		`
		true
describe "Localized book Nah (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Nah (hu)", ->
		`
		expect(p.parse("Nahum 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nahum 1:1'")
		expect(p.parse("Náhum 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Náhum 1:1'")
		expect(p.parse("Nah 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nah 1:1'")
		expect(p.parse("Náh 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Náh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NAHUM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAHUM 1:1'")
		expect(p.parse("NÁHUM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NÁHUM 1:1'")
		expect(p.parse("NAH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAH 1:1'")
		expect(p.parse("NÁH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NÁH 1:1'")
		`
		true
describe "Localized book Hab (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Hab (hu)", ->
		`
		expect(p.parse("Habakkuk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Habakkuk 1:1'")
		expect(p.parse("Habakuk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Habakuk 1:1'")
		expect(p.parse("Hab 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Hab 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HABAKKUK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HABAKKUK 1:1'")
		expect(p.parse("HABAKUK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HABAKUK 1:1'")
		expect(p.parse("HAB 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HAB 1:1'")
		`
		true
describe "Localized book Zeph (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Zeph (hu)", ->
		`
		expect(p.parse("Szefanias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Szefanias 1:1'")
		expect(p.parse("Szefaniás 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Szefaniás 1:1'")
		expect(p.parse("Szofonias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Szofonias 1:1'")
		expect(p.parse("Szofoniás 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Szofoniás 1:1'")
		expect(p.parse("Sofonias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sofonias 1:1'")
		expect(p.parse("Sofoniás 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sofoniás 1:1'")
		expect(p.parse("Zofonias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zofonias 1:1'")
		expect(p.parse("Zofoniás 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zofoniás 1:1'")
		expect(p.parse("Zofónias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zofónias 1:1'")
		expect(p.parse("Zofóniás 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zofóniás 1:1'")
		expect(p.parse("Szof 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Szof 1:1'")
		expect(p.parse("Zeph 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zeph 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SZEFANIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SZEFANIAS 1:1'")
		expect(p.parse("SZEFANIÁS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SZEFANIÁS 1:1'")
		expect(p.parse("SZOFONIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SZOFONIAS 1:1'")
		expect(p.parse("SZOFONIÁS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SZOFONIÁS 1:1'")
		expect(p.parse("SOFONIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SOFONIAS 1:1'")
		expect(p.parse("SOFONIÁS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SOFONIÁS 1:1'")
		expect(p.parse("ZOFONIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZOFONIAS 1:1'")
		expect(p.parse("ZOFONIÁS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZOFONIÁS 1:1'")
		expect(p.parse("ZOFÓNIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZOFÓNIAS 1:1'")
		expect(p.parse("ZOFÓNIÁS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZOFÓNIÁS 1:1'")
		expect(p.parse("SZOF 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SZOF 1:1'")
		expect(p.parse("ZEPH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPH 1:1'")
		`
		true
describe "Localized book Hag (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Hag (hu)", ->
		`
		expect(p.parse("Haggeus 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Haggeus 1:1'")
		expect(p.parse("Aggeus 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Aggeus 1:1'")
		expect(p.parse("Haggai 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Haggai 1:1'")
		expect(p.parse("Agg 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Agg 1:1'")
		expect(p.parse("Hag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hag 1:1'")
		expect(p.parse("Ag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Ag 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HAGGEUS 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGGEUS 1:1'")
		expect(p.parse("AGGEUS 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AGGEUS 1:1'")
		expect(p.parse("HAGGAI 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGGAI 1:1'")
		expect(p.parse("AGG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AGG 1:1'")
		expect(p.parse("HAG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAG 1:1'")
		expect(p.parse("AG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AG 1:1'")
		`
		true
describe "Localized book Zech (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Zech (hu)", ->
		`
		expect(p.parse("Zakarias 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zakarias 1:1'")
		expect(p.parse("Zakariás 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zakariás 1:1'")
		expect(p.parse("Zech 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zech 1:1'")
		expect(p.parse("Zak 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zak 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZAKARIAS 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZAKARIAS 1:1'")
		expect(p.parse("ZAKARIÁS 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZAKARIÁS 1:1'")
		expect(p.parse("ZECH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECH 1:1'")
		expect(p.parse("ZAK 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZAK 1:1'")
		`
		true
describe "Localized book Mal (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Mal (hu)", ->
		`
		expect(p.parse("Malakias 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malakias 1:1'")
		expect(p.parse("Malakiás 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malakiás 1:1'")
		expect(p.parse("Mal 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Mal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MALAKIAS 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALAKIAS 1:1'")
		expect(p.parse("MALAKIÁS 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALAKIÁS 1:1'")
		expect(p.parse("MAL 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MAL 1:1'")
		`
		true
describe "Localized book Matt (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Matt (hu)", ->
		`
		expect(p.parse("Mate 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mate 1:1'")
		expect(p.parse("Matt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matt 1:1'")
		expect(p.parse("Maté 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Maté 1:1'")
		expect(p.parse("Máte 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Máte 1:1'")
		expect(p.parse("Máté 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Máté 1:1'")
		expect(p.parse("Mt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MATE 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATE 1:1'")
		expect(p.parse("MATT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATT 1:1'")
		expect(p.parse("MATÉ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATÉ 1:1'")
		expect(p.parse("MÁTE 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MÁTE 1:1'")
		expect(p.parse("MÁTÉ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MÁTÉ 1:1'")
		expect(p.parse("MT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MT 1:1'")
		`
		true
describe "Localized book Mark (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Mark (hu)", ->
		`
		expect(p.parse("Mark 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mark 1:1'")
		expect(p.parse("Márk 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Márk 1:1'")
		expect(p.parse("Mk 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mk 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MARK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARK 1:1'")
		expect(p.parse("MÁRK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MÁRK 1:1'")
		expect(p.parse("MK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MK 1:1'")
		`
		true
describe "Localized book Luke (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Luke (hu)", ->
		`
		expect(p.parse("Lukacs 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukacs 1:1'")
		expect(p.parse("Lukács 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukács 1:1'")
		expect(p.parse("Luke 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luke 1:1'")
		expect(p.parse("Lk 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lk 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("LUKACS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKACS 1:1'")
		expect(p.parse("LUKÁCS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKÁCS 1:1'")
		expect(p.parse("LUKE 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKE 1:1'")
		expect(p.parse("LK 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LK 1:1'")
		`
		true
describe "Localized book 1John (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1John (hu)", ->
		`
		expect(p.parse("Elso Janos 1:1").osis()).toEqual("1John.1.1", "parsing: 'Elso Janos 1:1'")
		expect(p.parse("Elso János 1:1").osis()).toEqual("1John.1.1", "parsing: 'Elso János 1:1'")
		expect(p.parse("Első Janos 1:1").osis()).toEqual("1John.1.1", "parsing: 'Első Janos 1:1'")
		expect(p.parse("Első János 1:1").osis()).toEqual("1John.1.1", "parsing: 'Első János 1:1'")
		expect(p.parse("1. Janos 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Janos 1:1'")
		expect(p.parse("1. János 1:1").osis()).toEqual("1John.1.1", "parsing: '1. János 1:1'")
		expect(p.parse("I. Janos 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Janos 1:1'")
		expect(p.parse("I. János 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. János 1:1'")
		expect(p.parse("1 Janos 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Janos 1:1'")
		expect(p.parse("1 János 1:1").osis()).toEqual("1John.1.1", "parsing: '1 János 1:1'")
		expect(p.parse("Elso Jn 1:1").osis()).toEqual("1John.1.1", "parsing: 'Elso Jn 1:1'")
		expect(p.parse("Első Jn 1:1").osis()).toEqual("1John.1.1", "parsing: 'Első Jn 1:1'")
		expect(p.parse("I Janos 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Janos 1:1'")
		expect(p.parse("I János 1:1").osis()).toEqual("1John.1.1", "parsing: 'I János 1:1'")
		expect(p.parse("Janos I 1:1").osis()).toEqual("1John.1.1", "parsing: 'Janos I 1:1'")
		expect(p.parse("János I 1:1").osis()).toEqual("1John.1.1", "parsing: 'János I 1:1'")
		expect(p.parse("1. Jn 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Jn 1:1'")
		expect(p.parse("1John 1:1").osis()).toEqual("1John.1.1", "parsing: '1John 1:1'")
		expect(p.parse("I. Jn 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Jn 1:1'")
		expect(p.parse("1 Jn 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Jn 1:1'")
		expect(p.parse("I Jn 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO JANOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'ELSO JANOS 1:1'")
		expect(p.parse("ELSO JÁNOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'ELSO JÁNOS 1:1'")
		expect(p.parse("ELSŐ JANOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'ELSŐ JANOS 1:1'")
		expect(p.parse("ELSŐ JÁNOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'ELSŐ JÁNOS 1:1'")
		expect(p.parse("1. JANOS 1:1").osis()).toEqual("1John.1.1", "parsing: '1. JANOS 1:1'")
		expect(p.parse("1. JÁNOS 1:1").osis()).toEqual("1John.1.1", "parsing: '1. JÁNOS 1:1'")
		expect(p.parse("I. JANOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. JANOS 1:1'")
		expect(p.parse("I. JÁNOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. JÁNOS 1:1'")
		expect(p.parse("1 JANOS 1:1").osis()).toEqual("1John.1.1", "parsing: '1 JANOS 1:1'")
		expect(p.parse("1 JÁNOS 1:1").osis()).toEqual("1John.1.1", "parsing: '1 JÁNOS 1:1'")
		expect(p.parse("ELSO JN 1:1").osis()).toEqual("1John.1.1", "parsing: 'ELSO JN 1:1'")
		expect(p.parse("ELSŐ JN 1:1").osis()).toEqual("1John.1.1", "parsing: 'ELSŐ JN 1:1'")
		expect(p.parse("I JANOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'I JANOS 1:1'")
		expect(p.parse("I JÁNOS 1:1").osis()).toEqual("1John.1.1", "parsing: 'I JÁNOS 1:1'")
		expect(p.parse("JANOS I 1:1").osis()).toEqual("1John.1.1", "parsing: 'JANOS I 1:1'")
		expect(p.parse("JÁNOS I 1:1").osis()).toEqual("1John.1.1", "parsing: 'JÁNOS I 1:1'")
		expect(p.parse("1. JN 1:1").osis()).toEqual("1John.1.1", "parsing: '1. JN 1:1'")
		expect(p.parse("1JOHN 1:1").osis()).toEqual("1John.1.1", "parsing: '1JOHN 1:1'")
		expect(p.parse("I. JN 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. JN 1:1'")
		expect(p.parse("1 JN 1:1").osis()).toEqual("1John.1.1", "parsing: '1 JN 1:1'")
		expect(p.parse("I JN 1:1").osis()).toEqual("1John.1.1", "parsing: 'I JN 1:1'")
		`
		true
describe "Localized book 2John (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2John (hu)", ->
		`
		expect(p.parse("Masodik Janos 1:1").osis()).toEqual("2John.1.1", "parsing: 'Masodik Janos 1:1'")
		expect(p.parse("Masodik János 1:1").osis()).toEqual("2John.1.1", "parsing: 'Masodik János 1:1'")
		expect(p.parse("Második Janos 1:1").osis()).toEqual("2John.1.1", "parsing: 'Második Janos 1:1'")
		expect(p.parse("Második János 1:1").osis()).toEqual("2John.1.1", "parsing: 'Második János 1:1'")
		expect(p.parse("Masodik Jn 1:1").osis()).toEqual("2John.1.1", "parsing: 'Masodik Jn 1:1'")
		expect(p.parse("Második Jn 1:1").osis()).toEqual("2John.1.1", "parsing: 'Második Jn 1:1'")
		expect(p.parse("II. Janos 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Janos 1:1'")
		expect(p.parse("II. János 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. János 1:1'")
		expect(p.parse("2. Janos 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Janos 1:1'")
		expect(p.parse("2. János 1:1").osis()).toEqual("2John.1.1", "parsing: '2. János 1:1'")
		expect(p.parse("II Janos 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Janos 1:1'")
		expect(p.parse("II János 1:1").osis()).toEqual("2John.1.1", "parsing: 'II János 1:1'")
		expect(p.parse("Janos II 1:1").osis()).toEqual("2John.1.1", "parsing: 'Janos II 1:1'")
		expect(p.parse("János II 1:1").osis()).toEqual("2John.1.1", "parsing: 'János II 1:1'")
		expect(p.parse("2 Janos 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Janos 1:1'")
		expect(p.parse("2 János 1:1").osis()).toEqual("2John.1.1", "parsing: '2 János 1:1'")
		expect(p.parse("II. Jn 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Jn 1:1'")
		expect(p.parse("2. Jn 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Jn 1:1'")
		expect(p.parse("2John 1:1").osis()).toEqual("2John.1.1", "parsing: '2John 1:1'")
		expect(p.parse("II Jn 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Jn 1:1'")
		expect(p.parse("2 Jn 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK JANOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'MASODIK JANOS 1:1'")
		expect(p.parse("MASODIK JÁNOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'MASODIK JÁNOS 1:1'")
		expect(p.parse("MÁSODIK JANOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'MÁSODIK JANOS 1:1'")
		expect(p.parse("MÁSODIK JÁNOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'MÁSODIK JÁNOS 1:1'")
		expect(p.parse("MASODIK JN 1:1").osis()).toEqual("2John.1.1", "parsing: 'MASODIK JN 1:1'")
		expect(p.parse("MÁSODIK JN 1:1").osis()).toEqual("2John.1.1", "parsing: 'MÁSODIK JN 1:1'")
		expect(p.parse("II. JANOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. JANOS 1:1'")
		expect(p.parse("II. JÁNOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. JÁNOS 1:1'")
		expect(p.parse("2. JANOS 1:1").osis()).toEqual("2John.1.1", "parsing: '2. JANOS 1:1'")
		expect(p.parse("2. JÁNOS 1:1").osis()).toEqual("2John.1.1", "parsing: '2. JÁNOS 1:1'")
		expect(p.parse("II JANOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'II JANOS 1:1'")
		expect(p.parse("II JÁNOS 1:1").osis()).toEqual("2John.1.1", "parsing: 'II JÁNOS 1:1'")
		expect(p.parse("JANOS II 1:1").osis()).toEqual("2John.1.1", "parsing: 'JANOS II 1:1'")
		expect(p.parse("JÁNOS II 1:1").osis()).toEqual("2John.1.1", "parsing: 'JÁNOS II 1:1'")
		expect(p.parse("2 JANOS 1:1").osis()).toEqual("2John.1.1", "parsing: '2 JANOS 1:1'")
		expect(p.parse("2 JÁNOS 1:1").osis()).toEqual("2John.1.1", "parsing: '2 JÁNOS 1:1'")
		expect(p.parse("II. JN 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. JN 1:1'")
		expect(p.parse("2. JN 1:1").osis()).toEqual("2John.1.1", "parsing: '2. JN 1:1'")
		expect(p.parse("2JOHN 1:1").osis()).toEqual("2John.1.1", "parsing: '2JOHN 1:1'")
		expect(p.parse("II JN 1:1").osis()).toEqual("2John.1.1", "parsing: 'II JN 1:1'")
		expect(p.parse("2 JN 1:1").osis()).toEqual("2John.1.1", "parsing: '2 JN 1:1'")
		`
		true
describe "Localized book 3John (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 3John (hu)", ->
		`
		expect(p.parse("Harmadik Janos 1:1").osis()).toEqual("3John.1.1", "parsing: 'Harmadik Janos 1:1'")
		expect(p.parse("Harmadik János 1:1").osis()).toEqual("3John.1.1", "parsing: 'Harmadik János 1:1'")
		expect(p.parse("Harmadik Jn 1:1").osis()).toEqual("3John.1.1", "parsing: 'Harmadik Jn 1:1'")
		expect(p.parse("III. Janos 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Janos 1:1'")
		expect(p.parse("III. János 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. János 1:1'")
		expect(p.parse("III Janos 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Janos 1:1'")
		expect(p.parse("III János 1:1").osis()).toEqual("3John.1.1", "parsing: 'III János 1:1'")
		expect(p.parse("Janos III 1:1").osis()).toEqual("3John.1.1", "parsing: 'Janos III 1:1'")
		expect(p.parse("János III 1:1").osis()).toEqual("3John.1.1", "parsing: 'János III 1:1'")
		expect(p.parse("3. Janos 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Janos 1:1'")
		expect(p.parse("3. János 1:1").osis()).toEqual("3John.1.1", "parsing: '3. János 1:1'")
		expect(p.parse("3 Janos 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Janos 1:1'")
		expect(p.parse("3 János 1:1").osis()).toEqual("3John.1.1", "parsing: '3 János 1:1'")
		expect(p.parse("III. Jn 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Jn 1:1'")
		expect(p.parse("III Jn 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Jn 1:1'")
		expect(p.parse("3. Jn 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Jn 1:1'")
		expect(p.parse("3John 1:1").osis()).toEqual("3John.1.1", "parsing: '3John 1:1'")
		expect(p.parse("3 Jn 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HARMADIK JANOS 1:1").osis()).toEqual("3John.1.1", "parsing: 'HARMADIK JANOS 1:1'")
		expect(p.parse("HARMADIK JÁNOS 1:1").osis()).toEqual("3John.1.1", "parsing: 'HARMADIK JÁNOS 1:1'")
		expect(p.parse("HARMADIK JN 1:1").osis()).toEqual("3John.1.1", "parsing: 'HARMADIK JN 1:1'")
		expect(p.parse("III. JANOS 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. JANOS 1:1'")
		expect(p.parse("III. JÁNOS 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. JÁNOS 1:1'")
		expect(p.parse("III JANOS 1:1").osis()).toEqual("3John.1.1", "parsing: 'III JANOS 1:1'")
		expect(p.parse("III JÁNOS 1:1").osis()).toEqual("3John.1.1", "parsing: 'III JÁNOS 1:1'")
		expect(p.parse("JANOS III 1:1").osis()).toEqual("3John.1.1", "parsing: 'JANOS III 1:1'")
		expect(p.parse("JÁNOS III 1:1").osis()).toEqual("3John.1.1", "parsing: 'JÁNOS III 1:1'")
		expect(p.parse("3. JANOS 1:1").osis()).toEqual("3John.1.1", "parsing: '3. JANOS 1:1'")
		expect(p.parse("3. JÁNOS 1:1").osis()).toEqual("3John.1.1", "parsing: '3. JÁNOS 1:1'")
		expect(p.parse("3 JANOS 1:1").osis()).toEqual("3John.1.1", "parsing: '3 JANOS 1:1'")
		expect(p.parse("3 JÁNOS 1:1").osis()).toEqual("3John.1.1", "parsing: '3 JÁNOS 1:1'")
		expect(p.parse("III. JN 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. JN 1:1'")
		expect(p.parse("III JN 1:1").osis()).toEqual("3John.1.1", "parsing: 'III JN 1:1'")
		expect(p.parse("3. JN 1:1").osis()).toEqual("3John.1.1", "parsing: '3. JN 1:1'")
		expect(p.parse("3JOHN 1:1").osis()).toEqual("3John.1.1", "parsing: '3JOHN 1:1'")
		expect(p.parse("3 JN 1:1").osis()).toEqual("3John.1.1", "parsing: '3 JN 1:1'")
		`
		true
describe "Localized book John (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: John (hu)", ->
		`
		expect(p.parse("Janos 1:1").osis()).toEqual("John.1.1", "parsing: 'Janos 1:1'")
		expect(p.parse("János 1:1").osis()).toEqual("John.1.1", "parsing: 'János 1:1'")
		expect(p.parse("John 1:1").osis()).toEqual("John.1.1", "parsing: 'John 1:1'")
		expect(p.parse("Jn 1:1").osis()).toEqual("John.1.1", "parsing: 'Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JANOS 1:1").osis()).toEqual("John.1.1", "parsing: 'JANOS 1:1'")
		expect(p.parse("JÁNOS 1:1").osis()).toEqual("John.1.1", "parsing: 'JÁNOS 1:1'")
		expect(p.parse("JOHN 1:1").osis()).toEqual("John.1.1", "parsing: 'JOHN 1:1'")
		expect(p.parse("JN 1:1").osis()).toEqual("John.1.1", "parsing: 'JN 1:1'")
		`
		true
describe "Localized book Acts (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Acts (hu)", ->
		`
		expect(p.parse("Az apostolok cselekedetei 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Az apostolok cselekedetei 1:1'")
		expect(p.parse("Apostolok cselekedetei 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Apostolok cselekedetei 1:1'")
		expect(p.parse("Cselekedetek 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Cselekedetek 1:1'")
		expect(p.parse("Apostolok 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Apostolok 1:1'")
		expect(p.parse("Az ApCsel 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Az ApCsel 1:1'")
		expect(p.parse("Ap. Csel 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Ap. Csel 1:1'")
		expect(p.parse("Ap Csel 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Ap Csel 1:1'")
		expect(p.parse("ApCsel 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ApCsel 1:1'")
		expect(p.parse("Acts 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Acts 1:1'")
		expect(p.parse("Apcs 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Apcs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("AZ APOSTOLOK CSELEKEDETEI 1:1").osis()).toEqual("Acts.1.1", "parsing: 'AZ APOSTOLOK CSELEKEDETEI 1:1'")
		expect(p.parse("APOSTOLOK CSELEKEDETEI 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APOSTOLOK CSELEKEDETEI 1:1'")
		expect(p.parse("CSELEKEDETEK 1:1").osis()).toEqual("Acts.1.1", "parsing: 'CSELEKEDETEK 1:1'")
		expect(p.parse("APOSTOLOK 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APOSTOLOK 1:1'")
		expect(p.parse("AZ APCSEL 1:1").osis()).toEqual("Acts.1.1", "parsing: 'AZ APCSEL 1:1'")
		expect(p.parse("AP. CSEL 1:1").osis()).toEqual("Acts.1.1", "parsing: 'AP. CSEL 1:1'")
		expect(p.parse("AP CSEL 1:1").osis()).toEqual("Acts.1.1", "parsing: 'AP CSEL 1:1'")
		expect(p.parse("APCSEL 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APCSEL 1:1'")
		expect(p.parse("ACTS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ACTS 1:1'")
		expect(p.parse("APCS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APCS 1:1'")
		`
		true
describe "Localized book Rom (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Rom (hu)", ->
		`
		expect(p.parse("Romaiakhoz 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Romaiakhoz 1:1'")
		expect(p.parse("Rómaiakhoz 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rómaiakhoz 1:1'")
		expect(p.parse("Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Roma 1:1'")
		expect(p.parse("Róma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Róma 1:1'")
		expect(p.parse("Rom 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rom 1:1'")
		expect(p.parse("Róm 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Róm 1:1'")
		expect(p.parse("Rm 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rm 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ROMAIAKHOZ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROMAIAKHOZ 1:1'")
		expect(p.parse("RÓMAIAKHOZ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'RÓMAIAKHOZ 1:1'")
		expect(p.parse("ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROMA 1:1'")
		expect(p.parse("RÓMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'RÓMA 1:1'")
		expect(p.parse("ROM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROM 1:1'")
		expect(p.parse("RÓM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'RÓM 1:1'")
		expect(p.parse("RM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'RM 1:1'")
		`
		true
describe "Localized book 2Cor (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Cor (hu)", ->
		`
		expect(p.parse("Masodik Korinthusiakhoz 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Masodik Korinthusiakhoz 1:1'")
		expect(p.parse("Második Korinthusiakhoz 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Második Korinthusiakhoz 1:1'")
		expect(p.parse("II. Korinthusiakhoz 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Korinthusiakhoz 1:1'")
		expect(p.parse("2. Korinthusiakhoz 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Korinthusiakhoz 1:1'")
		expect(p.parse("II Korinthusiakhoz 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Korinthusiakhoz 1:1'")
		expect(p.parse("2 Korinthusiakhoz 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Korinthusiakhoz 1:1'")
		expect(p.parse("Masodik Korinthus 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Masodik Korinthus 1:1'")
		expect(p.parse("Masodik Korintusi 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Masodik Korintusi 1:1'")
		expect(p.parse("Második Korinthus 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Második Korinthus 1:1'")
		expect(p.parse("Második Korintusi 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Második Korintusi 1:1'")
		expect(p.parse("II. Korinthus 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Korinthus 1:1'")
		expect(p.parse("II. Korintusi 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Korintusi 1:1'")
		expect(p.parse("2. Korinthus 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Korinthus 1:1'")
		expect(p.parse("2. Korintusi 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Korintusi 1:1'")
		expect(p.parse("II Korinthus 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Korinthus 1:1'")
		expect(p.parse("II Korintusi 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Korintusi 1:1'")
		expect(p.parse("2 Korinthus 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Korinthus 1:1'")
		expect(p.parse("2 Korintusi 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Korintusi 1:1'")
		expect(p.parse("Masodik Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Masodik Kor 1:1'")
		expect(p.parse("Második Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Második Kor 1:1'")
		expect(p.parse("II. Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Kor 1:1'")
		expect(p.parse("2. Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Kor 1:1'")
		expect(p.parse("II Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Kor 1:1'")
		expect(p.parse("2 Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Kor 1:1'")
		expect(p.parse("2Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK KORINTHUSIAKHOZ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MASODIK KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("MÁSODIK KORINTHUSIAKHOZ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MÁSODIK KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("II. KORINTHUSIAKHOZ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("2. KORINTHUSIAKHOZ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("II KORINTHUSIAKHOZ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("2 KORINTHUSIAKHOZ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("MASODIK KORINTHUS 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MASODIK KORINTHUS 1:1'")
		expect(p.parse("MASODIK KORINTUSI 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MASODIK KORINTUSI 1:1'")
		expect(p.parse("MÁSODIK KORINTHUS 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MÁSODIK KORINTHUS 1:1'")
		expect(p.parse("MÁSODIK KORINTUSI 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MÁSODIK KORINTUSI 1:1'")
		expect(p.parse("II. KORINTHUS 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KORINTHUS 1:1'")
		expect(p.parse("II. KORINTUSI 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KORINTUSI 1:1'")
		expect(p.parse("2. KORINTHUS 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KORINTHUS 1:1'")
		expect(p.parse("2. KORINTUSI 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KORINTUSI 1:1'")
		expect(p.parse("II KORINTHUS 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KORINTHUS 1:1'")
		expect(p.parse("II KORINTUSI 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KORINTUSI 1:1'")
		expect(p.parse("2 KORINTHUS 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KORINTHUS 1:1'")
		expect(p.parse("2 KORINTUSI 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KORINTUSI 1:1'")
		expect(p.parse("MASODIK KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MASODIK KOR 1:1'")
		expect(p.parse("MÁSODIK KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'MÁSODIK KOR 1:1'")
		expect(p.parse("II. KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KOR 1:1'")
		expect(p.parse("2. KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KOR 1:1'")
		expect(p.parse("II KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KOR 1:1'")
		expect(p.parse("2 KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KOR 1:1'")
		expect(p.parse("2COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2COR 1:1'")
		`
		true
describe "Localized book 1Cor (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Cor (hu)", ->
		`
		expect(p.parse("Elso Korinthusiakhoz 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Elso Korinthusiakhoz 1:1'")
		expect(p.parse("Első Korinthusiakhoz 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Első Korinthusiakhoz 1:1'")
		expect(p.parse("1. Korinthusiakhoz 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Korinthusiakhoz 1:1'")
		expect(p.parse("I. Korinthusiakhoz 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Korinthusiakhoz 1:1'")
		expect(p.parse("1 Korinthusiakhoz 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Korinthusiakhoz 1:1'")
		expect(p.parse("I Korinthusiakhoz 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Korinthusiakhoz 1:1'")
		expect(p.parse("Elso Korinthus 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Elso Korinthus 1:1'")
		expect(p.parse("Elso Korintusi 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Elso Korintusi 1:1'")
		expect(p.parse("Első Korinthus 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Első Korinthus 1:1'")
		expect(p.parse("Első Korintusi 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Első Korintusi 1:1'")
		expect(p.parse("1. Korinthus 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Korinthus 1:1'")
		expect(p.parse("1. Korintusi 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Korintusi 1:1'")
		expect(p.parse("I. Korinthus 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Korinthus 1:1'")
		expect(p.parse("I. Korintusi 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Korintusi 1:1'")
		expect(p.parse("1 Korinthus 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Korinthus 1:1'")
		expect(p.parse("1 Korintusi 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Korintusi 1:1'")
		expect(p.parse("I Korinthus 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Korinthus 1:1'")
		expect(p.parse("I Korintusi 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Korintusi 1:1'")
		expect(p.parse("Elso Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Elso Kor 1:1'")
		expect(p.parse("Első Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Első Kor 1:1'")
		expect(p.parse("1. Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Kor 1:1'")
		expect(p.parse("I. Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Kor 1:1'")
		expect(p.parse("1 Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Kor 1:1'")
		expect(p.parse("I Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Kor 1:1'")
		expect(p.parse("1Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO KORINTHUSIAKHOZ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSO KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("ELSŐ KORINTHUSIAKHOZ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSŐ KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("1. KORINTHUSIAKHOZ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("I. KORINTHUSIAKHOZ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("1 KORINTHUSIAKHOZ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("I KORINTHUSIAKHOZ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KORINTHUSIAKHOZ 1:1'")
		expect(p.parse("ELSO KORINTHUS 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSO KORINTHUS 1:1'")
		expect(p.parse("ELSO KORINTUSI 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSO KORINTUSI 1:1'")
		expect(p.parse("ELSŐ KORINTHUS 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSŐ KORINTHUS 1:1'")
		expect(p.parse("ELSŐ KORINTUSI 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSŐ KORINTUSI 1:1'")
		expect(p.parse("1. KORINTHUS 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KORINTHUS 1:1'")
		expect(p.parse("1. KORINTUSI 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KORINTUSI 1:1'")
		expect(p.parse("I. KORINTHUS 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KORINTHUS 1:1'")
		expect(p.parse("I. KORINTUSI 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KORINTUSI 1:1'")
		expect(p.parse("1 KORINTHUS 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KORINTHUS 1:1'")
		expect(p.parse("1 KORINTUSI 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KORINTUSI 1:1'")
		expect(p.parse("I KORINTHUS 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KORINTHUS 1:1'")
		expect(p.parse("I KORINTUSI 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KORINTUSI 1:1'")
		expect(p.parse("ELSO KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSO KOR 1:1'")
		expect(p.parse("ELSŐ KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ELSŐ KOR 1:1'")
		expect(p.parse("1. KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KOR 1:1'")
		expect(p.parse("I. KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KOR 1:1'")
		expect(p.parse("1 KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KOR 1:1'")
		expect(p.parse("I KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KOR 1:1'")
		expect(p.parse("1COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1COR 1:1'")
		`
		true
describe "Localized book Gal (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Gal (hu)", ->
		`
		expect(p.parse("Galatakhoz 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Galatakhoz 1:1'")
		expect(p.parse("Galatákhoz 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Galatákhoz 1:1'")
		expect(p.parse("Galata 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Galata 1:1'")
		expect(p.parse("Gal 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Gal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("GALATAKHOZ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GALATAKHOZ 1:1'")
		expect(p.parse("GALATÁKHOZ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GALATÁKHOZ 1:1'")
		expect(p.parse("GALATA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GALATA 1:1'")
		expect(p.parse("GAL 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GAL 1:1'")
		`
		true
describe "Localized book Eph (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Eph (hu)", ->
		`
		expect(p.parse("Epheszosziakhoz 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epheszosziakhoz 1:1'")
		expect(p.parse("Efezusiakhoz 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Efezusiakhoz 1:1'")
		expect(p.parse("Efézusiakhoz 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Efézusiakhoz 1:1'")
		expect(p.parse("Efezus 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Efezus 1:1'")
		expect(p.parse("Eph 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Eph 1:1'")
		expect(p.parse("Ef 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Ef 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EPHESZOSZIAKHOZ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPHESZOSZIAKHOZ 1:1'")
		expect(p.parse("EFEZUSIAKHOZ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EFEZUSIAKHOZ 1:1'")
		expect(p.parse("EFÉZUSIAKHOZ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EFÉZUSIAKHOZ 1:1'")
		expect(p.parse("EFEZUS 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EFEZUS 1:1'")
		expect(p.parse("EPH 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPH 1:1'")
		expect(p.parse("EF 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EF 1:1'")
		`
		true
describe "Localized book Phil (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Phil (hu)", ->
		`
		expect(p.parse("Philippibeliekhez 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Philippibeliekhez 1:1'")
		expect(p.parse("Filippiekhez 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Filippiekhez 1:1'")
		expect(p.parse("Flippiekhez 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Flippiekhez 1:1'")
		expect(p.parse("Filippi 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Filippi 1:1'")
		expect(p.parse("Phil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Phil 1:1'")
		expect(p.parse("Fil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Fil 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PHILIPPIBELIEKHEZ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHILIPPIBELIEKHEZ 1:1'")
		expect(p.parse("FILIPPIEKHEZ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FILIPPIEKHEZ 1:1'")
		expect(p.parse("FLIPPIEKHEZ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FLIPPIEKHEZ 1:1'")
		expect(p.parse("FILIPPI 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FILIPPI 1:1'")
		expect(p.parse("PHIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHIL 1:1'")
		expect(p.parse("FIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FIL 1:1'")
		`
		true
describe "Localized book Col (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Col (hu)", ->
		`
		expect(p.parse("Kolosszebeliekhez 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosszebeliekhez 1:1'")
		expect(p.parse("Kolosszébeliekhez 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosszébeliekhez 1:1'")
		expect(p.parse("Kolosszeieknek 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosszeieknek 1:1'")
		expect(p.parse("Kolosseiakhoz 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosseiakhoz 1:1'")
		expect(p.parse("Kolosséiakhoz 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosséiakhoz 1:1'")
		expect(p.parse("Kolosse 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosse 1:1'")
		expect(p.parse("Kolossé 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolossé 1:1'")
		expect(p.parse("Col 1:1").osis()).toEqual("Col.1.1", "parsing: 'Col 1:1'")
		expect(p.parse("Kol 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kol 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KOLOSSZEBELIEKHEZ 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSZEBELIEKHEZ 1:1'")
		expect(p.parse("KOLOSSZÉBELIEKHEZ 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSZÉBELIEKHEZ 1:1'")
		expect(p.parse("KOLOSSZEIEKNEK 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSZEIEKNEK 1:1'")
		expect(p.parse("KOLOSSEIAKHOZ 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSEIAKHOZ 1:1'")
		expect(p.parse("KOLOSSÉIAKHOZ 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSÉIAKHOZ 1:1'")
		expect(p.parse("KOLOSSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSE 1:1'")
		expect(p.parse("KOLOSSÉ 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSSÉ 1:1'")
		expect(p.parse("COL 1:1").osis()).toEqual("Col.1.1", "parsing: 'COL 1:1'")
		expect(p.parse("KOL 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOL 1:1'")
		`
		true
describe "Localized book 2Thess (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Thess (hu)", ->
		`
		expect(p.parse("Masodik Thesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Masodik Thesszalonikaiakhoz 1:1'")
		expect(p.parse("Második Thesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Második Thesszalonikaiakhoz 1:1'")
		expect(p.parse("Masodik Tesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Masodik Tesszalonikaiakhoz 1:1'")
		expect(p.parse("Második Tesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Második Tesszalonikaiakhoz 1:1'")
		expect(p.parse("II. Thesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Thesszalonikaiakhoz 1:1'")
		expect(p.parse("2. Thesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Thesszalonikaiakhoz 1:1'")
		expect(p.parse("II Thesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Thesszalonikaiakhoz 1:1'")
		expect(p.parse("II. Tesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tesszalonikaiakhoz 1:1'")
		expect(p.parse("2 Thesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Thesszalonikaiakhoz 1:1'")
		expect(p.parse("2. Tesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tesszalonikaiakhoz 1:1'")
		expect(p.parse("II Tesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tesszalonikaiakhoz 1:1'")
		expect(p.parse("Masodik Thesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Masodik Thesszalonika 1:1'")
		expect(p.parse("Második Thesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Második Thesszalonika 1:1'")
		expect(p.parse("2 Tesszalonikaiakhoz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tesszalonikaiakhoz 1:1'")
		expect(p.parse("Masodik Tesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Masodik Tesszalonika 1:1'")
		expect(p.parse("Második Tesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Második Tesszalonika 1:1'")
		expect(p.parse("II. Thesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Thesszalonika 1:1'")
		expect(p.parse("2. Thesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Thesszalonika 1:1'")
		expect(p.parse("II Thesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Thesszalonika 1:1'")
		expect(p.parse("II. Tesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tesszalonika 1:1'")
		expect(p.parse("2 Thesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Thesszalonika 1:1'")
		expect(p.parse("2. Tesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tesszalonika 1:1'")
		expect(p.parse("II Tesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tesszalonika 1:1'")
		expect(p.parse("2 Tesszalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tesszalonika 1:1'")
		expect(p.parse("Masodik Thessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Masodik Thessz 1:1'")
		expect(p.parse("Második Thessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Második Thessz 1:1'")
		expect(p.parse("Masodik Tessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Masodik Tessz 1:1'")
		expect(p.parse("Második Tessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Második Tessz 1:1'")
		expect(p.parse("II. Thessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Thessz 1:1'")
		expect(p.parse("2. Thessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Thessz 1:1'")
		expect(p.parse("II Thessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Thessz 1:1'")
		expect(p.parse("II. Tessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tessz 1:1'")
		expect(p.parse("2 Thessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Thessz 1:1'")
		expect(p.parse("2. Tessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tessz 1:1'")
		expect(p.parse("II Tessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tessz 1:1'")
		expect(p.parse("2 Tessz 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tessz 1:1'")
		expect(p.parse("2Thess 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2Thess 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MASODIK THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("MÁSODIK THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MÁSODIK THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("MASODIK TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MASODIK TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("MÁSODIK TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MÁSODIK TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("II. THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("2. THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("II THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("II. TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("2 THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("2. TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("II TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("MASODIK THESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MASODIK THESSZALONIKA 1:1'")
		expect(p.parse("MÁSODIK THESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MÁSODIK THESSZALONIKA 1:1'")
		expect(p.parse("2 TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("MASODIK TESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MASODIK TESSZALONIKA 1:1'")
		expect(p.parse("MÁSODIK TESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MÁSODIK TESSZALONIKA 1:1'")
		expect(p.parse("II. THESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. THESSZALONIKA 1:1'")
		expect(p.parse("2. THESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. THESSZALONIKA 1:1'")
		expect(p.parse("II THESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II THESSZALONIKA 1:1'")
		expect(p.parse("II. TESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESSZALONIKA 1:1'")
		expect(p.parse("2 THESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 THESSZALONIKA 1:1'")
		expect(p.parse("2. TESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESSZALONIKA 1:1'")
		expect(p.parse("II TESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESSZALONIKA 1:1'")
		expect(p.parse("2 TESSZALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESSZALONIKA 1:1'")
		expect(p.parse("MASODIK THESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MASODIK THESSZ 1:1'")
		expect(p.parse("MÁSODIK THESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MÁSODIK THESSZ 1:1'")
		expect(p.parse("MASODIK TESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MASODIK TESSZ 1:1'")
		expect(p.parse("MÁSODIK TESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'MÁSODIK TESSZ 1:1'")
		expect(p.parse("II. THESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. THESSZ 1:1'")
		expect(p.parse("2. THESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. THESSZ 1:1'")
		expect(p.parse("II THESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II THESSZ 1:1'")
		expect(p.parse("II. TESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESSZ 1:1'")
		expect(p.parse("2 THESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 THESSZ 1:1'")
		expect(p.parse("2. TESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESSZ 1:1'")
		expect(p.parse("II TESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESSZ 1:1'")
		expect(p.parse("2 TESSZ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESSZ 1:1'")
		expect(p.parse("2THESS 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2THESS 1:1'")
		`
		true
describe "Localized book 1Thess (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Thess (hu)", ->
		`
		expect(p.parse("Elso Thesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Elso Thesszalonikaiakhoz 1:1'")
		expect(p.parse("Első Thesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Első Thesszalonikaiakhoz 1:1'")
		expect(p.parse("Elso Tesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Elso Tesszalonikaiakhoz 1:1'")
		expect(p.parse("Első Tesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Első Tesszalonikaiakhoz 1:1'")
		expect(p.parse("1. Thesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Thesszalonikaiakhoz 1:1'")
		expect(p.parse("I. Thesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Thesszalonikaiakhoz 1:1'")
		expect(p.parse("1 Thesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Thesszalonikaiakhoz 1:1'")
		expect(p.parse("1. Tesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tesszalonikaiakhoz 1:1'")
		expect(p.parse("I Thesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Thesszalonikaiakhoz 1:1'")
		expect(p.parse("I. Tesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tesszalonikaiakhoz 1:1'")
		expect(p.parse("1 Tesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tesszalonikaiakhoz 1:1'")
		expect(p.parse("I Tesszalonikaiakhoz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tesszalonikaiakhoz 1:1'")
		expect(p.parse("Elso Thesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Elso Thesszalonika 1:1'")
		expect(p.parse("Első Thesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Első Thesszalonika 1:1'")
		expect(p.parse("Elso Tesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Elso Tesszalonika 1:1'")
		expect(p.parse("Első Tesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Első Tesszalonika 1:1'")
		expect(p.parse("1. Thesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Thesszalonika 1:1'")
		expect(p.parse("I. Thesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Thesszalonika 1:1'")
		expect(p.parse("1 Thesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Thesszalonika 1:1'")
		expect(p.parse("1. Tesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tesszalonika 1:1'")
		expect(p.parse("I Thesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Thesszalonika 1:1'")
		expect(p.parse("I. Tesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tesszalonika 1:1'")
		expect(p.parse("1 Tesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tesszalonika 1:1'")
		expect(p.parse("I Tesszalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tesszalonika 1:1'")
		expect(p.parse("Elso Thessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Elso Thessz 1:1'")
		expect(p.parse("Első Thessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Első Thessz 1:1'")
		expect(p.parse("Elso Tessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Elso Tessz 1:1'")
		expect(p.parse("Első Tessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Első Tessz 1:1'")
		expect(p.parse("1. Thessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Thessz 1:1'")
		expect(p.parse("I. Thessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Thessz 1:1'")
		expect(p.parse("1 Thessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Thessz 1:1'")
		expect(p.parse("1. Tessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tessz 1:1'")
		expect(p.parse("I Thessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Thessz 1:1'")
		expect(p.parse("I. Tessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tessz 1:1'")
		expect(p.parse("1 Tessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tessz 1:1'")
		expect(p.parse("I Tessz 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tessz 1:1'")
		expect(p.parse("1Thess 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1Thess 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSO THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("ELSŐ THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSŐ THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("ELSO TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSO TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("ELSŐ TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSŐ TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("1. THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("I. THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("1 THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("1. TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("I THESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I THESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("I. TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("1 TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("I TESSZALONIKAIAKHOZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESSZALONIKAIAKHOZ 1:1'")
		expect(p.parse("ELSO THESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSO THESSZALONIKA 1:1'")
		expect(p.parse("ELSŐ THESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSŐ THESSZALONIKA 1:1'")
		expect(p.parse("ELSO TESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSO TESSZALONIKA 1:1'")
		expect(p.parse("ELSŐ TESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSŐ TESSZALONIKA 1:1'")
		expect(p.parse("1. THESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. THESSZALONIKA 1:1'")
		expect(p.parse("I. THESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. THESSZALONIKA 1:1'")
		expect(p.parse("1 THESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 THESSZALONIKA 1:1'")
		expect(p.parse("1. TESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESSZALONIKA 1:1'")
		expect(p.parse("I THESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I THESSZALONIKA 1:1'")
		expect(p.parse("I. TESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESSZALONIKA 1:1'")
		expect(p.parse("1 TESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESSZALONIKA 1:1'")
		expect(p.parse("I TESSZALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESSZALONIKA 1:1'")
		expect(p.parse("ELSO THESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSO THESSZ 1:1'")
		expect(p.parse("ELSŐ THESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSŐ THESSZ 1:1'")
		expect(p.parse("ELSO TESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSO TESSZ 1:1'")
		expect(p.parse("ELSŐ TESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ELSŐ TESSZ 1:1'")
		expect(p.parse("1. THESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. THESSZ 1:1'")
		expect(p.parse("I. THESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. THESSZ 1:1'")
		expect(p.parse("1 THESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 THESSZ 1:1'")
		expect(p.parse("1. TESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESSZ 1:1'")
		expect(p.parse("I THESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I THESSZ 1:1'")
		expect(p.parse("I. TESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESSZ 1:1'")
		expect(p.parse("1 TESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESSZ 1:1'")
		expect(p.parse("I TESSZ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESSZ 1:1'")
		expect(p.parse("1THESS 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1THESS 1:1'")
		`
		true
describe "Localized book 2Tim (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Tim (hu)", ->
		`
		expect(p.parse("Masodik Timoteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timoteushoz 1:1'")
		expect(p.parse("Masodik Timoteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timoteusnak 1:1'")
		expect(p.parse("Masodik Timóteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timóteushoz 1:1'")
		expect(p.parse("Masodik Timóteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timóteusnak 1:1'")
		expect(p.parse("Második Timoteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timoteushoz 1:1'")
		expect(p.parse("Második Timoteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timoteusnak 1:1'")
		expect(p.parse("Második Timóteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timóteushoz 1:1'")
		expect(p.parse("Második Timóteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timóteusnak 1:1'")
		expect(p.parse("Masodik Timotheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timotheosz 1:1'")
		expect(p.parse("Masodik Timótheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timótheosz 1:1'")
		expect(p.parse("Második Timotheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timotheosz 1:1'")
		expect(p.parse("Második Timótheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timótheosz 1:1'")
		expect(p.parse("Masodik Timoteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timoteus 1:1'")
		expect(p.parse("Masodik Timóteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Timóteus 1:1'")
		expect(p.parse("Második Timoteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timoteus 1:1'")
		expect(p.parse("Második Timóteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Timóteus 1:1'")
		expect(p.parse("II. Timoteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timoteushoz 1:1'")
		expect(p.parse("II. Timoteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timoteusnak 1:1'")
		expect(p.parse("II. Timóteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timóteushoz 1:1'")
		expect(p.parse("II. Timóteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timóteusnak 1:1'")
		expect(p.parse("2. Timoteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timoteushoz 1:1'")
		expect(p.parse("2. Timoteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timoteusnak 1:1'")
		expect(p.parse("2. Timóteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timóteushoz 1:1'")
		expect(p.parse("2. Timóteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timóteusnak 1:1'")
		expect(p.parse("II Timoteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timoteushoz 1:1'")
		expect(p.parse("II Timoteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timoteusnak 1:1'")
		expect(p.parse("II Timóteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timóteushoz 1:1'")
		expect(p.parse("II Timóteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timóteusnak 1:1'")
		expect(p.parse("II. Timotheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timotheosz 1:1'")
		expect(p.parse("II. Timótheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timótheosz 1:1'")
		expect(p.parse("2 Timoteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timoteushoz 1:1'")
		expect(p.parse("2 Timoteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timoteusnak 1:1'")
		expect(p.parse("2 Timóteushoz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timóteushoz 1:1'")
		expect(p.parse("2 Timóteusnak 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timóteusnak 1:1'")
		expect(p.parse("2. Timotheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timotheosz 1:1'")
		expect(p.parse("2. Timótheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timótheosz 1:1'")
		expect(p.parse("II Timotheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timotheosz 1:1'")
		expect(p.parse("II Timótheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timótheosz 1:1'")
		expect(p.parse("2 Timotheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timotheosz 1:1'")
		expect(p.parse("2 Timótheosz 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timótheosz 1:1'")
		expect(p.parse("II. Timoteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timoteus 1:1'")
		expect(p.parse("II. Timóteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timóteus 1:1'")
		expect(p.parse("2. Timoteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timoteus 1:1'")
		expect(p.parse("2. Timóteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timóteus 1:1'")
		expect(p.parse("II Timoteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timoteus 1:1'")
		expect(p.parse("II Timóteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timóteus 1:1'")
		expect(p.parse("Masodik Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Masodik Tim 1:1'")
		expect(p.parse("Második Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Második Tim 1:1'")
		expect(p.parse("2 Timoteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timoteus 1:1'")
		expect(p.parse("2 Timóteus 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timóteus 1:1'")
		expect(p.parse("II. Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Tim 1:1'")
		expect(p.parse("2. Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Tim 1:1'")
		expect(p.parse("II Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Tim 1:1'")
		expect(p.parse("2 Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tim 1:1'")
		expect(p.parse("2Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK TIMOTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMOTEUSHOZ 1:1'")
		expect(p.parse("MASODIK TIMOTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMOTEUSNAK 1:1'")
		expect(p.parse("MASODIK TIMÓTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMÓTEUSHOZ 1:1'")
		expect(p.parse("MASODIK TIMÓTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMÓTEUSNAK 1:1'")
		expect(p.parse("MÁSODIK TIMOTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMOTEUSHOZ 1:1'")
		expect(p.parse("MÁSODIK TIMOTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMOTEUSNAK 1:1'")
		expect(p.parse("MÁSODIK TIMÓTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMÓTEUSHOZ 1:1'")
		expect(p.parse("MÁSODIK TIMÓTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMÓTEUSNAK 1:1'")
		expect(p.parse("MASODIK TIMOTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMOTHEOSZ 1:1'")
		expect(p.parse("MASODIK TIMÓTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMÓTHEOSZ 1:1'")
		expect(p.parse("MÁSODIK TIMOTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMOTHEOSZ 1:1'")
		expect(p.parse("MÁSODIK TIMÓTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMÓTHEOSZ 1:1'")
		expect(p.parse("MASODIK TIMOTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMOTEUS 1:1'")
		expect(p.parse("MASODIK TIMÓTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIMÓTEUS 1:1'")
		expect(p.parse("MÁSODIK TIMOTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMOTEUS 1:1'")
		expect(p.parse("MÁSODIK TIMÓTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIMÓTEUS 1:1'")
		expect(p.parse("II. TIMOTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMOTEUSHOZ 1:1'")
		expect(p.parse("II. TIMOTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMOTEUSNAK 1:1'")
		expect(p.parse("II. TIMÓTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMÓTEUSHOZ 1:1'")
		expect(p.parse("II. TIMÓTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMÓTEUSNAK 1:1'")
		expect(p.parse("2. TIMOTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMOTEUSHOZ 1:1'")
		expect(p.parse("2. TIMOTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMOTEUSNAK 1:1'")
		expect(p.parse("2. TIMÓTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMÓTEUSHOZ 1:1'")
		expect(p.parse("2. TIMÓTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMÓTEUSNAK 1:1'")
		expect(p.parse("II TIMOTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMOTEUSHOZ 1:1'")
		expect(p.parse("II TIMOTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMOTEUSNAK 1:1'")
		expect(p.parse("II TIMÓTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMÓTEUSHOZ 1:1'")
		expect(p.parse("II TIMÓTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMÓTEUSNAK 1:1'")
		expect(p.parse("II. TIMOTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMOTHEOSZ 1:1'")
		expect(p.parse("II. TIMÓTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMÓTHEOSZ 1:1'")
		expect(p.parse("2 TIMOTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTEUSHOZ 1:1'")
		expect(p.parse("2 TIMOTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTEUSNAK 1:1'")
		expect(p.parse("2 TIMÓTEUSHOZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMÓTEUSHOZ 1:1'")
		expect(p.parse("2 TIMÓTEUSNAK 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMÓTEUSNAK 1:1'")
		expect(p.parse("2. TIMOTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMOTHEOSZ 1:1'")
		expect(p.parse("2. TIMÓTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMÓTHEOSZ 1:1'")
		expect(p.parse("II TIMOTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMOTHEOSZ 1:1'")
		expect(p.parse("II TIMÓTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMÓTHEOSZ 1:1'")
		expect(p.parse("2 TIMOTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTHEOSZ 1:1'")
		expect(p.parse("2 TIMÓTHEOSZ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMÓTHEOSZ 1:1'")
		expect(p.parse("II. TIMOTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMOTEUS 1:1'")
		expect(p.parse("II. TIMÓTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMÓTEUS 1:1'")
		expect(p.parse("2. TIMOTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMOTEUS 1:1'")
		expect(p.parse("2. TIMÓTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMÓTEUS 1:1'")
		expect(p.parse("II TIMOTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMOTEUS 1:1'")
		expect(p.parse("II TIMÓTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMÓTEUS 1:1'")
		expect(p.parse("MASODIK TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MASODIK TIM 1:1'")
		expect(p.parse("MÁSODIK TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'MÁSODIK TIM 1:1'")
		expect(p.parse("2 TIMOTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTEUS 1:1'")
		expect(p.parse("2 TIMÓTEUS 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMÓTEUS 1:1'")
		expect(p.parse("II. TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIM 1:1'")
		expect(p.parse("2. TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIM 1:1'")
		expect(p.parse("II TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIM 1:1'")
		expect(p.parse("2 TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIM 1:1'")
		expect(p.parse("2TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2TIM 1:1'")
		`
		true
describe "Localized book 1Tim (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Tim (hu)", ->
		`
		expect(p.parse("Elso Timoteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timoteushoz 1:1'")
		expect(p.parse("Elso Timoteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timoteusnak 1:1'")
		expect(p.parse("Elso Timóteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timóteushoz 1:1'")
		expect(p.parse("Elso Timóteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timóteusnak 1:1'")
		expect(p.parse("Első Timoteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timoteushoz 1:1'")
		expect(p.parse("Első Timoteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timoteusnak 1:1'")
		expect(p.parse("Első Timóteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timóteushoz 1:1'")
		expect(p.parse("Első Timóteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timóteusnak 1:1'")
		expect(p.parse("Elso Timotheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timotheosz 1:1'")
		expect(p.parse("Elso Timótheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timótheosz 1:1'")
		expect(p.parse("Első Timotheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timotheosz 1:1'")
		expect(p.parse("Első Timótheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timótheosz 1:1'")
		expect(p.parse("1. Timoteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timoteushoz 1:1'")
		expect(p.parse("1. Timoteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timoteusnak 1:1'")
		expect(p.parse("1. Timóteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timóteushoz 1:1'")
		expect(p.parse("1. Timóteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timóteusnak 1:1'")
		expect(p.parse("I. Timoteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timoteushoz 1:1'")
		expect(p.parse("I. Timoteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timoteusnak 1:1'")
		expect(p.parse("I. Timóteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timóteushoz 1:1'")
		expect(p.parse("I. Timóteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timóteusnak 1:1'")
		expect(p.parse("1 Timoteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timoteushoz 1:1'")
		expect(p.parse("1 Timoteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timoteusnak 1:1'")
		expect(p.parse("1 Timóteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timóteushoz 1:1'")
		expect(p.parse("1 Timóteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timóteusnak 1:1'")
		expect(p.parse("1. Timotheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timotheosz 1:1'")
		expect(p.parse("1. Timótheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timótheosz 1:1'")
		expect(p.parse("Elso Timoteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timoteus 1:1'")
		expect(p.parse("Elso Timóteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Timóteus 1:1'")
		expect(p.parse("Első Timoteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timoteus 1:1'")
		expect(p.parse("Első Timóteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Timóteus 1:1'")
		expect(p.parse("I Timoteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timoteushoz 1:1'")
		expect(p.parse("I Timoteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timoteusnak 1:1'")
		expect(p.parse("I Timóteushoz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timóteushoz 1:1'")
		expect(p.parse("I Timóteusnak 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timóteusnak 1:1'")
		expect(p.parse("I. Timotheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timotheosz 1:1'")
		expect(p.parse("I. Timótheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timótheosz 1:1'")
		expect(p.parse("1 Timotheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timotheosz 1:1'")
		expect(p.parse("1 Timótheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timótheosz 1:1'")
		expect(p.parse("I Timotheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timotheosz 1:1'")
		expect(p.parse("I Timótheosz 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timótheosz 1:1'")
		expect(p.parse("1. Timoteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timoteus 1:1'")
		expect(p.parse("1. Timóteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timóteus 1:1'")
		expect(p.parse("I. Timoteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timoteus 1:1'")
		expect(p.parse("I. Timóteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timóteus 1:1'")
		expect(p.parse("1 Timoteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timoteus 1:1'")
		expect(p.parse("1 Timóteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timóteus 1:1'")
		expect(p.parse("I Timoteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timoteus 1:1'")
		expect(p.parse("I Timóteus 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timóteus 1:1'")
		expect(p.parse("Elso Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Elso Tim 1:1'")
		expect(p.parse("Első Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Első Tim 1:1'")
		expect(p.parse("1. Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Tim 1:1'")
		expect(p.parse("I. Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Tim 1:1'")
		expect(p.parse("1 Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tim 1:1'")
		expect(p.parse("I Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Tim 1:1'")
		expect(p.parse("1Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO TIMOTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMOTEUSHOZ 1:1'")
		expect(p.parse("ELSO TIMOTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMOTEUSNAK 1:1'")
		expect(p.parse("ELSO TIMÓTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMÓTEUSHOZ 1:1'")
		expect(p.parse("ELSO TIMÓTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMÓTEUSNAK 1:1'")
		expect(p.parse("ELSŐ TIMOTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMOTEUSHOZ 1:1'")
		expect(p.parse("ELSŐ TIMOTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMOTEUSNAK 1:1'")
		expect(p.parse("ELSŐ TIMÓTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMÓTEUSHOZ 1:1'")
		expect(p.parse("ELSŐ TIMÓTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMÓTEUSNAK 1:1'")
		expect(p.parse("ELSO TIMOTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMOTHEOSZ 1:1'")
		expect(p.parse("ELSO TIMÓTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMÓTHEOSZ 1:1'")
		expect(p.parse("ELSŐ TIMOTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMOTHEOSZ 1:1'")
		expect(p.parse("ELSŐ TIMÓTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMÓTHEOSZ 1:1'")
		expect(p.parse("1. TIMOTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMOTEUSHOZ 1:1'")
		expect(p.parse("1. TIMOTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMOTEUSNAK 1:1'")
		expect(p.parse("1. TIMÓTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMÓTEUSHOZ 1:1'")
		expect(p.parse("1. TIMÓTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMÓTEUSNAK 1:1'")
		expect(p.parse("I. TIMOTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMOTEUSHOZ 1:1'")
		expect(p.parse("I. TIMOTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMOTEUSNAK 1:1'")
		expect(p.parse("I. TIMÓTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMÓTEUSHOZ 1:1'")
		expect(p.parse("I. TIMÓTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMÓTEUSNAK 1:1'")
		expect(p.parse("1 TIMOTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTEUSHOZ 1:1'")
		expect(p.parse("1 TIMOTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTEUSNAK 1:1'")
		expect(p.parse("1 TIMÓTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMÓTEUSHOZ 1:1'")
		expect(p.parse("1 TIMÓTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMÓTEUSNAK 1:1'")
		expect(p.parse("1. TIMOTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMOTHEOSZ 1:1'")
		expect(p.parse("1. TIMÓTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMÓTHEOSZ 1:1'")
		expect(p.parse("ELSO TIMOTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMOTEUS 1:1'")
		expect(p.parse("ELSO TIMÓTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIMÓTEUS 1:1'")
		expect(p.parse("ELSŐ TIMOTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMOTEUS 1:1'")
		expect(p.parse("ELSŐ TIMÓTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIMÓTEUS 1:1'")
		expect(p.parse("I TIMOTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMOTEUSHOZ 1:1'")
		expect(p.parse("I TIMOTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMOTEUSNAK 1:1'")
		expect(p.parse("I TIMÓTEUSHOZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMÓTEUSHOZ 1:1'")
		expect(p.parse("I TIMÓTEUSNAK 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMÓTEUSNAK 1:1'")
		expect(p.parse("I. TIMOTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMOTHEOSZ 1:1'")
		expect(p.parse("I. TIMÓTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMÓTHEOSZ 1:1'")
		expect(p.parse("1 TIMOTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTHEOSZ 1:1'")
		expect(p.parse("1 TIMÓTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMÓTHEOSZ 1:1'")
		expect(p.parse("I TIMOTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMOTHEOSZ 1:1'")
		expect(p.parse("I TIMÓTHEOSZ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMÓTHEOSZ 1:1'")
		expect(p.parse("1. TIMOTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMOTEUS 1:1'")
		expect(p.parse("1. TIMÓTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMÓTEUS 1:1'")
		expect(p.parse("I. TIMOTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMOTEUS 1:1'")
		expect(p.parse("I. TIMÓTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMÓTEUS 1:1'")
		expect(p.parse("1 TIMOTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTEUS 1:1'")
		expect(p.parse("1 TIMÓTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMÓTEUS 1:1'")
		expect(p.parse("I TIMOTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMOTEUS 1:1'")
		expect(p.parse("I TIMÓTEUS 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMÓTEUS 1:1'")
		expect(p.parse("ELSO TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSO TIM 1:1'")
		expect(p.parse("ELSŐ TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ELSŐ TIM 1:1'")
		expect(p.parse("1. TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIM 1:1'")
		expect(p.parse("I. TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIM 1:1'")
		expect(p.parse("1 TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIM 1:1'")
		expect(p.parse("I TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIM 1:1'")
		expect(p.parse("1TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1TIM 1:1'")
		`
		true
describe "Localized book Titus (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Titus (hu)", ->
		`
		expect(p.parse("Tituszhoz 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tituszhoz 1:1'")
		expect(p.parse("Titushoz 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titushoz 1:1'")
		expect(p.parse("Titusz 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titusz 1:1'")
		expect(p.parse("Titus 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titus 1:1'")
		expect(p.parse("Tit 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tit 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("TITUSZHOZ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUSZHOZ 1:1'")
		expect(p.parse("TITUSHOZ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUSHOZ 1:1'")
		expect(p.parse("TITUSZ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUSZ 1:1'")
		expect(p.parse("TITUS 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUS 1:1'")
		expect(p.parse("TIT 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TIT 1:1'")
		`
		true
describe "Localized book Phlm (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Phlm (hu)", ->
		`
		expect(p.parse("Philemonhoz 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Philemonhoz 1:1'")
		expect(p.parse("Filemonhoz 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Filemonhoz 1:1'")
		expect(p.parse("Filemon 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Filemon 1:1'")
		expect(p.parse("Filem 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Filem 1:1'")
		expect(p.parse("Phlm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Phlm 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PHILEMONHOZ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHILEMONHOZ 1:1'")
		expect(p.parse("FILEMONHOZ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILEMONHOZ 1:1'")
		expect(p.parse("FILEMON 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILEMON 1:1'")
		expect(p.parse("FILEM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILEM 1:1'")
		expect(p.parse("PHLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHLM 1:1'")
		`
		true
describe "Localized book Heb (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Heb (hu)", ->
		`
		expect(p.parse("Zsidokhoz irt level 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidokhoz irt level 1:1'")
		expect(p.parse("Zsidokhoz irt levél 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidokhoz irt levél 1:1'")
		expect(p.parse("Zsidokhoz írt level 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidokhoz írt level 1:1'")
		expect(p.parse("Zsidokhoz írt levél 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidokhoz írt levél 1:1'")
		expect(p.parse("Zsidókhoz irt level 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidókhoz irt level 1:1'")
		expect(p.parse("Zsidókhoz irt levél 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidókhoz irt levél 1:1'")
		expect(p.parse("Zsidókhoz írt level 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidókhoz írt level 1:1'")
		expect(p.parse("Zsidókhoz írt levél 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidókhoz írt levél 1:1'")
		expect(p.parse("Heber level 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heber level 1:1'")
		expect(p.parse("Heber levél 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heber levél 1:1'")
		expect(p.parse("Héber level 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Héber level 1:1'")
		expect(p.parse("Héber levél 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Héber levél 1:1'")
		expect(p.parse("Zsidokhoz 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidokhoz 1:1'")
		expect(p.parse("Zsidókhoz 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidókhoz 1:1'")
		expect(p.parse("Zsidok 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidok 1:1'")
		expect(p.parse("Zsidók 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsidók 1:1'")
		expect(p.parse("Zsid 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Zsid 1:1'")
		expect(p.parse("Heb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heb 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZSIDOKHOZ IRT LEVEL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDOKHOZ IRT LEVEL 1:1'")
		expect(p.parse("ZSIDOKHOZ IRT LEVÉL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDOKHOZ IRT LEVÉL 1:1'")
		expect(p.parse("ZSIDOKHOZ ÍRT LEVEL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDOKHOZ ÍRT LEVEL 1:1'")
		expect(p.parse("ZSIDOKHOZ ÍRT LEVÉL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDOKHOZ ÍRT LEVÉL 1:1'")
		expect(p.parse("ZSIDÓKHOZ IRT LEVEL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDÓKHOZ IRT LEVEL 1:1'")
		expect(p.parse("ZSIDÓKHOZ IRT LEVÉL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDÓKHOZ IRT LEVÉL 1:1'")
		expect(p.parse("ZSIDÓKHOZ ÍRT LEVEL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDÓKHOZ ÍRT LEVEL 1:1'")
		expect(p.parse("ZSIDÓKHOZ ÍRT LEVÉL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDÓKHOZ ÍRT LEVÉL 1:1'")
		expect(p.parse("HEBER LEVEL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEBER LEVEL 1:1'")
		expect(p.parse("HEBER LEVÉL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEBER LEVÉL 1:1'")
		expect(p.parse("HÉBER LEVEL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HÉBER LEVEL 1:1'")
		expect(p.parse("HÉBER LEVÉL 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HÉBER LEVÉL 1:1'")
		expect(p.parse("ZSIDOKHOZ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDOKHOZ 1:1'")
		expect(p.parse("ZSIDÓKHOZ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDÓKHOZ 1:1'")
		expect(p.parse("ZSIDOK 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDOK 1:1'")
		expect(p.parse("ZSIDÓK 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSIDÓK 1:1'")
		expect(p.parse("ZSID 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ZSID 1:1'")
		expect(p.parse("HEB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEB 1:1'")
		`
		true
describe "Localized book Jas (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jas (hu)", ->
		`
		expect(p.parse("Jakab 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jakab 1:1'")
		expect(p.parse("Jak 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jak 1:1'")
		expect(p.parse("Jas 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jas 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JAKAB 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAKAB 1:1'")
		expect(p.parse("JAK 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAK 1:1'")
		expect(p.parse("JAS 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAS 1:1'")
		`
		true
describe "Localized book 2Pet (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Pet (hu)", ->
		`
		expect(p.parse("Masodik Peter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Masodik Peter 1:1'")
		expect(p.parse("Masodik Péter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Masodik Péter 1:1'")
		expect(p.parse("Második Peter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Második Peter 1:1'")
		expect(p.parse("Második Péter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Második Péter 1:1'")
		expect(p.parse("Masodik Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Masodik Pet 1:1'")
		expect(p.parse("Masodik Pét 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Masodik Pét 1:1'")
		expect(p.parse("Második Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Második Pet 1:1'")
		expect(p.parse("Második Pét 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Második Pét 1:1'")
		expect(p.parse("Masodik Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Masodik Pt 1:1'")
		expect(p.parse("Második Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Második Pt 1:1'")
		expect(p.parse("II. Peter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Peter 1:1'")
		expect(p.parse("II. Péter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Péter 1:1'")
		expect(p.parse("2. Peter 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Peter 1:1'")
		expect(p.parse("2. Péter 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Péter 1:1'")
		expect(p.parse("II Peter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Peter 1:1'")
		expect(p.parse("II Péter 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Péter 1:1'")
		expect(p.parse("2 Peter 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Peter 1:1'")
		expect(p.parse("2 Péter 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Péter 1:1'")
		expect(p.parse("II. Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Pet 1:1'")
		expect(p.parse("II. Pét 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Pét 1:1'")
		expect(p.parse("2. Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Pet 1:1'")
		expect(p.parse("2. Pét 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Pét 1:1'")
		expect(p.parse("II Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Pet 1:1'")
		expect(p.parse("II Pét 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Pét 1:1'")
		expect(p.parse("II. Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Pt 1:1'")
		expect(p.parse("2 Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Pet 1:1'")
		expect(p.parse("2 Pét 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Pét 1:1'")
		expect(p.parse("2. Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Pt 1:1'")
		expect(p.parse("II Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Pt 1:1'")
		expect(p.parse("2 Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Pt 1:1'")
		expect(p.parse("2Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pet 1:1'")
		expect(p.parse("2Pt 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MASODIK PETER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MASODIK PETER 1:1'")
		expect(p.parse("MASODIK PÉTER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MASODIK PÉTER 1:1'")
		expect(p.parse("MÁSODIK PETER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MÁSODIK PETER 1:1'")
		expect(p.parse("MÁSODIK PÉTER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MÁSODIK PÉTER 1:1'")
		expect(p.parse("MASODIK PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MASODIK PET 1:1'")
		expect(p.parse("MASODIK PÉT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MASODIK PÉT 1:1'")
		expect(p.parse("MÁSODIK PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MÁSODIK PET 1:1'")
		expect(p.parse("MÁSODIK PÉT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MÁSODIK PÉT 1:1'")
		expect(p.parse("MASODIK PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MASODIK PT 1:1'")
		expect(p.parse("MÁSODIK PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'MÁSODIK PT 1:1'")
		expect(p.parse("II. PETER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PETER 1:1'")
		expect(p.parse("II. PÉTER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PÉTER 1:1'")
		expect(p.parse("2. PETER 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PETER 1:1'")
		expect(p.parse("2. PÉTER 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PÉTER 1:1'")
		expect(p.parse("II PETER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PETER 1:1'")
		expect(p.parse("II PÉTER 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PÉTER 1:1'")
		expect(p.parse("2 PETER 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PETER 1:1'")
		expect(p.parse("2 PÉTER 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PÉTER 1:1'")
		expect(p.parse("II. PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PET 1:1'")
		expect(p.parse("II. PÉT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PÉT 1:1'")
		expect(p.parse("2. PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PET 1:1'")
		expect(p.parse("2. PÉT 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PÉT 1:1'")
		expect(p.parse("II PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PET 1:1'")
		expect(p.parse("II PÉT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PÉT 1:1'")
		expect(p.parse("II. PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PT 1:1'")
		expect(p.parse("2 PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PET 1:1'")
		expect(p.parse("2 PÉT 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PÉT 1:1'")
		expect(p.parse("2. PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PT 1:1'")
		expect(p.parse("II PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PT 1:1'")
		expect(p.parse("2 PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PT 1:1'")
		expect(p.parse("2PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PET 1:1'")
		expect(p.parse("2PT 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PT 1:1'")
		`
		true
describe "Localized book 1Pet (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Pet (hu)", ->
		`
		expect(p.parse("Elso Peter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Elso Peter 1:1'")
		expect(p.parse("Elso Péter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Elso Péter 1:1'")
		expect(p.parse("Első Peter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Első Peter 1:1'")
		expect(p.parse("Első Péter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Első Péter 1:1'")
		expect(p.parse("1. Peter 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Peter 1:1'")
		expect(p.parse("1. Péter 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Péter 1:1'")
		expect(p.parse("Elso Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Elso Pet 1:1'")
		expect(p.parse("Elso Pét 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Elso Pét 1:1'")
		expect(p.parse("Első Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Első Pet 1:1'")
		expect(p.parse("Első Pét 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Első Pét 1:1'")
		expect(p.parse("I. Peter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Peter 1:1'")
		expect(p.parse("I. Péter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Péter 1:1'")
		expect(p.parse("1 Peter 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Peter 1:1'")
		expect(p.parse("1 Péter 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Péter 1:1'")
		expect(p.parse("Elso Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Elso Pt 1:1'")
		expect(p.parse("Első Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Első Pt 1:1'")
		expect(p.parse("I Peter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Peter 1:1'")
		expect(p.parse("I Péter 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Péter 1:1'")
		expect(p.parse("1. Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Pet 1:1'")
		expect(p.parse("1. Pét 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Pét 1:1'")
		expect(p.parse("I. Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Pet 1:1'")
		expect(p.parse("I. Pét 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Pét 1:1'")
		expect(p.parse("1 Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Pet 1:1'")
		expect(p.parse("1 Pét 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Pét 1:1'")
		expect(p.parse("1. Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Pt 1:1'")
		expect(p.parse("I Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Pet 1:1'")
		expect(p.parse("I Pét 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Pét 1:1'")
		expect(p.parse("I. Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Pt 1:1'")
		expect(p.parse("1 Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Pt 1:1'")
		expect(p.parse("1Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pet 1:1'")
		expect(p.parse("I Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Pt 1:1'")
		expect(p.parse("1Pt 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ELSO PETER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSO PETER 1:1'")
		expect(p.parse("ELSO PÉTER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSO PÉTER 1:1'")
		expect(p.parse("ELSŐ PETER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSŐ PETER 1:1'")
		expect(p.parse("ELSŐ PÉTER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSŐ PÉTER 1:1'")
		expect(p.parse("1. PETER 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PETER 1:1'")
		expect(p.parse("1. PÉTER 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PÉTER 1:1'")
		expect(p.parse("ELSO PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSO PET 1:1'")
		expect(p.parse("ELSO PÉT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSO PÉT 1:1'")
		expect(p.parse("ELSŐ PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSŐ PET 1:1'")
		expect(p.parse("ELSŐ PÉT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSŐ PÉT 1:1'")
		expect(p.parse("I. PETER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PETER 1:1'")
		expect(p.parse("I. PÉTER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PÉTER 1:1'")
		expect(p.parse("1 PETER 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PETER 1:1'")
		expect(p.parse("1 PÉTER 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PÉTER 1:1'")
		expect(p.parse("ELSO PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSO PT 1:1'")
		expect(p.parse("ELSŐ PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ELSŐ PT 1:1'")
		expect(p.parse("I PETER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PETER 1:1'")
		expect(p.parse("I PÉTER 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PÉTER 1:1'")
		expect(p.parse("1. PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PET 1:1'")
		expect(p.parse("1. PÉT 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PÉT 1:1'")
		expect(p.parse("I. PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PET 1:1'")
		expect(p.parse("I. PÉT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PÉT 1:1'")
		expect(p.parse("1 PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PET 1:1'")
		expect(p.parse("1 PÉT 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PÉT 1:1'")
		expect(p.parse("1. PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PT 1:1'")
		expect(p.parse("I PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PET 1:1'")
		expect(p.parse("I PÉT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PÉT 1:1'")
		expect(p.parse("I. PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PT 1:1'")
		expect(p.parse("1 PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PT 1:1'")
		expect(p.parse("1PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PET 1:1'")
		expect(p.parse("I PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PT 1:1'")
		expect(p.parse("1PT 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PT 1:1'")
		`
		true
describe "Localized book Jude (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jude (hu)", ->
		`
		expect(p.parse("Judas 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Judas 1:1'")
		expect(p.parse("Judás 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Judás 1:1'")
		expect(p.parse("Júdas 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Júdas 1:1'")
		expect(p.parse("Júdás 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Júdás 1:1'")
		expect(p.parse("Jude 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jude 1:1'")
		expect(p.parse("Jud 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jud 1:1'")
		expect(p.parse("Júd 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Júd 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JUDAS 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDAS 1:1'")
		expect(p.parse("JUDÁS 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDÁS 1:1'")
		expect(p.parse("JÚDAS 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JÚDAS 1:1'")
		expect(p.parse("JÚDÁS 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JÚDÁS 1:1'")
		expect(p.parse("JUDE 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDE 1:1'")
		expect(p.parse("JUD 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUD 1:1'")
		expect(p.parse("JÚD 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JÚD 1:1'")
		`
		true
describe "Localized book Tob (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Tob (hu)", ->
		`
		expect(p.parse("Tobias 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tobias 1:1'")
		expect(p.parse("Tobiás 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tobiás 1:1'")
		expect(p.parse("Tóbias 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tóbias 1:1'")
		expect(p.parse("Tóbiás 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tóbiás 1:1'")
		expect(p.parse("Tob 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tob 1:1'")
		expect(p.parse("Tób 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tób 1:1'")
		`
		true
describe "Localized book Jdt (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Jdt (hu)", ->
		`
		expect(p.parse("Judit 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Judit 1:1'")
		expect(p.parse("Jdt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Jdt 1:1'")
		`
		true
describe "Localized book Bar (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Bar (hu)", ->
		`
		expect(p.parse("Baruk 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Baruk 1:1'")
		expect(p.parse("Báruk 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Báruk 1:1'")
		expect(p.parse("Bar 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bar 1:1'")
		expect(p.parse("Bár 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bár 1:1'")
		`
		true
describe "Localized book Sus (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: Sus (hu)", ->
		`
		expect(p.parse("Zsuzsanna es a venek 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuzsanna es a venek 1:1'")
		expect(p.parse("Zsuzsanna es a vének 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuzsanna es a vének 1:1'")
		expect(p.parse("Zsuzsanna és a venek 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuzsanna és a venek 1:1'")
		expect(p.parse("Zsuzsanna és a vének 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuzsanna és a vének 1:1'")
		expect(p.parse("Zsuzsanna 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuzsanna 1:1'")
		expect(p.parse("Zsuzs 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuzs 1:1'")
		expect(p.parse("Zsuz 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Zsuz 1:1'")
		expect(p.parse("Sus 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Sus 1:1'")
		`
		true
describe "Localized book 2Macc (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 2Macc (hu)", ->
		`
		expect(p.parse("Masodik Makkabeusok 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Masodik Makkabeusok 1:1'")
		expect(p.parse("Második Makkabeusok 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Második Makkabeusok 1:1'")
		expect(p.parse("II. Makkabeusok 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Makkabeusok 1:1'")
		expect(p.parse("2. Makkabeusok 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Makkabeusok 1:1'")
		expect(p.parse("II Makkabeusok 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Makkabeusok 1:1'")
		expect(p.parse("Makkabeusok II 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Makkabeusok II 1:1'")
		expect(p.parse("2 Makkabeusok 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Makkabeusok 1:1'")
		expect(p.parse("Masodik Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Masodik Mak 1:1'")
		expect(p.parse("Második Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Második Mak 1:1'")
		expect(p.parse("II. Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Mak 1:1'")
		expect(p.parse("2. Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Mak 1:1'")
		expect(p.parse("II Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Mak 1:1'")
		expect(p.parse("2 Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Mak 1:1'")
		expect(p.parse("2Macc 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2Macc 1:1'")
		`
		true
describe "Localized book 3Macc (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 3Macc (hu)", ->
		`
		expect(p.parse("Harmadik Makkabeusok 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Harmadik Makkabeusok 1:1'")
		expect(p.parse("III. Makkabeusok 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Makkabeusok 1:1'")
		expect(p.parse("III Makkabeusok 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Makkabeusok 1:1'")
		expect(p.parse("Makkabeusok III 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Makkabeusok III 1:1'")
		expect(p.parse("3. Makkabeusok 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Makkabeusok 1:1'")
		expect(p.parse("3 Makkabeusok 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Makkabeusok 1:1'")
		expect(p.parse("Harmadik Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Harmadik Mak 1:1'")
		expect(p.parse("III. Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Mak 1:1'")
		expect(p.parse("III Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Mak 1:1'")
		expect(p.parse("3. Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Mak 1:1'")
		expect(p.parse("3 Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Mak 1:1'")
		expect(p.parse("3Macc 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3Macc 1:1'")
		`
		true
describe "Localized book 4Macc (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 4Macc (hu)", ->
		`
		expect(p.parse("IV. Makkabeusok 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Makkabeusok 1:1'")
		expect(p.parse("4. Makkabeusok 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Makkabeusok 1:1'")
		expect(p.parse("IV Makkabeusok 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Makkabeusok 1:1'")
		expect(p.parse("Makkabeusok IV 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Makkabeusok IV 1:1'")
		expect(p.parse("4 Makkabeusok 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Makkabeusok 1:1'")
		expect(p.parse("IV. Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Mak 1:1'")
		expect(p.parse("4. Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Mak 1:1'")
		expect(p.parse("IV Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Mak 1:1'")
		expect(p.parse("4 Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Mak 1:1'")
		expect(p.parse("4Macc 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4Macc 1:1'")
		`
		true
describe "Localized book 1Macc (hu)", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"
		p.include_apocrypha true
	it "should handle book: 1Macc (hu)", ->
		`
		expect(p.parse("Elso Makkabeusok 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Elso Makkabeusok 1:1'")
		expect(p.parse("Első Makkabeusok 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Első Makkabeusok 1:1'")
		expect(p.parse("1. Makkabeusok 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Makkabeusok 1:1'")
		expect(p.parse("I. Makkabeusok 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Makkabeusok 1:1'")
		expect(p.parse("1 Makkabeusok 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Makkabeusok 1:1'")
		expect(p.parse("I Makkabeusok 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Makkabeusok 1:1'")
		expect(p.parse("Makkabeusok I 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Makkabeusok I 1:1'")
		expect(p.parse("Elso Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Elso Mak 1:1'")
		expect(p.parse("Első Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Első Mak 1:1'")
		expect(p.parse("1. Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Mak 1:1'")
		expect(p.parse("I. Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Mak 1:1'")
		expect(p.parse("1 Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Mak 1:1'")
		expect(p.parse("1Macc 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1Macc 1:1'")
		expect(p.parse("I Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Mak 1:1'")
		`
		true

describe "Miscellaneous tests", ->
	p = {}
	beforeEach ->
		p = new bcv_parser
		p.set_options book_alone_strategy: "ignore", book_sequence_strategy: "ignore", osis_compaction_strategy: "bc", captive_end_digits_strategy: "delete"
		p.include_apocrypha true

	it "should return the expected language", ->
		expect(p.languages).toEqual ["hu"]

	it "should handle ranges (hu)", ->
		expect(p.parse("Titus 1:1 köv 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 köv 2'")
		expect(p.parse("Matt 1köv2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1köv2'")
		expect(p.parse("Phlm 2 KÖV 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 KÖV 3'")
		expect(p.parse("Titus 1:1 kov 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 kov 2'")
		expect(p.parse("Matt 1kov2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1kov2'")
		expect(p.parse("Phlm 2 KOV 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 KOV 3'")
	it "should handle chapters (hu)", ->
		expect(p.parse("Titus 1:1, fejezetében 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, fejezetében 2'")
		expect(p.parse("Matt 3:4 FEJEZETÉBEN 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 FEJEZETÉBEN 6'")
		expect(p.parse("Titus 1:1, fejezeteben 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, fejezeteben 2'")
		expect(p.parse("Matt 3:4 FEJEZETEBEN 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 FEJEZETEBEN 6'")
		expect(p.parse("Titus 1:1, fejezet 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, fejezet 2'")
		expect(p.parse("Matt 3:4 FEJEZET 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 FEJEZET 6'")
		expect(p.parse("Titus 1:1, fej. 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, fej. 2'")
		expect(p.parse("Matt 3:4 FEJ. 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 FEJ. 6'")
		expect(p.parse("Titus 1:1, fej 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, fej 2'")
		expect(p.parse("Matt 3:4 FEJ 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 FEJ 6'")
	it "should handle verses (hu)", ->
		expect(p.parse("Exod 1:1 versekre 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 versekre 3'")
		expect(p.parse("Phlm VERSEKRE 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm VERSEKRE 6'")
		expect(p.parse("Exod 1:1 versek 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 versek 3'")
		expect(p.parse("Phlm VERSEK 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm VERSEK 6'")
		expect(p.parse("Exod 1:1 vers. 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 vers. 3'")
		expect(p.parse("Phlm VERS. 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm VERS. 6'")
		expect(p.parse("Exod 1:1 vers 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 vers 3'")
		expect(p.parse("Phlm VERS 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm VERS 6'")
	it "should handle 'and' (hu)", ->
		expect(p.parse("Exod 1:1 és 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 és 3'")
		expect(p.parse("Phlm 2 ÉS 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 ÉS 6'")
		expect(p.parse("Exod 1:1 es 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 es 3'")
		expect(p.parse("Phlm 2 ES 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 ES 6'")
		expect(p.parse("Exod 1:1 vö 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 vö 3'")
		expect(p.parse("Phlm 2 VÖ 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 VÖ 6'")
		expect(p.parse("Exod 1:1 vo 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 vo 3'")
		expect(p.parse("Phlm 2 VO 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 VO 6'")
		expect(p.parse("Exod 1:1 vagy 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 vagy 3'")
		expect(p.parse("Phlm 2 VAGY 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 VAGY 6'")
	it "should handle titles (hu)", ->
		expect(p.parse("Ps 3 cím, 4:2, 5:cím").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 cím, 4:2, 5:cím'")
		expect(p.parse("PS 3 CÍM, 4:2, 5:CÍM").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 CÍM, 4:2, 5:CÍM'")
		expect(p.parse("Ps 3 cim, 4:2, 5:cim").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 cim, 4:2, 5:cim'")
		expect(p.parse("PS 3 CIM, 4:2, 5:CIM").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 CIM, 4:2, 5:CIM'")
	it "should handle 'ff' (hu)", ->
		expect(p.parse("Rev 3kk, 4:2kk").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3kk, 4:2kk'")
		expect(p.parse("REV 3 KK, 4:2 KK").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'REV 3 KK, 4:2 KK'")
	it "should handle translations (hu)", ->
		expect(p.parse("Lev 1 (ERV)").osis_and_translations()).toEqual [["Lev.1", "ERV"]]
		expect(p.parse("lev 1 erv").osis_and_translations()).toEqual [["Lev.1", "ERV"]]
		expect(p.parse("Lev 1 (KAR)").osis_and_translations()).toEqual [["Lev.1", "KAR"]]
		expect(p.parse("lev 1 kar").osis_and_translations()).toEqual [["Lev.1", "KAR"]]
	it "should handle book ranges (hu)", ->
		p.set_options {book_alone_strategy: "full", book_range_strategy: "include"}
		expect(p.parse("Első köv Harmadik  Jn").osis()).toEqual("1John.1-3John.1", "parsing: 'Első köv Harmadik  Jn'")
		expect(p.parse("Első kov Harmadik  Jn").osis()).toEqual("1John.1-3John.1", "parsing: 'Első kov Harmadik  Jn'")
	it "should handle boundaries (hu)", ->
		p.set_options {book_alone_strategy: "full"}
		expect(p.parse("\u2014Matt\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\u2014Matt\u2014'")
		expect(p.parse("\u201cMatt 1:1\u201d").osis()).toEqual("Matt.1.1", "parsing: '\u201cMatt 1:1\u201d'")
