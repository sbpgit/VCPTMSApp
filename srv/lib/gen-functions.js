//Class for Generic Functions

class GenFunctions {
    constructor() {
    }

    static getNextSunday(imDate) {
        const lDate = new Date(imDate);
        let lDay = lDate.getDay();
        if (lDay !== 0) lDay = 7 - lDay;
        const lNextSun = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() + lDay);

        return lNextSun.toISOString().split('T')[0];
    }

    static dynamicSortMultiple() {
        /*
        * save the arguments object as it will be overwritten
        * note that arguments object is an array-like object
        * consisting of the names of the properties to sort by
        */
        let props = arguments;
        const that = this;
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
            * as long as we have extra properties to compare
            */
            while (result === 0 && i < numberOfProperties) {
                result = that.dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        }
    };

    static dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers, 
            * and you may want to customize it to your needs
            */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    static parse(input) {
        return JSON.parse(JSON.stringify(input));
    }

    static addOne(i, lMax) {
        if((i + 1) === lMax) return i;
        
        return i + 1;
        
    }

    static subOne(i) {
        if (i === 0) return i;
        return i - 1;
    }    
}

module.exports = GenFunctions;