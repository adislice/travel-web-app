const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('keberangkatan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transaksi_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'transaksi',
        key: 'id'
      }
    },
    lokasi_jemput_lat: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lokasi_jemput_long: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('dijadwalkan','diperjalanan','selesai'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'keberangkatan',
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
        name: "transaksi_id",
        using: "BTREE",
        fields: [
          { name: "transaksi_id" },
        ]
      },
    ]
  });
};
