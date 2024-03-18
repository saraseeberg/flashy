export interface LearningSet {
  id?: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  createdBy: string;
  comments: string[];
  numberOfLikes: number;
}
