const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paketwisata_foto', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_file: {
      type: DataTypes.STRING(255),
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
    tableName: 'paketwisata_foto',
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
