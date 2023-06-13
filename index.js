// core-modules
const fs=require('fs');
const http=require('http');
const url=require('url');

// 3rd party modules
const slugify=require('slugify');

// our own modules

//////////////////////////////////////////////////////////////////////////////////////
//Files

// Blocking synchronous way
// const textIn=fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut=`This is what we know about the avocado: ${textIn}, \nCreated on ${Date.now()} (timestamp in ms)`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=>{
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2} \n ${data3}`, 'utf-8', err=>{
//                 console.log('Your file has been written');
//             });
//         });
//     });
// });
// console.log('Will read a file!');

//////////////////////////////////////////////////////////////////////////////////////////
const replaceTemplate=(temp, product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output=output.replace(/{%ID%}/g, product.id);
    output=output.replace(/{%IMAGE%}/g, product.image);
    output=output.replace(/{%FROM%}/g, product.from);
    output=output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output=output.replace(/{%QUANTITY%}/g, product.quantity);
    output=output.replace(/{%PRICE%}/g, product.price);
    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    output=output.replace(/{%DESCRIPTION%}/g, product.description);
    return output;
}
// Loading the templates once so that it doesn't have to do each request
const tempOverview=fs.readFileSync(`${__dirname}/templates/template_overview.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template_product.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template_card.html`,'utf-8');

// Creating a simple web Server
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

const server=http.createServer((req, res)=>{
    const pathName=req.url;

    // Overview page
    if(pathName==='/' || pathName==='/overview'){
        const cardsHtml=dataObj.map(el=>replaceTemplate(tempCard, el));
        const output=tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    
    // Product page
    } else if(pathName==='/product'){
        res.end('This is the PRODUCT!');

    // API
    } else if(pathName==='/api'){
        res.writeHead(200,{
            'Content-type':'application/json'});
        res.end(data);
    
    // Not found
    } else{
        res.writeHead(404,{
            'Content-type':'text/html'
        });
        res.end('<h1> Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to requests on port 8000');
});


