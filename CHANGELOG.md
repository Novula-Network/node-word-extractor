# Change log

### 1.0.5-novula.1 / 10th November 2026

Maintained fork (Novula-Network). Carries the unreleased upstream fix for the
property code width, and hardens the reader against damaged or crafted files.

 * Includes upstream f7cd64a: read all nine bits of a property code. Published
   1.0.4 read five, mistook character spacing for a tracked deletion and
   silently dropped the text. See upstream #70
 * Tracked deletions are recognised by their whole property code (0x0800)
 * A sector chain that loops is rejected instead of filling memory
 * Sector sizes and sector counts are checked against the file before any
   allocation; a chain longer than the file is rejected
 * A password-protected file is rejected with "Unable to read an encrypted
   Word document" instead of an unrelated out-of-bounds error
 * A failed read on a stream destroys the stream instead of leaving an
   unhandled rejection

### 1.0.4 / 26th July 2021

 * Fixed issue with missing content from LibreOffice files. See #40
 * Fixed order of entry reading from LibreOffice OOXML files. See #41
 
### 1.0.3 / 17th June 2021

 * Fixes issues with long attribute values (> 65k) in OO XML. See #37
 * Propogate errors from XML failures into promise rejections. See #38
 * Changed the XML parser dependency for maintenance and fixes. See #39
 
### 1.0.2 / 28th May 2021

 * Added a new method for reading textbox content. See #35
 
### 1.0.1 / 24th May 2021

 * Added separation between headers and footers. See #34
 
### 1.0.0 / 16th May 2021

 * Major refactoring of the OLE code to use promises internally
 * Added support for Open Office XML-based (.docx) Word files. See #1
 * Added support for reading direct from a Buffer. See #11
 * Removed event-stream dependency. See #19
 * Fixed an issue with not closing files properly. See #23
 * Corrected handling of extracting files with files. See #31
 * Corrected handling of extracting files with deleted text. See #32
 * Fixed issues with extracting multiple rows of table data. See #33 

This is a major release, and while there are no incompatible API changes, 
it seemed best to bump the version so as not to pick up updates automatically.
However, all old applications should not require any code changes to use
this version.

### 0.3.0 / 18th February 2019

 * Re-fixed the bad loop in the OLE code. See #15, #18
 * A few errors previously rejected as strings, they're now errors
 * Updated dependencies to safe versions. See #20


### 0.2.2 / 23rd January 2019

 * Fixed [the bad dependency on event-stream](https://github.com/dominictarr/event-stream/issues/116)


### 0.2.1 / 21st January 2019

 * Added a new getEndnotes method. See #16
 * Fixed a bad loop in the OLE code


### 0.2.0 / 31st October 3018

 * Removed coffeescript and mocha, now using jest and plain ES6
 * Removed partial work on .docx (for now)


### 0.1.4 / 25th March 2017

 * Fixed a documentation issue. `extract` returns a Promise. See #6
 * Corrected table cell delimiters to be tabs. See #9
 * Fixed an issue where replacements weren't being applied right. 


### 0.1.3 / 6th July 2016

 * Added the missing `lib` folder
 * Added a missing dependency to `package.json`


### 0.1.1 / 17th January 2016

 * Fixed a bug with text boundary calculations
 * Added endpoints `getHeaders`, `getFootnotes`, `getAnnotations`


### 0.1.0 / 14th January 2016

 * Initial release to npm
