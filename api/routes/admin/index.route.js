const dashBoardRoute = require("../admin/dashBoard.route");
const productRoute = require("../admin/product.route");
const loginRoute = require("../admin/login.route");

const systemConfig = require("../../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use( PATH_ADMIN + '/dashBoard', dashBoardRoute );

    app.use( PATH_ADMIN + '/login', loginRoute );

    app.use( PATH_ADMIN + '/products', productRoute );
}
