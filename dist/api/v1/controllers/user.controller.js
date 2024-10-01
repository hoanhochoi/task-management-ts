"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const generate_1 = require("../../../helper/generate");
const md5_1 = __importDefault(require("md5"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const existEmail = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (existEmail) {
        res.json({
            code: 400,
            message: "email đã tồn tại!"
        });
        return;
    }
    else {
        req.body.token = (0, generate_1.generateRandomString)(20);
        req.body.password = (0, md5_1.default)(req.body.password);
        const user = new user_model_1.default(req.body);
        const data = yield user.save();
        res.json({
            token: data.token,
            code: 200,
            message: "tạo mới user thành công!"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "email không tồn tại!"
        });
        return;
    }
    if (user.password !== (0, md5_1.default)(req.body.password)) {
        res.json({
            code: 400,
            message: "mật khẩu không đúng!"
        });
        return;
    }
    res.json({
        message: "đăng nhập thành công!",
        code: 200,
        token: user.token
    });
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        code: 200,
        user: req["user"],
        message: "Thông tin user"
    });
});
exports.detail = detail;
