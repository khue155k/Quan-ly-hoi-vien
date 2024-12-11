import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }

  private dataCompanyStatus = new BehaviorSubject<number>(4);

  data$ = this.dataCompanyStatus.asObservable();

  updateDataCompanyStatus(newData: number) {
    this.dataCompanyStatus.next(newData);
  }
}
