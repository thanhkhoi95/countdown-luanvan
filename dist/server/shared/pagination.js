"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginate(data, count, pageIndex, pageSize) {
    var response = {
        currentPage: pageIndex,
        pageSize: pageSize,
        totalPage: 0,
        totalItems: count,
        items: []
    };
    if (count !== 0) {
        response.totalPage = (count % pageSize === 0) ?
            (count / pageSize) :
            ((count - count % pageSize) / pageSize + 1);
    }
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var i = data_1[_i];
        response.items.push(i);
    }
    return response;
}
exports.paginate = paginate;
//# sourceMappingURL=pagination.js.map