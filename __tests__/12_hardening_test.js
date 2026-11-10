const fs = require('fs');
const path = require('path');
const WordExtractor = require('../lib/word');
const AllocationTable = require('../lib/ole-allocation-table');

const data = (name) => path.resolve(__dirname, 'data', name);

/**
 * Returns a copy of a valid file whose directory stream chain is rewritten
 * by `rewrite(table, dirSecId)`. `table` reads and writes entries of the
 * first sector of the sector allocation table.
 */
const withSectorTable = (name, rewrite) => {
  const buffer = Buffer.from(fs.readFileSync(data(name)));
  const secSize = 1 << buffer.readInt16LE(30);
  const dirSecId = buffer.readInt32LE(48);
  const tableOffset = (buffer.readInt32LE(76) + 1) * secSize;
  rewrite({
    get: (secId) => buffer.readInt32LE(tableOffset + secId * 4),
    set: (secId, value) => buffer.writeInt32LE(value, tableOffset + secId * 4)
  }, dirSecId);
  return buffer;
};

describe('sector chains', () => {

  it('should reject a chain that loops between two sectors', () => {
    const table = new AllocationTable({});
    table._table = [1, 0];
    expect(() => table.getSecIdChain(0)).toThrowError("sector chain loops");
  });

  it('should reject a chain that loops between three sectors', () => {
    const table = new AllocationTable({});
    table._table = [1, 2, 0];
    expect(() => table.getSecIdChain(0)).toThrowError("sector chain loops");
  });

  it('should still read a chain that ends normally', () => {
    const table = new AllocationTable({});
    table._table = [1, 2, -2];
    expect(table.getSecIdChain(0)).toEqual([0, 1, 2]);
  });

  it('should still stop on a sector that points to itself', () => {
    const table = new AllocationTable({});
    table._table = [1, 1];
    expect(table.getSecIdChain(0)).toEqual([0, 1]);
  });

  it('should reject a file whose directory chain loops', () => {
    const buffer = withSectorTable('test01.doc', (table, dirSecId) => {
      const other = dirSecId === 0 ? 1 : 0;
      table.set(dirSecId, other);
      table.set(other, dirSecId);
    });
    return expect(new WordExtractor().extract(buffer))
      .rejects
      .toThrowError("sector chain loops");
  });
});

describe('allocation sizes', () => {

  it('should reject a header that claims more allocation sectors than the file holds', () => {
    const buffer = Buffer.from(fs.readFileSync(data('test01.doc')));
    buffer.writeInt32LE(0x00100000, 44);
    return expect(new WordExtractor().extract(buffer))
      .rejects
      .toThrowError("Not a valid compound document");
  });

  it('should reject a header with an impossible sector size', () => {
    const buffer = Buffer.from(fs.readFileSync(data('test01.doc')));
    buffer.writeInt16LE(20, 30);
    return expect(new WordExtractor().extract(buffer))
      .rejects
      .toThrowError("Not a valid compound document");
  });

  it('should reject a stream chain longer than the file', () => {
    // Every free entry of the table is chained after the directory stream:
    // no loop, but far more sectors than the file contains.
    const buffer = withSectorTable('test01.doc', (table, dirSecId) => {
      let last = dirSecId;
      while (table.get(last) >= 0) {
        last = table.get(last);
      }
      for (let secId = 0; secId < 128; secId++) {
        if (table.get(secId) === -1) {
          table.set(last, secId);
          last = secId;
        }
      }
      table.set(last, -2);
    });
    return expect(new WordExtractor().extract(buffer))
      .rejects
      .toThrowError("sector chain is longer than the file");
  });

  it('should read the same file from a path and from a buffer', () => {
    const extractor = new WordExtractor();
    return Promise.all([
      extractor.extract(data('test01.doc')),
      extractor.extract(fs.readFileSync(data('test01.doc')))
    ]).then(([fromPath, fromBuffer]) => {
      expect(fromPath.getBody()).toEqual(fromBuffer.getBody());
      expect(fromBuffer.getBody().length).toBeGreaterThan(0);
    });
  });
});

describe('character properties', () => {

  // Published 1.0.4 read only five bits of a property code, mistook character
  // spacing (0x8840) for a tracked deletion (0x0800) and dropped the text.
  it('should keep text set with expanded or condensed character spacing', () => {
    return new WordExtractor().extract(data('hardening-character-spacing.doc'))
      .then((document) => {
        const body = document.getBody();
        expect(body).toContain("Jane Example, plain line before.");
        expect(body).toContain("SPACED HEADING WITH EXPANDED CHARACTER SPACING");
        expect(body).toContain("condensed line that must survive too");
        expect(body).toContain("Plain line after.");
      });
  });
});

describe('encrypted documents', () => {

  it('should reject a password-protected file with an explicit error', () => {
    return expect(new WordExtractor().extract(data('hardening-encrypted.doc')))
      .rejects
      .toThrowError("encrypted");
  });

  it('should reject it from a buffer too', () => {
    return expect(new WordExtractor().extract(fs.readFileSync(data('hardening-encrypted.doc'))))
      .rejects
      .toThrowError("encrypted");
  });
});
