//Class for Generic Functions

class GenFunctions {
  constructor() {
  }

  async getNextSunday(imDate) {
    const lDate = new Date(imDate);
    let lDay = lDate.getDay();
    if (lDay !== 0 ) lDay = 7-lDay;
    const lNextSun = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate()+lDay);
    return lNextSun.toISOString().split('T')[0];
  }
}

module.exports = GenFunctions;