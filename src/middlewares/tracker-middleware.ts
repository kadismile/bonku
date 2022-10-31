import { Tracker } from '../types';
import randomstring from 'randomstring'

export const trackerMiddleware = (params: Tracker) => {
  let { originatingFunction } = params
  originatingFunction = originatingFunction || ""
  const env = process.env.NODE_ENV || 'development'

  return {
    trackID: randomstring.generate(25),
    env,
    originatingFunction
  }
}