// @ts-nocheck
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const fs = require("fs");

const lang = "en";
const max_length = 100;

const get_abbrevs = function(lang) {
	const lines = fs.readFileSync(`../../src/${lang}/book_names.txt`).toString().split("\n");
	const out = [];
	for (var line of Array.from(lines)) {
		var [osis, abbrev] = Array.from(line.split("\t"));
		if (abbrev != null) { out.push(abbrev); }
	}
	return out;
};

const get_translations = lang => ["AMP", "ASV", "CEB", "CEV", "ERV", "ESV", "HCSB", "KJV", "MSG", "NAB", "NABRE", "NAS", "NASB", "NIRV", "NIV", "NKJV", "NLT", "NRSV", "RSV", "TNIV"];

const get_options = function() {
	const lines = fs.readFileSync("../../Readme.md").toString().split("\n");
	const out = {};
	let option = "";
	let go = false;
	for (var line of Array.from(lines)) {
		var result;
		if (go && line.match(/^### /)) { break; }
		if (line.match(/^### Options/)) { go = true; }
		if (!go) { continue; }
		if (result = line.match(/^\* `(\w+):/)) {
			option = result[1];
			out[option] = [];
		} else if (result = line.match(/^\t\* `(\w+)`/)) {
			out[option].push(result[1]);
		}
	}
	out.passage_existence_strategy = ["b", "bc", "bcv", "bv", "c", "cv", "v", "none"];
	out.include_apocrypha = [true, false];
	return out;
};

const create_options = function(keys) {
	const out = {};
	for (var option of Array.from(keys)) {
		out[option] = get_random_item_from_array(options[option]);
	}
	return out;
};

var get_random_item_from_array = items => items[Math.floor(Math.random() * items.length)];

const build_text = function(keys) {
	const out = [];
	let rand = Math.random();
	const length = Math.ceil(rand * max_length);
	for (let i = 1, end = length, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
		var token = make_token(get_random_item_from_array(keys));
		rand = Math.random();
		if (rand >= 0.5) { token += get_random_item_from_array(possibles.space); }
		out.push(token);
	}
	return out.join("");
};

var make_token = function(type) {
	let token;
	const rand = Math.random();
	const possible = possibles[type];
	if (typeof possible === "string") {
		token = build_nested_string(possible);
	} else if (type.substr(0, 5) === "char_") {
		token = String.fromCharCode(get_random_item_from_array(possible));
	} else {
		token = get_random_item_from_array(possible);
	}
	if ((rand >= 0.5) && type.match(/^translation/)) {
		token = `(${token})`;
	}
	return token;
};

var build_nested_string = function(text) {
	text = text.replace(/\$(\w+)/g, function(matches, type) {
		let match = make_token(type);
		const rand = Math.random();
		if (rand >= 0.5) { match += get_random_item_from_array(possibles.space); }
		return match;
		});
	return text;
};

const {
    bcv_parser
} = require(`../../js/${lang}_bcv_parser`);
const bcv = new bcv_parser;

var possibles = {
	book: get_abbrevs(lang),
	translation: get_translations(lang),
	number: __range__(0, 1100, true),
	chapter: __range__(0, 152, true),
	verse: __range__(0, 177, true),
	cv_sep: [":", ".", "\"", "'", " "],
	range_sep: ["-", "\u2013", "\u2014", "through", "thru", "to"],
	sequence_sep: [",", ";", "/", ":", "&", "-", "\u2013", "\u2014", "~", "and", "compare", "cf", "cf.", "see also", "also", "see", " "],
	title: ["title"],
	in_book_of: ["from the book of", "of the book of", "in the book of"],
	c_explicit: ["chapters", "chapter", "chapts", "chapts.", "chpts", "chpts.", "chapt", "chapt.", "chaps", "chaps.", "chap", "chap.", "chp", "chp.", "chs", "chs.", "cha", "cha.", "ch", "ch."],
	v_explicit: ["verses", "verse", "ver", "ver.", "vss", "vss.", "vs", "vs.", "vv", "vv.", "v", "v."],
	v_letter: ["a", "b", "c", "d", "e"],
	ff: ["ff", "ff."],
	ordinal: ["th", "nd", "st"],
	space: [" ", "\t", "\n", "\u00a0"],
	punctuation: [",", ".", "!", "?", "-", "'", "\"", "\u2019"],
	parentheses: ["(", ")", "[", "]", "{", "}"],
	letter: ["f", "g", "h", "n"],
	char_ascii: __range__(0, 127, true),
	char_unicode: __range__(128, 65535, true),
	bcv: "$book$chapter$cv_sep$verse",
	b_range: "$book$range_sep$book",
	translation_sequence: "$translation$sequence_sep$translation",
	bc: "$book$chapter",
	bc_range: "$book$chapter$range_sep$book",
	cb: "$c_explicit$chapter$in_book_of$book",
	c_psalm: "$chapter$ordinal$book",
	cv_psalm: "$chapter$ordinal$book$v_explicit$verse"
};

var options = get_options();
const possible_keys = Object.keys(possibles);
const option_keys = Object.keys(options);

let total_length = 0;
const start_time = new Date();
for (let i = 1; i <= 10000000; i++) {
	var my_options = create_options(option_keys);
	bcv.set_options(my_options);
	var text = build_text(possible_keys);
	total_length += text.length;
	if ((i % 1000) === 0) {
		var elapsed_time = Math.round((new Date() - start_time) / 1000);
		var bytes_per_second = Math.round(total_length / elapsed_time);
		console.log(i, elapsed_time, "sec", Math.round(total_length / 1000000), "mb", bytes_per_second, "bps");
	}
	//console.log i, text, "====="
	try {
		var results = bcv.parse(text).osis_and_indices();
		for (var result of Array.from(results)) {
			if (result.indices[0] >= result.indices[1]) { throw result; }
		}
	} catch (e) {
		console.log(e);
		console.log(my_options);
		console.log(text);
		process.exit();
	}
}


function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}