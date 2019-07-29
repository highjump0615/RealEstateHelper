import * as moment from 'moment';

export class Utils {
  private static instance: Utils;

  currentPage = '';

  static getInstance() {
    if (!this.instance) {
      this.instance = new Utils();
    }

    return this.instance;
  }

  static isEmailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  //
  // string manipulation
  //
  static stringContainUppercase(str) {
    return str.toLowerCase() !== str;
  }

  static stringContainLowercase(str) {
    return str.toUpperCase() !== str;
  }

  static stringContainNumber(str) {
    return str.match(/\d+/g);
  }

  static stringContainLetter(str) {
    return str.match(/[a-z]/i);
  }


  static toStringAgo(timestamp) {
    const time = moment(timestamp);

    const duration = moment.duration(moment().diff(time));
    const mins = Math.floor(duration.asMinutes());

    if (mins <= 0) {
      return 'Now';
    } else if (mins < 60) {
      return mins + ' mins ago';
    } else if (mins === 60) {
      return '1 hour ago';
    } else if (mins < 720) {
      return Math.floor(mins / 60) + ' hours ago';
    } else if (mins < 1440) {
      return 'Today ' + time.format('HH:mm');
    } else if (mins < 2880) {
      return 'Yesterday ' + time.format('HH:mm');
    }

    // date
    return time.format('dd MMM YYYY');
  }

  static compareArrays(arrA, arrB) {

    // check if lengths are different
    if (arrA.length !== arrB.length) { return false; }


    // slice so we do not effect the original
    // sort makes sure they are in order
    // join makes it a string so we can do a string compare
    const cA = arrA.slice().sort().join(',');
    const cB = arrB.slice().sort().join(',');

    return cA === cB;

  }

  static containsArray(target, toMatch) {
    let found, targetMap, i, j, cur;

    found = false;
    targetMap = {};

    if (!target || !toMatch) {
      return found;
    }

    // Put all values in the `target` array into a map, where
    //  the keys are the values from the array
    for (i = 0, j = target.length; i < j; i++) {
      cur = target[i];
      targetMap[cur] = true;
    }

    // Loop over all items in the `toMatch` array and see if any of
    //  their values are in the map from before
    for (i = 0, j = toMatch.length; !found && (i < j); i++) {
      cur = toMatch[i];
      found = !!targetMap[cur];
      // If found, `targetMap[cur]` will return true, otherwise it
      //  will return `undefined`...that's what the `!!` is for
    }

    return found;
  }

  static getPhoneStr(phone) {
    if (!phone) {
      return '';
    }

    const first = phone.substring(0, 3);
    const second = phone.substring(3, 6);
    const last = phone.substring(6, 10);

    return `${first}-${second}-${last}`;
  }
}
