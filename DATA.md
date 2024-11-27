# Data format description

## Variables

All variable value variations are tab separated.

#### $FIRST, $SECOND, $THIRD, $FOURTH
Contains all possible variations for the ordinal numerals in language.

Example:
```
$FIRST	1st	1	I	First
```

#### $GOSPEL
Contains all possible variations for the Gospel name in language.

```
$GOSPEL	The Gospel of Saint	The Gospel according to Saint	Gospel of Saint	Gospel according to Saint
```

#### $AB
Range of characters allowed in the BCV syntax like Gen 1:1a.

```
$AB	[a-e]
```

#### $AND
Contains all possible variations for the word "and" in language.

```
$AND	and	compare
```

#### $CHAPTER
Contains all possible variations for the word "chapter" in language.

```
$CHAPTER	chapters	chapter	chapts.
```

#### $FF
Contains all possible variations for the phrase "and following" in language.

```
$FF	et suivant	ff
```

#### $TITLE
Contains all possible variations for the word "title" in language.

```
$TITLE	title
```

#### $TRANS
Contains all book translations in language.

A single value should be added in format "abbreviation,OSIS,alias".
If there is OSIS and alias a value should contain only abbreviation.

```
$TRANS	ASV	CEB,,ceb
```

#### $TO
Contains all possible variations for the word "to" in language.

```
$TO	through	thru	to
```

#### $VERSE
Contains all possible variations for the word "verse" in language.

```
$VERSE	verses	verse	ver.	vss.	vs.	vv.	v.
```

#### $PRE_BOOK_ALLOWED_CHARACTERS
Contains a regexp pattern for characters can precede the book name.

Note: in fact, this variable is used to list letters that are not allowed to precede the book name (regexp starts with `[^` which means "everything except following characters").
This is used to avoid matching book names that are part of other words.
E.g. `John` should not be found in `SomeTextJohn`.

Note: by default this regexp contains a range of all letter characters loaded from `src/letters/letters.txt` preceded by `^` regexp pattern meaning these character are not allowed.

Note: the only language that has a different value is `zh` where the pattern is `[^\x1f]`.

#### $POST_BOOK_ALLOWED_CHARACTERS
Contains a regexp pattern for characters can follow the book name.

By default, if this variable is not set in `data.txt`, it is set with numbers, spaces, etc. List of allowed characters could be found in `gValidCharacters` variable in `bin/01.add-lang.ts` file.

#### $UNICODE_BLOCK
Contains to set the character unicode block used in a language.
All available values could be found in `src/letters/blocks.txt`.

Note: `Basic_Latin` is the default value.
If `$UNICODE_BLOCK` variable does not have `Basic_Latin` value,
it is included later in the code.

Note: in most `data.txt` files value `Latin` is used, but it seems to be a mistake because there is no such value in `src/letters/blocks.txt` file.
However, it works properly because of the behaviour described in the note above. 
```
$UNICODE_BLOCK	Cyrillic	Latin
```
