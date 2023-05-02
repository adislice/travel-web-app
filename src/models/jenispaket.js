const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jenispaket', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jenis_mobil: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_penumpang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_penumpang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    harga: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    paketwisata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paketwisata',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'jenispaket',
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
        name: "paketwisata_id",
        using: "BTREE",
        fields: [
          { name: "paketwisata_id" },
        ]
      },
    ]
  });
};
