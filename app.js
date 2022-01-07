const express = require("express");
const app = express();
const Joi = require("@hapi/joi");

//middlewares
app.use(express.json())
//para dar formato a los request que no vengan en JSON
app.use(express.urlencoded({extended:true}))










const usuarios = [
    {id:1,nombre:"Grover"},
    {id:2,nombre:"Pablo"},
    {id:3,nombre:"Ana"}
];


app.get("/",(request,response) => { //petición
    response.send("Hola mundo desde Express.")
});

app.get("/api/usuarios", (request,response) => {
    response.send(usuarios)
})

//:id/:mes
app.get("/api/usuarios/:id", (request,response) => {
    let usuario = usuarios.find(u => u.id === parseInt(request.params.id))
    if(!usuario) response.status(404).send("El usuario no fue encontrado")
    response.send(usuario);
    //params es un json con todos los parametros

    //query : se usa para un query string : ?asdsa=sdfsdf+sd=768
})

app.post("/api/usuarios",(request,response) => {//envio de datos
    
    const schema = Joi.object({
        nombre: Joi.string()
            //.alphanum()
            .min(3)
            //.max(30)
            .required()
    })



    let {error,value} = schema.validate({ nombre: request.body.nombre });

    if(!error){
        const usuario = {
            id:usuarios.length + 1,
            nombre: value.nombre
        }
        
        usuarios.push(usuario)
        response.send(usuario);
    }
    else{
        response.status(400).send(error)

    }

    /*  Manera manual
    if(typeof request.body === 'object'){

        if(!request.body.nombre){

            response.status(400).send("No se mandó un nombre")
            
        }else{

            const usuario = {
                id:usuarios.length + 1,
                nombre:request.body.nombre
            }
            
            usuarios.push(usuario)
            response.send(usuario);
        }

    }*/

    

}); 


app.put("/api/usuarios/:id",(request,response) => {

    //verificamos que el id exista
    let usuario = usuarios.find(u => u.id === parseInt(request.params.id ))

    if(!usuario){
        response.status(404).send("El usuario no fue encontrado");
    } 
    else{
        const schema = Joi.object({
            nombre: Joi.string()
                //.alphanum()
                .min(3)
                //.max(30)
                .required()
        })
        let {error,value} = schema.validate({ nombre: request.body.nombre });
    
        if(error){
            response.status(400).send(error)
        }else{
    
            usuario.nombre = value.nombre;
            response.send(usuario)
    
        }
    }




})

app.delete("/api/usuarios/:id", (request,response) => {
    let usuario = usuarios.find(u => u.id === parseInt(request.params.id ))
    if(!usuario) response.status(404).send("El usuario no fue encontrado");
    else{
        const index = usuarios.indexOf(usuario);
        usuarios.splice(index,1)

        response.send(usuarios)
    }

})



const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})