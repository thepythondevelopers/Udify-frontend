import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaynowService {

  constructor() { }

  paynow(token:any){
    console.log("token from service::",token);
  }

}
