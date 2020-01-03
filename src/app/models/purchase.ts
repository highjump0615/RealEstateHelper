import {BaseModel, Deserializable} from "./base-model";
import {config} from "../helpers/config";
import * as moment from 'moment';

export class Purchase extends BaseModel implements Deserializable {

  static PRODUCT_FREE = 'free';

  productId = Purchase.PRODUCT_FREE;
  expireAt = 0;

  isPremium() {
    // check purchased products first
    if (this.productId === Purchase.PRODUCT_FREE) {
      return false;
    }

    const tsNow = moment().valueOf();

    // check expire date second
    if (this.expireAt <= tsNow) {
      return false;
    }

    return true;
  }
}