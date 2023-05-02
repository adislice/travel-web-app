const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tempatwisata_foto', {
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
    tempatwisata_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tempatwisata',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'tempatwisata_foto',
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
        name: "tempatwisata_id",
        using: "BTREE",
        fields: [
          { name: "tempatwisata_id" },
        ]
      },
    ]
  });
};
