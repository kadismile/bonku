import { Document, Schema } from 'mongoose';
import randomstring from 'randomstring'
import moment from 'moment';

export interface ITimeStampedDocument extends Document {
  _id: string
  createdAt: string;
  updatedAt: string;
}

const TimeStampPlugin = function <T> (schema: Schema<T>) {
  schema.add({ _id: { type: String } });
  schema.add({ createdAt: { type: String, index: true } });
  schema.add({ updatedAt: { type: String, index: true } });

  schema.pre<ITimeStampedDocument>('save', function (next) {
    if (this.isNew) {
      this._id = randomstring.generate(25);
      this.createdAt = moment().toISOString();
    }
    this.updatedAt = moment().toISOString();
    next();
  });
};

export default TimeStampPlugin;