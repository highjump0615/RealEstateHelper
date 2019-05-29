import {BaseModel, Deserializable} from './base-model';
import DataSnapshot = firebase.database.DataSnapshot;
import {Property} from './property';

export class Client extends BaseModel implements Deserializable {
  //
  // table info
  //
  static TABLE_NAME_BUYER = 'buyers';
  static TABLE_NAME_SELLER = 'sellers';
  static TABLE_NAME_BUYER_AGENT = 'buyersAgent';
  static TABLE_NAME_SELLER_AGENT = 'sellersAgent';

  static FIELD_EMAIL = 'email';
  static FIELD_NAME = 'name';
  static FIELD_PHOTO = 'photoUrl';
  static FIELD_PHONE = 'phone';
  static FIELD_ADDRESS = 'address';

  // for buyers
  static FIELD_PRICE_MIN = 'priceMin';
  static FIELD_PRICE_MAX = 'priceMax';

  static FIELD_SIZE_MIN = 'sizeMin';
  static FIELD_SIZE_MAX = 'sizeMax';

  static FIELD_RADIUS = 'radius';

  static FIELD_PROP_REQ = 'propertyRequest';
  static FIELD_DESC = 'description';

  // note
  static FIELD_NOTE = 'note';

  // sellers
  static FIELD_PROPERTY_ID = 'propertyId';

  static FIELD_AGENT_ID = 'agentId';

  static CLIENT_TYPE_BUYER = 0;
  static CLIENT_TYPE_SELLER = 1;

  //
  // properties
  //
  email = '';
  name = '';
  phone = '';
  photoUrl: string;

  priceMin: number;
  priceMax: number;

  sizeMin: number;
  sizeMax: number;

  radius: number;

  address = '';
  desc = '';

  propertyId: string;
  propRequest: Property;
  note = '';
  agentId = '';

  //
  // logical
  //
  type = Client.CLIENT_TYPE_BUYER;

  selected = false;

  property: Property;
  matchedProperties: Array<Property> = [];
  matchedBuyers: Array<Client> = [];


  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.email = info[Client.FIELD_EMAIL];
      this.name = info[Client.FIELD_NAME];
      this.phone = info[Client.FIELD_PHONE];

      if (Client.FIELD_PHOTO in info) {
        this.photoUrl = info[Client.FIELD_PHOTO];
      }

      this.agentId = info[Client.FIELD_AGENT_ID];

      // buyer
      if (Client.FIELD_PRICE_MIN in info) {
        this.priceMin = info[Client.FIELD_PRICE_MIN];
      } else {
        this.priceMin = 0;
      }

      if (Client.FIELD_PRICE_MAX in info) {
        this.priceMax = info[Client.FIELD_PRICE_MAX];
      } else {
        this.priceMax = Number.MAX_SAFE_INTEGER;
      }

      if (Client.FIELD_SIZE_MIN in info) {
        this.sizeMin = info[Client.FIELD_SIZE_MIN];
      } else {
        this.sizeMin = 0;
      }

      if (Client.FIELD_SIZE_MAX in info) {
        this.sizeMax = info[Client.FIELD_SIZE_MAX];
      } else {
        this.sizeMax = Number.MAX_SAFE_INTEGER;
      }

      this.radius = info[Client.FIELD_RADIUS];

      this.desc = info[Client.FIELD_DESC];

      if (Client.FIELD_ADDRESS in info) {
        this.address = info[Client.FIELD_ADDRESS];
      }

      if (Client.FIELD_PROP_REQ in info) {
        this.propRequest = new Property().fillData(info[Client.FIELD_PROP_REQ]);
      }

