//Class for Generic Functions

class GenFunctions {
    constructor() {
    }

    static getCurrentDate() {
        const lDate = new Date();
        return lDate.toISOString().split('T')[0];
    }
    static getLastWeekDate(imDate) {
        const lDate = new Date(imDate);
        const lLastWeek = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() - 7);

        return lLastWeek.toISOString().split('T')[0];
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
        if ((i + 1) === lMax) return i;

        return i + 1;

    }

    static subOne(i) {
        if (i === 0) return i;
        return i - 1;
    }
    static addDays(imDate, imDays) {
        var vDate, vMonth, vYear;
        const lDate = new Date(imDate);
        const lNextWeekDay = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() + imDays);

        vDate = lNextWeekDay.getDate();
        vMonth = lNextWeekDay.getMonth() + 1;
        vYear = lNextWeekDay.getFullYear();
        if (vDate < 10) {
            vDate = "0" + vDate;
        }
        if (vMonth < 10) {
            vMonth = "0" + vMonth;
        }
        return vYear + "-" + vMonth + "-" + vDate;
        //  return lNextWeekDay.toISOString().split('T')[0];

    }
    static removeDays(imDate, imDays) {
        const lDate = new Date(imDate);
        const lNextWeekDay = new Date(lDate.getFullYear(), lDate.getMonth(), lDate.getDate() - imDays);

        return lNextWeekDay.toISOString().split('T')[0];

        // var result = new Date(date);
        // result.setDate(result.getDate() + days);
        // return result;
    }
    static getNextMondayCmp(imDate) {
        var vDate, vMonth, vYear;
        const lDate = new Date(imDate);
        let lDay = lDate.getDay();
        if (lDay !== 0) lDay = 7 - lDay;
        lDay = lDay + 1;
        const lNextSun = new Date(
            lDate.getFullYear(),
            lDate.getMonth(),
            lDate.getDate() + lDay
        );

        return lNextSun.toISOString().split('T')[0];
    }
    static getDateIfDate(d) {
        var m = d.match(/\/Date\((\d+)\)\//);
        return m ? (new Date(+m[1])).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : d;
    }
    static addMonths(imDate, months) {
        var d = new Date(imDate);//.getDate();
        // imDate.setMonth(imDate.getMonth() + +months);
        // if (imDate.getDate() != d) {
        //     imDate.setDate(0);
        // }
        var newDate = new Date(d.setMonth(d.getMonth() + months));
        return newDate;
    }
    static removeDuplicate(array, keys) {
        // var check = new Set();
        // return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
        // const keys = ['PRODUCT_ID', 'VERSION', 'SCENARIO'];
        const filtered = array.filter(
            (s => o =>
                (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|'))
            )
                (new Set)
        );
        return filtered;
    }

    static log(lMessage) {
        console.log(lMessage)
    }

    static logMessage(lMessage) {
        console.log(lMessage);
    }

    static async getParameterValue(lParameter) {
        const lsValue = await SELECT.one
            .from("CP_PARAMETER_VALUES")
            .columns("VALUE")
            .where(`PARAMETER_ID = ${parseInt(lParameter)}`)

        return lsValue.VALUE;
    }

}

module.exports = GenFunctions;