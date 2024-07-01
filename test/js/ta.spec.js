(function() {
  var bcv_parser;

  bcv_parser = require("../../js/ta_bcv_parser.js").bcv_parser;

  describe("Parsing", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.options.osis_compaction_strategy = "b";
      return p.options.sequence_combination_strategy = "combine";
    });
    it("should round-trip OSIS references", function() {
      var bc, bcv, bcv_range, book, books, i, len, results;
      p.set_options({
        osis_compaction_strategy: "bc"
      });
      books = ["Gen", "Exod", "Lev", "Num", "Deut", "Josh", "Judg", "Ruth", "1Sam", "2Sam", "1Kgs", "2Kgs", "1Chr", "2Chr", "Ezra", "Neh", "Esth", "Job", "Ps", "Prov", "Eccl", "Song", "Isa", "Jer", "Lam", "Ezek", "Dan", "Hos", "Joel", "Amos", "Obad", "Jonah", "Mic", "Nah", "Hab", "Zeph", "Hag", "Zech", "Mal", "Matt", "Mark", "Luke", "John", "Acts", "Rom", "1Cor", "2Cor", "Gal", "Eph", "Phil", "Col", "1Thess", "2Thess", "1Tim", "2Tim", "Titus", "Phlm", "Heb", "Jas", "1Pet", "2Pet", "1John", "2John", "3John", "Jude", "Rev"];
      results = [];
      for (i = 0, len = books.length; i < len; i++) {
        book = books[i];
        bc = book + ".1";
        bcv = bc + ".1";
        bcv_range = bcv + "-" + bc + ".2";
        expect(p.parse(bc).osis()).toEqual(bc);
        expect(p.parse(bcv).osis()).toEqual(bcv);
        results.push(expect(p.parse(bcv_range).osis()).toEqual(bcv_range));
      }
      return results;
    });
    it("should round-trip OSIS Apocrypha references", function() {
      var bc, bcv, bcv_range, book, books, i, j, len, len1, results;
      p.set_options({
        osis_compaction_strategy: "bc",
        ps151_strategy: "b"
      });
      p.include_apocrypha(true);
      books = ["Tob", "Jdt", "GkEsth", "Wis", "Sir", "Bar", "PrAzar", "Sus", "Bel", "SgThree", "EpJer", "1Macc", "2Macc", "3Macc", "4Macc", "1Esd", "2Esd", "PrMan", "Ps151"];
      for (i = 0, len = books.length; i < len; i++) {
        book = books[i];
        bc = book + ".1";
        bcv = bc + ".1";
        bcv_range = bcv + "-" + bc + ".2";
        expect(p.parse(bc).osis()).toEqual(bc);
        expect(p.parse(bcv).osis()).toEqual(bcv);
        expect(p.parse(bcv_range).osis()).toEqual(bcv_range);
      }
      p.set_options({
        ps151_strategy: "bc"
      });
      expect(p.parse("Ps151.1").osis()).toEqual("Ps.151");
      expect(p.parse("Ps151.1.1").osis()).toEqual("Ps.151.1");
      expect(p.parse("Ps151.1-Ps151.2").osis()).toEqual("Ps.151.1-Ps.151.2");
      p.include_apocrypha(false);
      results = [];
      for (j = 0, len1 = books.length; j < len1; j++) {
        book = books[j];
        bc = book + ".1";
        results.push(expect(p.parse(bc).osis()).toEqual(""));
      }
      return results;
    });
    return it("should handle a preceding character", function() {
      expect(p.parse(" Gen 1").osis()).toEqual("Gen.1");
      expect(p.parse("Matt5John3").osis()).toEqual("Matt.5,John.3");
      expect(p.parse("1Ps 1").osis()).toEqual("");
      return expect(p.parse("11Sam 1").osis()).toEqual("");
    });
  });

  describe("Localized book Gen (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Gen (ta)", function() {
      
		expect(p.parse("தொடக்க நூல் 1:1").osis()).toEqual("Gen.1.1", "parsing: 'தொடக்க நூல் 1:1'")
		expect(p.parse("Atiyakamam 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Atiyakamam 1:1'")
		expect(p.parse("Atiyākamam 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Atiyākamam 1:1'")
		expect(p.parse("Ātiyakamam 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Ātiyakamam 1:1'")
		expect(p.parse("Ātiyākamam 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Ātiyākamam 1:1'")
		expect(p.parse("ஆதியாகமம் 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ஆதியாகமம் 1:1'")
		expect(p.parse("தொநூ 1:1").osis()).toEqual("Gen.1.1", "parsing: 'தொநூ 1:1'")
		expect(p.parse("Gen 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Gen 1:1'")
		expect(p.parse("ஆதி 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ஆதி 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("தொடக்க நூல் 1:1").osis()).toEqual("Gen.1.1", "parsing: 'தொடக்க நூல் 1:1'")
		expect(p.parse("ATIYAKAMAM 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ATIYAKAMAM 1:1'")
		expect(p.parse("ATIYĀKAMAM 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ATIYĀKAMAM 1:1'")
		expect(p.parse("ĀTIYAKAMAM 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ĀTIYAKAMAM 1:1'")
		expect(p.parse("ĀTIYĀKAMAM 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ĀTIYĀKAMAM 1:1'")
		expect(p.parse("ஆதியாகமம் 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ஆதியாகமம் 1:1'")
		expect(p.parse("தொநூ 1:1").osis()).toEqual("Gen.1.1", "parsing: 'தொநூ 1:1'")
		expect(p.parse("GEN 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GEN 1:1'")
		expect(p.parse("ஆதி 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ஆதி 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Exod (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Exod (ta)", function() {
      
		expect(p.parse("விடுதலைப் பயணம் 1:1").osis()).toEqual("Exod.1.1", "parsing: 'விடுதலைப் பயணம் 1:1'")
		expect(p.parse("Yattirakamam 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Yattirakamam 1:1'")
		expect(p.parse("Yattirākamam 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Yattirākamam 1:1'")
		expect(p.parse("Yāttirakamam 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Yāttirakamam 1:1'")
		expect(p.parse("Yāttirākamam 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Yāttirākamam 1:1'")
		expect(p.parse("யாத்திராகமம் 1:1").osis()).toEqual("Exod.1.1", "parsing: 'யாத்திராகமம் 1:1'")
		expect(p.parse("Exod 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exod 1:1'")
		expect(p.parse("யாத் 1:1").osis()).toEqual("Exod.1.1", "parsing: 'யாத் 1:1'")
		expect(p.parse("விப 1:1").osis()).toEqual("Exod.1.1", "parsing: 'விப 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("விடுதலைப் பயணம் 1:1").osis()).toEqual("Exod.1.1", "parsing: 'விடுதலைப் பயணம் 1:1'")
		expect(p.parse("YATTIRAKAMAM 1:1").osis()).toEqual("Exod.1.1", "parsing: 'YATTIRAKAMAM 1:1'")
		expect(p.parse("YATTIRĀKAMAM 1:1").osis()).toEqual("Exod.1.1", "parsing: 'YATTIRĀKAMAM 1:1'")
		expect(p.parse("YĀTTIRAKAMAM 1:1").osis()).toEqual("Exod.1.1", "parsing: 'YĀTTIRAKAMAM 1:1'")
		expect(p.parse("YĀTTIRĀKAMAM 1:1").osis()).toEqual("Exod.1.1", "parsing: 'YĀTTIRĀKAMAM 1:1'")
		expect(p.parse("யாத்திராகமம் 1:1").osis()).toEqual("Exod.1.1", "parsing: 'யாத்திராகமம் 1:1'")
		expect(p.parse("EXOD 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXOD 1:1'")
		expect(p.parse("யாத் 1:1").osis()).toEqual("Exod.1.1", "parsing: 'யாத் 1:1'")
		expect(p.parse("விப 1:1").osis()).toEqual("Exod.1.1", "parsing: 'விப 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bel (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Bel (ta)", function() {
      
		expect(p.parse("பேல் தெய்வமும் அரக்கப்பாம்பும் என்பவையாகும் 1:1").osis()).toEqual("Bel.1.1", "parsing: 'பேல் தெய்வமும் அரக்கப்பாம்பும் என்பவையாகும் 1:1'")
		expect(p.parse("பேல் தெய்வமும் அரக்கப்பாம்பும் 1:1").osis()).toEqual("Bel.1.1", "parsing: 'பேல் தெய்வமும் அரக்கப்பாம்பும் 1:1'")
		expect(p.parse("பேல் 1:1").osis()).toEqual("Bel.1.1", "parsing: 'பேல் 1:1'")
		expect(p.parse("Bel 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lev (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Lev (ta)", function() {
      
		expect(p.parse("Leviyarakamam 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Leviyarakamam 1:1'")
		expect(p.parse("Leviyarākamam 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Leviyarākamam 1:1'")
		expect(p.parse("Lēviyarakamam 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lēviyarakamam 1:1'")
		expect(p.parse("Lēviyarākamam 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lēviyarākamam 1:1'")
		expect(p.parse("லேவியராகமம் 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவியராகமம் 1:1'")
		expect(p.parse("லேவியாரகமம் 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவியாரகமம் 1:1'")
		expect(p.parse("லேவியர் 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவியர் 1:1'")
		expect(p.parse("லேவி 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவி 1:1'")
		expect(p.parse("Lev 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lev 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("LEVIYARAKAMAM 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEVIYARAKAMAM 1:1'")
		expect(p.parse("LEVIYARĀKAMAM 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEVIYARĀKAMAM 1:1'")
		expect(p.parse("LĒVIYARAKAMAM 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LĒVIYARAKAMAM 1:1'")
		expect(p.parse("LĒVIYARĀKAMAM 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LĒVIYARĀKAMAM 1:1'")
		expect(p.parse("லேவியராகமம் 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவியராகமம் 1:1'")
		expect(p.parse("லேவியாரகமம் 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவியாரகமம் 1:1'")
		expect(p.parse("லேவியர் 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவியர் 1:1'")
		expect(p.parse("லேவி 1:1").osis()).toEqual("Lev.1.1", "parsing: 'லேவி 1:1'")
		expect(p.parse("LEV 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEV 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Num (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Num (ta)", function() {
      
		expect(p.parse("Ennakamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Ennakamam 1:1'")
		expect(p.parse("Ennākamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Ennākamam 1:1'")
		expect(p.parse("Enṇakamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Enṇakamam 1:1'")
		expect(p.parse("Enṇākamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Enṇākamam 1:1'")
		expect(p.parse("Eṇnakamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Eṇnakamam 1:1'")
		expect(p.parse("Eṇnākamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Eṇnākamam 1:1'")
		expect(p.parse("Eṇṇakamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Eṇṇakamam 1:1'")
		expect(p.parse("Eṇṇākamam 1:1").osis()).toEqual("Num.1.1", "parsing: 'Eṇṇākamam 1:1'")
		expect(p.parse("எண்ணாகமம் 1:1").osis()).toEqual("Num.1.1", "parsing: 'எண்ணாகமம் 1:1'")
		expect(p.parse("எண்ணிக்கை 1:1").osis()).toEqual("Num.1.1", "parsing: 'எண்ணிக்கை 1:1'")
		expect(p.parse("Num 1:1").osis()).toEqual("Num.1.1", "parsing: 'Num 1:1'")
		expect(p.parse("எண் 1:1").osis()).toEqual("Num.1.1", "parsing: 'எண் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ENNAKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'ENNAKAMAM 1:1'")
		expect(p.parse("ENNĀKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'ENNĀKAMAM 1:1'")
		expect(p.parse("ENṆAKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'ENṆAKAMAM 1:1'")
		expect(p.parse("ENṆĀKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'ENṆĀKAMAM 1:1'")
		expect(p.parse("EṆNAKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'EṆNAKAMAM 1:1'")
		expect(p.parse("EṆNĀKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'EṆNĀKAMAM 1:1'")
		expect(p.parse("EṆṆAKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'EṆṆAKAMAM 1:1'")
		expect(p.parse("EṆṆĀKAMAM 1:1").osis()).toEqual("Num.1.1", "parsing: 'EṆṆĀKAMAM 1:1'")
		expect(p.parse("எண்ணாகமம் 1:1").osis()).toEqual("Num.1.1", "parsing: 'எண்ணாகமம் 1:1'")
		expect(p.parse("எண்ணிக்கை 1:1").osis()).toEqual("Num.1.1", "parsing: 'எண்ணிக்கை 1:1'")
		expect(p.parse("NUM 1:1").osis()).toEqual("Num.1.1", "parsing: 'NUM 1:1'")
		expect(p.parse("எண் 1:1").osis()).toEqual("Num.1.1", "parsing: 'எண் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sir (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Sir (ta)", function() {
      
		expect(p.parse("சீராக்கின் ஞானம் 1:1").osis()).toEqual("Sir.1.1", "parsing: 'சீராக்கின் ஞானம் 1:1'")
		expect(p.parse("சீராக் ஆகமம் 1:1").osis()).toEqual("Sir.1.1", "parsing: 'சீராக் ஆகமம் 1:1'")
		expect(p.parse("சீஞா 1:1").osis()).toEqual("Sir.1.1", "parsing: 'சீஞா 1:1'")
		expect(p.parse("Sir 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sir 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Wis (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Wis (ta)", function() {
      
		expect(p.parse("சாலமோனின் ஞானம் 1:1").osis()).toEqual("Wis.1.1", "parsing: 'சாலமோனின் ஞானம் 1:1'")
		expect(p.parse("ஞானாகமம் 1:1").osis()).toEqual("Wis.1.1", "parsing: 'ஞானாகமம் 1:1'")
		expect(p.parse("சாஞா 1:1").osis()).toEqual("Wis.1.1", "parsing: 'சாஞா 1:1'")
		expect(p.parse("Wis 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Wis 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lam (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Lam (ta)", function() {
      
		expect(p.parse("எரேமியாவின் புலம்பல் 1:1").osis()).toEqual("Lam.1.1", "parsing: 'எரேமியாவின் புலம்பல் 1:1'")
		expect(p.parse("Pulampal 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Pulampal 1:1'")
		expect(p.parse("புலம்பல் 1:1").osis()).toEqual("Lam.1.1", "parsing: 'புலம்பல் 1:1'")
		expect(p.parse("புலம் 1:1").osis()).toEqual("Lam.1.1", "parsing: 'புலம் 1:1'")
		expect(p.parse("Lam 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Lam 1:1'")
		expect(p.parse("புல 1:1").osis()).toEqual("Lam.1.1", "parsing: 'புல 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எரேமியாவின் புலம்பல் 1:1").osis()).toEqual("Lam.1.1", "parsing: 'எரேமியாவின் புலம்பல் 1:1'")
		expect(p.parse("PULAMPAL 1:1").osis()).toEqual("Lam.1.1", "parsing: 'PULAMPAL 1:1'")
		expect(p.parse("புலம்பல் 1:1").osis()).toEqual("Lam.1.1", "parsing: 'புலம்பல் 1:1'")
		expect(p.parse("புலம் 1:1").osis()).toEqual("Lam.1.1", "parsing: 'புலம் 1:1'")
		expect(p.parse("LAM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'LAM 1:1'")
		expect(p.parse("புல 1:1").osis()).toEqual("Lam.1.1", "parsing: 'புல 1:1'")
		;
      return true;
    });
  });

  describe("Localized book EpJer (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: EpJer (ta)", function() {
      
		expect(p.parse("அவை இளைஞர் மூவரின் பாடல் 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'அவை இளைஞர் மூவரின் பாடல் 1:1'")
		expect(p.parse("எரேமியாவின் கடிதம் 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'எரேமியாவின் கடிதம் 1:1'")
		expect(p.parse("எரேமியாவின் மடல் 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'எரேமியாவின் மடல் 1:1'")
		expect(p.parse("EpJer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'EpJer 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rev (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Rev (ta)", function() {
      
		expect(p.parse("யோவானுக்கு வெளிப்படுத்தின விசேஷம் 1:1").osis()).toEqual("Rev.1.1", "parsing: 'யோவானுக்கு வெளிப்படுத்தின விசேஷம் 1:1'")
		expect(p.parse("Velippatuttina Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicetankal 1:1'")
		expect(p.parse("Velippatuttina Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicetankaḷ 1:1'")
		expect(p.parse("Velippatuttina Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicetaṅkal 1:1'")
		expect(p.parse("Velippatuttina Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicetaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttina Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Viceṭankal 1:1'")
		expect(p.parse("Velippatuttina Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Viceṭankaḷ 1:1'")
		expect(p.parse("Velippatuttina Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Viceṭaṅkal 1:1'")
		expect(p.parse("Velippatuttina Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttina Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicētankal 1:1'")
		expect(p.parse("Velippatuttina Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicētankaḷ 1:1'")
		expect(p.parse("Velippatuttina Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicētaṅkal 1:1'")
		expect(p.parse("Velippatuttina Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicētaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttina Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicēṭankal 1:1'")
		expect(p.parse("Velippatuttina Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicēṭankaḷ 1:1'")
		expect(p.parse("Velippatuttina Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicēṭaṅkal 1:1'")
		expect(p.parse("Velippatuttina Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicetankal 1:1'")
		expect(p.parse("Velippatuttiṉa Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicetankaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicetaṅkal 1:1'")
		expect(p.parse("Velippatuttiṉa Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicetaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Viceṭankal 1:1'")
		expect(p.parse("Velippatuttiṉa Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Viceṭankaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Viceṭaṅkal 1:1'")
		expect(p.parse("Velippatuttiṉa Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicētankal 1:1'")
		expect(p.parse("Velippatuttiṉa Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicētankaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicētaṅkal 1:1'")
		expect(p.parse("Velippatuttiṉa Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicētaṅkaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicēṭankal 1:1'")
		expect(p.parse("Velippatuttiṉa Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicēṭankaḷ 1:1'")
		expect(p.parse("Velippatuttiṉa Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicēṭaṅkal 1:1'")
		expect(p.parse("Velippatuttiṉa Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicetankal 1:1'")
		expect(p.parse("Velippaṭuttina Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicetankaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicetaṅkal 1:1'")
		expect(p.parse("Velippaṭuttina Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicetaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Viceṭankal 1:1'")
		expect(p.parse("Velippaṭuttina Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Viceṭankaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Viceṭaṅkal 1:1'")
		expect(p.parse("Velippaṭuttina Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicētankal 1:1'")
		expect(p.parse("Velippaṭuttina Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicētankaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicētaṅkal 1:1'")
		expect(p.parse("Velippaṭuttina Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicētaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicēṭankal 1:1'")
		expect(p.parse("Velippaṭuttina Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicēṭankaḷ 1:1'")
		expect(p.parse("Velippaṭuttina Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicēṭaṅkal 1:1'")
		expect(p.parse("Velippaṭuttina Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicetankal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicetankaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicetaṅkal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicetaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Viceṭankal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Viceṭankaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Viceṭaṅkal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicētankal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicētankaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicētaṅkal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicētaṅkaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicēṭankal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicēṭankaḷ 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicēṭaṅkal 1:1'")
		expect(p.parse("Velippaṭuttiṉa Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicetankal 1:1'")
		expect(p.parse("Veḷippatuttina Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicetankaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicetaṅkal 1:1'")
		expect(p.parse("Veḷippatuttina Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicetaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Viceṭankal 1:1'")
		expect(p.parse("Veḷippatuttina Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Viceṭankaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Viceṭaṅkal 1:1'")
		expect(p.parse("Veḷippatuttina Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicētankal 1:1'")
		expect(p.parse("Veḷippatuttina Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicētankaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicētaṅkal 1:1'")
		expect(p.parse("Veḷippatuttina Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicētaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicēṭankal 1:1'")
		expect(p.parse("Veḷippatuttina Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicēṭankaḷ 1:1'")
		expect(p.parse("Veḷippatuttina Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicēṭaṅkal 1:1'")
		expect(p.parse("Veḷippatuttina Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicetankal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicetankaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicetaṅkal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicetaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Viceṭankal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Viceṭankaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Viceṭaṅkal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicētankal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicētankaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicētaṅkal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicētaṅkaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicēṭankal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicēṭankaḷ 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicēṭaṅkal 1:1'")
		expect(p.parse("Veḷippatuttiṉa Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicetankal 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicetankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicetaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicetaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Viceṭankal 1:1'")
		expect(p.parse("Veḷippaṭuttina Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Viceṭankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Viceṭaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttina Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicētankal 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicētankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicētaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicētaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicēṭankal 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicēṭankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicēṭaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttina Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicetankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicetankal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicetankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicetankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicetaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicetaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicetaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicetaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Viceṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Viceṭankal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Viceṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Viceṭankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Viceṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Viceṭaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Viceṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Viceṭaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicētankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicētankal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicētankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicētankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicētaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicētaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicētaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicētaṅkaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicēṭankal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicēṭankal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicēṭankaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicēṭankaḷ 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicēṭaṅkal 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicēṭaṅkal 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa Vicēṭaṅkaḷ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa Vicēṭaṅkaḷ 1:1'")
		expect(p.parse("வெளிப்படுத்தின விசேடங்கள் 1:1").osis()).toEqual("Rev.1.1", "parsing: 'வெளிப்படுத்தின விசேடங்கள் 1:1'")
		expect(p.parse("Velippatuttina 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttina 1:1'")
		expect(p.parse("Velippatuttiṉa 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippatuttiṉa 1:1'")
		expect(p.parse("Velippaṭuttina 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttina 1:1'")
		expect(p.parse("Velippaṭuttiṉa 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Velippaṭuttiṉa 1:1'")
		expect(p.parse("Veḷippatuttina 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttina 1:1'")
		expect(p.parse("Veḷippatuttiṉa 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippatuttiṉa 1:1'")
		expect(p.parse("Veḷippaṭuttina 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttina 1:1'")
		expect(p.parse("Veḷippaṭuttiṉa 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Veḷippaṭuttiṉa 1:1'")
		expect(p.parse("திருவெளிப்பாடு 1:1").osis()).toEqual("Rev.1.1", "parsing: 'திருவெளிப்பாடு 1:1'")
		expect(p.parse("வெளிப்படுத்தல் 1:1").osis()).toEqual("Rev.1.1", "parsing: 'வெளிப்படுத்தல் 1:1'")
		expect(p.parse("திவெ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'திவெ 1:1'")
		expect(p.parse("வெளி 1:1").osis()).toEqual("Rev.1.1", "parsing: 'வெளி 1:1'")
		expect(p.parse("Rev 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rev 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோவானுக்கு வெளிப்படுத்தின விசேஷம் 1:1").osis()).toEqual("Rev.1.1", "parsing: 'யோவானுக்கு வெளிப்படுத்தின விசேஷம் 1:1'")
		expect(p.parse("VELIPPATUTTINA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICETANKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICETANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICETAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICETAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICEṬANKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICEṬANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICEṬAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒTANKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒTANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒTAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒṬANKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTINA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICETANKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICETANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICETAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICETAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICEṬANKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICEṬANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICEṬAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒTANKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒTANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒTAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒṬANKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VELIPPATUTTIṈA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICETANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICETANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICETAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICETAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICEṬANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICEṬANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICEṬAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒTANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒTANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒTAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒṬANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTINA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICETANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICETANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICETAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICETAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICEṬANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICEṬANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICEṬAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒTANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒTANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒTAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒṬANKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICETANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICETANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICETAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICETAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICEṬANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICEṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICEṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒTANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒTANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒTAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒṬANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTINA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICETANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICETANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICETAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICETAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICEṬANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICEṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICEṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒTANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒTANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒTAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒṬANKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICETANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICETANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICETAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICETAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICEṬANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICEṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICEṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒTANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒTANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒTAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒṬANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICETANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICETANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICETANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICETANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICETAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICETAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICETAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICETAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICEṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICEṬANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICEṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICEṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICEṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICEṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICEṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICEṬAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒTANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒTANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒTANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒTANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒTAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒTAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒTAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒTAṄKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒṬANKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒṬANKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒṬANKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒṬANKAḶ 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒṬAṄKAL 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒṬAṄKAL 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA VICĒṬAṄKAḶ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA VICĒṬAṄKAḶ 1:1'")
		expect(p.parse("வெளிப்படுத்தின விசேடங்கள் 1:1").osis()).toEqual("Rev.1.1", "parsing: 'வெளிப்படுத்தின விசேடங்கள் 1:1'")
		expect(p.parse("VELIPPATUTTINA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTINA 1:1'")
		expect(p.parse("VELIPPATUTTIṈA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPATUTTIṈA 1:1'")
		expect(p.parse("VELIPPAṬUTTINA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTINA 1:1'")
		expect(p.parse("VELIPPAṬUTTIṈA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VELIPPAṬUTTIṈA 1:1'")
		expect(p.parse("VEḶIPPATUTTINA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTINA 1:1'")
		expect(p.parse("VEḶIPPATUTTIṈA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPATUTTIṈA 1:1'")
		expect(p.parse("VEḶIPPAṬUTTINA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTINA 1:1'")
		expect(p.parse("VEḶIPPAṬUTTIṈA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'VEḶIPPAṬUTTIṈA 1:1'")
		expect(p.parse("திருவெளிப்பாடு 1:1").osis()).toEqual("Rev.1.1", "parsing: 'திருவெளிப்பாடு 1:1'")
		expect(p.parse("வெளிப்படுத்தல் 1:1").osis()).toEqual("Rev.1.1", "parsing: 'வெளிப்படுத்தல் 1:1'")
		expect(p.parse("திவெ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'திவெ 1:1'")
		expect(p.parse("வெளி 1:1").osis()).toEqual("Rev.1.1", "parsing: 'வெளி 1:1'")
		expect(p.parse("REV 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REV 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrMan (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: PrMan (ta)", function() {
      
		expect(p.parse("PrMan 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'PrMan 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Deut (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Deut (ta)", function() {
      
		expect(p.parse("இணைச் சட்டம் 1:1").osis()).toEqual("Deut.1.1", "parsing: 'இணைச் சட்டம் 1:1'")
		expect(p.parse("Upakamam 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Upakamam 1:1'")
		expect(p.parse("Upākamam 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Upākamam 1:1'")
		expect(p.parse("உபாகமம் 1:1").osis()).toEqual("Deut.1.1", "parsing: 'உபாகமம் 1:1'")
		expect(p.parse("Deut 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deut 1:1'")
		expect(p.parse("உபா 1:1").osis()).toEqual("Deut.1.1", "parsing: 'உபா 1:1'")
		expect(p.parse("இச 1:1").osis()).toEqual("Deut.1.1", "parsing: 'இச 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("இணைச் சட்டம் 1:1").osis()).toEqual("Deut.1.1", "parsing: 'இணைச் சட்டம் 1:1'")
		expect(p.parse("UPAKAMAM 1:1").osis()).toEqual("Deut.1.1", "parsing: 'UPAKAMAM 1:1'")
		expect(p.parse("UPĀKAMAM 1:1").osis()).toEqual("Deut.1.1", "parsing: 'UPĀKAMAM 1:1'")
		expect(p.parse("உபாகமம் 1:1").osis()).toEqual("Deut.1.1", "parsing: 'உபாகமம் 1:1'")
		expect(p.parse("DEUT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUT 1:1'")
		expect(p.parse("உபா 1:1").osis()).toEqual("Deut.1.1", "parsing: 'உபா 1:1'")
		expect(p.parse("இச 1:1").osis()).toEqual("Deut.1.1", "parsing: 'இச 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Josh (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Josh (ta)", function() {
      
		expect(p.parse("யோசுவாவின் புத்தகம் 1:1").osis()).toEqual("Josh.1.1", "parsing: 'யோசுவாவின் புத்தகம் 1:1'")
		expect(p.parse("Yocuva 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Yocuva 1:1'")
		expect(p.parse("Yocuvā 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Yocuvā 1:1'")
		expect(p.parse("Yōcuva 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Yōcuva 1:1'")
		expect(p.parse("Yōcuvā 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Yōcuvā 1:1'")
		expect(p.parse("யோசுவா 1:1").osis()).toEqual("Josh.1.1", "parsing: 'யோசுவா 1:1'")
		expect(p.parse("Josh 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josh 1:1'")
		expect(p.parse("யோசு 1:1").osis()).toEqual("Josh.1.1", "parsing: 'யோசு 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோசுவாவின் புத்தகம் 1:1").osis()).toEqual("Josh.1.1", "parsing: 'யோசுவாவின் புத்தகம் 1:1'")
		expect(p.parse("YOCUVA 1:1").osis()).toEqual("Josh.1.1", "parsing: 'YOCUVA 1:1'")
		expect(p.parse("YOCUVĀ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'YOCUVĀ 1:1'")
		expect(p.parse("YŌCUVA 1:1").osis()).toEqual("Josh.1.1", "parsing: 'YŌCUVA 1:1'")
		expect(p.parse("YŌCUVĀ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'YŌCUVĀ 1:1'")
		expect(p.parse("யோசுவா 1:1").osis()).toEqual("Josh.1.1", "parsing: 'யோசுவா 1:1'")
		expect(p.parse("JOSH 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSH 1:1'")
		expect(p.parse("யோசு 1:1").osis()).toEqual("Josh.1.1", "parsing: 'யோசு 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Judg (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Judg (ta)", function() {
      
		expect(p.parse("நியாயாதிபதிகளின் புத்தகம் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியாயாதிபதிகளின் புத்தகம் 1:1'")
		expect(p.parse("நியாயாதிபதிகள் ஆகமம் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியாயாதிபதிகள் ஆகமம் 1:1'")
		expect(p.parse("நீதித் தலைவர்கள் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நீதித் தலைவர்கள் 1:1'")
		expect(p.parse("Niyayatipatikal 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyayatipatikal 1:1'")
		expect(p.parse("Niyayatipatikaḷ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyayatipatikaḷ 1:1'")
		expect(p.parse("Niyayātipatikal 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyayātipatikal 1:1'")
		expect(p.parse("Niyayātipatikaḷ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyayātipatikaḷ 1:1'")
		expect(p.parse("Niyāyatipatikal 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyāyatipatikal 1:1'")
		expect(p.parse("Niyāyatipatikaḷ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyāyatipatikaḷ 1:1'")
		expect(p.parse("Niyāyātipatikal 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyāyātipatikal 1:1'")
		expect(p.parse("Niyāyātipatikaḷ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Niyāyātipatikaḷ 1:1'")
		expect(p.parse("நியாயாதிபதிகள் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியாயாதிபதிகள் 1:1'")
		expect(p.parse("நீதிபதிகள் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நீதிபதிகள் 1:1'")
		expect(p.parse("Judg 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Judg 1:1'")
		expect(p.parse("நியா 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியா 1:1'")
		expect(p.parse("நீத 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நீத 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("நியாயாதிபதிகளின் புத்தகம் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியாயாதிபதிகளின் புத்தகம் 1:1'")
		expect(p.parse("நியாயாதிபதிகள் ஆகமம் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியாயாதிபதிகள் ஆகமம் 1:1'")
		expect(p.parse("நீதித் தலைவர்கள் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நீதித் தலைவர்கள் 1:1'")
		expect(p.parse("NIYAYATIPATIKAL 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYAYATIPATIKAL 1:1'")
		expect(p.parse("NIYAYATIPATIKAḶ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYAYATIPATIKAḶ 1:1'")
		expect(p.parse("NIYAYĀTIPATIKAL 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYAYĀTIPATIKAL 1:1'")
		expect(p.parse("NIYAYĀTIPATIKAḶ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYAYĀTIPATIKAḶ 1:1'")
		expect(p.parse("NIYĀYATIPATIKAL 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYĀYATIPATIKAL 1:1'")
		expect(p.parse("NIYĀYATIPATIKAḶ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYĀYATIPATIKAḶ 1:1'")
		expect(p.parse("NIYĀYĀTIPATIKAL 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYĀYĀTIPATIKAL 1:1'")
		expect(p.parse("NIYĀYĀTIPATIKAḶ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'NIYĀYĀTIPATIKAḶ 1:1'")
		expect(p.parse("நியாயாதிபதிகள் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியாயாதிபதிகள் 1:1'")
		expect(p.parse("நீதிபதிகள் 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நீதிபதிகள் 1:1'")
		expect(p.parse("JUDG 1:1").osis()).toEqual("Judg.1.1", "parsing: 'JUDG 1:1'")
		expect(p.parse("நியா 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நியா 1:1'")
		expect(p.parse("நீத 1:1").osis()).toEqual("Judg.1.1", "parsing: 'நீத 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ruth (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ruth (ta)", function() {
      
		expect(p.parse("ரூத்தின் சரித்திரம் 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ரூத்தின் சரித்திரம் 1:1'")
		expect(p.parse("ரூத்து 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ரூத்து 1:1'")
		expect(p.parse("Ruth 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruth 1:1'")
		expect(p.parse("ரூத் 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ரூத் 1:1'")
		expect(p.parse("Rut 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Rut 1:1'")
		expect(p.parse("Rūt 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Rūt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ரூத்தின் சரித்திரம் 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ரூத்தின் சரித்திரம் 1:1'")
		expect(p.parse("ரூத்து 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ரூத்து 1:1'")
		expect(p.parse("RUTH 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTH 1:1'")
		expect(p.parse("ரூத் 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'ரூத் 1:1'")
		expect(p.parse("RUT 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUT 1:1'")
		expect(p.parse("RŪT 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RŪT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Esd (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Esd (ta)", function() {
      
		expect(p.parse("1 எஸ்திராஸ் 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 எஸ்திராஸ் 1:1'")
		expect(p.parse("1Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Esd (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Esd (ta)", function() {
      
		expect(p.parse("2 எஸ்திராஸ் 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 எஸ்திராஸ் 1:1'")
		expect(p.parse("2Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Isa (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Isa (ta)", function() {
      
		expect(p.parse("ஏசாயா தீர்க்கதரிசியின் புத்தகம் 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ஏசாயா தீர்க்கதரிசியின் புத்தகம் 1:1'")
		expect(p.parse("Ecaya 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ecaya 1:1'")
		expect(p.parse("Ecayā 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ecayā 1:1'")
		expect(p.parse("Ecāya 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ecāya 1:1'")
		expect(p.parse("Ecāyā 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ecāyā 1:1'")
		expect(p.parse("எசாயா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'எசாயா 1:1'")
		expect(p.parse("ஏசாயா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ஏசாயா 1:1'")
		expect(p.parse("Isa 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isa 1:1'")
		expect(p.parse("எசா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'எசா 1:1'")
		expect(p.parse("ஏசா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ஏசா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ஏசாயா தீர்க்கதரிசியின் புத்தகம் 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ஏசாயா தீர்க்கதரிசியின் புத்தகம் 1:1'")
		expect(p.parse("ECAYA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ECAYA 1:1'")
		expect(p.parse("ECAYĀ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ECAYĀ 1:1'")
		expect(p.parse("ECĀYA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ECĀYA 1:1'")
		expect(p.parse("ECĀYĀ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ECĀYĀ 1:1'")
		expect(p.parse("எசாயா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'எசாயா 1:1'")
		expect(p.parse("ஏசாயா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ஏசாயா 1:1'")
		expect(p.parse("ISA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISA 1:1'")
		expect(p.parse("எசா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'எசா 1:1'")
		expect(p.parse("ஏசா 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ஏசா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Sam (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Sam (ta)", function() {
      
		expect(p.parse("சாமுவேலின் இரண்டாம் புத்தகம் 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'சாமுவேலின் இரண்டாம் புத்தகம் 1:1'")
		expect(p.parse("2 சாமுவேல் 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 சாமுவேல் 1:1'")
		expect(p.parse("2 Camuvel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Camuvel 1:1'")
		expect(p.parse("2 Camuvēl 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Camuvēl 1:1'")
		expect(p.parse("2 Cāmuvel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Cāmuvel 1:1'")
		expect(p.parse("2 Cāmuvēl 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Cāmuvēl 1:1'")
		expect(p.parse("2 அரசுகள் 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 அரசுகள் 1:1'")
		expect(p.parse("2 சாமு 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 சாமு 1:1'")
		expect(p.parse("2Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("சாமுவேலின் இரண்டாம் புத்தகம் 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'சாமுவேலின் இரண்டாம் புத்தகம் 1:1'")
		expect(p.parse("2 சாமுவேல் 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 சாமுவேல் 1:1'")
		expect(p.parse("2 CAMUVEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 CAMUVEL 1:1'")
		expect(p.parse("2 CAMUVĒL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 CAMUVĒL 1:1'")
		expect(p.parse("2 CĀMUVEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 CĀMUVEL 1:1'")
		expect(p.parse("2 CĀMUVĒL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 CĀMUVĒL 1:1'")
		expect(p.parse("2 அரசுகள் 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 அரசுகள் 1:1'")
		expect(p.parse("2 சாமு 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 சாமு 1:1'")
		expect(p.parse("2SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2SAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Sam (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Sam (ta)", function() {
      
		expect(p.parse("சாமுவேலின் முதலாம் புத்தகம் 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'சாமுவேலின் முதலாம் புத்தகம் 1:1'")
		expect(p.parse("1 சாமுவேல் 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 சாமுவேல் 1:1'")
		expect(p.parse("1 Camuvel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Camuvel 1:1'")
		expect(p.parse("1 Camuvēl 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Camuvēl 1:1'")
		expect(p.parse("1 Cāmuvel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Cāmuvel 1:1'")
		expect(p.parse("1 Cāmuvēl 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Cāmuvēl 1:1'")
		expect(p.parse("1 அரசுகள் 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 அரசுகள் 1:1'")
		expect(p.parse("1 சாமு 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 சாமு 1:1'")
		expect(p.parse("1Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("சாமுவேலின் முதலாம் புத்தகம் 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'சாமுவேலின் முதலாம் புத்தகம் 1:1'")
		expect(p.parse("1 சாமுவேல் 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 சாமுவேல் 1:1'")
		expect(p.parse("1 CAMUVEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 CAMUVEL 1:1'")
		expect(p.parse("1 CAMUVĒL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 CAMUVĒL 1:1'")
		expect(p.parse("1 CĀMUVEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 CĀMUVEL 1:1'")
		expect(p.parse("1 CĀMUVĒL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 CĀMUVĒL 1:1'")
		expect(p.parse("1 அரசுகள் 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 அரசுகள் 1:1'")
		expect(p.parse("1 சாமு 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 சாமு 1:1'")
		expect(p.parse("1SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1SAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Kgs (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Kgs (ta)", function() {
      
		expect(p.parse("இராஜாக்களின் இரண்டாம் புத்தகம் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'இராஜாக்களின் இரண்டாம் புத்தகம் 1:1'")
		expect(p.parse("2 இராஜாக்கள் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 இராஜாக்கள் 1:1'")
		expect(p.parse("2 Irajakkal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irajakkal 1:1'")
		expect(p.parse("2 Irajakkaḷ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irajakkaḷ 1:1'")
		expect(p.parse("2 Irajākkal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irajākkal 1:1'")
		expect(p.parse("2 Irajākkaḷ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irajākkaḷ 1:1'")
		expect(p.parse("2 Irājakkal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irājakkal 1:1'")
		expect(p.parse("2 Irājakkaḷ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irājakkaḷ 1:1'")
		expect(p.parse("2 Irājākkal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irājākkal 1:1'")
		expect(p.parse("2 Irājākkaḷ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Irājākkaḷ 1:1'")
		expect(p.parse("2 அரசர்கள் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 அரசர்கள் 1:1'")
		expect(p.parse("4 அரசுகள் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 அரசுகள் 1:1'")
		expect(p.parse("2 இராஜா 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 இராஜா 1:1'")
		expect(p.parse("2 இரா 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 இரா 1:1'")
		expect(p.parse("2 அர 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 அர 1:1'")
		expect(p.parse("2Kgs 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("இராஜாக்களின் இரண்டாம் புத்தகம் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'இராஜாக்களின் இரண்டாம் புத்தகம் 1:1'")
		expect(p.parse("2 இராஜாக்கள் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 இராஜாக்கள் 1:1'")
		expect(p.parse("2 IRAJAKKAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRAJAKKAL 1:1'")
		expect(p.parse("2 IRAJAKKAḶ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRAJAKKAḶ 1:1'")
		expect(p.parse("2 IRAJĀKKAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRAJĀKKAL 1:1'")
		expect(p.parse("2 IRAJĀKKAḶ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRAJĀKKAḶ 1:1'")
		expect(p.parse("2 IRĀJAKKAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRĀJAKKAL 1:1'")
		expect(p.parse("2 IRĀJAKKAḶ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRĀJAKKAḶ 1:1'")
		expect(p.parse("2 IRĀJĀKKAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRĀJĀKKAL 1:1'")
		expect(p.parse("2 IRĀJĀKKAḶ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 IRĀJĀKKAḶ 1:1'")
		expect(p.parse("2 அரசர்கள் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 அரசர்கள் 1:1'")
		expect(p.parse("4 அரசுகள் 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 அரசுகள் 1:1'")
		expect(p.parse("2 இராஜா 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 இராஜா 1:1'")
		expect(p.parse("2 இரா 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 இரா 1:1'")
		expect(p.parse("2 அர 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 அர 1:1'")
		expect(p.parse("2KGS 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2KGS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Kgs (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Kgs (ta)", function() {
      
		expect(p.parse("இராஜாக்களின் முதலாம் புத்தகம் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'இராஜாக்களின் முதலாம் புத்தகம் 1:1'")
		expect(p.parse("1 இராஜாக்கள் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 இராஜாக்கள் 1:1'")
		expect(p.parse("1 Irajakkal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irajakkal 1:1'")
		expect(p.parse("1 Irajakkaḷ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irajakkaḷ 1:1'")
		expect(p.parse("1 Irajākkal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irajākkal 1:1'")
		expect(p.parse("1 Irajākkaḷ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irajākkaḷ 1:1'")
		expect(p.parse("1 Irājakkal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irājakkal 1:1'")
		expect(p.parse("1 Irājakkaḷ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irājakkaḷ 1:1'")
		expect(p.parse("1 Irājākkal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irājākkal 1:1'")
		expect(p.parse("1 Irājākkaḷ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Irājākkaḷ 1:1'")
		expect(p.parse("1 அரசர்கள் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 அரசர்கள் 1:1'")
		expect(p.parse("3 அரசுகள் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 அரசுகள் 1:1'")
		expect(p.parse("1 இராஜா 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 இராஜா 1:1'")
		expect(p.parse("1 இரா 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 இரா 1:1'")
		expect(p.parse("1 அர 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 அர 1:1'")
		expect(p.parse("1Kgs 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("இராஜாக்களின் முதலாம் புத்தகம் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'இராஜாக்களின் முதலாம் புத்தகம் 1:1'")
		expect(p.parse("1 இராஜாக்கள் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 இராஜாக்கள் 1:1'")
		expect(p.parse("1 IRAJAKKAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRAJAKKAL 1:1'")
		expect(p.parse("1 IRAJAKKAḶ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRAJAKKAḶ 1:1'")
		expect(p.parse("1 IRAJĀKKAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRAJĀKKAL 1:1'")
		expect(p.parse("1 IRAJĀKKAḶ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRAJĀKKAḶ 1:1'")
		expect(p.parse("1 IRĀJAKKAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRĀJAKKAL 1:1'")
		expect(p.parse("1 IRĀJAKKAḶ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRĀJAKKAḶ 1:1'")
		expect(p.parse("1 IRĀJĀKKAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRĀJĀKKAL 1:1'")
		expect(p.parse("1 IRĀJĀKKAḶ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 IRĀJĀKKAḶ 1:1'")
		expect(p.parse("1 அரசர்கள் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 அரசர்கள் 1:1'")
		expect(p.parse("3 அரசுகள் 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 அரசுகள் 1:1'")
		expect(p.parse("1 இராஜா 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 இராஜா 1:1'")
		expect(p.parse("1 இரா 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 இரா 1:1'")
		expect(p.parse("1 அர 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 அர 1:1'")
		expect(p.parse("1KGS 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1KGS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Chr (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Chr (ta)", function() {
      
		expect(p.parse("நாளாகமத்தின் இரண்டாம் புத்தகம் 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'நாளாகமத்தின் இரண்டாம் புத்தகம் 1:1'")
		expect(p.parse("2 குறிப்பேடு 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 குறிப்பேடு 1:1'")
		expect(p.parse("2 Nalakamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nalakamam 1:1'")
		expect(p.parse("2 Nalākamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nalākamam 1:1'")
		expect(p.parse("2 Naḷakamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Naḷakamam 1:1'")
		expect(p.parse("2 Naḷākamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Naḷākamam 1:1'")
		expect(p.parse("2 Nālakamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nālakamam 1:1'")
		expect(p.parse("2 Nālākamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nālākamam 1:1'")
		expect(p.parse("2 Nāḷakamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nāḷakamam 1:1'")
		expect(p.parse("2 Nāḷākamam 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nāḷākamam 1:1'")
		expect(p.parse("2 நாளாகமம் 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 நாளாகமம் 1:1'")
		expect(p.parse("2 குறி 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 குறி 1:1'")
		expect(p.parse("2 நாளா 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 நாளா 1:1'")
		expect(p.parse("2Chr 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("நாளாகமத்தின் இரண்டாம் புத்தகம் 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'நாளாகமத்தின் இரண்டாம் புத்தகம் 1:1'")
		expect(p.parse("2 குறிப்பேடு 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 குறிப்பேடு 1:1'")
		expect(p.parse("2 NALAKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NALAKAMAM 1:1'")
		expect(p.parse("2 NALĀKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NALĀKAMAM 1:1'")
		expect(p.parse("2 NAḶAKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NAḶAKAMAM 1:1'")
		expect(p.parse("2 NAḶĀKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NAḶĀKAMAM 1:1'")
		expect(p.parse("2 NĀLAKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NĀLAKAMAM 1:1'")
		expect(p.parse("2 NĀLĀKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NĀLĀKAMAM 1:1'")
		expect(p.parse("2 NĀḶAKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NĀḶAKAMAM 1:1'")
		expect(p.parse("2 NĀḶĀKAMAM 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NĀḶĀKAMAM 1:1'")
		expect(p.parse("2 நாளாகமம் 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 நாளாகமம் 1:1'")
		expect(p.parse("2 குறி 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 குறி 1:1'")
		expect(p.parse("2 நாளா 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 நாளா 1:1'")
		expect(p.parse("2CHR 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Chr (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Chr (ta)", function() {
      
		expect(p.parse("நாளாகமத்தின் முதலாம் புத்தகம் 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'நாளாகமத்தின் முதலாம் புத்தகம் 1:1'")
		expect(p.parse("1 குறிப்பேடு 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 குறிப்பேடு 1:1'")
		expect(p.parse("1 Nalakamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nalakamam 1:1'")
		expect(p.parse("1 Nalākamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nalākamam 1:1'")
		expect(p.parse("1 Naḷakamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Naḷakamam 1:1'")
		expect(p.parse("1 Naḷākamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Naḷākamam 1:1'")
		expect(p.parse("1 Nālakamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nālakamam 1:1'")
		expect(p.parse("1 Nālākamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nālākamam 1:1'")
		expect(p.parse("1 Nāḷakamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nāḷakamam 1:1'")
		expect(p.parse("1 Nāḷākamam 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nāḷākamam 1:1'")
		expect(p.parse("1 நாளாகமம் 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 நாளாகமம் 1:1'")
		expect(p.parse("1 குறி 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 குறி 1:1'")
		expect(p.parse("1 நாளா 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 நாளா 1:1'")
		expect(p.parse("1Chr 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("நாளாகமத்தின் முதலாம் புத்தகம் 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'நாளாகமத்தின் முதலாம் புத்தகம் 1:1'")
		expect(p.parse("1 குறிப்பேடு 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 குறிப்பேடு 1:1'")
		expect(p.parse("1 NALAKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NALAKAMAM 1:1'")
		expect(p.parse("1 NALĀKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NALĀKAMAM 1:1'")
		expect(p.parse("1 NAḶAKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NAḶAKAMAM 1:1'")
		expect(p.parse("1 NAḶĀKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NAḶĀKAMAM 1:1'")
		expect(p.parse("1 NĀLAKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NĀLAKAMAM 1:1'")
		expect(p.parse("1 NĀLĀKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NĀLĀKAMAM 1:1'")
		expect(p.parse("1 NĀḶAKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NĀḶAKAMAM 1:1'")
		expect(p.parse("1 NĀḶĀKAMAM 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NĀḶĀKAMAM 1:1'")
		expect(p.parse("1 நாளாகமம் 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 நாளாகமம் 1:1'")
		expect(p.parse("1 குறி 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 குறி 1:1'")
		expect(p.parse("1 நாளா 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 நாளா 1:1'")
		expect(p.parse("1CHR 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezra (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ezra (ta)", function() {
      
		expect(p.parse("எஸ்றாவின் புத்தகம் 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'எஸ்றாவின் புத்தகம் 1:1'")
		expect(p.parse("எஸ்ரா 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'எஸ்ரா 1:1'")
		expect(p.parse("எஸ்றா 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'எஸ்றா 1:1'")
		expect(p.parse("Esra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Esra 1:1'")
		expect(p.parse("Esrā 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Esrā 1:1'")
		expect(p.parse("Esṛa 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Esṛa 1:1'")
		expect(p.parse("Esṛā 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Esṛā 1:1'")
		expect(p.parse("Ezra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezra 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எஸ்றாவின் புத்தகம் 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'எஸ்றாவின் புத்தகம் 1:1'")
		expect(p.parse("எஸ்ரா 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'எஸ்ரா 1:1'")
		expect(p.parse("எஸ்றா 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'எஸ்றா 1:1'")
		expect(p.parse("ESRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ESRA 1:1'")
		expect(p.parse("ESRĀ 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ESRĀ 1:1'")
		expect(p.parse("ESṚA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ESṚA 1:1'")
		expect(p.parse("ESṚĀ 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ESṚĀ 1:1'")
		expect(p.parse("EZRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZRA 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Neh (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Neh (ta)", function() {
      
		expect(p.parse("நெகேமியாவின் புத்தகம் 1:1").osis()).toEqual("Neh.1.1", "parsing: 'நெகேமியாவின் புத்தகம் 1:1'")
		expect(p.parse("Nekemiya 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nekemiya 1:1'")
		expect(p.parse("Nekemiyā 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nekemiyā 1:1'")
		expect(p.parse("Nekēmiya 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nekēmiya 1:1'")
		expect(p.parse("Nekēmiyā 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nekēmiyā 1:1'")
		expect(p.parse("நெகேமியா 1:1").osis()).toEqual("Neh.1.1", "parsing: 'நெகேமியா 1:1'")
		expect(p.parse("நெகே 1:1").osis()).toEqual("Neh.1.1", "parsing: 'நெகே 1:1'")
		expect(p.parse("Neh 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Neh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("நெகேமியாவின் புத்தகம் 1:1").osis()).toEqual("Neh.1.1", "parsing: 'நெகேமியாவின் புத்தகம் 1:1'")
		expect(p.parse("NEKEMIYA 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEKEMIYA 1:1'")
		expect(p.parse("NEKEMIYĀ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEKEMIYĀ 1:1'")
		expect(p.parse("NEKĒMIYA 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEKĒMIYA 1:1'")
		expect(p.parse("NEKĒMIYĀ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEKĒMIYĀ 1:1'")
		expect(p.parse("நெகேமியா 1:1").osis()).toEqual("Neh.1.1", "parsing: 'நெகேமியா 1:1'")
		expect(p.parse("நெகே 1:1").osis()).toEqual("Neh.1.1", "parsing: 'நெகே 1:1'")
		expect(p.parse("NEH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book GkEsth (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: GkEsth (ta)", function() {
      
		expect(p.parse("எஸ்தர் \(கிரேக்கம்\) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'எஸ்தர் \(கிரேக்கம்\) 1:1'")
		expect(p.parse("எஸ்தர் \(கி\) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'எஸ்தர் \(கி\) 1:1'")
		expect(p.parse("எஸ்தர் (கி) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'எஸ்தர் (கி) 1:1'")
		expect(p.parse("எஸ் \(கி\) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'எஸ் \(கி\) 1:1'")
		expect(p.parse("எஸ் (கி) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'எஸ் (கி) 1:1'")
		expect(p.parse("GkEsth 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'GkEsth 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Esth (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Esth (ta)", function() {
      
		expect(p.parse("எஸ்தரின் சரித்திரம் 1:1").osis()).toEqual("Esth.1.1", "parsing: 'எஸ்தரின் சரித்திரம் 1:1'")
		expect(p.parse("எஸ்தர் 1:1").osis()).toEqual("Esth.1.1", "parsing: 'எஸ்தர் 1:1'")
		expect(p.parse("Estar 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Estar 1:1'")
		expect(p.parse("Esth 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esth 1:1'")
		expect(p.parse("எஸ் 1:1").osis()).toEqual("Esth.1.1", "parsing: 'எஸ் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எஸ்தரின் சரித்திரம் 1:1").osis()).toEqual("Esth.1.1", "parsing: 'எஸ்தரின் சரித்திரம் 1:1'")
		expect(p.parse("எஸ்தர் 1:1").osis()).toEqual("Esth.1.1", "parsing: 'எஸ்தர் 1:1'")
		expect(p.parse("ESTAR 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTAR 1:1'")
		expect(p.parse("ESTH 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTH 1:1'")
		expect(p.parse("எஸ் 1:1").osis()).toEqual("Esth.1.1", "parsing: 'எஸ் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Job (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Job (ta)", function() {
      
		expect(p.parse("யோபுடைய சரித்திரம் 1:1").osis()).toEqual("Job.1.1", "parsing: 'யோபுடைய சரித்திரம் 1:1'")
		expect(p.parse("Yopu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Yopu 1:1'")
		expect(p.parse("Yōpu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Yōpu 1:1'")
		expect(p.parse("யோபு 1:1").osis()).toEqual("Job.1.1", "parsing: 'யோபு 1:1'")
		expect(p.parse("Job 1:1").osis()).toEqual("Job.1.1", "parsing: 'Job 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோபுடைய சரித்திரம் 1:1").osis()).toEqual("Job.1.1", "parsing: 'யோபுடைய சரித்திரம் 1:1'")
		expect(p.parse("YOPU 1:1").osis()).toEqual("Job.1.1", "parsing: 'YOPU 1:1'")
		expect(p.parse("YŌPU 1:1").osis()).toEqual("Job.1.1", "parsing: 'YŌPU 1:1'")
		expect(p.parse("யோபு 1:1").osis()).toEqual("Job.1.1", "parsing: 'யோபு 1:1'")
		expect(p.parse("JOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JOB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book SgThree (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: SgThree (ta)", function() {
      
		expect(p.parse("இளைஞர் மூவரின் பாடல் 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'இளைஞர் மூவரின் பாடல் 1:1'")
		expect(p.parse("SgThree 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'SgThree 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Song (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Song (ta)", function() {
      
		expect(p.parse("சாலொமோனின் உன்னதப்பாட்டு 1:1").osis()).toEqual("Song.1.1", "parsing: 'சாலொமோனின் உன்னதப்பாட்டு 1:1'")
		expect(p.parse("இனிமைமிகு பாடல் 1:1").osis()).toEqual("Song.1.1", "parsing: 'இனிமைமிகு பாடல் 1:1'")
		expect(p.parse("உன்னத சங்கீதம் 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்னத சங்கீதம் 1:1'")
		expect(p.parse("உன்னதப்பாட்டு 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்னதப்பாட்டு 1:1'")
		expect(p.parse("Unnatappattu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappattu 1:1'")
		expect(p.parse("Unnatappatṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappatṭu 1:1'")
		expect(p.parse("Unnatappaṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappaṭtu 1:1'")
		expect(p.parse("Unnatappaṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappaṭṭu 1:1'")
		expect(p.parse("Unnatappāttu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappāttu 1:1'")
		expect(p.parse("Unnatappātṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappātṭu 1:1'")
		expect(p.parse("Unnatappāṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappāṭtu 1:1'")
		expect(p.parse("Unnatappāṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unnatappāṭṭu 1:1'")
		expect(p.parse("Unṉatappattu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappattu 1:1'")
		expect(p.parse("Unṉatappatṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappatṭu 1:1'")
		expect(p.parse("Unṉatappaṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappaṭtu 1:1'")
		expect(p.parse("Unṉatappaṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappaṭṭu 1:1'")
		expect(p.parse("Unṉatappāttu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappāttu 1:1'")
		expect(p.parse("Unṉatappātṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappātṭu 1:1'")
		expect(p.parse("Unṉatappāṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappāṭtu 1:1'")
		expect(p.parse("Unṉatappāṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Unṉatappāṭṭu 1:1'")
		expect(p.parse("Uṉnatappattu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappattu 1:1'")
		expect(p.parse("Uṉnatappatṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappatṭu 1:1'")
		expect(p.parse("Uṉnatappaṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappaṭtu 1:1'")
		expect(p.parse("Uṉnatappaṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappaṭṭu 1:1'")
		expect(p.parse("Uṉnatappāttu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappāttu 1:1'")
		expect(p.parse("Uṉnatappātṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappātṭu 1:1'")
		expect(p.parse("Uṉnatappāṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappāṭtu 1:1'")
		expect(p.parse("Uṉnatappāṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉnatappāṭṭu 1:1'")
		expect(p.parse("Uṉṉatappattu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappattu 1:1'")
		expect(p.parse("Uṉṉatappatṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappatṭu 1:1'")
		expect(p.parse("Uṉṉatappaṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappaṭtu 1:1'")
		expect(p.parse("Uṉṉatappaṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappaṭṭu 1:1'")
		expect(p.parse("Uṉṉatappāttu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappāttu 1:1'")
		expect(p.parse("Uṉṉatappātṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappātṭu 1:1'")
		expect(p.parse("Uṉṉatappāṭtu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappāṭtu 1:1'")
		expect(p.parse("Uṉṉatappāṭṭu 1:1").osis()).toEqual("Song.1.1", "parsing: 'Uṉṉatappāṭṭu 1:1'")
		expect(p.parse("உன்னத பாட்டு 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்னத பாட்டு 1:1'")
		expect(p.parse("பாடல் 1:1").osis()).toEqual("Song.1.1", "parsing: 'பாடல் 1:1'")
		expect(p.parse("Song 1:1").osis()).toEqual("Song.1.1", "parsing: 'Song 1:1'")
		expect(p.parse("உன்ன 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்ன 1:1'")
		expect(p.parse("இபா 1:1").osis()).toEqual("Song.1.1", "parsing: 'இபா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("சாலொமோனின் உன்னதப்பாட்டு 1:1").osis()).toEqual("Song.1.1", "parsing: 'சாலொமோனின் உன்னதப்பாட்டு 1:1'")
		expect(p.parse("இனிமைமிகு பாடல் 1:1").osis()).toEqual("Song.1.1", "parsing: 'இனிமைமிகு பாடல் 1:1'")
		expect(p.parse("உன்னத சங்கீதம் 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்னத சங்கீதம் 1:1'")
		expect(p.parse("உன்னதப்பாட்டு 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்னதப்பாட்டு 1:1'")
		expect(p.parse("UNNATAPPATTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPATTU 1:1'")
		expect(p.parse("UNNATAPPATṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPATṬU 1:1'")
		expect(p.parse("UNNATAPPAṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPAṬTU 1:1'")
		expect(p.parse("UNNATAPPAṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPAṬṬU 1:1'")
		expect(p.parse("UNNATAPPĀTTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPĀTTU 1:1'")
		expect(p.parse("UNNATAPPĀTṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPĀTṬU 1:1'")
		expect(p.parse("UNNATAPPĀṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPĀṬTU 1:1'")
		expect(p.parse("UNNATAPPĀṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNNATAPPĀṬṬU 1:1'")
		expect(p.parse("UNṈATAPPATTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPATTU 1:1'")
		expect(p.parse("UNṈATAPPATṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPATṬU 1:1'")
		expect(p.parse("UNṈATAPPAṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPAṬTU 1:1'")
		expect(p.parse("UNṈATAPPAṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPAṬṬU 1:1'")
		expect(p.parse("UNṈATAPPĀTTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPĀTTU 1:1'")
		expect(p.parse("UNṈATAPPĀTṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPĀTṬU 1:1'")
		expect(p.parse("UNṈATAPPĀṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPĀṬTU 1:1'")
		expect(p.parse("UNṈATAPPĀṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UNṈATAPPĀṬṬU 1:1'")
		expect(p.parse("UṈNATAPPATTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPATTU 1:1'")
		expect(p.parse("UṈNATAPPATṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPATṬU 1:1'")
		expect(p.parse("UṈNATAPPAṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPAṬTU 1:1'")
		expect(p.parse("UṈNATAPPAṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPAṬṬU 1:1'")
		expect(p.parse("UṈNATAPPĀTTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPĀTTU 1:1'")
		expect(p.parse("UṈNATAPPĀTṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPĀTṬU 1:1'")
		expect(p.parse("UṈNATAPPĀṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPĀṬTU 1:1'")
		expect(p.parse("UṈNATAPPĀṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈNATAPPĀṬṬU 1:1'")
		expect(p.parse("UṈṈATAPPATTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPATTU 1:1'")
		expect(p.parse("UṈṈATAPPATṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPATṬU 1:1'")
		expect(p.parse("UṈṈATAPPAṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPAṬTU 1:1'")
		expect(p.parse("UṈṈATAPPAṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPAṬṬU 1:1'")
		expect(p.parse("UṈṈATAPPĀTTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPĀTTU 1:1'")
		expect(p.parse("UṈṈATAPPĀTṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPĀTṬU 1:1'")
		expect(p.parse("UṈṈATAPPĀṬTU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPĀṬTU 1:1'")
		expect(p.parse("UṈṈATAPPĀṬṬU 1:1").osis()).toEqual("Song.1.1", "parsing: 'UṈṈATAPPĀṬṬU 1:1'")
		expect(p.parse("உன்னத பாட்டு 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்னத பாட்டு 1:1'")
		expect(p.parse("பாடல் 1:1").osis()).toEqual("Song.1.1", "parsing: 'பாடல் 1:1'")
		expect(p.parse("SONG 1:1").osis()).toEqual("Song.1.1", "parsing: 'SONG 1:1'")
		expect(p.parse("உன்ன 1:1").osis()).toEqual("Song.1.1", "parsing: 'உன்ன 1:1'")
		expect(p.parse("இபா 1:1").osis()).toEqual("Song.1.1", "parsing: 'இபா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ps (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ps (ta)", function() {
      
		expect(p.parse("சங்கீத புத்தகம் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீத புத்தகம் 1:1'")
		expect(p.parse("திருப்பாடல்கள் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'திருப்பாடல்கள் 1:1'")
		expect(p.parse("சங்கீதங்கள் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீதங்கள் 1:1'")
		expect(p.parse("திருப்பாடல் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'திருப்பாடல் 1:1'")
		expect(p.parse("Cankitam 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Cankitam 1:1'")
		expect(p.parse("Cankītam 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Cankītam 1:1'")
		expect(p.parse("Caṅkitam 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Caṅkitam 1:1'")
		expect(p.parse("Caṅkītam 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Caṅkītam 1:1'")
		expect(p.parse("சங்கீதம் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீதம் 1:1'")
		expect(p.parse("சஙகீதம் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சஙகீதம் 1:1'")
		expect(p.parse("சங்கீ 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீ 1:1'")
		expect(p.parse("திபா 1:1").osis()).toEqual("Ps.1.1", "parsing: 'திபா 1:1'")
		expect(p.parse("சங் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங் 1:1'")
		expect(p.parse("Ps 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Ps 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("சங்கீத புத்தகம் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீத புத்தகம் 1:1'")
		expect(p.parse("திருப்பாடல்கள் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'திருப்பாடல்கள் 1:1'")
		expect(p.parse("சங்கீதங்கள் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீதங்கள் 1:1'")
		expect(p.parse("திருப்பாடல் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'திருப்பாடல் 1:1'")
		expect(p.parse("CANKITAM 1:1").osis()).toEqual("Ps.1.1", "parsing: 'CANKITAM 1:1'")
		expect(p.parse("CANKĪTAM 1:1").osis()).toEqual("Ps.1.1", "parsing: 'CANKĪTAM 1:1'")
		expect(p.parse("CAṄKITAM 1:1").osis()).toEqual("Ps.1.1", "parsing: 'CAṄKITAM 1:1'")
		expect(p.parse("CAṄKĪTAM 1:1").osis()).toEqual("Ps.1.1", "parsing: 'CAṄKĪTAM 1:1'")
		expect(p.parse("சங்கீதம் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீதம் 1:1'")
		expect(p.parse("சஙகீதம் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சஙகீதம் 1:1'")
		expect(p.parse("சங்கீ 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங்கீ 1:1'")
		expect(p.parse("திபா 1:1").osis()).toEqual("Ps.1.1", "parsing: 'திபா 1:1'")
		expect(p.parse("சங் 1:1").osis()).toEqual("Ps.1.1", "parsing: 'சங் 1:1'")
		expect(p.parse("PS 1:1").osis()).toEqual("Ps.1.1", "parsing: 'PS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrAzar (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: PrAzar (ta)", function() {
      
		expect(p.parse("PrAzar 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'PrAzar 1:1'")
		expect(p.parse("அசரியா 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'அசரியா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Prov (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Prov (ta)", function() {
      
		expect(p.parse("பழமொழி ஆகமம் 1:1").osis()).toEqual("Prov.1.1", "parsing: 'பழமொழி ஆகமம் 1:1'")
		expect(p.parse("Nitimolikal 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nitimolikal 1:1'")
		expect(p.parse("Nitimolikaḷ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nitimolikaḷ 1:1'")
		expect(p.parse("Nitimoḻikal 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nitimoḻikal 1:1'")
		expect(p.parse("Nitimoḻikaḷ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nitimoḻikaḷ 1:1'")
		expect(p.parse("Nītimolikal 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nītimolikal 1:1'")
		expect(p.parse("Nītimolikaḷ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nītimolikaḷ 1:1'")
		expect(p.parse("Nītimoḻikal 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nītimoḻikal 1:1'")
		expect(p.parse("Nītimoḻikaḷ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Nītimoḻikaḷ 1:1'")
		expect(p.parse("நீதிமொழிகள் 1:1").osis()).toEqual("Prov.1.1", "parsing: 'நீதிமொழிகள் 1:1'")
		expect(p.parse("Prov 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Prov 1:1'")
		expect(p.parse("நீதி 1:1").osis()).toEqual("Prov.1.1", "parsing: 'நீதி 1:1'")
		expect(p.parse("நீமொ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'நீமொ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("பழமொழி ஆகமம் 1:1").osis()).toEqual("Prov.1.1", "parsing: 'பழமொழி ஆகமம் 1:1'")
		expect(p.parse("NITIMOLIKAL 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NITIMOLIKAL 1:1'")
		expect(p.parse("NITIMOLIKAḶ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NITIMOLIKAḶ 1:1'")
		expect(p.parse("NITIMOḺIKAL 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NITIMOḺIKAL 1:1'")
		expect(p.parse("NITIMOḺIKAḶ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NITIMOḺIKAḶ 1:1'")
		expect(p.parse("NĪTIMOLIKAL 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NĪTIMOLIKAL 1:1'")
		expect(p.parse("NĪTIMOLIKAḶ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NĪTIMOLIKAḶ 1:1'")
		expect(p.parse("NĪTIMOḺIKAL 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NĪTIMOḺIKAL 1:1'")
		expect(p.parse("NĪTIMOḺIKAḶ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'NĪTIMOḺIKAḶ 1:1'")
		expect(p.parse("நீதிமொழிகள் 1:1").osis()).toEqual("Prov.1.1", "parsing: 'நீதிமொழிகள் 1:1'")
		expect(p.parse("PROV 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PROV 1:1'")
		expect(p.parse("நீதி 1:1").osis()).toEqual("Prov.1.1", "parsing: 'நீதி 1:1'")
		expect(p.parse("நீமொ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'நீமொ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eccl (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Eccl (ta)", function() {
      
		expect(p.parse("சங்கத் திருவுரை ஆகமம் 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'சங்கத் திருவுரை ஆகமம் 1:1'")
		expect(p.parse("சபை உரையாளர் 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'சபை உரையாளர் 1:1'")
		expect(p.parse("Piracanki 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Piracanki 1:1'")
		expect(p.parse("Piracaṅki 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Piracaṅki 1:1'")
		expect(p.parse("பிரசங்கி 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'பிரசங்கி 1:1'")
		expect(p.parse("Eccl 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eccl 1:1'")
		expect(p.parse("பிரச 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'பிரச 1:1'")
		expect(p.parse("சஉ 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'சஉ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("சங்கத் திருவுரை ஆகமம் 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'சங்கத் திருவுரை ஆகமம் 1:1'")
		expect(p.parse("சபை உரையாளர் 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'சபை உரையாளர் 1:1'")
		expect(p.parse("PIRACANKI 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PIRACANKI 1:1'")
		expect(p.parse("PIRACAṄKI 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'PIRACAṄKI 1:1'")
		expect(p.parse("பிரசங்கி 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'பிரசங்கி 1:1'")
		expect(p.parse("ECCL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCL 1:1'")
		expect(p.parse("பிரச 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'பிரச 1:1'")
		expect(p.parse("சஉ 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'சஉ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jer (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jer (ta)", function() {
      
		expect(p.parse("எரேமியா தீர்க்கதரிசியின் புத்தகம் 1:1").osis()).toEqual("Jer.1.1", "parsing: 'எரேமியா தீர்க்கதரிசியின் புத்தகம் 1:1'")
		expect(p.parse("Eremiya 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Eremiya 1:1'")
		expect(p.parse("Eremiyā 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Eremiyā 1:1'")
		expect(p.parse("Erēmiya 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Erēmiya 1:1'")
		expect(p.parse("Erēmiyā 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Erēmiyā 1:1'")
		expect(p.parse("எரேமியா 1:1").osis()).toEqual("Jer.1.1", "parsing: 'எரேமியா 1:1'")
		expect(p.parse("ஏரேமியா 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ஏரேமியா 1:1'")
		expect(p.parse("Jer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jer 1:1'")
		expect(p.parse("எரே 1:1").osis()).toEqual("Jer.1.1", "parsing: 'எரே 1:1'")
		expect(p.parse("ஏரே 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ஏரே 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எரேமியா தீர்க்கதரிசியின் புத்தகம் 1:1").osis()).toEqual("Jer.1.1", "parsing: 'எரேமியா தீர்க்கதரிசியின் புத்தகம் 1:1'")
		expect(p.parse("EREMIYA 1:1").osis()).toEqual("Jer.1.1", "parsing: 'EREMIYA 1:1'")
		expect(p.parse("EREMIYĀ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'EREMIYĀ 1:1'")
		expect(p.parse("ERĒMIYA 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ERĒMIYA 1:1'")
		expect(p.parse("ERĒMIYĀ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ERĒMIYĀ 1:1'")
		expect(p.parse("எரேமியா 1:1").osis()).toEqual("Jer.1.1", "parsing: 'எரேமியா 1:1'")
		expect(p.parse("ஏரேமியா 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ஏரேமியா 1:1'")
		expect(p.parse("JER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JER 1:1'")
		expect(p.parse("எரே 1:1").osis()).toEqual("Jer.1.1", "parsing: 'எரே 1:1'")
		expect(p.parse("ஏரே 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ஏரே 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezek (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ezek (ta)", function() {
      
		expect(p.parse("எசேக்கியேல் தீர்க்கதரிசியின் புத்தகம் 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'எசேக்கியேல் தீர்க்கதரிசியின் புத்தகம் 1:1'")
		expect(p.parse("எசேக்கியேல் 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'எசேக்கியேல் 1:1'")
		expect(p.parse("Ecekkiyel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ecekkiyel 1:1'")
		expect(p.parse("Ecekkiyēl 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ecekkiyēl 1:1'")
		expect(p.parse("Ecēkkiyel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ecēkkiyel 1:1'")
		expect(p.parse("Ecēkkiyēl 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ecēkkiyēl 1:1'")
		expect(p.parse("Ezek 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezek 1:1'")
		expect(p.parse("எசே 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'எசே 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எசேக்கியேல் தீர்க்கதரிசியின் புத்தகம் 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'எசேக்கியேல் தீர்க்கதரிசியின் புத்தகம் 1:1'")
		expect(p.parse("எசேக்கியேல் 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'எசேக்கியேல் 1:1'")
		expect(p.parse("ECEKKIYEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ECEKKIYEL 1:1'")
		expect(p.parse("ECEKKIYĒL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ECEKKIYĒL 1:1'")
		expect(p.parse("ECĒKKIYEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ECĒKKIYEL 1:1'")
		expect(p.parse("ECĒKKIYĒL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ECĒKKIYĒL 1:1'")
		expect(p.parse("EZEK 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEK 1:1'")
		expect(p.parse("எசே 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'எசே 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Dan (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Dan (ta)", function() {
      
		expect(p.parse("தானியேலின் புத்தகம் 1:1").osis()).toEqual("Dan.1.1", "parsing: 'தானியேலின் புத்தகம் 1:1'")
		expect(p.parse("தானியேல் 1:1").osis()).toEqual("Dan.1.1", "parsing: 'தானியேல் 1:1'")
		expect(p.parse("Taniyel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Taniyel 1:1'")
		expect(p.parse("Taniyēl 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Taniyēl 1:1'")
		expect(p.parse("Taṉiyel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Taṉiyel 1:1'")
		expect(p.parse("Taṉiyēl 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Taṉiyēl 1:1'")
		expect(p.parse("Tāniyel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Tāniyel 1:1'")
		expect(p.parse("Tāniyēl 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Tāniyēl 1:1'")
		expect(p.parse("Tāṉiyel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Tāṉiyel 1:1'")
		expect(p.parse("Tāṉiyēl 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Tāṉiyēl 1:1'")
		expect(p.parse("தானி 1:1").osis()).toEqual("Dan.1.1", "parsing: 'தானி 1:1'")
		expect(p.parse("Dan 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dan 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("தானியேலின் புத்தகம் 1:1").osis()).toEqual("Dan.1.1", "parsing: 'தானியேலின் புத்தகம் 1:1'")
		expect(p.parse("தானியேல் 1:1").osis()).toEqual("Dan.1.1", "parsing: 'தானியேல் 1:1'")
		expect(p.parse("TANIYEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TANIYEL 1:1'")
		expect(p.parse("TANIYĒL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TANIYĒL 1:1'")
		expect(p.parse("TAṈIYEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TAṈIYEL 1:1'")
		expect(p.parse("TAṈIYĒL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TAṈIYĒL 1:1'")
		expect(p.parse("TĀNIYEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TĀNIYEL 1:1'")
		expect(p.parse("TĀNIYĒL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TĀNIYĒL 1:1'")
		expect(p.parse("TĀṈIYEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TĀṈIYEL 1:1'")
		expect(p.parse("TĀṈIYĒL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'TĀṈIYĒL 1:1'")
		expect(p.parse("தானி 1:1").osis()).toEqual("Dan.1.1", "parsing: 'தானி 1:1'")
		expect(p.parse("DAN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DAN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hos (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hos (ta)", function() {
      
		expect(p.parse("Ociya 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ociya 1:1'")
		expect(p.parse("Ociyā 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ociyā 1:1'")
		expect(p.parse("Ōciya 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ōciya 1:1'")
		expect(p.parse("Ōciyā 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ōciyā 1:1'")
		expect(p.parse("ஒசேயா 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஒசேயா 1:1'")
		expect(p.parse("ஓசியா 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசியா 1:1'")
		expect(p.parse("ஓசேயா 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசேயா 1:1'")
		expect(p.parse("Hos 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hos 1:1'")
		expect(p.parse("ஓசி 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசி 1:1'")
		expect(p.parse("ஓசே 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசே 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("OCIYA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OCIYA 1:1'")
		expect(p.parse("OCIYĀ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OCIYĀ 1:1'")
		expect(p.parse("ŌCIYA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ŌCIYA 1:1'")
		expect(p.parse("ŌCIYĀ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ŌCIYĀ 1:1'")
		expect(p.parse("ஒசேயா 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஒசேயா 1:1'")
		expect(p.parse("ஓசியா 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசியா 1:1'")
		expect(p.parse("ஓசேயா 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசேயா 1:1'")
		expect(p.parse("HOS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOS 1:1'")
		expect(p.parse("ஓசி 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசி 1:1'")
		expect(p.parse("ஓசே 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ஓசே 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Joel (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Joel (ta)", function() {
      
		expect(p.parse("யோவேல் 1:1").osis()).toEqual("Joel.1.1", "parsing: 'யோவேல் 1:1'")
		expect(p.parse("Yovel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yovel 1:1'")
		expect(p.parse("Yovēl 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yovēl 1:1'")
		expect(p.parse("Yōvel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yōvel 1:1'")
		expect(p.parse("Yōvēl 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yōvēl 1:1'")
		expect(p.parse("Joel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joel 1:1'")
		expect(p.parse("யோவே 1:1").osis()).toEqual("Joel.1.1", "parsing: 'யோவே 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோவேல் 1:1").osis()).toEqual("Joel.1.1", "parsing: 'யோவேல் 1:1'")
		expect(p.parse("YOVEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YOVEL 1:1'")
		expect(p.parse("YOVĒL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YOVĒL 1:1'")
		expect(p.parse("YŌVEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YŌVEL 1:1'")
		expect(p.parse("YŌVĒL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YŌVĒL 1:1'")
		expect(p.parse("JOEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOEL 1:1'")
		expect(p.parse("யோவே 1:1").osis()).toEqual("Joel.1.1", "parsing: 'யோவே 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Amos (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Amos (ta)", function() {
      
		expect(p.parse("ஆமோஸ் 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ஆமோஸ் 1:1'")
		expect(p.parse("Amos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amos 1:1'")
		expect(p.parse("Amōs 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amōs 1:1'")
		expect(p.parse("Āmos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Āmos 1:1'")
		expect(p.parse("Āmōs 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Āmōs 1:1'")
		expect(p.parse("ஆமோ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ஆமோ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ஆமோஸ் 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ஆமோஸ் 1:1'")
		expect(p.parse("AMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOS 1:1'")
		expect(p.parse("AMŌS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMŌS 1:1'")
		expect(p.parse("ĀMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ĀMOS 1:1'")
		expect(p.parse("ĀMŌS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ĀMŌS 1:1'")
		expect(p.parse("ஆமோ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'ஆமோ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Obad (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Obad (ta)", function() {
      
		expect(p.parse("Opatiya 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Opatiya 1:1'")
		expect(p.parse("Opatiyā 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Opatiyā 1:1'")
		expect(p.parse("ஒபதியா 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ஒபதியா 1:1'")
		expect(p.parse("Obad 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obad 1:1'")
		expect(p.parse("ஒபதி 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ஒபதி 1:1'")
		expect(p.parse("ஒப 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ஒப 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("OPATIYA 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OPATIYA 1:1'")
		expect(p.parse("OPATIYĀ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OPATIYĀ 1:1'")
		expect(p.parse("ஒபதியா 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ஒபதியா 1:1'")
		expect(p.parse("OBAD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBAD 1:1'")
		expect(p.parse("ஒபதி 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ஒபதி 1:1'")
		expect(p.parse("ஒப 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ஒப 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jonah (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jonah (ta)", function() {
      
		expect(p.parse("Jonah 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonah 1:1'")
		expect(p.parse("Yona 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yona 1:1'")
		expect(p.parse("Yonā 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yonā 1:1'")
		expect(p.parse("Yoṉa 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yoṉa 1:1'")
		expect(p.parse("Yoṉā 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yoṉā 1:1'")
		expect(p.parse("Yōna 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yōna 1:1'")
		expect(p.parse("Yōnā 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yōnā 1:1'")
		expect(p.parse("Yōṉa 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yōṉa 1:1'")
		expect(p.parse("Yōṉā 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yōṉā 1:1'")
		expect(p.parse("யோனா 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'யோனா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JONAH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAH 1:1'")
		expect(p.parse("YONA 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YONA 1:1'")
		expect(p.parse("YONĀ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YONĀ 1:1'")
		expect(p.parse("YOṈA 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YOṈA 1:1'")
		expect(p.parse("YOṈĀ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YOṈĀ 1:1'")
		expect(p.parse("YŌNA 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YŌNA 1:1'")
		expect(p.parse("YŌNĀ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YŌNĀ 1:1'")
		expect(p.parse("YŌṈA 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YŌṈA 1:1'")
		expect(p.parse("YŌṈĀ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YŌṈĀ 1:1'")
		expect(p.parse("யோனா 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'யோனா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mic (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Mic (ta)", function() {
      
		expect(p.parse("மீக்கா 1:1").osis()).toEqual("Mic.1.1", "parsing: 'மீக்கா 1:1'")
		expect(p.parse("Mika 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mika 1:1'")
		expect(p.parse("Mikā 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikā 1:1'")
		expect(p.parse("Mīka 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mīka 1:1'")
		expect(p.parse("Mīkā 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mīkā 1:1'")
		expect(p.parse("மீகா 1:1").osis()).toEqual("Mic.1.1", "parsing: 'மீகா 1:1'")
		expect(p.parse("மீக் 1:1").osis()).toEqual("Mic.1.1", "parsing: 'மீக் 1:1'")
		expect(p.parse("Mic 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mic 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("மீக்கா 1:1").osis()).toEqual("Mic.1.1", "parsing: 'மீக்கா 1:1'")
		expect(p.parse("MIKA 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKA 1:1'")
		expect(p.parse("MIKĀ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKĀ 1:1'")
		expect(p.parse("MĪKA 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MĪKA 1:1'")
		expect(p.parse("MĪKĀ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MĪKĀ 1:1'")
		expect(p.parse("மீகா 1:1").osis()).toEqual("Mic.1.1", "parsing: 'மீகா 1:1'")
		expect(p.parse("மீக் 1:1").osis()).toEqual("Mic.1.1", "parsing: 'மீக் 1:1'")
		expect(p.parse("MIC 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIC 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Nah (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Nah (ta)", function() {
      
		expect(p.parse("நாகூம் 1:1").osis()).toEqual("Nah.1.1", "parsing: 'நாகூம் 1:1'")
		expect(p.parse("Nakum 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nakum 1:1'")
		expect(p.parse("Nakūm 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nakūm 1:1'")
		expect(p.parse("Nākum 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nākum 1:1'")
		expect(p.parse("Nākūm 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nākūm 1:1'")
		expect(p.parse("நாகூ 1:1").osis()).toEqual("Nah.1.1", "parsing: 'நாகூ 1:1'")
		expect(p.parse("Nah 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nah 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("நாகூம் 1:1").osis()).toEqual("Nah.1.1", "parsing: 'நாகூம் 1:1'")
		expect(p.parse("NAKUM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAKUM 1:1'")
		expect(p.parse("NAKŪM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAKŪM 1:1'")
		expect(p.parse("NĀKUM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NĀKUM 1:1'")
		expect(p.parse("NĀKŪM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NĀKŪM 1:1'")
		expect(p.parse("நாகூ 1:1").osis()).toEqual("Nah.1.1", "parsing: 'நாகூ 1:1'")
		expect(p.parse("NAH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hab (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hab (ta)", function() {
      
		expect(p.parse("அபக்கூக்கு 1:1").osis()).toEqual("Hab.1.1", "parsing: 'அபக்கூக்கு 1:1'")
		expect(p.parse("Apakuk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Apakuk 1:1'")
		expect(p.parse("Apakūk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Apakūk 1:1'")
		expect(p.parse("Āpakuk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Āpakuk 1:1'")
		expect(p.parse("Āpakūk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Āpakūk 1:1'")
		expect(p.parse("ஆபகூக் 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ஆபகூக் 1:1'")
		expect(p.parse("Hab 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Hab 1:1'")
		expect(p.parse("அப 1:1").osis()).toEqual("Hab.1.1", "parsing: 'அப 1:1'")
		expect(p.parse("ஆப 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ஆப 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("அபக்கூக்கு 1:1").osis()).toEqual("Hab.1.1", "parsing: 'அபக்கூக்கு 1:1'")
		expect(p.parse("APAKUK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'APAKUK 1:1'")
		expect(p.parse("APAKŪK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'APAKŪK 1:1'")
		expect(p.parse("ĀPAKUK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ĀPAKUK 1:1'")
		expect(p.parse("ĀPAKŪK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ĀPAKŪK 1:1'")
		expect(p.parse("ஆபகூக் 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ஆபகூக் 1:1'")
		expect(p.parse("HAB 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HAB 1:1'")
		expect(p.parse("அப 1:1").osis()).toEqual("Hab.1.1", "parsing: 'அப 1:1'")
		expect(p.parse("ஆப 1:1").osis()).toEqual("Hab.1.1", "parsing: 'ஆப 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zeph (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Zeph (ta)", function() {
      
		expect(p.parse("Ceppaniya 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Ceppaniya 1:1'")
		expect(p.parse("Ceppaniyā 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Ceppaniyā 1:1'")
		expect(p.parse("Ceppaṉiya 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Ceppaṉiya 1:1'")
		expect(p.parse("Ceppaṉiyā 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Ceppaṉiyā 1:1'")
		expect(p.parse("செப்பனியா 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'செப்பனியா 1:1'")
		expect(p.parse("Zeph 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zeph 1:1'")
		expect(p.parse("செப் 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'செப் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("CEPPANIYA 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'CEPPANIYA 1:1'")
		expect(p.parse("CEPPANIYĀ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'CEPPANIYĀ 1:1'")
		expect(p.parse("CEPPAṈIYA 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'CEPPAṈIYA 1:1'")
		expect(p.parse("CEPPAṈIYĀ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'CEPPAṈIYĀ 1:1'")
		expect(p.parse("செப்பனியா 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'செப்பனியா 1:1'")
		expect(p.parse("ZEPH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPH 1:1'")
		expect(p.parse("செப் 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'செப் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hag (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hag (ta)", function() {
      
		expect(p.parse("ஆகாய் 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ஆகாய் 1:1'")
		expect(p.parse("Akay 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Akay 1:1'")
		expect(p.parse("Akāy 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Akāy 1:1'")
		expect(p.parse("Ākay 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Ākay 1:1'")
		expect(p.parse("Ākāy 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Ākāy 1:1'")
		expect(p.parse("Hag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hag 1:1'")
		expect(p.parse("ஆகா 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ஆகா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ஆகாய் 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ஆகாய் 1:1'")
		expect(p.parse("AKAY 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AKAY 1:1'")
		expect(p.parse("AKĀY 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AKĀY 1:1'")
		expect(p.parse("ĀKAY 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ĀKAY 1:1'")
		expect(p.parse("ĀKĀY 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ĀKĀY 1:1'")
		expect(p.parse("HAG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAG 1:1'")
		expect(p.parse("ஆகா 1:1").osis()).toEqual("Hag.1.1", "parsing: 'ஆகா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zech (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Zech (ta)", function() {
      
		expect(p.parse("செக்கரியா 1:1").osis()).toEqual("Zech.1.1", "parsing: 'செக்கரியா 1:1'")
		expect(p.parse("Cakariya 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Cakariya 1:1'")
		expect(p.parse("Cakariyā 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Cakariyā 1:1'")
		expect(p.parse("சகரியா 1:1").osis()).toEqual("Zech.1.1", "parsing: 'சகரியா 1:1'")
		expect(p.parse("Zech 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zech 1:1'")
		expect(p.parse("சகரி 1:1").osis()).toEqual("Zech.1.1", "parsing: 'சகரி 1:1'")
		expect(p.parse("செக் 1:1").osis()).toEqual("Zech.1.1", "parsing: 'செக் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("செக்கரியா 1:1").osis()).toEqual("Zech.1.1", "parsing: 'செக்கரியா 1:1'")
		expect(p.parse("CAKARIYA 1:1").osis()).toEqual("Zech.1.1", "parsing: 'CAKARIYA 1:1'")
		expect(p.parse("CAKARIYĀ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'CAKARIYĀ 1:1'")
		expect(p.parse("சகரியா 1:1").osis()).toEqual("Zech.1.1", "parsing: 'சகரியா 1:1'")
		expect(p.parse("ZECH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECH 1:1'")
		expect(p.parse("சகரி 1:1").osis()).toEqual("Zech.1.1", "parsing: 'சகரி 1:1'")
		expect(p.parse("செக் 1:1").osis()).toEqual("Zech.1.1", "parsing: 'செக் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mal (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Mal (ta)", function() {
      
		expect(p.parse("எபிரேயம் 1:1").osis()).toEqual("Mal.1.1", "parsing: 'எபிரேயம் 1:1'")
		expect(p.parse("Malkiya 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malkiya 1:1'")
		expect(p.parse("Malkiyā 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malkiyā 1:1'")
		expect(p.parse("மலாக்கி 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மலாக்கி 1:1'")
		expect(p.parse("மல்கியா 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மல்கியா 1:1'")
		expect(p.parse("மல்கி 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மல்கி 1:1'")
		expect(p.parse("Mal 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Mal 1:1'")
		expect(p.parse("மலா 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மலா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எபிரேயம் 1:1").osis()).toEqual("Mal.1.1", "parsing: 'எபிரேயம் 1:1'")
		expect(p.parse("MALKIYA 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALKIYA 1:1'")
		expect(p.parse("MALKIYĀ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALKIYĀ 1:1'")
		expect(p.parse("மலாக்கி 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மலாக்கி 1:1'")
		expect(p.parse("மல்கியா 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மல்கியா 1:1'")
		expect(p.parse("மல்கி 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மல்கி 1:1'")
		expect(p.parse("MAL 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MAL 1:1'")
		expect(p.parse("மலா 1:1").osis()).toEqual("Mal.1.1", "parsing: 'மலா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Matt (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Matt (ta)", function() {
      
		expect(p.parse("மத்தேயு எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("மத்தேயு எழுதிய நற்செய்தி 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("மத்தேயு நற்செய்தி 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு நற்செய்தி 1:1'")
		expect(p.parse("Matteyu Narceyti 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matteyu Narceyti 1:1'")
		expect(p.parse("Matteyu Naṛceyti 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matteyu Naṛceyti 1:1'")
		expect(p.parse("Mattēyu Narceyti 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mattēyu Narceyti 1:1'")
		expect(p.parse("Mattēyu Naṛceyti 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mattēyu Naṛceyti 1:1'")
		expect(p.parse("Matteyu 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matteyu 1:1'")
		expect(p.parse("Mattēyu 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mattēyu 1:1'")
		expect(p.parse("மத்தேயு 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு 1:1'")
		expect(p.parse("Matt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matt 1:1'")
		expect(p.parse("மத் 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("மத்தேயு எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("மத்தேயு எழுதிய நற்செய்தி 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("மத்தேயு நற்செய்தி 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு நற்செய்தி 1:1'")
		expect(p.parse("MATTEYU NARCEYTI 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATTEYU NARCEYTI 1:1'")
		expect(p.parse("MATTEYU NAṚCEYTI 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATTEYU NAṚCEYTI 1:1'")
		expect(p.parse("MATTĒYU NARCEYTI 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATTĒYU NARCEYTI 1:1'")
		expect(p.parse("MATTĒYU NAṚCEYTI 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATTĒYU NAṚCEYTI 1:1'")
		expect(p.parse("MATTEYU 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATTEYU 1:1'")
		expect(p.parse("MATTĒYU 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATTĒYU 1:1'")
		expect(p.parse("மத்தேயு 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத்தேயு 1:1'")
		expect(p.parse("MATT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATT 1:1'")
		expect(p.parse("மத் 1:1").osis()).toEqual("Matt.1.1", "parsing: 'மத் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mark (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Mark (ta)", function() {
      
		expect(p.parse("மாற்கு எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("மாற்கு எழுதிய நற்செய்தி 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("மாற்கு நற்செய்தி 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு நற்செய்தி 1:1'")
		expect(p.parse("Marku Narceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Marku Narceyti 1:1'")
		expect(p.parse("Marku Naṛceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Marku Naṛceyti 1:1'")
		expect(p.parse("Maṛku Narceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Maṛku Narceyti 1:1'")
		expect(p.parse("Maṛku Naṛceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Maṛku Naṛceyti 1:1'")
		expect(p.parse("Mārku Narceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mārku Narceyti 1:1'")
		expect(p.parse("Mārku Naṛceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mārku Naṛceyti 1:1'")
		expect(p.parse("Māṛku Narceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Māṛku Narceyti 1:1'")
		expect(p.parse("Māṛku Naṛceyti 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Māṛku Naṛceyti 1:1'")
		expect(p.parse("மாற்கு 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு 1:1'")
		expect(p.parse("Marku 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Marku 1:1'")
		expect(p.parse("Maṛku 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Maṛku 1:1'")
		expect(p.parse("Mārku 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mārku 1:1'")
		expect(p.parse("Māṛku 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Māṛku 1:1'")
		expect(p.parse("Mark 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mark 1:1'")
		expect(p.parse("மாற் 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("மாற்கு எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("மாற்கு எழுதிய நற்செய்தி 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("மாற்கு நற்செய்தி 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு நற்செய்தி 1:1'")
		expect(p.parse("MARKU NARCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARKU NARCEYTI 1:1'")
		expect(p.parse("MARKU NAṚCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARKU NAṚCEYTI 1:1'")
		expect(p.parse("MAṚKU NARCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MAṚKU NARCEYTI 1:1'")
		expect(p.parse("MAṚKU NAṚCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MAṚKU NAṚCEYTI 1:1'")
		expect(p.parse("MĀRKU NARCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MĀRKU NARCEYTI 1:1'")
		expect(p.parse("MĀRKU NAṚCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MĀRKU NAṚCEYTI 1:1'")
		expect(p.parse("MĀṚKU NARCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MĀṚKU NARCEYTI 1:1'")
		expect(p.parse("MĀṚKU NAṚCEYTI 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MĀṚKU NAṚCEYTI 1:1'")
		expect(p.parse("மாற்கு 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற்கு 1:1'")
		expect(p.parse("MARKU 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARKU 1:1'")
		expect(p.parse("MAṚKU 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MAṚKU 1:1'")
		expect(p.parse("MĀRKU 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MĀRKU 1:1'")
		expect(p.parse("MĀṚKU 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MĀṚKU 1:1'")
		expect(p.parse("MARK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARK 1:1'")
		expect(p.parse("மாற் 1:1").osis()).toEqual("Mark.1.1", "parsing: 'மாற் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Luke (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Luke (ta)", function() {
      
		expect(p.parse("லூக்கா எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("லூக்கா எழுதிய நற்செய்தி 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("லூக்கா நற்செய்தி 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா நற்செய்தி 1:1'")
		expect(p.parse("Lukka Narceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukka Narceyti 1:1'")
		expect(p.parse("Lukka Naṛceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukka Naṛceyti 1:1'")
		expect(p.parse("Lukkā Narceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukkā Narceyti 1:1'")
		expect(p.parse("Lukkā Naṛceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukkā Naṛceyti 1:1'")
		expect(p.parse("Lūkka Narceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lūkka Narceyti 1:1'")
		expect(p.parse("Lūkka Naṛceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lūkka Naṛceyti 1:1'")
		expect(p.parse("Lūkkā Narceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lūkkā Narceyti 1:1'")
		expect(p.parse("Lūkkā Naṛceyti 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lūkkā Naṛceyti 1:1'")
		expect(p.parse("லூக்கா 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா 1:1'")
		expect(p.parse("Lukka 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukka 1:1'")
		expect(p.parse("Lukkā 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukkā 1:1'")
		expect(p.parse("Lūkka 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lūkka 1:1'")
		expect(p.parse("Lūkkā 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lūkkā 1:1'")
		expect(p.parse("Luke 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luke 1:1'")
		expect(p.parse("லூக் 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக் 1:1'")
		expect(p.parse("லூ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("லூக்கா எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("லூக்கா எழுதிய நற்செய்தி 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("லூக்கா நற்செய்தி 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா நற்செய்தி 1:1'")
		expect(p.parse("LUKKA NARCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKKA NARCEYTI 1:1'")
		expect(p.parse("LUKKA NAṚCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKKA NAṚCEYTI 1:1'")
		expect(p.parse("LUKKĀ NARCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKKĀ NARCEYTI 1:1'")
		expect(p.parse("LUKKĀ NAṚCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKKĀ NAṚCEYTI 1:1'")
		expect(p.parse("LŪKKA NARCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LŪKKA NARCEYTI 1:1'")
		expect(p.parse("LŪKKA NAṚCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LŪKKA NAṚCEYTI 1:1'")
		expect(p.parse("LŪKKĀ NARCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LŪKKĀ NARCEYTI 1:1'")
		expect(p.parse("LŪKKĀ NAṚCEYTI 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LŪKKĀ NAṚCEYTI 1:1'")
		expect(p.parse("லூக்கா 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக்கா 1:1'")
		expect(p.parse("LUKKA 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKKA 1:1'")
		expect(p.parse("LUKKĀ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKKĀ 1:1'")
		expect(p.parse("LŪKKA 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LŪKKA 1:1'")
		expect(p.parse("LŪKKĀ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LŪKKĀ 1:1'")
		expect(p.parse("LUKE 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKE 1:1'")
		expect(p.parse("லூக் 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூக் 1:1'")
		expect(p.parse("லூ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'லூ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1John (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1John (ta)", function() {
      
		expect(p.parse("Yovan Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovan Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovan Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovan Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovan Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovaṉ Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovaṉ Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovaṉ Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yovaṉ Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvan Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvan Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvan Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvan Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvaṉ Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvaṉ Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("யோவன் எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவன் எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("யோவான் எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவான் எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("யோவான் எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவான் எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("யோவான் முதல் திருமுகம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவான் முதல் திருமுகம் 1:1'")
		expect(p.parse("Mutalavatu யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: 'Mutalavatu யோவான் 1:1'")
		expect(p.parse("Mutalāvatu யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: 'Mutalāvatu யோவான் 1:1'")
		expect(p.parse("முதலாவது யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: 'முதலாவது யோவான் 1:1'")
		expect(p.parse("1 அருளப்பர் 1:1").osis()).toEqual("1John.1.1", "parsing: '1 அருளப்பர் 1:1'")
		expect(p.parse("1. யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: '1. யோவான் 1:1'")
		expect(p.parse("1 யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: '1 யோவான் 1:1'")
		expect(p.parse("1 Yovan 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yovan 1:1'")
		expect(p.parse("1 Yovaṉ 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yovaṉ 1:1'")
		expect(p.parse("1 Yōvan 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yōvan 1:1'")
		expect(p.parse("1 Yōvaṉ 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yōvaṉ 1:1'")
		expect(p.parse("1 யோவா 1:1").osis()).toEqual("1John.1.1", "parsing: '1 யோவா 1:1'")
		expect(p.parse("1John 1:1").osis()).toEqual("1John.1.1", "parsing: '1John 1:1'")
		expect(p.parse("1 யோ 1:1").osis()).toEqual("1John.1.1", "parsing: '1 யோ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YOVAN ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAN ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAN ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAN EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAN EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAṈ ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAṈ ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAN ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAN ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAN EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAN EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("யோவன் எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவன் எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("யோவான் எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவான் எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("யோவான் எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவான் எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("யோவான் முதல் திருமுகம் 1:1").osis()).toEqual("1John.1.1", "parsing: 'யோவான் முதல் திருமுகம் 1:1'")
		expect(p.parse("MUTALAVATU யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: 'MUTALAVATU யோவான் 1:1'")
		expect(p.parse("MUTALĀVATU யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: 'MUTALĀVATU யோவான் 1:1'")
		expect(p.parse("முதலாவது யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: 'முதலாவது யோவான் 1:1'")
		expect(p.parse("1 அருளப்பர் 1:1").osis()).toEqual("1John.1.1", "parsing: '1 அருளப்பர் 1:1'")
		expect(p.parse("1. யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: '1. யோவான் 1:1'")
		expect(p.parse("1 யோவான் 1:1").osis()).toEqual("1John.1.1", "parsing: '1 யோவான் 1:1'")
		expect(p.parse("1 YOVAN 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YOVAN 1:1'")
		expect(p.parse("1 YOVAṈ 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YOVAṈ 1:1'")
		expect(p.parse("1 YŌVAN 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YŌVAN 1:1'")
		expect(p.parse("1 YŌVAṈ 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YŌVAṈ 1:1'")
		expect(p.parse("1 யோவா 1:1").osis()).toEqual("1John.1.1", "parsing: '1 யோவா 1:1'")
		expect(p.parse("1JOHN 1:1").osis()).toEqual("1John.1.1", "parsing: '1JOHN 1:1'")
		expect(p.parse("1 யோ 1:1").osis()).toEqual("1John.1.1", "parsing: '1 யோ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2John (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2John (ta)", function() {
      
		expect(p.parse("Yovan Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovan Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yovaṉ Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvan Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yōvaṉ Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("யோவான் எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவான் எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("யோவன் எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவன் எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("யோவான் எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவான் எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("யோவான் இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவான் இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("2 அருளப்பர் 1:1").osis()).toEqual("2John.1.1", "parsing: '2 அருளப்பர் 1:1'")
		expect(p.parse("2 யோவான் 1:1").osis()).toEqual("2John.1.1", "parsing: '2 யோவான் 1:1'")
		expect(p.parse("2 Yovan 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yovan 1:1'")
		expect(p.parse("2 Yovaṉ 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yovaṉ 1:1'")
		expect(p.parse("2 Yōvan 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yōvan 1:1'")
		expect(p.parse("2 Yōvaṉ 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yōvaṉ 1:1'")
		expect(p.parse("2 யோவா 1:1").osis()).toEqual("2John.1.1", "parsing: '2 யோவா 1:1'")
		expect(p.parse("2John 1:1").osis()).toEqual("2John.1.1", "parsing: '2John 1:1'")
		expect(p.parse("2 யோ 1:1").osis()).toEqual("2John.1.1", "parsing: '2 யோ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YOVAN ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAN EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOVAṈ EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAN EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2John.1.1", "parsing: 'YŌVAṈ EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("யோவான் எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவான் எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("யோவன் எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவன் எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("யோவான் எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவான் எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("யோவான் இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2John.1.1", "parsing: 'யோவான் இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("2 அருளப்பர் 1:1").osis()).toEqual("2John.1.1", "parsing: '2 அருளப்பர் 1:1'")
		expect(p.parse("2 யோவான் 1:1").osis()).toEqual("2John.1.1", "parsing: '2 யோவான் 1:1'")
		expect(p.parse("2 YOVAN 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YOVAN 1:1'")
		expect(p.parse("2 YOVAṈ 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YOVAṈ 1:1'")
		expect(p.parse("2 YŌVAN 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YŌVAN 1:1'")
		expect(p.parse("2 YŌVAṈ 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YŌVAṈ 1:1'")
		expect(p.parse("2 யோவா 1:1").osis()).toEqual("2John.1.1", "parsing: '2 யோவா 1:1'")
		expect(p.parse("2JOHN 1:1").osis()).toEqual("2John.1.1", "parsing: '2JOHN 1:1'")
		expect(p.parse("2 யோ 1:1").osis()).toEqual("2John.1.1", "parsing: '2 யோ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3John (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 3John (ta)", function() {
      
		expect(p.parse("யோவான் எழுதிய முன்றாம் திருமுகம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவான் எழுதிய முன்றாம் திருமுகம் 1:1'")
		expect(p.parse("Yovan Elutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Elutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Elutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovan Eḻutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovan Eḻutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Elutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Elutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yovaṉ Eḻutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yovaṉ Eḻutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Elutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Elutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvan Eḻutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvan Eḻutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Elutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Elutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Munravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Munravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Munrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Munrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Munṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Munṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Munṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Munṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Muṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Muṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Muṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Muṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Muṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Muṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Muṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Muṉṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūnravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūnravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūnrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūnrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūnṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūnṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūnṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūnṛāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūṉravatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūṉravatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūṉrāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūṉrāvatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūṉṛavatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūṉṛavatu Nirupam 1:1'")
		expect(p.parse("Yōvaṉ Eḻutiya Mūṉṛāvatu Nirupam 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yōvaṉ Eḻutiya Mūṉṛāvatu Nirupam 1:1'")
		expect(p.parse("யோவன் எழுதிய மூன்றாவது நிருபம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவன் எழுதிய மூன்றாவது நிருபம் 1:1'")
		expect(p.parse("யோவான் எழுதிய மூன்றாம் கடிதம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவான் எழுதிய மூன்றாம் கடிதம் 1:1'")
		expect(p.parse("யோவான் மூன்றாம் திருமுகம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவான் மூன்றாம் திருமுகம் 1:1'")
		expect(p.parse("Munravatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Munravatu யோவான் 1:1'")
		expect(p.parse("Munrāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Munrāvatu யோவான் 1:1'")
		expect(p.parse("Munṛavatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Munṛavatu யோவான் 1:1'")
		expect(p.parse("Munṛāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Munṛāvatu யோவான் 1:1'")
		expect(p.parse("Muṉravatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Muṉravatu யோவான் 1:1'")
		expect(p.parse("Muṉrāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Muṉrāvatu யோவான் 1:1'")
		expect(p.parse("Muṉṛavatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Muṉṛavatu யோவான் 1:1'")
		expect(p.parse("Muṉṛāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Muṉṛāvatu யோவான் 1:1'")
		expect(p.parse("Mūnravatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūnravatu யோவான் 1:1'")
		expect(p.parse("Mūnrāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūnrāvatu யோவான் 1:1'")
		expect(p.parse("Mūnṛavatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūnṛavatu யோவான் 1:1'")
		expect(p.parse("Mūnṛāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūnṛāvatu யோவான் 1:1'")
		expect(p.parse("Mūṉravatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūṉravatu யோவான் 1:1'")
		expect(p.parse("Mūṉrāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūṉrāvatu யோவான் 1:1'")
		expect(p.parse("Mūṉṛavatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūṉṛavatu யோவான் 1:1'")
		expect(p.parse("Mūṉṛāvatu யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'Mūṉṛāvatu யோவான் 1:1'")
		expect(p.parse("மூன்றாவது யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'மூன்றாவது யோவான் 1:1'")
		expect(p.parse("முன்றாம் யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'முன்றாம் யோவான் 1:1'")
		expect(p.parse("3 அருளப்பர் 1:1").osis()).toEqual("3John.1.1", "parsing: '3 அருளப்பர் 1:1'")
		expect(p.parse("3. யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: '3. யோவான் 1:1'")
		expect(p.parse("3 யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: '3 யோவான் 1:1'")
		expect(p.parse("3 Yovan 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yovan 1:1'")
		expect(p.parse("3 Yovaṉ 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yovaṉ 1:1'")
		expect(p.parse("3 Yōvan 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yōvan 1:1'")
		expect(p.parse("3 Yōvaṉ 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yōvaṉ 1:1'")
		expect(p.parse("3 யோவா 1:1").osis()).toEqual("3John.1.1", "parsing: '3 யோவா 1:1'")
		expect(p.parse("3John 1:1").osis()).toEqual("3John.1.1", "parsing: '3John 1:1'")
		expect(p.parse("3 யோ 1:1").osis()).toEqual("3John.1.1", "parsing: '3 யோ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோவான் எழுதிய முன்றாம் திருமுகம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவான் எழுதிய முன்றாம் திருமுகம் 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAN EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAN EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YOVAṈ EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOVAṈ EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAN EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAN EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ ELUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MUṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪNRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪNRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪNRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪNRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪNṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪNṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪNṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪṈRAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪṈRAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪṈRĀVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪṈṚAVATU NIRUPAM 1:1'")
		expect(p.parse("YŌVAṈ EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1").osis()).toEqual("3John.1.1", "parsing: 'YŌVAṈ EḺUTIYA MŪṈṚĀVATU NIRUPAM 1:1'")
		expect(p.parse("யோவன் எழுதிய மூன்றாவது நிருபம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவன் எழுதிய மூன்றாவது நிருபம் 1:1'")
		expect(p.parse("யோவான் எழுதிய மூன்றாம் கடிதம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவான் எழுதிய மூன்றாம் கடிதம் 1:1'")
		expect(p.parse("யோவான் மூன்றாம் திருமுகம் 1:1").osis()).toEqual("3John.1.1", "parsing: 'யோவான் மூன்றாம் திருமுகம் 1:1'")
		expect(p.parse("MUNRAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUNRAVATU யோவான் 1:1'")
		expect(p.parse("MUNRĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUNRĀVATU யோவான் 1:1'")
		expect(p.parse("MUNṚAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUNṚAVATU யோவான் 1:1'")
		expect(p.parse("MUNṚĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUNṚĀVATU யோவான் 1:1'")
		expect(p.parse("MUṈRAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUṈRAVATU யோவான் 1:1'")
		expect(p.parse("MUṈRĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUṈRĀVATU யோவான் 1:1'")
		expect(p.parse("MUṈṚAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUṈṚAVATU யோவான் 1:1'")
		expect(p.parse("MUṈṚĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MUṈṚĀVATU யோவான் 1:1'")
		expect(p.parse("MŪNRAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪNRAVATU யோவான் 1:1'")
		expect(p.parse("MŪNRĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪNRĀVATU யோவான் 1:1'")
		expect(p.parse("MŪNṚAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪNṚAVATU யோவான் 1:1'")
		expect(p.parse("MŪNṚĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪNṚĀVATU யோவான் 1:1'")
		expect(p.parse("MŪṈRAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪṈRAVATU யோவான் 1:1'")
		expect(p.parse("MŪṈRĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪṈRĀVATU யோவான் 1:1'")
		expect(p.parse("MŪṈṚAVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪṈṚAVATU யோவான் 1:1'")
		expect(p.parse("MŪṈṚĀVATU யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'MŪṈṚĀVATU யோவான் 1:1'")
		expect(p.parse("மூன்றாவது யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'மூன்றாவது யோவான் 1:1'")
		expect(p.parse("முன்றாம் யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: 'முன்றாம் யோவான் 1:1'")
		expect(p.parse("3 அருளப்பர் 1:1").osis()).toEqual("3John.1.1", "parsing: '3 அருளப்பர் 1:1'")
		expect(p.parse("3. யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: '3. யோவான் 1:1'")
		expect(p.parse("3 யோவான் 1:1").osis()).toEqual("3John.1.1", "parsing: '3 யோவான் 1:1'")
		expect(p.parse("3 YOVAN 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YOVAN 1:1'")
		expect(p.parse("3 YOVAṈ 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YOVAṈ 1:1'")
		expect(p.parse("3 YŌVAN 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YŌVAN 1:1'")
		expect(p.parse("3 YŌVAṈ 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YŌVAṈ 1:1'")
		expect(p.parse("3 யோவா 1:1").osis()).toEqual("3John.1.1", "parsing: '3 யோவா 1:1'")
		expect(p.parse("3JOHN 1:1").osis()).toEqual("3John.1.1", "parsing: '3JOHN 1:1'")
		expect(p.parse("3 யோ 1:1").osis()).toEqual("3John.1.1", "parsing: '3 யோ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book John (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: John (ta)", function() {
      
		expect(p.parse("யோவான் எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("யோவான் எழுதிய நற்செய்தி 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("அருளப்பர் நற்செய்தி 1:1").osis()).toEqual("John.1.1", "parsing: 'அருளப்பர் நற்செய்தி 1:1'")
		expect(p.parse("யோவான் நற்செய்தி 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் நற்செய்தி 1:1'")
		expect(p.parse("Yovan Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovan Narceyti 1:1'")
		expect(p.parse("Yovan Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovan Naṛceyti 1:1'")
		expect(p.parse("Yovaṉ Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovaṉ Narceyti 1:1'")
		expect(p.parse("Yovaṉ Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovaṉ Naṛceyti 1:1'")
		expect(p.parse("Yovān Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovān Narceyti 1:1'")
		expect(p.parse("Yovān Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovān Naṛceyti 1:1'")
		expect(p.parse("Yovāṉ Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovāṉ Narceyti 1:1'")
		expect(p.parse("Yovāṉ Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovāṉ Naṛceyti 1:1'")
		expect(p.parse("Yōvan Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvan Narceyti 1:1'")
		expect(p.parse("Yōvan Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvan Naṛceyti 1:1'")
		expect(p.parse("Yōvaṉ Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvaṉ Narceyti 1:1'")
		expect(p.parse("Yōvaṉ Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvaṉ Naṛceyti 1:1'")
		expect(p.parse("Yōvān Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvān Narceyti 1:1'")
		expect(p.parse("Yōvān Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvān Naṛceyti 1:1'")
		expect(p.parse("Yōvāṉ Narceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvāṉ Narceyti 1:1'")
		expect(p.parse("Yōvāṉ Naṛceyti 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvāṉ Naṛceyti 1:1'")
		expect(p.parse("யோவான் 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் 1:1'")
		expect(p.parse("Yovan 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovan 1:1'")
		expect(p.parse("Yovaṉ 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovaṉ 1:1'")
		expect(p.parse("Yovān 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovān 1:1'")
		expect(p.parse("Yovāṉ 1:1").osis()).toEqual("John.1.1", "parsing: 'Yovāṉ 1:1'")
		expect(p.parse("Yōvan 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvan 1:1'")
		expect(p.parse("Yōvaṉ 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvaṉ 1:1'")
		expect(p.parse("Yōvān 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvān 1:1'")
		expect(p.parse("Yōvāṉ 1:1").osis()).toEqual("John.1.1", "parsing: 'Yōvāṉ 1:1'")
		expect(p.parse("John 1:1").osis()).toEqual("John.1.1", "parsing: 'John 1:1'")
		expect(p.parse("யோவா 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோவான் எழுதிய சுவிசேஷம் 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் எழுதிய சுவிசேஷம் 1:1'")
		expect(p.parse("யோவான் எழுதிய நற்செய்தி 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் எழுதிய நற்செய்தி 1:1'")
		expect(p.parse("அருளப்பர் நற்செய்தி 1:1").osis()).toEqual("John.1.1", "parsing: 'அருளப்பர் நற்செய்தி 1:1'")
		expect(p.parse("யோவான் நற்செய்தி 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் நற்செய்தி 1:1'")
		expect(p.parse("YOVAN NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVAN NARCEYTI 1:1'")
		expect(p.parse("YOVAN NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVAN NAṚCEYTI 1:1'")
		expect(p.parse("YOVAṈ NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVAṈ NARCEYTI 1:1'")
		expect(p.parse("YOVAṈ NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVAṈ NAṚCEYTI 1:1'")
		expect(p.parse("YOVĀN NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVĀN NARCEYTI 1:1'")
		expect(p.parse("YOVĀN NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVĀN NAṚCEYTI 1:1'")
		expect(p.parse("YOVĀṈ NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVĀṈ NARCEYTI 1:1'")
		expect(p.parse("YOVĀṈ NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVĀṈ NAṚCEYTI 1:1'")
		expect(p.parse("YŌVAN NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVAN NARCEYTI 1:1'")
		expect(p.parse("YŌVAN NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVAN NAṚCEYTI 1:1'")
		expect(p.parse("YŌVAṈ NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVAṈ NARCEYTI 1:1'")
		expect(p.parse("YŌVAṈ NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVAṈ NAṚCEYTI 1:1'")
		expect(p.parse("YŌVĀN NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVĀN NARCEYTI 1:1'")
		expect(p.parse("YŌVĀN NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVĀN NAṚCEYTI 1:1'")
		expect(p.parse("YŌVĀṈ NARCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVĀṈ NARCEYTI 1:1'")
		expect(p.parse("YŌVĀṈ NAṚCEYTI 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVĀṈ NAṚCEYTI 1:1'")
		expect(p.parse("யோவான் 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவான் 1:1'")
		expect(p.parse("YOVAN 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVAN 1:1'")
		expect(p.parse("YOVAṈ 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVAṈ 1:1'")
		expect(p.parse("YOVĀN 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVĀN 1:1'")
		expect(p.parse("YOVĀṈ 1:1").osis()).toEqual("John.1.1", "parsing: 'YOVĀṈ 1:1'")
		expect(p.parse("YŌVAN 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVAN 1:1'")
		expect(p.parse("YŌVAṈ 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVAṈ 1:1'")
		expect(p.parse("YŌVĀN 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVĀN 1:1'")
		expect(p.parse("YŌVĀṈ 1:1").osis()).toEqual("John.1.1", "parsing: 'YŌVĀṈ 1:1'")
		expect(p.parse("JOHN 1:1").osis()).toEqual("John.1.1", "parsing: 'JOHN 1:1'")
		expect(p.parse("யோவா 1:1").osis()).toEqual("John.1.1", "parsing: 'யோவா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Acts (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Acts (ta)", function() {
      
		expect(p.parse("அப்போஸ்தலருடைய நடபடிகள் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போஸ்தலருடைய நடபடிகள் 1:1'")
		expect(p.parse("திருத்தூதர் பணிகள் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'திருத்தூதர் பணிகள் 1:1'")
		expect(p.parse("Appostalar Pani 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Appostalar Pani 1:1'")
		expect(p.parse("Appostalar Paṇi 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Appostalar Paṇi 1:1'")
		expect(p.parse("Appōstalar Pani 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Appōstalar Pani 1:1'")
		expect(p.parse("Appōstalar Paṇi 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Appōstalar Paṇi 1:1'")
		expect(p.parse("அப்போஸ்தலர் பணி 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போஸ்தலர் பணி 1:1'")
		expect(p.parse("அப்போஸ்தலர் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போஸ்தலர் 1:1'")
		expect(p.parse("அப்போ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போ 1:1'")
		expect(p.parse("Acts 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Acts 1:1'")
		expect(p.parse("அப் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப் 1:1'")
		expect(p.parse("திப 1:1").osis()).toEqual("Acts.1.1", "parsing: 'திப 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("அப்போஸ்தலருடைய நடபடிகள் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போஸ்தலருடைய நடபடிகள் 1:1'")
		expect(p.parse("திருத்தூதர் பணிகள் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'திருத்தூதர் பணிகள் 1:1'")
		expect(p.parse("APPOSTALAR PANI 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APPOSTALAR PANI 1:1'")
		expect(p.parse("APPOSTALAR PAṆI 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APPOSTALAR PAṆI 1:1'")
		expect(p.parse("APPŌSTALAR PANI 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APPŌSTALAR PANI 1:1'")
		expect(p.parse("APPŌSTALAR PAṆI 1:1").osis()).toEqual("Acts.1.1", "parsing: 'APPŌSTALAR PAṆI 1:1'")
		expect(p.parse("அப்போஸ்தலர் பணி 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போஸ்தலர் பணி 1:1'")
		expect(p.parse("அப்போஸ்தலர் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போஸ்தலர் 1:1'")
		expect(p.parse("அப்போ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப்போ 1:1'")
		expect(p.parse("ACTS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ACTS 1:1'")
		expect(p.parse("அப் 1:1").osis()).toEqual("Acts.1.1", "parsing: 'அப் 1:1'")
		expect(p.parse("திப 1:1").osis()).toEqual("Acts.1.1", "parsing: 'திப 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rom (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Rom (ta)", function() {
      
		expect(p.parse("ரோமாபுரியாருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ரோமாபுரியாருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("உரோமையருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோமையருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Uromarukku Elutiya Nirupam 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Uromarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Uromarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Uromarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Urōmarukku Elutiya Nirupam 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Urōmarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Urōmarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Urōmarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("உரோமருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோமருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("Uromarukku 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Uromarukku 1:1'")
		expect(p.parse("Urōmarukku 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Urōmarukku 1:1'")
		expect(p.parse("உரோமையர் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோமையர் 1:1'")
		expect(p.parse("ரோமர் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ரோமர் 1:1'")
		expect(p.parse("Rom 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rom 1:1'")
		expect(p.parse("உரோ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ரோமாபுரியாருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ரோமாபுரியாருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("உரோமையருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோமையருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("UROMARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'UROMARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("UROMARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'UROMARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("URŌMARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'URŌMARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("URŌMARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'URŌMARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("உரோமருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோமருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("UROMARUKKU 1:1").osis()).toEqual("Rom.1.1", "parsing: 'UROMARUKKU 1:1'")
		expect(p.parse("URŌMARUKKU 1:1").osis()).toEqual("Rom.1.1", "parsing: 'URŌMARUKKU 1:1'")
		expect(p.parse("உரோமையர் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோமையர் 1:1'")
		expect(p.parse("ரோமர் 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ரோமர் 1:1'")
		expect(p.parse("ROM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROM 1:1'")
		expect(p.parse("உரோ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'உரோ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Cor (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Cor (ta)", function() {
      
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("2 Korintiyarukku 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Korintiyarukku 1:1'")
		expect(p.parse("2 கொரிந்தியர் 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 கொரிந்தியர் 1:1'")
		expect(p.parse("2 கொரி 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 கொரி 1:1'")
		expect(p.parse("2 கொ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 கொ 1:1'")
		expect(p.parse("2Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("2 KORINTIYARUKKU 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KORINTIYARUKKU 1:1'")
		expect(p.parse("2 கொரிந்தியர் 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 கொரிந்தியர் 1:1'")
		expect(p.parse("2 கொரி 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 கொரி 1:1'")
		expect(p.parse("2 கொ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 கொ 1:1'")
		expect(p.parse("2COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Cor (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Cor (ta)", function() {
      
		expect(p.parse("Korintiyarukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Korintiyarukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Korintiyarukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Korintiyarukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Korintiyarukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதலாவது திருமுகம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதலாவது திருமுகம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதலாம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதலாம் 1:1'")
		expect(p.parse("1 Korintiyarukku 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Korintiyarukku 1:1'")
		expect(p.parse("1 கொரிந்தியர் 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 கொரிந்தியர் 1:1'")
		expect(p.parse("1 கொரி 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 கொரி 1:1'")
		expect(p.parse("1 கொ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 கொ 1:1'")
		expect(p.parse("1Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KORINTIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KORINTIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("KORINTIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KORINTIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதலாவது திருமுகம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதலாவது திருமுகம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("கொரிந்தியருக்கு எழுதிய முதலாம் 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'கொரிந்தியருக்கு எழுதிய முதலாம் 1:1'")
		expect(p.parse("1 KORINTIYARUKKU 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KORINTIYARUKKU 1:1'")
		expect(p.parse("1 கொரிந்தியர் 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 கொரிந்தியர் 1:1'")
		expect(p.parse("1 கொரி 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 கொரி 1:1'")
		expect(p.parse("1 கொ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 கொ 1:1'")
		expect(p.parse("1COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Gal (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Gal (ta)", function() {
      
		expect(p.parse("கலாத்தியருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Kalattiyarukku Elutiya Nirupam 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Kalattiyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Kalattiyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Kalattiyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Kalāttiyarukku Elutiya Nirupam 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Kalāttiyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Kalāttiyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Kalāttiyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("கலாத்தியருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("கலாத்தியருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Kalattiyarukku 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Kalattiyarukku 1:1'")
		expect(p.parse("Kalāttiyarukku 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Kalāttiyarukku 1:1'")
		expect(p.parse("கலாத்தியர் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியர் 1:1'")
		expect(p.parse("கலாத் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத் 1:1'")
		expect(p.parse("Gal 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Gal 1:1'")
		expect(p.parse("கலா 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("கலாத்தியருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("KALATTIYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Gal.1.1", "parsing: 'KALATTIYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("KALATTIYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Gal.1.1", "parsing: 'KALATTIYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("KALĀTTIYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Gal.1.1", "parsing: 'KALĀTTIYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("KALĀTTIYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Gal.1.1", "parsing: 'KALĀTTIYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("கலாத்தியருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("கலாத்தியருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("KALATTIYARUKKU 1:1").osis()).toEqual("Gal.1.1", "parsing: 'KALATTIYARUKKU 1:1'")
		expect(p.parse("KALĀTTIYARUKKU 1:1").osis()).toEqual("Gal.1.1", "parsing: 'KALĀTTIYARUKKU 1:1'")
		expect(p.parse("கலாத்தியர் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத்தியர் 1:1'")
		expect(p.parse("கலாத் 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலாத் 1:1'")
		expect(p.parse("GAL 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GAL 1:1'")
		expect(p.parse("கலா 1:1").osis()).toEqual("Gal.1.1", "parsing: 'கலா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eph (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Eph (ta)", function() {
      
		expect(p.parse("எபேசியருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Epeciyarukku Elutiya Nirupam 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epeciyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Epeciyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epeciyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Epēciyarukku Elutiya Nirupam 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epēciyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Epēciyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epēciyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("எபேசியருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("எபேசியருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Epeciyarukku 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epeciyarukku 1:1'")
		expect(p.parse("Epēciyarukku 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epēciyarukku 1:1'")
		expect(p.parse("எபேசியர் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியர் 1:1'")
		expect(p.parse("எபேசி 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசி 1:1'")
		expect(p.parse("Eph 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Eph 1:1'")
		expect(p.parse("எபே 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபே 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எபேசியருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("EPECIYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPECIYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("EPECIYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPECIYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("EPĒCIYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPĒCIYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("EPĒCIYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPĒCIYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("எபேசியருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("எபேசியருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("EPECIYARUKKU 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPECIYARUKKU 1:1'")
		expect(p.parse("EPĒCIYARUKKU 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPĒCIYARUKKU 1:1'")
		expect(p.parse("எபேசியர் 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசியர் 1:1'")
		expect(p.parse("எபேசி 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபேசி 1:1'")
		expect(p.parse("EPH 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPH 1:1'")
		expect(p.parse("எபே 1:1").osis()).toEqual("Eph.1.1", "parsing: 'எபே 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phil (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Phil (ta)", function() {
      
		expect(p.parse("பிலிப்பியருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Pilippiyarukku Elutiya Nirupam 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Pilippiyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilippiyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Pilippiyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("பிலிப்பியருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("பிலிப்பியருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Pilippiyarukku 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Pilippiyarukku 1:1'")
		expect(p.parse("பிலிப்பியர் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியர் 1:1'")
		expect(p.parse("பிலிப் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப் 1:1'")
		expect(p.parse("Phil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Phil 1:1'")
		expect(p.parse("பிலி 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலி 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("பிலிப்பியருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("PILIPPIYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PILIPPIYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILIPPIYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PILIPPIYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("பிலிப்பியருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("பிலிப்பியருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("PILIPPIYARUKKU 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PILIPPIYARUKKU 1:1'")
		expect(p.parse("பிலிப்பியர் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப்பியர் 1:1'")
		expect(p.parse("பிலிப் 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலிப் 1:1'")
		expect(p.parse("PHIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHIL 1:1'")
		expect(p.parse("பிலி 1:1").osis()).toEqual("Phil.1.1", "parsing: 'பிலி 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Col (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Col (ta)", function() {
      
		expect(p.parse("கொலோசையருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசையருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Koloceyarukku Elutiya Nirupam 1:1").osis()).toEqual("Col.1.1", "parsing: 'Koloceyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Koloceyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Col.1.1", "parsing: 'Koloceyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Kolōceyarukku Elutiya Nirupam 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolōceyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Kolōceyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolōceyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("கொலோசெயருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசெயருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("கொலோசெயருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசெயருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Koloceyarukku 1:1").osis()).toEqual("Col.1.1", "parsing: 'Koloceyarukku 1:1'")
		expect(p.parse("Kolōceyarukku 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolōceyarukku 1:1'")
		expect(p.parse("கொலோசெயர் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசெயர் 1:1'")
		expect(p.parse("கொலோசையர் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசையர் 1:1'")
		expect(p.parse("கொலோ 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோ 1:1'")
		expect(p.parse("Col 1:1").osis()).toEqual("Col.1.1", "parsing: 'Col 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("கொலோசையருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசையருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("KOLOCEYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOCEYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("KOLOCEYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOCEYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("KOLŌCEYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLŌCEYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("KOLŌCEYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLŌCEYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("கொலோசெயருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசெயருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("கொலோசெயருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசெயருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("KOLOCEYARUKKU 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOCEYARUKKU 1:1'")
		expect(p.parse("KOLŌCEYARUKKU 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLŌCEYARUKKU 1:1'")
		expect(p.parse("கொலோசெயர் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசெயர் 1:1'")
		expect(p.parse("கொலோசையர் 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோசையர் 1:1'")
		expect(p.parse("கொலோ 1:1").osis()).toEqual("Col.1.1", "parsing: 'கொலோ 1:1'")
		expect(p.parse("COL 1:1").osis()).toEqual("Col.1.1", "parsing: 'COL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Thess (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Thess (ta)", function() {
      
		expect(p.parse("Tecalonikkiyarukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("தெசலோனிக்கருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1'")
		expect(p.parse("தெசலோனிக்கியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("தெசலோனிக்கருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("தெசலோனிக்கேயருக்கு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கேயருக்கு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("2 Tecalonikkiyarukku 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tecalonikkiyarukku 1:1'")
		expect(p.parse("2 Tecaloṉikkiyarukku 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tecaloṉikkiyarukku 1:1'")
		expect(p.parse("2 Tecalōnikkiyarukku 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tecalōnikkiyarukku 1:1'")
		expect(p.parse("2 Tecalōṉikkiyarukku 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tecalōṉikkiyarukku 1:1'")
		expect(p.parse("2 தெசலோனிக்கேயர் 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெசலோனிக்கேயர் 1:1'")
		expect(p.parse("2 தெசலோனிக்கர் 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெசலோனிக்கர் 1:1'")
		expect(p.parse("2 தெசலோ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெசலோ 1:1'")
		expect(p.parse("2Thess 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2Thess 1:1'")
		expect(p.parse("2 தெச 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெச 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("தெசலோனிக்கருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கருக்கு எழுதிய இரண்டாவது திருமுகம் 1:1'")
		expect(p.parse("தெசலோனிக்கியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கியருக்கு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("தெசலோனிக்கருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கருக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("தெசலோனிக்கேயருக்கு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'தெசலோனிக்கேயருக்கு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("2 TECALONIKKIYARUKKU 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TECALONIKKIYARUKKU 1:1'")
		expect(p.parse("2 TECALOṈIKKIYARUKKU 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TECALOṈIKKIYARUKKU 1:1'")
		expect(p.parse("2 TECALŌNIKKIYARUKKU 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TECALŌNIKKIYARUKKU 1:1'")
		expect(p.parse("2 TECALŌṈIKKIYARUKKU 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TECALŌṈIKKIYARUKKU 1:1'")
		expect(p.parse("2 தெசலோனிக்கேயர் 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெசலோனிக்கேயர் 1:1'")
		expect(p.parse("2 தெசலோனிக்கர் 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெசலோனிக்கர் 1:1'")
		expect(p.parse("2 தெசலோ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெசலோ 1:1'")
		expect(p.parse("2THESS 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2THESS 1:1'")
		expect(p.parse("2 தெச 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 தெச 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Thess (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Thess (ta)", function() {
      
		expect(p.parse("Tecalonikkiyarukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalonikkiyarukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecalonikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalonikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecaloṉikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecaloṉikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōnikkiyarukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecalōnikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōnikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tecalōṉikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Tecalōṉikkiyarukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("தெசலோனிக்கியருக்கு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'தெசலோனிக்கியருக்கு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("தெசலோனிக்கேயருக்கு எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'தெசலோனிக்கேயருக்கு எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("தெசலோனிக்கருக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'தெசலோனிக்கருக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("1 Tecalonikkiyarukku 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tecalonikkiyarukku 1:1'")
		expect(p.parse("1 Tecaloṉikkiyarukku 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tecaloṉikkiyarukku 1:1'")
		expect(p.parse("1 Tecalōnikkiyarukku 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tecalōnikkiyarukku 1:1'")
		expect(p.parse("1 Tecalōṉikkiyarukku 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tecalōṉikkiyarukku 1:1'")
		expect(p.parse("1 தெசலோனிக்கேயர் 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெசலோனிக்கேயர் 1:1'")
		expect(p.parse("1 தெசலோனிக்கர் 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெசலோனிக்கர் 1:1'")
		expect(p.parse("1 தெசலோ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெசலோ 1:1'")
		expect(p.parse("1Thess 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1Thess 1:1'")
		expect(p.parse("1 தெச 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெச 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALONIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALONIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALONIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALOṈIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALOṈIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌNIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌNIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TECALŌṈIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'TECALŌṈIKKIYARUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("தெசலோனிக்கியருக்கு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'தெசலோனிக்கியருக்கு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("தெசலோனிக்கேயருக்கு எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'தெசலோனிக்கேயருக்கு எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("தெசலோனிக்கருக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'தெசலோனிக்கருக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("1 TECALONIKKIYARUKKU 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TECALONIKKIYARUKKU 1:1'")
		expect(p.parse("1 TECALOṈIKKIYARUKKU 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TECALOṈIKKIYARUKKU 1:1'")
		expect(p.parse("1 TECALŌNIKKIYARUKKU 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TECALŌNIKKIYARUKKU 1:1'")
		expect(p.parse("1 TECALŌṈIKKIYARUKKU 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TECALŌṈIKKIYARUKKU 1:1'")
		expect(p.parse("1 தெசலோனிக்கேயர் 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெசலோனிக்கேயர் 1:1'")
		expect(p.parse("1 தெசலோனிக்கர் 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெசலோனிக்கர் 1:1'")
		expect(p.parse("1 தெசலோ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெசலோ 1:1'")
		expect(p.parse("1THESS 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1THESS 1:1'")
		expect(p.parse("1 தெச 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 தெச 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Tim (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Tim (ta)", function() {
      
		expect(p.parse("திமொத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'திமொத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("திமோத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'திமோத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("2 Timotteyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timotteyuvukku 1:1'")
		expect(p.parse("2 Timottēyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timottēyuvukku 1:1'")
		expect(p.parse("2 Timōtteyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timōtteyuvukku 1:1'")
		expect(p.parse("2 Timōttēyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timōttēyuvukku 1:1'")
		expect(p.parse("2 Tīmotteyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tīmotteyuvukku 1:1'")
		expect(p.parse("2 Tīmottēyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tīmottēyuvukku 1:1'")
		expect(p.parse("2 Tīmōtteyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tīmōtteyuvukku 1:1'")
		expect(p.parse("2 Tīmōttēyuvukku 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tīmōttēyuvukku 1:1'")
		expect(p.parse("2 திமொத்தேயு 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 திமொத்தேயு 1:1'")
		expect(p.parse("2 தீமோத்தேயு 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 தீமோத்தேயு 1:1'")
		expect(p.parse("2 தீமோத் 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 தீமோத் 1:1'")
		expect(p.parse("2 திமொ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 திமொ 1:1'")
		expect(p.parse("2Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("திமொத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'திமொத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("திமோத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'திமோத்தேயுவுக்கு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("2 TIMOTTEYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTTEYUVUKKU 1:1'")
		expect(p.parse("2 TIMOTTĒYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTTĒYUVUKKU 1:1'")
		expect(p.parse("2 TIMŌTTEYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMŌTTEYUVUKKU 1:1'")
		expect(p.parse("2 TIMŌTTĒYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMŌTTĒYUVUKKU 1:1'")
		expect(p.parse("2 TĪMOTTEYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TĪMOTTEYUVUKKU 1:1'")
		expect(p.parse("2 TĪMOTTĒYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TĪMOTTĒYUVUKKU 1:1'")
		expect(p.parse("2 TĪMŌTTEYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TĪMŌTTEYUVUKKU 1:1'")
		expect(p.parse("2 TĪMŌTTĒYUVUKKU 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TĪMŌTTĒYUVUKKU 1:1'")
		expect(p.parse("2 திமொத்தேயு 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 திமொத்தேயு 1:1'")
		expect(p.parse("2 தீமோத்தேயு 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 தீமோத்தேயு 1:1'")
		expect(p.parse("2 தீமோத் 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 தீமோத் 1:1'")
		expect(p.parse("2 திமொ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 திமொ 1:1'")
		expect(p.parse("2TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Tim (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Tim (ta)", function() {
      
		expect(p.parse("Timotteyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timotteyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timotteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timotteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timottēyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timottēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timottēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōtteyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timōtteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōtteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōttēyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Timōttēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timōttēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmotteyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmotteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmotteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmottēyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmottēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmottēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōtteyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmōtteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōtteyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōttēyuvukku Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Tīmōttēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Tīmōttēyuvukku Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("திமொத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'திமொத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("திமோத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'திமோத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("1 Timotteyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timotteyuvukku 1:1'")
		expect(p.parse("1 Timottēyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timottēyuvukku 1:1'")
		expect(p.parse("1 Timōtteyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timōtteyuvukku 1:1'")
		expect(p.parse("1 Timōttēyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timōttēyuvukku 1:1'")
		expect(p.parse("1 Tīmotteyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tīmotteyuvukku 1:1'")
		expect(p.parse("1 Tīmottēyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tīmottēyuvukku 1:1'")
		expect(p.parse("1 Tīmōtteyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tīmōtteyuvukku 1:1'")
		expect(p.parse("1 Tīmōttēyuvukku 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tīmōttēyuvukku 1:1'")
		expect(p.parse("1 திமொத்தேயு 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 திமொத்தேயு 1:1'")
		expect(p.parse("1 தீமோத்தேயு 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 தீமோத்தேயு 1:1'")
		expect(p.parse("1 தீமோத் 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 தீமோத் 1:1'")
		expect(p.parse("1 திமொ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 திமொ 1:1'")
		expect(p.parse("1Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMOTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TIMŌTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMŌTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMOTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMOTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTEYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("TĪMŌTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TĪMŌTTĒYUVUKKU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("திமொத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'திமொத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("திமோத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'திமோத்தேயுவுக்கு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("தீமோத்தேயுவுக்கு எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'தீமோத்தேயுவுக்கு எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("1 TIMOTTEYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTTEYUVUKKU 1:1'")
		expect(p.parse("1 TIMOTTĒYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTTĒYUVUKKU 1:1'")
		expect(p.parse("1 TIMŌTTEYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMŌTTEYUVUKKU 1:1'")
		expect(p.parse("1 TIMŌTTĒYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMŌTTĒYUVUKKU 1:1'")
		expect(p.parse("1 TĪMOTTEYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TĪMOTTEYUVUKKU 1:1'")
		expect(p.parse("1 TĪMOTTĒYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TĪMOTTĒYUVUKKU 1:1'")
		expect(p.parse("1 TĪMŌTTEYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TĪMŌTTEYUVUKKU 1:1'")
		expect(p.parse("1 TĪMŌTTĒYUVUKKU 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TĪMŌTTĒYUVUKKU 1:1'")
		expect(p.parse("1 திமொத்தேயு 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 திமொத்தேயு 1:1'")
		expect(p.parse("1 தீமோத்தேயு 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 தீமோத்தேயு 1:1'")
		expect(p.parse("1 தீமோத் 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 தீமோத் 1:1'")
		expect(p.parse("1 திமொ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 திமொ 1:1'")
		expect(p.parse("1TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Titus (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Titus (ta)", function() {
      
		expect(p.parse("தீத்துவுக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துவுக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("தீத்துக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("தீத்துவுக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துவுக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("Tittuvukku Elutiya Nirupam 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tittuvukku Elutiya Nirupam 1:1'")
		expect(p.parse("Tittuvukku Eḻutiya Nirupam 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tittuvukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Tīttuvukku Elutiya Nirupam 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tīttuvukku Elutiya Nirupam 1:1'")
		expect(p.parse("Tīttuvukku Eḻutiya Nirupam 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tīttuvukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("தீத்துவுக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துவுக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Tittuvukku 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tittuvukku 1:1'")
		expect(p.parse("Tīttuvukku 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tīttuvukku 1:1'")
		expect(p.parse("தீத்து 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்து 1:1'")
		expect(p.parse("Titus 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titus 1:1'")
		expect(p.parse("தீத் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத் 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("தீத்துவுக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துவுக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("தீத்துக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("தீத்துவுக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துவுக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("TITTUVUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITTUVUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("TITTUVUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITTUVUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("TĪTTUVUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TĪTTUVUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("TĪTTUVUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TĪTTUVUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("தீத்துவுக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்துவுக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("TITTUVUKKU 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITTUVUKKU 1:1'")
		expect(p.parse("TĪTTUVUKKU 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TĪTTUVUKKU 1:1'")
		expect(p.parse("தீத்து 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத்து 1:1'")
		expect(p.parse("TITUS 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUS 1:1'")
		expect(p.parse("தீத் 1:1").osis()).toEqual("Titus.1.1", "parsing: 'தீத் 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phlm (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Phlm (ta)", function() {
      
		expect(p.parse("பிலமோனுக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலமோனுக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Pilemonukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemonukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilemonukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemonukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilemoṉukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemoṉukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilemoṉukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemoṉukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilemōnukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemōnukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilemōnukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemōnukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilemōṉukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemōṉukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilemōṉukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemōṉukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilēmonukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmonukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilēmonukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmonukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilēmoṉukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmoṉukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilēmoṉukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmoṉukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilēmōnukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmōnukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilēmōnukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmōnukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("Pilēmōṉukku Elutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmōṉukku Elutiya Nirupam 1:1'")
		expect(p.parse("Pilēmōṉukku Eḻutiya Nirupam 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmōṉukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("பிலேமோனுக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலேமோனுக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("பிலேமோனுக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலேமோனுக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Pilemonukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemonukku 1:1'")
		expect(p.parse("Pilemoṉukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemoṉukku 1:1'")
		expect(p.parse("Pilemōnukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemōnukku 1:1'")
		expect(p.parse("Pilemōṉukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilemōṉukku 1:1'")
		expect(p.parse("Pilēmonukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmonukku 1:1'")
		expect(p.parse("Pilēmoṉukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmoṉukku 1:1'")
		expect(p.parse("Pilēmōnukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmōnukku 1:1'")
		expect(p.parse("Pilēmōṉukku 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Pilēmōṉukku 1:1'")
		expect(p.parse("பிலேமோன் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலேமோன் 1:1'")
		expect(p.parse("பிலமோன் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலமோன் 1:1'")
		expect(p.parse("Phlm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Phlm 1:1'")
		expect(p.parse("பிலே 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலே 1:1'")
		expect(p.parse("பில 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பில 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("பிலமோனுக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலமோனுக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("PILEMONUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMONUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMONUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMONUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMOṈUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMOṈUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMOṈUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMOṈUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMŌNUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMŌNUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMŌNUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMŌNUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMŌṈUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMŌṈUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILEMŌṈUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMŌṈUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMONUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMONUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMONUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMONUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMOṈUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMOṈUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMOṈUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMOṈUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMŌNUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMŌNUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMŌNUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMŌNUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMŌṈUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMŌṈUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("PILĒMŌṈUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMŌṈUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("பிலேமோனுக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலேமோனுக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("பிலேமோனுக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலேமோனுக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("PILEMONUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMONUKKU 1:1'")
		expect(p.parse("PILEMOṈUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMOṈUKKU 1:1'")
		expect(p.parse("PILEMŌNUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMŌNUKKU 1:1'")
		expect(p.parse("PILEMŌṈUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILEMŌṈUKKU 1:1'")
		expect(p.parse("PILĒMONUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMONUKKU 1:1'")
		expect(p.parse("PILĒMOṈUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMOṈUKKU 1:1'")
		expect(p.parse("PILĒMŌNUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMŌNUKKU 1:1'")
		expect(p.parse("PILĒMŌṈUKKU 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PILĒMŌṈUKKU 1:1'")
		expect(p.parse("பிலேமோன் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலேமோன் 1:1'")
		expect(p.parse("பிலமோன் 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலமோன் 1:1'")
		expect(p.parse("PHLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHLM 1:1'")
		expect(p.parse("பிலே 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பிலே 1:1'")
		expect(p.parse("பில 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'பில 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Heb (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Heb (ta)", function() {
      
		expect(p.parse("எபிரேயருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரேயருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Epireyarukku Elutiya Nirupam 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Epireyarukku Elutiya Nirupam 1:1'")
		expect(p.parse("Epireyarukku Eḻutiya Nirupam 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Epireyarukku Eḻutiya Nirupam 1:1'")
		expect(p.parse("எபிரெயருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரெயருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("எபிரேயருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரேயருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("Epireyarukku 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Epireyarukku 1:1'")
		expect(p.parse("எபிரேயர் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரேயர் 1:1'")
		expect(p.parse("எபிரே 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரே 1:1'")
		expect(p.parse("Heb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heb 1:1'")
		expect(p.parse("எபி 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபி 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("எபிரேயருக்கு எழுதிய திருமுகம் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரேயருக்கு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("EPIREYARUKKU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Heb.1.1", "parsing: 'EPIREYARUKKU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("EPIREYARUKKU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Heb.1.1", "parsing: 'EPIREYARUKKU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("எபிரெயருக்கு எழுதிய நிருபம் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரெயருக்கு எழுதிய நிருபம் 1:1'")
		expect(p.parse("எபிரேயருக்கு எழுதிய கடிதம் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரேயருக்கு எழுதிய கடிதம் 1:1'")
		expect(p.parse("EPIREYARUKKU 1:1").osis()).toEqual("Heb.1.1", "parsing: 'EPIREYARUKKU 1:1'")
		expect(p.parse("எபிரேயர் 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரேயர் 1:1'")
		expect(p.parse("எபிரே 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபிரே 1:1'")
		expect(p.parse("HEB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEB 1:1'")
		expect(p.parse("எபி 1:1").osis()).toEqual("Heb.1.1", "parsing: 'எபி 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jas (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jas (ta)", function() {
      
		expect(p.parse("யாக்கோபு எழுதிய திருமுகம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("Yakkopu Elutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakkopu Elutiya Nirupam 1:1'")
		expect(p.parse("Yakkopu Eḻutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakkopu Eḻutiya Nirupam 1:1'")
		expect(p.parse("Yakkōpu Elutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakkōpu Elutiya Nirupam 1:1'")
		expect(p.parse("Yakkōpu Eḻutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakkōpu Eḻutiya Nirupam 1:1'")
		expect(p.parse("Yākkopu Elutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yākkopu Elutiya Nirupam 1:1'")
		expect(p.parse("Yākkopu Eḻutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yākkopu Eḻutiya Nirupam 1:1'")
		expect(p.parse("Yākkōpu Elutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yākkōpu Elutiya Nirupam 1:1'")
		expect(p.parse("Yākkōpu Eḻutiya Nirupam 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yākkōpu Eḻutiya Nirupam 1:1'")
		expect(p.parse("யாக்கோபு எழுதிய நிருபம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு எழுதிய நிருபம் 1:1'")
		expect(p.parse("யாக்கோபு எழுதிய கடிதம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு எழுதிய கடிதம் 1:1'")
		expect(p.parse("யாகப்பர் திருமுகம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாகப்பர் திருமுகம் 1:1'")
		expect(p.parse("யாக்கோபு திருமுகம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு திருமுகம் 1:1'")
		expect(p.parse("யாக்கோபு 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு 1:1'")
		expect(p.parse("Yakkopu 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakkopu 1:1'")
		expect(p.parse("Yakkōpu 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakkōpu 1:1'")
		expect(p.parse("Yākkopu 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yākkopu 1:1'")
		expect(p.parse("Yākkōpu 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yākkōpu 1:1'")
		expect(p.parse("யாக் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக் 1:1'")
		expect(p.parse("Jas 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jas 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யாக்கோபு எழுதிய திருமுகம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு எழுதிய திருமுகம் 1:1'")
		expect(p.parse("YAKKOPU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKKOPU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YAKKOPU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKKOPU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("YAKKŌPU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKKŌPU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YAKKŌPU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKKŌPU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("YĀKKOPU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YĀKKOPU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YĀKKOPU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YĀKKOPU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("YĀKKŌPU ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YĀKKŌPU ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YĀKKŌPU EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YĀKKŌPU EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("யாக்கோபு எழுதிய நிருபம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு எழுதிய நிருபம் 1:1'")
		expect(p.parse("யாக்கோபு எழுதிய கடிதம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு எழுதிய கடிதம் 1:1'")
		expect(p.parse("யாகப்பர் திருமுகம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாகப்பர் திருமுகம் 1:1'")
		expect(p.parse("யாக்கோபு திருமுகம் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு திருமுகம் 1:1'")
		expect(p.parse("யாக்கோபு 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக்கோபு 1:1'")
		expect(p.parse("YAKKOPU 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKKOPU 1:1'")
		expect(p.parse("YAKKŌPU 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKKŌPU 1:1'")
		expect(p.parse("YĀKKOPU 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YĀKKOPU 1:1'")
		expect(p.parse("YĀKKŌPU 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YĀKKŌPU 1:1'")
		expect(p.parse("யாக் 1:1").osis()).toEqual("Jas.1.1", "parsing: 'யாக் 1:1'")
		expect(p.parse("JAS 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Pet (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Pet (ta)", function() {
      
		expect(p.parse("Peturu Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Peturu Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Elutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Irantavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Irantavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Irantāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Irantāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Iranṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Iranṭavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Iranṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Iranṭāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Iraṇtavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Iraṇtavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Iraṇtāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Iraṇtāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Iraṇṭavatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Iraṇṭavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Iraṇṭāvatu Nirupam 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pēturu Eḻutiya Iraṇṭāvatu Nirupam 1:1'")
		expect(p.parse("பேதுரு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("பேதுரு இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("2 இராயப்பர் 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 இராயப்பர் 1:1'")
		expect(p.parse("2 Peturu 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Peturu 1:1'")
		expect(p.parse("2 Pēturu 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Pēturu 1:1'")
		expect(p.parse("2 பேதுரு 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 பேதுரு 1:1'")
		expect(p.parse("2 பேது 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 பேது 1:1'")
		expect(p.parse("2Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PETURU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETURU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU ELUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRANTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRANTAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRANTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRANTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRANṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRANṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRANṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRAṆTAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRAṆTĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRAṆṬAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PĒTURU EḺUTIYA IRAṆṬĀVATU NIRUPAM 1:1'")
		expect(p.parse("பேதுரு எழுதிய இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு எழுதிய இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய இரண்டாவது நிருபம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு எழுதிய இரண்டாவது நிருபம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய இரண்டாம் கடிதம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு எழுதிய இரண்டாம் கடிதம் 1:1'")
		expect(p.parse("பேதுரு இரண்டாம் திருமுகம் 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'பேதுரு இரண்டாம் திருமுகம் 1:1'")
		expect(p.parse("2 இராயப்பர் 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 இராயப்பர் 1:1'")
		expect(p.parse("2 PETURU 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PETURU 1:1'")
		expect(p.parse("2 PĒTURU 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PĒTURU 1:1'")
		expect(p.parse("2 பேதுரு 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 பேதுரு 1:1'")
		expect(p.parse("2 பேது 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 பேது 1:1'")
		expect(p.parse("2PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Pet (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Pet (ta)", function() {
      
		expect(p.parse("Peturu Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Peturu Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Peturu Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Peturu Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Peturu Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Peturu Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Peturu Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Pēturu Elutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Elutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Pēturu Elutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Mutalavatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Pēturu Eḻutiya Mutalavatu Nirupam 1:1'")
		expect(p.parse("Pēturu Eḻutiya Mutalāvatu Nirupam 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Pēturu Eḻutiya Mutalāvatu Nirupam 1:1'")
		expect(p.parse("பேதுரு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("பேதுரு முதல் திருமுகம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு முதல் திருமுகம் 1:1'")
		expect(p.parse("1 இராயப்பர் 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 இராயப்பர் 1:1'")
		expect(p.parse("1 Peturu 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Peturu 1:1'")
		expect(p.parse("1 Pēturu 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Pēturu 1:1'")
		expect(p.parse("1 பேதுரு 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 பேதுரு 1:1'")
		expect(p.parse("1 பேது 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 பேது 1:1'")
		expect(p.parse("1Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PETURU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PETURU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PETURU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PETURU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("PETURU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PETURU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PĒTURU ELUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU ELUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PĒTURU ELUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA MUTALAVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PĒTURU EḺUTIYA MUTALAVATU NIRUPAM 1:1'")
		expect(p.parse("PĒTURU EḺUTIYA MUTALĀVATU NIRUPAM 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PĒTURU EḺUTIYA MUTALĀVATU NIRUPAM 1:1'")
		expect(p.parse("பேதுரு எழுதிய முதலாவது நிருபம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு எழுதிய முதலாவது நிருபம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய முதல் திருமுகம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு எழுதிய முதல் திருமுகம் 1:1'")
		expect(p.parse("பேதுரு எழுதிய முதலாம் கடிதம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு எழுதிய முதலாம் கடிதம் 1:1'")
		expect(p.parse("பேதுரு முதல் திருமுகம் 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'பேதுரு முதல் திருமுகம் 1:1'")
		expect(p.parse("1 இராயப்பர் 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 இராயப்பர் 1:1'")
		expect(p.parse("1 PETURU 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PETURU 1:1'")
		expect(p.parse("1 PĒTURU 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PĒTURU 1:1'")
		expect(p.parse("1 பேதுரு 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 பேதுரு 1:1'")
		expect(p.parse("1 பேது 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 பேது 1:1'")
		expect(p.parse("1PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jude (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jude (ta)", function() {
      
		expect(p.parse("Yuta Elutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yuta Elutiya Nirupam 1:1'")
		expect(p.parse("Yuta Eḻutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yuta Eḻutiya Nirupam 1:1'")
		expect(p.parse("Yutā Elutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yutā Elutiya Nirupam 1:1'")
		expect(p.parse("Yutā Eḻutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yutā Eḻutiya Nirupam 1:1'")
		expect(p.parse("Yūta Elutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yūta Elutiya Nirupam 1:1'")
		expect(p.parse("Yūta Eḻutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yūta Eḻutiya Nirupam 1:1'")
		expect(p.parse("Yūtā Elutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yūtā Elutiya Nirupam 1:1'")
		expect(p.parse("Yūtā Eḻutiya Nirupam 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yūtā Eḻutiya Nirupam 1:1'")
		expect(p.parse("யூதா எழுதிய நிருபம் 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா எழுதிய நிருபம் 1:1'")
		expect(p.parse("யூதா எழுதிய கடிதம் 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா எழுதிய கடிதம் 1:1'")
		expect(p.parse("யூதா திருமுகம் 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா திருமுகம் 1:1'")
		expect(p.parse("Jude 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jude 1:1'")
		expect(p.parse("Yuta 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yuta 1:1'")
		expect(p.parse("Yutā 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yutā 1:1'")
		expect(p.parse("Yūta 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yūta 1:1'")
		expect(p.parse("Yūtā 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yūtā 1:1'")
		expect(p.parse("யூதா 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YUTA ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUTA ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YUTA EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUTA EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("YUTĀ ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUTĀ ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YUTĀ EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUTĀ EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("YŪTA ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YŪTA ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YŪTA EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YŪTA EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("YŪTĀ ELUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YŪTĀ ELUTIYA NIRUPAM 1:1'")
		expect(p.parse("YŪTĀ EḺUTIYA NIRUPAM 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YŪTĀ EḺUTIYA NIRUPAM 1:1'")
		expect(p.parse("யூதா எழுதிய நிருபம் 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா எழுதிய நிருபம் 1:1'")
		expect(p.parse("யூதா எழுதிய கடிதம் 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா எழுதிய கடிதம் 1:1'")
		expect(p.parse("யூதா திருமுகம் 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா திருமுகம் 1:1'")
		expect(p.parse("JUDE 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDE 1:1'")
		expect(p.parse("YUTA 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUTA 1:1'")
		expect(p.parse("YUTĀ 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUTĀ 1:1'")
		expect(p.parse("YŪTA 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YŪTA 1:1'")
		expect(p.parse("YŪTĀ 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YŪTĀ 1:1'")
		expect(p.parse("யூதா 1:1").osis()).toEqual("Jude.1.1", "parsing: 'யூதா 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Tob (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Tob (ta)", function() {
      
		expect(p.parse("தொபியாசு ஆகமம் 1:1").osis()).toEqual("Tob.1.1", "parsing: 'தொபியாசு ஆகமம் 1:1'")
		expect(p.parse("தோபித்து 1:1").osis()).toEqual("Tob.1.1", "parsing: 'தோபித்து 1:1'")
		expect(p.parse("தோபி 1:1").osis()).toEqual("Tob.1.1", "parsing: 'தோபி 1:1'")
		expect(p.parse("Tob 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tob 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jdt (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jdt (ta)", function() {
      
		expect(p.parse("யூதித்து 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'யூதித்து 1:1'")
		expect(p.parse("யூதி 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'யூதி 1:1'")
		expect(p.parse("Jdt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Jdt 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bar (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Bar (ta)", function() {
      
		expect(p.parse("பாரூக்கு 1:1").osis()).toEqual("Bar.1.1", "parsing: 'பாரூக்கு 1:1'")
		expect(p.parse("பாரூ 1:1").osis()).toEqual("Bar.1.1", "parsing: 'பாரூ 1:1'")
		expect(p.parse("Bar 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bar 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sus (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Sus (ta)", function() {
      
		expect(p.parse("சூசன்னா 1:1").osis()).toEqual("Sus.1.1", "parsing: 'சூசன்னா 1:1'")
		expect(p.parse("Sus 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Sus 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Macc (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Macc (ta)", function() {
      
		expect(p.parse("2 மக்கபேயர் 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 மக்கபேயர் 1:1'")
		expect(p.parse("2 மக் 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 மக் 1:1'")
		expect(p.parse("2Macc 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3Macc (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 3Macc (ta)", function() {
      
		expect(p.parse("3 மக்கபேயர் 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 மக்கபேயர் 1:1'")
		expect(p.parse("3 மக் 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 மக் 1:1'")
		expect(p.parse("3Macc 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 4Macc (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 4Macc (ta)", function() {
      
		expect(p.parse("4 மக்கபேயர் 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 மக்கபேயர் 1:1'")
		expect(p.parse("4 மக் 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 மக் 1:1'")
		expect(p.parse("4Macc 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Macc (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Macc (ta)", function() {
      
		expect(p.parse("1 மக்கபேயர் 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 மக்கபேயர் 1:1'")
		expect(p.parse("1 மக் 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 மக் 1:1'")
		expect(p.parse("1Macc 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book John,Josh,Joel,Jonah (ta)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: John,Josh,Joel,Jonah (ta)", function() {
      
		expect(p.parse("யோ 1:1").osis()).toEqual("John.1.1", "parsing: 'யோ 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("யோ 1:1").osis()).toEqual("John.1.1", "parsing: 'யோ 1:1'")
		;
      return true;
    });
  });

  describe("Miscellaneous tests", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    it("should return the expected language", function() {
      return expect(p.languages).toEqual(["ta"]);
    });
    it("should handle ranges (ta)", function() {
      expect(p.parse("Titus 1:1 to 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 to 2'");
      expect(p.parse("Matt 1to2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1to2'");
      return expect(p.parse("Phlm 2 TO 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 TO 3'");
    });
    it("should handle chapters (ta)", function() {
      expect(p.parse("Titus 1:1, அதிகாரம் 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, அதிகாரம் 2'");
      expect(p.parse("Matt 3:4 அதிகாரம் 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 அதிகாரம் 6'");
      expect(p.parse("Titus 1:1, அதி 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, அதி 2'");
      return expect(p.parse("Matt 3:4 அதி 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 அதி 6'");
    });
    it("should handle verses (ta)", function() {
      expect(p.parse("Exod 1:1 verse 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 verse 3'");
      return expect(p.parse("Phlm VERSE 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm VERSE 6'");
    });
    it("should handle 'and' (ta)", function() {
      expect(p.parse("Exod 1:1 மற்றும் 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 மற்றும் 3'");
      return expect(p.parse("Phlm 2 மற்றும் 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 மற்றும் 6'");
    });
    it("should handle titles (ta)", function() {
      expect(p.parse("Ps 3 title, 4:2, 5:title").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 title, 4:2, 5:title'");
      return expect(p.parse("PS 3 TITLE, 4:2, 5:TITLE").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 TITLE, 4:2, 5:TITLE'");
    });
    it("should handle 'ff' (ta)", function() {
      expect(p.parse("Rev 3ff, 4:2ff").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3ff, 4:2ff'");
      return expect(p.parse("REV 3 FF, 4:2 FF").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'REV 3 FF, 4:2 FF'");
    });
    it("should handle translations (ta)", function() {
      expect(p.parse("Lev 1 (ERV)").osis_and_translations()).toEqual([["Lev.1", "ERV"]]);
      return expect(p.parse("lev 1 erv").osis_and_translations()).toEqual([["Lev.1", "ERV"]]);
    });
    it("should handle book ranges (ta)", function() {
      p.set_options({
        book_alone_strategy: "full",
        book_range_strategy: "include"
      });
      return expect(p.parse("முதலாவது to முன்றாம்  யோவான்").osis()).toEqual("1John.1-3John.1", "parsing: 'முதலாவது to முன்றாம்  யோவான்'");
    });
    return it("should handle boundaries (ta)", function() {
      p.set_options({
        book_alone_strategy: "full"
      });
      expect(p.parse("\u2014Matt\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\u2014Matt\u2014'");
      return expect(p.parse("\u201cMatt 1:1\u201d").osis()).toEqual("Matt.1.1", "parsing: '\u201cMatt 1:1\u201d'");
    });
  });

}).call(this);
