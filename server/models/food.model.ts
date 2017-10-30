import * as mongoose from 'mongoose';

export interface IFood {
    id?: string;
    name: string;
    price: number;
    pictures: string[];
}

export interface IFoodModel