// @ts-nocheck
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS201: Simplify complex destructure assignments
 * DS202: Simplify dynamic range loops
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// This class takes the output from the grammar and turns it into simpler objects for additional processing or for output.

class bcv_passage {
	static initClass() {
		this.prototype.books = [];
		this.prototype.indices = {};
		// `bcv_parser` sets these two.
		this.prototype.options = {};
		this.prototype.translations = {};
	}

	// ## Public
	// Loop through the parsed passages.
	handle_array(passages, accum, context) {
		// `passages` is an array of passage objects.
		if (accum == null) { accum = []; }
		if (context == null) { context = {}; }
		for (var passage of Array.from(passages)) {
			// The grammar can sometimes emit `null`.
			if (passage == null) { continue; }
			// Each `passage` consists of passage objects and, possibly, strings.
			if (passage.type === "stop") { break; }
			[accum, context] = Array.from(this.handle_obj(passage, accum, context));
		}
		return [accum, context];
	}

	// Handle a typical passage object with an `index`, `type`, and array in `value`.
	handle_obj(passage, accum, context) {
		if ((passage.type != null) && (this[passage.type] != null)) {
			return this[passage.type](passage, accum, context);
		} else { return [accum, context]; }
	}

	// ## Types Returned from the PEG.js Grammar
	// These functions correspond to `type` attributes returned from the grammar. They're designed to be called multiple times if necessary.
	//
	// Handle a book on its own ("Gen").
	b(passage, accum, context) {
		let b;
		passage.start_context = bcv_utils.shallow_clone(context);
		passage.passages = [];
		const alternates = [];
		for (b of Array.from(this.books[passage.value].parsed)) {
			var valid = this.validate_ref(passage.start_context.translations, {b});
			var obj = {start: {b}, end: {b}, valid};
			// Use the first valid book.
			if ((passage.passages.length === 0) && valid.valid) {
				passage.passages.push(obj);
			} else {
				alternates.push(obj);
			}
		}
		// If none are valid, use the first one.
		if (passage.passages.length === 0) { passage.passages.push(alternates.shift()); }
		if (alternates.length > 0) { passage.passages[0].alternates = alternates; }
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		accum.push(passage);
		context = {b: passage.passages[0].start.b};
		if (passage.start_context.translations != null) { context.translations = passage.start_context.translations; }
		return [accum, context];
	}

	// Handle book-only ranges ("Gen-Exod").
	b_range(passage, accum, context) {
		return this.range(passage, accum, context);
	}

	// Handle book-only ranges like "1-2 Samuel". It doesn't support multiple ambiguous ranges (like "1-2C"), which it probably shouldn't, anyway.
	b_range_pre(passage, accum, context) {
		let array, end;
		passage.start_context = bcv_utils.shallow_clone(context);
		passage.passages = [];
		const book = this.pluck("b", passage.value);
		array = this.b(book, [], context), [end] = Array.from(array[0]), context = array[1];
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		const start_obj = {b: passage.value[0].value + end.passages[0].start.b.substr(1), type: "b"};
		passage.passages = [{start: start_obj, end: end.passages[0].end, valid: end.passages[0].valid}];
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		accum.push(passage);
		return [accum, context];
	}

	// Handle ranges with a book as the start of the range ("Gen-Exod 2").
	b_range_start(passage, accum, context) {
		return this.range(passage, accum, context);
	}

	// The base (root) object in the grammar controls the base indices.
	base(passage, accum, context) {
		this.indices = this.calculate_indices(passage.match, passage.start_index);
		return this.handle_array(passage.value, accum, context);
	}

	// Handle book-chapter ("Gen 1").
	bc(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		passage.passages = [];
		this.reset_context(context, ["b", "c", "v"]);
		const c = this.pluck("c", passage.value).value;
		const alternates = [];
		for (var b of Array.from(this.books[this.pluck("b", passage.value).value].parsed)) {
			var context_key = "c";
			var valid = this.validate_ref(passage.start_context.translations, {b, c});
			var obj = {start: {b}, end: {b}, valid};
			// Is it really a `bv` object?
			if (valid.messages.start_chapter_not_exist_in_single_chapter_book || valid.messages.start_chapter_1) {
				obj.valid = this.validate_ref(passage.start_context.translations, {b, v: c});
				// If it's `Jude 2`, then note that the chapter doesn't exist.
				if (valid.messages.start_chapter_not_exist_in_single_chapter_book) {
					obj.valid.messages.start_chapter_not_exist_in_single_chapter_book = 1;
				}
				obj.start.c = 1;
				obj.end.c = 1;
				context_key = "v";
			}
			obj.start[context_key] = c;
			// If it's zero, fix it before assigning the end.
			[obj.start.c, obj.start.v] = Array.from(this.fix_start_zeroes(obj.valid, obj.start.c, obj.start.v));
			// Don't want an undefined key hanging around the object.
			if (obj.start.v == null) { delete obj.start.v; }
			obj.end[context_key] = obj.start[context_key];
			if ((passage.passages.length === 0) && obj.valid.valid) {
				passage.passages.push(obj);
			} else {
				alternates.push(obj);
			}
		}
		if (passage.passages.length === 0) { passage.passages.push(alternates.shift()); }
		if (alternates.length > 0) { passage.passages[0].alternates = alternates; }
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		this.set_context_from_object(context, ["b", "c", "v"], passage.passages[0].start);
		accum.push(passage);
		return [accum, context];
	}

	// Handle "Ps 3 title"
	bc_title(passage, accum, context) {
		let array, bc;
		passage.start_context = bcv_utils.shallow_clone(context);
		// First, check to see whether we're dealing with Psalms. If not, treat it as a straight `bc`.
		array = this.bc(this.pluck("bc", passage.value), [], context),
			[bc] = Array.from(array[0]),
			context = array[1];
		// We check the first two characters to handle both `Ps` and `Ps151`.
		if ((bc.passages[0].start.b.substr(0, 2) !== "Ps") && (bc.passages[0].alternates != null)) {
			for (let i = 0, end = bc.passages[0].alternates.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
				if (bc.passages[0].alternates[i].start.b.substr(0, 2) !== "Ps") { continue; }
				// If Psalms is one of the alternates, promote it to the primary passage and discard the others--we know it's right.
				bc.passages[0] = bc.passages[0].alternates[i];
				break;
			}
		}
		if (bc.passages[0].start.b.substr(0, 2) !== "Ps") {
			accum.push(bc);
			return [accum, context];
		}
		// Overwrite all the other book possibilities; the presence of "title" indicates a Psalm. If the previous possibilities were `["Song", "Ps"]`, they're now just `["Ps"]`. Even if it's really `Ps151`, we want `Ps` here because other functions expect it.
		this.books[this.pluck("b", bc.value).value].parsed = ["Ps"];
		// Set the `indices` of the new `v` object to the indices of the `title`. We won't actually use these indices anywhere.
		let title = this.pluck("title", passage.value);
		// The `title` will be null if it's being reparsed from a future translation because we rewrite it as a `bcv` while discarding the original `title` object.
		if (title == null) { title = this.pluck("v", passage.value); }
		passage.value[1] = {type: "v", value: [{type: "integer", value: 1, indices: title.indices}], indices: title.indices};
		// We don't need to preserve the original `type` for reparsing; if it gets here, it'll always be a `bcv`.
		passage.type = "bcv";
		// Treat it as a standard `bcv`.
		return this.bcv(passage, accum, passage.start_context);
	}

