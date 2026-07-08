import mongoose from 'mongoose';
import Restaurant from "./restaurant.js";

const menuSchema=new mongoose.Schema({
    menu:[
        {
            category:{type:String},
            items:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"foodItem"
                }
            ]
        }
    ],
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)

const Menu = mongoose.model("Menu", menuSchema);
export default Menu; 