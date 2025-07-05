// src/types/models.ts
import { Sequelize, Model } from 'sequelize';

export interface AssociableModel extends Model {
  associate?: (models: { [key: string]: typeof Model }) => void;
}