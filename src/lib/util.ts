import { default as readingTime } from 'reading-time'

export const noop = () => null

export function mediumReadingTime(content: string) {
  return Math.ceil(readingTime(content).minutes) + ' min read'
}