// Add this to your types.ts file

export type UUID = string;

export interface User {
  email: string;
  password: string;
  token?: UUID;
}

export interface Score {
  score: number;
  userName: string;
}

export type TransactionType =
  | "income"
  | "grocery"
  | "gas"
  | "school"
  | "doctor"
  | "fast food"
  | "car maintenance"
  | "rent"
  | "error";

export interface Transaction {
  date: Date;
  amount: string;
  type: TransactionType;
  userName: string;
  userToken?: UUID; 
}