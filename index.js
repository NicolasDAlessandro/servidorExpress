const express = require("express");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();

class Contenedor{
    constructor(fileName){
        this.fileName = fileName;
    }

    sendAll = async () => {
        try {
            const list = await fs.promises.readFile(this.fileName,"utf-8");
            const prod = JSON.parse(list);
            return prod
        } catch (error) {
            console.log(error)
        }
    }
}

function random(arr) {
    return Math.floor(Math.random() * arr.length);
}

const archivo = new Contenedor("./archivo.json");


const connectServer = app.listen(PORT, () =>  {
    console.log("server is running")
});
app.get("/", ( req, res) => {
    res.send(`<h1>Pagina de inicio, podes navergar a: </h1> <br>
                <a href="/productos">Productos</a> <br>
                <a href="/productoRandom">Producto Random</a>`)
})

app.get("/productos", async ( req, res) => {
    let text = "";
    const list = await archivo.sendAll();
    list.forEach(e => {
        text += `
        <h1>Nombre: ${e.name}</h1><br>
        <h3>Precio: ${e.price}</h3><br>
        <h3>Imagen: ${e.src}</h3><hr>
        `
    });
    res.send(text);
});

app.get("/productoRandom", async ( req, res) => {
    const list = await archivo.sendAll();
    const randomNum = random(list)
    const prod = list.filter(e => e.id === randomNum);
    const text = `
        <h1>Nombre: ${prod[0].name}</h1><br>
        <h3>Precio: ${prod[0].price}</h3><br>
        <h3>Imagen: ${prod[0].src}</h3><hr>`
    res.send(text);
});
