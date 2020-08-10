import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Subscription, timer} from "rxjs";

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  timerSub: Subscription;

  @Input() delay: number = 500;
  @Output() longPressed: EventEmitter<any> = new EventEmitter();

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit() {
    const isTouch = ('ontouchstart' in document.documentElement);
    const element = this.elementRef.nativeElement;
    element.onpointerdown = (ev) => {
      this.timerSub = timer(this.delay).subscribe(() => {
        this.longPressed.emit(ev);
      });
    };
    element.onpointerup = () => { this.unsub(); };
    element.onpointercancel = () => { this.unsub(); };
    if (isTouch) {
      element.onpointerleave = () => { this.unsub(); };
    }
  }

  private unsub() {
    if (this.timerSub && !this.timerSub.closed) { this.timerSub.unsubscribe(); }
  }

}
