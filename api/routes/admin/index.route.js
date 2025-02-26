const dashBoardRoute = require("../admin/dashBoard.route");
const productRoute = require("../admin/product.route");
const loginRoute = require("../admin/login.route");
const productCategoryRoute = require("../admin/product-category.route");
const RoleRoute = require("../admin/role.route");
const AccountRoute = require("../admin/account.route");
const authRoute = require("../admin/auth.route");
const myAccountRoute = require("../admin/myaccount.route");

const systemConfig = require("../../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use( PATH_ADMIN + '/dashBoard', dashBoardRoute );

    app.use( PATH_ADMIN + '/login', loginRoute );

    app.use( PATH_ADMIN + '/products', productRoute );

    app.use( PATH_ADMIN + '/product-category', productCategoryRoute);

    app.use( PATH_ADMIN + '/role', RoleRoute);

    app.use(PATH_ADMIN + '/accounts', AccountRoute);
    app.use(PATH_ADMIN + '/auth', authRoute);

    app.use(PATH_ADMIN + '/myaccount', myAccountRoute);
}
