import {BaseModel, Deserializable} from "./base-model";
import {config} from "../helpers/config";
import * as moment from 'moment';

export class Purchase extends BaseModel implements Deserializable {

  static PRODUCT_FREE = 'free';
  static PRODUCT_MONTHLY = config.productAutoMontly;

  // TODO: set monthly subscription as default
  productId = Purchase.PRODUCT_MONTHLY;
  expireAt = Number.MAX_SAFE_INTEGER;

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
