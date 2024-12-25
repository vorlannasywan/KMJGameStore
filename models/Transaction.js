// models/Transaction.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Game from './Game.js';

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false }, // Add this field
    purchaseDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Transaction.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(Game, { foreignKey: 'gameId', onDelete: 'CASCADE' });

export default Transaction;