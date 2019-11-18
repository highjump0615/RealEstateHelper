export class PropertyHelper {
  constructor() {
  }

  static getPropertyImage(property) {
    if (property.getPhotoUrl()) {
      return property.getPhotoUrl();
    }

    return 'assets/imgs/default_img.png';
  }

  showMapForLocation() {
  }
}
