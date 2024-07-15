(function() {
  var bcv_parser;

  bcv_parser = require("../../js/tl_bcv_parser.js").bcv_parser;

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

  describe("Localized book Gen (tl)", function() {
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
    return it("should handle book: Gen (tl)", function() {
      
		expect(p.parse("Genesis 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Genesis 1:1'")
		expect(p.parse("Henesis 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Henesis 1:1'")
		expect(p.parse("Gen 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Gen 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("GENESIS 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GENESIS 1:1'")
		expect(p.parse("HENESIS 1:1").osis()).toEqual("Gen.1.1", "parsing: 'HENESIS 1:1'")
		expect(p.parse("GEN 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GEN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Exod (tl)", function() {
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
    return it("should handle book: Exod (tl)", function() {
      
		expect(p.parse("Exodus 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exodus 1:1'")
		expect(p.parse("Exodo 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exodo 1:1'")
		expect(p.parse("Exod 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exod 1:1'")
		expect(p.parse("Exo 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exo 1:1'")
		expect(p.parse("Ex 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Ex 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EXODUS 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXODUS 1:1'")
		expect(p.parse("EXODO 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXODO 1:1'")
		expect(p.parse("EXOD 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXOD 1:1'")
		expect(p.parse("EXO 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXO 1:1'")
		expect(p.parse("EX 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EX 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bel (tl)", function() {
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
    return it("should handle book: Bel (tl)", function() {
      
		expect(p.parse("Si Bel at ang Dragon 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Si Bel at ang Dragon 1:1'")
		expect(p.parse("Bel at ang Dragon 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel at ang Dragon 1:1'")
		expect(p.parse("Bel 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lev (tl)", function() {
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
    return it("should handle book: Lev (tl)", function() {
      
		expect(p.parse("Lebitikus 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lebitikus 1:1'")
		expect(p.parse("Lebitico 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lebitico 1:1'")
		expect(p.parse("Levitico 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Levitico 1:1'")
		expect(p.parse("Leb 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Leb 1:1'")
		expect(p.parse("Lev 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lev 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("LEBITIKUS 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEBITIKUS 1:1'")
		expect(p.parse("LEBITICO 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEBITICO 1:1'")
		expect(p.parse("LEVITICO 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEVITICO 1:1'")
		expect(p.parse("LEB 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEB 1:1'")
		expect(p.parse("LEV 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEV 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Num (tl)", function() {
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
    return it("should handle book: Num (tl)", function() {
      
		expect(p.parse("Mga Bilang 1:1").osis()).toEqual("Num.1.1", "parsing: 'Mga Bilang 1:1'")
		expect(p.parse("Bamidbar 1:1").osis()).toEqual("Num.1.1", "parsing: 'Bamidbar 1:1'")
		expect(p.parse("Bemidbar 1:1").osis()).toEqual("Num.1.1", "parsing: 'Bemidbar 1:1'")
		expect(p.parse("Bilang 1:1").osis()).toEqual("Num.1.1", "parsing: 'Bilang 1:1'")
		expect(p.parse("Bil 1:1").osis()).toEqual("Num.1.1", "parsing: 'Bil 1:1'")
		expect(p.parse("Blg 1:1").osis()).toEqual("Num.1.1", "parsing: 'Blg 1:1'")
		expect(p.parse("Num 1:1").osis()).toEqual("Num.1.1", "parsing: 'Num 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MGA BILANG 1:1").osis()).toEqual("Num.1.1", "parsing: 'MGA BILANG 1:1'")
		expect(p.parse("BAMIDBAR 1:1").osis()).toEqual("Num.1.1", "parsing: 'BAMIDBAR 1:1'")
		expect(p.parse("BEMIDBAR 1:1").osis()).toEqual("Num.1.1", "parsing: 'BEMIDBAR 1:1'")
		expect(p.parse("BILANG 1:1").osis()).toEqual("Num.1.1", "parsing: 'BILANG 1:1'")
		expect(p.parse("BIL 1:1").osis()).toEqual("Num.1.1", "parsing: 'BIL 1:1'")
		expect(p.parse("BLG 1:1").osis()).toEqual("Num.1.1", "parsing: 'BLG 1:1'")
		expect(p.parse("NUM 1:1").osis()).toEqual("Num.1.1", "parsing: 'NUM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sir (tl)", function() {
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
    return it("should handle book: Sir (tl)", function() {
      
		expect(p.parse("Ang Karunungan ni Jesus, Anak ni Sirac 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ang Karunungan ni Jesus, Anak ni Sirac 1:1'")
		expect(p.parse("Ang Karunungan ni Jesus Anak ni Sirac 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ang Karunungan ni Jesus Anak ni Sirac 1:1'")
		expect(p.parse("Karunungan ng Anak ni Sirac 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Karunungan ng Anak ni Sirac 1:1'")
		expect(p.parse("Ecclesiasticus 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ecclesiasticus 1:1'")
		expect(p.parse("Ekklesiastikus 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ekklesiastikus 1:1'")
		expect(p.parse("Ekklesyastikus 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ekklesyastikus 1:1'")
		expect(p.parse("Ecclesiastico 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ecclesiastico 1:1'")
		expect(p.parse("Ekklesiastiko 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ekklesiastiko 1:1'")
		expect(p.parse("Ekklesyastiko 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Ekklesyastiko 1:1'")
		expect(p.parse("Eklesiastikus 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Eklesiastikus 1:1'")
		expect(p.parse("Eklesyastikus 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Eklesyastikus 1:1'")
		expect(p.parse("Eclesiastico 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Eclesiastico 1:1'")
		expect(p.parse("Eklesiastiko 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Eklesiastiko 1:1'")
		expect(p.parse("Eklesyastiko 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Eklesyastiko 1:1'")
		expect(p.parse("Siracidas 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Siracidas 1:1'")
		expect(p.parse("Siracides 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Siracides 1:1'")
		expect(p.parse("Sirakidas 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirakidas 1:1'")
		expect(p.parse("Sirakides 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirakides 1:1'")
		expect(p.parse("Sirácidas 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirácidas 1:1'")
		expect(p.parse("Sirácides 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirácides 1:1'")
		expect(p.parse("Sirákidas 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirákidas 1:1'")
		expect(p.parse("Sirákides 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirákides 1:1'")
		expect(p.parse("Siracida 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Siracida 1:1'")
		expect(p.parse("Siracide 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Siracide 1:1'")
		expect(p.parse("Sirakida 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirakida 1:1'")
		expect(p.parse("Sirakide 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirakide 1:1'")
		expect(p.parse("Sirácida 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirácida 1:1'")
		expect(p.parse("Sirácide 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirácide 1:1'")
		expect(p.parse("Sirákida 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirákida 1:1'")
		expect(p.parse("Sirákide 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirákide 1:1'")
		expect(p.parse("Sirach 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirach 1:1'")
		expect(p.parse("Sirakh 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirakh 1:1'")
		expect(p.parse("Sirách 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirách 1:1'")
		expect(p.parse("Sirákh 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirákh 1:1'")
		expect(p.parse("Sirac 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirac 1:1'")
		expect(p.parse("Sirak 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirak 1:1'")
		expect(p.parse("Sirác 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirác 1:1'")
		expect(p.parse("Sirák 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sirák 1:1'")
		expect(p.parse("Sir 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sir 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lam (tl)", function() {
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
    return it("should handle book: Lam (tl)", function() {
      
		expect(p.parse("Aklat ng Pananaghoy 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Aklat ng Pananaghoy 1:1'")
		expect(p.parse("Aklat ng Pagtaghoy 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Aklat ng Pagtaghoy 1:1'")
		expect(p.parse("Mga Lamentasyon 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Mga Lamentasyon 1:1'")
		expect(p.parse("Mga Panaghoy 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Mga Panaghoy 1:1'")
		expect(p.parse("Panaghoy 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Panaghoy 1:1'")
		expect(p.parse("Panag 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Panag 1:1'")
		expect(p.parse("Lam 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Lam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("AKLAT NG PANANAGHOY 1:1").osis()).toEqual("Lam.1.1", "parsing: 'AKLAT NG PANANAGHOY 1:1'")
		expect(p.parse("AKLAT NG PAGTAGHOY 1:1").osis()).toEqual("Lam.1.1", "parsing: 'AKLAT NG PAGTAGHOY 1:1'")
		expect(p.parse("MGA LAMENTASYON 1:1").osis()).toEqual("Lam.1.1", "parsing: 'MGA LAMENTASYON 1:1'")
		expect(p.parse("MGA PANAGHOY 1:1").osis()).toEqual("Lam.1.1", "parsing: 'MGA PANAGHOY 1:1'")
		expect(p.parse("PANAGHOY 1:1").osis()).toEqual("Lam.1.1", "parsing: 'PANAGHOY 1:1'")
		expect(p.parse("PANAG 1:1").osis()).toEqual("Lam.1.1", "parsing: 'PANAG 1:1'")
		expect(p.parse("LAM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'LAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book EpJer (tl)", function() {
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
    return it("should handle book: EpJer (tl)", function() {
      
		expect(p.parse("Ang Liham ni Jeremias 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Ang Liham ni Jeremias 1:1'")
		expect(p.parse("Liham ni Jeremias 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Liham ni Jeremias 1:1'")
		expect(p.parse("Li ni Jer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Li ni Jer 1:1'")
		expect(p.parse("Lih Jer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Lih Jer 1:1'")
		expect(p.parse("EpJer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'EpJer 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rev (tl)", function() {
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
    return it("should handle book: Rev (tl)", function() {
      
		expect(p.parse("Apocalipsis ni Juan 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apocalipsis ni Juan 1:1'")
		expect(p.parse("Apokalipsis ni Juan 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apokalipsis ni Juan 1:1'")
		expect(p.parse("Pahayag kay Juan 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Pahayag kay Juan 1:1'")
		expect(p.parse("Apocalipsis 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apocalipsis 1:1'")
		expect(p.parse("Apokalipsis 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apokalipsis 1:1'")
		expect(p.parse("Rebelasyon 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rebelasyon 1:1'")
		expect(p.parse("Pahayag 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Pahayag 1:1'")
		expect(p.parse("Apoc 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apoc 1:1'")
		expect(p.parse("Apok 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Apok 1:1'")
		expect(p.parse("Pah 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Pah 1:1'")
		expect(p.parse("Rev 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rev 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("APOCALIPSIS NI JUAN 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOCALIPSIS NI JUAN 1:1'")
		expect(p.parse("APOKALIPSIS NI JUAN 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOKALIPSIS NI JUAN 1:1'")
		expect(p.parse("PAHAYAG KAY JUAN 1:1").osis()).toEqual("Rev.1.1", "parsing: 'PAHAYAG KAY JUAN 1:1'")
		expect(p.parse("APOCALIPSIS 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOCALIPSIS 1:1'")
		expect(p.parse("APOKALIPSIS 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOKALIPSIS 1:1'")
		expect(p.parse("REBELASYON 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REBELASYON 1:1'")
		expect(p.parse("PAHAYAG 1:1").osis()).toEqual("Rev.1.1", "parsing: 'PAHAYAG 1:1'")
		expect(p.parse("APOC 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOC 1:1'")
		expect(p.parse("APOK 1:1").osis()).toEqual("Rev.1.1", "parsing: 'APOK 1:1'")
		expect(p.parse("PAH 1:1").osis()).toEqual("Rev.1.1", "parsing: 'PAH 1:1'")
		expect(p.parse("REV 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REV 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrMan (tl)", function() {
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
    return it("should handle book: PrMan (tl)", function() {
      
		expect(p.parse("Ang Panalangin ni Manases 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Ang Panalangin ni Manases 1:1'")
		expect(p.parse("Panalangin ni Manases 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Panalangin ni Manases 1:1'")
		expect(p.parse("Dalangin ni Manases 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Dalangin ni Manases 1:1'")
		expect(p.parse("Dasal ni Manases 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Dasal ni Manases 1:1'")
		expect(p.parse("PrMan 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'PrMan 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Deut (tl)", function() {
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
    return it("should handle book: Deut (tl)", function() {
      
		expect(p.parse("Deuteronomiya 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronomiya 1:1'")
		expect(p.parse("Deuteronomiyo 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronomiyo 1:1'")
		expect(p.parse("Deyuteronomyo 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deyuteronomyo 1:1'")
		expect(p.parse("Diyuteronomyo 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Diyuteronomyo 1:1'")
		expect(p.parse("Deuteronomia 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronomia 1:1'")
		expect(p.parse("Deuteronomio 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronomio 1:1'")
		expect(p.parse("Deuteronomya 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronomya 1:1'")
		expect(p.parse("Dyuteronomyo 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Dyuteronomyo 1:1'")
		expect(p.parse("Deuteronoma 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronoma 1:1'")
		expect(p.parse("Deuteronomi 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deuteronomi 1:1'")
		expect(p.parse("Deut 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deut 1:1'")
		expect(p.parse("Dt 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Dt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("DEUTERONOMIYA 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMIYA 1:1'")
		expect(p.parse("DEUTERONOMIYO 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMIYO 1:1'")
		expect(p.parse("DEYUTERONOMYO 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEYUTERONOMYO 1:1'")
		expect(p.parse("DIYUTERONOMYO 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DIYUTERONOMYO 1:1'")
		expect(p.parse("DEUTERONOMIA 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMIA 1:1'")
		expect(p.parse("DEUTERONOMIO 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMIO 1:1'")
		expect(p.parse("DEUTERONOMYA 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMYA 1:1'")
		expect(p.parse("DYUTERONOMYO 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DYUTERONOMYO 1:1'")
		expect(p.parse("DEUTERONOMA 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMA 1:1'")
		expect(p.parse("DEUTERONOMI 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUTERONOMI 1:1'")
		expect(p.parse("DEUT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUT 1:1'")
		expect(p.parse("DT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Josh (tl)", function() {
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
    return it("should handle book: Josh (tl)", function() {
      
		expect(p.parse("Joshua 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Joshua 1:1'")
		expect(p.parse("Josue 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josue 1:1'")
		expect(p.parse("Josué 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josué 1:1'")
		expect(p.parse("Josh 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josh 1:1'")
		expect(p.parse("Jos 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Jos 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JOSHUA 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSHUA 1:1'")
		expect(p.parse("JOSUE 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSUE 1:1'")
		expect(p.parse("JOSUÉ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSUÉ 1:1'")
		expect(p.parse("JOSH 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSH 1:1'")
		expect(p.parse("JOS 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Judg (tl)", function() {
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
    return it("should handle book: Judg (tl)", function() {
      
		expect(p.parse("Mga Hukom 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Mga Hukom 1:1'")
		expect(p.parse("Hukom 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Hukom 1:1'")
		expect(p.parse("Judg 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Judg 1:1'")
		expect(p.parse("Huk 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Huk 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MGA HUKOM 1:1").osis()).toEqual("Judg.1.1", "parsing: 'MGA HUKOM 1:1'")
		expect(p.parse("HUKOM 1:1").osis()).toEqual("Judg.1.1", "parsing: 'HUKOM 1:1'")
		expect(p.parse("JUDG 1:1").osis()).toEqual("Judg.1.1", "parsing: 'JUDG 1:1'")
		expect(p.parse("HUK 1:1").osis()).toEqual("Judg.1.1", "parsing: 'HUK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ruth (tl)", function() {
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
    return it("should handle book: Ruth (tl)", function() {
      
		expect(p.parse("Ruth 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruth 1:1'")
		expect(p.parse("Rut 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Rut 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("RUTH 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTH 1:1'")
		expect(p.parse("RUT 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Esd (tl)", function() {
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
    return it("should handle book: 1Esd (tl)", function() {
      
		expect(p.parse("Unang Esdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Unang Esdras 1:1'")
		expect(p.parse("Una Esdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Una Esdras 1:1'")
		expect(p.parse("Unang Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Unang Ezra 1:1'")
		expect(p.parse("1. Esdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Esdras 1:1'")
		expect(p.parse("I. Esdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Esdras 1:1'")
		expect(p.parse("1 Esdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Esdras 1:1'")
		expect(p.parse("I Esdras 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Esdras 1:1'")
		expect(p.parse("Una Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Una Ezra 1:1'")
		expect(p.parse("1. Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Ezra 1:1'")
		expect(p.parse("I. Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Ezra 1:1'")
		expect(p.parse("1 Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ezra 1:1'")
		expect(p.parse("I Ezra 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Ezra 1:1'")
		expect(p.parse("1 Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Esd 1:1'")
		expect(p.parse("1Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Esd (tl)", function() {
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
    return it("should handle book: 2Esd (tl)", function() {
      
		expect(p.parse("Ikalawang Esdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Ikalawang Esdras 1:1'")
		expect(p.parse("Ikalawang Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Ikalawang Ezra 1:1'")
		expect(p.parse("II. Esdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Esdras 1:1'")
		expect(p.parse("2. Esdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Esdras 1:1'")
		expect(p.parse("II Esdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Esdras 1:1'")
		expect(p.parse("2 Esdras 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Esdras 1:1'")
		expect(p.parse("II. Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Ezra 1:1'")
		expect(p.parse("2. Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Ezra 1:1'")
		expect(p.parse("II Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Ezra 1:1'")
		expect(p.parse("2 Ezra 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ezra 1:1'")
		expect(p.parse("2 Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Esd 1:1'")
		expect(p.parse("2Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Isa (tl)", function() {
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
    return it("should handle book: Isa (tl)", function() {
      
		expect(p.parse("Isaiah 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaiah 1:1'")
		expect(p.parse("Isaias 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaias 1:1'")
		expect(p.parse("Isaíah 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaíah 1:1'")
		expect(p.parse("Isaías 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaías 1:1'")
		expect(p.parse("Isaia 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaia 1:1'")
		expect(p.parse("Isaía 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isaía 1:1'")
		expect(p.parse("Isa 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isa 1:1'")
		expect(p.parse("Is 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Is 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ISAIAH 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAIAH 1:1'")
		expect(p.parse("ISAIAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAIAS 1:1'")
		expect(p.parse("ISAÍAH 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAÍAH 1:1'")
		expect(p.parse("ISAÍAS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAÍAS 1:1'")
		expect(p.parse("ISAIA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAIA 1:1'")
		expect(p.parse("ISAÍA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISAÍA 1:1'")
		expect(p.parse("ISA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISA 1:1'")
		expect(p.parse("IS 1:1").osis()).toEqual("Isa.1.1", "parsing: 'IS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Sam (tl)", function() {
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
    return it("should handle book: 2Sam (tl)", function() {
      
		expect(p.parse("Ikalawang Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Ikalawang Samuel 1:1'")
		expect(p.parse("II. Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Samuel 1:1'")
		expect(p.parse("2. Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Samuel 1:1'")
		expect(p.parse("II Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Samuel 1:1'")
		expect(p.parse("2 Samuel 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Samuel 1:1'")
		expect(p.parse("2 Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Sam 1:1'")
		expect(p.parse("2Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'IKALAWANG SAMUEL 1:1'")
		expect(p.parse("II. SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. SAMUEL 1:1'")
		expect(p.parse("2. SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. SAMUEL 1:1'")
		expect(p.parse("II SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II SAMUEL 1:1'")
		expect(p.parse("2 SAMUEL 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAMUEL 1:1'")
		expect(p.parse("2 SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 SAM 1:1'")
		expect(p.parse("2SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2SAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Sam (tl)", function() {
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
    return it("should handle book: 1Sam (tl)", function() {
      
		expect(p.parse("Unang Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Unang Samuel 1:1'")
		expect(p.parse("Una Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Una Samuel 1:1'")
		expect(p.parse("1. Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Samuel 1:1'")
		expect(p.parse("I. Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Samuel 1:1'")
		expect(p.parse("1 Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Samuel 1:1'")
		expect(p.parse("I Samuel 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Samuel 1:1'")
		expect(p.parse("1 Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Sam 1:1'")
		expect(p.parse("1Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1Sam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UNANG SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'UNANG SAMUEL 1:1'")
		expect(p.parse("UNA SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'UNA SAMUEL 1:1'")
		expect(p.parse("1. SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. SAMUEL 1:1'")
		expect(p.parse("I. SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. SAMUEL 1:1'")
		expect(p.parse("1 SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAMUEL 1:1'")
		expect(p.parse("I SAMUEL 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I SAMUEL 1:1'")
		expect(p.parse("1 SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 SAM 1:1'")
		expect(p.parse("1SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1SAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Kgs (tl)", function() {
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
    return it("should handle book: 2Kgs (tl)", function() {
      
		expect(p.parse("Ikalawang Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Ikalawang Mga Hari 1:1'")
		expect(p.parse("Ikaapat Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Ikaapat Mga Hari 1:1'")
		expect(p.parse("Ikalawang Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Ikalawang Hari 1:1'")
		expect(p.parse("II. Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Mga Hari 1:1'")
		expect(p.parse("IV. Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. Mga Hari 1:1'")
		expect(p.parse("2. Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Mga Hari 1:1'")
		expect(p.parse("4. Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. Mga Hari 1:1'")
		expect(p.parse("II Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Mga Hari 1:1'")
		expect(p.parse("IV Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV Mga Hari 1:1'")
		expect(p.parse("2 Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Mga Hari 1:1'")
		expect(p.parse("4 Mga Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Mga Hari 1:1'")
		expect(p.parse("II. Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. Hari 1:1'")
		expect(p.parse("2. Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. Hari 1:1'")
		expect(p.parse("II Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II Hari 1:1'")
		expect(p.parse("2 Hari 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Hari 1:1'")
		expect(p.parse("2 Ha 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 Ha 1:1'")
		expect(p.parse("2Kgs 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IKALAWANG MGA HARI 1:1'")
		expect(p.parse("IKAAPAT MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IKAAPAT MGA HARI 1:1'")
		expect(p.parse("IKALAWANG HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IKALAWANG HARI 1:1'")
		expect(p.parse("II. MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. MGA HARI 1:1'")
		expect(p.parse("IV. MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. MGA HARI 1:1'")
		expect(p.parse("2. MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. MGA HARI 1:1'")
		expect(p.parse("4. MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. MGA HARI 1:1'")
		expect(p.parse("II MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II MGA HARI 1:1'")
		expect(p.parse("IV MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV MGA HARI 1:1'")
		expect(p.parse("2 MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 MGA HARI 1:1'")
		expect(p.parse("4 MGA HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 MGA HARI 1:1'")
		expect(p.parse("II. HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II. HARI 1:1'")
		expect(p.parse("2. HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2. HARI 1:1'")
		expect(p.parse("II HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'II HARI 1:1'")
		expect(p.parse("2 HARI 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 HARI 1:1'")
		expect(p.parse("2 HA 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2 HA 1:1'")
		expect(p.parse("2KGS 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2KGS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Kgs (tl)", function() {
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
    return it("should handle book: 1Kgs (tl)", function() {
      
		expect(p.parse("Ikatlong Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Ikatlong Mga Hari 1:1'")
		expect(p.parse("Unang Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Unang Mga Hari 1:1'")
		expect(p.parse("III. Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. Mga Hari 1:1'")
		expect(p.parse("III Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III Mga Hari 1:1'")
		expect(p.parse("Una Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Una Mga Hari 1:1'")
		expect(p.parse("1. Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Mga Hari 1:1'")
		expect(p.parse("3. Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. Mga Hari 1:1'")
		expect(p.parse("I. Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Mga Hari 1:1'")
		expect(p.parse("1 Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Mga Hari 1:1'")
		expect(p.parse("3 Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Mga Hari 1:1'")
		expect(p.parse("I Mga Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Mga Hari 1:1'")
		expect(p.parse("Unang Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Unang Hari 1:1'")
		expect(p.parse("Una Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Una Hari 1:1'")
		expect(p.parse("1. Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. Hari 1:1'")
		expect(p.parse("I. Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. Hari 1:1'")
		expect(p.parse("1 Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Hari 1:1'")
		expect(p.parse("I Hari 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I Hari 1:1'")
		expect(p.parse("1 Ha 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 Ha 1:1'")
		expect(p.parse("1Kgs 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1Kgs 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKATLONG MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'IKATLONG MGA HARI 1:1'")
		expect(p.parse("UNANG MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'UNANG MGA HARI 1:1'")
		expect(p.parse("III. MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. MGA HARI 1:1'")
		expect(p.parse("III MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III MGA HARI 1:1'")
		expect(p.parse("UNA MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'UNA MGA HARI 1:1'")
		expect(p.parse("1. MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. MGA HARI 1:1'")
		expect(p.parse("3. MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. MGA HARI 1:1'")
		expect(p.parse("I. MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. MGA HARI 1:1'")
		expect(p.parse("1 MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 MGA HARI 1:1'")
		expect(p.parse("3 MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 MGA HARI 1:1'")
		expect(p.parse("I MGA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I MGA HARI 1:1'")
		expect(p.parse("UNANG HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'UNANG HARI 1:1'")
		expect(p.parse("UNA HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'UNA HARI 1:1'")
		expect(p.parse("1. HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1. HARI 1:1'")
		expect(p.parse("I. HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I. HARI 1:1'")
		expect(p.parse("1 HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 HARI 1:1'")
		expect(p.parse("I HARI 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'I HARI 1:1'")
		expect(p.parse("1 HA 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1 HA 1:1'")
		expect(p.parse("1KGS 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1KGS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Chr (tl)", function() {
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
    return it("should handle book: 2Chr (tl)", function() {
      
		expect(p.parse("Ikalawang Paralipomeno 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Paralipomeno 1:1'")
		expect(p.parse("Ikalawang Mga Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Mga Cronica 1:1'")
		expect(p.parse("Ikalawang Mga Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Mga Kronika 1:1'")
		expect(p.parse("Ikalawang Chronicle 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Chronicle 1:1'")
		expect(p.parse("Ikalawang Kronikel 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Kronikel 1:1'")
		expect(p.parse("Ikalawang Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Cronica 1:1'")
		expect(p.parse("Ikalawang Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Ikalawang Kronika 1:1'")
		expect(p.parse("II. Paralipomeno 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Paralipomeno 1:1'")
		expect(p.parse("2. Paralipomeno 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Paralipomeno 1:1'")
		expect(p.parse("II Paralipomeno 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Paralipomeno 1:1'")
		expect(p.parse("II. Mga Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Mga Cronica 1:1'")
		expect(p.parse("II. Mga Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Mga Kronika 1:1'")
		expect(p.parse("2 Paralipomeno 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Paralipomeno 1:1'")
		expect(p.parse("2. Mga Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Mga Cronica 1:1'")
		expect(p.parse("2. Mga Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Mga Kronika 1:1'")
		expect(p.parse("II Mga Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Mga Cronica 1:1'")
		expect(p.parse("II Mga Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Mga Kronika 1:1'")
		expect(p.parse("2 Mga Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Mga Cronica 1:1'")
		expect(p.parse("2 Mga Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Mga Kronika 1:1'")
		expect(p.parse("II. Chronicle 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Chronicle 1:1'")
		expect(p.parse("2. Chronicle 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Chronicle 1:1'")
		expect(p.parse("II Chronicle 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Chronicle 1:1'")
		expect(p.parse("II. Kronikel 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Kronikel 1:1'")
		expect(p.parse("2 Chronicle 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Chronicle 1:1'")
		expect(p.parse("2. Kronikel 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Kronikel 1:1'")
		expect(p.parse("II Kronikel 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Kronikel 1:1'")
		expect(p.parse("II. Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Cronica 1:1'")
		expect(p.parse("II. Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Kronika 1:1'")
		expect(p.parse("2 Kronikel 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Kronikel 1:1'")
		expect(p.parse("2. Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Cronica 1:1'")
		expect(p.parse("2. Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Kronika 1:1'")
		expect(p.parse("II Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Cronica 1:1'")
		expect(p.parse("II Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Kronika 1:1'")
		expect(p.parse("2 Cronica 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Cronica 1:1'")
		expect(p.parse("2 Kronika 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Kronika 1:1'")
		expect(p.parse("2 Cron 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Cron 1:1'")
		expect(p.parse("2 Cro 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Cro 1:1'")
		expect(p.parse("2Chr 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG PARALIPOMENO 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG PARALIPOMENO 1:1'")
		expect(p.parse("IKALAWANG MGA CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG MGA CRONICA 1:1'")
		expect(p.parse("IKALAWANG MGA KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG MGA KRONIKA 1:1'")
		expect(p.parse("IKALAWANG CHRONICLE 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG CHRONICLE 1:1'")
		expect(p.parse("IKALAWANG KRONIKEL 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG KRONIKEL 1:1'")
		expect(p.parse("IKALAWANG CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG CRONICA 1:1'")
		expect(p.parse("IKALAWANG KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'IKALAWANG KRONIKA 1:1'")
		expect(p.parse("II. PARALIPOMENO 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. PARALIPOMENO 1:1'")
		expect(p.parse("2. PARALIPOMENO 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. PARALIPOMENO 1:1'")
		expect(p.parse("II PARALIPOMENO 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II PARALIPOMENO 1:1'")
		expect(p.parse("II. MGA CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. MGA CRONICA 1:1'")
		expect(p.parse("II. MGA KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. MGA KRONIKA 1:1'")
		expect(p.parse("2 PARALIPOMENO 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 PARALIPOMENO 1:1'")
		expect(p.parse("2. MGA CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. MGA CRONICA 1:1'")
		expect(p.parse("2. MGA KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. MGA KRONIKA 1:1'")
		expect(p.parse("II MGA CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II MGA CRONICA 1:1'")
		expect(p.parse("II MGA KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II MGA KRONIKA 1:1'")
		expect(p.parse("2 MGA CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 MGA CRONICA 1:1'")
		expect(p.parse("2 MGA KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 MGA KRONIKA 1:1'")
		expect(p.parse("II. CHRONICLE 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. CHRONICLE 1:1'")
		expect(p.parse("2. CHRONICLE 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. CHRONICLE 1:1'")
		expect(p.parse("II CHRONICLE 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II CHRONICLE 1:1'")
		expect(p.parse("II. KRONIKEL 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. KRONIKEL 1:1'")
		expect(p.parse("2 CHRONICLE 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 CHRONICLE 1:1'")
		expect(p.parse("2. KRONIKEL 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. KRONIKEL 1:1'")
		expect(p.parse("II KRONIKEL 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II KRONIKEL 1:1'")
		expect(p.parse("II. CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. CRONICA 1:1'")
		expect(p.parse("II. KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. KRONIKA 1:1'")
		expect(p.parse("2 KRONIKEL 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 KRONIKEL 1:1'")
		expect(p.parse("2. CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. CRONICA 1:1'")
		expect(p.parse("2. KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. KRONIKA 1:1'")
		expect(p.parse("II CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II CRONICA 1:1'")
		expect(p.parse("II KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II KRONIKA 1:1'")
		expect(p.parse("2 CRONICA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 CRONICA 1:1'")
		expect(p.parse("2 KRONIKA 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 KRONIKA 1:1'")
		expect(p.parse("2 CRON 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 CRON 1:1'")
		expect(p.parse("2 CRO 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 CRO 1:1'")
		expect(p.parse("2CHR 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Chr (tl)", function() {
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
    return it("should handle book: 1Chr (tl)", function() {
      
		expect(p.parse("Unang Paralipomeno 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Paralipomeno 1:1'")
		expect(p.parse("Unang Mga Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Mga Cronica 1:1'")
		expect(p.parse("Unang Mga Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Mga Kronika 1:1'")
		expect(p.parse("Una Paralipomeno 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Paralipomeno 1:1'")
		expect(p.parse("1. Paralipomeno 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Paralipomeno 1:1'")
		expect(p.parse("I. Paralipomeno 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Paralipomeno 1:1'")
		expect(p.parse("Una Mga Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Mga Cronica 1:1'")
		expect(p.parse("Una Mga Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Mga Kronika 1:1'")
		expect(p.parse("Unang Chronicle 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Chronicle 1:1'")
		expect(p.parse("1 Paralipomeno 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Paralipomeno 1:1'")
		expect(p.parse("1. Mga Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Mga Cronica 1:1'")
		expect(p.parse("1. Mga Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Mga Kronika 1:1'")
		expect(p.parse("I Paralipomeno 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Paralipomeno 1:1'")
		expect(p.parse("I. Mga Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Mga Cronica 1:1'")
		expect(p.parse("I. Mga Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Mga Kronika 1:1'")
		expect(p.parse("Unang Kronikel 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Kronikel 1:1'")
		expect(p.parse("1 Mga Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Mga Cronica 1:1'")
		expect(p.parse("1 Mga Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Mga Kronika 1:1'")
		expect(p.parse("I Mga Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Mga Cronica 1:1'")
		expect(p.parse("I Mga Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Mga Kronika 1:1'")
		expect(p.parse("Una Chronicle 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Chronicle 1:1'")
		expect(p.parse("Unang Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Cronica 1:1'")
		expect(p.parse("Unang Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Unang Kronika 1:1'")
		expect(p.parse("1. Chronicle 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Chronicle 1:1'")
		expect(p.parse("I. Chronicle 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Chronicle 1:1'")
		expect(p.parse("Una Kronikel 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Kronikel 1:1'")
		expect(p.parse("1 Chronicle 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Chronicle 1:1'")
		expect(p.parse("1. Kronikel 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Kronikel 1:1'")
		expect(p.parse("I Chronicle 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Chronicle 1:1'")
		expect(p.parse("I. Kronikel 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Kronikel 1:1'")
		expect(p.parse("Una Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Cronica 1:1'")
		expect(p.parse("Una Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Una Kronika 1:1'")
		expect(p.parse("1 Kronikel 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Kronikel 1:1'")
		expect(p.parse("1. Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Cronica 1:1'")
		expect(p.parse("1. Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Kronika 1:1'")
		expect(p.parse("I Kronikel 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Kronikel 1:1'")
		expect(p.parse("I. Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Cronica 1:1'")
		expect(p.parse("I. Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Kronika 1:1'")
		expect(p.parse("1 Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Cronica 1:1'")
		expect(p.parse("1 Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Kronika 1:1'")
		expect(p.parse("I Cronica 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Cronica 1:1'")
		expect(p.parse("I Kronika 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Kronika 1:1'")
		expect(p.parse("1 Cron 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Cron 1:1'")
		expect(p.parse("1 Cro 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Cro 1:1'")
		expect(p.parse("1Chr 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UNANG PARALIPOMENO 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG PARALIPOMENO 1:1'")
		expect(p.parse("UNANG MGA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG MGA CRONICA 1:1'")
		expect(p.parse("UNANG MGA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG MGA KRONIKA 1:1'")
		expect(p.parse("UNA PARALIPOMENO 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA PARALIPOMENO 1:1'")
		expect(p.parse("1. PARALIPOMENO 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. PARALIPOMENO 1:1'")
		expect(p.parse("I. PARALIPOMENO 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. PARALIPOMENO 1:1'")
		expect(p.parse("UNA MGA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA MGA CRONICA 1:1'")
		expect(p.parse("UNA MGA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA MGA KRONIKA 1:1'")
		expect(p.parse("UNANG CHRONICLE 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG CHRONICLE 1:1'")
		expect(p.parse("1 PARALIPOMENO 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 PARALIPOMENO 1:1'")
		expect(p.parse("1. MGA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. MGA CRONICA 1:1'")
		expect(p.parse("1. MGA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. MGA KRONIKA 1:1'")
		expect(p.parse("I PARALIPOMENO 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I PARALIPOMENO 1:1'")
		expect(p.parse("I. MGA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. MGA CRONICA 1:1'")
		expect(p.parse("I. MGA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. MGA KRONIKA 1:1'")
		expect(p.parse("UNANG KRONIKEL 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG KRONIKEL 1:1'")
		expect(p.parse("1 MGA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 MGA CRONICA 1:1'")
		expect(p.parse("1 MGA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 MGA KRONIKA 1:1'")
		expect(p.parse("I MGA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I MGA CRONICA 1:1'")
		expect(p.parse("I MGA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I MGA KRONIKA 1:1'")
		expect(p.parse("UNA CHRONICLE 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA CHRONICLE 1:1'")
		expect(p.parse("UNANG CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG CRONICA 1:1'")
		expect(p.parse("UNANG KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNANG KRONIKA 1:1'")
		expect(p.parse("1. CHRONICLE 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. CHRONICLE 1:1'")
		expect(p.parse("I. CHRONICLE 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. CHRONICLE 1:1'")
		expect(p.parse("UNA KRONIKEL 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA KRONIKEL 1:1'")
		expect(p.parse("1 CHRONICLE 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 CHRONICLE 1:1'")
		expect(p.parse("1. KRONIKEL 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. KRONIKEL 1:1'")
		expect(p.parse("I CHRONICLE 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I CHRONICLE 1:1'")
		expect(p.parse("I. KRONIKEL 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. KRONIKEL 1:1'")
		expect(p.parse("UNA CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA CRONICA 1:1'")
		expect(p.parse("UNA KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'UNA KRONIKA 1:1'")
		expect(p.parse("1 KRONIKEL 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 KRONIKEL 1:1'")
		expect(p.parse("1. CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. CRONICA 1:1'")
		expect(p.parse("1. KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. KRONIKA 1:1'")
		expect(p.parse("I KRONIKEL 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I KRONIKEL 1:1'")
		expect(p.parse("I. CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. CRONICA 1:1'")
		expect(p.parse("I. KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. KRONIKA 1:1'")
		expect(p.parse("1 CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 CRONICA 1:1'")
		expect(p.parse("1 KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 KRONIKA 1:1'")
		expect(p.parse("I CRONICA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I CRONICA 1:1'")
		expect(p.parse("I KRONIKA 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I KRONIKA 1:1'")
		expect(p.parse("1 CRON 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 CRON 1:1'")
		expect(p.parse("1 CRO 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 CRO 1:1'")
		expect(p.parse("1CHR 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezra (tl)", function() {
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
    return it("should handle book: Ezra (tl)", function() {
      
		expect(p.parse("Esdras 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Esdras 1:1'")
		expect(p.parse("Ezra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezra 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ESDRAS 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ESDRAS 1:1'")
		expect(p.parse("EZRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZRA 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Neh (tl)", function() {
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
    return it("should handle book: Neh (tl)", function() {
      
		expect(p.parse("Nehemiah 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemiah 1:1'")
		expect(p.parse("Nehemias 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemias 1:1'")
		expect(p.parse("Nehemíah 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemíah 1:1'")
		expect(p.parse("Nehemías 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Nehemías 1:1'")
		expect(p.parse("Neh 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Neh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NEHEMIAH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMIAH 1:1'")
		expect(p.parse("NEHEMIAS 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMIAS 1:1'")
		expect(p.parse("NEHEMÍAH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMÍAH 1:1'")
		expect(p.parse("NEHEMÍAS 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEHEMÍAS 1:1'")
		expect(p.parse("NEH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book GkEsth (tl)", function() {
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
    return it("should handle book: GkEsth (tl)", function() {
      
		expect(p.parse("Ester (Griyego) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester (Griyego) 1:1'")
		expect(p.parse("Ester (Griego) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester (Griego) 1:1'")
		expect(p.parse("Ester (Gryego) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester (Gryego) 1:1'")
		expect(p.parse("Ester (Grego) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester (Grego) 1:1'")
		expect(p.parse("Ester Griyego 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester Griyego 1:1'")
		expect(p.parse("Ester Griego 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester Griego 1:1'")
		expect(p.parse("Ester Gryego 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester Gryego 1:1'")
		expect(p.parse("Ester Grego 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ester Grego 1:1'")
		expect(p.parse("GkEsth 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'GkEsth 1:1'")
		expect(p.parse("Estg 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Estg 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Esth (tl)", function() {
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
    return it("should handle book: Esth (tl)", function() {
      
		expect(p.parse("Esther 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esther 1:1'")
		expect(p.parse("Ester 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Ester 1:1'")
		expect(p.parse("Esth 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esth 1:1'")
		expect(p.parse("Est 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Est 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ESTHER 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTHER 1:1'")
		expect(p.parse("ESTER 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTER 1:1'")
		expect(p.parse("ESTH 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTH 1:1'")
		expect(p.parse("EST 1:1").osis()).toEqual("Esth.1.1", "parsing: 'EST 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Job (tl)", function() {
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
    return it("should handle book: Job (tl)", function() {
      
		expect(p.parse("Job 1:1").osis()).toEqual("Job.1.1", "parsing: 'Job 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JOB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book SgThree (tl)", function() {
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
    return it("should handle book: SgThree (tl)", function() {
      
		expect(p.parse("Awit ng Tatlong Banal na Kabataan 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Awit ng Tatlong Banal na Kabataan 1:1'")
		expect(p.parse("Awit ng Tatlong Kabataang Banal 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Awit ng Tatlong Kabataang Banal 1:1'")
		expect(p.parse("Awit ng Tatlong Kabataan 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Awit ng Tatlong Kabataan 1:1'")
		expect(p.parse("Awit ng Tatlong Binata 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Awit ng Tatlong Binata 1:1'")
		expect(p.parse("Awit ng 3 Kabataan 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Awit ng 3 Kabataan 1:1'")
		expect(p.parse("Tatlong Kabataan 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Tatlong Kabataan 1:1'")
		expect(p.parse("Aw ng 3 Kab 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Aw ng 3 Kab 1:1'")
		expect(p.parse("SgThree 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'SgThree 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Song (tl)", function() {
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
    return it("should handle book: Song (tl)", function() {
      
		expect(p.parse("Ang Awit ng mga Awit 1:1").osis()).toEqual("Song.1.1", "parsing: 'Ang Awit ng mga Awit 1:1'")
		expect(p.parse("Ang Awit ni Salomon 1:1").osis()).toEqual("Song.1.1", "parsing: 'Ang Awit ni Salomon 1:1'")
		expect(p.parse("Ang Awit ni Salomón 1:1").osis()).toEqual("Song.1.1", "parsing: 'Ang Awit ni Salomón 1:1'")
		expect(p.parse("Ang Awit ni Solomon 1:1").osis()).toEqual("Song.1.1", "parsing: 'Ang Awit ni Solomon 1:1'")
		expect(p.parse("Ang Awit ni Solomón 1:1").osis()).toEqual("Song.1.1", "parsing: 'Ang Awit ni Solomón 1:1'")
		expect(p.parse("Awit ng mga Awit 1:1").osis()).toEqual("Song.1.1", "parsing: 'Awit ng mga Awit 1:1'")
		expect(p.parse("Awit ni Salomon 1:1").osis()).toEqual("Song.1.1", "parsing: 'Awit ni Salomon 1:1'")
		expect(p.parse("Awit ni Salomón 1:1").osis()).toEqual("Song.1.1", "parsing: 'Awit ni Salomón 1:1'")
		expect(p.parse("Awit ni Solomon 1:1").osis()).toEqual("Song.1.1", "parsing: 'Awit ni Solomon 1:1'")
		expect(p.parse("Awit ni Solomón 1:1").osis()).toEqual("Song.1.1", "parsing: 'Awit ni Solomón 1:1'")
		expect(p.parse("Kantikulo 1:1").osis()).toEqual("Song.1.1", "parsing: 'Kantikulo 1:1'")
		expect(p.parse("A. ng A. 1:1").osis()).toEqual("Song.1.1", "parsing: 'A. ng A. 1:1'")
		expect(p.parse("A ng A. 1:1").osis()).toEqual("Song.1.1", "parsing: 'A ng A. 1:1'")
		expect(p.parse("A. ng A 1:1").osis()).toEqual("Song.1.1", "parsing: 'A. ng A 1:1'")
		expect(p.parse("Aw ni S 1:1").osis()).toEqual("Song.1.1", "parsing: 'Aw ni S 1:1'")
		expect(p.parse("Kantiko 1:1").osis()).toEqual("Song.1.1", "parsing: 'Kantiko 1:1'")
		expect(p.parse("A ng A 1:1").osis()).toEqual("Song.1.1", "parsing: 'A ng A 1:1'")
		expect(p.parse("Song 1:1").osis()).toEqual("Song.1.1", "parsing: 'Song 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ANG AWIT NG MGA AWIT 1:1").osis()).toEqual("Song.1.1", "parsing: 'ANG AWIT NG MGA AWIT 1:1'")
		expect(p.parse("ANG AWIT NI SALOMON 1:1").osis()).toEqual("Song.1.1", "parsing: 'ANG AWIT NI SALOMON 1:1'")
		expect(p.parse("ANG AWIT NI SALOMÓN 1:1").osis()).toEqual("Song.1.1", "parsing: 'ANG AWIT NI SALOMÓN 1:1'")
		expect(p.parse("ANG AWIT NI SOLOMON 1:1").osis()).toEqual("Song.1.1", "parsing: 'ANG AWIT NI SOLOMON 1:1'")
		expect(p.parse("ANG AWIT NI SOLOMÓN 1:1").osis()).toEqual("Song.1.1", "parsing: 'ANG AWIT NI SOLOMÓN 1:1'")
		expect(p.parse("AWIT NG MGA AWIT 1:1").osis()).toEqual("Song.1.1", "parsing: 'AWIT NG MGA AWIT 1:1'")
		expect(p.parse("AWIT NI SALOMON 1:1").osis()).toEqual("Song.1.1", "parsing: 'AWIT NI SALOMON 1:1'")
		expect(p.parse("AWIT NI SALOMÓN 1:1").osis()).toEqual("Song.1.1", "parsing: 'AWIT NI SALOMÓN 1:1'")
		expect(p.parse("AWIT NI SOLOMON 1:1").osis()).toEqual("Song.1.1", "parsing: 'AWIT NI SOLOMON 1:1'")
		expect(p.parse("AWIT NI SOLOMÓN 1:1").osis()).toEqual("Song.1.1", "parsing: 'AWIT NI SOLOMÓN 1:1'")
		expect(p.parse("KANTIKULO 1:1").osis()).toEqual("Song.1.1", "parsing: 'KANTIKULO 1:1'")
		expect(p.parse("A. NG A. 1:1").osis()).toEqual("Song.1.1", "parsing: 'A. NG A. 1:1'")
		expect(p.parse("A NG A. 1:1").osis()).toEqual("Song.1.1", "parsing: 'A NG A. 1:1'")
		expect(p.parse("A. NG A 1:1").osis()).toEqual("Song.1.1", "parsing: 'A. NG A 1:1'")
		expect(p.parse("AW NI S 1:1").osis()).toEqual("Song.1.1", "parsing: 'AW NI S 1:1'")
		expect(p.parse("KANTIKO 1:1").osis()).toEqual("Song.1.1", "parsing: 'KANTIKO 1:1'")
		expect(p.parse("A NG A 1:1").osis()).toEqual("Song.1.1", "parsing: 'A NG A 1:1'")
		expect(p.parse("SONG 1:1").osis()).toEqual("Song.1.1", "parsing: 'SONG 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ps (tl)", function() {
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
    return it("should handle book: Ps (tl)", function() {
      
		expect(p.parse("Mga Salmo 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Mga Salmo 1:1'")
		expect(p.parse("Mga Awit 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Mga Awit 1:1'")
		expect(p.parse("Awit 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Awit 1:1'")
		expect(p.parse("Ps 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Ps 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MGA SALMO 1:1").osis()).toEqual("Ps.1.1", "parsing: 'MGA SALMO 1:1'")
		expect(p.parse("MGA AWIT 1:1").osis()).toEqual("Ps.1.1", "parsing: 'MGA AWIT 1:1'")
		expect(p.parse("AWIT 1:1").osis()).toEqual("Ps.1.1", "parsing: 'AWIT 1:1'")
		expect(p.parse("PS 1:1").osis()).toEqual("Ps.1.1", "parsing: 'PS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Wis (tl)", function() {
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
    return it("should handle book: Wis (tl)", function() {
      
		expect(p.parse("Ang Karunungan ni Salomon 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Ang Karunungan ni Salomon 1:1'")
		expect(p.parse("Ang Karunungan ni Salomón 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Ang Karunungan ni Salomón 1:1'")
		expect(p.parse("Ang Karunungan ni Solomon 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Ang Karunungan ni Solomon 1:1'")
		expect(p.parse("Ang Karunungan ni Solomón 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Ang Karunungan ni Solomón 1:1'")
		expect(p.parse("Karunungan ni Salomon 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Karunungan ni Salomon 1:1'")
		expect(p.parse("Karunungan ni Salomón 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Karunungan ni Salomón 1:1'")
		expect(p.parse("Karunungan ni Solomon 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Karunungan ni Solomon 1:1'")
		expect(p.parse("Karunungan ni Solomón 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Karunungan ni Solomón 1:1'")
		expect(p.parse("Karunungan 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Karunungan 1:1'")
		expect(p.parse("Salomon 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Salomon 1:1'")
		expect(p.parse("Salomón 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Salomón 1:1'")
		expect(p.parse("Solomon 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Solomon 1:1'")
		expect(p.parse("Solomón 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Solomón 1:1'")
		expect(p.parse("Kar 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Kar 1:1'")
		expect(p.parse("Wis 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Wis 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrAzar (tl)", function() {
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
    return it("should handle book: PrAzar (tl)", function() {
      
		expect(p.parse("Ang Panalangin ni Azarias 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Ang Panalangin ni Azarias 1:1'")
		expect(p.parse("Panalangin ni Azarias 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Panalangin ni Azarias 1:1'")
		expect(p.parse("PrAzar 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'PrAzar 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Prov (tl)", function() {
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
    return it("should handle book: Prov (tl)", function() {
      
		expect(p.parse("Mga Kawikaan 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Mga Kawikaan 1:1'")
		expect(p.parse("Kawikaan 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Kawikaan 1:1'")
		expect(p.parse("Prov 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Prov 1:1'")
		expect(p.parse("Kaw 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Kaw 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MGA KAWIKAAN 1:1").osis()).toEqual("Prov.1.1", "parsing: 'MGA KAWIKAAN 1:1'")
		expect(p.parse("KAWIKAAN 1:1").osis()).toEqual("Prov.1.1", "parsing: 'KAWIKAAN 1:1'")
		expect(p.parse("PROV 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PROV 1:1'")
		expect(p.parse("KAW 1:1").osis()).toEqual("Prov.1.1", "parsing: 'KAW 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eccl (tl)", function() {
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
    return it("should handle book: Eccl (tl)", function() {
      
		expect(p.parse("Ang Mangangaral 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Ang Mangangaral 1:1'")
		expect(p.parse("Ecclesiastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Ecclesiastes 1:1'")
		expect(p.parse("Eclesiastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eclesiastes 1:1'")
		expect(p.parse("Eclesiastés 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eclesiastés 1:1'")
		expect(p.parse("Eclesyastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eclesyastes 1:1'")
		expect(p.parse("Eclesyastés 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eclesyastés 1:1'")
		expect(p.parse("Eclisiastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eclisiastes 1:1'")
		expect(p.parse("Eclisyastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eclisyastes 1:1'")
		expect(p.parse("Eklesiastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eklesiastes 1:1'")
		expect(p.parse("Eklesiastés 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eklesiastés 1:1'")
		expect(p.parse("Eklesyastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eklesyastes 1:1'")
		expect(p.parse("Eklesyastés 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eklesyastés 1:1'")
		expect(p.parse("Eklisiastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eklisiastes 1:1'")
		expect(p.parse("Eklisyastes 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eklisyastes 1:1'")
		expect(p.parse("Mangangaral 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Mangangaral 1:1'")
		expect(p.parse("Kohelet 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Kohelet 1:1'")
		expect(p.parse("Manga 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Manga 1:1'")
		expect(p.parse("Eccl 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eccl 1:1'")
		expect(p.parse("Ec 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Ec 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ANG MANGANGARAL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ANG MANGANGARAL 1:1'")
		expect(p.parse("ECCLESIASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCLESIASTES 1:1'")
		expect(p.parse("ECLESIASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECLESIASTES 1:1'")
		expect(p.parse("ECLESIASTÉS 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECLESIASTÉS 1:1'")
		expect(p.parse("ECLESYASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECLESYASTES 1:1'")
		expect(p.parse("ECLESYASTÉS 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECLESYASTÉS 1:1'")
		expect(p.parse("ECLISIASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECLISIASTES 1:1'")
		expect(p.parse("ECLISYASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECLISYASTES 1:1'")
		expect(p.parse("EKLESIASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EKLESIASTES 1:1'")
		expect(p.parse("EKLESIASTÉS 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EKLESIASTÉS 1:1'")
		expect(p.parse("EKLESYASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EKLESYASTES 1:1'")
		expect(p.parse("EKLESYASTÉS 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EKLESYASTÉS 1:1'")
		expect(p.parse("EKLISIASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EKLISIASTES 1:1'")
		expect(p.parse("EKLISYASTES 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EKLISYASTES 1:1'")
		expect(p.parse("MANGANGARAL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'MANGANGARAL 1:1'")
		expect(p.parse("KOHELET 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'KOHELET 1:1'")
		expect(p.parse("MANGA 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'MANGA 1:1'")
		expect(p.parse("ECCL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCL 1:1'")
		expect(p.parse("EC 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'EC 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jer (tl)", function() {
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
    return it("should handle book: Jer (tl)", function() {
      
		expect(p.parse("Aklat ni Jeremiah 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Aklat ni Jeremiah 1:1'")
		expect(p.parse("Aklat ni Jeremias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Aklat ni Jeremias 1:1'")
		expect(p.parse("Sulat ni Jeremias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Sulat ni Jeremias 1:1'")
		expect(p.parse("Heremias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Heremias 1:1'")
		expect(p.parse("Heremyas 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Heremyas 1:1'")
		expect(p.parse("Herimias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Herimias 1:1'")
		expect(p.parse("Herimyas 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Herimyas 1:1'")
		expect(p.parse("Hiremias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Hiremias 1:1'")
		expect(p.parse("Hiremyas 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Hiremyas 1:1'")
		expect(p.parse("Hirimias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Hirimias 1:1'")
		expect(p.parse("Hirimyas 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Hirimyas 1:1'")
		expect(p.parse("Jeremiah 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jeremiah 1:1'")
		expect(p.parse("Jeremias 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jeremias 1:1'")
		expect(p.parse("Jer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jer 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("AKLAT NI JEREMIAH 1:1").osis()).toEqual("Jer.1.1", "parsing: 'AKLAT NI JEREMIAH 1:1'")
		expect(p.parse("AKLAT NI JEREMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'AKLAT NI JEREMIAS 1:1'")
		expect(p.parse("SULAT NI JEREMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'SULAT NI JEREMIAS 1:1'")
		expect(p.parse("HEREMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HEREMIAS 1:1'")
		expect(p.parse("HEREMYAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HEREMYAS 1:1'")
		expect(p.parse("HERIMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HERIMIAS 1:1'")
		expect(p.parse("HERIMYAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HERIMYAS 1:1'")
		expect(p.parse("HIREMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HIREMIAS 1:1'")
		expect(p.parse("HIREMYAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HIREMYAS 1:1'")
		expect(p.parse("HIRIMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HIRIMIAS 1:1'")
		expect(p.parse("HIRIMYAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'HIRIMYAS 1:1'")
		expect(p.parse("JEREMIAH 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JEREMIAH 1:1'")
		expect(p.parse("JEREMIAS 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JEREMIAS 1:1'")
		expect(p.parse("JER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JER 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezek (tl)", function() {
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
    return it("should handle book: Ezek (tl)", function() {
      
		expect(p.parse("Ezequiel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezequiel 1:1'")
		expect(p.parse("Esekiel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Esekiel 1:1'")
		expect(p.parse("Esekyel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Esekyel 1:1'")
		expect(p.parse("Ezekiel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezekiel 1:1'")
		expect(p.parse("Ezekyel 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezekyel 1:1'")
		expect(p.parse("Ezek 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezek 1:1'")
		expect(p.parse("Eze 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Eze 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZEQUIEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEQUIEL 1:1'")
		expect(p.parse("ESEKIEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ESEKIEL 1:1'")
		expect(p.parse("ESEKYEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ESEKYEL 1:1'")
		expect(p.parse("EZEKIEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEKIEL 1:1'")
		expect(p.parse("EZEKYEL 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEKYEL 1:1'")
		expect(p.parse("EZEK 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEK 1:1'")
		expect(p.parse("EZE 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZE 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Dan (tl)", function() {
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
    return it("should handle book: Dan (tl)", function() {
      
		expect(p.parse("Daniel 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Daniel 1:1'")
		expect(p.parse("Dan 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dan 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("DANIEL 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DANIEL 1:1'")
		expect(p.parse("DAN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DAN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hos (tl)", function() {
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
    return it("should handle book: Hos (tl)", function() {
      
		expect(p.parse("Hoseias 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hoseias 1:1'")
		expect(p.parse("Hoseas 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hoseas 1:1'")
		expect(p.parse("Hoseia 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hoseia 1:1'")
		expect(p.parse("Oseiah 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Oseiah 1:1'")
		expect(p.parse("Oseias 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Oseias 1:1'")
		expect(p.parse("Hosea 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hosea 1:1'")
		expect(p.parse("Oseah 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Oseah 1:1'")
		expect(p.parse("Oseas 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Oseas 1:1'")
		expect(p.parse("Oseia 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Oseia 1:1'")
		expect(p.parse("Osea 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Osea 1:1'")
		expect(p.parse("Hos 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hos 1:1'")
		expect(p.parse("Os 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Os 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HOSEIAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEIAS 1:1'")
		expect(p.parse("HOSEAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEAS 1:1'")
		expect(p.parse("HOSEIA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEIA 1:1'")
		expect(p.parse("OSEIAH 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OSEIAH 1:1'")
		expect(p.parse("OSEIAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OSEIAS 1:1'")
		expect(p.parse("HOSEA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOSEA 1:1'")
		expect(p.parse("OSEAH 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OSEAH 1:1'")
		expect(p.parse("OSEAS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OSEAS 1:1'")
		expect(p.parse("OSEIA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OSEIA 1:1'")
		expect(p.parse("OSEA 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OSEA 1:1'")
		expect(p.parse("HOS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOS 1:1'")
		expect(p.parse("OS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'OS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Joel (tl)", function() {
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
    return it("should handle book: Joel (tl)", function() {
      
		expect(p.parse("Joel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joel 1:1'")
		expect(p.parse("Yole 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Yole 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JOEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOEL 1:1'")
		expect(p.parse("YOLE 1:1").osis()).toEqual("Joel.1.1", "parsing: 'YOLE 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Amos (tl)", function() {
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
    return it("should handle book: Amos (tl)", function() {
      
		expect(p.parse("Amos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amos 1:1'")
		expect(p.parse("Amós 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amós 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("AMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOS 1:1'")
		expect(p.parse("AMÓS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMÓS 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Obad (tl)", function() {
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
    return it("should handle book: Obad (tl)", function() {
      
		expect(p.parse("Obadiah 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obadiah 1:1'")
		expect(p.parse("Obadias 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obadias 1:1'")
		expect(p.parse("Abdias 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Abdias 1:1'")
		expect(p.parse("Abdías 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Abdías 1:1'")
		expect(p.parse("Obad 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obad 1:1'")
		expect(p.parse("Oba 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Oba 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("OBADIAH 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBADIAH 1:1'")
		expect(p.parse("OBADIAS 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBADIAS 1:1'")
		expect(p.parse("ABDIAS 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ABDIAS 1:1'")
		expect(p.parse("ABDÍAS 1:1").osis()).toEqual("Obad.1.1", "parsing: 'ABDÍAS 1:1'")
		expect(p.parse("OBAD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBAD 1:1'")
		expect(p.parse("OBA 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBA 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jonah (tl)", function() {
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
    return it("should handle book: Jonah (tl)", function() {
      
		expect(p.parse("Jonah 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonah 1:1'")
		expect(p.parse("Jonas 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonas 1:1'")
		expect(p.parse("Jonáh 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonáh 1:1'")
		expect(p.parse("Jonás 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonás 1:1'")
		expect(p.parse("Jona 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jona 1:1'")
		expect(p.parse("Joná 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Joná 1:1'")
		expect(p.parse("Jon 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jon 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("JONAH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAH 1:1'")
		expect(p.parse("JONAS 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAS 1:1'")
		expect(p.parse("JONÁH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONÁH 1:1'")
		expect(p.parse("JONÁS 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONÁS 1:1'")
		expect(p.parse("JONA 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONA 1:1'")
		expect(p.parse("JONÁ 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONÁ 1:1'")
		expect(p.parse("JON 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JON 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mic (tl)", function() {
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
    return it("should handle book: Mic (tl)", function() {
      
		expect(p.parse("Mikeyas 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikeyas 1:1'")
		expect(p.parse("Mikieas 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikieas 1:1'")
		expect(p.parse("Miqueas 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Miqueas 1:1'")
		expect(p.parse("Mikeas 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikeas 1:1'")
		expect(p.parse("Micah 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Micah 1:1'")
		expect(p.parse("Mikah 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikah 1:1'")
		expect(p.parse("Mikas 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mikas 1:1'")
		expect(p.parse("Mica 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mica 1:1'")
		expect(p.parse("Mika 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mika 1:1'")
		expect(p.parse("Mic 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mic 1:1'")
		expect(p.parse("Mik 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mik 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MIKEYAS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKEYAS 1:1'")
		expect(p.parse("MIKIEAS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKIEAS 1:1'")
		expect(p.parse("MIQUEAS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIQUEAS 1:1'")
		expect(p.parse("MIKEAS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKEAS 1:1'")
		expect(p.parse("MICAH 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MICAH 1:1'")
		expect(p.parse("MIKAH 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKAH 1:1'")
		expect(p.parse("MIKAS 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKAS 1:1'")
		expect(p.parse("MICA 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MICA 1:1'")
		expect(p.parse("MIKA 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIKA 1:1'")
		expect(p.parse("MIC 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIC 1:1'")
		expect(p.parse("MIK 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIK 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Nah (tl)", function() {
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
    return it("should handle book: Nah (tl)", function() {
      
		expect(p.parse("Nahum 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nahum 1:1'")
		expect(p.parse("Nahúm 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nahúm 1:1'")
		expect(p.parse("Nah 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nah 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("NAHUM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAHUM 1:1'")
		expect(p.parse("NAHÚM 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAHÚM 1:1'")
		expect(p.parse("NAH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hab (tl)", function() {
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
    return it("should handle book: Hab (tl)", function() {
      
		expect(p.parse("Habakkuk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Habakkuk 1:1'")
		expect(p.parse("Habacuc 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Habacuc 1:1'")
		expect(p.parse("Habakuk 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Habakuk 1:1'")
		expect(p.parse("Hab 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Hab 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HABAKKUK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HABAKKUK 1:1'")
		expect(p.parse("HABACUC 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HABACUC 1:1'")
		expect(p.parse("HABAKUK 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HABAKUK 1:1'")
		expect(p.parse("HAB 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HAB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zeph (tl)", function() {
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
    return it("should handle book: Zeph (tl)", function() {
      
		expect(p.parse("Zephaniah 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zephaniah 1:1'")
		expect(p.parse("Zephanias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zephanias 1:1'")
		expect(p.parse("Sefanias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sefanias 1:1'")
		expect(p.parse("Sepanias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sepanias 1:1'")
		expect(p.parse("Sofonias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sofonias 1:1'")
		expect(p.parse("Sofonías 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sofonías 1:1'")
		expect(p.parse("Zefanias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zefanias 1:1'")
		expect(p.parse("Zepanias 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zepanias 1:1'")
		expect(p.parse("Sefania 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sefania 1:1'")
		expect(p.parse("Sepania 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Sepania 1:1'")
		expect(p.parse("Zeph 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zeph 1:1'")
		expect(p.parse("Zef 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zef 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZEPHANIAH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPHANIAH 1:1'")
		expect(p.parse("ZEPHANIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPHANIAS 1:1'")
		expect(p.parse("SEFANIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SEFANIAS 1:1'")
		expect(p.parse("SEPANIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SEPANIAS 1:1'")
		expect(p.parse("SOFONIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SOFONIAS 1:1'")
		expect(p.parse("SOFONÍAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SOFONÍAS 1:1'")
		expect(p.parse("ZEFANIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEFANIAS 1:1'")
		expect(p.parse("ZEPANIAS 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPANIAS 1:1'")
		expect(p.parse("SEFANIA 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SEFANIA 1:1'")
		expect(p.parse("SEPANIA 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'SEPANIA 1:1'")
		expect(p.parse("ZEPH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPH 1:1'")
		expect(p.parse("ZEF 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEF 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hag (tl)", function() {
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
    return it("should handle book: Hag (tl)", function() {
      
		expect(p.parse("Haggai 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Haggai 1:1'")
		expect(p.parse("Haggeo 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Haggeo 1:1'")
		expect(p.parse("Aggeo 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Aggeo 1:1'")
		expect(p.parse("Hagai 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hagai 1:1'")
		expect(p.parse("Hageo 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hageo 1:1'")
		expect(p.parse("Agai 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Agai 1:1'")
		expect(p.parse("Ageo 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Ageo 1:1'")
		expect(p.parse("Hag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hag 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HAGGAI 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGGAI 1:1'")
		expect(p.parse("HAGGEO 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGGEO 1:1'")
		expect(p.parse("AGGEO 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AGGEO 1:1'")
		expect(p.parse("HAGAI 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGAI 1:1'")
		expect(p.parse("HAGEO 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAGEO 1:1'")
		expect(p.parse("AGAI 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AGAI 1:1'")
		expect(p.parse("AGEO 1:1").osis()).toEqual("Hag.1.1", "parsing: 'AGEO 1:1'")
		expect(p.parse("HAG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAG 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zech (tl)", function() {
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
    return it("should handle book: Zech (tl)", function() {
      
		expect(p.parse("Zechariah 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zechariah 1:1'")
		expect(p.parse("Sacarias 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Sacarias 1:1'")
		expect(p.parse("Sacarías 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Sacarías 1:1'")
		expect(p.parse("Zacarias 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zacarias 1:1'")
		expect(p.parse("Zacarías 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zacarías 1:1'")
		expect(p.parse("Zech 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zech 1:1'")
		expect(p.parse("Zac 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zac 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ZECHARIAH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECHARIAH 1:1'")
		expect(p.parse("SACARIAS 1:1").osis()).toEqual("Zech.1.1", "parsing: 'SACARIAS 1:1'")
		expect(p.parse("SACARÍAS 1:1").osis()).toEqual("Zech.1.1", "parsing: 'SACARÍAS 1:1'")
		expect(p.parse("ZACARIAS 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZACARIAS 1:1'")
		expect(p.parse("ZACARÍAS 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZACARÍAS 1:1'")
		expect(p.parse("ZECH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECH 1:1'")
		expect(p.parse("ZAC 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZAC 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mal (tl)", function() {
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
    return it("should handle book: Mal (tl)", function() {
      
		expect(p.parse("Malaquias 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malaquias 1:1'")
		expect(p.parse("Malaquías 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malaquías 1:1'")
		expect(p.parse("Malakias 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malakias 1:1'")
		expect(p.parse("Malachi 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Malachi 1:1'")
		expect(p.parse("Mal 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Mal 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MALAQUIAS 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALAQUIAS 1:1'")
		expect(p.parse("MALAQUÍAS 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALAQUÍAS 1:1'")
		expect(p.parse("MALAKIAS 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALAKIAS 1:1'")
		expect(p.parse("MALACHI 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MALACHI 1:1'")
		expect(p.parse("MAL 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MAL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Matt (tl)", function() {
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
    return it("should handle book: Matt (tl)", function() {
      
		expect(p.parse("Mabuting Balita ayon kay San Mateo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mabuting Balita ayon kay San Mateo 1:1'")
		expect(p.parse("Mabuting Balita ayon kay Mateo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mabuting Balita ayon kay Mateo 1:1'")
		expect(p.parse("Ebanghelyo ayon kay Mateo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Ebanghelyo ayon kay Mateo 1:1'")
		expect(p.parse("Ebanghelyo ni San Mateo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Ebanghelyo ni San Mateo 1:1'")
		expect(p.parse("Ebanghelyo ni Mateo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Ebanghelyo ni Mateo 1:1'")
		expect(p.parse("Mateo 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mateo 1:1'")
		expect(p.parse("Matt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matt 1:1'")
		expect(p.parse("Mat 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mat 1:1'")
		expect(p.parse("Mt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Mt 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MABUTING BALITA AYON KAY SAN MATEO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MABUTING BALITA AYON KAY SAN MATEO 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY MATEO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MABUTING BALITA AYON KAY MATEO 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY MATEO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'EBANGHELYO AYON KAY MATEO 1:1'")
		expect(p.parse("EBANGHELYO NI SAN MATEO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'EBANGHELYO NI SAN MATEO 1:1'")
		expect(p.parse("EBANGHELYO NI MATEO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'EBANGHELYO NI MATEO 1:1'")
		expect(p.parse("MATEO 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATEO 1:1'")
		expect(p.parse("MATT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATT 1:1'")
		expect(p.parse("MAT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MAT 1:1'")
		expect(p.parse("MT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mark (tl)", function() {
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
    return it("should handle book: Mark (tl)", function() {
      
		expect(p.parse("Mabuting Balita ayon kay San Marcos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mabuting Balita ayon kay San Marcos 1:1'")
		expect(p.parse("Mabuting Balita ayon kay San Markos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mabuting Balita ayon kay San Markos 1:1'")
		expect(p.parse("Mabuting Balita ayon kay Marcos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mabuting Balita ayon kay Marcos 1:1'")
		expect(p.parse("Mabuting Balita ayon kay Markos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mabuting Balita ayon kay Markos 1:1'")
		expect(p.parse("Ebanghelyo ayon kay Marcos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Ebanghelyo ayon kay Marcos 1:1'")
		expect(p.parse("Ebanghelyo ni San Marcos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Ebanghelyo ni San Marcos 1:1'")
		expect(p.parse("Ebanghelyo ni San Markos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Ebanghelyo ni San Markos 1:1'")
		expect(p.parse("Ebanghelyo ni Marcos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Ebanghelyo ni Marcos 1:1'")
		expect(p.parse("Ebanghelyo ni Markos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Ebanghelyo ni Markos 1:1'")
		expect(p.parse("Marcos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Marcos 1:1'")
		expect(p.parse("Markos 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Markos 1:1'")
		expect(p.parse("Mark 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mark 1:1'")
		expect(p.parse("Mar 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mar 1:1'")
		expect(p.parse("Mc 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mc 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MABUTING BALITA AYON KAY SAN MARCOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MABUTING BALITA AYON KAY SAN MARCOS 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY SAN MARKOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MABUTING BALITA AYON KAY SAN MARKOS 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY MARCOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MABUTING BALITA AYON KAY MARCOS 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY MARKOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MABUTING BALITA AYON KAY MARKOS 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY MARCOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'EBANGHELYO AYON KAY MARCOS 1:1'")
		expect(p.parse("EBANGHELYO NI SAN MARCOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'EBANGHELYO NI SAN MARCOS 1:1'")
		expect(p.parse("EBANGHELYO NI SAN MARKOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'EBANGHELYO NI SAN MARKOS 1:1'")
		expect(p.parse("EBANGHELYO NI MARCOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'EBANGHELYO NI MARCOS 1:1'")
		expect(p.parse("EBANGHELYO NI MARKOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'EBANGHELYO NI MARKOS 1:1'")
		expect(p.parse("MARCOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARCOS 1:1'")
		expect(p.parse("MARKOS 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARKOS 1:1'")
		expect(p.parse("MARK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARK 1:1'")
		expect(p.parse("MAR 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MAR 1:1'")
		expect(p.parse("MC 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MC 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Luke (tl)", function() {
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
    return it("should handle book: Luke (tl)", function() {
      
		expect(p.parse("Mabuting Balita ayon kay San Lucas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Mabuting Balita ayon kay San Lucas 1:1'")
		expect(p.parse("Mabuting Balita ayon kay San Lukas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Mabuting Balita ayon kay San Lukas 1:1'")
		expect(p.parse("Mabuting Balita ayon kay Lucas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Mabuting Balita ayon kay Lucas 1:1'")
		expect(p.parse("Mabuting Balita ayon kay Lukas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Mabuting Balita ayon kay Lukas 1:1'")
		expect(p.parse("Ebanghelyo ayon kay San Lucas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Ebanghelyo ayon kay San Lucas 1:1'")
		expect(p.parse("Ebanghelyo ayon kay San Lukas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Ebanghelyo ayon kay San Lukas 1:1'")
		expect(p.parse("Ebanghelyo ayon kay Lucas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Ebanghelyo ayon kay Lucas 1:1'")
		expect(p.parse("Ebanghelyo ayon kay Lukas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Ebanghelyo ayon kay Lukas 1:1'")
		expect(p.parse("Ebanghelyo ni San Lucas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Ebanghelyo ni San Lucas 1:1'")
		expect(p.parse("Ebanghelyo ni San Lukas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Ebanghelyo ni San Lukas 1:1'")
		expect(p.parse("Lucas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lucas 1:1'")
		expect(p.parse("Lukas 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lukas 1:1'")
		expect(p.parse("Luke 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luke 1:1'")
		expect(p.parse("Luc 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luc 1:1'")
		expect(p.parse("Lu 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Lu 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MABUTING BALITA AYON KAY SAN LUCAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'MABUTING BALITA AYON KAY SAN LUCAS 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY SAN LUKAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'MABUTING BALITA AYON KAY SAN LUKAS 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY LUCAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'MABUTING BALITA AYON KAY LUCAS 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY LUKAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'MABUTING BALITA AYON KAY LUKAS 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY SAN LUCAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'EBANGHELYO AYON KAY SAN LUCAS 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY SAN LUKAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'EBANGHELYO AYON KAY SAN LUKAS 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY LUCAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'EBANGHELYO AYON KAY LUCAS 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY LUKAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'EBANGHELYO AYON KAY LUKAS 1:1'")
		expect(p.parse("EBANGHELYO NI SAN LUCAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'EBANGHELYO NI SAN LUCAS 1:1'")
		expect(p.parse("EBANGHELYO NI SAN LUKAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'EBANGHELYO NI SAN LUKAS 1:1'")
		expect(p.parse("LUCAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUCAS 1:1'")
		expect(p.parse("LUKAS 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKAS 1:1'")
		expect(p.parse("LUKE 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKE 1:1'")
		expect(p.parse("LUC 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUC 1:1'")
		expect(p.parse("LU 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LU 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1John (tl)", function() {
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
    return it("should handle book: 1John (tl)", function() {
      
		expect(p.parse("Unang Juan 1:1").osis()).toEqual("1John.1.1", "parsing: 'Unang Juan 1:1'")
		expect(p.parse("Una Juan 1:1").osis()).toEqual("1John.1.1", "parsing: 'Una Juan 1:1'")
		expect(p.parse("1. Juan 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Juan 1:1'")
		expect(p.parse("I. Juan 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Juan 1:1'")
		expect(p.parse("1 Juan 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Juan 1:1'")
		expect(p.parse("I Juan 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Juan 1:1'")
		expect(p.parse("1John 1:1").osis()).toEqual("1John.1.1", "parsing: '1John 1:1'")
		expect(p.parse("1 Jn 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UNANG JUAN 1:1").osis()).toEqual("1John.1.1", "parsing: 'UNANG JUAN 1:1'")
		expect(p.parse("UNA JUAN 1:1").osis()).toEqual("1John.1.1", "parsing: 'UNA JUAN 1:1'")
		expect(p.parse("1. JUAN 1:1").osis()).toEqual("1John.1.1", "parsing: '1. JUAN 1:1'")
		expect(p.parse("I. JUAN 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. JUAN 1:1'")
		expect(p.parse("1 JUAN 1:1").osis()).toEqual("1John.1.1", "parsing: '1 JUAN 1:1'")
		expect(p.parse("I JUAN 1:1").osis()).toEqual("1John.1.1", "parsing: 'I JUAN 1:1'")
		expect(p.parse("1JOHN 1:1").osis()).toEqual("1John.1.1", "parsing: '1JOHN 1:1'")
		expect(p.parse("1 JN 1:1").osis()).toEqual("1John.1.1", "parsing: '1 JN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2John (tl)", function() {
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
    return it("should handle book: 2John (tl)", function() {
      
		expect(p.parse("Ikalawang Juan 1:1").osis()).toEqual("2John.1.1", "parsing: 'Ikalawang Juan 1:1'")
		expect(p.parse("II. Juan 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Juan 1:1'")
		expect(p.parse("2. Juan 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Juan 1:1'")
		expect(p.parse("II Juan 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Juan 1:1'")
		expect(p.parse("2 Juan 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Juan 1:1'")
		expect(p.parse("2John 1:1").osis()).toEqual("2John.1.1", "parsing: '2John 1:1'")
		expect(p.parse("2 Jn 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG JUAN 1:1").osis()).toEqual("2John.1.1", "parsing: 'IKALAWANG JUAN 1:1'")
		expect(p.parse("II. JUAN 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. JUAN 1:1'")
		expect(p.parse("2. JUAN 1:1").osis()).toEqual("2John.1.1", "parsing: '2. JUAN 1:1'")
		expect(p.parse("II JUAN 1:1").osis()).toEqual("2John.1.1", "parsing: 'II JUAN 1:1'")
		expect(p.parse("2 JUAN 1:1").osis()).toEqual("2John.1.1", "parsing: '2 JUAN 1:1'")
		expect(p.parse("2JOHN 1:1").osis()).toEqual("2John.1.1", "parsing: '2JOHN 1:1'")
		expect(p.parse("2 JN 1:1").osis()).toEqual("2John.1.1", "parsing: '2 JN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3John (tl)", function() {
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
    return it("should handle book: 3John (tl)", function() {
      
		expect(p.parse("Ikatlong Juan 1:1").osis()).toEqual("3John.1.1", "parsing: 'Ikatlong Juan 1:1'")
		expect(p.parse("III. Juan 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Juan 1:1'")
		expect(p.parse("III Juan 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Juan 1:1'")
		expect(p.parse("3. Juan 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Juan 1:1'")
		expect(p.parse("3 Juan 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Juan 1:1'")
		expect(p.parse("3John 1:1").osis()).toEqual("3John.1.1", "parsing: '3John 1:1'")
		expect(p.parse("3 Jn 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKATLONG JUAN 1:1").osis()).toEqual("3John.1.1", "parsing: 'IKATLONG JUAN 1:1'")
		expect(p.parse("III. JUAN 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. JUAN 1:1'")
		expect(p.parse("III JUAN 1:1").osis()).toEqual("3John.1.1", "parsing: 'III JUAN 1:1'")
		expect(p.parse("3. JUAN 1:1").osis()).toEqual("3John.1.1", "parsing: '3. JUAN 1:1'")
		expect(p.parse("3 JUAN 1:1").osis()).toEqual("3John.1.1", "parsing: '3 JUAN 1:1'")
		expect(p.parse("3JOHN 1:1").osis()).toEqual("3John.1.1", "parsing: '3JOHN 1:1'")
		expect(p.parse("3 JN 1:1").osis()).toEqual("3John.1.1", "parsing: '3 JN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book John (tl)", function() {
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
    return it("should handle book: John (tl)", function() {
      
		expect(p.parse("Mabuting Balita ayon kay San Juan 1:1").osis()).toEqual("John.1.1", "parsing: 'Mabuting Balita ayon kay San Juan 1:1'")
		expect(p.parse("Mabuting Balita ayon kay Juan 1:1").osis()).toEqual("John.1.1", "parsing: 'Mabuting Balita ayon kay Juan 1:1'")
		expect(p.parse("Ebanghelyo ayon kay San Juan 1:1").osis()).toEqual("John.1.1", "parsing: 'Ebanghelyo ayon kay San Juan 1:1'")
		expect(p.parse("Ebanghelyo ayon kay Juan 1:1").osis()).toEqual("John.1.1", "parsing: 'Ebanghelyo ayon kay Juan 1:1'")
		expect(p.parse("Ebanghelyo ni San Juan 1:1").osis()).toEqual("John.1.1", "parsing: 'Ebanghelyo ni San Juan 1:1'")
		expect(p.parse("John 1:1").osis()).toEqual("John.1.1", "parsing: 'John 1:1'")
		expect(p.parse("Juan 1:1").osis()).toEqual("John.1.1", "parsing: 'Juan 1:1'")
		expect(p.parse("Jn 1:1").osis()).toEqual("John.1.1", "parsing: 'Jn 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MABUTING BALITA AYON KAY SAN JUAN 1:1").osis()).toEqual("John.1.1", "parsing: 'MABUTING BALITA AYON KAY SAN JUAN 1:1'")
		expect(p.parse("MABUTING BALITA AYON KAY JUAN 1:1").osis()).toEqual("John.1.1", "parsing: 'MABUTING BALITA AYON KAY JUAN 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY SAN JUAN 1:1").osis()).toEqual("John.1.1", "parsing: 'EBANGHELYO AYON KAY SAN JUAN 1:1'")
		expect(p.parse("EBANGHELYO AYON KAY JUAN 1:1").osis()).toEqual("John.1.1", "parsing: 'EBANGHELYO AYON KAY JUAN 1:1'")
		expect(p.parse("EBANGHELYO NI SAN JUAN 1:1").osis()).toEqual("John.1.1", "parsing: 'EBANGHELYO NI SAN JUAN 1:1'")
		expect(p.parse("JOHN 1:1").osis()).toEqual("John.1.1", "parsing: 'JOHN 1:1'")
		expect(p.parse("JUAN 1:1").osis()).toEqual("John.1.1", "parsing: 'JUAN 1:1'")
		expect(p.parse("JN 1:1").osis()).toEqual("John.1.1", "parsing: 'JN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Acts (tl)", function() {
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
    return it("should handle book: Acts (tl)", function() {
      
		expect(p.parse("Mabuting Balita ayon sa Espiritu Santo 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mabuting Balita ayon sa Espiritu Santo 1:1'")
		expect(p.parse("Mabuting Balita ng Espiritu Santo 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mabuting Balita ng Espiritu Santo 1:1'")
		expect(p.parse("Ebanghelyo ng Espiritu Santo 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Ebanghelyo ng Espiritu Santo 1:1'")
		expect(p.parse("Mga Gawa ng mga Apostoles 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mga Gawa ng mga Apostoles 1:1'")
		expect(p.parse("Mga Gawa ng mga Apostol 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mga Gawa ng mga Apostol 1:1'")
		expect(p.parse("Mga Gawa ng mga Alagad 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mga Gawa ng mga Alagad 1:1'")
		expect(p.parse("Gawa ng mga Apostol 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Gawa ng mga Apostol 1:1'")
		expect(p.parse("Gawa ng Apostoles 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Gawa ng Apostoles 1:1'")
		expect(p.parse("Mga Gawain 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mga Gawain 1:1'")
		expect(p.parse("Mga Gawa 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Mga Gawa 1:1'")
		expect(p.parse("Acts 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Acts 1:1'")
		expect(p.parse("Gawa 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Gawa 1:1'")
		expect(p.parse("Gw 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Gw 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MABUTING BALITA AYON SA ESPIRITU SANTO 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MABUTING BALITA AYON SA ESPIRITU SANTO 1:1'")
		expect(p.parse("MABUTING BALITA NG ESPIRITU SANTO 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MABUTING BALITA NG ESPIRITU SANTO 1:1'")
		expect(p.parse("EBANGHELYO NG ESPIRITU SANTO 1:1").osis()).toEqual("Acts.1.1", "parsing: 'EBANGHELYO NG ESPIRITU SANTO 1:1'")
		expect(p.parse("MGA GAWA NG MGA APOSTOLES 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MGA GAWA NG MGA APOSTOLES 1:1'")
		expect(p.parse("MGA GAWA NG MGA APOSTOL 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MGA GAWA NG MGA APOSTOL 1:1'")
		expect(p.parse("MGA GAWA NG MGA ALAGAD 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MGA GAWA NG MGA ALAGAD 1:1'")
		expect(p.parse("GAWA NG MGA APOSTOL 1:1").osis()).toEqual("Acts.1.1", "parsing: 'GAWA NG MGA APOSTOL 1:1'")
		expect(p.parse("GAWA NG APOSTOLES 1:1").osis()).toEqual("Acts.1.1", "parsing: 'GAWA NG APOSTOLES 1:1'")
		expect(p.parse("MGA GAWAIN 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MGA GAWAIN 1:1'")
		expect(p.parse("MGA GAWA 1:1").osis()).toEqual("Acts.1.1", "parsing: 'MGA GAWA 1:1'")
		expect(p.parse("ACTS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ACTS 1:1'")
		expect(p.parse("GAWA 1:1").osis()).toEqual("Acts.1.1", "parsing: 'GAWA 1:1'")
		expect(p.parse("GW 1:1").osis()).toEqual("Acts.1.1", "parsing: 'GW 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rom (tl)", function() {
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
    return it("should handle book: Rom (tl)", function() {
      
		expect(p.parse("Sulat sa mga Romano 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Sulat sa mga Romano 1:1'")
		expect(p.parse("Mga Taga- Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Mga Taga- Roma 1:1'")
		expect(p.parse("Mga Taga Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Mga Taga Roma 1:1'")
		expect(p.parse("Mga Taga-Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Mga Taga-Roma 1:1'")
		expect(p.parse("Taga- Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Taga- Roma 1:1'")
		expect(p.parse("Taga Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Taga Roma 1:1'")
		expect(p.parse("Roma 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Roma 1:1'")
		expect(p.parse("Rom 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rom 1:1'")
		expect(p.parse("Ro 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Ro 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SULAT SA MGA ROMANO 1:1").osis()).toEqual("Rom.1.1", "parsing: 'SULAT SA MGA ROMANO 1:1'")
		expect(p.parse("MGA TAGA- ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'MGA TAGA- ROMA 1:1'")
		expect(p.parse("MGA TAGA ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'MGA TAGA ROMA 1:1'")
		expect(p.parse("MGA TAGA-ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'MGA TAGA-ROMA 1:1'")
		expect(p.parse("TAGA- ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'TAGA- ROMA 1:1'")
		expect(p.parse("TAGA ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'TAGA ROMA 1:1'")
		expect(p.parse("ROMA 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROMA 1:1'")
		expect(p.parse("ROM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROM 1:1'")
		expect(p.parse("RO 1:1").osis()).toEqual("Rom.1.1", "parsing: 'RO 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Cor (tl)", function() {
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
    return it("should handle book: 2Cor (tl)", function() {
      
		expect(p.parse("Ika- 2 Sulat sa mga Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ika- 2 Sulat sa mga Corintio 1:1'")
		expect(p.parse("SECOND Sulat sa mga Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'SECOND Sulat sa mga Corintio 1:1'")
		expect(p.parse("Ika 2 Sulat sa mga Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ika 2 Sulat sa mga Corintio 1:1'")
		expect(p.parse("Ika- 2 Sulat sa mga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ika- 2 Sulat sa mga Corinto 1:1'")
		expect(p.parse("Ikalawang Mga Taga- Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ikalawang Mga Taga- Corinto 1:1'")
		expect(p.parse("SECOND Sulat sa mga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'SECOND Sulat sa mga Corinto 1:1'")
		expect(p.parse("Ika 2 Sulat sa mga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ika 2 Sulat sa mga Corinto 1:1'")
		expect(p.parse("Ikalawang Mga Taga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ikalawang Mga Taga Corinto 1:1'")
		expect(p.parse("II. Mga Taga- Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Mga Taga- Corinto 1:1'")
		expect(p.parse("2. Mga Taga- Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Mga Taga- Corinto 1:1'")
		expect(p.parse("II Mga Taga- Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Mga Taga- Corinto 1:1'")
		expect(p.parse("II. Mga Taga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Mga Taga Corinto 1:1'")
		expect(p.parse("2 Mga Taga- Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Mga Taga- Corinto 1:1'")
		expect(p.parse("2. Mga Taga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Mga Taga Corinto 1:1'")
		expect(p.parse("II Mga Taga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Mga Taga Corinto 1:1'")
		expect(p.parse("2 Mga Taga Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Mga Taga Corinto 1:1'")
		expect(p.parse("Ikalawang Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ikalawang Corintio 1:1'")
		expect(p.parse("Ikalawang Korintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ikalawang Korintio 1:1'")
		expect(p.parse("Ikalawang Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ikalawang Corinto 1:1'")
		expect(p.parse("Ikalawang Korinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Ikalawang Korinto 1:1'")
		expect(p.parse("II. Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Corintio 1:1'")
		expect(p.parse("II. Korintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Korintio 1:1'")
		expect(p.parse("2. Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Corintio 1:1'")
		expect(p.parse("2. Korintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Korintio 1:1'")
		expect(p.parse("II Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Corintio 1:1'")
		expect(p.parse("II Korintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Korintio 1:1'")
		expect(p.parse("II. Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Corinto 1:1'")
		expect(p.parse("II. Korinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Korinto 1:1'")
		expect(p.parse("2 Corintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Corintio 1:1'")
		expect(p.parse("2 Korintio 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Korintio 1:1'")
		expect(p.parse("2. Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Corinto 1:1'")
		expect(p.parse("2. Korinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Korinto 1:1'")
		expect(p.parse("II Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Corinto 1:1'")
		expect(p.parse("II Korinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Korinto 1:1'")
		expect(p.parse("2 Corinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Corinto 1:1'")
		expect(p.parse("2 Korinto 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Korinto 1:1'")
		expect(p.parse("2 Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Cor 1:1'")
		expect(p.parse("2Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKA- 2 SULAT SA MGA CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKA- 2 SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("SECOND SULAT SA MGA CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'SECOND SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("IKA 2 SULAT SA MGA CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKA 2 SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("IKA- 2 SULAT SA MGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKA- 2 SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("IKALAWANG MGA TAGA- CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKALAWANG MGA TAGA- CORINTO 1:1'")
		expect(p.parse("SECOND SULAT SA MGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'SECOND SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("IKA 2 SULAT SA MGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKA 2 SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("IKALAWANG MGA TAGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKALAWANG MGA TAGA CORINTO 1:1'")
		expect(p.parse("II. MGA TAGA- CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. MGA TAGA- CORINTO 1:1'")
		expect(p.parse("2. MGA TAGA- CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. MGA TAGA- CORINTO 1:1'")
		expect(p.parse("II MGA TAGA- CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II MGA TAGA- CORINTO 1:1'")
		expect(p.parse("II. MGA TAGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. MGA TAGA CORINTO 1:1'")
		expect(p.parse("2 MGA TAGA- CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 MGA TAGA- CORINTO 1:1'")
		expect(p.parse("2. MGA TAGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. MGA TAGA CORINTO 1:1'")
		expect(p.parse("II MGA TAGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II MGA TAGA CORINTO 1:1'")
		expect(p.parse("2 MGA TAGA CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 MGA TAGA CORINTO 1:1'")
		expect(p.parse("IKALAWANG CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKALAWANG CORINTIO 1:1'")
		expect(p.parse("IKALAWANG KORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKALAWANG KORINTIO 1:1'")
		expect(p.parse("IKALAWANG CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKALAWANG CORINTO 1:1'")
		expect(p.parse("IKALAWANG KORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'IKALAWANG KORINTO 1:1'")
		expect(p.parse("II. CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. CORINTIO 1:1'")
		expect(p.parse("II. KORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KORINTIO 1:1'")
		expect(p.parse("2. CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. CORINTIO 1:1'")
		expect(p.parse("2. KORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KORINTIO 1:1'")
		expect(p.parse("II CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II CORINTIO 1:1'")
		expect(p.parse("II KORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KORINTIO 1:1'")
		expect(p.parse("II. CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. CORINTO 1:1'")
		expect(p.parse("II. KORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. KORINTO 1:1'")
		expect(p.parse("2 CORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 CORINTIO 1:1'")
		expect(p.parse("2 KORINTIO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KORINTIO 1:1'")
		expect(p.parse("2. CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. CORINTO 1:1'")
		expect(p.parse("2. KORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. KORINTO 1:1'")
		expect(p.parse("II CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II CORINTO 1:1'")
		expect(p.parse("II KORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II KORINTO 1:1'")
		expect(p.parse("2 CORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 CORINTO 1:1'")
		expect(p.parse("2 KORINTO 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 KORINTO 1:1'")
		expect(p.parse("2 COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 COR 1:1'")
		expect(p.parse("2COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Cor (tl)", function() {
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
    return it("should handle book: 1Cor (tl)", function() {
      
		expect(p.parse("Ika- 1 Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Ika- 1 Sulat sa mga Corintio 1:1'")
		expect(p.parse("Ika 1 Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Ika 1 Sulat sa mga Corintio 1:1'")
		expect(p.parse("Ika- 1 Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Ika- 1 Sulat sa mga Corinto 1:1'")
		expect(p.parse("Unang Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Sulat sa mga Corintio 1:1'")
		expect(p.parse("Ika 1 Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Ika 1 Sulat sa mga Corinto 1:1'")
		expect(p.parse("Unang Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Sulat sa mga Corinto 1:1'")
		expect(p.parse("Una Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Sulat sa mga Corintio 1:1'")
		expect(p.parse("1. Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Sulat sa mga Corintio 1:1'")
		expect(p.parse("I. Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Sulat sa mga Corintio 1:1'")
		expect(p.parse("Una Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Sulat sa mga Corinto 1:1'")
		expect(p.parse("1 Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Sulat sa mga Corintio 1:1'")
		expect(p.parse("1. Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Sulat sa mga Corinto 1:1'")
		expect(p.parse("I Sulat sa mga Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Sulat sa mga Corintio 1:1'")
		expect(p.parse("I. Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Sulat sa mga Corinto 1:1'")
		expect(p.parse("Unang Mga Taga- Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Mga Taga- Corinto 1:1'")
		expect(p.parse("1 Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Sulat sa mga Corinto 1:1'")
		expect(p.parse("I Sulat sa mga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Sulat sa mga Corinto 1:1'")
		expect(p.parse("Unang Mga Taga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Mga Taga Corinto 1:1'")
		expect(p.parse("Una Mga Taga- Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Mga Taga- Corinto 1:1'")
		expect(p.parse("1. Mga Taga- Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Mga Taga- Corinto 1:1'")
		expect(p.parse("I. Mga Taga- Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Mga Taga- Corinto 1:1'")
		expect(p.parse("Una Mga Taga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Mga Taga Corinto 1:1'")
		expect(p.parse("1 Mga Taga- Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Mga Taga- Corinto 1:1'")
		expect(p.parse("1. Mga Taga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Mga Taga Corinto 1:1'")
		expect(p.parse("I Mga Taga- Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Mga Taga- Corinto 1:1'")
		expect(p.parse("I. Mga Taga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Mga Taga Corinto 1:1'")
		expect(p.parse("1 Mga Taga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Mga Taga Corinto 1:1'")
		expect(p.parse("I Mga Taga Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Mga Taga Corinto 1:1'")
		expect(p.parse("Unang Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Corintio 1:1'")
		expect(p.parse("Unang Korintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Korintio 1:1'")
		expect(p.parse("Unang Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Corinto 1:1'")
		expect(p.parse("Unang Korinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Unang Korinto 1:1'")
		expect(p.parse("Una Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Corintio 1:1'")
		expect(p.parse("Una Korintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Korintio 1:1'")
		expect(p.parse("1. Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Corintio 1:1'")
		expect(p.parse("1. Korintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Korintio 1:1'")
		expect(p.parse("I. Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Corintio 1:1'")
		expect(p.parse("I. Korintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Korintio 1:1'")
		expect(p.parse("Una Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Corinto 1:1'")
		expect(p.parse("Una Korinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Una Korinto 1:1'")
		expect(p.parse("1 Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Corintio 1:1'")
		expect(p.parse("1 Korintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Korintio 1:1'")
		expect(p.parse("1. Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Corinto 1:1'")
		expect(p.parse("1. Korinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Korinto 1:1'")
		expect(p.parse("I Corintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Corintio 1:1'")
		expect(p.parse("I Korintio 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Korintio 1:1'")
		expect(p.parse("I. Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Corinto 1:1'")
		expect(p.parse("I. Korinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Korinto 1:1'")
		expect(p.parse("1 Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Corinto 1:1'")
		expect(p.parse("1 Korinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Korinto 1:1'")
		expect(p.parse("I Corinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Corinto 1:1'")
		expect(p.parse("I Korinto 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Korinto 1:1'")
		expect(p.parse("1 Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Cor 1:1'")
		expect(p.parse("1Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKA- 1 SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'IKA- 1 SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("IKA 1 SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'IKA 1 SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("IKA- 1 SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'IKA- 1 SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("UNANG SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("IKA 1 SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'IKA 1 SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("UNANG SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("UNA SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("1. SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("I. SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("UNA SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("1 SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("1. SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("I SULAT SA MGA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I SULAT SA MGA CORINTIO 1:1'")
		expect(p.parse("I. SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("UNANG MGA TAGA- CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG MGA TAGA- CORINTO 1:1'")
		expect(p.parse("1 SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("I SULAT SA MGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I SULAT SA MGA CORINTO 1:1'")
		expect(p.parse("UNANG MGA TAGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG MGA TAGA CORINTO 1:1'")
		expect(p.parse("UNA MGA TAGA- CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA MGA TAGA- CORINTO 1:1'")
		expect(p.parse("1. MGA TAGA- CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. MGA TAGA- CORINTO 1:1'")
		expect(p.parse("I. MGA TAGA- CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. MGA TAGA- CORINTO 1:1'")
		expect(p.parse("UNA MGA TAGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA MGA TAGA CORINTO 1:1'")
		expect(p.parse("1 MGA TAGA- CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 MGA TAGA- CORINTO 1:1'")
		expect(p.parse("1. MGA TAGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. MGA TAGA CORINTO 1:1'")
		expect(p.parse("I MGA TAGA- CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I MGA TAGA- CORINTO 1:1'")
		expect(p.parse("I. MGA TAGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. MGA TAGA CORINTO 1:1'")
		expect(p.parse("1 MGA TAGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 MGA TAGA CORINTO 1:1'")
		expect(p.parse("I MGA TAGA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I MGA TAGA CORINTO 1:1'")
		expect(p.parse("UNANG CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG CORINTIO 1:1'")
		expect(p.parse("UNANG KORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG KORINTIO 1:1'")
		expect(p.parse("UNANG CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG CORINTO 1:1'")
		expect(p.parse("UNANG KORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNANG KORINTO 1:1'")
		expect(p.parse("UNA CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA CORINTIO 1:1'")
		expect(p.parse("UNA KORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA KORINTIO 1:1'")
		expect(p.parse("1. CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. CORINTIO 1:1'")
		expect(p.parse("1. KORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KORINTIO 1:1'")
		expect(p.parse("I. CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. CORINTIO 1:1'")
		expect(p.parse("I. KORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KORINTIO 1:1'")
		expect(p.parse("UNA CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA CORINTO 1:1'")
		expect(p.parse("UNA KORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'UNA KORINTO 1:1'")
		expect(p.parse("1 CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 CORINTIO 1:1'")
		expect(p.parse("1 KORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KORINTIO 1:1'")
		expect(p.parse("1. CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. CORINTO 1:1'")
		expect(p.parse("1. KORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. KORINTO 1:1'")
		expect(p.parse("I CORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I CORINTIO 1:1'")
		expect(p.parse("I KORINTIO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KORINTIO 1:1'")
		expect(p.parse("I. CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. CORINTO 1:1'")
		expect(p.parse("I. KORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. KORINTO 1:1'")
		expect(p.parse("1 CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 CORINTO 1:1'")
		expect(p.parse("1 KORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 KORINTO 1:1'")
		expect(p.parse("I CORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I CORINTO 1:1'")
		expect(p.parse("I KORINTO 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I KORINTO 1:1'")
		expect(p.parse("1 COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 COR 1:1'")
		expect(p.parse("1COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Gal (tl)", function() {
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
    return it("should handle book: Gal (tl)", function() {
      
		expect(p.parse("Sulat sa mga taga Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Sulat sa mga taga Galacia 1:1'")
		expect(p.parse("Sulat sa mga Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Sulat sa mga Galacia 1:1'")
		expect(p.parse("Mga Taga- Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Mga Taga- Galacia 1:1'")
		expect(p.parse("Mga Taga- Galasya 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Mga Taga- Galasya 1:1'")
		expect(p.parse("Mga Taga Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Mga Taga Galacia 1:1'")
		expect(p.parse("Mga Taga Galasya 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Mga Taga Galasya 1:1'")
		expect(p.parse("Mga Taga-Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Mga Taga-Galacia 1:1'")
		expect(p.parse("Taga- Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Taga- Galacia 1:1'")
		expect(p.parse("Taga Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Taga Galacia 1:1'")
		expect(p.parse("Galasyano 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Galasyano 1:1'")
		expect(p.parse("Galacia 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Galacia 1:1'")
		expect(p.parse("Gal 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Gal 1:1'")
		expect(p.parse("Ga 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Ga 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SULAT SA MGA TAGA GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'SULAT SA MGA TAGA GALACIA 1:1'")
		expect(p.parse("SULAT SA MGA GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'SULAT SA MGA GALACIA 1:1'")
		expect(p.parse("MGA TAGA- GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'MGA TAGA- GALACIA 1:1'")
		expect(p.parse("MGA TAGA- GALASYA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'MGA TAGA- GALASYA 1:1'")
		expect(p.parse("MGA TAGA GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'MGA TAGA GALACIA 1:1'")
		expect(p.parse("MGA TAGA GALASYA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'MGA TAGA GALASYA 1:1'")
		expect(p.parse("MGA TAGA-GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'MGA TAGA-GALACIA 1:1'")
		expect(p.parse("TAGA- GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'TAGA- GALACIA 1:1'")
		expect(p.parse("TAGA GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'TAGA GALACIA 1:1'")
		expect(p.parse("GALASYANO 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GALASYANO 1:1'")
		expect(p.parse("GALACIA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GALACIA 1:1'")
		expect(p.parse("GAL 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GAL 1:1'")
		expect(p.parse("GA 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GA 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eph (tl)", function() {
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
    return it("should handle book: Eph (tl)", function() {
      
		expect(p.parse("Sulat sa mga Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Sulat sa mga Efesio 1:1'")
		expect(p.parse("Sulat sa mga Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Sulat sa mga Epesio 1:1'")
		expect(p.parse("Sulat sa mga Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Sulat sa mga Efeso 1:1'")
		expect(p.parse("Sulat sa mga Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Sulat sa mga Epeso 1:1'")
		expect(p.parse("Mga Taga- Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga- Efesio 1:1'")
		expect(p.parse("Mga Taga- Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga- Epesio 1:1'")
		expect(p.parse("Mga Taga Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga Efesio 1:1'")
		expect(p.parse("Mga Taga Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga Epesio 1:1'")
		expect(p.parse("Mga Taga- Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga- Efeso 1:1'")
		expect(p.parse("Mga Taga- Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga- Epeso 1:1'")
		expect(p.parse("Mga Taga Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga Efeso 1:1'")
		expect(p.parse("Mga Taga Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga Epeso 1:1'")
		expect(p.parse("Mga Taga-Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Taga-Efeso 1:1'")
		expect(p.parse("Taga- Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga- Efesio 1:1'")
		expect(p.parse("Taga- Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga- Epesio 1:1'")
		expect(p.parse("Taga Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga Efesio 1:1'")
		expect(p.parse("Taga Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga Epesio 1:1'")
		expect(p.parse("Taga- Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga- Efeso 1:1'")
		expect(p.parse("Taga- Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga- Epeso 1:1'")
		expect(p.parse("Mga Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Efesio 1:1'")
		expect(p.parse("Mga Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Epesio 1:1'")
		expect(p.parse("Taga Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga Efeso 1:1'")
		expect(p.parse("Taga Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Taga Epeso 1:1'")
		expect(p.parse("Mga Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Efeso 1:1'")
		expect(p.parse("Mga Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Mga Epeso 1:1'")
		expect(p.parse("Efesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Efesio 1:1'")
		expect(p.parse("Epesio 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epesio 1:1'")
		expect(p.parse("Efeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Efeso 1:1'")
		expect(p.parse("Epeso 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Epeso 1:1'")
		expect(p.parse("Eph 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Eph 1:1'")
		expect(p.parse("Ef 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Ef 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SULAT SA MGA EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'SULAT SA MGA EFESIO 1:1'")
		expect(p.parse("SULAT SA MGA EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'SULAT SA MGA EPESIO 1:1'")
		expect(p.parse("SULAT SA MGA EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'SULAT SA MGA EFESO 1:1'")
		expect(p.parse("SULAT SA MGA EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'SULAT SA MGA EPESO 1:1'")
		expect(p.parse("MGA TAGA- EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA- EFESIO 1:1'")
		expect(p.parse("MGA TAGA- EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA- EPESIO 1:1'")
		expect(p.parse("MGA TAGA EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA EFESIO 1:1'")
		expect(p.parse("MGA TAGA EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA EPESIO 1:1'")
		expect(p.parse("MGA TAGA- EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA- EFESO 1:1'")
		expect(p.parse("MGA TAGA- EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA- EPESO 1:1'")
		expect(p.parse("MGA TAGA EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA EFESO 1:1'")
		expect(p.parse("MGA TAGA EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA EPESO 1:1'")
		expect(p.parse("MGA TAGA-EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA TAGA-EFESO 1:1'")
		expect(p.parse("TAGA- EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA- EFESIO 1:1'")
		expect(p.parse("TAGA- EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA- EPESIO 1:1'")
		expect(p.parse("TAGA EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA EFESIO 1:1'")
		expect(p.parse("TAGA EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA EPESIO 1:1'")
		expect(p.parse("TAGA- EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA- EFESO 1:1'")
		expect(p.parse("TAGA- EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA- EPESO 1:1'")
		expect(p.parse("MGA EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA EFESIO 1:1'")
		expect(p.parse("MGA EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA EPESIO 1:1'")
		expect(p.parse("TAGA EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA EFESO 1:1'")
		expect(p.parse("TAGA EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'TAGA EPESO 1:1'")
		expect(p.parse("MGA EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA EFESO 1:1'")
		expect(p.parse("MGA EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'MGA EPESO 1:1'")
		expect(p.parse("EFESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EFESIO 1:1'")
		expect(p.parse("EPESIO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPESIO 1:1'")
		expect(p.parse("EFESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EFESO 1:1'")
		expect(p.parse("EPESO 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPESO 1:1'")
		expect(p.parse("EPH 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPH 1:1'")
		expect(p.parse("EF 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EF 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phil (tl)", function() {
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
    return it("should handle book: Phil (tl)", function() {
      
		expect(p.parse("Sulat sa mga Filipense 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Sulat sa mga Filipense 1:1'")
		expect(p.parse("Sulat sa mga Pilipense 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Sulat sa mga Pilipense 1:1'")
		expect(p.parse("Sulat sa mga Pilipyano 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Sulat sa mga Pilipyano 1:1'")
		expect(p.parse("Mga Taga- Filipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Taga- Filipos 1:1'")
		expect(p.parse("Mga Taga- Pilipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Taga- Pilipos 1:1'")
		expect(p.parse("Mga Taga Filipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Taga Filipos 1:1'")
		expect(p.parse("Mga Taga Pilipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Taga Pilipos 1:1'")
		expect(p.parse("Mga Taga-Filipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Taga-Filipos 1:1'")
		expect(p.parse("Mga Filipense 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Filipense 1:1'")
		expect(p.parse("Mga Pilipense 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Pilipense 1:1'")
		expect(p.parse("Mga Pilipyano 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Mga Pilipyano 1:1'")
		expect(p.parse("Taga- Filipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Taga- Filipos 1:1'")
		expect(p.parse("Taga- Pilipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Taga- Pilipos 1:1'")
		expect(p.parse("Taga Filipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Taga Filipos 1:1'")
		expect(p.parse("Taga Pilipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Taga Pilipos 1:1'")
		expect(p.parse("Filipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Filipos 1:1'")
		expect(p.parse("Pilipos 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Pilipos 1:1'")
		expect(p.parse("Phil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Phil 1:1'")
		expect(p.parse("Fil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Fil 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SULAT SA MGA FILIPENSE 1:1").osis()).toEqual("Phil.1.1", "parsing: 'SULAT SA MGA FILIPENSE 1:1'")
		expect(p.parse("SULAT SA MGA PILIPENSE 1:1").osis()).toEqual("Phil.1.1", "parsing: 'SULAT SA MGA PILIPENSE 1:1'")
		expect(p.parse("SULAT SA MGA PILIPYANO 1:1").osis()).toEqual("Phil.1.1", "parsing: 'SULAT SA MGA PILIPYANO 1:1'")
		expect(p.parse("MGA TAGA- FILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA TAGA- FILIPOS 1:1'")
		expect(p.parse("MGA TAGA- PILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA TAGA- PILIPOS 1:1'")
		expect(p.parse("MGA TAGA FILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA TAGA FILIPOS 1:1'")
		expect(p.parse("MGA TAGA PILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA TAGA PILIPOS 1:1'")
		expect(p.parse("MGA TAGA-FILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA TAGA-FILIPOS 1:1'")
		expect(p.parse("MGA FILIPENSE 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA FILIPENSE 1:1'")
		expect(p.parse("MGA PILIPENSE 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA PILIPENSE 1:1'")
		expect(p.parse("MGA PILIPYANO 1:1").osis()).toEqual("Phil.1.1", "parsing: 'MGA PILIPYANO 1:1'")
		expect(p.parse("TAGA- FILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'TAGA- FILIPOS 1:1'")
		expect(p.parse("TAGA- PILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'TAGA- PILIPOS 1:1'")
		expect(p.parse("TAGA FILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'TAGA FILIPOS 1:1'")
		expect(p.parse("TAGA PILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'TAGA PILIPOS 1:1'")
		expect(p.parse("FILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FILIPOS 1:1'")
		expect(p.parse("PILIPOS 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PILIPOS 1:1'")
		expect(p.parse("PHIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHIL 1:1'")
		expect(p.parse("FIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'FIL 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Col (tl)", function() {
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
    return it("should handle book: Col (tl)", function() {
      
		expect(p.parse("Sulat sa mga Colonsense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Sulat sa mga Colonsense 1:1'")
		expect(p.parse("Sulat sa mga Kolonsense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Sulat sa mga Kolonsense 1:1'")
		expect(p.parse("Sulat sa mga Colosense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Sulat sa mga Colosense 1:1'")
		expect(p.parse("Sulat sa mga Kolosense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Sulat sa mga Kolosense 1:1'")
		expect(p.parse("Mga Taga- Colosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Taga- Colosas 1:1'")
		expect(p.parse("Mga Taga- Kolosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Taga- Kolosas 1:1'")
		expect(p.parse("Mga Taga Colosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Taga Colosas 1:1'")
		expect(p.parse("Mga Taga Kolosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Taga Kolosas 1:1'")
		expect(p.parse("Mga Taga-Colosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Taga-Colosas 1:1'")
		expect(p.parse("Mga Colonsense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Colonsense 1:1'")
		expect(p.parse("Mga Kolonsense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Kolonsense 1:1'")
		expect(p.parse("Mga Colosense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Colosense 1:1'")
		expect(p.parse("Mga Kolosense 1:1").osis()).toEqual("Col.1.1", "parsing: 'Mga Kolosense 1:1'")
		expect(p.parse("Taga- Colosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Taga- Colosas 1:1'")
		expect(p.parse("Taga Colosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Taga Colosas 1:1'")
		expect(p.parse("Colosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Colosas 1:1'")
		expect(p.parse("Kolosas 1:1").osis()).toEqual("Col.1.1", "parsing: 'Kolosas 1:1'")
		expect(p.parse("Col 1:1").osis()).toEqual("Col.1.1", "parsing: 'Col 1:1'")
		expect(p.parse("Co 1:1").osis()).toEqual("Col.1.1", "parsing: 'Co 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SULAT SA MGA COLONSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'SULAT SA MGA COLONSENSE 1:1'")
		expect(p.parse("SULAT SA MGA KOLONSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'SULAT SA MGA KOLONSENSE 1:1'")
		expect(p.parse("SULAT SA MGA COLOSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'SULAT SA MGA COLOSENSE 1:1'")
		expect(p.parse("SULAT SA MGA KOLOSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'SULAT SA MGA KOLOSENSE 1:1'")
		expect(p.parse("MGA TAGA- COLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA TAGA- COLOSAS 1:1'")
		expect(p.parse("MGA TAGA- KOLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA TAGA- KOLOSAS 1:1'")
		expect(p.parse("MGA TAGA COLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA TAGA COLOSAS 1:1'")
		expect(p.parse("MGA TAGA KOLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA TAGA KOLOSAS 1:1'")
		expect(p.parse("MGA TAGA-COLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA TAGA-COLOSAS 1:1'")
		expect(p.parse("MGA COLONSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA COLONSENSE 1:1'")
		expect(p.parse("MGA KOLONSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA KOLONSENSE 1:1'")
		expect(p.parse("MGA COLOSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA COLOSENSE 1:1'")
		expect(p.parse("MGA KOLOSENSE 1:1").osis()).toEqual("Col.1.1", "parsing: 'MGA KOLOSENSE 1:1'")
		expect(p.parse("TAGA- COLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'TAGA- COLOSAS 1:1'")
		expect(p.parse("TAGA COLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'TAGA COLOSAS 1:1'")
		expect(p.parse("COLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'COLOSAS 1:1'")
		expect(p.parse("KOLOSAS 1:1").osis()).toEqual("Col.1.1", "parsing: 'KOLOSAS 1:1'")
		expect(p.parse("COL 1:1").osis()).toEqual("Col.1.1", "parsing: 'COL 1:1'")
		expect(p.parse("CO 1:1").osis()).toEqual("Col.1.1", "parsing: 'CO 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Thess (tl)", function() {
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
    return it("should handle book: 2Thess (tl)", function() {
      
		expect(p.parse("Ikalawang Mga Taga- Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Mga Taga- Tesalonica 1:1'")
		expect(p.parse("Ikalawang Mga Taga- Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Mga Taga- Tesalonika 1:1'")
		expect(p.parse("Ikalawang Mga Taga Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Mga Taga Tesalonica 1:1'")
		expect(p.parse("Ikalawang Mga Taga Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Mga Taga Tesalonika 1:1'")
		expect(p.parse("Ikalawang Mga Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Mga Tesalonicense 1:1'")
		expect(p.parse("Ikalawang Mga Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Mga Tesalonisense 1:1'")
		expect(p.parse("II. Mga Taga- Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Mga Taga- Tesalonica 1:1'")
		expect(p.parse("II. Mga Taga- Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Mga Taga- Tesalonika 1:1'")
		expect(p.parse("2. Mga Taga- Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Mga Taga- Tesalonica 1:1'")
		expect(p.parse("2. Mga Taga- Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Mga Taga- Tesalonika 1:1'")
		expect(p.parse("II Mga Taga- Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Mga Taga- Tesalonica 1:1'")
		expect(p.parse("II Mga Taga- Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Mga Taga- Tesalonika 1:1'")
		expect(p.parse("II. Mga Taga Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Mga Taga Tesalonica 1:1'")
		expect(p.parse("II. Mga Taga Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Mga Taga Tesalonika 1:1'")
		expect(p.parse("Ikalawang Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Tesalonicense 1:1'")
		expect(p.parse("Ikalawang Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Tesalonisense 1:1'")
		expect(p.parse("2 Mga Taga- Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Mga Taga- Tesalonica 1:1'")
		expect(p.parse("2 Mga Taga- Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Mga Taga- Tesalonika 1:1'")
		expect(p.parse("2. Mga Taga Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Mga Taga Tesalonica 1:1'")
		expect(p.parse("2. Mga Taga Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Mga Taga Tesalonika 1:1'")
		expect(p.parse("II Mga Taga Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Mga Taga Tesalonica 1:1'")
		expect(p.parse("II Mga Taga Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Mga Taga Tesalonika 1:1'")
		expect(p.parse("2 Mga Taga Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Mga Taga Tesalonica 1:1'")
		expect(p.parse("2 Mga Taga Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Mga Taga Tesalonika 1:1'")
		expect(p.parse("II. Mga Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Mga Tesalonicense 1:1'")
		expect(p.parse("II. Mga Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Mga Tesalonisense 1:1'")
		expect(p.parse("2. Mga Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Mga Tesalonicense 1:1'")
		expect(p.parse("2. Mga Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Mga Tesalonisense 1:1'")
		expect(p.parse("II Mga Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Mga Tesalonicense 1:1'")
		expect(p.parse("II Mga Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Mga Tesalonisense 1:1'")
		expect(p.parse("Ikalawang Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Tesalonica 1:1'")
		expect(p.parse("Ikalawang Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Ikalawang Tesalonika 1:1'")
		expect(p.parse("2 Mga Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Mga Tesalonicense 1:1'")
		expect(p.parse("2 Mga Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Mga Tesalonisense 1:1'")
		expect(p.parse("II. Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tesalonicense 1:1'")
		expect(p.parse("II. Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tesalonisense 1:1'")
		expect(p.parse("2. Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tesalonicense 1:1'")
		expect(p.parse("2. Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tesalonisense 1:1'")
		expect(p.parse("II Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tesalonicense 1:1'")
		expect(p.parse("II Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tesalonisense 1:1'")
		expect(p.parse("2 Tesalonicense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tesalonicense 1:1'")
		expect(p.parse("2 Tesalonisense 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tesalonisense 1:1'")
		expect(p.parse("II. Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tesalonica 1:1'")
		expect(p.parse("II. Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Tesalonika 1:1'")
		expect(p.parse("2. Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tesalonica 1:1'")
		expect(p.parse("2. Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Tesalonika 1:1'")
		expect(p.parse("II Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tesalonica 1:1'")
		expect(p.parse("II Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Tesalonika 1:1'")
		expect(p.parse("2 Tesalonica 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tesalonica 1:1'")
		expect(p.parse("2 Tesalonika 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tesalonika 1:1'")
		expect(p.parse("2 Thes 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Thes 1:1'")
		expect(p.parse("2Thess 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2Thess 1:1'")
		expect(p.parse("2 Tes 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Tes 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG MGA TAGA- TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("IKALAWANG MGA TAGA- TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("IKALAWANG MGA TAGA TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG MGA TAGA TESALONICA 1:1'")
		expect(p.parse("IKALAWANG MGA TAGA TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("IKALAWANG MGA TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG MGA TESALONICENSE 1:1'")
		expect(p.parse("IKALAWANG MGA TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG MGA TESALONISENSE 1:1'")
		expect(p.parse("II. MGA TAGA- TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("II. MGA TAGA- TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("2. MGA TAGA- TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("2. MGA TAGA- TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("II MGA TAGA- TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("II MGA TAGA- TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("II. MGA TAGA TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. MGA TAGA TESALONICA 1:1'")
		expect(p.parse("II. MGA TAGA TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("IKALAWANG TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG TESALONICENSE 1:1'")
		expect(p.parse("IKALAWANG TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG TESALONISENSE 1:1'")
		expect(p.parse("2 MGA TAGA- TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("2 MGA TAGA- TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("2. MGA TAGA TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. MGA TAGA TESALONICA 1:1'")
		expect(p.parse("2. MGA TAGA TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("II MGA TAGA TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II MGA TAGA TESALONICA 1:1'")
		expect(p.parse("II MGA TAGA TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("2 MGA TAGA TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 MGA TAGA TESALONICA 1:1'")
		expect(p.parse("2 MGA TAGA TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("II. MGA TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. MGA TESALONICENSE 1:1'")
		expect(p.parse("II. MGA TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. MGA TESALONISENSE 1:1'")
		expect(p.parse("2. MGA TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. MGA TESALONICENSE 1:1'")
		expect(p.parse("2. MGA TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. MGA TESALONISENSE 1:1'")
		expect(p.parse("II MGA TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II MGA TESALONICENSE 1:1'")
		expect(p.parse("II MGA TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II MGA TESALONISENSE 1:1'")
		expect(p.parse("IKALAWANG TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG TESALONICA 1:1'")
		expect(p.parse("IKALAWANG TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'IKALAWANG TESALONIKA 1:1'")
		expect(p.parse("2 MGA TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 MGA TESALONICENSE 1:1'")
		expect(p.parse("2 MGA TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 MGA TESALONISENSE 1:1'")
		expect(p.parse("II. TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESALONICENSE 1:1'")
		expect(p.parse("II. TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESALONISENSE 1:1'")
		expect(p.parse("2. TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESALONICENSE 1:1'")
		expect(p.parse("2. TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESALONISENSE 1:1'")
		expect(p.parse("II TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESALONICENSE 1:1'")
		expect(p.parse("II TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESALONISENSE 1:1'")
		expect(p.parse("2 TESALONICENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESALONICENSE 1:1'")
		expect(p.parse("2 TESALONISENSE 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESALONISENSE 1:1'")
		expect(p.parse("II. TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESALONICA 1:1'")
		expect(p.parse("II. TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. TESALONIKA 1:1'")
		expect(p.parse("2. TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESALONICA 1:1'")
		expect(p.parse("2. TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. TESALONIKA 1:1'")
		expect(p.parse("II TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESALONICA 1:1'")
		expect(p.parse("II TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II TESALONIKA 1:1'")
		expect(p.parse("2 TESALONICA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESALONICA 1:1'")
		expect(p.parse("2 TESALONIKA 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TESALONIKA 1:1'")
		expect(p.parse("2 THES 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 THES 1:1'")
		expect(p.parse("2THESS 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2THESS 1:1'")
		expect(p.parse("2 TES 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 TES 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Thess (tl)", function() {
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
    return it("should handle book: 1Thess (tl)", function() {
      
		expect(p.parse("Unang Mga Taga- Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Mga Taga- Tesalonica 1:1'")
		expect(p.parse("Unang Mga Taga- Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Mga Taga- Tesalonika 1:1'")
		expect(p.parse("Unang Mga Taga Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Mga Taga Tesalonica 1:1'")
		expect(p.parse("Unang Mga Taga Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Mga Taga Tesalonika 1:1'")
		expect(p.parse("Una Mga Taga- Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Mga Taga- Tesalonica 1:1'")
		expect(p.parse("Una Mga Taga- Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Mga Taga- Tesalonika 1:1'")
		expect(p.parse("1. Mga Taga- Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Mga Taga- Tesalonica 1:1'")
		expect(p.parse("1. Mga Taga- Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Mga Taga- Tesalonika 1:1'")
		expect(p.parse("I. Mga Taga- Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Mga Taga- Tesalonica 1:1'")
		expect(p.parse("I. Mga Taga- Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Mga Taga- Tesalonika 1:1'")
		expect(p.parse("Una Mga Taga Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Mga Taga Tesalonica 1:1'")
		expect(p.parse("Una Mga Taga Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Mga Taga Tesalonika 1:1'")
		expect(p.parse("Unang Mga Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Mga Tesalonicense 1:1'")
		expect(p.parse("Unang Mga Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Mga Tesalonisense 1:1'")
		expect(p.parse("1 Mga Taga- Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Mga Taga- Tesalonica 1:1'")
		expect(p.parse("1 Mga Taga- Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Mga Taga- Tesalonika 1:1'")
		expect(p.parse("1. Mga Taga Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Mga Taga Tesalonica 1:1'")
		expect(p.parse("1. Mga Taga Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Mga Taga Tesalonika 1:1'")
		expect(p.parse("I Mga Taga- Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Mga Taga- Tesalonica 1:1'")
		expect(p.parse("I Mga Taga- Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Mga Taga- Tesalonika 1:1'")
		expect(p.parse("I. Mga Taga Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Mga Taga Tesalonica 1:1'")
		expect(p.parse("I. Mga Taga Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Mga Taga Tesalonika 1:1'")
		expect(p.parse("1 Mga Taga Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Mga Taga Tesalonica 1:1'")
		expect(p.parse("1 Mga Taga Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Mga Taga Tesalonika 1:1'")
		expect(p.parse("I Mga Taga Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Mga Taga Tesalonica 1:1'")
		expect(p.parse("I Mga Taga Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Mga Taga Tesalonika 1:1'")
		expect(p.parse("Una Mga Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Mga Tesalonicense 1:1'")
		expect(p.parse("Una Mga Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Mga Tesalonisense 1:1'")
		expect(p.parse("1. Mga Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Mga Tesalonicense 1:1'")
		expect(p.parse("1. Mga Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Mga Tesalonisense 1:1'")
		expect(p.parse("I. Mga Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Mga Tesalonicense 1:1'")
		expect(p.parse("I. Mga Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Mga Tesalonisense 1:1'")
		expect(p.parse("1 Mga Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Mga Tesalonicense 1:1'")
		expect(p.parse("1 Mga Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Mga Tesalonisense 1:1'")
		expect(p.parse("I Mga Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Mga Tesalonicense 1:1'")
		expect(p.parse("I Mga Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Mga Tesalonisense 1:1'")
		expect(p.parse("Unang Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Tesalonicense 1:1'")
		expect(p.parse("Unang Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Tesalonisense 1:1'")
		expect(p.parse("Una Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Tesalonicense 1:1'")
		expect(p.parse("Una Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Tesalonisense 1:1'")
		expect(p.parse("1. Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tesalonicense 1:1'")
		expect(p.parse("1. Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tesalonisense 1:1'")
		expect(p.parse("I. Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tesalonicense 1:1'")
		expect(p.parse("I. Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tesalonisense 1:1'")
		expect(p.parse("Unang Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Tesalonica 1:1'")
		expect(p.parse("Unang Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Unang Tesalonika 1:1'")
		expect(p.parse("1 Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tesalonicense 1:1'")
		expect(p.parse("1 Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tesalonisense 1:1'")
		expect(p.parse("I Tesalonicense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tesalonicense 1:1'")
		expect(p.parse("I Tesalonisense 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tesalonisense 1:1'")
		expect(p.parse("Una Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Tesalonica 1:1'")
		expect(p.parse("Una Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Una Tesalonika 1:1'")
		expect(p.parse("1. Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tesalonica 1:1'")
		expect(p.parse("1. Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Tesalonika 1:1'")
		expect(p.parse("I. Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tesalonica 1:1'")
		expect(p.parse("I. Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Tesalonika 1:1'")
		expect(p.parse("1 Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tesalonica 1:1'")
		expect(p.parse("1 Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tesalonika 1:1'")
		expect(p.parse("I Tesalonica 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tesalonica 1:1'")
		expect(p.parse("I Tesalonika 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Tesalonika 1:1'")
		expect(p.parse("1 Thes 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Thes 1:1'")
		expect(p.parse("1Thess 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1Thess 1:1'")
		expect(p.parse("1 Tes 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Tes 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UNANG MGA TAGA- TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("UNANG MGA TAGA- TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("UNANG MGA TAGA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG MGA TAGA TESALONICA 1:1'")
		expect(p.parse("UNANG MGA TAGA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("UNA MGA TAGA- TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("UNA MGA TAGA- TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("1. MGA TAGA- TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("1. MGA TAGA- TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("I. MGA TAGA- TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("I. MGA TAGA- TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("UNA MGA TAGA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA MGA TAGA TESALONICA 1:1'")
		expect(p.parse("UNA MGA TAGA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("UNANG MGA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG MGA TESALONICENSE 1:1'")
		expect(p.parse("UNANG MGA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG MGA TESALONISENSE 1:1'")
		expect(p.parse("1 MGA TAGA- TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("1 MGA TAGA- TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("1. MGA TAGA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. MGA TAGA TESALONICA 1:1'")
		expect(p.parse("1. MGA TAGA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("I MGA TAGA- TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I MGA TAGA- TESALONICA 1:1'")
		expect(p.parse("I MGA TAGA- TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I MGA TAGA- TESALONIKA 1:1'")
		expect(p.parse("I. MGA TAGA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. MGA TAGA TESALONICA 1:1'")
		expect(p.parse("I. MGA TAGA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("1 MGA TAGA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 MGA TAGA TESALONICA 1:1'")
		expect(p.parse("1 MGA TAGA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("I MGA TAGA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I MGA TAGA TESALONICA 1:1'")
		expect(p.parse("I MGA TAGA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I MGA TAGA TESALONIKA 1:1'")
		expect(p.parse("UNA MGA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA MGA TESALONICENSE 1:1'")
		expect(p.parse("UNA MGA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA MGA TESALONISENSE 1:1'")
		expect(p.parse("1. MGA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. MGA TESALONICENSE 1:1'")
		expect(p.parse("1. MGA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. MGA TESALONISENSE 1:1'")
		expect(p.parse("I. MGA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. MGA TESALONICENSE 1:1'")
		expect(p.parse("I. MGA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. MGA TESALONISENSE 1:1'")
		expect(p.parse("1 MGA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 MGA TESALONICENSE 1:1'")
		expect(p.parse("1 MGA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 MGA TESALONISENSE 1:1'")
		expect(p.parse("I MGA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I MGA TESALONICENSE 1:1'")
		expect(p.parse("I MGA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I MGA TESALONISENSE 1:1'")
		expect(p.parse("UNANG TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG TESALONICENSE 1:1'")
		expect(p.parse("UNANG TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG TESALONISENSE 1:1'")
		expect(p.parse("UNA TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA TESALONICENSE 1:1'")
		expect(p.parse("UNA TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA TESALONISENSE 1:1'")
		expect(p.parse("1. TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESALONICENSE 1:1'")
		expect(p.parse("1. TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESALONISENSE 1:1'")
		expect(p.parse("I. TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESALONICENSE 1:1'")
		expect(p.parse("I. TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESALONISENSE 1:1'")
		expect(p.parse("UNANG TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG TESALONICA 1:1'")
		expect(p.parse("UNANG TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNANG TESALONIKA 1:1'")
		expect(p.parse("1 TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESALONICENSE 1:1'")
		expect(p.parse("1 TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESALONISENSE 1:1'")
		expect(p.parse("I TESALONICENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESALONICENSE 1:1'")
		expect(p.parse("I TESALONISENSE 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESALONISENSE 1:1'")
		expect(p.parse("UNA TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA TESALONICA 1:1'")
		expect(p.parse("UNA TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'UNA TESALONIKA 1:1'")
		expect(p.parse("1. TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESALONICA 1:1'")
		expect(p.parse("1. TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. TESALONIKA 1:1'")
		expect(p.parse("I. TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESALONICA 1:1'")
		expect(p.parse("I. TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. TESALONIKA 1:1'")
		expect(p.parse("1 TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESALONICA 1:1'")
		expect(p.parse("1 TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TESALONIKA 1:1'")
		expect(p.parse("I TESALONICA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESALONICA 1:1'")
		expect(p.parse("I TESALONIKA 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I TESALONIKA 1:1'")
		expect(p.parse("1 THES 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 THES 1:1'")
		expect(p.parse("1THESS 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1THESS 1:1'")
		expect(p.parse("1 TES 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 TES 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Tim (tl)", function() {
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
    return it("should handle book: 2Tim (tl)", function() {
      
		expect(p.parse("Ikalawang Kay Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Ikalawang Kay Timoteo 1:1'")
		expect(p.parse("Ikalawang Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Ikalawang Timoteo 1:1'")
		expect(p.parse("II. Kay Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Kay Timoteo 1:1'")
		expect(p.parse("2. Kay Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Kay Timoteo 1:1'")
		expect(p.parse("II Kay Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Kay Timoteo 1:1'")
		expect(p.parse("2 Kay Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Kay Timoteo 1:1'")
		expect(p.parse("II. Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Timoteo 1:1'")
		expect(p.parse("2. Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Timoteo 1:1'")
		expect(p.parse("II Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Timoteo 1:1'")
		expect(p.parse("2 Timoteo 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Timoteo 1:1'")
		expect(p.parse("2 Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Tim 1:1'")
		expect(p.parse("2Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG KAY TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'IKALAWANG KAY TIMOTEO 1:1'")
		expect(p.parse("IKALAWANG TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'IKALAWANG TIMOTEO 1:1'")
		expect(p.parse("II. KAY TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. KAY TIMOTEO 1:1'")
		expect(p.parse("2. KAY TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. KAY TIMOTEO 1:1'")
		expect(p.parse("II KAY TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II KAY TIMOTEO 1:1'")
		expect(p.parse("2 KAY TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 KAY TIMOTEO 1:1'")
		expect(p.parse("II. TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. TIMOTEO 1:1'")
		expect(p.parse("2. TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. TIMOTEO 1:1'")
		expect(p.parse("II TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II TIMOTEO 1:1'")
		expect(p.parse("2 TIMOTEO 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIMOTEO 1:1'")
		expect(p.parse("2 TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 TIM 1:1'")
		expect(p.parse("2TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Tim (tl)", function() {
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
    return it("should handle book: 1Tim (tl)", function() {
      
		expect(p.parse("Unang Kay Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Unang Kay Timoteo 1:1'")
		expect(p.parse("Una Kay Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Una Kay Timoteo 1:1'")
		expect(p.parse("1. Kay Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Kay Timoteo 1:1'")
		expect(p.parse("I. Kay Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Kay Timoteo 1:1'")
		expect(p.parse("1 Kay Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Kay Timoteo 1:1'")
		expect(p.parse("I Kay Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Kay Timoteo 1:1'")
		expect(p.parse("Unang Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Unang Timoteo 1:1'")
		expect(p.parse("Una Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Una Timoteo 1:1'")
		expect(p.parse("1. Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Timoteo 1:1'")
		expect(p.parse("I. Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Timoteo 1:1'")
		expect(p.parse("1 Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Timoteo 1:1'")
		expect(p.parse("I Timoteo 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Timoteo 1:1'")
		expect(p.parse("1 Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Tim 1:1'")
		expect(p.parse("1Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UNANG KAY TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'UNANG KAY TIMOTEO 1:1'")
		expect(p.parse("UNA KAY TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'UNA KAY TIMOTEO 1:1'")
		expect(p.parse("1. KAY TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. KAY TIMOTEO 1:1'")
		expect(p.parse("I. KAY TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. KAY TIMOTEO 1:1'")
		expect(p.parse("1 KAY TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 KAY TIMOTEO 1:1'")
		expect(p.parse("I KAY TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I KAY TIMOTEO 1:1'")
		expect(p.parse("UNANG TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'UNANG TIMOTEO 1:1'")
		expect(p.parse("UNA TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'UNA TIMOTEO 1:1'")
		expect(p.parse("1. TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. TIMOTEO 1:1'")
		expect(p.parse("I. TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. TIMOTEO 1:1'")
		expect(p.parse("1 TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIMOTEO 1:1'")
		expect(p.parse("I TIMOTEO 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I TIMOTEO 1:1'")
		expect(p.parse("1 TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 TIM 1:1'")
		expect(p.parse("1TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Titus (tl)", function() {
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
    return it("should handle book: Titus (tl)", function() {
      
		expect(p.parse("Kay Tito 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Kay Tito 1:1'")
		expect(p.parse("Titus 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titus 1:1'")
		expect(p.parse("Tito 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tito 1:1'")
		expect(p.parse("Tit 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Tit 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KAY TITO 1:1").osis()).toEqual("Titus.1.1", "parsing: 'KAY TITO 1:1'")
		expect(p.parse("TITUS 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUS 1:1'")
		expect(p.parse("TITO 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITO 1:1'")
		expect(p.parse("TIT 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TIT 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phlm (tl)", function() {
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
    return it("should handle book: Phlm (tl)", function() {
      
		expect(p.parse("Kay Filemon 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Kay Filemon 1:1'")
		expect(p.parse("Filemon 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Filemon 1:1'")
		expect(p.parse("Filem 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Filem 1:1'")
		expect(p.parse("Phlm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Phlm 1:1'")
		expect(p.parse("Flm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Flm 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("KAY FILEMON 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'KAY FILEMON 1:1'")
		expect(p.parse("FILEMON 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILEMON 1:1'")
		expect(p.parse("FILEM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FILEM 1:1'")
		expect(p.parse("PHLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHLM 1:1'")
		expect(p.parse("FLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'FLM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Heb (tl)", function() {
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
    return it("should handle book: Heb (tl)", function() {
      
		expect(p.parse("Mga Hebreo 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Mga Hebreo 1:1'")
		expect(p.parse("Mga Ebreo 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Mga Ebreo 1:1'")
		expect(p.parse("Hebreo 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Hebreo 1:1'")
		expect(p.parse("Heb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heb 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("MGA HEBREO 1:1").osis()).toEqual("Heb.1.1", "parsing: 'MGA HEBREO 1:1'")
		expect(p.parse("MGA EBREO 1:1").osis()).toEqual("Heb.1.1", "parsing: 'MGA EBREO 1:1'")
		expect(p.parse("HEBREO 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEBREO 1:1'")
		expect(p.parse("HEB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEB 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jas (tl)", function() {
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
    return it("should handle book: Jas (tl)", function() {
      
		expect(p.parse("Santiago 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Santiago 1:1'")
		expect(p.parse("Jacobo 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jacobo 1:1'")
		expect(p.parse("Sant 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Sant 1:1'")
		expect(p.parse("Jas 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jas 1:1'")
		expect(p.parse("San 1:1").osis()).toEqual("Jas.1.1", "parsing: 'San 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("SANTIAGO 1:1").osis()).toEqual("Jas.1.1", "parsing: 'SANTIAGO 1:1'")
		expect(p.parse("JACOBO 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JACOBO 1:1'")
		expect(p.parse("SANT 1:1").osis()).toEqual("Jas.1.1", "parsing: 'SANT 1:1'")
		expect(p.parse("JAS 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAS 1:1'")
		expect(p.parse("SAN 1:1").osis()).toEqual("Jas.1.1", "parsing: 'SAN 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Pet (tl)", function() {
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
    return it("should handle book: 2Pet (tl)", function() {
      
		expect(p.parse("Ikalawang Pedro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Ikalawang Pedro 1:1'")
		expect(p.parse("II. Pedro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Pedro 1:1'")
		expect(p.parse("2. Pedro 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Pedro 1:1'")
		expect(p.parse("II Pedro 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Pedro 1:1'")
		expect(p.parse("2 Pedro 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Pedro 1:1'")
		expect(p.parse("2 Ped 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Ped 1:1'")
		expect(p.parse("2Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("IKALAWANG PEDRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'IKALAWANG PEDRO 1:1'")
		expect(p.parse("II. PEDRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. PEDRO 1:1'")
		expect(p.parse("2. PEDRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. PEDRO 1:1'")
		expect(p.parse("II PEDRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II PEDRO 1:1'")
		expect(p.parse("2 PEDRO 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PEDRO 1:1'")
		expect(p.parse("2 PED 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 PED 1:1'")
		expect(p.parse("2PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Pet (tl)", function() {
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
    return it("should handle book: 1Pet (tl)", function() {
      
		expect(p.parse("Unang Pedro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Unang Pedro 1:1'")
		expect(p.parse("Una Pedro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Una Pedro 1:1'")
		expect(p.parse("1. Pedro 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Pedro 1:1'")
		expect(p.parse("I. Pedro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Pedro 1:1'")
		expect(p.parse("1 Pedro 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Pedro 1:1'")
		expect(p.parse("I Pedro 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Pedro 1:1'")
		expect(p.parse("1 Ped 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Ped 1:1'")
		expect(p.parse("1Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("UNANG PEDRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'UNANG PEDRO 1:1'")
		expect(p.parse("UNA PEDRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'UNA PEDRO 1:1'")
		expect(p.parse("1. PEDRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. PEDRO 1:1'")
		expect(p.parse("I. PEDRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. PEDRO 1:1'")
		expect(p.parse("1 PEDRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PEDRO 1:1'")
		expect(p.parse("I PEDRO 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I PEDRO 1:1'")
		expect(p.parse("1 PED 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 PED 1:1'")
		expect(p.parse("1PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jude (tl)", function() {
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
    return it("should handle book: Jude (tl)", function() {
      
		expect(p.parse("Hudas 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Hudas 1:1'")
		expect(p.parse("Judas 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Judas 1:1'")
		expect(p.parse("Jude 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jude 1:1'")
		expect(p.parse("Jud 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jud 1:1'")
		expect(p.parse("Ju 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Ju 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("HUDAS 1:1").osis()).toEqual("Jude.1.1", "parsing: 'HUDAS 1:1'")
		expect(p.parse("JUDAS 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDAS 1:1'")
		expect(p.parse("JUDE 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDE 1:1'")
		expect(p.parse("JUD 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUD 1:1'")
		expect(p.parse("JU 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JU 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Tob (tl)", function() {
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
    return it("should handle book: Tob (tl)", function() {
      
		expect(p.parse("Tobias 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tobias 1:1'")
		expect(p.parse("Tobías 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tobías 1:1'")
		expect(p.parse("Tobit 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tobit 1:1'")
		expect(p.parse("Tob 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tob 1:1'")
		expect(p.parse("Tb 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tb 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jdt (tl)", function() {
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
    return it("should handle book: Jdt (tl)", function() {
      
		expect(p.parse("Judith 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Judith 1:1'")
		expect(p.parse("Judit 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Judit 1:1'")
		expect(p.parse("Jdt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Jdt 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bar (tl)", function() {
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
    return it("should handle book: Bar (tl)", function() {
      
		expect(p.parse("Baruch 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Baruch 1:1'")
		expect(p.parse("Barukh 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Barukh 1:1'")
		expect(p.parse("Baruc 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Baruc 1:1'")
		expect(p.parse("Baruk 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Baruk 1:1'")
		expect(p.parse("Bar 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bar 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sus (tl)", function() {
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
    return it("should handle book: Sus (tl)", function() {
      
		expect(p.parse("Si Susana 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Si Susana 1:1'")
		expect(p.parse("Susana 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Susana 1:1'")
		expect(p.parse("Sus 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Sus 1:1'")
		expect(p.parse("Su 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Su 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Macc (tl)", function() {
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
    return it("should handle book: 2Macc (tl)", function() {
      
		expect(p.parse("Ikalawang Mga Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Ikalawang Mga Macabeo 1:1'")
		expect(p.parse("Ikalawang Macabeos 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Ikalawang Macabeos 1:1'")
		expect(p.parse("Ikalawang Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Ikalawang Macabeo 1:1'")
		expect(p.parse("II. Mga Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Mga Macabeo 1:1'")
		expect(p.parse("2. Mga Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Mga Macabeo 1:1'")
		expect(p.parse("II Mga Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Mga Macabeo 1:1'")
		expect(p.parse("2 Mga Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Mga Macabeo 1:1'")
		expect(p.parse("II. Macabeos 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Macabeos 1:1'")
		expect(p.parse("2. Macabeos 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Macabeos 1:1'")
		expect(p.parse("II Macabeos 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Macabeos 1:1'")
		expect(p.parse("II. Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Macabeo 1:1'")
		expect(p.parse("2 Macabeos 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Macabeos 1:1'")
		expect(p.parse("2. Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Macabeo 1:1'")
		expect(p.parse("II Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Macabeo 1:1'")
		expect(p.parse("2 Macabeo 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Macabeo 1:1'")
		expect(p.parse("2 Mcb 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Mcb 1:1'")
		expect(p.parse("2Macc 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3Macc (tl)", function() {
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
    return it("should handle book: 3Macc (tl)", function() {
      
		expect(p.parse("Ikatlong Mga Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Ikatlong Mga Macabeo 1:1'")
		expect(p.parse("Ikatlong Macabeos 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Ikatlong Macabeos 1:1'")
		expect(p.parse("III. Mga Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Mga Macabeo 1:1'")
		expect(p.parse("Ikatlong Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Ikatlong Macabeo 1:1'")
		expect(p.parse("III Mga Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Mga Macabeo 1:1'")
		expect(p.parse("3. Mga Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Mga Macabeo 1:1'")
		expect(p.parse("3 Mga Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Mga Macabeo 1:1'")
		expect(p.parse("III. Macabeos 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Macabeos 1:1'")
		expect(p.parse("III Macabeos 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Macabeos 1:1'")
		expect(p.parse("III. Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Macabeo 1:1'")
		expect(p.parse("3. Macabeos 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Macabeos 1:1'")
		expect(p.parse("III Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Macabeo 1:1'")
		expect(p.parse("3 Macabeos 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Macabeos 1:1'")
		expect(p.parse("3. Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Macabeo 1:1'")
		expect(p.parse("3 Macabeo 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Macabeo 1:1'")
		expect(p.parse("3 Mcb 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Mcb 1:1'")
		expect(p.parse("3Macc 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 4Macc (tl)", function() {
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
    return it("should handle book: 4Macc (tl)", function() {
      
		expect(p.parse("Ikaapat Mga Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Ikaapat Mga Macabeo 1:1'")
		expect(p.parse("Ikaapat Macabeos 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Ikaapat Macabeos 1:1'")
		expect(p.parse("IV. Mga Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Mga Macabeo 1:1'")
		expect(p.parse("Ikaapat Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Ikaapat Macabeo 1:1'")
		expect(p.parse("4. Mga Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Mga Macabeo 1:1'")
		expect(p.parse("IV Mga Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Mga Macabeo 1:1'")
		expect(p.parse("4 Mga Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Mga Macabeo 1:1'")
		expect(p.parse("IV. Macabeos 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Macabeos 1:1'")
		expect(p.parse("4. Macabeos 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Macabeos 1:1'")
		expect(p.parse("IV Macabeos 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Macabeos 1:1'")
		expect(p.parse("IV. Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Macabeo 1:1'")
		expect(p.parse("4 Macabeos 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Macabeos 1:1'")
		expect(p.parse("4. Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Macabeo 1:1'")
		expect(p.parse("IV Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Macabeo 1:1'")
		expect(p.parse("4 Macabeo 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Macabeo 1:1'")
		expect(p.parse("4 Mcb 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Mcb 1:1'")
		expect(p.parse("4Macc 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Macc (tl)", function() {
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
    return it("should handle book: 1Macc (tl)", function() {
      
		expect(p.parse("Unang Mga Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Unang Mga Macabeo 1:1'")
		expect(p.parse("Una Mga Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Una Mga Macabeo 1:1'")
		expect(p.parse("1. Mga Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Mga Macabeo 1:1'")
		expect(p.parse("I. Mga Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Mga Macabeo 1:1'")
		expect(p.parse("Unang Macabeos 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Unang Macabeos 1:1'")
		expect(p.parse("1 Mga Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Mga Macabeo 1:1'")
		expect(p.parse("I Mga Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Mga Macabeo 1:1'")
		expect(p.parse("Unang Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Unang Macabeo 1:1'")
		expect(p.parse("Una Macabeos 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Una Macabeos 1:1'")
		expect(p.parse("1. Macabeos 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Macabeos 1:1'")
		expect(p.parse("I. Macabeos 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Macabeos 1:1'")
		expect(p.parse("Una Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Una Macabeo 1:1'")
		expect(p.parse("1 Macabeos 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Macabeos 1:1'")
		expect(p.parse("1. Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Macabeo 1:1'")
		expect(p.parse("I Macabeos 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Macabeos 1:1'")
		expect(p.parse("I. Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Macabeo 1:1'")
		expect(p.parse("1 Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Macabeo 1:1'")
		expect(p.parse("I Macabeo 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Macabeo 1:1'")
		expect(p.parse("1 Mcb 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Mcb 1:1'")
		expect(p.parse("1Macc 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezek,Ezra (tl)", function() {
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
    return it("should handle book: Ezek,Ezra (tl)", function() {
      
		expect(p.parse("Ez 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ez 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("EZ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZ 1:1'")
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
      return expect(p.languages).toEqual(["tl"]);
    });
    it("should handle ranges (tl)", function() {
      expect(p.parse("Titus 1:1 - 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 - 2'");
      expect(p.parse("Matt 1-2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1-2'");
      return expect(p.parse("Phlm 2 - 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 - 3'");
    });
    it("should handle chapters (tl)", function() {
      expect(p.parse("Titus 1:1, pangkat 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, pangkat 2'");
      expect(p.parse("Matt 3:4 PANGKAT 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 PANGKAT 6'");
      expect(p.parse("Titus 1:1, pang 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, pang 2'");
      expect(p.parse("Matt 3:4 PANG 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 PANG 6'");
      expect(p.parse("Titus 1:1, kapitulo 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, kapitulo 2'");
      expect(p.parse("Matt 3:4 KAPITULO 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 KAPITULO 6'");
      expect(p.parse("Titus 1:1, kap 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, kap 2'");
      return expect(p.parse("Matt 3:4 KAP 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 KAP 6'");
    });
    it("should handle verses (tl)", function() {
      expect(p.parse("Exod 1:1 talatang 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 talatang 3'");
      expect(p.parse("Phlm TALATANG 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm TALATANG 6'");
      expect(p.parse("Exod 1:1 tal. 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 tal. 3'");
      expect(p.parse("Phlm TAL. 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm TAL. 6'");
      expect(p.parse("Exod 1:1 tal 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 tal 3'");
      return expect(p.parse("Phlm TAL 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm TAL 6'");
    });
    it("should handle 'and' (tl)", function() {
      expect(p.parse("Exod 1:1 at 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 at 3'");
      return expect(p.parse("Phlm 2 AT 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 AT 6'");
    });
    it("should handle titles (tl)", function() {
      expect(p.parse("Ps 3 titik, 4:2, 5:titik").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 titik, 4:2, 5:titik'");
      expect(p.parse("PS 3 TITIK, 4:2, 5:TITIK").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 TITIK, 4:2, 5:TITIK'");
      expect(p.parse("Ps 3 pamagat, 4:2, 5:pamagat").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 pamagat, 4:2, 5:pamagat'");
      return expect(p.parse("PS 3 PAMAGAT, 4:2, 5:PAMAGAT").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 PAMAGAT, 4:2, 5:PAMAGAT'");
    });
    it("should handle 'ff' (tl)", function() {
      expect(p.parse("Rev 3k, 4:2k").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3k, 4:2k'");
      return expect(p.parse("REV 3 K, 4:2 K").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'REV 3 K, 4:2 K'");
    });
    it("should handle translations (tl)", function() {
      expect(p.parse("Lev 1 (ASND)").osis_and_translations()).toEqual([["Lev.1", "ASND"]]);
      return expect(p.parse("lev 1 asnd").osis_and_translations()).toEqual([["Lev.1", "ASND"]]);
    });
    it("should handle book ranges (tl)", function() {
      p.set_options({
        book_alone_strategy: "full",
        book_range_strategy: "include"
      });
      return expect(p.parse("Unang - Ikatlong  Juan").osis()).toEqual("1John.1-3John.1", "parsing: 'Unang - Ikatlong  Juan'");
    });
    return it("should handle boundaries (tl)", function() {
      p.set_options({
        book_alone_strategy: "full"
      });
      expect(p.parse("\u2014Matt\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\u2014Matt\u2014'");
      return expect(p.parse("\u201cMatt 1:1\u201d").osis()).toEqual("Matt.1.1", "parsing: '\u201cMatt 1:1\u201d'");
    });
  });

}).call(this);
