const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paketwisata_tempatwisata', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    paketwisata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paketwisata',
        key: 'id'
      }
    },
    tempatwisata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tempatwisata',
        key: 'id'
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'paketwisata_tempatwisata',
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
      {
        name: "tempatwisata_id",
        using: "BTREE",
        fields: [
          { name: "tempatwisata_id" },
        ]
      },
    ]
  });
};
