export function paginate(data, count: number, pageIndex: number, pageSize: number) {
    const response = {
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
    for (const i of data) {
        response.items.push(i);
    }
    return response;
}
