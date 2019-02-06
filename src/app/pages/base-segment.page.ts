
export class BaseSegmentPage {

  PAGE_BUYER = 0;
  PAGE_SELLER = 1;

  currentPage = this.PAGE_BUYER;

  onPageChanged(page: number) {
    this.currentPage = page;
  }
}
