window.onload=function() {
  
    let k=6;
    let pag=1;
    let nrprod;

    filtrare();
    sortare_reset(0);
    
    document.getElementById("prev").onclick=function()
    {
        if(pag>1){
            pag--;
            filtrare(false);
        }
    }

    document.getElementById("next").onclick=function()
    {
        if(pag<Math.ceil(nrprod/k)){
            pag++;
            filtrare(false);
        }
    }

    
    
    document.getElementById("inp-nume").onchange= function(){
        filtrare();
    }    

    document.getElementById("i_textarea").onchange= function(){
        filtrare();
    }  

    document.getElementById("inp-pret").onchange= function(){
        filtrare();
    }

    document.getElementById("radio-categorie").onchange = function () {
        filtrare();
    }
    
    document.getElementById("inp-views").onchange = function () {
        document.getElementById("infoRange").innerHTML=`(${this.value})`
        filtrare();
 
    }
    document.getElementById("noutati").onchange = function () {
        filtrare();
    }
    document.getElementById("inp-disp").onchange = function () {
        filtrare();
    }

    let nr_check_chei=0;
    let v_chei=[];
    for(let checks of document.getElementsByClassName("check-sortare-chei"))
    {
        checks.onchange=function()
        {
            if(this.checked)
                nr_check_chei++;
            else
                nr_check_chei--;
            
            if(nr_check_chei==1)
            {
                for(let checks2 of document.getElementsByClassName("check-sortare-chei"))
                    if(checks2.checked)
                        v_chei[0]=checks2.value;    
            }
            if(nr_check_chei==2)
                v_chei[1]=this.value;
                
            if(nr_check_chei>2){
                this.checked=false;
                nr_check_chei--;
            }
        }
    }
    
    let nr_check_ordine=0;
    let semn_ordine
    for(let checks of document.getElementsByClassName("check-sortare-ordine"))
    {
        checks.onchange=function()
        {
            if(this.checked)
                nr_check_ordine++;
            else
                nr_check_ordine--;

            if(nr_check_ordine>1){
                this.checked=false;
                nr_check_ordine--;
            }
            else
                semn_ordine=parseInt(this.value)
        }
    }

    document.getElementById("buton_sortare_specifica").onclick=function()
    {
        if(nr_check_chei!=2||nr_check_ordine!=1)
        {
            document.getElementById("mesaj_sortare_specifica").style.display="block";
            setTimeout(function() {
                document.getElementById("mesaj_sortare_specifica").style.display="none";
            }, 1000);
        }
        else
        {
            sortare2(v_chei[0],v_chei[1],semn_ordine);
            filtrare();
        }
    }

    document.getElementById("buton_salvare_filtre").onclick=function()
    {
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

        localStorage.setItem("filtru_salvat",1);
        localStorage.setItem("nume_salvat",val_nume);
        localStorage.setItem("textarea_salvat",v_textare);
        localStorage.setItem("categorie_salvat",val_categorie);
        localStorage.setItem("checked_salvat",val_checked);
        localStorage.setItem("pret_a_salvat",pret_a);
        localStorage.setItem("pret_b_salvat",pret_b);
        localStorage.setItem("disponibilitate_salvat",val_disponibilitate);
        localStorage.setItem("views_salvat",val_views);

        document.getElementById("mesaj_salvare_filtre").style.display="block";
        setTimeout(function() {
            document.getElementById("mesaj_salvare_filtre").style.display="none";
        }, 1000);
        document.getElementById("buton_aplic_filtre_salvate").style.display="inline";
    }

    if(localStorage.getItem("filtru_salvat"))
    {
        document.getElementById("buton_aplic_filtre_salvate").style.display="inline";
    }

    document.getElementById("buton_aplic_filtre_salvate").onclick=function()
    {
        let val_nume=localStorage.getItem("nume_salvat");
        let v_textare=localStorage.getItem("textarea_salvat");
        let val_categorie=localStorage.getItem("categorie_salvat");
        let val_checked=localStorage.getItem("checked_salvat");
        let val_disponibilitate=localStorage.getItem("disponibilitate_salvat");
        let val_views=localStorage.getItem("views_salvat");

        // console.log(pret_a);
        document.getElementById("inp-nume").value=val_nume;
        document.getElementById("i_textarea").value=v_textare;
        for(let checks of document.getElementsByName("gr_rad"))
        {
            if(checks.value==val_categorie)
                checks.checked=true;
        }

        if(val_checked!="toate")
            document.getElementById("noutati").checked=true;
        
        document.getElementById("inp-views").value=val_views;
        document.getElementById("infoRange").innerHTML="("+val_views+")";

        for(let opt of document.getElementById("inp-disp").options){
            if(opt.value==val_disponibilitate)
                opt.selected=true;
        }
        // for(let opt of document.getElementById("inp-pret").options)
        // {
        //     for(let i of pret_a)
        //     {
        //         console.log(i);
        //         if(parseInt(opt.value.split(',')[0])==i)
        //             opt.selected=true;
        //     }
        // }
        filtrare();
    }
    function filtrare(flag=true){

        if(flag)
        {
            for(let prod of document.getElementsByClassName("produs"))
            {
                if(localStorage.getItem(prod.id))
                    localStorage.removeItem(prod.id);
            }
        }

        document.getElementById("mesaj-invalid").style.display="none";
        document.getElementById("inp-nume").style.color="inherit";
        document.getElementById("i_textarea").style.color="inherit";

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

        nrprod=0;
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


            let cond8=prod.classList.contains("produs_fixat");

            let cond9=localStorage.getItem(prod.id);

            let cond10=sessionStorage.getItem(prod.id);

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && !cond9 && !cond10|| cond8){
                sem=1; 
                nrprod++;
                if(1+k*(pag-1)<=nrprod&&nrprod<=k*pag)
                    prod.style.display="block";
            }

        }

        let butoane_pagina="";
        for( let i=1;i<=Math.ceil(nrprod/k);i++)
            butoane_pagina+="<button id=\""+i+"\" class=\"btn btn-sm link-pagina\" style=\"margin-right:15px\">"+i+"</button>";
        document.getElementById("butoane-pagina").innerHTML=butoane_pagina;

        for (var but_pagina of document.getElementsByClassName("link-pagina")) {
        but_pagina.onclick = function() {
            if(pag!=this.id){
                pag=this.id;
                filtrare(false);
            }
        };

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
            pag=1;
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
            
            nr_check_chei=0;
            nr_check_ordine=0;
            for(let opt of document.getElementById("inp-pret").options)
            {
                opt.selected=false;
            }

            for(let checks of document.getElementsByClassName("check-sortare-chei"))
            {
                checks.checked=false;
            }

            for(let checks of document.getElementsByClassName("check-sortare-ordine"))
            {
                checks.checked=false;
            }
            document.getElementById("infoRange").innerHTML="(0)";
            localStorage.removeItem("filtru_salvat");
            localStorage.removeItem("nume_salvat");
            localStorage.removeItem("textarea_salvat");
            localStorage.removeItem("categorie_salvat");
            localStorage.removeItem("checked_salvat");
            localStorage.removeItem("disponibilitate_salvat");
            localStorage.removeItem("views_salvat");
            document.getElementById("buton_aplic_filtre_salvate").style.display="none";

            sortare_reset();
            filtrare();
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
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
    }

    function comp(a,b,semn)
    {
        if(isNaN(parseFloat(a))&&isNaN(parseFloat(b)))
        {
            if(a==b)
                return 0;
            else
                return semn*a.localeCompare(b);
        }
        else
        {
            a=parseFloat(a);
            b=parseFloat(b);
            if(a==b)
                return 0;
            else
                return semn*(a-b);
        }
    }
    function sortare2 (param1,param2,semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let param1_a=a.getElementsByClassName("val-"+param1)[0].innerHTML;
            let param1_b=b.getElementsByClassName("val-"+param1)[0].innerHTML;
            
            if(comp(param1_a,param1_b,semn)==0){
                let param2_a=a.getElementsByClassName("val-"+param2)[0].innerHTML;
                let param2_b=b.getElementsByClassName("val-"+param2)[0].innerHTML;
                return comp(param2_a,param2_b,semn)
            }
            else
                return comp(param1_a,param1_b,semn)
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
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
        filtrare();
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sortare(-1);
        filtrare();
    }

    window.onkeydown=function(e)
    {
        if(e.key=="c" && e.altKey)
        {
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

    if(document.cookie.includes("ultimul-produs")){
        document.getElementById("ultimul-produs").innerHTML="<a href="+document.cookie.split("ultimul-produs=")[1].split(" ")[0] +">Ultimul Produs Accesat</a>";
    }

    for(let butoane of document.getElementsByClassName("buton_filtre_fix"))
    {
        butoane.onclick=function()
        {
            if(document.getElementById("articol_"+butoane.id.split('.')[1]).classList.contains("produs_fixat"))
                document.getElementById("articol_"+butoane.id.split('.')[1]).classList.remove("produs_fixat");
            else
                document.getElementById("articol_"+butoane.id.split('.')[1]).classList.add("produs_fixat");
        }
    }

    for(let butoane of document.getElementsByClassName("buton_filtre_sters"))
    {
        
        butoane.onclick=function()
        {
           
            localStorage.setItem("articol_"+butoane.id.split('.')[1],1);
            console.log(localStorage);
            filtrare(false);
        }
    }

    for(let butoane of document.getElementsByClassName("buton_filtre_sters_session"))
    {
        butoane.onclick=function()
        {
            sessionStorage.setItem("articol_"+butoane.id.split('.')[1],1);
            filtrare();
        }
    }
}