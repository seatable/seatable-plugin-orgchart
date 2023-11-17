import { IViewModel } from '../utils/Interfaces/Model.interfaces';

export default class View {
    _id: string;
    name: string;

    constructor(object: IViewModel) {
      this._id = object._id;
      this.name = object.name;
    }
}