## A manifest of test files

Where there is a `.docx` file name with the same name, it is a `.docx` version saved
from the same file, and should extract to the same document data. 

* `bigfile-01.doc` -- a long and complex Word file, containing insertions, deletions, 
  hyperlinks, and mixed Unicode and plain text segments.

* `badfile-01-bad-header.doc` -- a test of an invalid Word file

* `test01.doc` -- a short test of insertion and deletion with Unicode.

* `test02.doc` -- a long set of short random paragraphs with a wide ranging of styling.

* `test03.doc` -- a page containing a table.

* `test04.doc` -- a Unicode test file, with headers and footers.

* `test05.doc` -- a simple file created with Word 97-SR2.

* `test06.doc` -- another table test with fields, headers, and footers.

* `test07.doc` -- a representative form test, with tables for layout, form controls, footers,
  footnotes, and so on.

* `test08.doc` -- a simple test of bookmarks.

* `test09.doc` -- very simple test file, regression for a parenthesis character error.

* `test10.doc` -- a simple test with a couple of sentences and a couple of annotations.

* `test11.doc` -- a word file containing Asian language text.

* `test12.doc` -- a test of tables with empty cells, checking row termination.

* `test13.doc` -- a short test of endnotes and footnotes combined.

* `test14.doc` -- a short test of insertion and deletion.

* `hardening-character-spacing.doc` -- expanded and condensed character spacing; generated
  with macOS `textutil` from a hand-written RTF. Published 1.0.4 dropped both spaced lines.

* `hardening-encrypted.doc` -- a password-protected file, unmodified copy of
  `test-data/document/PasswordProtected.doc` from Apache POI (Apache License 2.0),
  sha256 `863d2216a6f5bb4cec0ea4131a05ae0822dbce347e2940155ef638c6d64935fe`.
