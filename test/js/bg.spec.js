(function() {
  var bcv_parser;

  bcv_parser = require("../../js/bg_bcv_parser.js").bcv_parser;

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

  describe("Localized book Gen (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Gen (bg)", function() {
      
		expect(p.parse("Първа книга Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Първа книга Моисеева 1:1'")
		expect(p.parse("Първа Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Първа Моисеева 1:1'")
		expect(p.parse("Първо Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Първо Моисеева 1:1'")
		expect(p.parse("1. Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: '1. Моисеева 1:1'")
		expect(p.parse("I. Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I. Моисеева 1:1'")
		expect(p.parse("1 Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 Моисеева 1:1'")
		expect(p.parse("I Моисеева 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I Моисеева 1:1'")
		expect(p.parse("Битие 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Битие 1:1'")
		expect(p.parse("Gen 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Gen 1:1'")
		expect(p.parse("Бит 1:1").osis()).toEqual("Gen.1.1", "parsing: 'Бит 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВА КНИГА МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ПЪРВА КНИГА МОИСЕЕВА 1:1'")
		expect(p.parse("ПЪРВА МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ПЪРВА МОИСЕЕВА 1:1'")
		expect(p.parse("ПЪРВО МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: 'ПЪРВО МОИСЕЕВА 1:1'")
		expect(p.parse("1. МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: '1. МОИСЕЕВА 1:1'")
		expect(p.parse("I. МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I. МОИСЕЕВА 1:1'")
		expect(p.parse("1 МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: '1 МОИСЕЕВА 1:1'")
		expect(p.parse("I МОИСЕЕВА 1:1").osis()).toEqual("Gen.1.1", "parsing: 'I МОИСЕЕВА 1:1'")
		expect(p.parse("БИТИЕ 1:1").osis()).toEqual("Gen.1.1", "parsing: 'БИТИЕ 1:1'")
		expect(p.parse("GEN 1:1").osis()).toEqual("Gen.1.1", "parsing: 'GEN 1:1'")
		expect(p.parse("БИТ 1:1").osis()).toEqual("Gen.1.1", "parsing: 'БИТ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Exod (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Exod (bg)", function() {
      
		expect(p.parse("Втора книга Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Втора книга Моисеева 1:1'")
		expect(p.parse("Втора Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Втора Моисеева 1:1'")
		expect(p.parse("Второ Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Второ Моисеева 1:1'")
		expect(p.parse("II. Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II. Моисеева 1:1'")
		expect(p.parse("2. Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: '2. Моисеева 1:1'")
		expect(p.parse("II Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II Моисеева 1:1'")
		expect(p.parse("2 Моисеева 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 Моисеева 1:1'")
		expect(p.parse("Изход 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Изход 1:1'")
		expect(p.parse("Exod 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Exod 1:1'")
		expect(p.parse("Изх 1:1").osis()).toEqual("Exod.1.1", "parsing: 'Изх 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРА КНИГА МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: 'ВТОРА КНИГА МОИСЕЕВА 1:1'")
		expect(p.parse("ВТОРА МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: 'ВТОРА МОИСЕЕВА 1:1'")
		expect(p.parse("ВТОРО МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: 'ВТОРО МОИСЕЕВА 1:1'")
		expect(p.parse("II. МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II. МОИСЕЕВА 1:1'")
		expect(p.parse("2. МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: '2. МОИСЕЕВА 1:1'")
		expect(p.parse("II МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: 'II МОИСЕЕВА 1:1'")
		expect(p.parse("2 МОИСЕЕВА 1:1").osis()).toEqual("Exod.1.1", "parsing: '2 МОИСЕЕВА 1:1'")
		expect(p.parse("ИЗХОД 1:1").osis()).toEqual("Exod.1.1", "parsing: 'ИЗХОД 1:1'")
		expect(p.parse("EXOD 1:1").osis()).toEqual("Exod.1.1", "parsing: 'EXOD 1:1'")
		expect(p.parse("ИЗХ 1:1").osis()).toEqual("Exod.1.1", "parsing: 'ИЗХ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bel (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Bel (bg)", function() {
      
		expect(p.parse("Вил и змеят 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Вил и змеят 1:1'")
		expect(p.parse("Bel 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Bel 1:1'")
		expect(p.parse("Бел 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Бел 1:1'")
		expect(p.parse("Вил 1:1").osis()).toEqual("Bel.1.1", "parsing: 'Вил 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lev (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Lev (bg)", function() {
      
		expect(p.parse("Трета книга Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Трета книга Моисеева 1:1'")
		expect(p.parse("Трета Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Трета Моисеева 1:1'")
		expect(p.parse("Трето Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Трето Моисеева 1:1'")
		expect(p.parse("III. Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III. Моисеева 1:1'")
		expect(p.parse("III Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III Моисеева 1:1'")
		expect(p.parse("3. Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: '3. Моисеева 1:1'")
		expect(p.parse("3 Моисеева 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 Моисеева 1:1'")
		expect(p.parse("Левит 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Левит 1:1'")
		expect(p.parse("Lev 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Lev 1:1'")
		expect(p.parse("Лев 1:1").osis()).toEqual("Lev.1.1", "parsing: 'Лев 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ТРЕТА КНИГА МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: 'ТРЕТА КНИГА МОИСЕЕВА 1:1'")
		expect(p.parse("ТРЕТА МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: 'ТРЕТА МОИСЕЕВА 1:1'")
		expect(p.parse("ТРЕТО МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: 'ТРЕТО МОИСЕЕВА 1:1'")
		expect(p.parse("III. МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III. МОИСЕЕВА 1:1'")
		expect(p.parse("III МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: 'III МОИСЕЕВА 1:1'")
		expect(p.parse("3. МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: '3. МОИСЕЕВА 1:1'")
		expect(p.parse("3 МОИСЕЕВА 1:1").osis()).toEqual("Lev.1.1", "parsing: '3 МОИСЕЕВА 1:1'")
		expect(p.parse("ЛЕВИТ 1:1").osis()).toEqual("Lev.1.1", "parsing: 'ЛЕВИТ 1:1'")
		expect(p.parse("LEV 1:1").osis()).toEqual("Lev.1.1", "parsing: 'LEV 1:1'")
		expect(p.parse("ЛЕВ 1:1").osis()).toEqual("Lev.1.1", "parsing: 'ЛЕВ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Num (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Num (bg)", function() {
      
		expect(p.parse("Четвърта книга Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: 'Четвърта книга Моисеева 1:1'")
		expect(p.parse("Четвърта Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: 'Четвърта Моисеева 1:1'")
		expect(p.parse("Четвърто Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: 'Четвърто Моисеева 1:1'")
		expect(p.parse("IV. Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV. Моисеева 1:1'")
		expect(p.parse("4. Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: '4. Моисеева 1:1'")
		expect(p.parse("IV Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV Моисеева 1:1'")
		expect(p.parse("4 Моисеева 1:1").osis()).toEqual("Num.1.1", "parsing: '4 Моисеева 1:1'")
		expect(p.parse("Числа 1:1").osis()).toEqual("Num.1.1", "parsing: 'Числа 1:1'")
		expect(p.parse("Числ 1:1").osis()).toEqual("Num.1.1", "parsing: 'Числ 1:1'")
		expect(p.parse("Num 1:1").osis()).toEqual("Num.1.1", "parsing: 'Num 1:1'")
		expect(p.parse("Чис 1:1").osis()).toEqual("Num.1.1", "parsing: 'Чис 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ЧЕТВЪРТА КНИГА МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: 'ЧЕТВЪРТА КНИГА МОИСЕЕВА 1:1'")
		expect(p.parse("ЧЕТВЪРТА МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: 'ЧЕТВЪРТА МОИСЕЕВА 1:1'")
		expect(p.parse("ЧЕТВЪРТО МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: 'ЧЕТВЪРТО МОИСЕЕВА 1:1'")
		expect(p.parse("IV. МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV. МОИСЕЕВА 1:1'")
		expect(p.parse("4. МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: '4. МОИСЕЕВА 1:1'")
		expect(p.parse("IV МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: 'IV МОИСЕЕВА 1:1'")
		expect(p.parse("4 МОИСЕЕВА 1:1").osis()).toEqual("Num.1.1", "parsing: '4 МОИСЕЕВА 1:1'")
		expect(p.parse("ЧИСЛА 1:1").osis()).toEqual("Num.1.1", "parsing: 'ЧИСЛА 1:1'")
		expect(p.parse("ЧИСЛ 1:1").osis()).toEqual("Num.1.1", "parsing: 'ЧИСЛ 1:1'")
		expect(p.parse("NUM 1:1").osis()).toEqual("Num.1.1", "parsing: 'NUM 1:1'")
		expect(p.parse("ЧИС 1:1").osis()).toEqual("Num.1.1", "parsing: 'ЧИС 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sir (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Sir (bg)", function() {
      
		expect(p.parse("Книга Премъдрост на Иисуса, син Сирахов 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Книга Премъдрост на Иисуса, син Сирахов 1:1'")
		expect(p.parse("Премъдрост на Иисус, син Сирахов 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Премъдрост на Иисус, син Сирахов 1:1'")
		expect(p.parse("Книга на Сирах 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Книга на Сирах 1:1'")
		expect(p.parse("Сирахов 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Сирахов 1:1'")
		expect(p.parse("Сирах 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Сирах 1:1'")
		expect(p.parse("Sir 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Sir 1:1'")
		expect(p.parse("Сир 1:1").osis()).toEqual("Sir.1.1", "parsing: 'Сир 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Wis (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Wis (bg)", function() {
      
		expect(p.parse("Книга Премъдрост Соломонова 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Книга Премъдрост Соломонова 1:1'")
		expect(p.parse("Премъдрост Соломонова 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Премъдрост Соломонова 1:1'")
		expect(p.parse("Премъдрост на Соломон 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Премъдрост на Соломон 1:1'")
		expect(p.parse("Книга на мъдростта 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Книга на мъдростта 1:1'")
		expect(p.parse("Премъдрост 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Премъдрост 1:1'")
		expect(p.parse("Прем 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Прем 1:1'")
		expect(p.parse("Wis 1:1").osis()).toEqual("Wis.1.1", "parsing: 'Wis 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Lam (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Lam (bg)", function() {
      
		expect(p.parse("Книга Плач Иеремиев 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Книга Плач Иеремиев 1:1'")
		expect(p.parse("Плачът на Иеремия 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плачът на Иеремия 1:1'")
		expect(p.parse("Плачът на Йеремия 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плачът на Йеремия 1:1'")
		expect(p.parse("Плачът на Еремия 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плачът на Еремия 1:1'")
		expect(p.parse("Плач Иеремиев 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плач Иеремиев 1:1'")
		expect(p.parse("Плач Еремиев 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плач Еремиев 1:1'")
		expect(p.parse("Плач Иер 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плач Иер 1:1'")
		expect(p.parse("П. Иер 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П. Иер 1:1'")
		expect(p.parse("П. Йер 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П. Йер 1:1'")
		expect(p.parse("П Иер 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П Иер 1:1'")
		expect(p.parse("П Йер 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П Йер 1:1'")
		expect(p.parse("Плач 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Плач 1:1'")
		expect(p.parse("Lam 1:1").osis()).toEqual("Lam.1.1", "parsing: 'Lam 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА ПЛАЧ ИЕРЕМИЕВ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'КНИГА ПЛАЧ ИЕРЕМИЕВ 1:1'")
		expect(p.parse("ПЛАЧЪТ НА ИЕРЕМИЯ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧЪТ НА ИЕРЕМИЯ 1:1'")
		expect(p.parse("ПЛАЧЪТ НА ЙЕРЕМИЯ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧЪТ НА ЙЕРЕМИЯ 1:1'")
		expect(p.parse("ПЛАЧЪТ НА ЕРЕМИЯ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧЪТ НА ЕРЕМИЯ 1:1'")
		expect(p.parse("ПЛАЧ ИЕРЕМИЕВ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧ ИЕРЕМИЕВ 1:1'")
		expect(p.parse("ПЛАЧ ЕРЕМИЕВ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧ ЕРЕМИЕВ 1:1'")
		expect(p.parse("ПЛАЧ ИЕР 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧ ИЕР 1:1'")
		expect(p.parse("П. ИЕР 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П. ИЕР 1:1'")
		expect(p.parse("П. ЙЕР 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П. ЙЕР 1:1'")
		expect(p.parse("П ИЕР 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П ИЕР 1:1'")
		expect(p.parse("П ЙЕР 1:1").osis()).toEqual("Lam.1.1", "parsing: 'П ЙЕР 1:1'")
		expect(p.parse("ПЛАЧ 1:1").osis()).toEqual("Lam.1.1", "parsing: 'ПЛАЧ 1:1'")
		expect(p.parse("LAM 1:1").osis()).toEqual("Lam.1.1", "parsing: 'LAM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book EpJer (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: EpJer (bg)", function() {
      
		expect(p.parse("Послание на Иеремия 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Послание на Иеремия 1:1'")
		expect(p.parse("Послание на Йеремия 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Послание на Йеремия 1:1'")
		expect(p.parse("Поел. Иер 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Поел. Иер 1:1'")
		expect(p.parse("Поел Иер 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Поел Иер 1:1'")
		expect(p.parse("Пос. Иер 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Пос. Иер 1:1'")
		expect(p.parse("Пос. Йер 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Пос. Йер 1:1'")
		expect(p.parse("Пос Иер 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Пос Иер 1:1'")
		expect(p.parse("Пос Йер 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'Пос Йер 1:1'")
		expect(p.parse("EpJer 1:1").osis()).toEqual("EpJer.1.1", "parsing: 'EpJer 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rev (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Rev (bg)", function() {
      
		expect(p.parse("Откровение на св. Иоана Богослова 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровение на св. Иоана Богослова 1:1'")
		expect(p.parse("Откровение на св Иоана Богослова 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровение на св Иоана Богослова 1:1'")
		expect(p.parse("Откровението на Иоан 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровението на Иоан 1:1'")
		expect(p.parse("Откровението на Йоан 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровението на Йоан 1:1'")
		expect(p.parse("Откровение на Иоан 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровение на Иоан 1:1'")
		expect(p.parse("Откровение на Йоан 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровение на Йоан 1:1'")
		expect(p.parse("Апокалипсис 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Апокалипсис 1:1'")
		expect(p.parse("Откровение 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откровение 1:1'")
		expect(p.parse("Откр 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Откр 1:1'")
		expect(p.parse("Rev 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Rev 1:1'")
		expect(p.parse("Отк 1:1").osis()).toEqual("Rev.1.1", "parsing: 'Отк 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ОТКРОВЕНИЕ НА СВ. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕ НА СВ. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ОТКРОВЕНИЕ НА СВ ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕ НА СВ ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ОТКРОВЕНИЕТО НА ИОАН 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕТО НА ИОАН 1:1'")
		expect(p.parse("ОТКРОВЕНИЕТО НА ЙОАН 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕТО НА ЙОАН 1:1'")
		expect(p.parse("ОТКРОВЕНИЕ НА ИОАН 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕ НА ИОАН 1:1'")
		expect(p.parse("ОТКРОВЕНИЕ НА ЙОАН 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕ НА ЙОАН 1:1'")
		expect(p.parse("АПОКАЛИПСИС 1:1").osis()).toEqual("Rev.1.1", "parsing: 'АПОКАЛИПСИС 1:1'")
		expect(p.parse("ОТКРОВЕНИЕ 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКРОВЕНИЕ 1:1'")
		expect(p.parse("ОТКР 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТКР 1:1'")
		expect(p.parse("REV 1:1").osis()).toEqual("Rev.1.1", "parsing: 'REV 1:1'")
		expect(p.parse("ОТК 1:1").osis()).toEqual("Rev.1.1", "parsing: 'ОТК 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrMan (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: PrMan (bg)", function() {
      
		expect(p.parse("Молитвата на Манасия 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Молитвата на Манасия 1:1'")
		expect(p.parse("Манасия 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'Манасия 1:1'")
		expect(p.parse("М. Ман 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'М. Ман 1:1'")
		expect(p.parse("PrMan 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'PrMan 1:1'")
		expect(p.parse("М Ман 1:1").osis()).toEqual("PrMan.1.1", "parsing: 'М Ман 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Deut (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Deut (bg)", function() {
      
		expect(p.parse("Пета книга Моисеева 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Пета книга Моисеева 1:1'")
		expect(p.parse("Второзаконие 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Второзаконие 1:1'")
		expect(p.parse("5 Моисеева 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 Моисеева 1:1'")
		expect(p.parse("Второзак 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Второзак 1:1'")
		expect(p.parse("Deut 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Deut 1:1'")
		expect(p.parse("Втор 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Втор 1:1'")
		expect(p.parse("Вт 1:1").osis()).toEqual("Deut.1.1", "parsing: 'Вт 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЕТА КНИГА МОИСЕЕВА 1:1").osis()).toEqual("Deut.1.1", "parsing: 'ПЕТА КНИГА МОИСЕЕВА 1:1'")
		expect(p.parse("ВТОРОЗАКОНИЕ 1:1").osis()).toEqual("Deut.1.1", "parsing: 'ВТОРОЗАКОНИЕ 1:1'")
		expect(p.parse("5 МОИСЕЕВА 1:1").osis()).toEqual("Deut.1.1", "parsing: '5 МОИСЕЕВА 1:1'")
		expect(p.parse("ВТОРОЗАК 1:1").osis()).toEqual("Deut.1.1", "parsing: 'ВТОРОЗАК 1:1'")
		expect(p.parse("DEUT 1:1").osis()).toEqual("Deut.1.1", "parsing: 'DEUT 1:1'")
		expect(p.parse("ВТОР 1:1").osis()).toEqual("Deut.1.1", "parsing: 'ВТОР 1:1'")
		expect(p.parse("ВТ 1:1").osis()).toEqual("Deut.1.1", "parsing: 'ВТ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Josh (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Josh (bg)", function() {
      
		expect(p.parse("Книга на Исус Навиев 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Книга на Исус Навиев 1:1'")
		expect(p.parse("Книга Иисус Навин 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Книга Иисус Навин 1:1'")
		expect(p.parse("Иисус Навин 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Иисус Навин 1:1'")
		expect(p.parse("Исус Навиев 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Исус Навиев 1:1'")
		expect(p.parse("Исус Навин 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Исус Навин 1:1'")
		expect(p.parse("Иис. Нав 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Иис. Нав 1:1'")
		expect(p.parse("Иис Нав 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Иис Нав 1:1'")
		expect(p.parse("Ис. Нав 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Ис. Нав 1:1'")
		expect(p.parse("Ис Нав 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Ис Нав 1:1'")
		expect(p.parse("Josh 1:1").osis()).toEqual("Josh.1.1", "parsing: 'Josh 1:1'")
		expect(p.parse("И. Н 1:1").osis()).toEqual("Josh.1.1", "parsing: 'И. Н 1:1'")
		expect(p.parse("И.Н 1:1").osis()).toEqual("Josh.1.1", "parsing: 'И.Н 1:1'")
		expect(p.parse("И Н 1:1").osis()).toEqual("Josh.1.1", "parsing: 'И Н 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ИСУС НАВИЕВ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'КНИГА НА ИСУС НАВИЕВ 1:1'")
		expect(p.parse("КНИГА ИИСУС НАВИН 1:1").osis()).toEqual("Josh.1.1", "parsing: 'КНИГА ИИСУС НАВИН 1:1'")
		expect(p.parse("ИИСУС НАВИН 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИИСУС НАВИН 1:1'")
		expect(p.parse("ИСУС НАВИЕВ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИСУС НАВИЕВ 1:1'")
		expect(p.parse("ИСУС НАВИН 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИСУС НАВИН 1:1'")
		expect(p.parse("ИИС. НАВ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИИС. НАВ 1:1'")
		expect(p.parse("ИИС НАВ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИИС НАВ 1:1'")
		expect(p.parse("ИС. НАВ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИС. НАВ 1:1'")
		expect(p.parse("ИС НАВ 1:1").osis()).toEqual("Josh.1.1", "parsing: 'ИС НАВ 1:1'")
		expect(p.parse("JOSH 1:1").osis()).toEqual("Josh.1.1", "parsing: 'JOSH 1:1'")
		expect(p.parse("И. Н 1:1").osis()).toEqual("Josh.1.1", "parsing: 'И. Н 1:1'")
		expect(p.parse("И.Н 1:1").osis()).toEqual("Josh.1.1", "parsing: 'И.Н 1:1'")
		expect(p.parse("И Н 1:1").osis()).toEqual("Josh.1.1", "parsing: 'И Н 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Judg (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Judg (bg)", function() {
      
		expect(p.parse("Книга Съдии Израилеви 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Книга Съдии Израилеви 1:1'")
		expect(p.parse("Книга на съдиите 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Книга на съдиите 1:1'")
		expect(p.parse("Съдии Израилеви 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Съдии Израилеви 1:1'")
		expect(p.parse("Съдии 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Съдии 1:1'")
		expect(p.parse("Judg 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Judg 1:1'")
		expect(p.parse("Съд 1:1").osis()).toEqual("Judg.1.1", "parsing: 'Съд 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА СЪДИИ ИЗРАИЛЕВИ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'КНИГА СЪДИИ ИЗРАИЛЕВИ 1:1'")
		expect(p.parse("КНИГА НА СЪДИИТЕ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'КНИГА НА СЪДИИТЕ 1:1'")
		expect(p.parse("СЪДИИ ИЗРАИЛЕВИ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'СЪДИИ ИЗРАИЛЕВИ 1:1'")
		expect(p.parse("СЪДИИ 1:1").osis()).toEqual("Judg.1.1", "parsing: 'СЪДИИ 1:1'")
		expect(p.parse("JUDG 1:1").osis()).toEqual("Judg.1.1", "parsing: 'JUDG 1:1'")
		expect(p.parse("СЪД 1:1").osis()).toEqual("Judg.1.1", "parsing: 'СЪД 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ruth (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ruth (bg)", function() {
      
		expect(p.parse("Книга Рут 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Книга Рут 1:1'")
		expect(p.parse("Ruth 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Ruth 1:1'")
		expect(p.parse("Рут 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'Рут 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА РУТ 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'КНИГА РУТ 1:1'")
		expect(p.parse("RUTH 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'RUTH 1:1'")
		expect(p.parse("РУТ 1:1").osis()).toEqual("Ruth.1.1", "parsing: 'РУТ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Esd (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Esd (bg)", function() {
      
		expect(p.parse("Първа книга на Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Първа книга на Ездра 1:1'")
		expect(p.parse("Първа Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Първа Ездра 1:1'")
		expect(p.parse("Първо Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'Първо Ездра 1:1'")
		expect(p.parse("1. Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1. Ездра 1:1'")
		expect(p.parse("I. Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I. Ездра 1:1'")
		expect(p.parse("1 Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ездра 1:1'")
		expect(p.parse("I Ездра 1:1").osis()).toEqual("1Esd.1.1", "parsing: 'I Ездра 1:1'")
		expect(p.parse("1 Ездр 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Ездр 1:1'")
		expect(p.parse("1 Езд 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1 Езд 1:1'")
		expect(p.parse("1Esd 1:1").osis()).toEqual("1Esd.1.1", "parsing: '1Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Esd (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Esd (bg)", function() {
      
		expect(p.parse("Втора книга на Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Втора книга на Ездра 1:1'")
		expect(p.parse("Втора Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Втора Ездра 1:1'")
		expect(p.parse("Второ Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Второ Ездра 1:1'")
		expect(p.parse("Трета Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Трета Ездра 1:1'")
		expect(p.parse("Трето Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'Трето Ездра 1:1'")
		expect(p.parse("III. Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'III. Ездра 1:1'")
		expect(p.parse("II. Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II. Ездра 1:1'")
		expect(p.parse("III Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'III Ездра 1:1'")
		expect(p.parse("2. Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2. Ездра 1:1'")
		expect(p.parse("3. Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: '3. Ездра 1:1'")
		expect(p.parse("II Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: 'II Ездра 1:1'")
		expect(p.parse("2 Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ездра 1:1'")
		expect(p.parse("3 Ездра 1:1").osis()).toEqual("2Esd.1.1", "parsing: '3 Ездра 1:1'")
		expect(p.parse("2 Ездр 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Ездр 1:1'")
		expect(p.parse("3 Ездр 1:1").osis()).toEqual("2Esd.1.1", "parsing: '3 Ездр 1:1'")
		expect(p.parse("2 Езд 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2 Езд 1:1'")
		expect(p.parse("2Esd 1:1").osis()).toEqual("2Esd.1.1", "parsing: '2Esd 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Isa (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Isa (bg)", function() {
      
		expect(p.parse("Книга на пророк Исаия 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Книга на пророк Исаия 1:1'")
		expect(p.parse("Исаия 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Исаия 1:1'")
		expect(p.parse("Исая 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Исая 1:1'")
		expect(p.parse("Isa 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Isa 1:1'")
		expect(p.parse("Ис 1:1").osis()).toEqual("Isa.1.1", "parsing: 'Ис 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ИСАИЯ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'КНИГА НА ПРОРОК ИСАИЯ 1:1'")
		expect(p.parse("ИСАИЯ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ИСАИЯ 1:1'")
		expect(p.parse("ИСАЯ 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ИСАЯ 1:1'")
		expect(p.parse("ISA 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ISA 1:1'")
		expect(p.parse("ИС 1:1").osis()).toEqual("Isa.1.1", "parsing: 'ИС 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Sam (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Sam (bg)", function() {
      
		expect(p.parse("Втора Книга на царете 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора Книга на царете 1:1'")
		expect(p.parse("Втора книга на Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора книга на Самуил 1:1'")
		expect(p.parse("Второ Книга на царете 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Второ Книга на царете 1:1'")
		expect(p.parse("II. Книга на царете 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Книга на царете 1:1'")
		expect(p.parse("Втора книга Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора книга Царства 1:1'")
		expect(p.parse("2. Книга на царете 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Книга на царете 1:1'")
		expect(p.parse("II Книга на царете 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Книга на царете 1:1'")
		expect(p.parse("2 Книга на царете 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Книга на царете 1:1'")
		expect(p.parse("Втора Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора Царства 1:1'")
		expect(p.parse("Второ Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Второ Царства 1:1'")
		expect(p.parse("Втора Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора Самуил 1:1'")
		expect(p.parse("Втора Царств 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора Царств 1:1'")
		expect(p.parse("Второ Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Второ Самуил 1:1'")
		expect(p.parse("Второ Царств 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Второ Царств 1:1'")
		expect(p.parse("II. Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Царства 1:1'")
		expect(p.parse("2. Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Царства 1:1'")
		expect(p.parse("II Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Царства 1:1'")
		expect(p.parse("II. Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Самуил 1:1'")
		expect(p.parse("II. Царств 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Царств 1:1'")
		expect(p.parse("Втора Царе 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора Царе 1:1'")
		expect(p.parse("Второ Царе 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Второ Царе 1:1'")
		expect(p.parse("2 Царства 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Царства 1:1'")
		expect(p.parse("2. Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Самуил 1:1'")
		expect(p.parse("2. Царств 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Царств 1:1'")
		expect(p.parse("II Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Самуил 1:1'")
		expect(p.parse("II Царств 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Царств 1:1'")
		expect(p.parse("Втора Цар 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Втора Цар 1:1'")
		expect(p.parse("Второ Цар 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'Второ Цар 1:1'")
		expect(p.parse("2 Самуил 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Самуил 1:1'")
		expect(p.parse("2 Царств 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Царств 1:1'")
		expect(p.parse("II. Царе 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Царе 1:1'")
		expect(p.parse("2. Царе 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Царе 1:1'")
		expect(p.parse("II Царе 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Царе 1:1'")
		expect(p.parse("II. Цар 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. Цар 1:1'")
		expect(p.parse("2 Царе 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Царе 1:1'")
		expect(p.parse("2. Цар 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. Цар 1:1'")
		expect(p.parse("II Цар 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II Цар 1:1'")
		expect(p.parse("2 Цар 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Цар 1:1'")
		expect(p.parse("2Sam 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2Sam 1:1'")
		expect(p.parse("2 Ц 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Ц 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРА КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ВТОРА КНИГА НА САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА КНИГА НА САМУИЛ 1:1'")
		expect(p.parse("ВТОРО КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРО КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("II. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ВТОРА КНИГА ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА КНИГА ЦАРСТВА 1:1'")
		expect(p.parse("2. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("II КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("2 КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ВТОРА ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА ЦАРСТВА 1:1'")
		expect(p.parse("ВТОРО ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРО ЦАРСТВА 1:1'")
		expect(p.parse("ВТОРА САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА САМУИЛ 1:1'")
		expect(p.parse("ВТОРА ЦАРСТВ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА ЦАРСТВ 1:1'")
		expect(p.parse("ВТОРО САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРО САМУИЛ 1:1'")
		expect(p.parse("ВТОРО ЦАРСТВ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРО ЦАРСТВ 1:1'")
		expect(p.parse("II. ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. ЦАРСТВА 1:1'")
		expect(p.parse("2. ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. ЦАРСТВА 1:1'")
		expect(p.parse("II ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II ЦАРСТВА 1:1'")
		expect(p.parse("II. САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. САМУИЛ 1:1'")
		expect(p.parse("II. ЦАРСТВ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. ЦАРСТВ 1:1'")
		expect(p.parse("ВТОРА ЦАРЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА ЦАРЕ 1:1'")
		expect(p.parse("ВТОРО ЦАРЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРО ЦАРЕ 1:1'")
		expect(p.parse("2 ЦАРСТВА 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 ЦАРСТВА 1:1'")
		expect(p.parse("2. САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. САМУИЛ 1:1'")
		expect(p.parse("2. ЦАРСТВ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. ЦАРСТВ 1:1'")
		expect(p.parse("II САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II САМУИЛ 1:1'")
		expect(p.parse("II ЦАРСТВ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II ЦАРСТВ 1:1'")
		expect(p.parse("ВТОРА ЦАР 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРА ЦАР 1:1'")
		expect(p.parse("ВТОРО ЦАР 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'ВТОРО ЦАР 1:1'")
		expect(p.parse("2 САМУИЛ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 САМУИЛ 1:1'")
		expect(p.parse("2 ЦАРСТВ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 ЦАРСТВ 1:1'")
		expect(p.parse("II. ЦАРЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. ЦАРЕ 1:1'")
		expect(p.parse("2. ЦАРЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. ЦАРЕ 1:1'")
		expect(p.parse("II ЦАРЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II ЦАРЕ 1:1'")
		expect(p.parse("II. ЦАР 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II. ЦАР 1:1'")
		expect(p.parse("2 ЦАРЕ 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 ЦАРЕ 1:1'")
		expect(p.parse("2. ЦАР 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2. ЦАР 1:1'")
		expect(p.parse("II ЦАР 1:1").osis()).toEqual("2Sam.1.1", "parsing: 'II ЦАР 1:1'")
		expect(p.parse("2 ЦАР 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 ЦАР 1:1'")
		expect(p.parse("2SAM 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2SAM 1:1'")
		expect(p.parse("2 Ц 1:1").osis()).toEqual("2Sam.1.1", "parsing: '2 Ц 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Sam (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Sam (bg)", function() {
      
		expect(p.parse("Първа Книга на царете 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа Книга на царете 1:1'")
		expect(p.parse("Първа книга на Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа книга на Самуил 1:1'")
		expect(p.parse("Първо Книга на царете 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първо Книга на царете 1:1'")
		expect(p.parse("Първа книга Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа книга Царства 1:1'")
		expect(p.parse("1. Книга на царете 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Книга на царете 1:1'")
		expect(p.parse("I. Книга на царете 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Книга на царете 1:1'")
		expect(p.parse("1 Книга на царете 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Книга на царете 1:1'")
		expect(p.parse("I Книга на царете 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Книга на царете 1:1'")
		expect(p.parse("Първа Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа Царства 1:1'")
		expect(p.parse("Първо Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първо Царства 1:1'")
		expect(p.parse("Първа Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа Самуил 1:1'")
		expect(p.parse("Първа Царств 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа Царств 1:1'")
		expect(p.parse("Първо Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първо Самуил 1:1'")
		expect(p.parse("Първо Царств 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първо Царств 1:1'")
		expect(p.parse("1. Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Царства 1:1'")
		expect(p.parse("I. Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Царства 1:1'")
		expect(p.parse("Първа Царе 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа Царе 1:1'")
		expect(p.parse("Първо Царе 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първо Царе 1:1'")
		expect(p.parse("1 Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Царства 1:1'")
		expect(p.parse("1. Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Самуил 1:1'")
		expect(p.parse("1. Царств 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Царств 1:1'")
		expect(p.parse("I Царства 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Царства 1:1'")
		expect(p.parse("I. Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Самуил 1:1'")
		expect(p.parse("I. Царств 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Царств 1:1'")
		expect(p.parse("Първа Цар 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първа Цар 1:1'")
		expect(p.parse("Първо Цар 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'Първо Цар 1:1'")
		expect(p.parse("1 Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Самуил 1:1'")
		expect(p.parse("1 Царств 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Царств 1:1'")
		expect(p.parse("I Самуил 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Самуил 1:1'")
		expect(p.parse("I Царств 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Царств 1:1'")
		expect(p.parse("1. Царе 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Царе 1:1'")
		expect(p.parse("I. Царе 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Царе 1:1'")
		expect(p.parse("1 Царе 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Царе 1:1'")
		expect(p.parse("1. Цар 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. Цар 1:1'")
		expect(p.parse("I Царе 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Царе 1:1'")
		expect(p.parse("I. Цар 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. Цар 1:1'")
		expect(p.parse("1 Цар 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Цар 1:1'")
		expect(p.parse("I Цар 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I Цар 1:1'")
		expect(p.parse("1Sam 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1Sam 1:1'")
		expect(p.parse("1 Ц 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Ц 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВА КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ПЪРВА КНИГА НА САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА КНИГА НА САМУИЛ 1:1'")
		expect(p.parse("ПЪРВО КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВО КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ПЪРВА КНИГА ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА КНИГА ЦАРСТВА 1:1'")
		expect(p.parse("1. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("I. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("1 КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("I КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ПЪРВА ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА ЦАРСТВА 1:1'")
		expect(p.parse("ПЪРВО ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВО ЦАРСТВА 1:1'")
		expect(p.parse("ПЪРВА САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА САМУИЛ 1:1'")
		expect(p.parse("ПЪРВА ЦАРСТВ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА ЦАРСТВ 1:1'")
		expect(p.parse("ПЪРВО САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВО САМУИЛ 1:1'")
		expect(p.parse("ПЪРВО ЦАРСТВ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВО ЦАРСТВ 1:1'")
		expect(p.parse("1. ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. ЦАРСТВА 1:1'")
		expect(p.parse("I. ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. ЦАРСТВА 1:1'")
		expect(p.parse("ПЪРВА ЦАРЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА ЦАРЕ 1:1'")
		expect(p.parse("ПЪРВО ЦАРЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВО ЦАРЕ 1:1'")
		expect(p.parse("1 ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 ЦАРСТВА 1:1'")
		expect(p.parse("1. САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. САМУИЛ 1:1'")
		expect(p.parse("1. ЦАРСТВ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. ЦАРСТВ 1:1'")
		expect(p.parse("I ЦАРСТВА 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I ЦАРСТВА 1:1'")
		expect(p.parse("I. САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. САМУИЛ 1:1'")
		expect(p.parse("I. ЦАРСТВ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. ЦАРСТВ 1:1'")
		expect(p.parse("ПЪРВА ЦАР 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВА ЦАР 1:1'")
		expect(p.parse("ПЪРВО ЦАР 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'ПЪРВО ЦАР 1:1'")
		expect(p.parse("1 САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 САМУИЛ 1:1'")
		expect(p.parse("1 ЦАРСТВ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 ЦАРСТВ 1:1'")
		expect(p.parse("I САМУИЛ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I САМУИЛ 1:1'")
		expect(p.parse("I ЦАРСТВ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I ЦАРСТВ 1:1'")
		expect(p.parse("1. ЦАРЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. ЦАРЕ 1:1'")
		expect(p.parse("I. ЦАРЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. ЦАРЕ 1:1'")
		expect(p.parse("1 ЦАРЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 ЦАРЕ 1:1'")
		expect(p.parse("1. ЦАР 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1. ЦАР 1:1'")
		expect(p.parse("I ЦАРЕ 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I ЦАРЕ 1:1'")
		expect(p.parse("I. ЦАР 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I. ЦАР 1:1'")
		expect(p.parse("1 ЦАР 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 ЦАР 1:1'")
		expect(p.parse("I ЦАР 1:1").osis()).toEqual("1Sam.1.1", "parsing: 'I ЦАР 1:1'")
		expect(p.parse("1SAM 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1SAM 1:1'")
		expect(p.parse("1 Ц 1:1").osis()).toEqual("1Sam.1.1", "parsing: '1 Ц 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Kgs (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Kgs (bg)", function() {
      
		expect(p.parse("Четвърта Книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта Книга на царете 1:1'")
		expect(p.parse("Четвърта книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта книга на царете 1:1'")
		expect(p.parse("Четвърто Книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърто Книга на царете 1:1'")
		expect(p.parse("Четвърта книга Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта книга Царства 1:1'")
		expect(p.parse("IV. Книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. Книга на царете 1:1'")
		expect(p.parse("4. Книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. Книга на царете 1:1'")
		expect(p.parse("IV Книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV Книга на царете 1:1'")
		expect(p.parse("4 Книга на царете 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Книга на царете 1:1'")
		expect(p.parse("Четвърта Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта Царства 1:1'")
		expect(p.parse("Четвърто Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърто Царства 1:1'")
		expect(p.parse("Четвърта Царств 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта Царств 1:1'")
		expect(p.parse("Четвърто Царств 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърто Царств 1:1'")
		expect(p.parse("Четвърта Царе 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта Царе 1:1'")
		expect(p.parse("Четвърто Царе 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърто Царе 1:1'")
		expect(p.parse("Четвърта Цар 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърта Цар 1:1'")
		expect(p.parse("Четвърто Цар 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'Четвърто Цар 1:1'")
		expect(p.parse("IV. Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. Царства 1:1'")
		expect(p.parse("4. Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. Царства 1:1'")
		expect(p.parse("IV Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV Царства 1:1'")
		expect(p.parse("IV. Царств 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. Царств 1:1'")
		expect(p.parse("4 Царства 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Царства 1:1'")
		expect(p.parse("4. Царств 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. Царств 1:1'")
		expect(p.parse("IV Царств 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV Царств 1:1'")
		expect(p.parse("4 Царств 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Царств 1:1'")
		expect(p.parse("IV. Царе 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. Царе 1:1'")
		expect(p.parse("4. Царе 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. Царе 1:1'")
		expect(p.parse("IV Царе 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV Царе 1:1'")
		expect(p.parse("IV. Цар 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. Цар 1:1'")
		expect(p.parse("4 Царе 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Царе 1:1'")
		expect(p.parse("4. Цар 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. Цар 1:1'")
		expect(p.parse("IV Цар 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV Цар 1:1'")
		expect(p.parse("4 Цар 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Цар 1:1'")
		expect(p.parse("2Kgs 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2Kgs 1:1'")
		expect(p.parse("4 Ц 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Ц 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ЧЕТВЪРТА КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ЧЕТВЪРТА КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ЧЕТВЪРТО КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТО КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ЧЕТВЪРТА КНИГА ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА КНИГА ЦАРСТВА 1:1'")
		expect(p.parse("IV. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("4. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("IV КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("4 КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ЧЕТВЪРТА ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА ЦАРСТВА 1:1'")
		expect(p.parse("ЧЕТВЪРТО ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТО ЦАРСТВА 1:1'")
		expect(p.parse("ЧЕТВЪРТА ЦАРСТВ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА ЦАРСТВ 1:1'")
		expect(p.parse("ЧЕТВЪРТО ЦАРСТВ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТО ЦАРСТВ 1:1'")
		expect(p.parse("ЧЕТВЪРТА ЦАРЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА ЦАРЕ 1:1'")
		expect(p.parse("ЧЕТВЪРТО ЦАРЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТО ЦАРЕ 1:1'")
		expect(p.parse("ЧЕТВЪРТА ЦАР 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТА ЦАР 1:1'")
		expect(p.parse("ЧЕТВЪРТО ЦАР 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'ЧЕТВЪРТО ЦАР 1:1'")
		expect(p.parse("IV. ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. ЦАРСТВА 1:1'")
		expect(p.parse("4. ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. ЦАРСТВА 1:1'")
		expect(p.parse("IV ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV ЦАРСТВА 1:1'")
		expect(p.parse("IV. ЦАРСТВ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. ЦАРСТВ 1:1'")
		expect(p.parse("4 ЦАРСТВА 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 ЦАРСТВА 1:1'")
		expect(p.parse("4. ЦАРСТВ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. ЦАРСТВ 1:1'")
		expect(p.parse("IV ЦАРСТВ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV ЦАРСТВ 1:1'")
		expect(p.parse("4 ЦАРСТВ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 ЦАРСТВ 1:1'")
		expect(p.parse("IV. ЦАРЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. ЦАРЕ 1:1'")
		expect(p.parse("4. ЦАРЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. ЦАРЕ 1:1'")
		expect(p.parse("IV ЦАРЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV ЦАРЕ 1:1'")
		expect(p.parse("IV. ЦАР 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV. ЦАР 1:1'")
		expect(p.parse("4 ЦАРЕ 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 ЦАРЕ 1:1'")
		expect(p.parse("4. ЦАР 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4. ЦАР 1:1'")
		expect(p.parse("IV ЦАР 1:1").osis()).toEqual("2Kgs.1.1", "parsing: 'IV ЦАР 1:1'")
		expect(p.parse("4 ЦАР 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 ЦАР 1:1'")
		expect(p.parse("2KGS 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '2KGS 1:1'")
		expect(p.parse("4 Ц 1:1").osis()).toEqual("2Kgs.1.1", "parsing: '4 Ц 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Kgs (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Kgs (bg)", function() {
      
		expect(p.parse("Трета Книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета Книга на царете 1:1'")
		expect(p.parse("Трета книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета книга на царете 1:1'")
		expect(p.parse("Трето Книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трето Книга на царете 1:1'")
		expect(p.parse("III. Книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. Книга на царете 1:1'")
		expect(p.parse("III Книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III Книга на царете 1:1'")
		expect(p.parse("Трета книга Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета книга Царства 1:1'")
		expect(p.parse("3. Книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. Книга на царете 1:1'")
		expect(p.parse("3 Книга на царете 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Книга на царете 1:1'")
		expect(p.parse("Трета Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета Царства 1:1'")
		expect(p.parse("Трето Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трето Царства 1:1'")
		expect(p.parse("III. Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. Царства 1:1'")
		expect(p.parse("Трета Царств 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета Царств 1:1'")
		expect(p.parse("Трето Царств 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трето Царств 1:1'")
		expect(p.parse("III Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III Царства 1:1'")
		expect(p.parse("III. Царств 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. Царств 1:1'")
		expect(p.parse("3. Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. Царства 1:1'")
		expect(p.parse("III Царств 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III Царств 1:1'")
		expect(p.parse("Трета Царе 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета Царе 1:1'")
		expect(p.parse("Трето Царе 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трето Царе 1:1'")
		expect(p.parse("3 Царства 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Царства 1:1'")
		expect(p.parse("3. Царств 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. Царств 1:1'")
		expect(p.parse("III. Царе 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. Царе 1:1'")
		expect(p.parse("Трета Цар 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трета Цар 1:1'")
		expect(p.parse("Трето Цар 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'Трето Цар 1:1'")
		expect(p.parse("3 Царств 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Царств 1:1'")
		expect(p.parse("III Царе 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III Царе 1:1'")
		expect(p.parse("III. Цар 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. Цар 1:1'")
		expect(p.parse("3. Царе 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. Царе 1:1'")
		expect(p.parse("III Цар 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III Цар 1:1'")
		expect(p.parse("3 Царе 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Царе 1:1'")
		expect(p.parse("3. Цар 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. Цар 1:1'")
		expect(p.parse("3 Цар 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Цар 1:1'")
		expect(p.parse("1Kgs 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1Kgs 1:1'")
		expect(p.parse("3 Ц 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Ц 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ТРЕТА КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ТРЕТА КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ТРЕТО КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТО КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("III. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("III КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ТРЕТА КНИГА ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА КНИГА ЦАРСТВА 1:1'")
		expect(p.parse("3. КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("3 КНИГА НА ЦАРЕТЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 КНИГА НА ЦАРЕТЕ 1:1'")
		expect(p.parse("ТРЕТА ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА ЦАРСТВА 1:1'")
		expect(p.parse("ТРЕТО ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТО ЦАРСТВА 1:1'")
		expect(p.parse("III. ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. ЦАРСТВА 1:1'")
		expect(p.parse("ТРЕТА ЦАРСТВ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА ЦАРСТВ 1:1'")
		expect(p.parse("ТРЕТО ЦАРСТВ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТО ЦАРСТВ 1:1'")
		expect(p.parse("III ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III ЦАРСТВА 1:1'")
		expect(p.parse("III. ЦАРСТВ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. ЦАРСТВ 1:1'")
		expect(p.parse("3. ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. ЦАРСТВА 1:1'")
		expect(p.parse("III ЦАРСТВ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III ЦАРСТВ 1:1'")
		expect(p.parse("ТРЕТА ЦАРЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА ЦАРЕ 1:1'")
		expect(p.parse("ТРЕТО ЦАРЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТО ЦАРЕ 1:1'")
		expect(p.parse("3 ЦАРСТВА 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 ЦАРСТВА 1:1'")
		expect(p.parse("3. ЦАРСТВ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. ЦАРСТВ 1:1'")
		expect(p.parse("III. ЦАРЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. ЦАРЕ 1:1'")
		expect(p.parse("ТРЕТА ЦАР 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТА ЦАР 1:1'")
		expect(p.parse("ТРЕТО ЦАР 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'ТРЕТО ЦАР 1:1'")
		expect(p.parse("3 ЦАРСТВ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 ЦАРСТВ 1:1'")
		expect(p.parse("III ЦАРЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III ЦАРЕ 1:1'")
		expect(p.parse("III. ЦАР 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III. ЦАР 1:1'")
		expect(p.parse("3. ЦАРЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. ЦАРЕ 1:1'")
		expect(p.parse("III ЦАР 1:1").osis()).toEqual("1Kgs.1.1", "parsing: 'III ЦАР 1:1'")
		expect(p.parse("3 ЦАРЕ 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 ЦАРЕ 1:1'")
		expect(p.parse("3. ЦАР 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3. ЦАР 1:1'")
		expect(p.parse("3 ЦАР 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 ЦАР 1:1'")
		expect(p.parse("1KGS 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '1KGS 1:1'")
		expect(p.parse("3 Ц 1:1").osis()).toEqual("1Kgs.1.1", "parsing: '3 Ц 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Chr (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Chr (bg)", function() {
      
		expect(p.parse("или Втора книга Паралипоменон 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'или Втора книга Паралипоменон 1:1'")
		expect(p.parse("Втора Книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Втора Книга на летописите 1:1'")
		expect(p.parse("Втора книга Паралипоменон 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Втора книга Паралипоменон 1:1'")
		expect(p.parse("Втора книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Втора книга на летописите 1:1'")
		expect(p.parse("Второ Книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Второ Книга на летописите 1:1'")
		expect(p.parse("II. Книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Книга на летописите 1:1'")
		expect(p.parse("2. Книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Книга на летописите 1:1'")
		expect(p.parse("II Книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Книга на летописите 1:1'")
		expect(p.parse("2 Книга на летописите 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Книга на летописите 1:1'")
		expect(p.parse("Втора Летописи 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Втора Летописи 1:1'")
		expect(p.parse("Второ Летописи 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Второ Летописи 1:1'")
		expect(p.parse("II. Летописи 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Летописи 1:1'")
		expect(p.parse("2. Летописи 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Летописи 1:1'")
		expect(p.parse("II Летописи 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Летописи 1:1'")
		expect(p.parse("Втора Парал 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Втора Парал 1:1'")
		expect(p.parse("Второ Парал 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Второ Парал 1:1'")
		expect(p.parse("2 Летописи 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Летописи 1:1'")
		expect(p.parse("II. Парал 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Парал 1:1'")
		expect(p.parse("Втора Лет 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Втора Лет 1:1'")
		expect(p.parse("Второ Лет 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'Второ Лет 1:1'")
		expect(p.parse("2. Парал 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Парал 1:1'")
		expect(p.parse("II Парал 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Парал 1:1'")
		expect(p.parse("2 Парал 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Парал 1:1'")
		expect(p.parse("II. Лет 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. Лет 1:1'")
		expect(p.parse("2. Лет 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. Лет 1:1'")
		expect(p.parse("II Лет 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II Лет 1:1'")
		expect(p.parse("2 Лет 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 Лет 1:1'")
		expect(p.parse("2Chr 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ИЛИ ВТОРА КНИГА ПАРАЛИПОМЕНОН 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ИЛИ ВТОРА КНИГА ПАРАЛИПОМЕНОН 1:1'")
		expect(p.parse("ВТОРА КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРА КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("ВТОРА КНИГА ПАРАЛИПОМЕНОН 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРА КНИГА ПАРАЛИПОМЕНОН 1:1'")
		expect(p.parse("ВТОРА КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРА КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("ВТОРО КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРО КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("II. КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("2. КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("II КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("2 КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("ВТОРА ЛЕТОПИСИ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРА ЛЕТОПИСИ 1:1'")
		expect(p.parse("ВТОРО ЛЕТОПИСИ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРО ЛЕТОПИСИ 1:1'")
		expect(p.parse("II. ЛЕТОПИСИ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. ЛЕТОПИСИ 1:1'")
		expect(p.parse("2. ЛЕТОПИСИ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. ЛЕТОПИСИ 1:1'")
		expect(p.parse("II ЛЕТОПИСИ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II ЛЕТОПИСИ 1:1'")
		expect(p.parse("ВТОРА ПАРАЛ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРА ПАРАЛ 1:1'")
		expect(p.parse("ВТОРО ПАРАЛ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРО ПАРАЛ 1:1'")
		expect(p.parse("2 ЛЕТОПИСИ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 ЛЕТОПИСИ 1:1'")
		expect(p.parse("II. ПАРАЛ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. ПАРАЛ 1:1'")
		expect(p.parse("ВТОРА ЛЕТ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРА ЛЕТ 1:1'")
		expect(p.parse("ВТОРО ЛЕТ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'ВТОРО ЛЕТ 1:1'")
		expect(p.parse("2. ПАРАЛ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. ПАРАЛ 1:1'")
		expect(p.parse("II ПАРАЛ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II ПАРАЛ 1:1'")
		expect(p.parse("2 ПАРАЛ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 ПАРАЛ 1:1'")
		expect(p.parse("II. ЛЕТ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II. ЛЕТ 1:1'")
		expect(p.parse("2. ЛЕТ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2. ЛЕТ 1:1'")
		expect(p.parse("II ЛЕТ 1:1").osis()).toEqual("2Chr.1.1", "parsing: 'II ЛЕТ 1:1'")
		expect(p.parse("2 ЛЕТ 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2 ЛЕТ 1:1'")
		expect(p.parse("2CHR 1:1").osis()).toEqual("2Chr.1.1", "parsing: '2CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Chr (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Chr (bg)", function() {
      
		expect(p.parse("или Първа книга Паралипоменон 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'или Първа книга Паралипоменон 1:1'")
		expect(p.parse("Първа Книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първа Книга на летописите 1:1'")
		expect(p.parse("Първа книга Паралипоменон 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първа книга Паралипоменон 1:1'")
		expect(p.parse("Първа книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първа книга на летописите 1:1'")
		expect(p.parse("Първо Книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първо Книга на летописите 1:1'")
		expect(p.parse("1. Книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Книга на летописите 1:1'")
		expect(p.parse("I. Книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Книга на летописите 1:1'")
		expect(p.parse("1 Книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Книга на летописите 1:1'")
		expect(p.parse("I Книга на летописите 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Книга на летописите 1:1'")
		expect(p.parse("Първа Летописи 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първа Летописи 1:1'")
		expect(p.parse("Първо Летописи 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първо Летописи 1:1'")
		expect(p.parse("1. Летописи 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Летописи 1:1'")
		expect(p.parse("I. Летописи 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Летописи 1:1'")
		expect(p.parse("Първа Парал 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първа Парал 1:1'")
		expect(p.parse("Първо Парал 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първо Парал 1:1'")
		expect(p.parse("1 Летописи 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Летописи 1:1'")
		expect(p.parse("I Летописи 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Летописи 1:1'")
		expect(p.parse("Първа Лет 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първа Лет 1:1'")
		expect(p.parse("Първо Лет 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'Първо Лет 1:1'")
		expect(p.parse("1. Парал 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Парал 1:1'")
		expect(p.parse("I. Парал 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Парал 1:1'")
		expect(p.parse("1 Парал 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Парал 1:1'")
		expect(p.parse("I Парал 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Парал 1:1'")
		expect(p.parse("1. Лет 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. Лет 1:1'")
		expect(p.parse("I. Лет 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. Лет 1:1'")
		expect(p.parse("1 Лет 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 Лет 1:1'")
		expect(p.parse("I Лет 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I Лет 1:1'")
		expect(p.parse("1Chr 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1Chr 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ИЛИ ПЪРВА КНИГА ПАРАЛИПОМЕНОН 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ИЛИ ПЪРВА КНИГА ПАРАЛИПОМЕНОН 1:1'")
		expect(p.parse("ПЪРВА КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВА КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("ПЪРВА КНИГА ПАРАЛИПОМЕНОН 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВА КНИГА ПАРАЛИПОМЕНОН 1:1'")
		expect(p.parse("ПЪРВА КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВА КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("ПЪРВО КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВО КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("1. КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("I. КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("1 КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("I КНИГА НА ЛЕТОПИСИТЕ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I КНИГА НА ЛЕТОПИСИТЕ 1:1'")
		expect(p.parse("ПЪРВА ЛЕТОПИСИ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВА ЛЕТОПИСИ 1:1'")
		expect(p.parse("ПЪРВО ЛЕТОПИСИ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВО ЛЕТОПИСИ 1:1'")
		expect(p.parse("1. ЛЕТОПИСИ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. ЛЕТОПИСИ 1:1'")
		expect(p.parse("I. ЛЕТОПИСИ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. ЛЕТОПИСИ 1:1'")
		expect(p.parse("ПЪРВА ПАРАЛ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВА ПАРАЛ 1:1'")
		expect(p.parse("ПЪРВО ПАРАЛ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВО ПАРАЛ 1:1'")
		expect(p.parse("1 ЛЕТОПИСИ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 ЛЕТОПИСИ 1:1'")
		expect(p.parse("I ЛЕТОПИСИ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I ЛЕТОПИСИ 1:1'")
		expect(p.parse("ПЪРВА ЛЕТ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВА ЛЕТ 1:1'")
		expect(p.parse("ПЪРВО ЛЕТ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'ПЪРВО ЛЕТ 1:1'")
		expect(p.parse("1. ПАРАЛ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. ПАРАЛ 1:1'")
		expect(p.parse("I. ПАРАЛ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. ПАРАЛ 1:1'")
		expect(p.parse("1 ПАРАЛ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 ПАРАЛ 1:1'")
		expect(p.parse("I ПАРАЛ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I ПАРАЛ 1:1'")
		expect(p.parse("1. ЛЕТ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1. ЛЕТ 1:1'")
		expect(p.parse("I. ЛЕТ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I. ЛЕТ 1:1'")
		expect(p.parse("1 ЛЕТ 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1 ЛЕТ 1:1'")
		expect(p.parse("I ЛЕТ 1:1").osis()).toEqual("1Chr.1.1", "parsing: 'I ЛЕТ 1:1'")
		expect(p.parse("1CHR 1:1").osis()).toEqual("1Chr.1.1", "parsing: '1CHR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezra (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ezra (bg)", function() {
      
		expect(p.parse("Книга на Ездра 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Книга на Ездра 1:1'")
		expect(p.parse("Ездра 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ездра 1:1'")
		expect(p.parse("Ezra 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Ezra 1:1'")
		expect(p.parse("Езд 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'Езд 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ЕЗДРА 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'КНИГА НА ЕЗДРА 1:1'")
		expect(p.parse("ЕЗДРА 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ЕЗДРА 1:1'")
		expect(p.parse("EZRA 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'EZRA 1:1'")
		expect(p.parse("ЕЗД 1:1").osis()).toEqual("Ezra.1.1", "parsing: 'ЕЗД 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Neh (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Neh (bg)", function() {
      
		expect(p.parse("Книга на Неемия 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Книга на Неемия 1:1'")
		expect(p.parse("Неемия 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Неемия 1:1'")
		expect(p.parse("Неем 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Неем 1:1'")
		expect(p.parse("Neh 1:1").osis()).toEqual("Neh.1.1", "parsing: 'Neh 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА НЕЕМИЯ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'КНИГА НА НЕЕМИЯ 1:1'")
		expect(p.parse("НЕЕМИЯ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'НЕЕМИЯ 1:1'")
		expect(p.parse("НЕЕМ 1:1").osis()).toEqual("Neh.1.1", "parsing: 'НЕЕМ 1:1'")
		expect(p.parse("NEH 1:1").osis()).toEqual("Neh.1.1", "parsing: 'NEH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book GkEsth (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: GkEsth (bg)", function() {
      
		expect(p.parse("Книга Естир (според Септуагинта) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Книга Естир (според Септуагинта) 1:1'")
		expect(p.parse("Естир (според Септуагинта) 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Естир (според Септуагинта) 1:1'")
		expect(p.parse("Ест. Септ 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ест. Септ 1:1'")
		expect(p.parse("Ест Септ 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'Ест Септ 1:1'")
		expect(p.parse("GkEsth 1:1").osis()).toEqual("GkEsth.1.1", "parsing: 'GkEsth 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Esth (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Esth (bg)", function() {
      
		expect(p.parse("Книга Естир 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Книга Естир 1:1'")
		expect(p.parse("Естир 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Естир 1:1'")
		expect(p.parse("Esth 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Esth 1:1'")
		expect(p.parse("Ест 1:1").osis()).toEqual("Esth.1.1", "parsing: 'Ест 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА ЕСТИР 1:1").osis()).toEqual("Esth.1.1", "parsing: 'КНИГА ЕСТИР 1:1'")
		expect(p.parse("ЕСТИР 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ЕСТИР 1:1'")
		expect(p.parse("ESTH 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ESTH 1:1'")
		expect(p.parse("ЕСТ 1:1").osis()).toEqual("Esth.1.1", "parsing: 'ЕСТ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Job (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Job (bg)", function() {
      
		expect(p.parse("Книга на Иова 1:1").osis()).toEqual("Job.1.1", "parsing: 'Книга на Иова 1:1'")
		expect(p.parse("Книга на Иов 1:1").osis()).toEqual("Job.1.1", "parsing: 'Книга на Иов 1:1'")
		expect(p.parse("Книга на Йов 1:1").osis()).toEqual("Job.1.1", "parsing: 'Книга на Йов 1:1'")
		expect(p.parse("Job 1:1").osis()).toEqual("Job.1.1", "parsing: 'Job 1:1'")
		expect(p.parse("Иов 1:1").osis()).toEqual("Job.1.1", "parsing: 'Иов 1:1'")
		expect(p.parse("Йов 1:1").osis()).toEqual("Job.1.1", "parsing: 'Йов 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ИОВА 1:1").osis()).toEqual("Job.1.1", "parsing: 'КНИГА НА ИОВА 1:1'")
		expect(p.parse("КНИГА НА ИОВ 1:1").osis()).toEqual("Job.1.1", "parsing: 'КНИГА НА ИОВ 1:1'")
		expect(p.parse("КНИГА НА ЙОВ 1:1").osis()).toEqual("Job.1.1", "parsing: 'КНИГА НА ЙОВ 1:1'")
		expect(p.parse("JOB 1:1").osis()).toEqual("Job.1.1", "parsing: 'JOB 1:1'")
		expect(p.parse("ИОВ 1:1").osis()).toEqual("Job.1.1", "parsing: 'ИОВ 1:1'")
		expect(p.parse("ЙОВ 1:1").osis()).toEqual("Job.1.1", "parsing: 'ЙОВ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ps (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ps (bg)", function() {
      
		expect(p.parse("Псалтир 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Псалтир 1:1'")
		expect(p.parse("Псалми 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Псалми 1:1'")
		expect(p.parse("Псалом 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Псалом 1:1'")
		expect(p.parse("Псалм 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Псалм 1:1'")
		expect(p.parse("Ps 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Ps 1:1'")
		expect(p.parse("Пс 1:1").osis()).toEqual("Ps.1.1", "parsing: 'Пс 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПСАЛТИР 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ПСАЛТИР 1:1'")
		expect(p.parse("ПСАЛМИ 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ПСАЛМИ 1:1'")
		expect(p.parse("ПСАЛОМ 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ПСАЛОМ 1:1'")
		expect(p.parse("ПСАЛМ 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ПСАЛМ 1:1'")
		expect(p.parse("PS 1:1").osis()).toEqual("Ps.1.1", "parsing: 'PS 1:1'")
		expect(p.parse("ПС 1:1").osis()).toEqual("Ps.1.1", "parsing: 'ПС 1:1'")
		;
      return true;
    });
  });

  describe("Localized book PrAzar (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: PrAzar (bg)", function() {
      
		expect(p.parse("Молитвата на Азария 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'Молитвата на Азария 1:1'")
		expect(p.parse("PrAzar 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'PrAzar 1:1'")
		expect(p.parse("М. Аза 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'М. Аза 1:1'")
		expect(p.parse("М Аза 1:1").osis()).toEqual("PrAzar.1.1", "parsing: 'М Аза 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Prov (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Prov (bg)", function() {
      
		expect(p.parse("Книга Притчи Соломонови 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Книга Притчи Соломонови 1:1'")
		expect(p.parse("Притчи Соломонови 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Притчи Соломонови 1:1'")
		expect(p.parse("Притчи 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Притчи 1:1'")
		expect(p.parse("Притч 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Притч 1:1'")
		expect(p.parse("Prov 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Prov 1:1'")
		expect(p.parse("Пр 1:1").osis()).toEqual("Prov.1.1", "parsing: 'Пр 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА ПРИТЧИ СОЛОМОНОВИ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'КНИГА ПРИТЧИ СОЛОМОНОВИ 1:1'")
		expect(p.parse("ПРИТЧИ СОЛОМОНОВИ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'ПРИТЧИ СОЛОМОНОВИ 1:1'")
		expect(p.parse("ПРИТЧИ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'ПРИТЧИ 1:1'")
		expect(p.parse("ПРИТЧ 1:1").osis()).toEqual("Prov.1.1", "parsing: 'ПРИТЧ 1:1'")
		expect(p.parse("PROV 1:1").osis()).toEqual("Prov.1.1", "parsing: 'PROV 1:1'")
		expect(p.parse("ПР 1:1").osis()).toEqual("Prov.1.1", "parsing: 'ПР 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eccl (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Eccl (bg)", function() {
      
		expect(p.parse("Книга на Еклисиаста или Проповедника 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Книга на Еклисиаста или Проповедника 1:1'")
		expect(p.parse("Проповедника 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Проповедника 1:1'")
		expect(p.parse("Еклисиаста 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Еклисиаста 1:1'")
		expect(p.parse("Еклесиаст 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Еклесиаст 1:1'")
		expect(p.parse("Еклисиаст 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Еклисиаст 1:1'")
		expect(p.parse("Eccl 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Eccl 1:1'")
		expect(p.parse("Екл 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'Екл 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ЕКЛИСИАСТА ИЛИ ПРОПОВЕДНИКА 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'КНИГА НА ЕКЛИСИАСТА ИЛИ ПРОПОВЕДНИКА 1:1'")
		expect(p.parse("ПРОПОВЕДНИКА 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ПРОПОВЕДНИКА 1:1'")
		expect(p.parse("ЕКЛИСИАСТА 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ЕКЛИСИАСТА 1:1'")
		expect(p.parse("ЕКЛЕСИАСТ 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ЕКЛЕСИАСТ 1:1'")
		expect(p.parse("ЕКЛИСИАСТ 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ЕКЛИСИАСТ 1:1'")
		expect(p.parse("ECCL 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ECCL 1:1'")
		expect(p.parse("ЕКЛ 1:1").osis()).toEqual("Eccl.1.1", "parsing: 'ЕКЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book SgThree (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: SgThree (bg)", function() {
      
		expect(p.parse("Песента на тримата младежи 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'Песента на тримата младежи 1:1'")
		expect(p.parse("SgThree 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'SgThree 1:1'")
		expect(p.parse("П. Мл 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'П. Мл 1:1'")
		expect(p.parse("П Мл 1:1").osis()).toEqual("SgThree.1.1", "parsing: 'П Мл 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Song (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Song (bg)", function() {
      
		expect(p.parse("Книга Песен на Песните, от Соломона 1:1").osis()).toEqual("Song.1.1", "parsing: 'Книга Песен на Песните, от Соломона 1:1'")
		expect(p.parse("Песен на песните 1:1").osis()).toEqual("Song.1.1", "parsing: 'Песен на песните 1:1'")
		expect(p.parse("Пес. на песн 1:1").osis()).toEqual("Song.1.1", "parsing: 'Пес. на песн 1:1'")
		expect(p.parse("Пес на песн 1:1").osis()).toEqual("Song.1.1", "parsing: 'Пес на песн 1:1'")
		expect(p.parse("Song 1:1").osis()).toEqual("Song.1.1", "parsing: 'Song 1:1'")
		expect(p.parse("П. П 1:1").osis()).toEqual("Song.1.1", "parsing: 'П. П 1:1'")
		expect(p.parse("П П 1:1").osis()).toEqual("Song.1.1", "parsing: 'П П 1:1'")
		expect(p.parse("Пес 1:1").osis()).toEqual("Song.1.1", "parsing: 'Пес 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА ПЕСЕН НА ПЕСНИТЕ, ОТ СОЛОМОНА 1:1").osis()).toEqual("Song.1.1", "parsing: 'КНИГА ПЕСЕН НА ПЕСНИТЕ, ОТ СОЛОМОНА 1:1'")
		expect(p.parse("ПЕСЕН НА ПЕСНИТЕ 1:1").osis()).toEqual("Song.1.1", "parsing: 'ПЕСЕН НА ПЕСНИТЕ 1:1'")
		expect(p.parse("ПЕС. НА ПЕСН 1:1").osis()).toEqual("Song.1.1", "parsing: 'ПЕС. НА ПЕСН 1:1'")
		expect(p.parse("ПЕС НА ПЕСН 1:1").osis()).toEqual("Song.1.1", "parsing: 'ПЕС НА ПЕСН 1:1'")
		expect(p.parse("SONG 1:1").osis()).toEqual("Song.1.1", "parsing: 'SONG 1:1'")
		expect(p.parse("П. П 1:1").osis()).toEqual("Song.1.1", "parsing: 'П. П 1:1'")
		expect(p.parse("П П 1:1").osis()).toEqual("Song.1.1", "parsing: 'П П 1:1'")
		expect(p.parse("ПЕС 1:1").osis()).toEqual("Song.1.1", "parsing: 'ПЕС 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jer (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jer (bg)", function() {
      
		expect(p.parse("Книга на пророк Иеремия 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Книга на пророк Иеремия 1:1'")
		expect(p.parse("Книга на пророк Йеремия 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Книга на пророк Йеремия 1:1'")
		expect(p.parse("Книга на пророк Еремия 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Книга на пророк Еремия 1:1'")
		expect(p.parse("Иеремия 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Иеремия 1:1'")
		expect(p.parse("Йеремия 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Йеремия 1:1'")
		expect(p.parse("Еремия 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Еремия 1:1'")
		expect(p.parse("Jer 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Jer 1:1'")
		expect(p.parse("Иер 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Иер 1:1'")
		expect(p.parse("Йер 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Йер 1:1'")
		expect(p.parse("Ер 1:1").osis()).toEqual("Jer.1.1", "parsing: 'Ер 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ИЕРЕМИЯ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'КНИГА НА ПРОРОК ИЕРЕМИЯ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК ЙЕРЕМИЯ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'КНИГА НА ПРОРОК ЙЕРЕМИЯ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК ЕРЕМИЯ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'КНИГА НА ПРОРОК ЕРЕМИЯ 1:1'")
		expect(p.parse("ИЕРЕМИЯ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ИЕРЕМИЯ 1:1'")
		expect(p.parse("ЙЕРЕМИЯ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ЙЕРЕМИЯ 1:1'")
		expect(p.parse("ЕРЕМИЯ 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ЕРЕМИЯ 1:1'")
		expect(p.parse("JER 1:1").osis()).toEqual("Jer.1.1", "parsing: 'JER 1:1'")
		expect(p.parse("ИЕР 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ИЕР 1:1'")
		expect(p.parse("ЙЕР 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ЙЕР 1:1'")
		expect(p.parse("ЕР 1:1").osis()).toEqual("Jer.1.1", "parsing: 'ЕР 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezek (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ezek (bg)", function() {
      
		expect(p.parse("Книга на пророк Иезекииля 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Книга на пророк Иезекииля 1:1'")
		expect(p.parse("Книга на пророк Езекиил 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Книга на пророк Езекиил 1:1'")
		expect(p.parse("Иезекииля 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Иезекииля 1:1'")
		expect(p.parse("Иезекиил 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Иезекиил 1:1'")
		expect(p.parse("Йезекиил 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Йезекиил 1:1'")
		expect(p.parse("Езекиил 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Езекиил 1:1'")
		expect(p.parse("Езекил 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Езекил 1:1'")
		expect(p.parse("Ezek 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ezek 1:1'")
		expect(p.parse("Езек 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Езек 1:1'")
		expect(p.parse("Иез 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Иез 1:1'")
		expect(p.parse("Йез 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Йез 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ИЕЗЕКИИЛЯ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'КНИГА НА ПРОРОК ИЕЗЕКИИЛЯ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК ЕЗЕКИИЛ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'КНИГА НА ПРОРОК ЕЗЕКИИЛ 1:1'")
		expect(p.parse("ИЕЗЕКИИЛЯ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ИЕЗЕКИИЛЯ 1:1'")
		expect(p.parse("ИЕЗЕКИИЛ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ИЕЗЕКИИЛ 1:1'")
		expect(p.parse("ЙЕЗЕКИИЛ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ЙЕЗЕКИИЛ 1:1'")
		expect(p.parse("ЕЗЕКИИЛ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ЕЗЕКИИЛ 1:1'")
		expect(p.parse("ЕЗЕКИЛ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ЕЗЕКИЛ 1:1'")
		expect(p.parse("EZEK 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'EZEK 1:1'")
		expect(p.parse("ЕЗЕК 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ЕЗЕК 1:1'")
		expect(p.parse("ИЕЗ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ИЕЗ 1:1'")
		expect(p.parse("ЙЕЗ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ЙЕЗ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Dan (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Dan (bg)", function() {
      
		expect(p.parse("Книга на пророк Даниила 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Книга на пророк Даниила 1:1'")
		expect(p.parse("Книга на пророк Даниил 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Книга на пророк Даниил 1:1'")
		expect(p.parse("Даниила 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Даниила 1:1'")
		expect(p.parse("Данаил 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Данаил 1:1'")
		expect(p.parse("Даниил 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Даниил 1:1'")
		expect(p.parse("Dan 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Dan 1:1'")
		expect(p.parse("Дан 1:1").osis()).toEqual("Dan.1.1", "parsing: 'Дан 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ДАНИИЛА 1:1").osis()).toEqual("Dan.1.1", "parsing: 'КНИГА НА ПРОРОК ДАНИИЛА 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК ДАНИИЛ 1:1").osis()).toEqual("Dan.1.1", "parsing: 'КНИГА НА ПРОРОК ДАНИИЛ 1:1'")
		expect(p.parse("ДАНИИЛА 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ДАНИИЛА 1:1'")
		expect(p.parse("ДАНАИЛ 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ДАНАИЛ 1:1'")
		expect(p.parse("ДАНИИЛ 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ДАНИИЛ 1:1'")
		expect(p.parse("DAN 1:1").osis()).toEqual("Dan.1.1", "parsing: 'DAN 1:1'")
		expect(p.parse("ДАН 1:1").osis()).toEqual("Dan.1.1", "parsing: 'ДАН 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hos (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hos (bg)", function() {
      
		expect(p.parse("Книга на пророк Осия 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Книга на пророк Осия 1:1'")
		expect(p.parse("Осия 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Осия 1:1'")
		expect(p.parse("Hos 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Hos 1:1'")
		expect(p.parse("Ос 1:1").osis()).toEqual("Hos.1.1", "parsing: 'Ос 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ОСИЯ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'КНИГА НА ПРОРОК ОСИЯ 1:1'")
		expect(p.parse("ОСИЯ 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ОСИЯ 1:1'")
		expect(p.parse("HOS 1:1").osis()).toEqual("Hos.1.1", "parsing: 'HOS 1:1'")
		expect(p.parse("ОС 1:1").osis()).toEqual("Hos.1.1", "parsing: 'ОС 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Joel (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Joel (bg)", function() {
      
		expect(p.parse("Книга на пророк Иоиля 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Книга на пророк Иоиля 1:1'")
		expect(p.parse("Книга на пророк Иоил 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Книга на пророк Иоил 1:1'")
		expect(p.parse("Иоиля 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Иоиля 1:1'")
		expect(p.parse("Joel 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Joel 1:1'")
		expect(p.parse("Иоил 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Иоил 1:1'")
		expect(p.parse("Йоил 1:1").osis()).toEqual("Joel.1.1", "parsing: 'Йоил 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ИОИЛЯ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'КНИГА НА ПРОРОК ИОИЛЯ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК ИОИЛ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'КНИГА НА ПРОРОК ИОИЛ 1:1'")
		expect(p.parse("ИОИЛЯ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ИОИЛЯ 1:1'")
		expect(p.parse("JOEL 1:1").osis()).toEqual("Joel.1.1", "parsing: 'JOEL 1:1'")
		expect(p.parse("ИОИЛ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ИОИЛ 1:1'")
		expect(p.parse("ЙОИЛ 1:1").osis()).toEqual("Joel.1.1", "parsing: 'ЙОИЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Amos (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Amos (bg)", function() {
      
		expect(p.parse("Книга на пророк Амоса 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Книга на пророк Амоса 1:1'")
		expect(p.parse("Книга на пророк Амос 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Книга на пророк Амос 1:1'")
		expect(p.parse("Амоса 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Амоса 1:1'")
		expect(p.parse("Amos 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Amos 1:1'")
		expect(p.parse("Амос 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Амос 1:1'")
		expect(p.parse("Ам 1:1").osis()).toEqual("Amos.1.1", "parsing: 'Ам 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК АМОСА 1:1").osis()).toEqual("Amos.1.1", "parsing: 'КНИГА НА ПРОРОК АМОСА 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК АМОС 1:1").osis()).toEqual("Amos.1.1", "parsing: 'КНИГА НА ПРОРОК АМОС 1:1'")
		expect(p.parse("АМОСА 1:1").osis()).toEqual("Amos.1.1", "parsing: 'АМОСА 1:1'")
		expect(p.parse("AMOS 1:1").osis()).toEqual("Amos.1.1", "parsing: 'AMOS 1:1'")
		expect(p.parse("АМОС 1:1").osis()).toEqual("Amos.1.1", "parsing: 'АМОС 1:1'")
		expect(p.parse("АМ 1:1").osis()).toEqual("Amos.1.1", "parsing: 'АМ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Obad (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Obad (bg)", function() {
      
		expect(p.parse("Книга на пророк Авдии 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Книга на пророк Авдии 1:1'")
		expect(p.parse("Книга на пророк Авдий 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Книга на пророк Авдий 1:1'")
		expect(p.parse("Авдии 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Авдии 1:1'")
		expect(p.parse("Авдий 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Авдий 1:1'")
		expect(p.parse("Obad 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Obad 1:1'")
		expect(p.parse("Авд 1:1").osis()).toEqual("Obad.1.1", "parsing: 'Авд 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК АВДИИ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'КНИГА НА ПРОРОК АВДИИ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК АВДИЙ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'КНИГА НА ПРОРОК АВДИЙ 1:1'")
		expect(p.parse("АВДИИ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'АВДИИ 1:1'")
		expect(p.parse("АВДИЙ 1:1").osis()).toEqual("Obad.1.1", "parsing: 'АВДИЙ 1:1'")
		expect(p.parse("OBAD 1:1").osis()).toEqual("Obad.1.1", "parsing: 'OBAD 1:1'")
		expect(p.parse("АВД 1:1").osis()).toEqual("Obad.1.1", "parsing: 'АВД 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jonah (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jonah (bg)", function() {
      
		expect(p.parse("Книга на пророк Иона 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Книга на пророк Иона 1:1'")
		expect(p.parse("Jonah 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Jonah 1:1'")
		expect(p.parse("Иона 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Иона 1:1'")
		expect(p.parse("Йона 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Йона 1:1'")
		expect(p.parse("Ион 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Ион 1:1'")
		expect(p.parse("Йон 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'Йон 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ИОНА 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'КНИГА НА ПРОРОК ИОНА 1:1'")
		expect(p.parse("JONAH 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'JONAH 1:1'")
		expect(p.parse("ИОНА 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ИОНА 1:1'")
		expect(p.parse("ЙОНА 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ЙОНА 1:1'")
		expect(p.parse("ИОН 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ИОН 1:1'")
		expect(p.parse("ЙОН 1:1").osis()).toEqual("Jonah.1.1", "parsing: 'ЙОН 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mic (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Mic (bg)", function() {
      
		expect(p.parse("Книга на пророк Михеи 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Книга на пророк Михеи 1:1'")
		expect(p.parse("Книга на пророк Михей 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Книга на пророк Михей 1:1'")
		expect(p.parse("Михеи 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Михеи 1:1'")
		expect(p.parse("Михей 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Михей 1:1'")
		expect(p.parse("Mic 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Mic 1:1'")
		expect(p.parse("Мих 1:1").osis()).toEqual("Mic.1.1", "parsing: 'Мих 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК МИХЕИ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'КНИГА НА ПРОРОК МИХЕИ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК МИХЕЙ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'КНИГА НА ПРОРОК МИХЕЙ 1:1'")
		expect(p.parse("МИХЕИ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'МИХЕИ 1:1'")
		expect(p.parse("МИХЕЙ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'МИХЕЙ 1:1'")
		expect(p.parse("MIC 1:1").osis()).toEqual("Mic.1.1", "parsing: 'MIC 1:1'")
		expect(p.parse("МИХ 1:1").osis()).toEqual("Mic.1.1", "parsing: 'МИХ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Nah (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Nah (bg)", function() {
      
		expect(p.parse("Книга на пророк Наума 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Книга на пророк Наума 1:1'")
		expect(p.parse("Книга на пророк Наум 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Книга на пророк Наум 1:1'")
		expect(p.parse("Наума 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Наума 1:1'")
		expect(p.parse("Наум 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Наум 1:1'")
		expect(p.parse("Nah 1:1").osis()).toEqual("Nah.1.1", "parsing: 'Nah 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК НАУМА 1:1").osis()).toEqual("Nah.1.1", "parsing: 'КНИГА НА ПРОРОК НАУМА 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК НАУМ 1:1").osis()).toEqual("Nah.1.1", "parsing: 'КНИГА НА ПРОРОК НАУМ 1:1'")
		expect(p.parse("НАУМА 1:1").osis()).toEqual("Nah.1.1", "parsing: 'НАУМА 1:1'")
		expect(p.parse("НАУМ 1:1").osis()).toEqual("Nah.1.1", "parsing: 'НАУМ 1:1'")
		expect(p.parse("NAH 1:1").osis()).toEqual("Nah.1.1", "parsing: 'NAH 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hab (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hab (bg)", function() {
      
		expect(p.parse("Книга на пророк Авакума 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Книга на пророк Авакума 1:1'")
		expect(p.parse("Книга на пророк Авакум 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Книга на пророк Авакум 1:1'")
		expect(p.parse("Авакума 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Авакума 1:1'")
		expect(p.parse("Авакум 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Авакум 1:1'")
		expect(p.parse("Авак 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Авак 1:1'")
		expect(p.parse("Hab 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Hab 1:1'")
		expect(p.parse("Авк 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Авк 1:1'")
		expect(p.parse("Ав 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Ав 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК АВАКУМА 1:1").osis()).toEqual("Hab.1.1", "parsing: 'КНИГА НА ПРОРОК АВАКУМА 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК АВАКУМ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'КНИГА НА ПРОРОК АВАКУМ 1:1'")
		expect(p.parse("АВАКУМА 1:1").osis()).toEqual("Hab.1.1", "parsing: 'АВАКУМА 1:1'")
		expect(p.parse("АВАКУМ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'АВАКУМ 1:1'")
		expect(p.parse("АВАК 1:1").osis()).toEqual("Hab.1.1", "parsing: 'АВАК 1:1'")
		expect(p.parse("HAB 1:1").osis()).toEqual("Hab.1.1", "parsing: 'HAB 1:1'")
		expect(p.parse("АВК 1:1").osis()).toEqual("Hab.1.1", "parsing: 'АВК 1:1'")
		expect(p.parse("АВ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'АВ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zeph (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Zeph (bg)", function() {
      
		expect(p.parse("Книга на пророк Софония 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Книга на пророк Софония 1:1'")
		expect(p.parse("Софонии 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Софонии 1:1'")
		expect(p.parse("Софоний 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Софоний 1:1'")
		expect(p.parse("Софония 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Софония 1:1'")
		expect(p.parse("Zeph 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Zeph 1:1'")
		expect(p.parse("Соф 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'Соф 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК СОФОНИЯ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'КНИГА НА ПРОРОК СОФОНИЯ 1:1'")
		expect(p.parse("СОФОНИИ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'СОФОНИИ 1:1'")
		expect(p.parse("СОФОНИЙ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'СОФОНИЙ 1:1'")
		expect(p.parse("СОФОНИЯ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'СОФОНИЯ 1:1'")
		expect(p.parse("ZEPH 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'ZEPH 1:1'")
		expect(p.parse("СОФ 1:1").osis()).toEqual("Zeph.1.1", "parsing: 'СОФ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hag (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hag (bg)", function() {
      
		expect(p.parse("Книга на пророк Агеи 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Книга на пророк Агеи 1:1'")
		expect(p.parse("Книга на пророк Агей 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Книга на пророк Агей 1:1'")
		expect(p.parse("Агеи 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Агеи 1:1'")
		expect(p.parse("Агей 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Агей 1:1'")
		expect(p.parse("Hag 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Hag 1:1'")
		expect(p.parse("Аг 1:1").osis()).toEqual("Hag.1.1", "parsing: 'Аг 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК АГЕИ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'КНИГА НА ПРОРОК АГЕИ 1:1'")
		expect(p.parse("КНИГА НА ПРОРОК АГЕЙ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'КНИГА НА ПРОРОК АГЕЙ 1:1'")
		expect(p.parse("АГЕИ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'АГЕИ 1:1'")
		expect(p.parse("АГЕЙ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'АГЕЙ 1:1'")
		expect(p.parse("HAG 1:1").osis()).toEqual("Hag.1.1", "parsing: 'HAG 1:1'")
		expect(p.parse("АГ 1:1").osis()).toEqual("Hag.1.1", "parsing: 'АГ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Zech (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Zech (bg)", function() {
      
		expect(p.parse("Книга на пророк Захария 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Книга на пророк Захария 1:1'")
		expect(p.parse("Захария 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Захария 1:1'")
		expect(p.parse("Zech 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Zech 1:1'")
		expect(p.parse("Зах 1:1").osis()).toEqual("Zech.1.1", "parsing: 'Зах 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК ЗАХАРИЯ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'КНИГА НА ПРОРОК ЗАХАРИЯ 1:1'")
		expect(p.parse("ЗАХАРИЯ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ЗАХАРИЯ 1:1'")
		expect(p.parse("ZECH 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ZECH 1:1'")
		expect(p.parse("ЗАХ 1:1").osis()).toEqual("Zech.1.1", "parsing: 'ЗАХ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mal (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Mal (bg)", function() {
      
		expect(p.parse("Книга на пророк Малахия 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Книга на пророк Малахия 1:1'")
		expect(p.parse("Малахия 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Малахия 1:1'")
		expect(p.parse("Mal 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Mal 1:1'")
		expect(p.parse("Мал 1:1").osis()).toEqual("Mal.1.1", "parsing: 'Мал 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("КНИГА НА ПРОРОК МАЛАХИЯ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'КНИГА НА ПРОРОК МАЛАХИЯ 1:1'")
		expect(p.parse("МАЛАХИЯ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'МАЛАХИЯ 1:1'")
		expect(p.parse("MAL 1:1").osis()).toEqual("Mal.1.1", "parsing: 'MAL 1:1'")
		expect(p.parse("МАЛ 1:1").osis()).toEqual("Mal.1.1", "parsing: 'МАЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Matt (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Matt (bg)", function() {
      
		expect(p.parse("От Матея свето Евангелие 1:1").osis()).toEqual("Matt.1.1", "parsing: 'От Матея свето Евангелие 1:1'")
		expect(p.parse("Евангелие от Матеи 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Евангелие от Матеи 1:1'")
		expect(p.parse("Евангелие от Матей 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Евангелие от Матей 1:1'")
		expect(p.parse("От Матея 1:1").osis()).toEqual("Matt.1.1", "parsing: 'От Матея 1:1'")
		expect(p.parse("Матеи 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Матеи 1:1'")
		expect(p.parse("Матей 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Матей 1:1'")
		expect(p.parse("Matt 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Matt 1:1'")
		expect(p.parse("Мат 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Мат 1:1'")
		expect(p.parse("Мт 1:1").osis()).toEqual("Matt.1.1", "parsing: 'Мт 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ОТ МАТЕЯ СВЕТО ЕВАНГЕЛИЕ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'ОТ МАТЕЯ СВЕТО ЕВАНГЕЛИЕ 1:1'")
		expect(p.parse("ЕВАНГЕЛИЕ ОТ МАТЕИ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'ЕВАНГЕЛИЕ ОТ МАТЕИ 1:1'")
		expect(p.parse("ЕВАНГЕЛИЕ ОТ МАТЕЙ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'ЕВАНГЕЛИЕ ОТ МАТЕЙ 1:1'")
		expect(p.parse("ОТ МАТЕЯ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'ОТ МАТЕЯ 1:1'")
		expect(p.parse("МАТЕИ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'МАТЕИ 1:1'")
		expect(p.parse("МАТЕЙ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'МАТЕЙ 1:1'")
		expect(p.parse("MATT 1:1").osis()).toEqual("Matt.1.1", "parsing: 'MATT 1:1'")
		expect(p.parse("МАТ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'МАТ 1:1'")
		expect(p.parse("МТ 1:1").osis()).toEqual("Matt.1.1", "parsing: 'МТ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Mark (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Mark (bg)", function() {
      
		expect(p.parse("От Марка свето Евангелие 1:1").osis()).toEqual("Mark.1.1", "parsing: 'От Марка свето Евангелие 1:1'")
		expect(p.parse("Евангелие от Марко 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Евангелие от Марко 1:1'")
		expect(p.parse("От Марка 1:1").osis()).toEqual("Mark.1.1", "parsing: 'От Марка 1:1'")
		expect(p.parse("Марко 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Марко 1:1'")
		expect(p.parse("Mark 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Mark 1:1'")
		expect(p.parse("Марк 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Марк 1:1'")
		expect(p.parse("Мк 1:1").osis()).toEqual("Mark.1.1", "parsing: 'Мк 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ОТ МАРКА СВЕТО ЕВАНГЕЛИЕ 1:1").osis()).toEqual("Mark.1.1", "parsing: 'ОТ МАРКА СВЕТО ЕВАНГЕЛИЕ 1:1'")
		expect(p.parse("ЕВАНГЕЛИЕ ОТ МАРКО 1:1").osis()).toEqual("Mark.1.1", "parsing: 'ЕВАНГЕЛИЕ ОТ МАРКО 1:1'")
		expect(p.parse("ОТ МАРКА 1:1").osis()).toEqual("Mark.1.1", "parsing: 'ОТ МАРКА 1:1'")
		expect(p.parse("МАРКО 1:1").osis()).toEqual("Mark.1.1", "parsing: 'МАРКО 1:1'")
		expect(p.parse("MARK 1:1").osis()).toEqual("Mark.1.1", "parsing: 'MARK 1:1'")
		expect(p.parse("МАРК 1:1").osis()).toEqual("Mark.1.1", "parsing: 'МАРК 1:1'")
		expect(p.parse("МК 1:1").osis()).toEqual("Mark.1.1", "parsing: 'МК 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Luke (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Luke (bg)", function() {
      
		expect(p.parse("От Лука свето Евангелие 1:1").osis()).toEqual("Luke.1.1", "parsing: 'От Лука свето Евангелие 1:1'")
		expect(p.parse("Евангелие от Лука 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Евангелие от Лука 1:1'")
		expect(p.parse("От Лука 1:1").osis()).toEqual("Luke.1.1", "parsing: 'От Лука 1:1'")
		expect(p.parse("Luke 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Luke 1:1'")
		expect(p.parse("Лука 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Лука 1:1'")
		expect(p.parse("Лук 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Лук 1:1'")
		expect(p.parse("Лк 1:1").osis()).toEqual("Luke.1.1", "parsing: 'Лк 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ОТ ЛУКА СВЕТО ЕВАНГЕЛИЕ 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ОТ ЛУКА СВЕТО ЕВАНГЕЛИЕ 1:1'")
		expect(p.parse("ЕВАНГЕЛИЕ ОТ ЛУКА 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ЕВАНГЕЛИЕ ОТ ЛУКА 1:1'")
		expect(p.parse("ОТ ЛУКА 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ОТ ЛУКА 1:1'")
		expect(p.parse("LUKE 1:1").osis()).toEqual("Luke.1.1", "parsing: 'LUKE 1:1'")
		expect(p.parse("ЛУКА 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ЛУКА 1:1'")
		expect(p.parse("ЛУК 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ЛУК 1:1'")
		expect(p.parse("ЛК 1:1").osis()).toEqual("Luke.1.1", "parsing: 'ЛК 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1John (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1John (bg)", function() {
      
		expect(p.parse("Първо съборно послание на св. ап. Иоана Богослова 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо съборно послание на св. ап. Иоана Богослова 1:1'")
		expect(p.parse("Първо съборно послание на св ап. Иоана Богослова 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо съборно послание на св ап. Иоана Богослова 1:1'")
		expect(p.parse("Първо съборно послание на св. ап Иоана Богослова 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо съборно послание на св. ап Иоана Богослова 1:1'")
		expect(p.parse("Първо съборно послание на св ап Иоана Богослова 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо съборно послание на св ап Иоана Богослова 1:1'")
		expect(p.parse("Първо послание на Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо послание на Иоан 1:1'")
		expect(p.parse("Първо послание на Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо послание на Йоан 1:1'")
		expect(p.parse("Първа Иоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първа Иоаново 1:1'")
		expect(p.parse("Първа Йоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първа Йоаново 1:1'")
		expect(p.parse("Първо Иоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо Иоаново 1:1'")
		expect(p.parse("Първо Йоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо Йоаново 1:1'")
		expect(p.parse("1. Иоаново 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Иоаново 1:1'")
		expect(p.parse("1. Йоаново 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Йоаново 1:1'")
		expect(p.parse("I. Иоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Иоаново 1:1'")
		expect(p.parse("I. Йоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Йоаново 1:1'")
		expect(p.parse("Първа Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първа Иоан 1:1'")
		expect(p.parse("Първа Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първа Йоан 1:1'")
		expect(p.parse("Първо Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо Иоан 1:1'")
		expect(p.parse("Първо Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'Първо Йоан 1:1'")
		expect(p.parse("1 Иоаново 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Иоаново 1:1'")
		expect(p.parse("1 Йоаново 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Йоаново 1:1'")
		expect(p.parse("I Иоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Иоаново 1:1'")
		expect(p.parse("I Йоаново 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Йоаново 1:1'")
		expect(p.parse("1. Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Иоан 1:1'")
		expect(p.parse("1. Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: '1. Йоан 1:1'")
		expect(p.parse("I. Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Иоан 1:1'")
		expect(p.parse("I. Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. Йоан 1:1'")
		expect(p.parse("1 Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Иоан 1:1'")
		expect(p.parse("1 Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Йоан 1:1'")
		expect(p.parse("I Иоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Иоан 1:1'")
		expect(p.parse("I Йоан 1:1").osis()).toEqual("1John.1.1", "parsing: 'I Йоан 1:1'")
		expect(p.parse("1John 1:1").osis()).toEqual("1John.1.1", "parsing: '1John 1:1'")
		expect(p.parse("1 Ин 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Ин 1:1'")
		expect(p.parse("1 Йн 1:1").osis()).toEqual("1John.1.1", "parsing: '1 Йн 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА ИОАН 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА ЙОАН 1:1'")
		expect(p.parse("ПЪРВА ИОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВА ИОАНОВО 1:1'")
		expect(p.parse("ПЪРВА ЙОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВА ЙОАНОВО 1:1'")
		expect(p.parse("ПЪРВО ИОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО ИОАНОВО 1:1'")
		expect(p.parse("ПЪРВО ЙОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО ЙОАНОВО 1:1'")
		expect(p.parse("1. ИОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: '1. ИОАНОВО 1:1'")
		expect(p.parse("1. ЙОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: '1. ЙОАНОВО 1:1'")
		expect(p.parse("I. ИОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. ИОАНОВО 1:1'")
		expect(p.parse("I. ЙОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. ЙОАНОВО 1:1'")
		expect(p.parse("ПЪРВА ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВА ИОАН 1:1'")
		expect(p.parse("ПЪРВА ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВА ЙОАН 1:1'")
		expect(p.parse("ПЪРВО ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО ИОАН 1:1'")
		expect(p.parse("ПЪРВО ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'ПЪРВО ЙОАН 1:1'")
		expect(p.parse("1 ИОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: '1 ИОАНОВО 1:1'")
		expect(p.parse("1 ЙОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: '1 ЙОАНОВО 1:1'")
		expect(p.parse("I ИОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'I ИОАНОВО 1:1'")
		expect(p.parse("I ЙОАНОВО 1:1").osis()).toEqual("1John.1.1", "parsing: 'I ЙОАНОВО 1:1'")
		expect(p.parse("1. ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: '1. ИОАН 1:1'")
		expect(p.parse("1. ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: '1. ЙОАН 1:1'")
		expect(p.parse("I. ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. ИОАН 1:1'")
		expect(p.parse("I. ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'I. ЙОАН 1:1'")
		expect(p.parse("1 ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: '1 ИОАН 1:1'")
		expect(p.parse("1 ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: '1 ЙОАН 1:1'")
		expect(p.parse("I ИОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'I ИОАН 1:1'")
		expect(p.parse("I ЙОАН 1:1").osis()).toEqual("1John.1.1", "parsing: 'I ЙОАН 1:1'")
		expect(p.parse("1JOHN 1:1").osis()).toEqual("1John.1.1", "parsing: '1JOHN 1:1'")
		expect(p.parse("1 ИН 1:1").osis()).toEqual("1John.1.1", "parsing: '1 ИН 1:1'")
		expect(p.parse("1 ЙН 1:1").osis()).toEqual("1John.1.1", "parsing: '1 ЙН 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2John (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2John (bg)", function() {
      
		expect(p.parse("Второ съборно послание на св. ап. Иоана Богослова 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ съборно послание на св. ап. Иоана Богослова 1:1'")
		expect(p.parse("Второ съборно послание на св ап. Иоана Богослова 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ съборно послание на св ап. Иоана Богослова 1:1'")
		expect(p.parse("Второ съборно послание на св. ап Иоана Богослова 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ съборно послание на св. ап Иоана Богослова 1:1'")
		expect(p.parse("Второ съборно послание на св ап Иоана Богослова 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ съборно послание на св ап Иоана Богослова 1:1'")
		expect(p.parse("Второ послание на Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ послание на Иоан 1:1'")
		expect(p.parse("Второ послание на Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ послание на Йоан 1:1'")
		expect(p.parse("Втора Иоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'Втора Иоаново 1:1'")
		expect(p.parse("Втора Йоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'Втора Йоаново 1:1'")
		expect(p.parse("Второ Иоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ Иоаново 1:1'")
		expect(p.parse("Второ Йоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ Йоаново 1:1'")
		expect(p.parse("II. Иоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Иоаново 1:1'")
		expect(p.parse("II. Йоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Йоаново 1:1'")
		expect(p.parse("2. Иоаново 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Иоаново 1:1'")
		expect(p.parse("2. Йоаново 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Йоаново 1:1'")
		expect(p.parse("II Иоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Иоаново 1:1'")
		expect(p.parse("II Йоаново 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Йоаново 1:1'")
		expect(p.parse("Втора Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'Втора Иоан 1:1'")
		expect(p.parse("Втора Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'Втора Йоан 1:1'")
		expect(p.parse("Второ Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ Иоан 1:1'")
		expect(p.parse("Второ Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'Второ Йоан 1:1'")
		expect(p.parse("2 Иоаново 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Иоаново 1:1'")
		expect(p.parse("2 Йоаново 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Йоаново 1:1'")
		expect(p.parse("II. Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Иоан 1:1'")
		expect(p.parse("II. Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. Йоан 1:1'")
		expect(p.parse("2. Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Иоан 1:1'")
		expect(p.parse("2. Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: '2. Йоан 1:1'")
		expect(p.parse("II Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Иоан 1:1'")
		expect(p.parse("II Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: 'II Йоан 1:1'")
		expect(p.parse("2 Иоан 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Иоан 1:1'")
		expect(p.parse("2 Йоан 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Йоан 1:1'")
		expect(p.parse("2John 1:1").osis()).toEqual("2John.1.1", "parsing: '2John 1:1'")
		expect(p.parse("2 Ин 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Ин 1:1'")
		expect(p.parse("2 Йн 1:1").osis()).toEqual("2John.1.1", "parsing: '2 Йн 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА ИОАН 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА ЙОАН 1:1'")
		expect(p.parse("ВТОРА ИОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРА ИОАНОВО 1:1'")
		expect(p.parse("ВТОРА ЙОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРА ЙОАНОВО 1:1'")
		expect(p.parse("ВТОРО ИОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО ИОАНОВО 1:1'")
		expect(p.parse("ВТОРО ЙОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО ЙОАНОВО 1:1'")
		expect(p.parse("II. ИОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. ИОАНОВО 1:1'")
		expect(p.parse("II. ЙОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. ЙОАНОВО 1:1'")
		expect(p.parse("2. ИОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: '2. ИОАНОВО 1:1'")
		expect(p.parse("2. ЙОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: '2. ЙОАНОВО 1:1'")
		expect(p.parse("II ИОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'II ИОАНОВО 1:1'")
		expect(p.parse("II ЙОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: 'II ЙОАНОВО 1:1'")
		expect(p.parse("ВТОРА ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРА ИОАН 1:1'")
		expect(p.parse("ВТОРА ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРА ЙОАН 1:1'")
		expect(p.parse("ВТОРО ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО ИОАН 1:1'")
		expect(p.parse("ВТОРО ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'ВТОРО ЙОАН 1:1'")
		expect(p.parse("2 ИОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: '2 ИОАНОВО 1:1'")
		expect(p.parse("2 ЙОАНОВО 1:1").osis()).toEqual("2John.1.1", "parsing: '2 ЙОАНОВО 1:1'")
		expect(p.parse("II. ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. ИОАН 1:1'")
		expect(p.parse("II. ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'II. ЙОАН 1:1'")
		expect(p.parse("2. ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: '2. ИОАН 1:1'")
		expect(p.parse("2. ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: '2. ЙОАН 1:1'")
		expect(p.parse("II ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'II ИОАН 1:1'")
		expect(p.parse("II ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: 'II ЙОАН 1:1'")
		expect(p.parse("2 ИОАН 1:1").osis()).toEqual("2John.1.1", "parsing: '2 ИОАН 1:1'")
		expect(p.parse("2 ЙОАН 1:1").osis()).toEqual("2John.1.1", "parsing: '2 ЙОАН 1:1'")
		expect(p.parse("2JOHN 1:1").osis()).toEqual("2John.1.1", "parsing: '2JOHN 1:1'")
		expect(p.parse("2 ИН 1:1").osis()).toEqual("2John.1.1", "parsing: '2 ИН 1:1'")
		expect(p.parse("2 ЙН 1:1").osis()).toEqual("2John.1.1", "parsing: '2 ЙН 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3John (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 3John (bg)", function() {
      
		expect(p.parse("Трето съборно послание на св. ап. Иоана Богослова 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето съборно послание на св. ап. Иоана Богослова 1:1'")
		expect(p.parse("Трето съборно послание на св ап. Иоана Богослова 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето съборно послание на св ап. Иоана Богослова 1:1'")
		expect(p.parse("Трето съборно послание на св. ап Иоана Богослова 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето съборно послание на св. ап Иоана Богослова 1:1'")
		expect(p.parse("Трето съборно послание на св ап Иоана Богослова 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето съборно послание на св ап Иоана Богослова 1:1'")
		expect(p.parse("Трето послание на Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето послание на Иоан 1:1'")
		expect(p.parse("Трето послание на Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето послание на Йоан 1:1'")
		expect(p.parse("Трета Иоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трета Иоаново 1:1'")
		expect(p.parse("Трета Йоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трета Йоаново 1:1'")
		expect(p.parse("Трето Иоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето Иоаново 1:1'")
		expect(p.parse("Трето Йоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето Йоаново 1:1'")
		expect(p.parse("III. Иоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Иоаново 1:1'")
		expect(p.parse("III. Йоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Йоаново 1:1'")
		expect(p.parse("III Иоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Иоаново 1:1'")
		expect(p.parse("III Йоаново 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Йоаново 1:1'")
		expect(p.parse("3. Иоаново 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Иоаново 1:1'")
		expect(p.parse("3. Йоаново 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Йоаново 1:1'")
		expect(p.parse("Трета Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трета Иоан 1:1'")
		expect(p.parse("Трета Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трета Йоан 1:1'")
		expect(p.parse("Трето Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето Иоан 1:1'")
		expect(p.parse("Трето Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'Трето Йоан 1:1'")
		expect(p.parse("3 Иоаново 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Иоаново 1:1'")
		expect(p.parse("3 Йоаново 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Йоаново 1:1'")
		expect(p.parse("III. Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Иоан 1:1'")
		expect(p.parse("III. Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. Йоан 1:1'")
		expect(p.parse("III Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Иоан 1:1'")
		expect(p.parse("III Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: 'III Йоан 1:1'")
		expect(p.parse("3. Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Иоан 1:1'")
		expect(p.parse("3. Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: '3. Йоан 1:1'")
		expect(p.parse("3 Иоан 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Иоан 1:1'")
		expect(p.parse("3 Йоан 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Йоан 1:1'")
		expect(p.parse("3John 1:1").osis()).toEqual("3John.1.1", "parsing: '3John 1:1'")
		expect(p.parse("3 Ин 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Ин 1:1'")
		expect(p.parse("3 Йн 1:1").osis()).toEqual("3John.1.1", "parsing: '3 Йн 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ АП ИОАНА БОГОСЛОВА 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО СЪБОРНО ПОСЛАНИЕ НА СВ АП ИОАНА БОГОСЛОВА 1:1'")
		expect(p.parse("ТРЕТО ПОСЛАНИЕ НА ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО ПОСЛАНИЕ НА ИОАН 1:1'")
		expect(p.parse("ТРЕТО ПОСЛАНИЕ НА ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО ПОСЛАНИЕ НА ЙОАН 1:1'")
		expect(p.parse("ТРЕТА ИОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТА ИОАНОВО 1:1'")
		expect(p.parse("ТРЕТА ЙОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТА ЙОАНОВО 1:1'")
		expect(p.parse("ТРЕТО ИОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО ИОАНОВО 1:1'")
		expect(p.parse("ТРЕТО ЙОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО ЙОАНОВО 1:1'")
		expect(p.parse("III. ИОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. ИОАНОВО 1:1'")
		expect(p.parse("III. ЙОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. ЙОАНОВО 1:1'")
		expect(p.parse("III ИОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'III ИОАНОВО 1:1'")
		expect(p.parse("III ЙОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: 'III ЙОАНОВО 1:1'")
		expect(p.parse("3. ИОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: '3. ИОАНОВО 1:1'")
		expect(p.parse("3. ЙОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: '3. ЙОАНОВО 1:1'")
		expect(p.parse("ТРЕТА ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТА ИОАН 1:1'")
		expect(p.parse("ТРЕТА ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТА ЙОАН 1:1'")
		expect(p.parse("ТРЕТО ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО ИОАН 1:1'")
		expect(p.parse("ТРЕТО ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'ТРЕТО ЙОАН 1:1'")
		expect(p.parse("3 ИОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: '3 ИОАНОВО 1:1'")
		expect(p.parse("3 ЙОАНОВО 1:1").osis()).toEqual("3John.1.1", "parsing: '3 ЙОАНОВО 1:1'")
		expect(p.parse("III. ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. ИОАН 1:1'")
		expect(p.parse("III. ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'III. ЙОАН 1:1'")
		expect(p.parse("III ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'III ИОАН 1:1'")
		expect(p.parse("III ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: 'III ЙОАН 1:1'")
		expect(p.parse("3. ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: '3. ИОАН 1:1'")
		expect(p.parse("3. ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: '3. ЙОАН 1:1'")
		expect(p.parse("3 ИОАН 1:1").osis()).toEqual("3John.1.1", "parsing: '3 ИОАН 1:1'")
		expect(p.parse("3 ЙОАН 1:1").osis()).toEqual("3John.1.1", "parsing: '3 ЙОАН 1:1'")
		expect(p.parse("3JOHN 1:1").osis()).toEqual("3John.1.1", "parsing: '3JOHN 1:1'")
		expect(p.parse("3 ИН 1:1").osis()).toEqual("3John.1.1", "parsing: '3 ИН 1:1'")
		expect(p.parse("3 ЙН 1:1").osis()).toEqual("3John.1.1", "parsing: '3 ЙН 1:1'")
		;
      return true;
    });
  });

  describe("Localized book John (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: John (bg)", function() {
      
		expect(p.parse("От Иоана свето Евангелие 1:1").osis()).toEqual("John.1.1", "parsing: 'От Иоана свето Евангелие 1:1'")
		expect(p.parse("Евангелие от Иоан 1:1").osis()).toEqual("John.1.1", "parsing: 'Евангелие от Иоан 1:1'")
		expect(p.parse("Евангелие от Йоан 1:1").osis()).toEqual("John.1.1", "parsing: 'Евангелие от Йоан 1:1'")
		expect(p.parse("От Иоана 1:1").osis()).toEqual("John.1.1", "parsing: 'От Иоана 1:1'")
		expect(p.parse("John 1:1").osis()).toEqual("John.1.1", "parsing: 'John 1:1'")
		expect(p.parse("Иоан 1:1").osis()).toEqual("John.1.1", "parsing: 'Иоан 1:1'")
		expect(p.parse("Йоан 1:1").osis()).toEqual("John.1.1", "parsing: 'Йоан 1:1'")
		expect(p.parse("Ин 1:1").osis()).toEqual("John.1.1", "parsing: 'Ин 1:1'")
		expect(p.parse("Йн 1:1").osis()).toEqual("John.1.1", "parsing: 'Йн 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ОТ ИОАНА СВЕТО ЕВАНГЕЛИЕ 1:1").osis()).toEqual("John.1.1", "parsing: 'ОТ ИОАНА СВЕТО ЕВАНГЕЛИЕ 1:1'")
		expect(p.parse("ЕВАНГЕЛИЕ ОТ ИОАН 1:1").osis()).toEqual("John.1.1", "parsing: 'ЕВАНГЕЛИЕ ОТ ИОАН 1:1'")
		expect(p.parse("ЕВАНГЕЛИЕ ОТ ЙОАН 1:1").osis()).toEqual("John.1.1", "parsing: 'ЕВАНГЕЛИЕ ОТ ЙОАН 1:1'")
		expect(p.parse("ОТ ИОАНА 1:1").osis()).toEqual("John.1.1", "parsing: 'ОТ ИОАНА 1:1'")
		expect(p.parse("JOHN 1:1").osis()).toEqual("John.1.1", "parsing: 'JOHN 1:1'")
		expect(p.parse("ИОАН 1:1").osis()).toEqual("John.1.1", "parsing: 'ИОАН 1:1'")
		expect(p.parse("ЙОАН 1:1").osis()).toEqual("John.1.1", "parsing: 'ЙОАН 1:1'")
		expect(p.parse("ИН 1:1").osis()).toEqual("John.1.1", "parsing: 'ИН 1:1'")
		expect(p.parse("ЙН 1:1").osis()).toEqual("John.1.1", "parsing: 'ЙН 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Acts (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Acts (bg)", function() {
      
		expect(p.parse("Деяния на светите Апостоли 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Деяния на светите Апостоли 1:1'")
		expect(p.parse("Деянията на апостолите 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Деянията на апостолите 1:1'")
		expect(p.parse("Деяния на апостолите 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Деяния на апостолите 1:1'")
		expect(p.parse("Апостол 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Апостол 1:1'")
		expect(p.parse("Деяния 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Деяния 1:1'")
		expect(p.parse("Acts 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Acts 1:1'")
		expect(p.parse("Д. А 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Д. А 1:1'")
		expect(p.parse("Дела 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Дела 1:1'")
		expect(p.parse("Деян 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Деян 1:1'")
		expect(p.parse("Д А 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Д А 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ДЕЯНИЯ НА СВЕТИТЕ АПОСТОЛИ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ДЕЯНИЯ НА СВЕТИТЕ АПОСТОЛИ 1:1'")
		expect(p.parse("ДЕЯНИЯТА НА АПОСТОЛИТЕ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ДЕЯНИЯТА НА АПОСТОЛИТЕ 1:1'")
		expect(p.parse("ДЕЯНИЯ НА АПОСТОЛИТЕ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ДЕЯНИЯ НА АПОСТОЛИТЕ 1:1'")
		expect(p.parse("АПОСТОЛ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'АПОСТОЛ 1:1'")
		expect(p.parse("ДЕЯНИЯ 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ДЕЯНИЯ 1:1'")
		expect(p.parse("ACTS 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ACTS 1:1'")
		expect(p.parse("Д. А 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Д. А 1:1'")
		expect(p.parse("ДЕЛА 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ДЕЛА 1:1'")
		expect(p.parse("ДЕЯН 1:1").osis()).toEqual("Acts.1.1", "parsing: 'ДЕЯН 1:1'")
		expect(p.parse("Д А 1:1").osis()).toEqual("Acts.1.1", "parsing: 'Д А 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Rom (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Rom (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Римляни 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Послание на св. ап. Павла до Римляни 1:1'")
		expect(p.parse("Послание на св ап. Павла до Римляни 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Послание на св ап. Павла до Римляни 1:1'")
		expect(p.parse("Послание на св. ап Павла до Римляни 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Послание на св. ап Павла до Римляни 1:1'")
		expect(p.parse("Послание на св ап Павла до Римляни 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Послание на св ап Павла до Римляни 1:1'")
		expect(p.parse("Послание към римляните 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Послание към римляните 1:1'")
		expect(p.parse("римляните 1:1").osis()).toEqual("Rom.1.1", "parsing: 'римляните 1:1'")
		expect(p.parse("Римляни 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Римляни 1:1'")
		expect(p.parse("Римл 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Римл 1:1'")
		expect(p.parse("Rom 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Rom 1:1'")
		expect(p.parse("Рим 1:1").osis()).toEqual("Rom.1.1", "parsing: 'Рим 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО РИМЛЯНИ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО РИМЛЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО РИМЛЯНИ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО РИМЛЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО РИМЛЯНИ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО РИМЛЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО РИМЛЯНИ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО РИМЛЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ РИМЛЯНИТЕ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ПОСЛАНИЕ КЪМ РИМЛЯНИТЕ 1:1'")
		expect(p.parse("РИМЛЯНИТЕ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'РИМЛЯНИТЕ 1:1'")
		expect(p.parse("РИМЛЯНИ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'РИМЛЯНИ 1:1'")
		expect(p.parse("РИМЛ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'РИМЛ 1:1'")
		expect(p.parse("ROM 1:1").osis()).toEqual("Rom.1.1", "parsing: 'ROM 1:1'")
		expect(p.parse("РИМ 1:1").osis()).toEqual("Rom.1.1", "parsing: 'РИМ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Cor (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Cor (bg)", function() {
      
		expect(p.parse("Второ послание на св. ап. Павла до Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ послание на св. ап. Павла до Коринтяни 1:1'")
		expect(p.parse("Второ послание на св ап. Павла до Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ послание на св ап. Павла до Коринтяни 1:1'")
		expect(p.parse("Второ послание на св. ап Павла до Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ послание на св. ап Павла до Коринтяни 1:1'")
		expect(p.parse("Второ послание на св ап Павла до Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ послание на св ап Павла до Коринтяни 1:1'")
		expect(p.parse("Второ послание към коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ послание към коринтяните 1:1'")
		expect(p.parse("Втора Коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Втора Коринтяните 1:1'")
		expect(p.parse("Второ Коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ Коринтяните 1:1'")
		expect(p.parse("II. Коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Коринтяните 1:1'")
		expect(p.parse("Втора Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Втора Коринтяни 1:1'")
		expect(p.parse("Второ Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ Коринтяни 1:1'")
		expect(p.parse("2. Коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Коринтяните 1:1'")
		expect(p.parse("II Коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Коринтяните 1:1'")
		expect(p.parse("2 Коринтяните 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Коринтяните 1:1'")
		expect(p.parse("II. Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Коринтяни 1:1'")
		expect(p.parse("2. Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Коринтяни 1:1'")
		expect(p.parse("II Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Коринтяни 1:1'")
		expect(p.parse("2 Коринтяни 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Коринтяни 1:1'")
		expect(p.parse("Втора Кор 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Втора Кор 1:1'")
		expect(p.parse("Второ Кор 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'Второ Кор 1:1'")
		expect(p.parse("II. Кор 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. Кор 1:1'")
		expect(p.parse("2. Кор 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. Кор 1:1'")
		expect(p.parse("II Кор 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II Кор 1:1'")
		expect(p.parse("2 Кор 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 Кор 1:1'")
		expect(p.parse("2Cor 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ КЪМ КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ КЪМ КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("ВТОРА КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРА КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("ВТОРО КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("II. КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("ВТОРА КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРА КОРИНТЯНИ 1:1'")
		expect(p.parse("ВТОРО КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО КОРИНТЯНИ 1:1'")
		expect(p.parse("2. КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("II КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("2 КОРИНТЯНИТЕ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("II. КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. КОРИНТЯНИ 1:1'")
		expect(p.parse("2. КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. КОРИНТЯНИ 1:1'")
		expect(p.parse("II КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II КОРИНТЯНИ 1:1'")
		expect(p.parse("2 КОРИНТЯНИ 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 КОРИНТЯНИ 1:1'")
		expect(p.parse("ВТОРА КОР 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРА КОР 1:1'")
		expect(p.parse("ВТОРО КОР 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'ВТОРО КОР 1:1'")
		expect(p.parse("II. КОР 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II. КОР 1:1'")
		expect(p.parse("2. КОР 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2. КОР 1:1'")
		expect(p.parse("II КОР 1:1").osis()).toEqual("2Cor.1.1", "parsing: 'II КОР 1:1'")
		expect(p.parse("2 КОР 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2 КОР 1:1'")
		expect(p.parse("2COR 1:1").osis()).toEqual("2Cor.1.1", "parsing: '2COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Cor (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Cor (bg)", function() {
      
		expect(p.parse("Първо послание на св. ап. Павла до Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо послание на св. ап. Павла до Коринтяни 1:1'")
		expect(p.parse("Първо послание на св ап. Павла до Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо послание на св ап. Павла до Коринтяни 1:1'")
		expect(p.parse("Първо послание на св. ап Павла до Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо послание на св. ап Павла до Коринтяни 1:1'")
		expect(p.parse("Първо послание на св ап Павла до Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо послание на св ап Павла до Коринтяни 1:1'")
		expect(p.parse("Първо послание към коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо послание към коринтяните 1:1'")
		expect(p.parse("Първа Коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първа Коринтяните 1:1'")
		expect(p.parse("Първо Коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо Коринтяните 1:1'")
		expect(p.parse("Първа Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първа Коринтяни 1:1'")
		expect(p.parse("Първо Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо Коринтяни 1:1'")
		expect(p.parse("1. Коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Коринтяните 1:1'")
		expect(p.parse("I. Коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Коринтяните 1:1'")
		expect(p.parse("1 Коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Коринтяните 1:1'")
		expect(p.parse("I Коринтяните 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Коринтяните 1:1'")
		expect(p.parse("1. Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Коринтяни 1:1'")
		expect(p.parse("I. Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Коринтяни 1:1'")
		expect(p.parse("1 Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Коринтяни 1:1'")
		expect(p.parse("I Коринтяни 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Коринтяни 1:1'")
		expect(p.parse("Първа Кор 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първа Кор 1:1'")
		expect(p.parse("Първо Кор 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'Първо Кор 1:1'")
		expect(p.parse("1. Кор 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. Кор 1:1'")
		expect(p.parse("I. Кор 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. Кор 1:1'")
		expect(p.parse("1 Кор 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 Кор 1:1'")
		expect(p.parse("I Кор 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I Кор 1:1'")
		expect(p.parse("1Cor 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1Cor 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО КОРИНТЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ КЪМ КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ КЪМ КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("ПЪРВА КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВА КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("ПЪРВО КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("ПЪРВА КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВА КОРИНТЯНИ 1:1'")
		expect(p.parse("ПЪРВО КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО КОРИНТЯНИ 1:1'")
		expect(p.parse("1. КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("I. КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("1 КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("I КОРИНТЯНИТЕ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I КОРИНТЯНИТЕ 1:1'")
		expect(p.parse("1. КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. КОРИНТЯНИ 1:1'")
		expect(p.parse("I. КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. КОРИНТЯНИ 1:1'")
		expect(p.parse("1 КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 КОРИНТЯНИ 1:1'")
		expect(p.parse("I КОРИНТЯНИ 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I КОРИНТЯНИ 1:1'")
		expect(p.parse("ПЪРВА КОР 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВА КОР 1:1'")
		expect(p.parse("ПЪРВО КОР 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'ПЪРВО КОР 1:1'")
		expect(p.parse("1. КОР 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1. КОР 1:1'")
		expect(p.parse("I. КОР 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I. КОР 1:1'")
		expect(p.parse("1 КОР 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1 КОР 1:1'")
		expect(p.parse("I КОР 1:1").osis()).toEqual("1Cor.1.1", "parsing: 'I КОР 1:1'")
		expect(p.parse("1COR 1:1").osis()).toEqual("1Cor.1.1", "parsing: '1COR 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Gal (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Gal (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Галатяни 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Послание на св. ап. Павла до Галатяни 1:1'")
		expect(p.parse("Послание на св ап. Павла до Галатяни 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Послание на св ап. Павла до Галатяни 1:1'")
		expect(p.parse("Послание на св. ап Павла до Галатяни 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Послание на св. ап Павла до Галатяни 1:1'")
		expect(p.parse("Послание на св ап Павла до Галатяни 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Послание на св ап Павла до Галатяни 1:1'")
		expect(p.parse("Послание към галатяните 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Послание към галатяните 1:1'")
		expect(p.parse("Галатяните 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Галатяните 1:1'")
		expect(p.parse("Галатяни 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Галатяни 1:1'")
		expect(p.parse("Gal 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Gal 1:1'")
		expect(p.parse("Гал 1:1").osis()).toEqual("Gal.1.1", "parsing: 'Гал 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ГАЛАТЯНИ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ГАЛАТЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ГАЛАТЯНИ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ГАЛАТЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ГАЛАТЯНИ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ГАЛАТЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ГАЛАТЯНИ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ГАЛАТЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ ГАЛАТЯНИТЕ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ПОСЛАНИЕ КЪМ ГАЛАТЯНИТЕ 1:1'")
		expect(p.parse("ГАЛАТЯНИТЕ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ГАЛАТЯНИТЕ 1:1'")
		expect(p.parse("ГАЛАТЯНИ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ГАЛАТЯНИ 1:1'")
		expect(p.parse("GAL 1:1").osis()).toEqual("Gal.1.1", "parsing: 'GAL 1:1'")
		expect(p.parse("ГАЛ 1:1").osis()).toEqual("Gal.1.1", "parsing: 'ГАЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Eph (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Eph (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Ефесяни 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Послание на св. ап. Павла до Ефесяни 1:1'")
		expect(p.parse("Послание на св ап. Павла до Ефесяни 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Послание на св ап. Павла до Ефесяни 1:1'")
		expect(p.parse("Послание на св. ап Павла до Ефесяни 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Послание на св. ап Павла до Ефесяни 1:1'")
		expect(p.parse("Послание на св ап Павла до Ефесяни 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Послание на св ап Павла до Ефесяни 1:1'")
		expect(p.parse("Послание към ефесяните 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Послание към ефесяните 1:1'")
		expect(p.parse("Ефесяните 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Ефесяните 1:1'")
		expect(p.parse("Ефесяни 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Ефесяни 1:1'")
		expect(p.parse("Eph 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Eph 1:1'")
		expect(p.parse("Еф 1:1").osis()).toEqual("Eph.1.1", "parsing: 'Еф 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ЕФЕСЯНИ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ЕФЕСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ЕФЕСЯНИ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ЕФЕСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ЕФЕСЯНИ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ЕФЕСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ЕФЕСЯНИ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ЕФЕСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ ЕФЕСЯНИТЕ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ПОСЛАНИЕ КЪМ ЕФЕСЯНИТЕ 1:1'")
		expect(p.parse("ЕФЕСЯНИТЕ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ЕФЕСЯНИТЕ 1:1'")
		expect(p.parse("ЕФЕСЯНИ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ЕФЕСЯНИ 1:1'")
		expect(p.parse("EPH 1:1").osis()).toEqual("Eph.1.1", "parsing: 'EPH 1:1'")
		expect(p.parse("ЕФ 1:1").osis()).toEqual("Eph.1.1", "parsing: 'ЕФ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phil (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Phil (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Филипяни 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Послание на св. ап. Павла до Филипяни 1:1'")
		expect(p.parse("Послание на св ап. Павла до Филипяни 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Послание на св ап. Павла до Филипяни 1:1'")
		expect(p.parse("Послание на св. ап Павла до Филипяни 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Послание на св. ап Павла до Филипяни 1:1'")
		expect(p.parse("Послание на св ап Павла до Филипяни 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Послание на св ап Павла до Филипяни 1:1'")
		expect(p.parse("Послание към филипяните 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Послание към филипяните 1:1'")
		expect(p.parse("Филипяните 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Филипяните 1:1'")
		expect(p.parse("Филипяни 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Филипяни 1:1'")
		expect(p.parse("Phil 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Phil 1:1'")
		expect(p.parse("Фил 1:1").osis()).toEqual("Phil.1.1", "parsing: 'Фил 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ФИЛИПЯНИ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ФИЛИПЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ФИЛИПЯНИ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ФИЛИПЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ФИЛИПЯНИ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ФИЛИПЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ФИЛИПЯНИ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ФИЛИПЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ ФИЛИПЯНИТЕ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ПОСЛАНИЕ КЪМ ФИЛИПЯНИТЕ 1:1'")
		expect(p.parse("ФИЛИПЯНИТЕ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ФИЛИПЯНИТЕ 1:1'")
		expect(p.parse("ФИЛИПЯНИ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ФИЛИПЯНИ 1:1'")
		expect(p.parse("PHIL 1:1").osis()).toEqual("Phil.1.1", "parsing: 'PHIL 1:1'")
		expect(p.parse("ФИЛ 1:1").osis()).toEqual("Phil.1.1", "parsing: 'ФИЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Col (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Col (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Колосяни 1:1").osis()).toEqual("Col.1.1", "parsing: 'Послание на св. ап. Павла до Колосяни 1:1'")
		expect(p.parse("Послание на св ап. Павла до Колосяни 1:1").osis()).toEqual("Col.1.1", "parsing: 'Послание на св ап. Павла до Колосяни 1:1'")
		expect(p.parse("Послание на св. ап Павла до Колосяни 1:1").osis()).toEqual("Col.1.1", "parsing: 'Послание на св. ап Павла до Колосяни 1:1'")
		expect(p.parse("Послание на св ап Павла до Колосяни 1:1").osis()).toEqual("Col.1.1", "parsing: 'Послание на св ап Павла до Колосяни 1:1'")
		expect(p.parse("Послание към колосяните 1:1").osis()).toEqual("Col.1.1", "parsing: 'Послание към колосяните 1:1'")
		expect(p.parse("Колосяните 1:1").osis()).toEqual("Col.1.1", "parsing: 'Колосяните 1:1'")
		expect(p.parse("Колосяни 1:1").osis()).toEqual("Col.1.1", "parsing: 'Колосяни 1:1'")
		expect(p.parse("Col 1:1").osis()).toEqual("Col.1.1", "parsing: 'Col 1:1'")
		expect(p.parse("Кол 1:1").osis()).toEqual("Col.1.1", "parsing: 'Кол 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО КОЛОСЯНИ 1:1").osis()).toEqual("Col.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО КОЛОСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО КОЛОСЯНИ 1:1").osis()).toEqual("Col.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО КОЛОСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО КОЛОСЯНИ 1:1").osis()).toEqual("Col.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО КОЛОСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО КОЛОСЯНИ 1:1").osis()).toEqual("Col.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО КОЛОСЯНИ 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ КОЛОСЯНИТЕ 1:1").osis()).toEqual("Col.1.1", "parsing: 'ПОСЛАНИЕ КЪМ КОЛОСЯНИТЕ 1:1'")
		expect(p.parse("КОЛОСЯНИТЕ 1:1").osis()).toEqual("Col.1.1", "parsing: 'КОЛОСЯНИТЕ 1:1'")
		expect(p.parse("КОЛОСЯНИ 1:1").osis()).toEqual("Col.1.1", "parsing: 'КОЛОСЯНИ 1:1'")
		expect(p.parse("COL 1:1").osis()).toEqual("Col.1.1", "parsing: 'COL 1:1'")
		expect(p.parse("КОЛ 1:1").osis()).toEqual("Col.1.1", "parsing: 'КОЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Thess (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Thess (bg)", function() {
      
		expect(p.parse("Второ послание на св. ап. Павла до Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ послание на св. ап. Павла до Солуняни 1:1'")
		expect(p.parse("Второ послание на св ап. Павла до Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ послание на св ап. Павла до Солуняни 1:1'")
		expect(p.parse("Второ послание на св. ап Павла до Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ послание на св. ап Павла до Солуняни 1:1'")
		expect(p.parse("Второ послание на св ап Павла до Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ послание на св ап Павла до Солуняни 1:1'")
		expect(p.parse("Второ послание към солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ послание към солунците 1:1'")
		expect(p.parse("Втора Солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Втора Солунците 1:1'")
		expect(p.parse("Второ Солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ Солунците 1:1'")
		expect(p.parse("Втора Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Втора Солуняни 1:1'")
		expect(p.parse("Второ Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ Солуняни 1:1'")
		expect(p.parse("II. Солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Солунците 1:1'")
		expect(p.parse("Втора Солунци 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Втора Солунци 1:1'")
		expect(p.parse("Второ Солунци 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ Солунци 1:1'")
		expect(p.parse("2. Солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Солунците 1:1'")
		expect(p.parse("II Солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Солунците 1:1'")
		expect(p.parse("II. Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Солуняни 1:1'")
		expect(p.parse("2 Солунците 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Солунците 1:1'")
		expect(p.parse("2. Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Солуняни 1:1'")
		expect(p.parse("II Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Солуняни 1:1'")
		expect(p.parse("II. Солунци 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Солунци 1:1'")
		expect(p.parse("2 Солуняни 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Солуняни 1:1'")
		expect(p.parse("2. Солунци 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Солунци 1:1'")
		expect(p.parse("II Солунци 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Солунци 1:1'")
		expect(p.parse("2 Солунци 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Солунци 1:1'")
		expect(p.parse("Втора Сол 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Втора Сол 1:1'")
		expect(p.parse("Второ Сол 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'Второ Сол 1:1'")
		expect(p.parse("II. Сол 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. Сол 1:1'")
		expect(p.parse("2. Сол 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. Сол 1:1'")
		expect(p.parse("2Thess 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2Thess 1:1'")
		expect(p.parse("II Сол 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II Сол 1:1'")
		expect(p.parse("2 Сол 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 Сол 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ КЪМ СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ КЪМ СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ВТОРА СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРА СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ВТОРО СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ВТОРА СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРА СОЛУНЯНИ 1:1'")
		expect(p.parse("ВТОРО СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО СОЛУНЯНИ 1:1'")
		expect(p.parse("II. СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ВТОРА СОЛУНЦИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРА СОЛУНЦИ 1:1'")
		expect(p.parse("ВТОРО СОЛУНЦИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО СОЛУНЦИ 1:1'")
		expect(p.parse("2. СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. СОЛУНЦИТЕ 1:1'")
		expect(p.parse("II СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II СОЛУНЦИТЕ 1:1'")
		expect(p.parse("II. СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. СОЛУНЯНИ 1:1'")
		expect(p.parse("2 СОЛУНЦИТЕ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 СОЛУНЦИТЕ 1:1'")
		expect(p.parse("2. СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. СОЛУНЯНИ 1:1'")
		expect(p.parse("II СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II СОЛУНЯНИ 1:1'")
		expect(p.parse("II. СОЛУНЦИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. СОЛУНЦИ 1:1'")
		expect(p.parse("2 СОЛУНЯНИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 СОЛУНЯНИ 1:1'")
		expect(p.parse("2. СОЛУНЦИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. СОЛУНЦИ 1:1'")
		expect(p.parse("II СОЛУНЦИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II СОЛУНЦИ 1:1'")
		expect(p.parse("2 СОЛУНЦИ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 СОЛУНЦИ 1:1'")
		expect(p.parse("ВТОРА СОЛ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРА СОЛ 1:1'")
		expect(p.parse("ВТОРО СОЛ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'ВТОРО СОЛ 1:1'")
		expect(p.parse("II. СОЛ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II. СОЛ 1:1'")
		expect(p.parse("2. СОЛ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2. СОЛ 1:1'")
		expect(p.parse("2THESS 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2THESS 1:1'")
		expect(p.parse("II СОЛ 1:1").osis()).toEqual("2Thess.1.1", "parsing: 'II СОЛ 1:1'")
		expect(p.parse("2 СОЛ 1:1").osis()).toEqual("2Thess.1.1", "parsing: '2 СОЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Thess (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Thess (bg)", function() {
      
		expect(p.parse("Първо послание на св. ап. Павла до Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо послание на св. ап. Павла до Солуняни 1:1'")
		expect(p.parse("Първо послание на св ап. Павла до Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо послание на св ап. Павла до Солуняни 1:1'")
		expect(p.parse("Първо послание на св. ап Павла до Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо послание на св. ап Павла до Солуняни 1:1'")
		expect(p.parse("Първо послание на св ап Павла до Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо послание на св ап Павла до Солуняни 1:1'")
		expect(p.parse("Първо послание към солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо послание към солунците 1:1'")
		expect(p.parse("Първа Солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първа Солунците 1:1'")
		expect(p.parse("Първо Солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо Солунците 1:1'")
		expect(p.parse("Първа Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първа Солуняни 1:1'")
		expect(p.parse("Първо Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо Солуняни 1:1'")
		expect(p.parse("Първа Солунци 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първа Солунци 1:1'")
		expect(p.parse("Първо Солунци 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо Солунци 1:1'")
		expect(p.parse("1. Солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Солунците 1:1'")
		expect(p.parse("I. Солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Солунците 1:1'")
		expect(p.parse("1 Солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Солунците 1:1'")
		expect(p.parse("1. Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Солуняни 1:1'")
		expect(p.parse("I Солунците 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Солунците 1:1'")
		expect(p.parse("I. Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Солуняни 1:1'")
		expect(p.parse("1 Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Солуняни 1:1'")
		expect(p.parse("1. Солунци 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Солунци 1:1'")
		expect(p.parse("I Солуняни 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Солуняни 1:1'")
		expect(p.parse("I. Солунци 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Солунци 1:1'")
		expect(p.parse("1 Солунци 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Солунци 1:1'")
		expect(p.parse("I Солунци 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Солунци 1:1'")
		expect(p.parse("Първа Сол 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първа Сол 1:1'")
		expect(p.parse("Първо Сол 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'Първо Сол 1:1'")
		expect(p.parse("1. Сол 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. Сол 1:1'")
		expect(p.parse("1Thess 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1Thess 1:1'")
		expect(p.parse("I. Сол 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. Сол 1:1'")
		expect(p.parse("1 Сол 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 Сол 1:1'")
		expect(p.parse("I Сол 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I Сол 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО СОЛУНЯНИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ КЪМ СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ КЪМ СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ПЪРВА СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВА СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ПЪРВО СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО СОЛУНЦИТЕ 1:1'")
		expect(p.parse("ПЪРВА СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВА СОЛУНЯНИ 1:1'")
		expect(p.parse("ПЪРВО СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО СОЛУНЯНИ 1:1'")
		expect(p.parse("ПЪРВА СОЛУНЦИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВА СОЛУНЦИ 1:1'")
		expect(p.parse("ПЪРВО СОЛУНЦИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО СОЛУНЦИ 1:1'")
		expect(p.parse("1. СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. СОЛУНЦИТЕ 1:1'")
		expect(p.parse("I. СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. СОЛУНЦИТЕ 1:1'")
		expect(p.parse("1 СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 СОЛУНЦИТЕ 1:1'")
		expect(p.parse("1. СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. СОЛУНЯНИ 1:1'")
		expect(p.parse("I СОЛУНЦИТЕ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I СОЛУНЦИТЕ 1:1'")
		expect(p.parse("I. СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. СОЛУНЯНИ 1:1'")
		expect(p.parse("1 СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 СОЛУНЯНИ 1:1'")
		expect(p.parse("1. СОЛУНЦИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. СОЛУНЦИ 1:1'")
		expect(p.parse("I СОЛУНЯНИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I СОЛУНЯНИ 1:1'")
		expect(p.parse("I. СОЛУНЦИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. СОЛУНЦИ 1:1'")
		expect(p.parse("1 СОЛУНЦИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 СОЛУНЦИ 1:1'")
		expect(p.parse("I СОЛУНЦИ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I СОЛУНЦИ 1:1'")
		expect(p.parse("ПЪРВА СОЛ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВА СОЛ 1:1'")
		expect(p.parse("ПЪРВО СОЛ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'ПЪРВО СОЛ 1:1'")
		expect(p.parse("1. СОЛ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1. СОЛ 1:1'")
		expect(p.parse("1THESS 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1THESS 1:1'")
		expect(p.parse("I. СОЛ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I. СОЛ 1:1'")
		expect(p.parse("1 СОЛ 1:1").osis()).toEqual("1Thess.1.1", "parsing: '1 СОЛ 1:1'")
		expect(p.parse("I СОЛ 1:1").osis()).toEqual("1Thess.1.1", "parsing: 'I СОЛ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Tim (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Tim (bg)", function() {
      
		expect(p.parse("Второ послание на св. ап. Павла до Тимотея 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ послание на св. ап. Павла до Тимотея 1:1'")
		expect(p.parse("Второ послание на св ап. Павла до Тимотея 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ послание на св ап. Павла до Тимотея 1:1'")
		expect(p.parse("Второ послание на св. ап Павла до Тимотея 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ послание на св. ап Павла до Тимотея 1:1'")
		expect(p.parse("Второ послание на св ап Павла до Тимотея 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ послание на св ап Павла до Тимотея 1:1'")
		expect(p.parse("Второ послание към Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ послание към Тимотеи 1:1'")
		expect(p.parse("Второ послание към Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ послание към Тимотей 1:1'")
		expect(p.parse("Втора Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Втора Тимотеи 1:1'")
		expect(p.parse("Втора Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Втора Тимотей 1:1'")
		expect(p.parse("Второ Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ Тимотеи 1:1'")
		expect(p.parse("Второ Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ Тимотей 1:1'")
		expect(p.parse("II. Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Тимотеи 1:1'")
		expect(p.parse("II. Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Тимотей 1:1'")
		expect(p.parse("2. Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Тимотеи 1:1'")
		expect(p.parse("2. Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Тимотей 1:1'")
		expect(p.parse("II Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Тимотеи 1:1'")
		expect(p.parse("II Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Тимотей 1:1'")
		expect(p.parse("2 Тимотеи 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Тимотеи 1:1'")
		expect(p.parse("2 Тимотей 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Тимотей 1:1'")
		expect(p.parse("Втора Тим 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Втора Тим 1:1'")
		expect(p.parse("Второ Тим 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'Второ Тим 1:1'")
		expect(p.parse("II. Тим 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. Тим 1:1'")
		expect(p.parse("2. Тим 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. Тим 1:1'")
		expect(p.parse("II Тим 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II Тим 1:1'")
		expect(p.parse("2 Тим 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 Тим 1:1'")
		expect(p.parse("2Tim 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ КЪМ ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ КЪМ ТИМОТЕИ 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ КЪМ ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ КЪМ ТИМОТЕЙ 1:1'")
		expect(p.parse("ВТОРА ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРА ТИМОТЕИ 1:1'")
		expect(p.parse("ВТОРА ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРА ТИМОТЕЙ 1:1'")
		expect(p.parse("ВТОРО ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ТИМОТЕИ 1:1'")
		expect(p.parse("ВТОРО ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ТИМОТЕЙ 1:1'")
		expect(p.parse("II. ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. ТИМОТЕИ 1:1'")
		expect(p.parse("II. ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. ТИМОТЕЙ 1:1'")
		expect(p.parse("2. ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. ТИМОТЕИ 1:1'")
		expect(p.parse("2. ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. ТИМОТЕЙ 1:1'")
		expect(p.parse("II ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II ТИМОТЕИ 1:1'")
		expect(p.parse("II ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II ТИМОТЕЙ 1:1'")
		expect(p.parse("2 ТИМОТЕИ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 ТИМОТЕИ 1:1'")
		expect(p.parse("2 ТИМОТЕЙ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 ТИМОТЕЙ 1:1'")
		expect(p.parse("ВТОРА ТИМ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРА ТИМ 1:1'")
		expect(p.parse("ВТОРО ТИМ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'ВТОРО ТИМ 1:1'")
		expect(p.parse("II. ТИМ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II. ТИМ 1:1'")
		expect(p.parse("2. ТИМ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2. ТИМ 1:1'")
		expect(p.parse("II ТИМ 1:1").osis()).toEqual("2Tim.1.1", "parsing: 'II ТИМ 1:1'")
		expect(p.parse("2 ТИМ 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2 ТИМ 1:1'")
		expect(p.parse("2TIM 1:1").osis()).toEqual("2Tim.1.1", "parsing: '2TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Tim (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Tim (bg)", function() {
      
		expect(p.parse("Първо послание на св. ап. Павла до Тимотея 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо послание на св. ап. Павла до Тимотея 1:1'")
		expect(p.parse("Първо послание на св ап. Павла до Тимотея 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо послание на св ап. Павла до Тимотея 1:1'")
		expect(p.parse("Първо послание на св. ап Павла до Тимотея 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо послание на св. ап Павла до Тимотея 1:1'")
		expect(p.parse("Първо послание на св ап Павла до Тимотея 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо послание на св ап Павла до Тимотея 1:1'")
		expect(p.parse("Първо послание към Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо послание към Тимотеи 1:1'")
		expect(p.parse("Първо послание към Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо послание към Тимотей 1:1'")
		expect(p.parse("Първа Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първа Тимотеи 1:1'")
		expect(p.parse("Първа Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първа Тимотей 1:1'")
		expect(p.parse("Първо Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо Тимотеи 1:1'")
		expect(p.parse("Първо Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо Тимотей 1:1'")
		expect(p.parse("1. Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Тимотеи 1:1'")
		expect(p.parse("1. Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Тимотей 1:1'")
		expect(p.parse("I. Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Тимотеи 1:1'")
		expect(p.parse("I. Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Тимотей 1:1'")
		expect(p.parse("1 Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Тимотеи 1:1'")
		expect(p.parse("1 Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Тимотей 1:1'")
		expect(p.parse("I Тимотеи 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Тимотеи 1:1'")
		expect(p.parse("I Тимотей 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Тимотей 1:1'")
		expect(p.parse("Първа Тим 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първа Тим 1:1'")
		expect(p.parse("Първо Тим 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'Първо Тим 1:1'")
		expect(p.parse("1. Тим 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. Тим 1:1'")
		expect(p.parse("I. Тим 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. Тим 1:1'")
		expect(p.parse("1 Тим 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 Тим 1:1'")
		expect(p.parse("I Тим 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I Тим 1:1'")
		expect(p.parse("1Tim 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1Tim 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ТИМОТЕЯ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ТИМОТЕЯ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ КЪМ ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ КЪМ ТИМОТЕИ 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ КЪМ ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ КЪМ ТИМОТЕЙ 1:1'")
		expect(p.parse("ПЪРВА ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВА ТИМОТЕИ 1:1'")
		expect(p.parse("ПЪРВА ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВА ТИМОТЕЙ 1:1'")
		expect(p.parse("ПЪРВО ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ТИМОТЕИ 1:1'")
		expect(p.parse("ПЪРВО ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ТИМОТЕЙ 1:1'")
		expect(p.parse("1. ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. ТИМОТЕИ 1:1'")
		expect(p.parse("1. ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. ТИМОТЕЙ 1:1'")
		expect(p.parse("I. ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. ТИМОТЕИ 1:1'")
		expect(p.parse("I. ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. ТИМОТЕЙ 1:1'")
		expect(p.parse("1 ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 ТИМОТЕИ 1:1'")
		expect(p.parse("1 ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 ТИМОТЕЙ 1:1'")
		expect(p.parse("I ТИМОТЕИ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I ТИМОТЕИ 1:1'")
		expect(p.parse("I ТИМОТЕЙ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I ТИМОТЕЙ 1:1'")
		expect(p.parse("ПЪРВА ТИМ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВА ТИМ 1:1'")
		expect(p.parse("ПЪРВО ТИМ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'ПЪРВО ТИМ 1:1'")
		expect(p.parse("1. ТИМ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1. ТИМ 1:1'")
		expect(p.parse("I. ТИМ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I. ТИМ 1:1'")
		expect(p.parse("1 ТИМ 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1 ТИМ 1:1'")
		expect(p.parse("I ТИМ 1:1").osis()).toEqual("1Tim.1.1", "parsing: 'I ТИМ 1:1'")
		expect(p.parse("1TIM 1:1").osis()).toEqual("1Tim.1.1", "parsing: '1TIM 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Titus (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Titus (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Тита 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Послание на св. ап. Павла до Тита 1:1'")
		expect(p.parse("Послание на св ап. Павла до Тита 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Послание на св ап. Павла до Тита 1:1'")
		expect(p.parse("Послание на св. ап Павла до Тита 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Послание на св. ап Павла до Тита 1:1'")
		expect(p.parse("Послание на св ап Павла до Тита 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Послание на св ап Павла до Тита 1:1'")
		expect(p.parse("Послание към Тит 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Послание към Тит 1:1'")
		expect(p.parse("Titus 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Titus 1:1'")
		expect(p.parse("Тит 1:1").osis()).toEqual("Titus.1.1", "parsing: 'Тит 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ТИТА 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ТИТА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ТИТА 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ТИТА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ТИТА 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ТИТА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ТИТА 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ТИТА 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ ТИТ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ПОСЛАНИЕ КЪМ ТИТ 1:1'")
		expect(p.parse("TITUS 1:1").osis()).toEqual("Titus.1.1", "parsing: 'TITUS 1:1'")
		expect(p.parse("ТИТ 1:1").osis()).toEqual("Titus.1.1", "parsing: 'ТИТ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Phlm (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Phlm (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Филимона 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Послание на св. ап. Павла до Филимона 1:1'")
		expect(p.parse("Послание на св ап. Павла до Филимона 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Послание на св ап. Павла до Филимона 1:1'")
		expect(p.parse("Послание на св. ап Павла до Филимона 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Послание на св. ап Павла до Филимона 1:1'")
		expect(p.parse("Послание на св ап Павла до Филимона 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Послание на св ап Павла до Филимона 1:1'")
		expect(p.parse("Послание към Филимон 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Послание към Филимон 1:1'")
		expect(p.parse("Филимон 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Филимон 1:1'")
		expect(p.parse("Филим 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Филим 1:1'")
		expect(p.parse("Phlm 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Phlm 1:1'")
		expect(p.parse("Флм 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'Флм 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ФИЛИМОНА 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ФИЛИМОНА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ФИЛИМОНА 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ФИЛИМОНА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ФИЛИМОНА 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ФИЛИМОНА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ФИЛИМОНА 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ФИЛИМОНА 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ ФИЛИМОН 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ПОСЛАНИЕ КЪМ ФИЛИМОН 1:1'")
		expect(p.parse("ФИЛИМОН 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ФИЛИМОН 1:1'")
		expect(p.parse("ФИЛИМ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ФИЛИМ 1:1'")
		expect(p.parse("PHLM 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'PHLM 1:1'")
		expect(p.parse("ФЛМ 1:1").osis()).toEqual("Phlm.1.1", "parsing: 'ФЛМ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Heb (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Heb (bg)", function() {
      
		expect(p.parse("Послание на св. ап. Павла до Евреите 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Послание на св. ап. Павла до Евреите 1:1'")
		expect(p.parse("Послание на св ап. Павла до Евреите 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Послание на св ап. Павла до Евреите 1:1'")
		expect(p.parse("Послание на св. ап Павла до Евреите 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Послание на св. ап Павла до Евреите 1:1'")
		expect(p.parse("Послание на св ап Павла до Евреите 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Послание на св ап Павла до Евреите 1:1'")
		expect(p.parse("Послание към евреите 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Послание към евреите 1:1'")
		expect(p.parse("Евреите 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Евреите 1:1'")
		expect(p.parse("Евреи 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Евреи 1:1'")
		expect(p.parse("Heb 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Heb 1:1'")
		expect(p.parse("Евр 1:1").osis()).toEqual("Heb.1.1", "parsing: 'Евр 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ЕВРЕИТЕ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП. ПАВЛА ДО ЕВРЕИТЕ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ЕВРЕИТЕ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП. ПАВЛА ДО ЕВРЕИТЕ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ЕВРЕИТЕ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ПОСЛАНИЕ НА СВ. АП ПАВЛА ДО ЕВРЕИТЕ 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ЕВРЕИТЕ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ПОСЛАНИЕ НА СВ АП ПАВЛА ДО ЕВРЕИТЕ 1:1'")
		expect(p.parse("ПОСЛАНИЕ КЪМ ЕВРЕИТЕ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ПОСЛАНИЕ КЪМ ЕВРЕИТЕ 1:1'")
		expect(p.parse("ЕВРЕИТЕ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ЕВРЕИТЕ 1:1'")
		expect(p.parse("ЕВРЕИ 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ЕВРЕИ 1:1'")
		expect(p.parse("HEB 1:1").osis()).toEqual("Heb.1.1", "parsing: 'HEB 1:1'")
		expect(p.parse("ЕВР 1:1").osis()).toEqual("Heb.1.1", "parsing: 'ЕВР 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jas (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jas (bg)", function() {
      
		expect(p.parse("Съборно послание на св. ап. Иакова 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Съборно послание на св. ап. Иакова 1:1'")
		expect(p.parse("Съборно послание на св ап. Иакова 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Съборно послание на св ап. Иакова 1:1'")
		expect(p.parse("Съборно послание на св. ап Иакова 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Съборно послание на св. ап Иакова 1:1'")
		expect(p.parse("Съборно послание на св ап Иакова 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Съборно послание на св ап Иакова 1:1'")
		expect(p.parse("Послание на Яков 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Послание на Яков 1:1'")
		expect(p.parse("Яков 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Яков 1:1'")
		expect(p.parse("Jas 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Jas 1:1'")
		expect(p.parse("Иак 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Иак 1:1'")
		expect(p.parse("Як 1:1").osis()).toEqual("Jas.1.1", "parsing: 'Як 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИАКОВА 1:1").osis()).toEqual("Jas.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИАКОВА 1:1'")
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИАКОВА 1:1").osis()).toEqual("Jas.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИАКОВА 1:1'")
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИАКОВА 1:1").osis()).toEqual("Jas.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИАКОВА 1:1'")
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ АП ИАКОВА 1:1").osis()).toEqual("Jas.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ АП ИАКОВА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА ЯКОВ 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ПОСЛАНИЕ НА ЯКОВ 1:1'")
		expect(p.parse("ЯКОВ 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ЯКОВ 1:1'")
		expect(p.parse("JAS 1:1").osis()).toEqual("Jas.1.1", "parsing: 'JAS 1:1'")
		expect(p.parse("ИАК 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ИАК 1:1'")
		expect(p.parse("ЯК 1:1").osis()).toEqual("Jas.1.1", "parsing: 'ЯК 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Pet (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Pet (bg)", function() {
      
		expect(p.parse("Второ съборно послание на св. ап. Петра 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ съборно послание на св. ап. Петра 1:1'")
		expect(p.parse("Второ съборно послание на св ап. Петра 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ съборно послание на св ап. Петра 1:1'")
		expect(p.parse("Второ съборно послание на св. ап Петра 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ съборно послание на св. ап Петра 1:1'")
		expect(p.parse("Второ съборно послание на св ап Петра 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ съборно послание на св ап Петра 1:1'")
		expect(p.parse("Второ послание на Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ послание на Петър 1:1'")
		expect(p.parse("Втора Петрово 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Втора Петрово 1:1'")
		expect(p.parse("Второ Петрово 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ Петрово 1:1'")
		expect(p.parse("II. Петрово 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Петрово 1:1'")
		expect(p.parse("Втора Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Втора Петър 1:1'")
		expect(p.parse("Второ Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ Петър 1:1'")
		expect(p.parse("2. Петрово 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Петрово 1:1'")
		expect(p.parse("II Петрово 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Петрово 1:1'")
		expect(p.parse("Втора Петр 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Втора Петр 1:1'")
		expect(p.parse("Второ Петр 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ Петр 1:1'")
		expect(p.parse("2 Петрово 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Петрово 1:1'")
		expect(p.parse("II. Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Петър 1:1'")
		expect(p.parse("Втора Пет 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Втора Пет 1:1'")
		expect(p.parse("Второ Пет 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'Второ Пет 1:1'")
		expect(p.parse("2. Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Петър 1:1'")
		expect(p.parse("II Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Петър 1:1'")
		expect(p.parse("II. Петр 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Петр 1:1'")
		expect(p.parse("2 Петър 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Петър 1:1'")
		expect(p.parse("2. Петр 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Петр 1:1'")
		expect(p.parse("II Петр 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Петр 1:1'")
		expect(p.parse("II. Пет 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. Пет 1:1'")
		expect(p.parse("2 Петр 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Петр 1:1'")
		expect(p.parse("2. Пет 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. Пет 1:1'")
		expect(p.parse("II Пет 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II Пет 1:1'")
		expect(p.parse("2 Пет 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 Пет 1:1'")
		expect(p.parse("2Pet 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ПЕТРА 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ПЕТРА 1:1'")
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ПЕТРА 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ПЕТРА 1:1'")
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ПЕТРА 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ПЕТРА 1:1'")
		expect(p.parse("ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП ПЕТРА 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО СЪБОРНО ПОСЛАНИЕ НА СВ АП ПЕТРА 1:1'")
		expect(p.parse("ВТОРО ПОСЛАНИЕ НА ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО ПОСЛАНИЕ НА ПЕТЪР 1:1'")
		expect(p.parse("ВТОРА ПЕТРОВО 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРА ПЕТРОВО 1:1'")
		expect(p.parse("ВТОРО ПЕТРОВО 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО ПЕТРОВО 1:1'")
		expect(p.parse("II. ПЕТРОВО 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. ПЕТРОВО 1:1'")
		expect(p.parse("ВТОРА ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРА ПЕТЪР 1:1'")
		expect(p.parse("ВТОРО ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО ПЕТЪР 1:1'")
		expect(p.parse("2. ПЕТРОВО 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. ПЕТРОВО 1:1'")
		expect(p.parse("II ПЕТРОВО 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II ПЕТРОВО 1:1'")
		expect(p.parse("ВТОРА ПЕТР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРА ПЕТР 1:1'")
		expect(p.parse("ВТОРО ПЕТР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО ПЕТР 1:1'")
		expect(p.parse("2 ПЕТРОВО 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 ПЕТРОВО 1:1'")
		expect(p.parse("II. ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. ПЕТЪР 1:1'")
		expect(p.parse("ВТОРА ПЕТ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРА ПЕТ 1:1'")
		expect(p.parse("ВТОРО ПЕТ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'ВТОРО ПЕТ 1:1'")
		expect(p.parse("2. ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. ПЕТЪР 1:1'")
		expect(p.parse("II ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II ПЕТЪР 1:1'")
		expect(p.parse("II. ПЕТР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. ПЕТР 1:1'")
		expect(p.parse("2 ПЕТЪР 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 ПЕТЪР 1:1'")
		expect(p.parse("2. ПЕТР 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. ПЕТР 1:1'")
		expect(p.parse("II ПЕТР 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II ПЕТР 1:1'")
		expect(p.parse("II. ПЕТ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II. ПЕТ 1:1'")
		expect(p.parse("2 ПЕТР 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 ПЕТР 1:1'")
		expect(p.parse("2. ПЕТ 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2. ПЕТ 1:1'")
		expect(p.parse("II ПЕТ 1:1").osis()).toEqual("2Pet.1.1", "parsing: 'II ПЕТ 1:1'")
		expect(p.parse("2 ПЕТ 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2 ПЕТ 1:1'")
		expect(p.parse("2PET 1:1").osis()).toEqual("2Pet.1.1", "parsing: '2PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Pet (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Pet (bg)", function() {
      
		expect(p.parse("Първо съборно послание на св. ап. Петра 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо съборно послание на св. ап. Петра 1:1'")
		expect(p.parse("Първо съборно послание на св ап. Петра 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо съборно послание на св ап. Петра 1:1'")
		expect(p.parse("Първо съборно послание на св. ап Петра 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо съборно послание на св. ап Петра 1:1'")
		expect(p.parse("Първо съборно послание на св ап Петра 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо съборно послание на св ап Петра 1:1'")
		expect(p.parse("Първо послание на Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо послание на Петър 1:1'")
		expect(p.parse("Първа Петрово 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първа Петрово 1:1'")
		expect(p.parse("Първо Петрово 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо Петрово 1:1'")
		expect(p.parse("Първа Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първа Петър 1:1'")
		expect(p.parse("Първо Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо Петър 1:1'")
		expect(p.parse("1. Петрово 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Петрово 1:1'")
		expect(p.parse("I. Петрово 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Петрово 1:1'")
		expect(p.parse("Първа Петр 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първа Петр 1:1'")
		expect(p.parse("Първо Петр 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо Петр 1:1'")
		expect(p.parse("1 Петрово 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Петрово 1:1'")
		expect(p.parse("I Петрово 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Петрово 1:1'")
		expect(p.parse("Първа Пет 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първа Пет 1:1'")
		expect(p.parse("Първо Пет 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'Първо Пет 1:1'")
		expect(p.parse("1. Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Петър 1:1'")
		expect(p.parse("I. Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Петър 1:1'")
		expect(p.parse("1 Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Петър 1:1'")
		expect(p.parse("1. Петр 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Петр 1:1'")
		expect(p.parse("I Петър 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Петър 1:1'")
		expect(p.parse("I. Петр 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Петр 1:1'")
		expect(p.parse("1 Петр 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Петр 1:1'")
		expect(p.parse("1. Пет 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. Пет 1:1'")
		expect(p.parse("I Петр 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Петр 1:1'")
		expect(p.parse("I. Пет 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. Пет 1:1'")
		expect(p.parse("1 Пет 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 Пет 1:1'")
		expect(p.parse("I Пет 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I Пет 1:1'")
		expect(p.parse("1Pet 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1Pet 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ПЕТРА 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ПЕТРА 1:1'")
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ПЕТРА 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП. ПЕТРА 1:1'")
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ПЕТРА 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ. АП ПЕТРА 1:1'")
		expect(p.parse("ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП ПЕТРА 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО СЪБОРНО ПОСЛАНИЕ НА СВ АП ПЕТРА 1:1'")
		expect(p.parse("ПЪРВО ПОСЛАНИЕ НА ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО ПОСЛАНИЕ НА ПЕТЪР 1:1'")
		expect(p.parse("ПЪРВА ПЕТРОВО 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВА ПЕТРОВО 1:1'")
		expect(p.parse("ПЪРВО ПЕТРОВО 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО ПЕТРОВО 1:1'")
		expect(p.parse("ПЪРВА ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВА ПЕТЪР 1:1'")
		expect(p.parse("ПЪРВО ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО ПЕТЪР 1:1'")
		expect(p.parse("1. ПЕТРОВО 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. ПЕТРОВО 1:1'")
		expect(p.parse("I. ПЕТРОВО 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. ПЕТРОВО 1:1'")
		expect(p.parse("ПЪРВА ПЕТР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВА ПЕТР 1:1'")
		expect(p.parse("ПЪРВО ПЕТР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО ПЕТР 1:1'")
		expect(p.parse("1 ПЕТРОВО 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 ПЕТРОВО 1:1'")
		expect(p.parse("I ПЕТРОВО 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I ПЕТРОВО 1:1'")
		expect(p.parse("ПЪРВА ПЕТ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВА ПЕТ 1:1'")
		expect(p.parse("ПЪРВО ПЕТ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'ПЪРВО ПЕТ 1:1'")
		expect(p.parse("1. ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. ПЕТЪР 1:1'")
		expect(p.parse("I. ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. ПЕТЪР 1:1'")
		expect(p.parse("1 ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 ПЕТЪР 1:1'")
		expect(p.parse("1. ПЕТР 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. ПЕТР 1:1'")
		expect(p.parse("I ПЕТЪР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I ПЕТЪР 1:1'")
		expect(p.parse("I. ПЕТР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. ПЕТР 1:1'")
		expect(p.parse("1 ПЕТР 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 ПЕТР 1:1'")
		expect(p.parse("1. ПЕТ 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1. ПЕТ 1:1'")
		expect(p.parse("I ПЕТР 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I ПЕТР 1:1'")
		expect(p.parse("I. ПЕТ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I. ПЕТ 1:1'")
		expect(p.parse("1 ПЕТ 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1 ПЕТ 1:1'")
		expect(p.parse("I ПЕТ 1:1").osis()).toEqual("1Pet.1.1", "parsing: 'I ПЕТ 1:1'")
		expect(p.parse("1PET 1:1").osis()).toEqual("1Pet.1.1", "parsing: '1PET 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jude (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jude (bg)", function() {
      
		expect(p.parse("Съборно послание на св. ап. Иуда 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Съборно послание на св. ап. Иуда 1:1'")
		expect(p.parse("Съборно послание на св ап. Иуда 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Съборно послание на св ап. Иуда 1:1'")
		expect(p.parse("Съборно послание на св. ап Иуда 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Съборно послание на св. ап Иуда 1:1'")
		expect(p.parse("Съборно послание на св ап Иуда 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Съборно послание на св ап Иуда 1:1'")
		expect(p.parse("Послание на Юда 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Послание на Юда 1:1'")
		expect(p.parse("Jude 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Jude 1:1'")
		expect(p.parse("Иуд 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Иуд 1:1'")
		expect(p.parse("Юда 1:1").osis()).toEqual("Jude.1.1", "parsing: 'Юда 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИУДА 1:1").osis()).toEqual("Jude.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ. АП. ИУДА 1:1'")
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИУДА 1:1").osis()).toEqual("Jude.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ АП. ИУДА 1:1'")
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИУДА 1:1").osis()).toEqual("Jude.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ. АП ИУДА 1:1'")
		expect(p.parse("СЪБОРНО ПОСЛАНИЕ НА СВ АП ИУДА 1:1").osis()).toEqual("Jude.1.1", "parsing: 'СЪБОРНО ПОСЛАНИЕ НА СВ АП ИУДА 1:1'")
		expect(p.parse("ПОСЛАНИЕ НА ЮДА 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ПОСЛАНИЕ НА ЮДА 1:1'")
		expect(p.parse("JUDE 1:1").osis()).toEqual("Jude.1.1", "parsing: 'JUDE 1:1'")
		expect(p.parse("ИУД 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ИУД 1:1'")
		expect(p.parse("ЮДА 1:1").osis()).toEqual("Jude.1.1", "parsing: 'ЮДА 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Tob (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Tob (bg)", function() {
      
		expect(p.parse("Книга на Товита 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Книга на Товита 1:1'")
		expect(p.parse("Книга за Тобия 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Книга за Тобия 1:1'")
		expect(p.parse("Книга на Товит 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Книга на Товит 1:1'")
		expect(p.parse("Товита 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Товита 1:1'")
		expect(p.parse("Тобия 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Тобия 1:1'")
		expect(p.parse("Товит 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Товит 1:1'")
		expect(p.parse("Tob 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Tob 1:1'")
		expect(p.parse("Тов 1:1").osis()).toEqual("Tob.1.1", "parsing: 'Тов 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Jdt (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Jdt (bg)", function() {
      
		expect(p.parse("Книга за Юдита 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Книга за Юдита 1:1'")
		expect(p.parse("Книга Иудит 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Книга Иудит 1:1'")
		expect(p.parse("Иудит 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Иудит 1:1'")
		expect(p.parse("Юдит 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Юдит 1:1'")
		expect(p.parse("Jdt 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Jdt 1:1'")
		expect(p.parse("Юд 1:1").osis()).toEqual("Jdt.1.1", "parsing: 'Юд 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Bar (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Bar (bg)", function() {
      
		expect(p.parse("Книга на пророк Варуха 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Книга на пророк Варуха 1:1'")
		expect(p.parse("Книга на Барух 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Книга на Барух 1:1'")
		expect(p.parse("Варуха 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Варуха 1:1'")
		expect(p.parse("Варух 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Варух 1:1'")
		expect(p.parse("Bar 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Bar 1:1'")
		expect(p.parse("Вар 1:1").osis()).toEqual("Bar.1.1", "parsing: 'Вар 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Sus (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Sus (bg)", function() {
      
		expect(p.parse("Сусана 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Сусана 1:1'")
		expect(p.parse("Sus 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Sus 1:1'")
		expect(p.parse("Сус 1:1").osis()).toEqual("Sus.1.1", "parsing: 'Сус 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 2Macc (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 2Macc (bg)", function() {
      
		expect(p.parse("Втора книга на Макавеите 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Втора книга на Макавеите 1:1'")
		expect(p.parse("Втора книга Макавеиска 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Втора книга Макавеиска 1:1'")
		expect(p.parse("Втора книга Макавейска 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Втора книга Макавейска 1:1'")
		expect(p.parse("Втора Макавеи 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Втора Макавеи 1:1'")
		expect(p.parse("Второ Макавеи 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'Второ Макавеи 1:1'")
		expect(p.parse("II. Макавеи 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II. Макавеи 1:1'")
		expect(p.parse("2. Макавеи 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2. Макавеи 1:1'")
		expect(p.parse("II Макавеи 1:1").osis()).toEqual("2Macc.1.1", "parsing: 'II Макавеи 1:1'")
		expect(p.parse("2 Макавеи 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Макавеи 1:1'")
		expect(p.parse("2 Мак 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2 Мак 1:1'")
		expect(p.parse("2Macc 1:1").osis()).toEqual("2Macc.1.1", "parsing: '2Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 3Macc (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 3Macc (bg)", function() {
      
		expect(p.parse("Трето книга на Макавеите 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Трето книга на Макавеите 1:1'")
		expect(p.parse("Трета книга Макавеиска 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Трета книга Макавеиска 1:1'")
		expect(p.parse("Трета книга Макавейска 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Трета книга Макавейска 1:1'")
		expect(p.parse("Трета Макавеи 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Трета Макавеи 1:1'")
		expect(p.parse("Трето Макавеи 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'Трето Макавеи 1:1'")
		expect(p.parse("III. Макавеи 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III. Макавеи 1:1'")
		expect(p.parse("III Макавеи 1:1").osis()).toEqual("3Macc.1.1", "parsing: 'III Макавеи 1:1'")
		expect(p.parse("3. Макавеи 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3. Макавеи 1:1'")
		expect(p.parse("3 Макавеи 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Макавеи 1:1'")
		expect(p.parse("3 Мак 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3 Мак 1:1'")
		expect(p.parse("3Macc 1:1").osis()).toEqual("3Macc.1.1", "parsing: '3Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 4Macc (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 4Macc (bg)", function() {
      
		expect(p.parse("Четвърта книга на Макавеите 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Четвърта книга на Макавеите 1:1'")
		expect(p.parse("Четвърта Макавеи 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Четвърта Макавеи 1:1'")
		expect(p.parse("Четвърто Макавеи 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'Четвърто Макавеи 1:1'")
		expect(p.parse("IV. Макавеи 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV. Макавеи 1:1'")
		expect(p.parse("4. Макавеи 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4. Макавеи 1:1'")
		expect(p.parse("IV Макавеи 1:1").osis()).toEqual("4Macc.1.1", "parsing: 'IV Макавеи 1:1'")
		expect(p.parse("4 Макавеи 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Макавеи 1:1'")
		expect(p.parse("4 Мак 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4 Мак 1:1'")
		expect(p.parse("4Macc 1:1").osis()).toEqual("4Macc.1.1", "parsing: '4Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book 1Macc (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: 1Macc (bg)", function() {
      
		expect(p.parse("Първа книга на Макавеите 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Първа книга на Макавеите 1:1'")
		expect(p.parse("Първа книга Макавеиска 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Първа книга Макавеиска 1:1'")
		expect(p.parse("Първа книга Макавейска 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Първа книга Макавейска 1:1'")
		expect(p.parse("Първа Макавеи 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Първа Макавеи 1:1'")
		expect(p.parse("Първо Макавеи 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'Първо Макавеи 1:1'")
		expect(p.parse("1. Макавеи 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1. Макавеи 1:1'")
		expect(p.parse("I. Макавеи 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I. Макавеи 1:1'")
		expect(p.parse("1 Макавеи 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Макавеи 1:1'")
		expect(p.parse("I Макавеи 1:1").osis()).toEqual("1Macc.1.1", "parsing: 'I Макавеи 1:1'")
		expect(p.parse("1 Мак 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1 Мак 1:1'")
		expect(p.parse("1Macc 1:1").osis()).toEqual("1Macc.1.1", "parsing: '1Macc 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Ezek,Ezra (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Ezek,Ezra (bg)", function() {
      
		expect(p.parse("Ез 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'Ез 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("ЕЗ 1:1").osis()).toEqual("Ezek.1.1", "parsing: 'ЕЗ 1:1'")
		;
      return true;
    });
  });

  describe("Localized book Hab,Obad (bg)", function() {
    var p;
    p = {};
    beforeEach(function() {
      p = new bcv_parser();
      p.set_options({
        book_alone_strategy: "ignore",
        book_sequence_strategy: "ignore",
        osis_compaction_strategy: "bc",
        captive_end_digits_strategy: "delete"
      });
      return p.include_apocrypha(true);
    });
    return it("should handle book: Hab,Obad (bg)", function() {
      
		expect(p.parse("Ав 1:1").osis()).toEqual("Hab.1.1", "parsing: 'Ав 1:1'")
		p.include_apocrypha(false)
		expect(p.parse("АВ 1:1").osis()).toEqual("Hab.1.1", "parsing: 'АВ 1:1'")
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
      return expect(p.languages).toEqual(["bg"]);
    });
    it("should handle ranges (bg)", function() {
      expect(p.parse("Titus 1:1 - 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 - 2'");
      expect(p.parse("Matt 1-2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1-2'");
      return expect(p.parse("Phlm 2 - 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 - 3'");
    });
    it("should handle chapters (bg)", function() {
      expect(p.parse("Titus 1:1, глава 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, глава 2'");
      expect(p.parse("Matt 3:4 ГЛАВА 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 ГЛАВА 6'");
      expect(p.parse("Titus 1:1, глави 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, глави 2'");
      expect(p.parse("Matt 3:4 ГЛАВИ 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 ГЛАВИ 6'");
      expect(p.parse("Titus 1:1, гл 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, гл 2'");
      return expect(p.parse("Matt 3:4 ГЛ 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 ГЛ 6'");
    });
    it("should handle verses (bg)", function() {
      expect(p.parse("Exod 1:1 ст 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 ст 3'");
      return expect(p.parse("Phlm СТ 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm СТ 6'");
    });
    it("should handle 'and' (bg)", function() {
      expect(p.parse("Exod 1:1 и 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 и 3'");
      return expect(p.parse("Phlm 2 И 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 И 6'");
    });
    it("should handle titles (bg)", function() {
      expect(p.parse("Ps 3 title, 4:2, 5:title").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 title, 4:2, 5:title'");
      return expect(p.parse("PS 3 TITLE, 4:2, 5:TITLE").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'PS 3 TITLE, 4:2, 5:TITLE'");
    });
    it("should handle 'ff' (bg)", function() {
      expect(p.parse("Rev 3и сл, 4:2и сл").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3и сл, 4:2и сл'");
      return expect(p.parse("REV 3 И СЛ, 4:2 И СЛ").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'REV 3 И СЛ, 4:2 И СЛ'");
    });
    it("should handle translations (bg)", function() {
      expect(p.parse("Lev 1 (BPB)").osis_and_translations()).toEqual([["Lev.1", "BPB"]]);
      expect(p.parse("lev 1 bpb").osis_and_translations()).toEqual([["Lev.1", "BPB"]]);
      expect(p.parse("Lev 1 (ERV)").osis_and_translations()).toEqual([["Lev.1", "ERV"]]);
      return expect(p.parse("lev 1 erv").osis_and_translations()).toEqual([["Lev.1", "ERV"]]);
    });
    it("should handle book ranges (bg)", function() {
      p.set_options({
        book_alone_strategy: "full",
        book_range_strategy: "include"
      });
      expect(p.parse("Първа - Трета  Иоан").osis()).toEqual("1John.1-3John.1", "parsing: 'Първа - Трета  Иоан'");
      return expect(p.parse("Първа - Трета  Йоан").osis()).toEqual("1John.1-3John.1", "parsing: 'Първа - Трета  Йоан'");
    });
    return it("should handle boundaries (bg)", function() {
      p.set_options({
        book_alone_strategy: "full"
      });
      expect(p.parse("\u2014Matt\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\u2014Matt\u2014'");
      return expect(p.parse("\u201cMatt 1:1\u201d").osis()).toEqual("Matt.1.1", "parsing: '\u201cMatt 1:1\u201d'");
    });
  });

}).call(this);