	// Handle book chapter:verse ("Gen 1:1").
	bcv(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		passage.passages = [];
		this.reset_context(context, ["b", "c", "v"]);
		const bc = this.pluck("bc", passage.value);
		let c = this.pluck("c", bc.value).value;
		let v = this.pluck("v", passage.value).value;
		const alternates = [];
		for (var b of Array.from(this.books[this.pluck("b", bc.value).value].parsed)) {
			var valid = this.validate_ref(passage.start_context.translations, {b, c, v});
			[c, v] = Array.from(this.fix_start_zeroes(valid, c, v));
			var obj = {start: {b, c, v}, end: {b, c, v}, valid};
			// Use the first valid option.
			if ((passage.passages.length === 0) && valid.valid) {
				passage.passages.push(obj);
			} else {
				alternates.push(obj);
			}
		}
		// If there are no valid options, use the first one.
		if (passage.passages.length === 0) { passage.passages.push(alternates.shift()); }
		if (alternates.length > 0) { passage.passages[0].alternates = alternates; }
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		this.set_context_from_object(context, ["b", "c", "v"], passage.passages[0].start);
		accum.push(passage);
		return [accum, context];
	}

	// Handle "Philemon verse 6." This is unusual.
	bv(passage, accum, context) {
		let array;
		passage.start_context = bcv_utils.shallow_clone(context);
		const [b, v] = Array.from(passage.value);
		// Construct a virtual BCV object with a chapter of 1.
		let bcv = {
			indices: passage.indices,
			value: [
				{type: "bc", value: [b, {type: "c", value: [{type: "integer", value: 1}]}]},
				v
			]
		};
		array = this.bcv(bcv, [], context), [bcv] = Array.from(array[0]), context = array[1];
		passage.passages = bcv.passages;
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		accum.push(passage);
		return [accum, context];
	}

	// Handle a chapter.
	c(passage, accum, context) {
		// This can happen in places like `chapt. 11-1040 of II Kings`, where the invalid range separates the `b` and the `c`.
		passage.start_context = bcv_utils.shallow_clone(context);
		// If it's an actual chapter object, the value we want is in the integer object inside it.
		let c = passage.type === "integer" ? passage.value : this.pluck("integer", passage.value).value;
		const valid = this.validate_ref(passage.start_context.translations, {b: context.b, c});
		// If it's a single-chapter book, then treat it as a verse even if it looks like a chapter (unless its value is `1`).
		if (!valid.valid && valid.messages.start_chapter_not_exist_in_single_chapter_book) {
			return this.v(passage, accum, context);
		}
		[c] = Array.from(this.fix_start_zeroes(valid, c));
		passage.passages = [{start: {b: context.b, c}, end: {b: context.b, c}, valid}];
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		accum.push(passage);
		context.c = c;
		this.reset_context(context, ["v"]);
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		return [accum, context];
	}

	// Handle "23rd Psalm" by recasting it as a `bc`.
	c_psalm(passage, accum, context) {
		// We don't need to preserve the original `type` for reparsing.
		passage.type = "bc";
		// This string always starts with the chapter number, followed by other letters.
		const c = parseInt(this.books[passage.value].value.match(/^\d+/)[0], 10);
		passage.value = [
			{type: "b", value: passage.value, indices: passage.indices},
			{type: "c", value: [{type: "integer", value: c, indices: passage.indices}], indices: passage.indices}
		];
		return this.bc(passage, accum, context);
	}

	// Handle "Ps 3, ch 4:title"
	c_title(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		// If it's not a Psalm, treat it as a regular chapter.
		if (context.b !== "Ps") {
			// Don't change the `type` here because we're not updating the structure to match the `c` expectation if reparsing later.
			return this.c(passage.value[0], accum, context);
		}
		// Add a `v` object and treat it as a regular `cv`.
		const title = this.pluck("title", passage.value);
		passage.value[1] = {type: "v", value: [{type: "integer", value: 1, indices: title.indices}], indices: title.indices};
		// Change the type to match the new parsing strategy.
		passage.type = "cv";
		return this.cv(passage, accum, passage.start_context);
	}

	// Handle a chapter:verse.
	cv(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		let c = this.pluck("c", passage.value).value;
		let v = this.pluck("v", passage.value).value;
		const valid = this.validate_ref(passage.start_context.translations, {b: context.b, c, v});
		[c, v] = Array.from(this.fix_start_zeroes(valid, c, v));
		passage.passages = [{start: {b: context.b, c, v}, end: {b: context.b, c, v}, valid}];
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		accum.push(passage);
		context.c = c;
		context.v = v;
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		return [accum, context];
	}

	// Handle "Chapters 1-2 from Daniel".
	cb_range(passage, accum, context) {
		// We don't need to preserve the original `type` for reparsing.
		passage.type = "range";
		const [b, start_c, end_c] = Array.from(passage.value);
		passage.value = [{type: "bc", value:[b, start_c], indices: passage.indices}, end_c];
		end_c.indices[1] = passage.indices[1];
		return this.range(passage, accum, context);
	}

	// Use an object to establish context for later objects but don't otherwise use it.
	context(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		passage.passages = [];
		for (var key of Object.keys(this.books[passage.value].context || {})) {
			context[key] = this.books[passage.value].context[key];
		}
		accum.push(passage);
		return [accum, context];
	}

	// Handle "23rd Psalm verse 1" by recasting it as a `bcv`.
	cv_psalm(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		// We don't need to preserve the original `type` for reparsing.
		passage.type = "bcv";
		const [c_psalm, v] = Array.from(passage.value);
		const array = this.c_psalm(c_psalm, [], passage.start_context), [bc] = Array.from(array[0]);
		passage.value = [bc, v];
		return this.bcv(passage, accum, context);
	}