      // seller
      if (Client.FIELD_PROPERTY_ID in info) {
        this.propertyId = info[Client.FIELD_PROPERTY_ID];
      }
    }
  }

  tableName() {
    return this.type === Client.CLIENT_TYPE_BUYER  ? Client.TABLE_NAME_BUYER : Client.TABLE_NAME_SELLER;
  }
  tableNameAgent() {
    return this.type === Client.CLIENT_TYPE_BUYER  ? Client.TABLE_NAME_BUYER_AGENT : Client.TABLE_NAME_SELLER_AGENT;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Client.FIELD_NAME] = this.name;
    dict[Client.FIELD_EMAIL] = this.email;
    dict[Client.FIELD_PHONE] = this.phone;
    this.addDictItem(dict, Client.FIELD_PHOTO, this.photoUrl);

    // location & address
    this.addDictItem(dict, Client.FIELD_ADDRESS, this.address);

    dict[Client.FIELD_AGENT_ID] = this.agentId;

    //
    // buyer
    //

    // price
    this.addDictItem(dict, Client.FIELD_PRICE_MIN, this.priceMin);
    this.addDictItem(dict, Client.FIELD_PRICE_MAX, this.priceMax);

    // price
    this.addDictItem(dict, Client.FIELD_SIZE_MIN, this.sizeMin);
    this.addDictItem(dict, Client.FIELD_SIZE_MAX, this.sizeMax);

    if (this.propRequest) {
      dict[Client.FIELD_PROP_REQ] = this.propRequest.toDictionary();
    }
    this.addDictItem(dict, Client.FIELD_DESC, this.desc);

    this.addDictItem(dict, Client.FIELD_RADIUS, this.radius);

    //
    // seller
    //
    this.addDictItem(dict, Client.FIELD_PROPERTY_ID, this.propertyId);

    return dict;
  }

  isPriceMatching(target) {
    // consider all cases
    if (this.priceMin && this.priceMax) {
      if (target.priceMin && target.priceMax) {
        //
        // Amin <= Bmin <= Amax
        // Amin <= Bmax <= Amax
        //
        if (this.priceMin <= target.priceMin && target.priceMin <= this.priceMax) {
          return true;
        }

        if (this.priceMin <= target.priceMax && target.priceMax <= this.priceMax) {
          return true;
        }
      } else if (target.priceMin && !target.priceMax) {
        //
        // Amin <= Bmin <= Amax
        //
        if (this.priceMin <= target.priceMin && target.priceMin <= this.priceMax) {
          return true;
        }
      } else if (!target.priceMin && target.priceMax) {
        //
        // Amin <= Bmax <= Amax
        //
        if (this.priceMin <= target.priceMax && target.priceMax <= this.priceMax) {
          return true;
        }
      }
    }

    if (this.priceMin && !this.priceMax) {
      if (target.priceMin && target.priceMax) {
        //
        // Amin <= Bmax
        //
        if (this.priceMin <= target.priceMax) {
          return true;
        }
      } else if (target.priceMin && !target.priceMax) {
        //
        // Amin <= Bmin
        //
        if (this.priceMin <= target.priceMin) {
          return true;
        }
      } else if (!target.priceMin && target.priceMax) {
        //
        // Amin <= Bmax
        //
        if (this.priceMin <= target.priceMax) {
          return true;
        }
      }
    }

    if (!this.priceMin && this.priceMax) {
      if (target.priceMin) {
        //
        // Amax >= Bmin
        //
        if (this.priceMax <= target.priceMin) {
          return true;
        }
      } else if (!target.priceMin && target.priceMax) {
        return true;
      }
    }

    return false;
  }

  isPriceMatchingWithProperty(prop) {
    const price = prop.price;
    if (!price) {
      return false;
    }

    // consider all cases
    if (this.priceMin && this.priceMax) {
      if (this.priceMin <= price && price <= this.priceMax) {
        return true;
      }
    }

    if (this.priceMin && !this.priceMax) {
      if (this.priceMin <= price) {
        return true;
      }
    }

    if (!this.priceMin && this.priceMax) {
      if (this.priceMax >= price) {
        return true;
      }
    }

    return false;
  }

  isSizeMatching(target) {
    // consider all cases
    if (this.sizeMin && this.sizeMax) {
      if (target.sizeMin && target.sizeMax) {
        //
        // Amin <= Bmin <= Amax
        // Amin <= Bmax <= Amax
        //
        if (this.sizeMin <= target.sizeMin && target.sizeMin <= this.sizeMax) {
          return true;
        }

        if (this.sizeMin <= target.sizeMax && target.sizeMax <= this.sizeMax) {
          return true;
        }
      } else if (target.sizeMin && !target.sizeMax) {
        //
        // Amin <= Bmin <= Amax
        //
        if (this.sizeMin <= target.sizeMin && target.sizeMin <= this.sizeMax) {
          return true;
        }
      } else if (!target.sizeMin && target.sizeMax) {
        //
        // Amin <= Bmax <= Amax
        //
        if (this.sizeMin <= target.sizeMax && target.sizeMax <= this.sizeMax) {
          return true;
        }
      }
    }

    if (this.sizeMin && !this.sizeMax) {
      if (target.sizeMin && target.sizeMax) {
        //
        // Amin <= Bmax
        //
        if (this.sizeMin <= target.sizeMax) {
          return true;
        }
      } else if (target.sizeMin && !target.sizeMax) {
        //
        // Amin <= Bmin
        //
        if (this.sizeMin <= target.sizeMin) {
          return true;
        }
      } else if (!target.sizeMin && target.sizeMax) {
        //
        // Amin <= Bmax
        //
        if (this.sizeMin <= target.sizeMax) {
          return true;
        }
      }
    }

    if (!this.sizeMin && this.sizeMax) {
      if (target.sizeMin) {
        //
        // Amax >= Bmin
        //
        if (this.sizeMax <= target.sizeMin) {
          return true;
        }
      } else if (!target.sizeMin && target.sizeMax) {
        return true;
      }
    }

    return false;
  }

  isSizeMatchingWithProperty(prop) {
    const sz = prop.size;
    if (!sz) {
      return false;
    }

    // consider all cases
    if (this.sizeMin && this.sizeMax) {
      if (this.sizeMin <= sz && sz <= this.sizeMax) {
        return true;
      }
    }

    if (this.sizeMin && !this.sizeMax) {
      if (this.sizeMin <= sz) {
        return true;
      }
    }

    if (!this.sizeMin && this.sizeMax) {
      if (this.sizeMax >= sz) {
        return true;
      }
    }

    return false;
  }

  isPropRequestEmpty() {
    if (this.priceMin) {
      return false;
    }
    if (this.priceMax) {
      return false;
    }

    if (this.sizeMin) {
      return false;
    }
    if (this.sizeMax) {
      return false;
    }

    // property request
    if (this.propRequest.style && this.propRequest.style.length > 0) {
      return false;
    }
    if (this.propRequest.type && this.propRequest.type.length > 0) {
      return false;
    }
    if (this.propRequest.garage && this.propRequest.garage.length > 0) {
      return false;
    }
    if (this.propRequest.basement && this.propRequest.basement.length > 0) {
      return false;
    }
    if (this.propRequest.status && this.propRequest.status.length > 0) {
      return false;
    }

    if (this.propRequest.bedroom) {
      return false;
    }
    if (this.propRequest.bathroom) {
      return false;
    }
    if (this.propRequest.lotFrontage) {
      return false;
    }
    if (this.propRequest.lotDepth) {
      return false;
    }

    return true;
  }
}
