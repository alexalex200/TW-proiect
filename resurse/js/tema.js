    let tema=localStorage.getItem("tema");
    if(tema){
        document.body.classList.add(tema);
    }

window.addEventListener("DOMContentLoaded", function(){
    document.getElementById("tema2").onclick= function(){
        if(!document.body.classList.contains("dark")){
            document.body.classList.add("dark")
            localStorage.setItem("tema","dark");
        }

        if(document.body.classList.contains("temaa"))
        {
            document.body.classList.remove("temaa");
        }
    }


    document.getElementById("tema3").onclick= function(){
        if(!document.body.classList.contains("temaa")){
            document.body.classList.add("temaa")
            localStorage.setItem("tema","temaa");
        }

        if(document.body.classList.contains("dark"))
        {
            document.body.classList.remove("dark");
        }
    }

    document.getElementById("tema1").onclick= function(){
        if(document.body.classList.contains("temaa"))
        {
            document.body.classList.remove("temaa");
            localStorage.removeItem("tema");
        }

        if(document.body.classList.contains("dark"))
        {
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
        }
    }
});