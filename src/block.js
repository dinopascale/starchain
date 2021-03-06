/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform,
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods
 *  run asynchronous.
 */

const SHA256 = require("crypto-js/sha256");
const hex2ascii = require("hex2ascii");
const helpers = require("./helpers");

class ValidateBlockError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "ValidateBlockError";
  }
}

class GetBlockDataError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "GetBlockDataError";
  }
}

class Block {
  // Constructor - argument data will be the object containing the transaction data
  constructor(data) {
    this.hash = null; // Hash of the block
    this.height = 0; // Block Height (consecutive number of each block)
    this.body = Buffer.from(JSON.stringify(data)).toString("hex"); // Will contain the transactions stored in the block, by default it will encode the data
    this.time = 0; // Timestamp for the Block creation
    this.previousBlockHash = null; // Reference to the previous Block Hash
  }

  /**
   *  validate() method will validate if the block has been tampered or not.
   *  Been tampered means that someone from outside the application tried to change
   *  values in the block data as a consecuence the hash of the block should be different.
   *  Steps:
   *  1. Return a new promise to allow the method be called asynchronous.
   *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
   *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
   *  4. Compare if the auxiliary hash value is different from the calculated one.
   *  5. Resolve true or false depending if it is valid or not.
   *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
   */
  validate() {
    let self = this;
    return new Promise((resolve, reject) => {
      try {
        // Save in auxiliary variable the current block hash
        const currentHash = self.hash;
        // remove hash from block
        self.hash = null;
        // Recalculate the hash of the Block
        const newHash = self._hashBlock();
        // set hash back to previous value;
        self.hash = currentHash;
        resolve(currentHash === newHash);
      } catch (e) {
        // reject with new ValidateBlockError if something is gone bad
        reject(new ValidateBlockError(e));
      }
    });
  }

  /**
   *  Auxiliary Method to return the block body (decoding the data)
   *  Steps:
   *
   *  1. Use hex2ascii module to decode the data
   *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
   *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block`
   *     or Reject with an error.
   */
  getBData() {
    const self = this;
    return new Promise((resolve, reject) => {
      // if block is Genesis Block we reject with new Error
      if (self.previousBlockHash == null || !self.height) {
        reject(new GetBlockDataError("This is Genesis Block!"));
      }
      try {
        // decode data in an ascii string;
        const decodedData = hex2ascii(self.body);
        // parse the string in a Javascript object;
        const parsed = JSON.parse(decodedData);
        // resolve promise with parsed data
        resolve(parsed);
      } catch (e) {
        // if some error occurs in decoding + parsing process we reject with error
        reject(new GetBlockDataError(e));
      }
    });
  }

  /**
   * utility method for setting height of block. Can be chained
   * with other methods of class
   * @param {*} height
   * @returns same class for point chaining methods
   */
  setHeight(height) {
    if (height < 0) {
      throw new Error("Height cannot be less then zero");
    }
    this.height = height;
    return this;
  }

  /**
   * utility method for setting previous hash of block. If a null
   * param is passed we don't set anything. Can be chained
   * with other methods of class
   * @param {*} hash
   * @returns same class for point chaining methods
   */
  setPreviousHash(hash) {
    if (hash != null) {
      this.previousBlockHash = hash;
    }
    return this;
  }

  /**
   * utility method for setting timestamp of block. Can be
   * chained with other methods of class
   * @returns same class for point chaining methods
   */
  setTimeStamp() {
    this.time = helpers.getTimeStamp();
    return this;
  }

  /**
   * utility method for setting hash of block. Use internal
   * method so that we can uniforming creation of hash and validate
   * method. Can be chained with other methods of class
   * @returns same class for point chaining methods
   */
  setHash() {
    this.hash = this._hashBlock();
    return this;
  }

  /**
   * private method for abstracting process of encrypting information
   * of block in an hash with SHA256 algorithm
   * @returns string with hash of current block
   */
  _hashBlock() {
    return SHA256(JSON.stringify(this)).toString();
  }
}

module.exports.Block = Block; // Exposing the Block class as a module
