var DataTypes = require("sequelize").DataTypes;
var _jenispaket = require("./jenispaket");
var _keberangkatan = require("./keberangkatan");
var _paketwisata = require("./paketwisata");
var _paketwisata_foto = require("./paketwisata_foto");
var _paketwisata_tempatwisata = require("./paketwisata_tempatwisata");
var _tempatwisata = require("./tempatwisata");
var _tempatwisata_foto = require("./tempatwisata_foto");
var _transaksi = require("./transaksi");
var _users = require("./users");

function initModels(sequelize) {
  var jenispaket = _jenispaket(sequelize, DataTypes);
  var keberangkatan = _keberangkatan(sequelize, DataTypes);
  var paketwisata = _paketwisata(sequelize, DataTypes);
  var paketwisata_foto = _paketwisata_foto(sequelize, DataTypes);
  var paketwisata_tempatwisata = _paketwisata_tempatwisata(sequelize, DataTypes);
  var tempatwisata = _tempatwisata(sequelize, DataTypes);
  var tempatwisata_foto = _tempatwisata_foto(sequelize, DataTypes);
  var transaksi = _transaksi(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  transaksi.belongsTo(jenispaket, { as: "jenispaket", foreignKey: "jenispaket_id"});
  jenispaket.hasMany(transaksi, { as: "transaksis", foreignKey: "jenispaket_id"});
  jenispaket.belongsTo(paketwisata, { as: "paketwisatum", foreignKey: "paketwisata_id"});
  paketwisata.hasMany(jenispaket, { as: "jenispakets", foreignKey: "paketwisata_id"});
  paketwisata_foto.belongsTo(paketwisata, { as: "paketwisatum", foreignKey: "paketwisata_id"});
  paketwisata.hasMany(paketwisata_foto, { as: "paketwisata_fotos", foreignKey: "paketwisata_id"});
  paketwisata_tempatwisata.belongsTo(paketwisata, { as: "paketwisatum", foreignKey: "paketwisata_id"});
  paketwisata.hasMany(paketwisata_tempatwisata, { as: "paketwisata_tempatwisata", foreignKey: "paketwisata_id"});
  paketwisata_tempatwisata.belongsTo(tempatwisata, { as: "tempatwisatum", foreignKey: "tempatwisata_id"});
  tempatwisata.hasMany(paketwisata_tempatwisata, { as: "paketwisata_tempatwisata", foreignKey: "tempatwisata_id"});
  tempatwisata_foto.belongsTo(tempatwisata, { as: "tempatwisatum", foreignKey: "tempatwisata_id"});
  tempatwisata.hasMany(tempatwisata_foto, { as: "tempatwisata_fotos", foreignKey: "tempatwisata_id"});
  keberangkatan.belongsTo(transaksi, { as: "transaksi", foreignKey: "transaksi_id"});
  transaksi.hasMany(keberangkatan, { as: "keberangkatans", foreignKey: "transaksi_id"});
  transaksi.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(transaksi, { as: "transaksis", foreignKey: "user_id"});

  return {
    jenispaket,
    keberangkatan,
    paketwisata,
    paketwisata_foto,
    paketwisata_tempatwisata,
    tempatwisata,
    tempatwisata_foto,
    transaksi,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