	// Handle "and following" (e.g., "Matt 1:1ff") by assuming it means to continue to the end of the current context (end of chapter if a verse is given, end of book if a chapter is given).
	ff(passage, accum, context) {
		let array;
		passage.start_context = bcv_utils.shallow_clone(context);
		// Create a virtual end to pass to `@range`.
		passage.value.push({type: "integer", indices: passage.indices, value: 999});
		array = this.range(passage, [], passage.start_context),
			[passage] = Array.from(array[0]),
			context = array[1];
		// Set the indices to include the end of the range (the "ff").
		passage.value[0].indices = passage.value[1].indices;
		passage.value[0].absolute_indices = passage.value[1].absolute_indices;
		// And then get rid of the virtual end so it doesn't stick around if we need to reparse it later.
		passage.value.pop();
		// Ignore any warnings that the end chapter / verse doesn't exist.
		if (passage.passages[0].valid.messages.end_verse_not_exist != null) { delete passage.passages[0].valid.messages.end_verse_not_exist; }
		if (passage.passages[0].valid.messages.end_chapter_not_exist != null) { delete passage.passages[0].valid.messages.end_chapter_not_exist; }
		if (passage.passages[0].end.original_c != null) { delete passage.passages[0].end.original_c; }
		// `translations` and `absolute_indices` are handled in `@range`.
		accum.push(passage);
		return [accum, context];
	}

	// Handle "Ps 3-4:title" or "Acts 2:22-27. Title"
	integer_title(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		// If it's not Psalms, treat it as a straight integer, ignoring the "title".
		if (context.b !== "Ps") {
			return this.integer(passage.value[0], accum, context);
		}
		// Change the `integer` to a `c` object for later passing to `@cv`.
		passage.value[0] = {type: "c", value: [passage.value[0]], indices: [passage.value[0].indices[0], passage.value[0].indices[1]]};
		// Change the `title` object to a `v` object.
		passage.value[1].type = "v";
		passage.value[1].original_type = "title";
		passage.value[1].value = [{type: "integer", value: 1, indices: passage.value[1].value.indices}];
		// We don't need to preserve the original `type` for reparsing.
		passage.type = "cv";
		return this.cv(passage, accum, passage.start_context);
	}

	// Pass the integer off to whichever handler is relevant.
	integer(passage, accum, context) {
		if (context.v != null) { return this.v(passage, accum, context); }
		return this.c(passage, accum, context);
	}

	// Handle "next verse" (e.g., in Polish, "Matt 1:1n" should be treated as "Matt 1:1-2"). It crosses chapter boundaries but not book boundaries. When given a whole chapter, it assumes the next chapter (again, not crossing book boundaries). The logic here is similar to that of `@ff`.
	next_v(passage, accum, context) {
		let array, psg;
		passage.start_context = bcv_utils.shallow_clone(context);
		// Create a virtual end to pass to `@range`. Start out by just incrementing the last integer in the `passage`.
		let prev_integer = this.pluck_last_recursively("integer", passage.value);
		// The grammar should always produce at least one object in `passage` with an integer, so this shouldn't be necessary.
		if (prev_integer == null) { prev_integer = {value: 1}; }
		// Add a temporary object to serve as the next verse or chapter. We set it to an integer so that we don't have to worry about whether to create a `c` or a `v`.
		passage.value.push({type: "integer", indices: passage.indices, value: prev_integer.value + 1});
		// We don't overwrite the `passage` object here the way we do in `@ff` because the next `if` statement needs access to the original `passage`.
		array = this.range(passage, [], passage.start_context),
			[psg] = Array.from(array[0]),
			context = array[1];
		// If it's at the end of the chapter, try the first verse of the next chapter (unless at the end of a book). Only try if the start verse is valid.
		if ((psg.passages[0].valid.messages.end_verse_not_exist != null) && (psg.passages[0].valid.messages.start_verse_not_exist == null) && (psg.passages[0].valid.messages.start_chapter_not_exist == null) && (context.c != null)) {
			// Get rid of the previous attempt to find the next verse.
			let array1;
			passage.value.pop();
			// Construct a `cv` object that points to the first verse of the next chapter. The `context.c` always indicates the current chapter. The indices don't matter because we discard this entire object once we're done with it.
			passage.value.push({type: "cv", indices: passage.indices, value: [{type: "c", value: [{type: "integer", value: context.c + 1, indices: passage.indices}], indices: passage.indices}, {type: "v", value: [{type: "integer", value: 1, indices: passage.indices}], indices: passage.indices}]});
			// And then try again, forcing `@range` to use the first verse of the next chapter.
			array1 = this.range(passage, [], passage.start_context),
				[psg] = Array.from(array1[0]),
				context = array1[1];
		}
		// Set the indices to include the end of the range (the "n" in Polish).
		psg.value[0].indices = psg.value[1].indices;
		psg.value[0].absolute_indices = psg.value[1].absolute_indices;
		// And then get rid of the virtual end so it doesn't stick around if we need to reparse it later.
		psg.value.pop();
		// Ignore any warnings that the end chapter / verse doesn't exist.
		if (psg.passages[0].valid.messages.end_verse_not_exist != null) { delete psg.passages[0].valid.messages.end_verse_not_exist; }
		if (psg.passages[0].valid.messages.end_chapter_not_exist != null) { delete psg.passages[0].valid.messages.end_chapter_not_exist; }
		if (psg.passages[0].end.original_c != null) { delete psg.passages[0].end.original_c; }
		// `translations` and `absolute_indices` are handled in `@range`.
		accum.push(psg);
		return [accum, context];
	}

	// Handle a sequence of references. This is the only function that can return more than one object in the `passage.passages` array.
	sequence(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		passage.passages = [];
		for (var obj of Array.from(passage.value)) {
			var array, psg;
			array = this.handle_array(obj, [], context), [psg] = Array.from(array[0]), context = array[1];
			// There's only more than one `sub_psg` if there was a range error.
			for (var sub_psg of Array.from(psg.passages)) {
				if (sub_psg.type == null) { sub_psg.type = psg.type; }
				// Add the indices so we can possibly retrieve them later, depending on our `sequence_combination_strategy`.
				if (sub_psg.absolute_indices == null) { sub_psg.absolute_indices = psg.absolute_indices; }
				if (psg.start_context.translations != null) { sub_psg.translations = psg.start_context.translations; }
				// Save the index of any closing punctuation if the sequence ends with a `sequence_post_enclosed`.
				sub_psg.enclosed_absolute_indices = psg.type === "sequence_post_enclosed" ? psg.absolute_indices : [-1, -1];
				passage.passages.push(sub_psg);
			}
		}
		if (passage.absolute_indices == null) {
			// If it's `sequence_post_enclosed`, don't snap the end index; include the closing punctuation.
			if ((passage.passages.length > 0) && (passage.type === "sequence")) {
				passage.absolute_indices = [passage.passages[0].absolute_indices[0], passage.passages[passage.passages.length - 1].absolute_indices[1]];
			} else {
				passage.absolute_indices = this.get_absolute_indices(passage.indices);
			}
		}
		accum.push(passage);
		return [accum, context];
	}

