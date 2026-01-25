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
};
