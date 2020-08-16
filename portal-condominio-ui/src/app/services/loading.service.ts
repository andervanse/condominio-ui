import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable()
export class LoadingService {

    loading  = new Subject<boolean>();
}