	// Handle a sequence like "Ps 119 (118)," with parentheses. We want to include the closing parenthesis in the indices if `sequence_combination_strategy` is `combine` or if there's a consecutive.
	sequence_post_enclosed(passage, accum, context) {
		return this.sequence(passage, accum, context);
	}

	// Handle a verse, either as part of a sequence or because someone explicitly wrote "verse".
	v(passage, accum, context) {
		let no_c;
		let v = passage.type === "integer" ? passage.value : this.pluck("integer", passage.value).value;
		passage.start_context = bcv_utils.shallow_clone(context);
		// The chapter context might not be set if it follows a book in a sequence.
		const c = (context.c != null) ? context.c : 1;
		const valid = this.validate_ref(passage.start_context.translations, {b: context.b, c, v});
		[no_c, v] = Array.from(this.fix_start_zeroes(valid, 0, v));
		passage.passages = [{start: {b: context.b, c, v}, end: {b: context.b, c, v}, valid}];
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		accum.push(passage);
		context.v = v;
		return [accum, context];
	}

	// ## Ranges
	// Handle any type of start and end range. It doesn't directly return multiple passages, but if there's an error parsing the range, we may convert it into a sequence.
	range(passage, accum, context) {
		let array, array1;
		passage.start_context = bcv_utils.shallow_clone(context);
		let [start, end] = Array.from(passage.value);
		// `@handle_obj` always returns exactly one object that we're interested in.
		array = this.handle_obj(start, [], context), [start] = Array.from(array[0]), context = array[1];
		// Matt 5-verse 6 = Matt.5.6
		if ((end.type === "v") && (((start.type === "bc") && !__guard__(__guard__(__guard__(start.passages != null ? start.passages[0] : undefined, x2 => x2.valid), x1 => x1.messages), x => x.start_chapter_not_exist_in_single_chapter_book))|| (start.type === "c")) && (this.options.end_range_digits_strategy === "verse")) {
			// If we had to change the `type`, reflect that here.
			passage.value[0] = start;
			return this.range_change_integer_end(passage, accum);
		}
		array1 = this.handle_obj(end, [], context), [end] = Array.from(array1[0]), context = array1[1];
		// If we had to change the start or end `type`s, make sure that's reflected in the `value`.
		passage.value = [start, end];
		// Similarly, if we had to adjust the indices, make sure they're reflected in the indices for the range.
		passage.indices = [start.indices[0], end.indices[1]];
		// We'll also need to recalculate these if they exist.
		delete passage.absolute_indices;
		// Create the prospective start and end objects that will end up in `passage.passages`.
		const start_obj = {b: start.passages[0].start.b, c: start.passages[0].start.c, v: start.passages[0].start.v, type: start.type};
		const end_obj = {b: end.passages[0].end.b, c: end.passages[0].end.c, v: end.passages[0].end.v, type: end.type};
		// Make sure references like `Ps 20:1-0:4` don't change to `Ps 20:1-1:4`. In other words, don't upgrade zero end ranges.
		if (end.passages[0].valid.messages.start_chapter_is_zero) { end_obj.c = 0; }
		if (end.passages[0].valid.messages.start_verse_is_zero) { end_obj.v = 0; }
		const valid = this.validate_ref(passage.start_context.translations, start_obj, end_obj);
		// If it's valid, sometimes we want to return the value from `@range_handle_valid_end`, and sometimes not; it depends on what kinds of corrections we need to make.
		if (valid.valid) {
			const [return_now, return_value] = Array.from(this.range_handle_valid(valid, passage, start, start_obj, end, end_obj, accum));
			if (return_now) { return return_value; }
		// If it's invalid, always return the value.
		} else {
			return this.range_handle_invalid(valid, passage, start, start_obj, end, end_obj, accum);
		}
		// We've already reset the indices to match the indices of the contained objects.
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		passage.passages = [{start: start_obj, end: end_obj, valid}];
		if (passage.start_context.translations != null) { passage.passages[0].translations = passage.start_context.translations; }
		// We may need to filter out books on their own depending on the `book_alone_strategy` or the `book_range_strategy`.
		if (start_obj.type === "b") {
			if (end_obj.type === "b") { passage.type = "b_range"; } else { passage.type = "b_range_start"; }
		} else if (end_obj.type === "b") {
			passage.type = "range_end_b";
		}
		accum.push(passage);
		return [accum, context];
	}

	// For Ps 122-23, treat the 23 as 123.
	range_change_end(passage, accum, new_end) {
		let new_obj;
		const [start, end] = Array.from(passage.value);
		if (end.type === "integer") {
			end.original_value = end.value;
			end.value = new_end;
		} else if (end.type === "v") {
			new_obj = this.pluck("integer", end.value);
			new_obj.original_value = new_obj.value;
			new_obj.value = new_end;
		} else if (end.type === "cv") {
			// Get the chapter object and assign it (in place) the new value.
			new_obj = this.pluck("c", end.value);
			new_obj.original_value = new_obj.value;
			new_obj.value = new_end;
		}
		return this.handle_obj(passage, accum, passage.start_context);
	}

	// For "Jer 33-11", treat the "11" as a verse.
	range_change_integer_end(passage, accum) {
		const [start, end] = Array.from(passage.value);
		// We want to retain the originals beacuse a future reparsing may lead to a different outcome.
		if (passage.original_type == null) { passage.original_type = passage.type; }
		if (passage.original_value == null) { passage.original_value = [start, end]; }
		// The start.type is only bc, c, or integer; we're just adding a v for the first two.
		passage.type = start.type === "integer" ? "cv" : start.type + "v";
		// Create the object in the expected format if it's not already a verse.
		if (start.type === "integer") { passage.value[0] = {type: "c", value: [start], indices: start.indices}; }
		if (end.type === "integer") { passage.value[1] = {type: "v", value: [end], indices: end.indices}; }
		return this.handle_obj(passage, accum, passage.start_context);
	}

