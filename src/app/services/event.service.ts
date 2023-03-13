import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private storeChanged = new Subject<any>();
  private storeAdded = new Subject<any>();
  private profileUpdated = new Subject<any>();

  constructor() {}

  changedStore() {
    this.storeChanged.next();
  }

  addedStore() {
    this.storeAdded.next();
  }

  updatedProfile() {
    this.profileUpdated.next();
  }

  getChangedStore(): Observable<any> {
    return this.storeChanged.asObservable();
  }

  getAddedStore(): Observable<any> {
    return this.storeAdded.asObservable();
  }

  
  getUpdatedProfile(): Observable<any> {
    return this.profileUpdated.asObservable();
  }
}
