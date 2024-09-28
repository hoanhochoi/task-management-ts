import { Express,Request,Response } from "express";
import Task from "../../../models/task.model"
import paginationHelper from "../../../helper/pagination";
import searchHelper from "../../../helper/searchHelper";

export const  index = async (req : Request,res: Response)=>{
    interface Find{
        deleted: boolean,
        status?: string,
        title?: RegExp
    }
    // find
    let find: Find = {
        deleted: false,
    }
    if(req.query.status){
        find.status = req.query.status.toString();
    }
    // end find

    // pagination
       let initPagination = {
        currentPage: 1,
        limitItems: 2
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    // end pagination

        // keyword search
        const objectSearch = searchHelper(req.query)
        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }
        // console.log(find)
        // keyWord Search

    // sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[`${sortKey}`] = sortValue;
        }
    // end sort

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    res.json(tasks)
}

export const detail = async (req: Request,res: Response)=>{
    const id: string = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    })
    res.json(task)

}

export const changeStatus = async (req:Request,res: Response)=>{
    try {
        const id:string = req.params.id;
        const status:string = req.body.status;
        await Task.updateOne({
            _id: id,
        },{
            status: status
        })
        res.json({
            code: 200,
            message: "cập nhật trạng thái sản phẩm thành công!"
        })
        return;
    } catch (error) {
        res.json({
            code: 400,
            message: "lỗi"
        })
    }
    res.json("oke")
}

export const changeMulti = async (req:Request,res: Response)=>{
    try {
        const ids: string[] = req.body.ids;
        const key:string = req.body.key;
        const value:string = req.body.value;
        console.log(ids)
        console.log(key)
        console.log(value);
        switch (key) {
            case "status":
                await Task.updateMany(
                    {_id : {$in: ids}},
                    {status: value}
                )
                res.json({
                    code: 200,
                    message: "cập nhật trạng thái thành công!"
                })
                break;
        
            default:
                res.json({
                    code: 400,
                    message: "không tìm thấy key này"
                })
                break;
        }
    } catch (error) {
        res.json({
            message: "lỗi!",
            code: 400
        })
    }
}