	// If a new end chapter/verse in a range may be necessary, calculate it.
	range_check_new_end(translations, start_obj, end_obj, valid) {
		let new_end = 0;
		let type = null;
		// See whether a digit might be omitted (e.g., Gen 22-4 = Gen 22-24).
		if (valid.messages.end_chapter_before_start) { type = "c";
		} else if (valid.messages.end_verse_before_start) { type = "v"; }
		if (type != null) { new_end = this.range_get_new_end_value(start_obj, end_obj, valid, type); }
		if (new_end > 0) {
			const obj_to_validate = {b: end_obj.b, c: end_obj.c, v: end_obj.v};
			obj_to_validate[type] = new_end;
			const new_valid = this.validate_ref(translations, obj_to_validate);
			if (!new_valid.valid) { new_end = 0; }
		}
		return new_end;
	}

	// Handle ranges with a book as the end of the range ("Gen 2-Exod"). It's not `b_range_end` because only objects that start with an explicit book name should start with `b`.
	range_end_b(passage, accum, context) {
		return this.range(passage, accum, context);
	}

	// If a sequence has an end chapter/verse that's before the the start, check to see whether it can be salvaged: Gen 28-9 = Gen 28-29; Ps 101-24 = Ps 101-124. The `key` parameter is either `c` (for chapter) or `v` (for verse).
	range_get_new_end_value(start_obj, end_obj, valid, key) {
		// Return 0 unless it's salvageable.
		let new_end = 0;
		if (((key === "c") && valid.messages.end_chapter_is_zero) || ((key === "v") && valid.messages.end_verse_is_zero)) { return new_end; }
		// 54-5, not 54-43, 54-3, or 54-4.
		if ((start_obj[key] >= 10) && (end_obj[key] < 10) && ((start_obj[key] - (10 * Math.floor(start_obj[key] / 10))) < end_obj[key])) {
			// Add the start tens digit to the original end value: 54-5 = 54 through 50 + 5.
			new_end = end_obj[key] + (10 * Math.floor(start_obj[key] / 10));
		// 123-40, not 123-22 or 123-23; 123-4 is taken care of in the first case.
		} else if ((start_obj[key] >= 100) && (end_obj[key] < 100) && ((start_obj[key] - 100) < end_obj[key])) {
			// Add 100 to the original end value: 100-12 = 100 through 100 + 12.
			new_end = end_obj[key] + 100;
		}
		return new_end;
	}

	// The range doesn't look valid, but maybe we can fix it. If not, convert it to a sequence.
	range_handle_invalid(valid, passage, start, start_obj, end, end_obj, accum) {
		// Is it not valid because the end is before the start and the `end` is an `integer` (Matt 15-6) or a `cv` (Matt 15-6:2) (since anything else resets our expectations)?
		//
		// Only go with a `cv` if it's the chapter that's too low (to avoid doing weird things with 31:30-31:1).
		if (((valid.valid === false) && (valid.messages.end_chapter_before_start || valid.messages.end_verse_before_start) && ((end.type === "integer") || (end.type === "v"))) || ((valid.valid === false) && valid.messages.end_chapter_before_start && (end.type === "cv"))) {
			const new_end = this.range_check_new_end(passage.start_context.translations, start_obj, end_obj, valid);
			// If that's the case, then reparse the current passage object after correcting the end value, which is an integer.
			if (new_end > 0) { return this.range_change_end(passage, accum, new_end); }
		}
		// If someone enters "Jer 33-11", they probably mean "Jer.33.11"; as in `@range_handle_valid`, this may be too clever for its own good.
		if ((this.options.end_range_digits_strategy === "verse") && (start_obj.v == null) && ((end.type === "integer") || (end.type === "v"))) {
			// I don't know that `end.type` can ever be `v` here. Such a `c-v` pattern is parsed as `cv`.
			const temp_value = end.type === "v" ? this.pluck("integer", end.value) : end.value;
			const temp_valid = this.validate_ref(passage.start_context.translations, {b: start_obj.b, c: start_obj.c, v: temp_value});
			if (temp_valid.valid) { return this.range_change_integer_end(passage, accum); }
		}
		// Otherwise, if we couldn't fix the range, then treat the range as a sequence. We want to retain the original `type` and `value` in case we need to reparse it differently later.
		if (passage.original_type == null) { passage.original_type = passage.type; }
		passage.type = "sequence";
		// Construct the sequence value in the format expected.
		[passage.original_value, passage.value] = Array.from([[start, end], [[start], [end]]]);
		// Don't use the `context` object because we changed it in `@range`.
		return this.sequence(passage, accum, passage.start_context);
	}

	// The range looks valid, but we should check for some special cases.
	range_handle_valid(valid, passage, start, start_obj, end, end_obj, accum) {
		// If Heb 13-15, treat it as Heb 13:15. This may be too clever for its own good. We check the `passage_existence_strategy` because otherwise `Gen 49-76` becomes `Gen.49.76`.
		if (valid.messages.end_chapter_not_exist && (this.options.end_range_digits_strategy === "verse") && (start_obj.v == null) && ((end.type === "integer") || (end.type === "v")) && (this.options.passage_existence_strategy.indexOf("v") >= 0)) {
			const temp_value = end.type === "v" ? this.pluck("integer", end.value) : end.value;
			const temp_valid = this.validate_ref(passage.start_context.translations, {b: start_obj.b, c: start_obj.c, v: temp_value});
			if (temp_valid.valid) { return [true, this.range_change_integer_end(passage, accum)]; }
		}
		// Otherwise, snap start/end chapters/verses if they're too high or low.
		this.range_validate(valid, start_obj, end_obj, passage);
		return [false, null];
	}

	// If the end object goes past the end of the book or chapter, snap it back to a verse that exists.
	range_validate(valid, start_obj, end_obj, passage) {
		// If it's valid but the end range goes too high, snap it back to the appropriate chapter or verse.
		if (valid.messages.end_chapter_not_exist || valid.messages.end_chapter_not_exist_in_single_chapter_book) {
			// `end_chapter_not_exist` gives the highest chapter for the book.
			end_obj.original_c = end_obj.c;
			end_obj.c = valid.messages.end_chapter_not_exist ? valid.messages.end_chapter_not_exist : valid.messages.end_chapter_not_exist_in_single_chapter_book;
			// If we've snapped it back to the last chapter and there's a verse, also snap to the end of that chapter. If we've already overshot the chapter, there's no reason to think we've gotten the verse right; Gen 50:1-51:1 = Gen 50:1-26 = Gen 50. If there's no verse, we don't need to worry about it.
			if (end_obj.v != null) {
				// `end_verse_not_exist` gives the maximum verse for the chapter.
				end_obj.v = this.validate_ref(passage.start_context.translations, {b: end_obj.b, c: end_obj.c, v: 999}).messages.end_verse_not_exist;
				// If the range ended at Exodus 41:0, make sure we're not going to change it to Exodus 40:1.
				delete valid.messages.end_verse_is_zero;
			}
		// If the end verse is too high, snap back to the maximum verse.
		} else if (valid.messages.end_verse_not_exist) {
			end_obj.original_v = end_obj.v;
			end_obj.v = valid.messages.end_verse_not_exist;
		}
		if (valid.messages.end_verse_is_zero && (this.options.zero_verse_strategy !== "allow")) { end_obj.v = valid.messages.end_verse_is_zero; }
		if (valid.messages.end_chapter_is_zero) { end_obj.c = valid.messages.end_chapter_is_zero; }
		[start_obj.c, start_obj.v] = Array.from(this.fix_start_zeroes(valid, start_obj.c, start_obj.v));
		return true;
	}

