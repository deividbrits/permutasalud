export interface IContent {
  id?: string;
  title: string;
  description: string;
  type: 'feature' | 'stat' | 'hero' | 'testimonial';
  icon?: string;
  value?: string;
  imageUrl?: string;
  order: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
