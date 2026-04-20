const bcv_utils = {
	// Make a shallow clone of an object. Nested objects are referenced, not cloned.
	shallow_clone(obj: any) {
		if (obj == null) {
			return obj;
		}
		const out: Record<string, any> = {};
		for (const key of Object.keys(obj || {})) {
			const val = obj[key];
			out[key] = val;
		}
		return out;
	},

	// Make a shallow clone of an array. Nested objects are referenced, not cloned.
	shallow_clone_array(arr: any[]) {
		if (arr == null) {
			return arr;
		}
		const out: any[] = [];
		for (let i = 0, end = arr.length, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
			if (typeof arr[i] !== "undefined") {
				out[i] = arr[i];
			}
		}
		return out;
	},

	shallow_clone_book_data(book: any) {
		if (book == null) {
			return book;
		}
		if (Array.isArray(book)) {
			return this.shallow_clone_array(book);
		}
		const out = this.shallow_clone(book);
		if (book.versesCount != null) {
			out.versesCount = this.shallow_clone(book.versesCount);
		}
		return out;
	},

	get_book_chapter_count(book: any) {
		if (book == null) {
			return 0;
		}
		if (Array.isArray(book)) {
			return book.length;
		}
		if (book.chaptersCount != null) {
			return book.chaptersCount;
		}
		return Object.keys(book.versesCount || {}).length;
	},

	get_book_verse_count(book: any, chapter: number) {
		if ((book == null) || (chapter == null)) {
			return null;
		}
		if (Array.isArray(book)) {
			return book[chapter - 1];
		}
		if (book.versesCount == null) {
			return null;
		}
		return book.versesCount[chapter] != null ? book.versesCount[chapter] : book.versesCount[String(chapter)];
	},

	set_book_verse_count(book: any, chapter: number, verse_count: number) {
		if (Array.isArray(book)) {
			book[chapter - 1] = verse_count;
			return book;
		}
		if (book.versesCount == null) {
			book.versesCount = {};
		}
		book.versesCount[String(chapter)] = verse_count;
		if ((book.chaptersCount == null) || (chapter > book.chaptersCount)) {
			book.chaptersCount = chapter;
		}
		return book;
	},

	delete_book_verse_count(book: any, chapter: number) {
		if (book == null) {
			return book;
		}
		if (Array.isArray(book)) {
			if (book.length === chapter) {
				book.pop();
			} else {
				delete book[chapter - 1];
			}
			return book;
		}
		if (book.versesCount != null) {
			delete book.versesCount[String(chapter)];
		}
		if (book.chaptersCount === chapter) {
			while ((book.chaptersCount > 0) && (this.get_book_verse_count(book, book.chaptersCount) == null)) {
				book.chaptersCount -= 1;
			}
		}
		return book;
	},
};
