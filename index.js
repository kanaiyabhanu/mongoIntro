//Mongoose module
let mongoose = require("mongoose");

//Connecting to mongoose database
mongoose
    .connect("mongodb://localhost/kan",{useNewUrlParser: true,useUnifiedTopology: true}) //connect is a promises type method. so giving the promises.
    .then(()=>console.log("Database is connected"))
    .catch(error=>console.log("Something went wrong",error.message));

//Schema will be stored in the mongoose's schema method.
let courseSchema = new mongoose.Schema({
    name:{type:String},
    courses:[String],
    isPublished:{type: Boolean},
    price:{type: Number},
    date: {type: Date, default: Date.now()}
});

//Model = Collection = Tables
let courseModel = mongoose.model("courses",courseSchema); //courses is the name of collection and it should be in courseSchema type

async function createCourse(){
    let data = new courseModel({
        name:"MAK",
        courses:["NodeJS","Backend"],
        isPublished:true,
        price:2000
    });
    let item = await data.save();
    //console.log(item);
};
createCourse();

async function fetchCourses(){
    let courses = await courseModel
        //.find({name:"MAK"})
        //.find({price: {$gt:100,$lte:600} })
        // .find({
        //     price:{
        //         $in:[100,200,600]        //Include prices with 100,200 and 600 only
        //     }
        // })
        .find()
        //.and([{name:"MAK"}],[{price:200}])
        .or([{name:"MAK"}],[{price:2000}]) //adding conditions as an arrays
        .sort("-name") //- for descending
        .select("-price -isPublished")//use -to exclude
        .limit(3)
        ;
        //console.log(courses);
}
fetchCourses();

let userSchema = new mongoose.Schema({
    tags:[String],
    date: {type: Date, default: Date.now()},
    name:{type:String},
    author:{type:String},
    isPublished: {type:Boolean},
    price:{type:Number}

});

let userModel = mongoose.model("users",userSchema);

async function fetchUsers(){
    let users = await userModel
    .find({tags:"backend"})
    .sort("name")
    .select("name author")
    ;
    //console.log(users);
}

//fetchUsers();

async function fetchUsers2(){
    let users = await userModel
    .find()
    //.or([{tags:"frontend",tags:"backend"}])
    .sort("-price")
    .select("name author")
    ;
    console.log(users);
}

//fetchUsers2();

//update users

async function updateCourse(id){

    //Query First Approach
    //First data is found then updated and after that it is saved.
    // let course = await courseModel.findById(id);
    // if(!course){
    //     return console.log("Invalid ID");
    // }
    // course.price = 8000;
    // course = await course.save();
    // console.log(course);
    

    //Update first approach
    //Will save the data directly in db after update
    // let course = await courseModel.update({_id:id},{
    //     $set:{
    //         price: 10000
    //     }
    // });
    // console.log(course);
    

    //update using mongoose

    let course = await courseModel.findByIdAndUpdate(id,{
        $set:{
            price:30000
        }
    },{ new:true}); //passed this flag to fetch the latest updated value in the console and not the previous value

    console.log(course);
}

//updateCourse("5e6892669c8ea52f54029da7");

//Removing the element by id

async function removeCourse(id){
    let course = await courseModel.findByIdAndRemove(id);
    if(!course){ return console.log("Invalid ID")};
    console.log("See you next time");
}

removeCourse("5e6892770cec313248d37e36");








