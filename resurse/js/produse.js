window.onload=function() {


    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
    }
    
    
    document.getElementById("filtrare").onclick= function(){
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();
        let val_calorii;
        let gr_radio=document.getElementsByName("gr_rad");
        for(let r of gr_radio){
            if(r.checked){
                val_calorii=r.value;
                break;
            }
        }
    
    
        let val_pret=document.getElementById("inp-pret").value
        let val_categ=document.getElementById("inp-categorie").value
    
    
        var produse=document.getElementsByClassName("produs");
    
    
        for (let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
    
    
            let cond1= nume.startsWith(val_nume);
            let cond2=true
            if (val_calorii!="toate"){
                [nra, nrb]=val_calorii.split(":")
                nra=parseInt(nra);
                nrb=parseInt(nrb);
                let calorii=parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML);
    
    
                cond2= (nra<=calorii && calorii<nrb);
            }
    
    
            pret=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            cond3= (val_pret<=pret);
    
    
            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML
            let cond4 = (val_categ==categorie || val_categ=="toate");
            if(cond1 && cond2 && cond3 && cond4){
                prod.style.display="block";
            }
        }
    }
    
    
    
    
    
    
        document.getElementById("resetare").onclick= function(){
           
            document.getElementById("inp-nume").value="";
           
            document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
            document.getElementById("inp-categorie").value="toate";
            document.getElementById("i_rad4").checked=true;
            var produse=document.getElementsByClassName("produs");
    
    
            for (let prod of produse){
                prod.style.display="block";
            }
        }
    
    
    }
    