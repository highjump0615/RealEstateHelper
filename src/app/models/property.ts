
export class Property {

  //
  // table info
  //
  static TABLE_NAME = 'properties';

  static FIELD_ADDRESS = 'address';
  static FIELD_TITLE = 'title';
  static FIELD_DESC = 'description';

  static FIELD_PRICE = 'price';

  static FIELD_STYLE = 'style';
  static FIELD_TYPE = 'type';
  static FIELD_SIZE = 'size';
  static FIELD_BEDROOM = 'bedroom';
  static FIELD_BATHROOM = 'bathroom';
  static FIELD_GARAGE = 'garage';
  static FIELD_BASEMENT = 'basement';

  static FIELD_LOT_FRONTAGE = 'lotFtg';
  static FIELD_LOT_DEPTH = 'lotDepth';

  static FIELD_STATUS = 'status';

  static STYLES = [
    'Two-Storey',
    'Bungalow',
    'Sidesplit'
  ];

  static TYPES = [
    'Townhouse',
    'Semi',
    'detached'
  ];

  static STATUSES = [
    'New Constructions',
    'Resale',
    'Assignments'
  ];

  static BASEMENT = [
    'No',
    'Yes, Unfinished'
  ];

  //
  // properties
  //
  address = '';
  title = '';
  desc = '';
  price: number;

  style = [];
  type = [];
  size: number;
  bedroom: number;
  bathroom: number;
  garage = '';
  basement = '';
  lotFrontage: number;
  lotDepth: number;

  status = [];

  constructor() {
  }

  tableName() {
    return Property.TABLE_NAME;
  }
}