	// ## Translations
	// Even a single translation ("NIV") appears as part of a translation sequence. Here we handle the sequence and apply the translations to any previous passages lacking an explicit translation: in "Matt 1, 5 ESV," both `Matt 1` and `5` get applied, but in "Matt 1 NIV, 5 ESV," NIV only applies to Matt 1, and ESV only applies to Matt 5.
	translation_sequence(passage, accum, context) {
		passage.start_context = bcv_utils.shallow_clone(context);
		const translations = [];
		// First get all the translations in the sequence; the first one is separate from the others (which may not exist).
		translations.push({translation: this.books[passage.value[0].value].parsed});
		for (var val of Array.from(passage.value[1])) {
			// `val` at this point is an array.
			val = this.books[this.pluck("translation", val).value].parsed;
			// And now `val` is the literal, lower-cased match.
			if (val != null) { translations.push({translation: val}); }
		}
		// We need some metadata to do this right.
		for (var translation of Array.from(translations)) {
			// Do we know anything about this translation? If so, use that. If not, use the default.
			if (this.translations.aliases[translation.translation] != null) {
				// `alias` is what we use internally to get bcv data for the translation.
				translation.alias = this.translations.aliases[translation.translation].alias;
				// `osis` is what we'll eventually use in output.
				translation.osis = this.translations.aliases[translation.translation].osis || translation.translation.toUpperCase();
			} else {
				translation.alias = "default";
				// If we don't know what the correct abbreviation should be, then just upper-case what we have.
				translation.osis = translation.translation.toUpperCase();
			}
		}
		// Apply the new translations to the existing objects.
		if (accum.length > 0) { context = this.translation_sequence_apply(accum, translations); }
		// We may need these indices later, depending on how we want to output the data.
		if (passage.absolute_indices == null) { passage.absolute_indices = this.get_absolute_indices(passage.indices); }
		// Include the `translation_sequence` object in `accum` so that we can handle any later `translation_sequence` objects without overlapping this one.
		accum.push(passage);
		// Don't carry over the translations into any later references; translations only apply backwards.
		this.reset_context(context, ["translations"]);
		return [accum, context];
	}

	// Go back and find the earliest already-parsed passage without a translation. We start with 0 because the below loop will never yield a 0.
	translation_sequence_apply(accum, translations) {
		let context;
		let use_i = 0;
		// Start with the most recent and go backward--we don't want to overlap another `translation_sequence`.
		for (let start = accum.length - 1, i = start, asc = start <= 0; asc ? i <= 0 : i >= 0; asc ? i++ : i--) {
			// With a new translation comes the possibility that a previously invalid reference will become valid, so reset it to its original type. For example, a multi-book range may be correct in a different translation because the books are in a different order.
			if (accum[i].original_type != null) { accum[i].type = accum[i].original_type; }
			if (accum[i].original_value != null) { accum[i].value = accum[i].original_value; }
			if (accum[i].type !== "translation_sequence") { continue; }
			// If we made it here, then we hit a translation sequence, and we know that the item following it is the first one we care about.
			use_i = i + 1;
			break;
		}
		// Include the translations in the start context.
		//
		// `use_i` == `accum.length` if there are two translations sequences in a row separated by, e.g., numbers ("Matt 1 ESV 2-3 NIV"). This is unusual.
		if (use_i < accum.length) {
			let new_accum;
			accum[use_i].start_context.translations = translations;
			// The objects in accum are replaced in-place, so we don't need to try to merge them back. We re-parse them because the translation may cause previously valid (or invalid) references to flip the other way--if the new translation includes (or doesn't) the Deuterocanonicals, for example. We ignore the `new_accum`, but we definitely care about the new `context`.
			[new_accum, context] = Array.from(this.handle_array(accum.slice(use_i), [], accum[use_i].start_context));
		// Use the start context from the last translation_sequence if that's all that's available.
		} else {
			context = bcv_utils.shallow_clone(accum[accum.length - 1].start_context);
		}
		// We modify `accum` in-place but return the new `context` to the calling function.
		return context;
	}

	// ## Utilities
	// Pluck the object or value matching a type from an array.
	pluck(type, passages) {
		for (var passage of Array.from(passages)) {
			// `passage` can be null if a range needed to be adjusted into a sequence.
			if ((passage == null) || (passage.type == null) || (passage.type !== type)) { continue; }
			if ((type === "c") || (type === "v")) { return this.pluck("integer", passage.value); }
			return passage;
		}
		return null;
	}

	// Pluck the last object or value matching a type, descending as needed into objects.
	pluck_last_recursively(type, passages) {
		// The `-1` means: walk backwards through the array.
		for (let i = passages.length - 1; i >= 0; i--) {
			// Skip null values.
			var passage = passages[i];
			if ((passage == null) || (passage.type == null)) { continue; }
			// Rely on `@pluck` if we've found a match. It expects an array.
			if (passage.type === type) { return this.pluck(type, [passage]); }
			// If `passage.type` exists, we know that `passage.value` exists.
			var value = this.pluck_last_recursively(type, passage.value);
			if (value != null) { return value; }
		}
		return null;
	}

	// Set all the available context keys.
	set_context_from_object(context, keys, obj) {
		return (() => {
			const result = [];
			for (var type of Array.from(keys)) {
				if (obj[type] == null) { continue; }
				result.push(context[type] = obj[type]);
			}
			return result;
		})();
	}

	// Delete all the existing context keys if, for example, starting with a new book.
	reset_context(context, keys) {
		return Array.from(keys).map((type) =>
			delete context[type]);
	}

	// If the start chapter or verse is 0 and the appropriate option is set to `upgrade`, convert it to a 1.
	fix_start_zeroes(valid, c, v) {
		if (valid.messages.start_chapter_is_zero && (this.options.zero_chapter_strategy === "upgrade")) { c = valid.messages.start_chapter_is_zero; }
		if (valid.messages.start_verse_is_zero && (this.options.zero_verse_strategy === "upgrade")) { v = valid.messages.start_verse_is_zero; }
		return [c, v];
	}

