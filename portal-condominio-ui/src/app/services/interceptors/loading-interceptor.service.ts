import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { LoadingService } from "../loading.service";


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // start our loader here
        this.loadingService.loading.next(true);

        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            // if the event is for http response
            if (event instanceof HttpResponse) {
                // stop our loader here
                this.loadingService.loading.next(false);
            }

        }, (err: any) => {
            // if any error (not for just HttpResponse) we stop our loader bar
            this.loadingService.loading.next(false);
        }));
    }

}