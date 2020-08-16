import { trigger, transition, style, query, animate } from "@angular/animations";

export const fadeInOutAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [

      query(':enter',
        [
          style({ opacity: 0 })
        ],
        { optional: true }
      ),
     
      query(':leave',
        [
          style({ opacity: 1 }),
          animate('0.2s 100ms', style({ opacity: 0 }))
        ],
        { optional: true }
      ),

      query(':enter',
        [
          style({ opacity: 0 }),
          animate('0.2s 100ms', style({ opacity: 1 }))
        ],
        { optional: true }
      )
       
    ])
  ]);