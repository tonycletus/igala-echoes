export interface IgalaName {
  id: string;
  name: string;
  meaning: string;
  gender: "male" | "female" | "unisex";
  category: string;
  origin_story: string;
  pronunciation: string;
  related_proverb: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface NamesData {
  names: IgalaName[];
  categories: Category[];
}