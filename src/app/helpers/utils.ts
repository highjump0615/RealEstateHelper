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
}
