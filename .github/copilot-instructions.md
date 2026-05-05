This libarary is used to parse bible passages, and output them to osis codes. For example, 
parsing the following text via `parser.parse("John 3:16-17").osis_and_indices();` will return 
`[{"osis": "John.3.16-John.3.17", "translations": [""], "indices": [0, 12]}]`.


After making changes, the parsers for each language must be rebuilt. (`npm run build:all` or `npm run build <lang-code>`).
For example, an individual language parser can be built as follows: `npm run build en`.
The tests can also be run as `npm run test-language:all` or `npm run test-language <lang-code>`
for a single language. 