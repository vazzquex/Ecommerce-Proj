import userModel from "./models/user.model.js";

export default class Users {
    
    get = (params => {
        return userModel.findOne(params)
    });

    create = (userData => {
        return userModel.create(userData);
    });

}