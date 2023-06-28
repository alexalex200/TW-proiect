const express = require('express');
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
const {Client}=require('pg'); 
const AccesBD= require("./module_proprii/accesbd.js");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");
 
AccesBD.getInstanta().select(
    {tabel:"nft_produse",
    campuri:["nume", "pret", "views"],
    conditiiAnd:["pret>7"]},
    function (err, rez){
        console.log(err);
        console.log(rez);
    }
)

let u="admin01";
let p="Admin01pa55"
var client= new Client({database:"nft",
        user:"alex",
        password:"1234",
        host:"localhost",
        port:5432});
client.connect();

// client.query("SELECT * FROM lab8_16",function(err,rez){
// 	console.log("eroare:",err);
// 	console.log("rezultat:",rez);
// });

client.query("select * from unnest(enum_range(null::colectie))",function(err,rezCategorie){
	if(err)
	{
		console.log(err);
	}
	else{
		obGlobal.optiuniMeniu=rezCategorie.rows;
		console.log(obGlobal.optiuniMeniu);
	}
});

obGlobal=
{
	obErori:null,
	obImagini:null,
	folderScss:path.join(__dirname,"resurse/scss"),
	folderCss:path.join(__dirname,"resurse/css"),
	folderBackup:path.join(__dirname,"backup"),
	optiuniMeniu:[]
}
app=express();
 
// console.log("Folder proiect:", __dirname);
// console.log("Cale fisier:", __filename);
// console.log("Director de lucru:",process.cwd());

vectorFoldere=["temp","temp1","backup","poze_uploadate"];

for(let folder of vectorFoldere)
{
	let caleFolder=path.join(__dirname,folder);
	if (!fs.existsSync(caleFolder))
	{
		fs.mkdirSync(caleFolder);
	}
} 

function compileazaScss(caleScss,caleCss)
{
	if(!caleCss){
		//let vectorCale=caleScss.split("\\");
		//let numeFisExt=vectorCale[vectorCale.length-1];

		let numeFisExt=path.basename(caleScss);
		let numeFis=numeFisExt.split(".")[0];
		caleCss=numeFis+".css"
	}
	if(!path.isAbsolute(caleScss))
		caleScss=path.join(obGlobal.folderScss,caleScss);
	if(!path.isAbsolute(caleCss))
		caleCss=path.join(obGlobal.folderCss,caleCss);

	let caleBackup=path.join(obGlobal.folderBackup,"resurse/css")	

	if(!fs.existsSync(caleBackup))
	{
		fs.mkdirSync(caleBackup,{recursive:true})
	}
	//let vectorCale=caleCss.split("\\");
	//let numeFisCss=vectorCale[vectorCale.length-1];

	let numeFisCss=path.basename(caleCss);
	if(fs.existsSync(caleCss))
		fs.copyFileSync(caleCss,path.join(obGlobal.folderBackup,"resurse/css",numeFisCss));
	rez=sass.compile(caleScss,{"sourceMap":true});
	fs.writeFileSync(caleCss,rez.css);
	console.log("Comp scss:",rez);
}

//compileazaScss("a.scss");

vFisiere=fs.readdirSync(obGlobal.folderScss);
for(let numeFis of vFisiere)
{
	if(path.extname(numeFis)==".scss")
	{
		compileazaScss(numeFis);
	}
}

fs.watch(obGlobal.folderScss,function(eveniment,numeFis){
	//console.log(eveniment,numeFis);
	if(eveniment=="change"||eveniment=="rename")
	{
		let caleCompleta=path.join(obGlobal.folderScss,numeFis);
		if(fs.existsSync(caleCompleta))
		{
			compileazaScss(caleCompleta);
		}
	}
});

app.set("view engine","ejs");

app.use("/resurse", express.static(path.join(__dirname,"/resurse")));

app.use("/node_modules", express.static(path.join(__dirname,"/node_modules")));

app.use("/*",function(req,res,next)
{
	res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
	next();
});

app.use(/^\/resurse(\/[a-zA-Z0-9]*)*$/,function(req,res){
	afiseazaEroarea(res,{_identificator:403});
});

app.get("/favicon.ico", function(req,res)
{
		res.sendFile(__dirname+"/resurse/ico/favicon.ico")
});
app.get("/ceva", function(req, res){
	console.log("cale:",req.url);
    res.send("altceva"+req.ip);
	});

app.get(["/index","/","/home"], function(req, res){
    res.render("pagini/index",{ip:req.ip,imagini:obGlobal.obImagini.imagini, title:"index",obiecte: { c: {b: 10, a:20 }, b:10,  a :[ 10, {b:10,a:20}]}});
});

//Utilizator

app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);

        console.log(campuriFisier);
        console.log(poza, username);
        var eroare="";

        var utilizNou=new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume;
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
            
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat;
            utilizNou.poza= poza;
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    utilizNou.salvareUtilizator();
                }
                else{
                    eroare+="Mai exista username-ul";
                }

                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                    
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
            

        }
        catch(e){ 
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
    



    });
    formular.on("field", function(nume,val){  // 1 
	
        console.log(`--- ${nume}=${val}`);
		
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
		
        console.log(nume,fisier);
		//TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
        let folderUser=path.join(__dirname, "poze_uploadate",username);
        //folderUser=__dirname+"/poze_uploadate/"+username
        console.log(folderUser);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)

    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    }); 

});

