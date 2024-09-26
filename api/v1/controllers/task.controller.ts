import { Express,Request,Response } from "express";
import Task from "../../../models/task.model"
import paginationHelper from "../../../helper/pagination";

export const  index = async (req : Request,res: Response)=>{
    interface Find{
        deleted: boolean,
        status?: string,
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