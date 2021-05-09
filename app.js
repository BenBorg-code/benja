const express=require('express');
const app= express();
const mongoose = require('mongoose');
const Item =require('./item');

var methodOverride = require('method-override')

// override with POST having ?_method=PUT
app.use(methodOverride('_method'))

mongoose.connect('mongodb://localhost/shoppingList',{ useNewUrlParser: true, useUnifiedTopology: true  });

//array containing all the shopping list items.
const items = [{
    name: 'Tea Bags'
 },
{
    name: 'Ice Cream'
},
{
    name: 'Pasta'
}
]

const PORT=process.env.PORT || 3000;

app.set('view engine', 'ejs');//allows for views.ejs to be accessed from views folder
app.listen(PORT, () => console.log(`....Server started on port ${PORT}`));//listens to send message that server has started.
app.use(express.static('./public', express.static('public')));//hosts all the static code.
app.use(express.urlencoded({extended: false}))//allows for api to read data from ejs files.


//front/index page
app.get('/', async(req, res)=>
{
    const items = await Item.find().sort({name:'desc'});
    res.render('index',{items: items});//upon startup loads this page
})

//create item
app.get('/create', (req, res)=>{
    res.render('create');//renders create.ejs
})

app.post('/create', async(req, res)=>
{
    //Post request for the create route, takes item name and pushes it onto the items array.
    let newItem = new Item({name: req.body.name});
    
    try{
       newItem = await newItem.save();
       console.log('item saved')
       res.redirect(`/`); //redirects back to index page.
    }catch(error){
        //if error detected the create page is rendered once more.
        console.log(error)
       res.render('create');
    }
    
   
    
})

//update item
app.get('/update/:itemId',async(req, res)=>{
    const item= await Item.findById(req.params.itemId);
    console.log(item.name);
    res.render('update',{item:item});//renders the update.ejs file passing it the respective item name.
})

app.put('/update/:itemId', async(req, res)=>
{
    //Post request for the update route. 
    let updateItem = await Item.findById(req.params.itemId);
    console.log(updateItem.name);
    updateItem.name=req.body.name;
    
       
    try{
        updateItem = await updateItem.save();
        console.log('item saved')
        res.redirect(`/`); //redirects back to index page.
     }catch(error){
         //if error detected the create page is rendered once more.
         console.log(error)
        res.render(`update/${req.params.itemId}`);
     }
    
})

//Delete Item

app.get('/delete/:itemId',async(req,res)=>
{
   await Item.findByIdAndDelete(req.params.itemId);

    res.redirect(`/`);
})