	// Given a string and initial index, calculate indices for parts of the string. For example, a string that starts at index 10 might have a book that pushes it to index 12 starting at its third character.
	calculate_indices(match, adjust) {
		// This gets switched out the first time in the loop; the first item is never a book even if a book is the first part of the string--there's an empty string before it.
		let part;
		let switch_type = "book";
		const indices = [];
		let match_index = 0;
		adjust = parseInt(adjust, 10);
		// It would be easier to do `for part in match.split /[\x1e\x1f]/`, but IE doesn't return empty matches when using `split`, throwing off the rest of the logic.
		let parts = [match];
		for (var character of ["\x1e", "\x1f"]) {
			var temp = [];
			for (part of Array.from(parts)) {
				temp = temp.concat(part.split(character));
			}
			parts = temp;
		}

		for (part of Array.from(parts)) {
			// Start off assuming it's not a book.
			var end_index;
			switch_type = switch_type === "book" ? "rest" : "book";
			// Empty strings don't move the index. This could happen with consecutive books.
			var part_length = part.length;
			if (part_length === 0) { continue; }
			// If it's a book, then get the start index of the actual book, add the length of the actual string, then subtract the length of the integer id and the two surrounding characters.
			if (switch_type === "book") {
				// Remove any stray extra indicators.
				part = part.replace(/\/\d+$/, "");
				// Get the length of the id + the surrounding characters. We want the `end` to be the position, not the length. If the part starts at position 0 and is one character (i.e., three characters total, or `\x1f0\x1f`), `end` should be 1, since it occupies positions 0, 1, and 2, and we want the last character to be part of the next index so that we keep track of the end. For example, with "Genesis" at start index 0, the index starting at position 6 ("s") should be 4. Keep the adjust as-is, but set it next.
				end_index = match_index + part_length;
				if ((indices.length > 0) && (indices[indices.length - 1].index === adjust)) {
					indices[indices.length - 1].end = end_index;
				} else {
					indices.push({start: match_index, end: end_index, index: adjust});
				}
				// If the part is one character (three characters total) starting at `match_index` 0, we want the next `match_index` to be 3; it occupies positions 0, 1, and 2. Similarly, if it's two characters, it should be four characters total.
				match_index += part_length + 2;
				// Use the known `start_index` from the book, subtracting the current index in the match, to get the new. So if the previous `match_index` == 5 and the book's id is 0, the book's `start_index` == 10, and the book's length == 7, we want the next adjust to be 10 + 7 - 8 = 9 (the 8 is the `match_index` where the new `adjust` starts): 4(+5) = 9, 5(+5) = 10, 6(+5) = 11, 7(+5) = 12, 8(+9) = 17.
				adjust = (this.books[part].start_index + this.books[part].value.length) - match_index;
				indices.push({start: end_index + 1, end: end_index + 1, index: adjust});
			} else {
				// The `- 1` is because we want the `end` to be the position of the last character. If the part starts at position 0 and is three characters long, the `end` should be two, since it occupies positions 0, 1, and 2.
				end_index = (match_index + part_length) - 1;
				if ((indices.length > 0) && (indices[indices.length - 1].index === adjust)) {
					indices[indices.length - 1].end = end_index;
				} else {
					indices.push({start: match_index, end: end_index, index: adjust});
				}
				match_index += part_length;
			}
		}
		return indices;
	}

	// Find the absolute string indices of start and end points.
	get_absolute_indices(...args) {
		const [start, end] = Array.from(args[0]);
		let start_out = null;
		let end_out = null;
		// `@indices` contains the absolute indices for each range of indices in the string.
		for (var index of Array.from(this.indices)) {
			// If we haven't found the absolute start index yet, set it.
			if ((start_out === null) && (index.start <= start && start <= index.end)) {
				start_out = start + index.index;
			}
			// This may be in the same loop iteration as `start`. The `+ 1` matches Twitter's implementation of indices, where start is the character index and end is the character after the index. So `Gen` is `[0, 3]`.
			if (index.start <= end && end <= index.end) {
				end_out = end + index.index + 1;
				break;
			}
		}
		return [start_out, end_out];
	}

	// ## Validators
	// Given a start and optional end bcv object, validate that the verse exists and is valid. It returns a `true` value for `valid` if any of the translations is valid.
	validate_ref(translations, start, end) {
		// The `translation` key is optional; if it doesn't exist, assume the default translation.
		if ((translations == null) || !(translations.length > 0)) { translations = [{translation: "default", osis: "", alias: "default"}]; }
		let valid = false;
		const messages = {};
		// `translation` is a translation object, but all we care about is the string.
		for (var translation of Array.from(translations)) {
			if (translation.alias == null) { translation.alias = "default"; }
			// Only true if `translation` isn't the right type.
			if (translation.alias == null) {
				if (messages.translation_invalid == null) { messages.translation_invalid = []; }
				messages.translation_invalid.push(translation);
				continue;
			}
			// Not a fatal error because we assume that translations match the default unless we know differently. But we still record it because we may want to know about it later. Translations in `alternates` get generated on-demand.
			if (this.translations.aliases[translation.alias] == null) {
				translation.alias = "default";
				if (messages.translation_unknown == null) { messages.translation_unknown = []; }
				messages.translation_unknown.push(translation);
			}
			var [temp_valid] = Array.from(this.validate_start_ref(translation.alias, start, messages));
			if (end) { [temp_valid] = Array.from(this.validate_end_ref(translation.alias, start, end, temp_valid, messages)); }
			if (temp_valid === true) { valid = true; }
		}
		return {valid, messages};
	}