//http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}
app.get("/cod/:username/:token",function(req,res){
	console.log(req.params);
	try {
		Utilizator.getUtilizDupaUsername(req.params.username,{res:res,token:req.params.token} ,function(u,obparam){
			AccesBD.getInstanta().update(
				{tabel:"utilizatori",
				campuri:{confirmat_mail:'true'}, 
				conditiiAnd:[`cod='${obparam.token}'`]}, 
				function (err, rezUpdate){
					if(err || rezUpdate.rowCount==0){
						console.log("Cod:", err);
						afisareEroare(res,3);
					}
					else{
						res.render("pagini/confirmare.ejs");
					}
				})
		})
	}
	catch (e){
		console.log(e);
		renderError(res,2);
	}
})

//app.get("/delogare",function(request,response){ request.session.destroy();});

//app.get("/delogare",function(request,response){ let f=request["session"].destroy; f();});

//app.post("/delogare",function(request,response){ request.session.destroy();});

app.get("/delogare",function(request,response){ response.session.destroy();});

app.get("/*.ejs",function(req,res) 
{
	afiseazaEroarea(res,{_identificator:400});	
});

app.get("/produse",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura

	client.query("select * from unnest(enum_range(null::categ_culori_nft))",function(err,rezCategorie){
		if(err)
		{
			console.log(err);
		}
		else{
			let conditionWhere="";
			if(req.query.tip)
				conditionWhere=` where colectii='${req.query.tip}'`;
				
			client.query("select * from nft_produse"+conditionWhere , function( err, rez){
					console.log(300)
					if(err){
						console.log(err);
						afiseazaEroarea(res, 2);
					}
					else
						res.render("pagini/produse", {produse:rez.rows , optiuni:rezCategorie.rows});
			});
		}
	});

});

app.get("/galerie", function(req,res)
{
	res.render("pagini/galerie",{imagini:obGlobal.obImagini.imagini,title:"galerie"});
})
app.get("/produs/:id",function(req, res){
    client.query(`select * from nft_produse where id=${req.params.id}`, function( err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});
app.get("/*",function(req,res)
{
	try{
		//console.log(req.url);
		res.render("pagini"+req.url,function(err,rezRandare){
			if(err)
			{
				//console.log(err);
				if(err.message.startsWith("Failed to lookup view")){
					afiseazaEroarea(res,{_identificator:404});
				}
				else
				{
					afiseazaEroarea(res);
				}
					
			}
			else
			{
				//console.log(rezRandare);
				res.send(rezRandare);
			}
		});
	}
	catch(err)
	{
		if(err.message.startsWith(" Cannot find module")){
			afiseazaEroarea(res,{_identificator:404, _titlu:"ceva"});
		}
		else
		{
			afiseazaEroarea(res);
		}
	}
});

function initializeazaErori()
{
	var continut=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
	//console.log(continut);
	obGlobal.obErori= JSON.parse(continut);
	let vErori=obGlobal.obErori.info_erori;
		
	for(let eroare of vErori)
	{
		eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
		//console.log(eroare.imagine);
	}	
		
}	
initializeazaErori();

function initializeazaImagini()
{
	var continut=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
	
	obGlobal.obImagini= JSON.parse(continut);
	let vImagini=obGlobal.obImagini.imagini;
	
	let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
	let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie,"Mediu");
	let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie,"Mic");

	if(!fs.existsSync(caleAbsMediu))
	{
		fs.mkdirSync(caleAbsMediu);
	}

	if(!fs.existsSync(caleAbsMic))
	{
		fs.mkdirSync(caleAbsMic);
	}

	for(let imag of vImagini)
	{
		[numeFis,ext]=imag.fisier.split(".");
		let caleFisAbs=path.join(caleAbs,imag.fisier);
		let caleFisMediuAbs=path.join(caleAbsMediu,numeFis+".webp");
		let caleFisMicAbs=path.join(caleAbsMic,numeFis+".webp");

		sharp(caleFisAbs).resize(400).toFile(caleFisMediuAbs);

		imag.fisier_mediu=path.join("/",obGlobal.obImagini.cale_galerie,"mediu",numeFis+".webp");

		sharp(caleFisAbs).resize(250).toFile(caleFisMicAbs);
		imag.fisier_mic=path.join("/",obGlobal.obImagini.cale_galerie,"mic",numeFis+".webp");
		
		imag.fisier=path.join("/",obGlobal.obImagini.cale_galerie,imag.fisier);
		//eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
	}	
		
}	

initializeazaImagini();

function afiseazaEroarea(res,{_identificator,_titlu,_text,_imagine}={})
{
	//console.log(_identificator);
	let vErori=obGlobal.obErori.info_erori;
	let eroare=vErori.find( elem => elem.identificator==_identificator);
	//console.log(eroare)
	if(eroare)
	{
		let titlu1= _titlu=="titlu default" ? (eroare.titlu || _titlu):_titlu;
		let text1= _text || eroare.text;
		let imagine1= _imagine || eroare.imagine;
		if(eroare.status)
			res.status(eroare.identificator).render("pagini/eroare",{titlu:titlu1,text:text1,imagine:imagine1});
		else
			res.render("pagini/eroare",{titlu:titlu1,text:text1,imagine:imagine1});
	}
	else
	{
		var errDef=obGlobal.obErori.eroare_default;
		
		res.render("pagini/eroare",{titlu:errDef.titlu,text:errDef.text,imagine:errDef.imagine});
	}
}

app.listen(8080);
 
console.log("Serverul a pornit!")