import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-jakarta',
  display: 'swap',
})
