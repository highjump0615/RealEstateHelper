import * as moment from 'moment';
import {Platform} from '@ionic/angular';

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

  static isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
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
    // no data to compare, not contain
    if (toMatch.length <= 0) {
      return false;
    }

    // length is smaller than search keys, not contain
    if (target.length < toMatch.length) {
      return false;
    }

    const contains = toMatch.filter(function (elem) {
      return target.indexOf(elem) > -1;
    }).length === toMatch.length;

    return contains;
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

  static validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return !!pattern.test(str);
  }

  static makeId(length) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  //
  // platforms
  //
  static isPlatformWeb(plt: Platform) {
    return plt.is('mobileweb');
  }
}
