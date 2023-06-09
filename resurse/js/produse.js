window.onload=function() {


    document.getElementById("inp-views").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }

    document.getElementById("filtrare").onclick= function(){

        let val_nume=document.getElementById("inp-nume").value.toLowerCase();

        let val_textare=document.getElementById("i_textarea").value.toLowerCase();
        let v_textare=val_textare.split(' ');

        let radiobuttons=document.getElementsByName("gr_rad");
        let val_categorie="toate";
        for(let r of radiobuttons){
            if(r.checked){
                val_categorie=r.value;
                break;
            }
        }

        let val_checked ="toate";
        if(document.getElementById("noutati").checked)
            val_checked = Date.parse(document.getElementById("noutati").value);

        var pret_a=[], pret_b=[];
        for(let opt of document.getElementById("inp-pret").options)
        {
            if(opt.selected)
            {
                pret_a.push(parseInt(opt.value.split(',')[0]));
                pret_b.push(parseInt(opt.value.split(',')[1]));
            }
        }

        let val_disponibilitate=document.getElementById("inp-disp").value;

        let val_views=document.getElementById("inp-views").value;


        //let val_categ=document.getElementById("inp-categorie").value;

        var produse=document.getElementsByClassName("produs");

        let valid1=0,valid2=0,sem=0;

        for (let prod of produse){
            prod.style.display="none";

            var nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();

            let string1="ăâîșț";
            let string2="aaist";

            for(var i = 0;i<nume.length;i++){
                if(string1.indexOf(nume[i])>-1){
                    var t_nume=nume.split('');
                    t_nume[i]=string2[string1.indexOf(nume[i])];
                    nume=t_nume.join('');
                }
            }

            let cond1;
            if(nume.indexOf(val_nume)>-1){
                cond1=true;
                valid1=1;
            }else
                cond1=false;

            let categorii=prod.getElementsByClassName("val-categorie")[0].innerHTML.toLocaleLowerCase();
            let cond2= (val_categorie.startsWith("toate") || categorii.includes(val_categorie));

            let disponibil=prod.getElementsByClassName("disponibilitate")[0].innerHTML;
            let cond3= (val_disponibilitate=="toate" || disponibil.includes(val_disponibilitate) || disponibil.includes(val_disponibilitate))

            let views = parseFloat(prod.getElementsByClassName("val-views")[0].innerHTML);
            let cond4 = (views >= val_views);
            
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond5 = false;
            
            

            if(pret_a.length==0)
                cond5=true;
            for(let i=0; i< pret_a.length;i++)
            {
                if(pret>=pret_a[i]&&pret<=pret_b[i])
                    cond5=true;
            }

            let data=Date.parse(prod.getElementsByClassName("data_adaugare")[0].innerHTML);
            let cond6=(val_checked=="toate"||val_checked<=data);
            
            let elemente_nft=prod.getElementsByClassName("elemente_nft")[0].innerHTML;

            let sem1=0,sem2=1;
            for(let prod of v_textare)
            {
                if(prod[0]=="+" && elemente_nft.includes(prod.split('+')[1]))
                    sem1=1;
                if(prod[0]=="-" && elemente_nft.includes(prod.split('-')[1]))
                    sem2=0;
            }

            let cond7=(v_textare[0].length==0||sem1&&sem2);
            if(cond7)
                valid2=1;

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7){
                sem=1;
                prod.style.display="block";
            }
        }
        if(!sem)
        {
            document.getElementById("mesaj-invalid").style.display="inline";
            if(!valid1)
                document.getElementById("inp-nume").style.color="red";
            if(!valid2)
                document.getElementById("i_textarea").style.color="red";
        }
    }

    document.getElementById("resetare").onclick= function resetare(){

        document.getElementById("mesaj-reset").style.display="inline";

        document.getElementById("buton_reset_da").onclick=function()
        {
            document.getElementById("mesaj-reset").style.display="none";

            document.getElementById("inp-nume").value=""; 
            document.getElementById("i_textarea").value="";
            document.getElementById("inp-views").value=document.getElementById("inp-views").min;
            document.getElementById("i_rad1").checked=true;
            document.getElementById("i_rad1").checked=false;
            document.getElementById("inp-disp-toate").selected=true;
            document.getElementById("noutati").checked=false;
            document.getElementById("mesaj-invalid").style.display="none";
            document.getElementById("inp-nume").style.color="black";
            document.getElementById("i_textarea").style.color="black";
            
            for(let opt of document.getElementById("inp-pret").options)
            {
                opt.selected=false;
            }
            document.getElementById("infoRange").innerHTML="(0)";
            var produse=document.getElementsByClassName("produs");
            sortare_reset();
            for (let prod of produse){
                prod.style.display="block";
            }
        }       
        document.getElementById("buton_reset_nu").onclick=function()
        {
            document.getElementById("mesaj-reset").style.display="none";
            document.getElementById("mesaj-reset-fata").style.display="inline";
            setTimeout(function() {
                document.getElementById("mesaj-reset-fata").style.display="none";
            }, 1000);   
        }
    }

    function sortare (semn){
        var produse=document.getElementsByClassName("produs");
        console.log(produse[0]);
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        });
        console.log(v_produse[0]);
        console.log(produse[0]);
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
        console.log(produse[0]);
    }

    function sortare_reset (){
        var produse=document.getElementsByClassName("produs");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let id_a=parseFloat(a.getElementsByClassName("id")[0].innerHTML);
            let id_b=parseFloat(b.getElementsByClassName("id")[0].innerHTML);
            return id_a-id_b;
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
    }
    document.getElementById("sortCrescNume").onclick=function(){
        sortare(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sortare(-1);
    }

    window.onkeydown=function(e)
    {
        if(e.key=="c" && e.altKey)
        {
            console.log("asd");
            if(document.getElementById("info-suma"))
                return;
            var produse=document.getElementsByClassName("produs");
            let suma=0;
            for (let prod of produse){
                if(prod.style.display!="none")
                {
                    let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                    suma+=pret;
                }
            }
            let p=document.createElement("p");
            p.innerHTML=suma;
            p.id="info-suma"
            ps=document.getElementById("p-suma");
            container=ps.parentNode;
            frate=ps.nextElementSibling;
            container.insertBefore(p,frate);
            setTimeout(function()
            {
                let info=document.getElementById("info-suma")
                if(info)
                    info.remove();
            },1000)
        }
    }
}