"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFile = exports.compileDir = void 0;
var path_1 = require("path");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var file_1 = require("@quenk/noni/lib/io/file");
var compile_1 = require("./compile");
/**
 * compileDir will compile each wml file found in the specified path.
 */
var compileDir = function (path, opts) {
    return (0, file_1.listFilesRec)(path)
        .map(function (list) {
        return list
            .map(function (p) { return (0, path_1.resolve)(path, p); })
            .map(function (p) { return (0, exports.compileFile)(p, opts); });
    })
        .chain(future_1.parallel);
};
exports.compileDir = compileDir;
/**
 * compileFile will compile a single wml file.
 *
 * If that file does not have the specified inputExtension, it will be
 * ignored.
 */
var compileFile = function (path, opts) {
    return (0, future_1.doFuture)(function () {
        var p, buf, eitherTs, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((0, path_1.extname)(path) !== ".".concat(opts.inputExtension))) return [3 /*break*/, 1];
                    return [2 /*return*/, (0, future_1.pure)(undefined)];
                case 1:
                    p = "".concat(getFileName(path), ".").concat(opts.outputExtension);
                    return [4 /*yield*/, (0, file_1.readTextFile)(path)];
                case 2:
                    buf = _a.sent();
                    eitherTs = (0, compile_1.compile)(buf, opts);
                    if (!eitherTs.isLeft()) return [3 /*break*/, 3];
                    msg = eitherTs.takeLeft().message;
                    return [2 /*return*/, (0, future_1.raise)(new Error("Error occurred while compiling \"".concat(path, "\":\n ").concat(msg)))];
                case 3: return [4 /*yield*/, (0, file_1.writeTextFile)(p, eitherTs.takeRight())];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, future_1.voidPure];
            }
        });
    });
};
exports.compileFile = compileFile;
var getFileName = function (file) {
    return "".concat((0, path_1.dirname)(file), "/").concat((0, path_1.basename)(file, (0, path_1.extname)(file)));
};
//# sourceMappingURL=cli.js.map