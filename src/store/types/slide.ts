
export interface Slide {
  id?: string
  title?: string
  subTitle?: string
  imageOne?: string
  imageTwo?: string
  role?: string
  link?: string
  links?: Link[]
  tools?: string[]
  description?: string
  offsetTop?: number
}

export interface Link {
  url?: string,
  text?: string
}