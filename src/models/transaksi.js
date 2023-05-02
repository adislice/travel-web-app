const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaksi', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kode_transaksi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_bayar: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('belumlunas','lunas'),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    jenispaket_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'jenispaket',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'transaksi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "jenispaket_id",
        using: "BTREE",
        fields: [
          { name: "jenispaket_id" },
        ]
      },
    ]
  });
};
