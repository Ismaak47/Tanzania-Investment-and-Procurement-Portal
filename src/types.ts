export type CategoryId = 'regulatory' | 'marketplace' | 'finance' | 'command';

export interface Category {
  id: CategoryId;
  title: string;
  color: string;
  badgeBg: string;
  textColor: string;
}

export interface DocumentSection {
  id: string;
  categoryId: CategoryId;
  title: string;
  shortDesc: string;
  number: number;
}
