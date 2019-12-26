import {BaseModel, Deserializable} from "./base-model";
import {config} from "../helpers/config";
import moment, {Moment} from 'moment';

export class Purchase extends BaseModel implements Deserializable {

  static PRODUCT_FREE = 'free';

  productId = Purchase.PRODUCT_FREE;
  expireAt = 0;

  isPremium() {
    // check purchased products first
    if (this.productId === Purchase.PRODUCT_FREE) {
      return false;
    }

    // check expire date second
    if (this.expireAt >= moment()) {
      return false;
    }

    return true;
  }
}