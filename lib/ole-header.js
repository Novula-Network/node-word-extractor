const HEADER_DATA = Buffer.from('D0CF11E0A1B11AE1', 'hex');

class Header {

  constructor() {}

  load(buffer) {
    for(let i = 0; i < HEADER_DATA.length; i++) {
      if (HEADER_DATA[i] != buffer[i])
        return false;
    }
  
    // [MS-CFB] 2.2: the sector shift is 9 or 12, the mini sector shift is 6.
    // Anything else makes every later size computation meaningless.
    const secShift = buffer.readInt16LE(30);
    const shortSecShift = buffer.readInt16LE(32);
    if ((secShift !== 9 && secShift !== 12) || shortSecShift !== 6) {
      return false;
    }

    this.secSize        = 1 << secShift;       // Size of sectors
    this.shortSecSize   = 1 << shortSecShift;  // Size of short sectors
    this.SATSize        =      buffer.readInt32LE(44);  // Number of sectors used for the Sector Allocation Table
    this.dirSecId       =      buffer.readInt32LE(48);  // Starting Sec ID of the directory stream
    this.shortStreamMax =      buffer.readInt32LE(56);  // Maximum size of a short stream
    this.SSATSecId      =      buffer.readInt32LE(60);  // Starting Sec ID of the Short Sector Allocation Table
    this.SSATSize       =      buffer.readInt32LE(64);  // Number of sectors used for the Short Sector Allocation Table
    this.MSATSecId      =      buffer.readInt32LE(68);  // Starting Sec ID of the Master Sector Allocation Table
    this.MSATSize       =      buffer.readInt32LE(72);  // Number of sectors used for the Master Sector Allocation Table
  
    // The first 109 sectors of the MSAT
    this.partialMSAT = new Array(109);
    for(let i = 0; i < 109; i++)
      this.partialMSAT[i] = buffer.readInt32LE(76 + i * 4);
  
    return true;  
  }

  /**
   * Checks the sector counts of the header against the size of the file:
   * no table can use more sectors than the file holds. Without this, a
   * header claiming millions of sectors makes the reader allocate them.
   * @param {number} size the size of the file, in bytes
   * @returns true when the counts fit in the file
   */
  fits(size) {
    const maxSectors = Math.ceil(size / this.secSize);
    return [this.SATSize, this.SSATSize, this.MSATSize]
      .every((count) => count >= 0 && count <= maxSectors);
  }

}

module.exports = Header;