	// Make sure that the start ref exists in the given translation.
	validate_start_ref(translation, start, messages) {
		let valid = true;
		if ((translation !== "default") && ((this.translations[translation] != null ? this.translations[translation].chapters[start.b] : undefined) == null)) {
			this.promote_book_to_translation(start.b, translation);
		}
		const translation_order = ((this.translations[translation] != null ? this.translations[translation].order : undefined) != null) ? translation : "default";
		if (start.v != null) { start.v = parseInt(start.v, 10); }
		// Matt
		if (this.translations[translation_order].order[start.b] != null) {
			if (start.c == null) { start.c = 1; }
			start.c = parseInt(start.c, 10);
			// Matt five
			if (isNaN(start.c)) {
				valid = false;
				messages.start_chapter_not_numeric = true;
				return [valid, messages];
			}
			// Matt 0
			if (start.c === 0) {
				messages.start_chapter_is_zero = 1;
				if (this.options.zero_chapter_strategy === "error") { valid = false;
				} else { start.c = 1; }
			}
			// Matt 5:0
			if ((start.v != null) && (start.v === 0)) {
				messages.start_verse_is_zero = 1;
				if (this.options.zero_verse_strategy === "error") { valid = false;
				// Can't just have `else` because `allow` is a valid `zero_verse_strategy`.
				} else if (this.options.zero_verse_strategy === "upgrade") { start.v = 1; }
			}
			// Matt 5
			if ((start.c > 0) && (this.translations[translation].chapters[start.b][start.c - 1] != null)) {
				// Matt 5:10
				if (start.v != null) {
					// Matt 5:ten
					if (isNaN(start.v)) {
						valid = false;
						messages.start_verse_not_numeric = true;
					// Matt 5:100
					} else if (start.v > this.translations[translation].chapters[start.b][start.c - 1]) {
						// Not part of the same `if` statement in case we ever add a new `else` condition.
						if (this.options.passage_existence_strategy.indexOf("v") >= 0) {
							valid = false;
							messages.start_verse_not_exist = this.translations[translation].chapters[start.b][start.c - 1];
						}
					}
				// Jude 1 when wanting to treat the `1` as a verse rather than a chapter.
				} else if ((start.c === 1) && (this.options.single_chapter_1_strategy === "verse") && (this.translations[translation].chapters[start.b].length === 1)) {
					messages.start_chapter_1 = 1;
				}
			// Matt 50
			} else {
				if ((start.c !== 1) && (this.translations[translation].chapters[start.b].length === 1)) {
					valid = false;
					messages.start_chapter_not_exist_in_single_chapter_book = 1;
				} else if ((start.c > 0) && (this.options.passage_existence_strategy.indexOf("c") >= 0)) {
					valid = false;
					messages.start_chapter_not_exist = this.translations[translation].chapters[start.b].length;
				}
			}
		// An unusual situation in which there's no defined start book. This only happens when a `c` becomes dissociated from its `b`.
		} else if ((start.b == null)) {
			valid = false;
			messages.start_book_not_defined = true;
		// None 2:1
		} else {
			if (this.options.passage_existence_strategy.indexOf("b") >= 0) { valid = false; }
			messages.start_book_not_exist = true;
		}
		// We return an array to make unit testing easier; we only use `valid`.
		return [valid, messages];
	}

	// The end ref pretty much just has to be after the start ref; beyond the book, we don't	require the chapter or verse to exist. This approach is useful when people get end verses wrong.
	validate_end_ref(translation, start, end, valid, messages) {
		// It's not necessary to check for whether the book exists in a non-default translation here because we've already validated that it works as a `start_ref`, which created the book if it didn't exist. So we don't call `@promote_book_to_translation`.
		const translation_order = ((this.translations[translation] != null ? this.translations[translation].order : undefined) != null) ? translation : "default";
		// Matt 0
		if (end.c != null) {
			end.c = parseInt(end.c, 10);
			// Matt 2-four
			if (isNaN(end.c)) {
				valid = false;
				messages.end_chapter_not_numeric = true;
			} else if (end.c === 0) {
				messages.end_chapter_is_zero = 1;
				if (this.options.zero_chapter_strategy === "error") { valid = false;
				} else { end.c = 1; }
			}
		}
		// Matt 5:0
		if (end.v != null) {
			end.v = parseInt(end.v, 10);
			// Matt 5:7-eight
			if (isNaN(end.v)) {
				valid = false;
				messages.end_verse_not_numeric = true;
			} else if (end.v === 0) {
				messages.end_verse_is_zero = 1;
				if (this.options.zero_verse_strategy === "error") { valid = false;
				} else if (this.options.zero_verse_strategy === "upgrade") { end.v = 1; }
			}
		}

		// Matt-Mark
		if (this.translations[translation_order].order[end.b] != null) {
			// Even if the `passage_existence_strategy` doesn't include `c`, make sure to treat single-chapter books as single-chapter books.
			if ((end.c == null) && (this.translations[translation].chapters[end.b].length === 1)) { end.c = 1; }
			// Mark 4-Matt 5, None 4-Matt 5
			if ((this.translations[translation_order].order[start.b] != null) && (this.translations[translation_order].order[start.b] > this.translations[translation_order].order[end.b])) {
				if (this.options.passage_existence_strategy.indexOf("b") >= 0) { valid = false; }
				messages.end_book_before_start = true;
			}
			// Matt 5-6
			if ((start.b === end.b) && (end.c != null) && !isNaN(end.c)) {
				// Matt-Matt 4
				if (start.c == null) { start.c = 1; }
				// Matt 5-4
				if (!isNaN(parseInt(start.c, 10)) && (start.c > end.c)) {
					valid = false;
					messages.end_chapter_before_start = true;
				// Matt 5:7-5:8
				} else if ((start.c === end.c) && (end.v != null) && !isNaN(end.v)) {
					// Matt 5-5:8
					if (start.v == null) { start.v = 1; }
					// Matt 5:8-7
					if (!isNaN(parseInt(start.v, 10)) && (start.v > end.v)) {
						valid = false;
						messages.end_verse_before_start = true;
					}
				}
			}
			if ((end.c != null) && !isNaN(end.c)) {
				if ((this.translations[translation].chapters[end.b][end.c - 1] == null)) {
					if (this.translations[translation].chapters[end.b].length === 1) {
						messages.end_chapter_not_exist_in_single_chapter_book = 1;
					} else if ((end.c > 0) && (this.options.passage_existence_strategy.indexOf("c") >= 0)) {
						messages.end_chapter_not_exist = this.translations[translation].chapters[end.b].length;
					}
				}
			}
			if ((end.v != null) && !isNaN(end.v)) {
				if (end.c == null) { end.c = this.translations[translation].chapters[end.b].length; }
				if ((end.v > this.translations[translation].chapters[end.b][end.c - 1]) && (this.options.passage_existence_strategy.indexOf("v") >= 0)) {
					messages.end_verse_not_exist = this.translations[translation].chapters[end.b][end.c - 1];
				}
			}
			// Matt 5:1-None 6
		} else {
			valid = false;
			messages.end_book_not_exist = true;
		}
		// We return an array to make unit testing easier; we only use `valid`.
		return [valid, messages];
	}

	// Gradually add books to translations as they're needed.
	promote_book_to_translation(book, translation) {
		if (this.translations[translation] == null) { this.translations[translation] = {}; }
		if (this.translations[translation].chapters == null) { this.translations[translation].chapters = {}; }
		// If the translation specifically overrides the default, use that. Otherwise stick with the default.
		if (this.translations[translation].chapters[book] == null) {
			return this.translations[translation].chapters[book] = bcv_utils.shallow_clone_array(this.translations.default.chapters[book]);
		}
	}
}
bcv_passage.initClass();

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}