export class DataModel {
  _selectedStore: any = [];
  public get selectedStore() {
    return this._selectedStore;
  }
  public set selectedStore(value: any) {
    this._selectedStore = value;
  }
  constructor() {
  }
}
