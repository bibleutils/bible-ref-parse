(function() {
  var bcv_parser;

  bcv_parser = require("../../js/sw_bcv_parser.js").bcv_parser;

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

  describe("Localized book Gen (sw)", function() {
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
    return it("should handle book: Gen (sw)", function() {
      
		expect(p.parse("Kitabu cha Kwanza cha Musa 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Kitabu cha Kwanza cha Musa 1:1'")
		expect(p.parse("Mwanzo 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Mwanzo 1:1'")
		expect(p.parse("Gen 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Gen 1:1'")
		expect(p.parse("Mwa 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Mwa 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA KWANZA CHA MUSA 1:1").osis()).toEqual("Gen.1.1", "parsing: 'KITABU CHA KWANZA CHA MUSA 1:1'")
		expect(p.parse("MWANZO 1:1").osis()).toEqual("Gen.1.1", "parsing: 'MWANZO 1:1'")
		expect(p.parse("GEN 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GEN 1:1'")
		expect(p.parse("MWA 1:1").osis()).toEqual("Gen.1.1", "parsing: 'MWA 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Exod (sw)", function() {
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
    return it("should handle book: Exod (sw)", function() {
      
		expect(p.parse("Kitabu cha Pili cha Musa 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Kitabu cha Pili cha Musa 1:1'")
		expect(p.parse("Kutoka 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Kutoka 1:1'")
		expect(p.parse("Exod 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exod 1:1'")
		expect(p.parse("Kut 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Kut 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA PILI CHA MUSA 1:1").osis()).toEqual("Exod.1.1", "parsing: 'KITABU CHA PILI CHA MUSA 1:1'")
		expect(p.parse("KUTOKA 1:1").osis()).toEqual("Exod.1.1", "parsing: 'KUTOKA 1:1'")
		expect(p.parse("EXOD 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXOD 1:1'")
		expect(p.parse("KUT 1:1").osis()).toEqual("Exod.1.1", "parsing: 'KUT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bel (sw)", function() {
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
    return it("should handle book: Bel (sw)", function() {
      
		expect(p.parse("Danieli na Makuhani wa Beli 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Danieli na Makuhani wa Beli 1:1'")
		expect(p.parse("Bel 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lev (sw)", function() {
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
    return it("should handle book: Lev (sw)", function() {
      
		expect(p.parse("Kitabu cha Tatu cha Musa 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Kitabu cha Tatu cha Musa 1:1'")
		expect(p.parse("Mambo ya Walawi 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Mambo ya Walawi 1:1'")
		expect(p.parse("Walawi 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Walawi 1:1'")
		expect(p.parse("Law 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Law 1:1'")
		expect(p.parse("Lev 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lev 1:1'")
		expect(p.parse("Wal 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Wal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA TATU CHA MUSA 1:1").osis()).toEqual("Lev.1.1", "parsing: 'KITABU CHA TATU CHA MUSA 1:1'")
		expect(p.parse("MAMBO YA WALAWI 1:1").osis()).toEqual("Lev.1.1", "parsing: 'MAMBO YA WALAWI 1:1'")
		expect(p.parse("WALAWI 1:1").osis()).toEqual("Lev.1.1", "parsing: 'WALAWI 1:1'")
		expect(p.parse("LAW 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LAW 1:1'")
		expect(p.parse("LEV 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEV 1:1'")
		expect(p.parse("WAL 1:1").osis()).toEqual("Lev.1.1", "parsing: 'WAL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Num (sw)", function() {
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
    return it("should handle book: Num (sw)", function() {
      
		expect(p.parse("Kitabu cha Nne cha Musa 1:1").osis()).toEqual("Num.1.1", "parsing: 'Kitabu cha Nne cha Musa 1:1'")
		expect(p.parse("Hesabu 1:1").osis()).toEqual("Num.1.1", "parsing: 'Hesabu 1:1'")
		expect(p.parse("Hes 1:1").osis()).toEqual("Num.1.1", "parsing: 'Hes 1:1'")
		expect(p.parse("Num 1:1").osis()).toEqual("Num.1.1", "parsing: 'Num 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA NNE CHA MUSA 1:1").osis()).toEqual("Num.1.1", "parsing: 'KITABU CHA NNE CHA MUSA 1:1'")
		expect(p.parse("HESABU 1:1").osis()).toEqual("Num.1.1", "parsing: 'HESABU 1:1'")
		expect(p.parse("HES 1:1").osis()).toEqual("Num.1.1", "parsing: 'HES 1:1'")
		expect(p.parse("NUM 1:1").osis()).toEqual("Num.1.1", "parsing: 'NUM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sir (sw)", function() {
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
    return it("should handle book: Sir (sw)", function() {
      
		expect(p.parse("Yoshua bin Sira 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Yoshua bin Sira 1:1'")
		expect(p.parse("Sira 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sira 1:1'")
		expect(p.parse("Sir 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sir 1:1'")
		expect(p.parse("YbS 1:1").osis()).toEqual("Sir.1.1", "parsing: 'YbS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Wis (sw)", function() {
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
    return it("should handle book: Wis (sw)", function() {
      
		expect(p.parse("Hekima ya Solomoni 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Hekima ya Solomoni 1:1'")
		expect(p.parse("Hekima 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Hekima 1:1'")
		expect(p.parse("Hek 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Hek 1:1'")
		expect(p.parse("Wis 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Wis 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lam (sw)", function() {
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
    return it("should handle book: Lam (sw)", function() {
      
		expect(p.parse("Maombolezo ya Yeremia 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Maombolezo ya Yeremia 1:1'")
		expect(p.parse("Maombolezo 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Maombolezo 1:1'")
		expect(p.parse("Lam 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Lam 1:1'")
		expect(p.parse("Mao 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Mao 1:1'")
		expect(p.parse("Omb 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Omb 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MAOMBOLEZO YA YEREMIA 1:1").osis()).toEqual("Lam.1.1", "parsing: 'MAOMBOLEZO YA YEREMIA 1:1'")
		expect(p.parse("MAOMBOLEZO 1:1").osis()).toEqual("Lam.1.1", "parsing: 'MAOMBOLEZO 1:1'")
		expect(p.parse("LAM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'LAM 1:1'")
		expect(p.parse("MAO 1:1").osis()).toEqual("Lam.1.1", "parsing: 'MAO 1:1'")
		expect(p.parse("OMB 1:1").osis()).toEqual("Lam.1.1", "parsing: 'OMB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book EpJer (sw)", function() {
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
    return it("should handle book: EpJer (sw)", function() {
      
		expect(p.parse("Barua ya Yeremia 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Barua ya Yeremia 1:1'")
		expect(p.parse("EpJer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'EpJer 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rev (sw)", function() {
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
    return it("should handle book: Rev (sw)", function() {
      
		expect(p.parse("Ufunua wa Yohana 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Ufunua wa Yohana 1:1'")
		expect(p.parse("Ufunuo wa Yohana 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Ufunuo wa Yohana 1:1'")
		expect(p.parse("Ufunuo wa Yohane 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Ufunuo wa Yohane 1:1'")
		expect(p.parse("Ufunuo 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Ufunuo 1:1'")
		expect(p.parse("Rev 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rev 1:1'")
		expect(p.parse("Ufu 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Ufu 1:1'")
		expect(p.parse("Uf 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Uf 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UFUNUA WA YOHANA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'UFUNUA WA YOHANA 1:1'")
		expect(p.parse("UFUNUO WA YOHANA 1:1").osis()).toEqual("Rev.1.1", "parsing: 'UFUNUO WA YOHANA 1:1'")
		expect(p.parse("UFUNUO WA YOHANE 1:1").osis()).toEqual("Rev.1.1", "parsing: 'UFUNUO WA YOHANE 1:1'")
		expect(p.parse("UFUNUO 1:1").osis()).toEqual("Rev.1.1", "parsing: 'UFUNUO 1:1'")
		expect(p.parse("REV 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REV 1:1'")
		expect(p.parse("UFU 1:1").osis()).toEqual("Rev.1.1", "parsing: 'UFU 1:1'")
		expect(p.parse("UF 1:1").osis()).toEqual("Rev.1.1", "parsing: 'UF 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrMan (sw)", function() {
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
    return it("should handle book: PrMan (sw)", function() {
      
		expect(p.parse("PrMan 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'PrMan 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Deut (sw)", function() {
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
    return it("should handle book: Deut (sw)", function() {
      
		expect(p.parse("Kitabu cha Tano cha Musa 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Kitabu cha Tano cha Musa 1:1'")
		expect(p.parse("Kumbukumbu la Sheria 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Kumbukumbu la Sheria 1:1'")
		expect(p.parse("Kumbukumbu la Torati 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Kumbukumbu la Torati 1:1'")
		expect(p.parse("Kumbukumbu 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Kumbukumbu 1:1'")
		expect(p.parse("Torati 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Torati 1:1'")
		expect(p.parse("Deut 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deut 1:1'")
		expect(p.parse("Kumb 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Kumb 1:1'")
		expect(p.parse("Kum 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Kum 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA TANO CHA MUSA 1:1").osis()).toEqual("Deut.1.1", "parsing: 'KITABU CHA TANO CHA MUSA 1:1'")
		expect(p.parse("KUMBUKUMBU LA SHERIA 1:1").osis()).toEqual("Deut.1.1", "parsing: 'KUMBUKUMBU LA SHERIA 1:1'")
		expect(p.parse("KUMBUKUMBU LA TORATI 1:1").osis()).toEqual("Deut.1.1", "parsing: 'KUMBUKUMBU LA TORATI 1:1'")
		expect(p.parse("KUMBUKUMBU 1:1").osis()).toEqual("Deut.1.1", "parsing: 'KUMBUKUMBU 1:1'")
		expect(p.parse("TORATI 1:1").osis()).toEqual("Deut.1.1", "parsing: 'TORATI 1:1'")
		expect(p.parse("DEUT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUT 1:1'")
		expect(p.parse("KUMB 1:1").osis()).toEqual("Deut.1.1", "parsing: 'KUMB 1:1'")
		expect(p.parse("KUM 1:1").osis()).toEqual("Deut.1.1", "parsing: 'KUM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Josh (sw)", function() {
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
    return it("should handle book: Josh (sw)", function() {
      
		expect(p.parse("Yoshua 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Yoshua 1:1'")
		expect(p.parse("Josh 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josh 1:1'")
		expect(p.parse("Yos 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Yos 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YOSHUA 1:1").osis()).toEqual("Josh.1.1", "parsing: 'YOSHUA 1:1'")
		expect(p.parse("JOSH 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSH 1:1'")
		expect(p.parse("YOS 1:1").osis()).toEqual("Josh.1.1", "parsing: 'YOS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Judg (sw)", function() {
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
    return it("should handle book: Judg (sw)", function() {
      
		expect(p.parse("Waamuzi 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Waamuzi 1:1'")
		expect(p.parse("Judg 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Judg 1:1'")
		expect(p.parse("Waam 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Waam 1:1'")
		expect(p.parse("Amu 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Amu 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WAAMUZI 1:1").osis()).toEqual("Judg.1.1", "parsing: 'WAAMUZI 1:1'")
		expect(p.parse("JUDG 1:1").osis()).toEqual("Judg.1.1", "parsing: 'JUDG 1:1'")
		expect(p.parse("WAAM 1:1").osis()).toEqual("Judg.1.1", "parsing: 'WAAM 1:1'")
		expect(p.parse("AMU 1:1").osis()).toEqual("Judg.1.1", "parsing: 'AMU 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ruth (sw)", function() {
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
    return it("should handle book: Ruth (sw)", function() {
      
		expect(p.parse("Kitabu cha Ruthi 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Kitabu cha Ruthi 1:1'")
		expect(p.parse("Kitabu cha Ruthu 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Kitabu cha Ruthu 1:1'")
		expect(p.parse("Ruthi 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruthi 1:1'")
		expect(p.parse("Ruthu 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruthu 1:1'")
		expect(p.parse("Ruth 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruth 1:1'")
		expect(p.parse("Rut 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Rut 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA RUTHI 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'KITABU CHA RUTHI 1:1'")
		expect(p.parse("KITABU CHA RUTHU 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'KITABU CHA RUTHU 1:1'")
		expect(p.parse("RUTHI 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTHI 1:1'")
		expect(p.parse("RUTHU 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTHU 1:1'")
		expect(p.parse("RUTH 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTH 1:1'")
		expect(p.parse("RUT 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Esd (sw)", function() {
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
    return it("should handle book: 1Esd (sw)", function() {
      
		expect(p.parse("Kitabu cha Kwanza cha Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Kitabu cha Kwanza cha Ezra 1:1'")
		expect(p.parse("Kwanza Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Kwanza Ezra 1:1'")
		expect(p.parse("1. Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Ezra 1:1'")
		expect(p.parse("I. Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Ezra 1:1'")
		expect(p.parse("1 Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ezra 1:1'")
		expect(p.parse("I Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Ezra 1:1'")
		expect(p.parse("1Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Esd (sw)", function() {
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
    return it("should handle book: 2Esd (sw)", function() {
      
		expect(p.parse("Kitabu cha Pili cha Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Kitabu cha Pili cha Ezra 1:1'")
		expect(p.parse("Pili Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Pili Ezra 1:1'")
		expect(p.parse("II. Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Ezra 1:1'")
		expect(p.parse("2. Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Ezra 1:1'")
		expect(p.parse("II Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Ezra 1:1'")
		expect(p.parse("2 Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ezra 1:1'")
		expect(p.parse("2Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Isa (sw)", function() {
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
    return it("should handle book: Isa (sw)", function() {
      
		expect(p.parse("Isaya 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaya 1:1'")
		expect(p.parse("Isa 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isa 1:1'")
		expect(p.parse("Is 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Is 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ISAYA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAYA 1:1'")
		expect(p.parse("ISA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISA 1:1'")
		expect(p.parse("IS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'IS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Sam (sw)", function() {
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
    return it("should handle book: 2Sam (sw)", function() {
      
		expect(p.parse("Kitabu cha Pili cha Samueli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Kitabu cha Pili cha Samueli 1:1'")
		expect(p.parse("Pili Samueli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Pili Samueli 1:1'")
		expect(p.parse("Pili Samweli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Pili Samweli 1:1'")
		expect(p.parse("II. Samueli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Samueli 1:1'")
		expect(p.parse("II. Samweli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Samweli 1:1'")
		expect(p.parse("2. Samueli 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Samueli 1:1'")
		expect(p.parse("2. Samweli 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Samweli 1:1'")
		expect(p.parse("II Samueli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Samueli 1:1'")
		expect(p.parse("II Samweli 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Samweli 1:1'")
		expect(p.parse("Samueli II 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Samueli II 1:1'")
		expect(p.parse("2 Samueli 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Samueli 1:1'")
		expect(p.parse("2 Samweli 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Samweli 1:1'")
		expect(p.parse("Pili Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Pili Sam 1:1'")
		expect(p.parse("II. Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Sam 1:1'")
		expect(p.parse("2. Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Sam 1:1'")
		expect(p.parse("II Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Sam 1:1'")
		expect(p.parse("2 Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Sam 1:1'")
		expect(p.parse("2Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA PILI CHA SAMUELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'KITABU CHA PILI CHA SAMUELI 1:1'")
		expect(p.parse("PILI SAMUELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'PILI SAMUELI 1:1'")
		expect(p.parse("PILI SAMWELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'PILI SAMWELI 1:1'")
		expect(p.parse("II. SAMUELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SAMUELI 1:1'")
		expect(p.parse("II. SAMWELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SAMWELI 1:1'")
		expect(p.parse("2. SAMUELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SAMUELI 1:1'")
		expect(p.parse("2. SAMWELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SAMWELI 1:1'")
		expect(p.parse("II SAMUELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SAMUELI 1:1'")
		expect(p.parse("II SAMWELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SAMWELI 1:1'")
		expect(p.parse("SAMUELI II 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'SAMUELI II 1:1'")
		expect(p.parse("2 SAMUELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAMUELI 1:1'")
		expect(p.parse("2 SAMWELI 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAMWELI 1:1'")
		expect(p.parse("PILI SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'PILI SAM 1:1'")
		expect(p.parse("II. SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SAM 1:1'")
		expect(p.parse("2. SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SAM 1:1'")
		expect(p.parse("II SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SAM 1:1'")
		expect(p.parse("2 SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAM 1:1'")
		expect(p.parse("2SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2SAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Sam (sw)", function() {
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
    return it("should handle book: 1Sam (sw)", function() {
      
		expect(p.parse("Kitabu cha Kwanza cha Samueli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Kitabu cha Kwanza cha Samueli 1:1'")
		expect(p.parse("Kwanza Samueli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Kwanza Samueli 1:1'")
		expect(p.parse("Kwanza Samweli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Kwanza Samweli 1:1'")
		expect(p.parse("1. Samueli 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Samueli 1:1'")
		expect(p.parse("1. Samweli 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Samweli 1:1'")
		expect(p.parse("I. Samueli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Samueli 1:1'")
		expect(p.parse("I. Samweli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Samweli 1:1'")
		expect(p.parse("Kwanza Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Kwanza Sam 1:1'")
		expect(p.parse("1 Samueli 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Samueli 1:1'")
		expect(p.parse("1 Samweli 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Samweli 1:1'")
		expect(p.parse("I Samueli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Samueli 1:1'")
		expect(p.parse("I Samweli 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Samweli 1:1'")
		expect(p.parse("Samueli I 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Samueli I 1:1'")
		expect(p.parse("1. Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Sam 1:1'")
		expect(p.parse("I. Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Sam 1:1'")
		expect(p.parse("1 Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Sam 1:1'")
		expect(p.parse("I Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Sam 1:1'")
		expect(p.parse("1Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA KWANZA CHA SAMUELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'KITABU CHA KWANZA CHA SAMUELI 1:1'")
		expect(p.parse("KWANZA SAMUELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'KWANZA SAMUELI 1:1'")
		expect(p.parse("KWANZA SAMWELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'KWANZA SAMWELI 1:1'")
		expect(p.parse("1. SAMUELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SAMUELI 1:1'")
		expect(p.parse("1. SAMWELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SAMWELI 1:1'")
		expect(p.parse("I. SAMUELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SAMUELI 1:1'")
		expect(p.parse("I. SAMWELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SAMWELI 1:1'")
		expect(p.parse("KWANZA SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'KWANZA SAM 1:1'")
		expect(p.parse("1 SAMUELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAMUELI 1:1'")
		expect(p.parse("1 SAMWELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAMWELI 1:1'")
		expect(p.parse("I SAMUELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SAMUELI 1:1'")
		expect(p.parse("I SAMWELI 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SAMWELI 1:1'")
		expect(p.parse("SAMUELI I 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'SAMUELI I 1:1'")
		expect(p.parse("1. SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SAM 1:1'")
		expect(p.parse("I. SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SAM 1:1'")
		expect(p.parse("1 SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAM 1:1'")
		expect(p.parse("I SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SAM 1:1'")
		expect(p.parse("1SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1SAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Kgs (sw)", function() {
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
    return it("should handle book: 2Kgs (sw)", function() {
      
		expect(p.parse("Kitabu cha Pili cha Wafalme 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Kitabu cha Pili cha Wafalme 1:1'")
		expect(p.parse("Pili Wafalme 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Pili Wafalme 1:1'")
		expect(p.parse("II. Wafalme 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Wafalme 1:1'")
		expect(p.parse("2. Wafalme 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Wafalme 1:1'")
		expect(p.parse("II Wafalme 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Wafalme 1:1'")
		expect(p.parse("Wafalme II 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Wafalme II 1:1'")
		expect(p.parse("2 Wafalme 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Wafalme 1:1'")
		expect(p.parse("Pili Fal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Pili Fal 1:1'")
		expect(p.parse("II. Fal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Fal 1:1'")
		expect(p.parse("2. Fal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Fal 1:1'")
		expect(p.parse("II Fal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Fal 1:1'")
		expect(p.parse("2 Fal 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Fal 1:1'")
		expect(p.parse("2Kgs 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA PILI CHA WAFALME 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'KITABU CHA PILI CHA WAFALME 1:1'")
		expect(p.parse("PILI WAFALME 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'PILI WAFALME 1:1'")
		expect(p.parse("II. WAFALME 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. WAFALME 1:1'")
		expect(p.parse("2. WAFALME 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. WAFALME 1:1'")
		expect(p.parse("II WAFALME 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II WAFALME 1:1'")
		expect(p.parse("WAFALME II 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'WAFALME II 1:1'")
		expect(p.parse("2 WAFALME 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 WAFALME 1:1'")
		expect(p.parse("PILI FAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'PILI FAL 1:1'")
		expect(p.parse("II. FAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. FAL 1:1'")
		expect(p.parse("2. FAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. FAL 1:1'")
		expect(p.parse("II FAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II FAL 1:1'")
		expect(p.parse("2 FAL 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 FAL 1:1'")
		expect(p.parse("2KGS 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2KGS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Kgs (sw)", function() {
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
    return it("should handle book: 1Kgs (sw)", function() {
      
		expect(p.parse("Kitabu cha Kwanza cha Wafalme 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Kitabu cha Kwanza cha Wafalme 1:1'")
		expect(p.parse("Kwanza Wafalme 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Kwanza Wafalme 1:1'")
		expect(p.parse("1. Wafalme 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Wafalme 1:1'")
		expect(p.parse("I. Wafalme 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Wafalme 1:1'")
		expect(p.parse("Kwanza Fal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Kwanza Fal 1:1'")
		expect(p.parse("1 Wafalme 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Wafalme 1:1'")
		expect(p.parse("I Wafalme 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Wafalme 1:1'")
		expect(p.parse("Wafalme I 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Wafalme I 1:1'")
		expect(p.parse("1. Fal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Fal 1:1'")
		expect(p.parse("I. Fal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Fal 1:1'")
		expect(p.parse("1 Fal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Fal 1:1'")
		expect(p.parse("I Fal 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Fal 1:1'")
		expect(p.parse("1Kgs 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA KWANZA CHA WAFALME 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'KITABU CHA KWANZA CHA WAFALME 1:1'")
		expect(p.parse("KWANZA WAFALME 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'KWANZA WAFALME 1:1'")
		expect(p.parse("1. WAFALME 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. WAFALME 1:1'")
		expect(p.parse("I. WAFALME 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. WAFALME 1:1'")
		expect(p.parse("KWANZA FAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'KWANZA FAL 1:1'")
		expect(p.parse("1 WAFALME 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 WAFALME 1:1'")
		expect(p.parse("I WAFALME 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I WAFALME 1:1'")
		expect(p.parse("WAFALME I 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'WAFALME I 1:1'")
		expect(p.parse("1. FAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. FAL 1:1'")
		expect(p.parse("I. FAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. FAL 1:1'")
		expect(p.parse("1 FAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 FAL 1:1'")
		expect(p.parse("I FAL 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I FAL 1:1'")
		expect(p.parse("1KGS 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1KGS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Chr (sw)", function() {
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
    return it("should handle book: 2Chr (sw)", function() {
      
		expect(p.parse("Pili Mambo ya Nyakati 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Pili Mambo ya Nyakati 1:1'")
		expect(p.parse("II. Mambo ya Nyakati 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Mambo ya Nyakati 1:1'")
		expect(p.parse("2. Mambo ya Nyakati 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Mambo ya Nyakati 1:1'")
		expect(p.parse("II Mambo ya Nyakati 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Mambo ya Nyakati 1:1'")
		expect(p.parse("Mambo ya Nyakati II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Mambo ya Nyakati II 1:1'")
		expect(p.parse("2 Mambo ya Nyakati 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Mambo ya Nyakati 1:1'")
		expect(p.parse("Pili Nya 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Pili Nya 1:1'")
		expect(p.parse("II. Nya 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Nya 1:1'")
		expect(p.parse("2. Nya 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Nya 1:1'")
		expect(p.parse("II Nya 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Nya 1:1'")
		expect(p.parse("2 Nya 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Nya 1:1'")
		expect(p.parse("2Chr 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("PILI MAMBO YA NYAKATI 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'PILI MAMBO YA NYAKATI 1:1'")
		expect(p.parse("II. MAMBO YA NYAKATI 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. MAMBO YA NYAKATI 1:1'")
		expect(p.parse("2. MAMBO YA NYAKATI 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. MAMBO YA NYAKATI 1:1'")
		expect(p.parse("II MAMBO YA NYAKATI 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II MAMBO YA NYAKATI 1:1'")
		expect(p.parse("MAMBO YA NYAKATI II 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'MAMBO YA NYAKATI II 1:1'")
		expect(p.parse("2 MAMBO YA NYAKATI 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 MAMBO YA NYAKATI 1:1'")
		expect(p.parse("PILI NYA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'PILI NYA 1:1'")
		expect(p.parse("II. NYA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. NYA 1:1'")
		expect(p.parse("2. NYA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. NYA 1:1'")
		expect(p.parse("II NYA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II NYA 1:1'")
		expect(p.parse("2 NYA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 NYA 1:1'")
		expect(p.parse("2CHR 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Chr (sw)", function() {
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
    return it("should handle book: 1Chr (sw)", function() {
      
		expect(p.parse("Kwanza Mambo ya Nyakati 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Kwanza Mambo ya Nyakati 1:1'")
		expect(p.parse("1. Mambo ya Nyakati 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Mambo ya Nyakati 1:1'")
		expect(p.parse("I. Mambo ya Nyakati 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Mambo ya Nyakati 1:1'")
		expect(p.parse("1 Mambo ya Nyakati 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Mambo ya Nyakati 1:1'")
		expect(p.parse("I Mambo ya Nyakati 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Mambo ya Nyakati 1:1'")
		expect(p.parse("Mambo ya Nyakati I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Mambo ya Nyakati I 1:1'")
		expect(p.parse("Kwanza Nya 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Kwanza Nya 1:1'")
		expect(p.parse("1. Nya 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Nya 1:1'")
		expect(p.parse("I. Nya 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Nya 1:1'")
		expect(p.parse("1 Nya 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Nya 1:1'")
		expect(p.parse("I Nya 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Nya 1:1'")
		expect(p.parse("1Chr 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KWANZA MAMBO YA NYAKATI 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'KWANZA MAMBO YA NYAKATI 1:1'")
		expect(p.parse("1. MAMBO YA NYAKATI 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. MAMBO YA NYAKATI 1:1'")
		expect(p.parse("I. MAMBO YA NYAKATI 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. MAMBO YA NYAKATI 1:1'")
		expect(p.parse("1 MAMBO YA NYAKATI 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 MAMBO YA NYAKATI 1:1'")
		expect(p.parse("I MAMBO YA NYAKATI 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I MAMBO YA NYAKATI 1:1'")
		expect(p.parse("MAMBO YA NYAKATI I 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'MAMBO YA NYAKATI I 1:1'")
		expect(p.parse("KWANZA NYA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'KWANZA NYA 1:1'")
		expect(p.parse("1. NYA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. NYA 1:1'")
		expect(p.parse("I. NYA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. NYA 1:1'")
		expect(p.parse("1 NYA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 NYA 1:1'")
		expect(p.parse("I NYA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I NYA 1:1'")
		expect(p.parse("1CHR 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezra (sw)", function() {
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
    return it("should handle book: Ezra (sw)", function() {
      
		expect(p.parse("Ezra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezra 1:1'")
		expect(p.parse("Ezr 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZRA 1:1'")
		expect(p.parse("EZR 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Neh (sw)", function() {
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
    return it("should handle book: Neh (sw)", function() {
      
		expect(p.parse("Nehemia 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemia 1:1'")
		expect(p.parse("Neh 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Neh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NEHEMIA 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMIA 1:1'")
		expect(p.parse("NEH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book GkEsth (sw)", function() {
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
    return it("should handle book: GkEsth (sw)", function() {
      
		expect(p.parse("GkEsth 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'GkEsth 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Esth (sw)", function() {
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
    return it("should handle book: Esth (sw)", function() {
      
		expect(p.parse("Esther 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esther 1:1'")
		expect(p.parse("Ester 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Ester 1:1'")
		expect(p.parse("Esta 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esta 1:1'")
		expect(p.parse("Esth 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esth 1:1'")
		expect(p.parse("Est 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Est 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ESTHER 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTHER 1:1'")
		expect(p.parse("ESTER 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTER 1:1'")
		expect(p.parse("ESTA 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTA 1:1'")
		expect(p.parse("ESTH 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTH 1:1'")
		expect(p.parse("EST 1:1").osis()).toEqual("Esth.1.1", "parsing: 'EST 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Job (sw)", function() {
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
    return it("should handle book: Job (sw)", function() {
      
		expect(p.parse("Kitabu cha Ayubu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Kitabu cha Ayubu 1:1'")
		expect(p.parse("Kitabu cha Yobu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Kitabu cha Yobu 1:1'")
		expect(p.parse("Ayubu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Ayubu 1:1'")
		expect(p.parse("Yobu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Yobu 1:1'")
		expect(p.parse("Ayu 1:1").osis()).toEqual("Job.1.1", "parsing: 'Ayu 1:1'")
		expect(p.parse("Job 1:1").osis()).toEqual("Job.1.1", "parsing: 'Job 1:1'")
		expect(p.parse("Yob 1:1").osis()).toEqual("Job.1.1", "parsing: 'Yob 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KITABU CHA AYUBU 1:1").osis()).toEqual("Job.1.1", "parsing: 'KITABU CHA AYUBU 1:1'")
		expect(p.parse("KITABU CHA YOBU 1:1").osis()).toEqual("Job.1.1", "parsing: 'KITABU CHA YOBU 1:1'")
		expect(p.parse("AYUBU 1:1").osis()).toEqual("Job.1.1", "parsing: 'AYUBU 1:1'")
		expect(p.parse("YOBU 1:1").osis()).toEqual("Job.1.1", "parsing: 'YOBU 1:1'")
		expect(p.parse("AYU 1:1").osis()).toEqual("Job.1.1", "parsing: 'AYU 1:1'")
		expect(p.parse("JOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JOB 1:1'")
		expect(p.parse("YOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'YOB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ps (sw)", function() {
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
    return it("should handle book: Ps (sw)", function() {
      
		expect(p.parse("Zaburi 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Zaburi 1:1'")
		expect(p.parse("Zab 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Zab 1:1'")
		expect(p.parse("Ps 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Ps 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZABURI 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ZABURI 1:1'")
		expect(p.parse("ZAB 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ZAB 1:1'")
		expect(p.parse("PS 1:1").osis()).toEqual("Ps.1.1", "parsing: 'PS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrAzar (sw)", function() {
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
    return it("should handle book: PrAzar (sw)", function() {
      
		expect(p.parse("PrAzar 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'PrAzar 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Prov (sw)", function() {
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
    return it("should handle book: Prov (sw)", function() {
      
		expect(p.parse("Methali 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Methali 1:1'")
		expect(p.parse("Mithali 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Mithali 1:1'")
		expect(p.parse("Meth 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Meth 1:1'")
		expect(p.parse("Mith 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Mith 1:1'")
		expect(p.parse("Prov 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Prov 1:1'")
		expect(p.parse("Mit 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Mit 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("METHALI 1:1").osis()).toEqual("Prov.1.1", "parsing: 'METHALI 1:1'")
		expect(p.parse("MITHALI 1:1").osis()).toEqual("Prov.1.1", "parsing: 'MITHALI 1:1'")
		expect(p.parse("METH 1:1").osis()).toEqual("Prov.1.1", "parsing: 'METH 1:1'")
		expect(p.parse("MITH 1:1").osis()).toEqual("Prov.1.1", "parsing: 'MITH 1:1'")
		expect(p.parse("PROV 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PROV 1:1'")
		expect(p.parse("MIT 1:1").osis()).toEqual("Prov.1.1", "parsing: 'MIT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eccl (sw)", function() {
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
    return it("should handle book: Eccl (sw)", function() {
      
		expect(p.parse("Mhubiri 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Mhubiri 1:1'")
		expect(p.parse("Eccl 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eccl 1:1'")
		expect(p.parse("Mhu 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Mhu 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MHUBIRI 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'MHUBIRI 1:1'")
		expect(p.parse("ECCL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCL 1:1'")
		expect(p.parse("MHU 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'MHU 1:1'")
		;
      return true;
    });
  });

  describe("Localized book SgThree (sw)", function() {
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
    return it("should handle book: SgThree (sw)", function() {
      
		expect(p.parse("Wimbo wa Vijana Watatu 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Wimbo wa Vijana Watatu 1:1'")
		expect(p.parse("SgThree 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'SgThree 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Song (sw)", function() {
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
    return it("should handle book: Song (sw)", function() {
      
		expect(p.parse("Wimbo Ulio Bora 1:1").osis()).toEqual("Song.1.1", "parsing: 'Wimbo Ulio Bora 1:1'")
		expect(p.parse("Wimbo Bora 1:1").osis()).toEqual("Song.1.1", "parsing: 'Wimbo Bora 1:1'")
		expect(p.parse("Song 1:1").osis()).toEqual("Song.1.1", "parsing: 'Song 1:1'")
		expect(p.parse("Wim 1:1").osis()).toEqual("Song.1.1", "parsing: 'Wim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WIMBO ULIO BORA 1:1").osis()).toEqual("Song.1.1", "parsing: 'WIMBO ULIO BORA 1:1'")
		expect(p.parse("WIMBO BORA 1:1").osis()).toEqual("Song.1.1", "parsing: 'WIMBO BORA 1:1'")
		expect(p.parse("SONG 1:1").osis()).toEqual("Song.1.1", "parsing: 'SONG 1:1'")
		expect(p.parse("WIM 1:1").osis()).toEqual("Song.1.1", "parsing: 'WIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jer (sw)", function() {
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
    return it("should handle book: Jer (sw)", function() {
      
		expect(p.parse("Yeremia 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Yeremia 1:1'")
		expect(p.parse("Jer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jer 1:1'")
		expect(p.parse("Yer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Yer 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YEREMIA 1:1").osis()).toEqual("Jer.1.1", "parsing: 'YEREMIA 1:1'")
		expect(p.parse("JER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JER 1:1'")
		expect(p.parse("YER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'YER 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezek (sw)", function() {
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
    return it("should handle book: Ezek (sw)", function() {
      
		expect(p.parse("Ezekieli 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezekieli 1:1'")
		expect(p.parse("Ezek 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezek 1:1'")
		expect(p.parse("Eze 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Eze 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZEKIELI 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEKIELI 1:1'")
		expect(p.parse("EZEK 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEK 1:1'")
		expect(p.parse("EZE 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZE 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Dan (sw)", function() {
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
    return it("should handle book: Dan (sw)", function() {
      
		expect(p.parse("Danieli 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Danieli 1:1'")
		expect(p.parse("Dan 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dan 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("DANIELI 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DANIELI 1:1'")
		expect(p.parse("DAN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DAN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hos (sw)", function() {
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
    return it("should handle book: Hos (sw)", function() {
      
		expect(p.parse("Hosea 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hosea 1:1'")
		expect(p.parse("Hos 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hos 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HOSEA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEA 1:1'")
		expect(p.parse("HOS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Joel (sw)", function() {
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
    return it("should handle book: Joel (sw)", function() {
      
		expect(p.parse("Yoeli 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yoeli 1:1'")
		expect(p.parse("Joel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joel 1:1'")
		expect(p.parse("Yoe 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yoe 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YOELI 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YOELI 1:1'")
		expect(p.parse("JOEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOEL 1:1'")
		expect(p.parse("YOE 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YOE 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Amos (sw)", function() {
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
    return it("should handle book: Amos (sw)", function() {
      
		expect(p.parse("Amosi 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amosi 1:1'")
		expect(p.parse("Amos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amos 1:1'")
		expect(p.parse("Amo 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amo 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("AMOSI 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOSI 1:1'")
		expect(p.parse("AMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOS 1:1'")
		expect(p.parse("AMO 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMO 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Obad (sw)", function() {
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
    return it("should handle book: Obad (sw)", function() {
      
		expect(p.parse("Obadia 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obadia 1:1'")
		expect(p.parse("Obad 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obad 1:1'")
		expect(p.parse("Oba 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Oba 1:1'")
		expect(p.parse("Ob 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Ob 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("OBADIA 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBADIA 1:1'")
		expect(p.parse("OBAD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBAD 1:1'")
		expect(p.parse("OBA 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBA 1:1'")
		expect(p.parse("OB 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jonah (sw)", function() {
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
    return it("should handle book: Jonah (sw)", function() {
      
		expect(p.parse("Jonah 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonah 1:1'")
		expect(p.parse("Yona 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yona 1:1'")
		expect(p.parse("Yon 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Yon 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JONAH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAH 1:1'")
		expect(p.parse("YONA 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YONA 1:1'")
		expect(p.parse("YON 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'YON 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mic (sw)", function() {
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
    return it("should handle book: Mic (sw)", function() {
      
		expect(p.parse("Mika 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mika 1:1'")
		expect(p.parse("Mic 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mic 1:1'")
		expect(p.parse("Mik 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mik 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MIKA 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKA 1:1'")
		expect(p.parse("MIC 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIC 1:1'")
		expect(p.parse("MIK 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Nah (sw)", function() {
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
    return it("should handle book: Nah (sw)", function() {
      
		expect(p.parse("Nahumu 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nahumu 1:1'")
		expect(p.parse("Nahum 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nahum 1:1'")
		expect(p.parse("Nah 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nah 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NAHUMU 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAHUMU 1:1'")
		expect(p.parse("NAHUM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAHUM 1:1'")
		expect(p.parse("NAH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hab (sw)", function() {
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
    return it("should handle book: Hab (sw)", function() {
      
		expect(p.parse("Habakuki 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Habakuki 1:1'")
		expect(p.parse("Hab 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Hab 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HABAKUKI 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HABAKUKI 1:1'")
		expect(p.parse("HAB 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HAB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zeph (sw)", function() {
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
    return it("should handle book: Zeph (sw)", function() {
      
		expect(p.parse("Sefania 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sefania 1:1'")
		expect(p.parse("Zeph 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zeph 1:1'")
		expect(p.parse("Sef 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sef 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SEFANIA 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SEFANIA 1:1'")
		expect(p.parse("ZEPH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPH 1:1'")
		expect(p.parse("SEF 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SEF 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hag (sw)", function() {
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
    return it("should handle book: Hag (sw)", function() {
      
		expect(p.parse("Hagai 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hagai 1:1'")
		expect(p.parse("Hag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hag 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HAGAI 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGAI 1:1'")
		expect(p.parse("HAG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAG 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zech (sw)", function() {
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
    return it("should handle book: Zech (sw)", function() {
      
		expect(p.parse("Zekaria 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zekaria 1:1'")
		expect(p.parse("Zech 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zech 1:1'")
		expect(p.parse("Zek 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zek 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZEKARIA 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZEKARIA 1:1'")
		expect(p.parse("ZECH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECH 1:1'")
		expect(p.parse("ZEK 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZEK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mal (sw)", function() {
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
    return it("should handle book: Mal (sw)", function() {
      
		expect(p.parse("Malaki 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malaki 1:1'")
		expect(p.parse("Mal 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Mal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MALAKI 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALAKI 1:1'")
		expect(p.parse("MAL 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MAL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Matt (sw)", function() {
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
    return it("should handle book: Matt (sw)", function() {
      
		expect(p.parse("Injili ya Mathayo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Injili ya Mathayo 1:1'")
		expect(p.parse("Mathayo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mathayo 1:1'")
		expect(p.parse("Matayo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matayo 1:1'")
		expect(p.parse("Math 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Math 1:1'")
		expect(p.parse("Matt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matt 1:1'")
		expect(p.parse("Mat 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mat 1:1'")
		expect(p.parse("Mt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("INJILI YA MATHAYO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'INJILI YA MATHAYO 1:1'")
		expect(p.parse("MATHAYO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATHAYO 1:1'")
		expect(p.parse("MATAYO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATAYO 1:1'")
		expect(p.parse("MATH 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATH 1:1'")
		expect(p.parse("MATT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATT 1:1'")
		expect(p.parse("MAT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MAT 1:1'")
		expect(p.parse("MT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mark (sw)", function() {
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
    return it("should handle book: Mark (sw)", function() {
      
		expect(p.parse("Injili ya Marko 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Injili ya Marko 1:1'")
		expect(p.parse("Marko 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Marko 1:1'")
		expect(p.parse("Mark 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mark 1:1'")
		expect(p.parse("Mk 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mk 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("INJILI YA MARKO 1:1").osis()).toEqual("Mark.1.1", "parsing: 'INJILI YA MARKO 1:1'")
		expect(p.parse("MARKO 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARKO 1:1'")
		expect(p.parse("MARK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARK 1:1'")
		expect(p.parse("MK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Luke (sw)", function() {
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
    return it("should handle book: Luke (sw)", function() {
      
		expect(p.parse("Injili ya Luka 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Injili ya Luka 1:1'")
		expect(p.parse("Luka 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luka 1:1'")
		expect(p.parse("Luke 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luke 1:1'")
		expect(p.parse("Lk 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lk 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("INJILI YA LUKA 1:1").osis()).toEqual("Luke.1.1", "parsing: 'INJILI YA LUKA 1:1'")
		expect(p.parse("LUKA 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKA 1:1'")
		expect(p.parse("LUKE 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKE 1:1'")
		expect(p.parse("LK 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1John (sw)", function() {
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
    return it("should handle book: 1John (sw)", function() {
      
		expect(p.parse("Waraka wa Kwanza wa Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: 'Waraka wa Kwanza wa Yohane 1:1'")
		expect(p.parse("Barua ya Kwanza ya Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: 'Barua ya Kwanza ya Yohane 1:1'")
		expect(p.parse("Kwanza Yohana 1:1").osis()).toEqual("1John.1.1", "parsing: 'Kwanza Yohana 1:1'")
		expect(p.parse("Kwanza Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: 'Kwanza Yohane 1:1'")
		expect(p.parse("Kwanza Yoh 1:1").osis()).toEqual("1John.1.1", "parsing: 'Kwanza Yoh 1:1'")
		expect(p.parse("1. Yohana 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Yohana 1:1'")
		expect(p.parse("1. Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Yohane 1:1'")
		expect(p.parse("I. Yohana 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Yohana 1:1'")
		expect(p.parse("I. Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Yohane 1:1'")
		expect(p.parse("1 Yohana 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yohana 1:1'")
		expect(p.parse("1 Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yohane 1:1'")
		expect(p.parse("I Yohana 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Yohana 1:1'")
		expect(p.parse("I Yohane 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Yohane 1:1'")
		expect(p.parse("Yohane I 1:1").osis()).toEqual("1John.1.1", "parsing: 'Yohane I 1:1'")
		expect(p.parse("1. Yoh 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Yoh 1:1'")
		expect(p.parse("I. Yoh 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Yoh 1:1'")
		expect(p.parse("1 Yoh 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Yoh 1:1'")
		expect(p.parse("1John 1:1").osis()).toEqual("1John.1.1", "parsing: '1John 1:1'")
		expect(p.parse("I Yoh 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Yoh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA KWANZA WA YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: 'WARAKA WA KWANZA WA YOHANE 1:1'")
		expect(p.parse("BARUA YA KWANZA YA YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: 'BARUA YA KWANZA YA YOHANE 1:1'")
		expect(p.parse("KWANZA YOHANA 1:1").osis()).toEqual("1John.1.1", "parsing: 'KWANZA YOHANA 1:1'")
		expect(p.parse("KWANZA YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: 'KWANZA YOHANE 1:1'")
		expect(p.parse("KWANZA YOH 1:1").osis()).toEqual("1John.1.1", "parsing: 'KWANZA YOH 1:1'")
		expect(p.parse("1. YOHANA 1:1").osis()).toEqual("1John.1.1", "parsing: '1. YOHANA 1:1'")
		expect(p.parse("1. YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: '1. YOHANE 1:1'")
		expect(p.parse("I. YOHANA 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. YOHANA 1:1'")
		expect(p.parse("I. YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. YOHANE 1:1'")
		expect(p.parse("1 YOHANA 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YOHANA 1:1'")
		expect(p.parse("1 YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YOHANE 1:1'")
		expect(p.parse("I YOHANA 1:1").osis()).toEqual("1John.1.1", "parsing: 'I YOHANA 1:1'")
		expect(p.parse("I YOHANE 1:1").osis()).toEqual("1John.1.1", "parsing: 'I YOHANE 1:1'")
		expect(p.parse("YOHANE I 1:1").osis()).toEqual("1John.1.1", "parsing: 'YOHANE I 1:1'")
		expect(p.parse("1. YOH 1:1").osis()).toEqual("1John.1.1", "parsing: '1. YOH 1:1'")
		expect(p.parse("I. YOH 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. YOH 1:1'")
		expect(p.parse("1 YOH 1:1").osis()).toEqual("1John.1.1", "parsing: '1 YOH 1:1'")
		expect(p.parse("1JOHN 1:1").osis()).toEqual("1John.1.1", "parsing: '1JOHN 1:1'")
		expect(p.parse("I YOH 1:1").osis()).toEqual("1John.1.1", "parsing: 'I YOH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2John (sw)", function() {
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
    return it("should handle book: 2John (sw)", function() {
      
		expect(p.parse("Waraka wa Pili wa Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: 'Waraka wa Pili wa Yohane 1:1'")
		expect(p.parse("Barua ya Pili ya Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: 'Barua ya Pili ya Yohane 1:1'")
		expect(p.parse("Pili Yohana 1:1").osis()).toEqual("2John.1.1", "parsing: 'Pili Yohana 1:1'")
		expect(p.parse("Pili Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: 'Pili Yohane 1:1'")
		expect(p.parse("II. Yohana 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Yohana 1:1'")
		expect(p.parse("II. Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Yohane 1:1'")
		expect(p.parse("2. Yohana 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Yohana 1:1'")
		expect(p.parse("2. Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Yohane 1:1'")
		expect(p.parse("II Yohana 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Yohana 1:1'")
		expect(p.parse("II Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Yohane 1:1'")
		expect(p.parse("Yohane II 1:1").osis()).toEqual("2John.1.1", "parsing: 'Yohane II 1:1'")
		expect(p.parse("2 Yohana 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yohana 1:1'")
		expect(p.parse("2 Yohane 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yohane 1:1'")
		expect(p.parse("Pili Yoh 1:1").osis()).toEqual("2John.1.1", "parsing: 'Pili Yoh 1:1'")
		expect(p.parse("II. Yoh 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Yoh 1:1'")
		expect(p.parse("2. Yoh 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Yoh 1:1'")
		expect(p.parse("II Yoh 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Yoh 1:1'")
		expect(p.parse("2 Yoh 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Yoh 1:1'")
		expect(p.parse("2John 1:1").osis()).toEqual("2John.1.1", "parsing: '2John 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA PILI WA YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: 'WARAKA WA PILI WA YOHANE 1:1'")
		expect(p.parse("BARUA YA PILI YA YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: 'BARUA YA PILI YA YOHANE 1:1'")
		expect(p.parse("PILI YOHANA 1:1").osis()).toEqual("2John.1.1", "parsing: 'PILI YOHANA 1:1'")
		expect(p.parse("PILI YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: 'PILI YOHANE 1:1'")
		expect(p.parse("II. YOHANA 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. YOHANA 1:1'")
		expect(p.parse("II. YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. YOHANE 1:1'")
		expect(p.parse("2. YOHANA 1:1").osis()).toEqual("2John.1.1", "parsing: '2. YOHANA 1:1'")
		expect(p.parse("2. YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: '2. YOHANE 1:1'")
		expect(p.parse("II YOHANA 1:1").osis()).toEqual("2John.1.1", "parsing: 'II YOHANA 1:1'")
		expect(p.parse("II YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: 'II YOHANE 1:1'")
		expect(p.parse("YOHANE II 1:1").osis()).toEqual("2John.1.1", "parsing: 'YOHANE II 1:1'")
		expect(p.parse("2 YOHANA 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YOHANA 1:1'")
		expect(p.parse("2 YOHANE 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YOHANE 1:1'")
		expect(p.parse("PILI YOH 1:1").osis()).toEqual("2John.1.1", "parsing: 'PILI YOH 1:1'")
		expect(p.parse("II. YOH 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. YOH 1:1'")
		expect(p.parse("2. YOH 1:1").osis()).toEqual("2John.1.1", "parsing: '2. YOH 1:1'")
		expect(p.parse("II YOH 1:1").osis()).toEqual("2John.1.1", "parsing: 'II YOH 1:1'")
		expect(p.parse("2 YOH 1:1").osis()).toEqual("2John.1.1", "parsing: '2 YOH 1:1'")
		expect(p.parse("2JOHN 1:1").osis()).toEqual("2John.1.1", "parsing: '2JOHN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3John (sw)", function() {
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
    return it("should handle book: 3John (sw)", function() {
      
		expect(p.parse("Waraka wa Tatu wa Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: 'Waraka wa Tatu wa Yohane 1:1'")
		expect(p.parse("Barua ya Tatu ya Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: 'Barua ya Tatu ya Yohane 1:1'")
		expect(p.parse("III. Yohana 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Yohana 1:1'")
		expect(p.parse("III. Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Yohane 1:1'")
		expect(p.parse("Tatu Yohana 1:1").osis()).toEqual("3John.1.1", "parsing: 'Tatu Yohana 1:1'")
		expect(p.parse("Tatu Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: 'Tatu Yohane 1:1'")
		expect(p.parse("III Yohana 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Yohana 1:1'")
		expect(p.parse("III Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Yohane 1:1'")
		expect(p.parse("Yohane III 1:1").osis()).toEqual("3John.1.1", "parsing: 'Yohane III 1:1'")
		expect(p.parse("3. Yohana 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Yohana 1:1'")
		expect(p.parse("3. Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Yohane 1:1'")
		expect(p.parse("3 Yohana 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yohana 1:1'")
		expect(p.parse("3 Yohane 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yohane 1:1'")
		expect(p.parse("III. Yoh 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Yoh 1:1'")
		expect(p.parse("Tatu Yoh 1:1").osis()).toEqual("3John.1.1", "parsing: 'Tatu Yoh 1:1'")
		expect(p.parse("III Yoh 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Yoh 1:1'")
		expect(p.parse("3. Yoh 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Yoh 1:1'")
		expect(p.parse("3 Yoh 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Yoh 1:1'")
		expect(p.parse("3John 1:1").osis()).toEqual("3John.1.1", "parsing: '3John 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA TATU WA YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: 'WARAKA WA TATU WA YOHANE 1:1'")
		expect(p.parse("BARUA YA TATU YA YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: 'BARUA YA TATU YA YOHANE 1:1'")
		expect(p.parse("III. YOHANA 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. YOHANA 1:1'")
		expect(p.parse("III. YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. YOHANE 1:1'")
		expect(p.parse("TATU YOHANA 1:1").osis()).toEqual("3John.1.1", "parsing: 'TATU YOHANA 1:1'")
		expect(p.parse("TATU YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: 'TATU YOHANE 1:1'")
		expect(p.parse("III YOHANA 1:1").osis()).toEqual("3John.1.1", "parsing: 'III YOHANA 1:1'")
		expect(p.parse("III YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: 'III YOHANE 1:1'")
		expect(p.parse("YOHANE III 1:1").osis()).toEqual("3John.1.1", "parsing: 'YOHANE III 1:1'")
		expect(p.parse("3. YOHANA 1:1").osis()).toEqual("3John.1.1", "parsing: '3. YOHANA 1:1'")
		expect(p.parse("3. YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: '3. YOHANE 1:1'")
		expect(p.parse("3 YOHANA 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YOHANA 1:1'")
		expect(p.parse("3 YOHANE 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YOHANE 1:1'")
		expect(p.parse("III. YOH 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. YOH 1:1'")
		expect(p.parse("TATU YOH 1:1").osis()).toEqual("3John.1.1", "parsing: 'TATU YOH 1:1'")
		expect(p.parse("III YOH 1:1").osis()).toEqual("3John.1.1", "parsing: 'III YOH 1:1'")
		expect(p.parse("3. YOH 1:1").osis()).toEqual("3John.1.1", "parsing: '3. YOH 1:1'")
		expect(p.parse("3 YOH 1:1").osis()).toEqual("3John.1.1", "parsing: '3 YOH 1:1'")
		expect(p.parse("3JOHN 1:1").osis()).toEqual("3John.1.1", "parsing: '3JOHN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book John (sw)", function() {
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
    return it("should handle book: John (sw)", function() {
      
		expect(p.parse("Injili ya Yohana 1:1").osis()).toEqual("John.1.1", "parsing: 'Injili ya Yohana 1:1'")
		expect(p.parse("Injili ya Yohane 1:1").osis()).toEqual("John.1.1", "parsing: 'Injili ya Yohane 1:1'")
		expect(p.parse("Yohana 1:1").osis()).toEqual("John.1.1", "parsing: 'Yohana 1:1'")
		expect(p.parse("Yohane 1:1").osis()).toEqual("John.1.1", "parsing: 'Yohane 1:1'")
		expect(p.parse("John 1:1").osis()).toEqual("John.1.1", "parsing: 'John 1:1'")
		expect(p.parse("Yoh 1:1").osis()).toEqual("John.1.1", "parsing: 'Yoh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("INJILI YA YOHANA 1:1").osis()).toEqual("John.1.1", "parsing: 'INJILI YA YOHANA 1:1'")
		expect(p.parse("INJILI YA YOHANE 1:1").osis()).toEqual("John.1.1", "parsing: 'INJILI YA YOHANE 1:1'")
		expect(p.parse("YOHANA 1:1").osis()).toEqual("John.1.1", "parsing: 'YOHANA 1:1'")
		expect(p.parse("YOHANE 1:1").osis()).toEqual("John.1.1", "parsing: 'YOHANE 1:1'")
		expect(p.parse("JOHN 1:1").osis()).toEqual("John.1.1", "parsing: 'JOHN 1:1'")
		expect(p.parse("YOH 1:1").osis()).toEqual("John.1.1", "parsing: 'YOH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Acts (sw)", function() {
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
    return it("should handle book: Acts (sw)", function() {
      
		expect(p.parse("Matendo ya Mitume 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Matendo ya Mitume 1:1'")
		expect(p.parse("Matendo 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Matendo 1:1'")
		expect(p.parse("Acts 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Acts 1:1'")
		expect(p.parse("Mdo 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mdo 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MATENDO YA MITUME 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MATENDO YA MITUME 1:1'")
		expect(p.parse("MATENDO 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MATENDO 1:1'")
		expect(p.parse("ACTS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ACTS 1:1'")
		expect(p.parse("MDO 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MDO 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rom (sw)", function() {
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
    return it("should handle book: Rom (sw)", function() {
      
		expect(p.parse("Waraka kwa Waroma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Waraka kwa Waroma 1:1'")
		expect(p.parse("Waraka kwa Warumi 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Waraka kwa Warumi 1:1'")
		expect(p.parse("Barua kwa Waroma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Barua kwa Waroma 1:1'")
		expect(p.parse("Waroma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Waroma 1:1'")
		expect(p.parse("Warumi 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Warumi 1:1'")
		expect(p.parse("Rom 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rom 1:1'")
		expect(p.parse("Rum 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rum 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA WAROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'WARAKA KWA WAROMA 1:1'")
		expect(p.parse("WARAKA KWA WARUMI 1:1").osis()).toEqual("Rom.1.1", "parsing: 'WARAKA KWA WARUMI 1:1'")
		expect(p.parse("BARUA KWA WAROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'BARUA KWA WAROMA 1:1'")
		expect(p.parse("WAROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'WAROMA 1:1'")
		expect(p.parse("WARUMI 1:1").osis()).toEqual("Rom.1.1", "parsing: 'WARUMI 1:1'")
		expect(p.parse("ROM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROM 1:1'")
		expect(p.parse("RUM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'RUM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Cor (sw)", function() {
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
    return it("should handle book: 2Cor (sw)", function() {
      
		expect(p.parse("Waraka wa Pili kwa Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Waraka wa Pili kwa Wakorintho 1:1'")
		expect(p.parse("Barua ya Pili kwa Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Barua ya Pili kwa Wakorintho 1:1'")
		expect(p.parse("Waraka wa Pili kwa Wakorinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Waraka wa Pili kwa Wakorinto 1:1'")
		expect(p.parse("Pili Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Pili Wakorintho 1:1'")
		expect(p.parse("II. Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Wakorintho 1:1'")
		expect(p.parse("Pili Wakorinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Pili Wakorinto 1:1'")
		expect(p.parse("2. Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Wakorintho 1:1'")
		expect(p.parse("II Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Wakorintho 1:1'")
		expect(p.parse("II. Wakorinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Wakorinto 1:1'")
		expect(p.parse("Wakorintho II 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Wakorintho II 1:1'")
		expect(p.parse("2 Wakorintho 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Wakorintho 1:1'")
		expect(p.parse("2. Wakorinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Wakorinto 1:1'")
		expect(p.parse("II Wakorinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Wakorinto 1:1'")
		expect(p.parse("2 Wakorinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Wakorinto 1:1'")
		expect(p.parse("Pili Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Pili Kor 1:1'")
		expect(p.parse("II. Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Kor 1:1'")
		expect(p.parse("2. Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Kor 1:1'")
		expect(p.parse("II Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Kor 1:1'")
		expect(p.parse("2 Kor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Kor 1:1'")
		expect(p.parse("2Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA PILI KWA WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'WARAKA WA PILI KWA WAKORINTHO 1:1'")
		expect(p.parse("BARUA YA PILI KWA WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'BARUA YA PILI KWA WAKORINTHO 1:1'")
		expect(p.parse("WARAKA WA PILI KWA WAKORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'WARAKA WA PILI KWA WAKORINTO 1:1'")
		expect(p.parse("PILI WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'PILI WAKORINTHO 1:1'")
		expect(p.parse("II. WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. WAKORINTHO 1:1'")
		expect(p.parse("PILI WAKORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'PILI WAKORINTO 1:1'")
		expect(p.parse("2. WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. WAKORINTHO 1:1'")
		expect(p.parse("II WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II WAKORINTHO 1:1'")
		expect(p.parse("II. WAKORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. WAKORINTO 1:1'")
		expect(p.parse("WAKORINTHO II 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'WAKORINTHO II 1:1'")
		expect(p.parse("2 WAKORINTHO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 WAKORINTHO 1:1'")
		expect(p.parse("2. WAKORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. WAKORINTO 1:1'")
		expect(p.parse("II WAKORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II WAKORINTO 1:1'")
		expect(p.parse("2 WAKORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 WAKORINTO 1:1'")
		expect(p.parse("PILI KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'PILI KOR 1:1'")
		expect(p.parse("II. KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KOR 1:1'")
		expect(p.parse("2. KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KOR 1:1'")
		expect(p.parse("II KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KOR 1:1'")
		expect(p.parse("2 KOR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KOR 1:1'")
		expect(p.parse("2COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Cor (sw)", function() {
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
    return it("should handle book: 1Cor (sw)", function() {
      
		expect(p.parse("Waraka wa Kwanza kwa Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Waraka wa Kwanza kwa Wakorintho 1:1'")
		expect(p.parse("Barua ya Kwanza kwa Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Barua ya Kwanza kwa Wakorintho 1:1'")
		expect(p.parse("Waraka wa Kwanza kwa Wakorinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Waraka wa Kwanza kwa Wakorinto 1:1'")
		expect(p.parse("Kwanza Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Kwanza Wakorintho 1:1'")
		expect(p.parse("Kwanza Wakorinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Kwanza Wakorinto 1:1'")
		expect(p.parse("1. Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Wakorintho 1:1'")
		expect(p.parse("I. Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Wakorintho 1:1'")
		expect(p.parse("1 Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Wakorintho 1:1'")
		expect(p.parse("1. Wakorinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Wakorinto 1:1'")
		expect(p.parse("I Wakorintho 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Wakorintho 1:1'")
		expect(p.parse("I. Wakorinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Wakorinto 1:1'")
		expect(p.parse("Wakorintho I 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Wakorintho I 1:1'")
		expect(p.parse("1 Wakorinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Wakorinto 1:1'")
		expect(p.parse("I Wakorinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Wakorinto 1:1'")
		expect(p.parse("Kwanza Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Kwanza Kor 1:1'")
		expect(p.parse("1. Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Kor 1:1'")
		expect(p.parse("I. Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Kor 1:1'")
		expect(p.parse("1 Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Kor 1:1'")
		expect(p.parse("I Kor 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Kor 1:1'")
		expect(p.parse("1Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA KWANZA KWA WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'WARAKA WA KWANZA KWA WAKORINTHO 1:1'")
		expect(p.parse("BARUA YA KWANZA KWA WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'BARUA YA KWANZA KWA WAKORINTHO 1:1'")
		expect(p.parse("WARAKA WA KWANZA KWA WAKORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'WARAKA WA KWANZA KWA WAKORINTO 1:1'")
		expect(p.parse("KWANZA WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KWANZA WAKORINTHO 1:1'")
		expect(p.parse("KWANZA WAKORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KWANZA WAKORINTO 1:1'")
		expect(p.parse("1. WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. WAKORINTHO 1:1'")
		expect(p.parse("I. WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. WAKORINTHO 1:1'")
		expect(p.parse("1 WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 WAKORINTHO 1:1'")
		expect(p.parse("1. WAKORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. WAKORINTO 1:1'")
		expect(p.parse("I WAKORINTHO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I WAKORINTHO 1:1'")
		expect(p.parse("I. WAKORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. WAKORINTO 1:1'")
		expect(p.parse("WAKORINTHO I 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'WAKORINTHO I 1:1'")
		expect(p.parse("1 WAKORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 WAKORINTO 1:1'")
		expect(p.parse("I WAKORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I WAKORINTO 1:1'")
		expect(p.parse("KWANZA KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'KWANZA KOR 1:1'")
		expect(p.parse("1. KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KOR 1:1'")
		expect(p.parse("I. KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KOR 1:1'")
		expect(p.parse("1 KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KOR 1:1'")
		expect(p.parse("I KOR 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KOR 1:1'")
		expect(p.parse("1COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Gal (sw)", function() {
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
    return it("should handle book: Gal (sw)", function() {
      
		expect(p.parse("Barua kwa Wagalatia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Barua kwa Wagalatia 1:1'")
		expect(p.parse("Wagalatia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Wagalatia 1:1'")
		expect(p.parse("Gal 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Gal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("BARUA KWA WAGALATIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'BARUA KWA WAGALATIA 1:1'")
		expect(p.parse("WAGALATIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'WAGALATIA 1:1'")
		expect(p.parse("GAL 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GAL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eph (sw)", function() {
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
    return it("should handle book: Eph (sw)", function() {
      
		expect(p.parse("Waraka kwa Waefeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Waraka kwa Waefeso 1:1'")
		expect(p.parse("Barua kwa Waefeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Barua kwa Waefeso 1:1'")
		expect(p.parse("Waefeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Waefeso 1:1'")
		expect(p.parse("Efe 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Efe 1:1'")
		expect(p.parse("Eph 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Eph 1:1'")
		expect(p.parse("Ef 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Ef 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA WAEFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'WARAKA KWA WAEFESO 1:1'")
		expect(p.parse("BARUA KWA WAEFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'BARUA KWA WAEFESO 1:1'")
		expect(p.parse("WAEFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'WAEFESO 1:1'")
		expect(p.parse("EFE 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EFE 1:1'")
		expect(p.parse("EPH 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPH 1:1'")
		expect(p.parse("EF 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EF 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phil (sw)", function() {
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
    return it("should handle book: Phil (sw)", function() {
      
		expect(p.parse("Waraka kwa Wafilipi 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Waraka kwa Wafilipi 1:1'")
		expect(p.parse("Barua kwa Wafilipi 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Barua kwa Wafilipi 1:1'")
		expect(p.parse("Wafilipi 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Wafilipi 1:1'")
		expect(p.parse("Phil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Phil 1:1'")
		expect(p.parse("Fil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Fil 1:1'")
		expect(p.parse("Flp 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Flp 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA WAFILIPI 1:1").osis()).toEqual("Phil.1.1", "parsing: 'WARAKA KWA WAFILIPI 1:1'")
		expect(p.parse("BARUA KWA WAFILIPI 1:1").osis()).toEqual("Phil.1.1", "parsing: 'BARUA KWA WAFILIPI 1:1'")
		expect(p.parse("WAFILIPI 1:1").osis()).toEqual("Phil.1.1", "parsing: 'WAFILIPI 1:1'")
		expect(p.parse("PHIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHIL 1:1'")
		expect(p.parse("FIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FIL 1:1'")
		expect(p.parse("FLP 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FLP 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Col (sw)", function() {
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
    return it("should handle book: Col (sw)", function() {
      
		expect(p.parse("Waraka kwa Wakolosai 1:1").osis()).toEqual("Col.1.1", "parsing: 'Waraka kwa Wakolosai 1:1'")
		expect(p.parse("Barua kwa Wakolosai 1:1").osis()).toEqual("Col.1.1", "parsing: 'Barua kwa Wakolosai 1:1'")
		expect(p.parse("Wakolosai 1:1").osis()).toEqual("Col.1.1", "parsing: 'Wakolosai 1:1'")
		expect(p.parse("Col 1:1").osis()).toEqual("Col.1.1", "parsing: 'Col 1:1'")
		expect(p.parse("Kol 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kol 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA WAKOLOSAI 1:1").osis()).toEqual("Col.1.1", "parsing: 'WARAKA KWA WAKOLOSAI 1:1'")
		expect(p.parse("BARUA KWA WAKOLOSAI 1:1").osis()).toEqual("Col.1.1", "parsing: 'BARUA KWA WAKOLOSAI 1:1'")
		expect(p.parse("WAKOLOSAI 1:1").osis()).toEqual("Col.1.1", "parsing: 'WAKOLOSAI 1:1'")
		expect(p.parse("COL 1:1").osis()).toEqual("Col.1.1", "parsing: 'COL 1:1'")
		expect(p.parse("KOL 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Thess (sw)", function() {
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
    return it("should handle book: 2Thess (sw)", function() {
      
		expect(p.parse("Waraka wa Pili kwa Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Waraka wa Pili kwa Wathesalonike 1:1'")
		expect(p.parse("Waraka wa Pili kwa Wathesaloniki 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Waraka wa Pili kwa Wathesaloniki 1:1'")
		expect(p.parse("Barua ya Pili kwa Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Barua ya Pili kwa Wathesalonike 1:1'")
		expect(p.parse("Pili Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Pili Wathesalonike 1:1'")
		expect(p.parse("II. Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Wathesalonike 1:1'")
		expect(p.parse("2. Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Wathesalonike 1:1'")
		expect(p.parse("II Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Wathesalonike 1:1'")
		expect(p.parse("Wathesalonike II 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Wathesalonike II 1:1'")
		expect(p.parse("2 Wathesalonike 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Wathesalonike 1:1'")
		expect(p.parse("Pili Thes 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Pili Thes 1:1'")
		expect(p.parse("II. Thes 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Thes 1:1'")
		expect(p.parse("Pili The 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Pili The 1:1'")
		expect(p.parse("2. Thes 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Thes 1:1'")
		expect(p.parse("II Thes 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Thes 1:1'")
		expect(p.parse("II. The 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. The 1:1'")
		expect(p.parse("Pili Th 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Pili Th 1:1'")
		expect(p.parse("2 Thes 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Thes 1:1'")
		expect(p.parse("2. The 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. The 1:1'")
		expect(p.parse("2Thess 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2Thess 1:1'")
		expect(p.parse("II The 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II The 1:1'")
		expect(p.parse("II. Th 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Th 1:1'")
		expect(p.parse("2 The 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 The 1:1'")
		expect(p.parse("2. Th 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Th 1:1'")
		expect(p.parse("II Th 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Th 1:1'")
		expect(p.parse("2 Th 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Th 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA PILI KWA WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'WARAKA WA PILI KWA WATHESALONIKE 1:1'")
		expect(p.parse("WARAKA WA PILI KWA WATHESALONIKI 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'WARAKA WA PILI KWA WATHESALONIKI 1:1'")
		expect(p.parse("BARUA YA PILI KWA WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'BARUA YA PILI KWA WATHESALONIKE 1:1'")
		expect(p.parse("PILI WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'PILI WATHESALONIKE 1:1'")
		expect(p.parse("II. WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. WATHESALONIKE 1:1'")
		expect(p.parse("2. WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. WATHESALONIKE 1:1'")
		expect(p.parse("II WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II WATHESALONIKE 1:1'")
		expect(p.parse("WATHESALONIKE II 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'WATHESALONIKE II 1:1'")
		expect(p.parse("2 WATHESALONIKE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 WATHESALONIKE 1:1'")
		expect(p.parse("PILI THES 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'PILI THES 1:1'")
		expect(p.parse("II. THES 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. THES 1:1'")
		expect(p.parse("PILI THE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'PILI THE 1:1'")
		expect(p.parse("2. THES 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. THES 1:1'")
		expect(p.parse("II THES 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II THES 1:1'")
		expect(p.parse("II. THE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. THE 1:1'")
		expect(p.parse("PILI TH 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'PILI TH 1:1'")
		expect(p.parse("2 THES 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 THES 1:1'")
		expect(p.parse("2. THE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. THE 1:1'")
		expect(p.parse("2THESS 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2THESS 1:1'")
		expect(p.parse("II THE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II THE 1:1'")
		expect(p.parse("II. TH 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TH 1:1'")
		expect(p.parse("2 THE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 THE 1:1'")
		expect(p.parse("2. TH 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TH 1:1'")
		expect(p.parse("II TH 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TH 1:1'")
		expect(p.parse("2 TH 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Thess (sw)", function() {
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
    return it("should handle book: 1Thess (sw)", function() {
      
		expect(p.parse("Waraka wa Kwanza kwa Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Waraka wa Kwanza kwa Wathesalonike 1:1'")
		expect(p.parse("Waraka wa Kwanza kwa Wathesaloniki 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Waraka wa Kwanza kwa Wathesaloniki 1:1'")
		expect(p.parse("Barua ya Kwanza kwa Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Barua ya Kwanza kwa Wathesalonike 1:1'")
		expect(p.parse("Kwanza Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Kwanza Wathesalonike 1:1'")
		expect(p.parse("1. Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Wathesalonike 1:1'")
		expect(p.parse("I. Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Wathesalonike 1:1'")
		expect(p.parse("1 Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Wathesalonike 1:1'")
		expect(p.parse("I Wathesalonike 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Wathesalonike 1:1'")
		expect(p.parse("Wathesalonike I 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Wathesalonike I 1:1'")
		expect(p.parse("Kwanza Thes 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Kwanza Thes 1:1'")
		expect(p.parse("Kwanza The 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Kwanza The 1:1'")
		expect(p.parse("Kwanza Th 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Kwanza Th 1:1'")
		expect(p.parse("1. Thes 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Thes 1:1'")
		expect(p.parse("I. Thes 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Thes 1:1'")
		expect(p.parse("1 Thes 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Thes 1:1'")
		expect(p.parse("1. The 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. The 1:1'")
		expect(p.parse("1Thess 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1Thess 1:1'")
		expect(p.parse("I Thes 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Thes 1:1'")
		expect(p.parse("I. The 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. The 1:1'")
		expect(p.parse("1 The 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 The 1:1'")
		expect(p.parse("1. Th 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Th 1:1'")
		expect(p.parse("I The 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I The 1:1'")
		expect(p.parse("I. Th 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Th 1:1'")
		expect(p.parse("1 Th 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Th 1:1'")
		expect(p.parse("I Th 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Th 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA KWANZA KWA WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'WARAKA WA KWANZA KWA WATHESALONIKE 1:1'")
		expect(p.parse("WARAKA WA KWANZA KWA WATHESALONIKI 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'WARAKA WA KWANZA KWA WATHESALONIKI 1:1'")
		expect(p.parse("BARUA YA KWANZA KWA WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'BARUA YA KWANZA KWA WATHESALONIKE 1:1'")
		expect(p.parse("KWANZA WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'KWANZA WATHESALONIKE 1:1'")
		expect(p.parse("1. WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. WATHESALONIKE 1:1'")
		expect(p.parse("I. WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. WATHESALONIKE 1:1'")
		expect(p.parse("1 WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 WATHESALONIKE 1:1'")
		expect(p.parse("I WATHESALONIKE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I WATHESALONIKE 1:1'")
		expect(p.parse("WATHESALONIKE I 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'WATHESALONIKE I 1:1'")
		expect(p.parse("KWANZA THES 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'KWANZA THES 1:1'")
		expect(p.parse("KWANZA THE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'KWANZA THE 1:1'")
		expect(p.parse("KWANZA TH 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'KWANZA TH 1:1'")
		expect(p.parse("1. THES 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. THES 1:1'")
		expect(p.parse("I. THES 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. THES 1:1'")
		expect(p.parse("1 THES 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 THES 1:1'")
		expect(p.parse("1. THE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. THE 1:1'")
		expect(p.parse("1THESS 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1THESS 1:1'")
		expect(p.parse("I THES 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I THES 1:1'")
		expect(p.parse("I. THE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. THE 1:1'")
		expect(p.parse("1 THE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 THE 1:1'")
		expect(p.parse("1. TH 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TH 1:1'")
		expect(p.parse("I THE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I THE 1:1'")
		expect(p.parse("I. TH 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TH 1:1'")
		expect(p.parse("1 TH 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TH 1:1'")
		expect(p.parse("I TH 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Tim (sw)", function() {
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
    return it("should handle book: 2Tim (sw)", function() {
      
		expect(p.parse("Waraka wa Pili kwa Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Waraka wa Pili kwa Timotheo 1:1'")
		expect(p.parse("Barua ya Pili kwa Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Barua ya Pili kwa Timotheo 1:1'")
		expect(p.parse("Pili Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Pili Timotheo 1:1'")
		expect(p.parse("II. Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timotheo 1:1'")
		expect(p.parse("2. Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timotheo 1:1'")
		expect(p.parse("II Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timotheo 1:1'")
		expect(p.parse("Timotheo II 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Timotheo II 1:1'")
		expect(p.parse("2 Timotheo 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timotheo 1:1'")
		expect(p.parse("Pili Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Pili Tim 1:1'")
		expect(p.parse("II. Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Tim 1:1'")
		expect(p.parse("2. Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Tim 1:1'")
		expect(p.parse("II Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Tim 1:1'")
		expect(p.parse("2 Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tim 1:1'")
		expect(p.parse("2Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA PILI KWA TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'WARAKA WA PILI KWA TIMOTHEO 1:1'")
		expect(p.parse("BARUA YA PILI KWA TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'BARUA YA PILI KWA TIMOTHEO 1:1'")
		expect(p.parse("PILI TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'PILI TIMOTHEO 1:1'")
		expect(p.parse("II. TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMOTHEO 1:1'")
		expect(p.parse("2. TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMOTHEO 1:1'")
		expect(p.parse("II TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMOTHEO 1:1'")
		expect(p.parse("TIMOTHEO II 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'TIMOTHEO II 1:1'")
		expect(p.parse("2 TIMOTHEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTHEO 1:1'")
		expect(p.parse("PILI TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'PILI TIM 1:1'")
		expect(p.parse("II. TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIM 1:1'")
		expect(p.parse("2. TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIM 1:1'")
		expect(p.parse("II TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIM 1:1'")
		expect(p.parse("2 TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIM 1:1'")
		expect(p.parse("2TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Tim (sw)", function() {
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
    return it("should handle book: 1Tim (sw)", function() {
      
		expect(p.parse("Waraka wa Kwanza kwa Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Waraka wa Kwanza kwa Timotheo 1:1'")
		expect(p.parse("Barua ya Kwanza kwa Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Barua ya Kwanza kwa Timotheo 1:1'")
		expect(p.parse("Kwanza Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Kwanza Timotheo 1:1'")
		expect(p.parse("1. Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timotheo 1:1'")
		expect(p.parse("I. Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timotheo 1:1'")
		expect(p.parse("1 Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timotheo 1:1'")
		expect(p.parse("I Timotheo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timotheo 1:1'")
		expect(p.parse("Kwanza Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Kwanza Tim 1:1'")
		expect(p.parse("Timotheo I 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Timotheo I 1:1'")
		expect(p.parse("1. Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Tim 1:1'")
		expect(p.parse("I. Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Tim 1:1'")
		expect(p.parse("1 Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tim 1:1'")
		expect(p.parse("I Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Tim 1:1'")
		expect(p.parse("1Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA KWANZA KWA TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'WARAKA WA KWANZA KWA TIMOTHEO 1:1'")
		expect(p.parse("BARUA YA KWANZA KWA TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'BARUA YA KWANZA KWA TIMOTHEO 1:1'")
		expect(p.parse("KWANZA TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'KWANZA TIMOTHEO 1:1'")
		expect(p.parse("1. TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMOTHEO 1:1'")
		expect(p.parse("I. TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMOTHEO 1:1'")
		expect(p.parse("1 TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTHEO 1:1'")
		expect(p.parse("I TIMOTHEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMOTHEO 1:1'")
		expect(p.parse("KWANZA TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'KWANZA TIM 1:1'")
		expect(p.parse("TIMOTHEO I 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'TIMOTHEO I 1:1'")
		expect(p.parse("1. TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIM 1:1'")
		expect(p.parse("I. TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIM 1:1'")
		expect(p.parse("1 TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIM 1:1'")
		expect(p.parse("I TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIM 1:1'")
		expect(p.parse("1TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Titus (sw)", function() {
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
    return it("should handle book: Titus (sw)", function() {
      
		expect(p.parse("Waraka kwa Tito 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Waraka kwa Tito 1:1'")
		expect(p.parse("Barua kwa Tito 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Barua kwa Tito 1:1'")
		expect(p.parse("Titus 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titus 1:1'")
		expect(p.parse("Tito 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tito 1:1'")
		expect(p.parse("Tit 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tit 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA TITO 1:1").osis()).toEqual("Titus.1.1", "parsing: 'WARAKA KWA TITO 1:1'")
		expect(p.parse("BARUA KWA TITO 1:1").osis()).toEqual("Titus.1.1", "parsing: 'BARUA KWA TITO 1:1'")
		expect(p.parse("TITUS 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUS 1:1'")
		expect(p.parse("TITO 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITO 1:1'")
		expect(p.parse("TIT 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TIT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phlm (sw)", function() {
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
    return it("should handle book: Phlm (sw)", function() {
      
		expect(p.parse("Waraka kwa Filemoni 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Waraka kwa Filemoni 1:1'")
		expect(p.parse("Barua kwa Filemoni 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Barua kwa Filemoni 1:1'")
		expect(p.parse("Filemoni 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Filemoni 1:1'")
		expect(p.parse("Film 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Film 1:1'")
		expect(p.parse("Phlm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Phlm 1:1'")
		expect(p.parse("Flm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Flm 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA FILEMONI 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'WARAKA KWA FILEMONI 1:1'")
		expect(p.parse("BARUA KWA FILEMONI 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'BARUA KWA FILEMONI 1:1'")
		expect(p.parse("FILEMONI 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILEMONI 1:1'")
		expect(p.parse("FILM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILM 1:1'")
		expect(p.parse("PHLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHLM 1:1'")
		expect(p.parse("FLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FLM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Heb (sw)", function() {
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
    return it("should handle book: Heb (sw)", function() {
      
		expect(p.parse("Waraka kwa Waebrania 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Waraka kwa Waebrania 1:1'")
		expect(p.parse("Barua kwa Waebrania 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Barua kwa Waebrania 1:1'")
		expect(p.parse("Waebrania 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Waebrania 1:1'")
		expect(p.parse("Ebrania 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Ebrania 1:1'")
		expect(p.parse("Ebr 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Ebr 1:1'")
		expect(p.parse("Heb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heb 1:1'")
		expect(p.parse("Eb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Eb 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA KWA WAEBRANIA 1:1").osis()).toEqual("Heb.1.1", "parsing: 'WARAKA KWA WAEBRANIA 1:1'")
		expect(p.parse("BARUA KWA WAEBRANIA 1:1").osis()).toEqual("Heb.1.1", "parsing: 'BARUA KWA WAEBRANIA 1:1'")
		expect(p.parse("WAEBRANIA 1:1").osis()).toEqual("Heb.1.1", "parsing: 'WAEBRANIA 1:1'")
		expect(p.parse("EBRANIA 1:1").osis()).toEqual("Heb.1.1", "parsing: 'EBRANIA 1:1'")
		expect(p.parse("EBR 1:1").osis()).toEqual("Heb.1.1", "parsing: 'EBR 1:1'")
		expect(p.parse("HEB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEB 1:1'")
		expect(p.parse("EB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'EB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jas (sw)", function() {
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
    return it("should handle book: Jas (sw)", function() {
      
		expect(p.parse("Waraka wa Yakobo 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Waraka wa Yakobo 1:1'")
		expect(p.parse("Barua ya Yakobo 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Barua ya Yakobo 1:1'")
		expect(p.parse("Yakobo 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yakobo 1:1'")
		expect(p.parse("Jas 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jas 1:1'")
		expect(p.parse("Yak 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Yak 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA YAKOBO 1:1").osis()).toEqual("Jas.1.1", "parsing: 'WARAKA WA YAKOBO 1:1'")
		expect(p.parse("BARUA YA YAKOBO 1:1").osis()).toEqual("Jas.1.1", "parsing: 'BARUA YA YAKOBO 1:1'")
		expect(p.parse("YAKOBO 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAKOBO 1:1'")
		expect(p.parse("JAS 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAS 1:1'")
		expect(p.parse("YAK 1:1").osis()).toEqual("Jas.1.1", "parsing: 'YAK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Pet (sw)", function() {
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
    return it("should handle book: 2Pet (sw)", function() {
      
		expect(p.parse("Waraka wa Pili wa Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Waraka wa Pili wa Petro 1:1'")
		expect(p.parse("Barua ya Pili ya Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Barua ya Pili ya Petro 1:1'")
		expect(p.parse("Pili Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pili Petro 1:1'")
		expect(p.parse("II. Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Petro 1:1'")
		expect(p.parse("2. Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Petro 1:1'")
		expect(p.parse("II Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Petro 1:1'")
		expect(p.parse("Petro II 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Petro II 1:1'")
		expect(p.parse("Pili Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Pili Pet 1:1'")
		expect(p.parse("2 Petro 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Petro 1:1'")
		expect(p.parse("II. Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Pet 1:1'")
		expect(p.parse("2. Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Pet 1:1'")
		expect(p.parse("II Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Pet 1:1'")
		expect(p.parse("2 Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Pet 1:1'")
		expect(p.parse("2Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA PILI WA PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'WARAKA WA PILI WA PETRO 1:1'")
		expect(p.parse("BARUA YA PILI YA PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'BARUA YA PILI YA PETRO 1:1'")
		expect(p.parse("PILI PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PILI PETRO 1:1'")
		expect(p.parse("II. PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PETRO 1:1'")
		expect(p.parse("2. PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PETRO 1:1'")
		expect(p.parse("II PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PETRO 1:1'")
		expect(p.parse("PETRO II 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PETRO II 1:1'")
		expect(p.parse("PILI PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'PILI PET 1:1'")
		expect(p.parse("2 PETRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PETRO 1:1'")
		expect(p.parse("II. PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PET 1:1'")
		expect(p.parse("2. PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PET 1:1'")
		expect(p.parse("II PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PET 1:1'")
		expect(p.parse("2 PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PET 1:1'")
		expect(p.parse("2PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Pet (sw)", function() {
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
    return it("should handle book: 1Pet (sw)", function() {
      
		expect(p.parse("Waraka wa Kwanza wa Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Waraka wa Kwanza wa Petro 1:1'")
		expect(p.parse("Barua ya Kwanza ya Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Barua ya Kwanza ya Petro 1:1'")
		expect(p.parse("Kwanza Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Kwanza Petro 1:1'")
		expect(p.parse("Kwanza Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Kwanza Pet 1:1'")
		expect(p.parse("1. Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Petro 1:1'")
		expect(p.parse("I. Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Petro 1:1'")
		expect(p.parse("1 Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Petro 1:1'")
		expect(p.parse("I Petro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Petro 1:1'")
		expect(p.parse("Petro I 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Petro I 1:1'")
		expect(p.parse("1. Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Pet 1:1'")
		expect(p.parse("I. Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Pet 1:1'")
		expect(p.parse("1 Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Pet 1:1'")
		expect(p.parse("I Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Pet 1:1'")
		expect(p.parse("1Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("WARAKA WA KWANZA WA PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'WARAKA WA KWANZA WA PETRO 1:1'")
		expect(p.parse("BARUA YA KWANZA YA PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'BARUA YA KWANZA YA PETRO 1:1'")
		expect(p.parse("KWANZA PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'KWANZA PETRO 1:1'")
		expect(p.parse("KWANZA PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'KWANZA PET 1:1'")
		expect(p.parse("1. PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PETRO 1:1'")
		expect(p.parse("I. PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PETRO 1:1'")
		expect(p.parse("1 PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PETRO 1:1'")
		expect(p.parse("I PETRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PETRO 1:1'")
		expect(p.parse("PETRO I 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'PETRO I 1:1'")
		expect(p.parse("1. PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PET 1:1'")
		expect(p.parse("I. PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PET 1:1'")
		expect(p.parse("1 PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PET 1:1'")
		expect(p.parse("I PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PET 1:1'")
		expect(p.parse("1PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jude (sw)", function() {
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
    return it("should handle book: Jude (sw)", function() {
      
		expect(p.parse("Barua ya Yuda 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Barua ya Yuda 1:1'")
		expect(p.parse("Jude 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jude 1:1'")
		expect(p.parse("Yuda 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yuda 1:1'")
		expect(p.parse("Yud 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Yud 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("BARUA YA YUDA 1:1").osis()).toEqual("Jude.1.1", "parsing: 'BARUA YA YUDA 1:1'")
		expect(p.parse("JUDE 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDE 1:1'")
		expect(p.parse("YUDA 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUDA 1:1'")
		expect(p.parse("YUD 1:1").osis()).toEqual("Jude.1.1", "parsing: 'YUD 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Tob (sw)", function() {
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
    return it("should handle book: Tob (sw)", function() {
      
		expect(p.parse("Tobiti 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tobiti 1:1'")
		expect(p.parse("Tob 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tob 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jdt (sw)", function() {
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
    return it("should handle book: Jdt (sw)", function() {
      
		expect(p.parse("Yudithi 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Yudithi 1:1'")
		expect(p.parse("Yudith 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Yudith 1:1'")
		expect(p.parse("Yuditi 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Yuditi 1:1'")
		expect(p.parse("Yudit 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Yudit 1:1'")
		expect(p.parse("Yudt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Yudt 1:1'")
		expect(p.parse("Jdt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Jdt 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bar (sw)", function() {
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
    return it("should handle book: Bar (sw)", function() {
      
		expect(p.parse("Baruku 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Baruku 1:1'")
		expect(p.parse("Baruk 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Baruk 1:1'")
		expect(p.parse("Bar 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bar 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sus (sw)", function() {
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
    return it("should handle book: Sus (sw)", function() {
      
		expect(p.parse("Susana 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Susana 1:1'")
		expect(p.parse("Sus 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Sus 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Macc (sw)", function() {
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
    return it("should handle book: 2Macc (sw)", function() {
      
		expect(p.parse("Kitabu cha Wamakabayo II 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Kitabu cha Wamakabayo II 1:1'")
		expect(p.parse("Pili Wamakabayo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Pili Wamakabayo 1:1'")
		expect(p.parse("II. Wamakabayo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Wamakabayo 1:1'")
		expect(p.parse("2. Wamakabayo 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Wamakabayo 1:1'")
		expect(p.parse("II Wamakabayo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Wamakabayo 1:1'")
		expect(p.parse("Wamakabayo II 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Wamakabayo II 1:1'")
		expect(p.parse("2 Wamakabayo 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Wamakabayo 1:1'")
		expect(p.parse("Pili Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Pili Mak 1:1'")
		expect(p.parse("II. Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Mak 1:1'")
		expect(p.parse("2. Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Mak 1:1'")
		expect(p.parse("II Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Mak 1:1'")
		expect(p.parse("2 Mak 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Mak 1:1'")
		expect(p.parse("2Macc 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3Macc (sw)", function() {
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
    return it("should handle book: 3Macc (sw)", function() {
      
		expect(p.parse("Kitabu cha Wamakabayo III 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Kitabu cha Wamakabayo III 1:1'")
		expect(p.parse("III. Wamakabayo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Wamakabayo 1:1'")
		expect(p.parse("Tatu Wamakabayo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Tatu Wamakabayo 1:1'")
		expect(p.parse("III Wamakabayo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Wamakabayo 1:1'")
		expect(p.parse("Wamakabayo III 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Wamakabayo III 1:1'")
		expect(p.parse("3. Wamakabayo 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Wamakabayo 1:1'")
		expect(p.parse("3 Wamakabayo 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Wamakabayo 1:1'")
		expect(p.parse("III. Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Mak 1:1'")
		expect(p.parse("Tatu Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Tatu Mak 1:1'")
		expect(p.parse("III Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Mak 1:1'")
		expect(p.parse("3. Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Mak 1:1'")
		expect(p.parse("3 Mak 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Mak 1:1'")
		expect(p.parse("3Macc 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 4Macc (sw)", function() {
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
    return it("should handle book: 4Macc (sw)", function() {
      
		expect(p.parse("Kitabu cha Wamakabayo IV 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Kitabu cha Wamakabayo IV 1:1'")
		expect(p.parse("IV. Wamakabayo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Wamakabayo 1:1'")
		expect(p.parse("Nne Wamakabayo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Nne Wamakabayo 1:1'")
		expect(p.parse("4. Wamakabayo 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Wamakabayo 1:1'")
		expect(p.parse("IV Wamakabayo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Wamakabayo 1:1'")
		expect(p.parse("Wamakabayo IV 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Wamakabayo IV 1:1'")
		expect(p.parse("4 Wamakabayo 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Wamakabayo 1:1'")
		expect(p.parse("IV. Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Mak 1:1'")
		expect(p.parse("Nne Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Nne Mak 1:1'")
		expect(p.parse("4. Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Mak 1:1'")
		expect(p.parse("IV Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Mak 1:1'")
		expect(p.parse("4 Mak 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Mak 1:1'")
		expect(p.parse("4Macc 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Macc (sw)", function() {
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
    return it("should handle book: 1Macc (sw)", function() {
      
		expect(p.parse("Kitabu cha Wamakabayo I 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Kitabu cha Wamakabayo I 1:1'")
		expect(p.parse("Kwanza Wamakabayo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Kwanza Wamakabayo 1:1'")
		expect(p.parse("1. Wamakabayo 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Wamakabayo 1:1'")
		expect(p.parse("I. Wamakabayo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Wamakabayo 1:1'")
		expect(p.parse("1 Wamakabayo 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Wamakabayo 1:1'")
		expect(p.parse("I Wamakabayo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Wamakabayo 1:1'")
		expect(p.parse("Wamakabayo I 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Wamakabayo I 1:1'")
		expect(p.parse("Kwanza Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Kwanza Mak 1:1'")
		expect(p.parse("1. Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Mak 1:1'")
		expect(p.parse("I. Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Mak 1:1'")
		expect(p.parse("1 Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Mak 1:1'")
		expect(p.parse("1Macc 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1Macc 1:1'")
		expect(p.parse("I Mak 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Mak 1:1'")
		;
      return true;
    });
  });

  describe("Localized book John,Jonah (sw)", function() {
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
    return it("should handle book: John,Jonah (sw)", function() {
      
		expect(p.parse("Yn 1:1").osis()).toEqual("John.1.1", "parsing: 'Yn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("YN 1:1").osis()).toEqual("John.1.1", "parsing: 'YN 1:1'")
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
      return expect(p.languages).toEqual(["sw"]);
    });
    it("should handle ranges (sw)", function() {
      expect(p.parse("Titus 1:1 hadi 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 hadi 2'");
      expect(p.parse("Matt 1hadi2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1hadi2'");
      return expect(p.parse("Phlm 2 HADI 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 HADI 3'");
    });
    it("should handle chapters (sw)", function() {
      expect(p.parse("Titus 1:1, sura 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, sura 2'");
      return expect(p.parse("Matt 3:4 SURA 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 SURA 6'");
    });
    it("should handle verses (sw)", function() {
      expect(p.parse("Exod 1:1 mistari 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 mistari 3'");
      return expect(p.parse("Phlm MISTARI 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm MISTARI 6'");
    });
    it("should handle 'and' (sw)", function() {
      expect(p.parse("Exod 1:1 taz. 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 taz. 3'");
      expect(p.parse("Phlm 2 TAZ. 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 TAZ. 6'");
      expect(p.parse("Exod 1:1 taz 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 taz 3'");
      expect(p.parse("Phlm 2 TAZ 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 TAZ 6'");
      expect(p.parse("Exod 1:1 na 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 na 3'");
      return expect(p.parse("Phlm 2 NA 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 NA 6'");
    });
    it("should handle titles (sw)", function() {
      expect(p.parse("Ps 3 title, 4:2, 5:title").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 title, 4:2, 5:title'");
      return expect(p.parse("PS 3 TITLE, 4:2, 5:TITLE").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 TITLE, 4:2, 5:TITLE'");
    });
    it("should handle 'ff' (sw)", function() {
      expect(p.parse("Rev 3ff, 4:2ff").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3ff, 4:2ff'");
      return expect(p.parse("REV 3 FF, 4:2 FF").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'REV 3 FF, 4:2 FF'");
    });
    it("should handle translations (sw)", function() {
      expect(p.parse("Lev 1 (HN)").osis_and_translations()).toEqual([["Lev.1", "HN"]]);
      expect(p.parse("lev 1 hn").osis_and_translations()).toEqual([["Lev.1", "HN"]]);
      expect(p.parse("Lev 1 (SUV)").osis_and_translations()).toEqual([["Lev.1", "SUV"]]);
      return expect(p.parse("lev 1 suv").osis_and_translations()).toEqual([["Lev.1", "SUV"]]);
    });
    it("should handle book ranges (sw)", function() {
      p.set_options({
        book_alone_strategy: "full",
        book_range_strategy: "include"
      });
      return expect(p.parse("Kwanza hadi Tatu  Yoh").osis()).toEqual("1John.1-3John.1", "parsing: 'Kwanza hadi Tatu  Yoh'");
    });
    return it("should handle boundaries (sw)", function() {
      p.set_options({
        book_alone_strategy: "full"
      });
      expect(p.parse("\u2014Matt\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\u2014Matt\u2014'");
      return expect(p.parse("\u201cMatt 1:1\u201d").osis()).toEqual("Matt.1.1", "parsing: '\u201cMatt 1:1\u201d'");
    });
  });

}).call(this);
