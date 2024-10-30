document.onload = function(){
    document.getElementsByTagName("button")[0].onclick=Schimbari;}

        function Schimbari(){
            //console.log("Am intrat in functie");
            //var heading1 = document.getElementById("heading1");
            var heading1 = document.getElementsByTagName("h1")[0];
            heading1.innerHTML = "SEMINAROS 4";

            
            var r=Math.floor(Math.random()*200+56);
            var g=Math.floor(Math.random()*200+56);
            var b=Math.floor(Math.random()*200+56);
            console.log("rgb("+r+","+g+","+b+")");
            heading1.style.backgroundColor="rgb("+r+","+g+","+b+")";

            var p2=document.createElement("p");
            var b1=document.getElementsByTagName("body")[0];
            b1.appendChild(p2);
            p2.innerHTML = "Paragraf audaugit";
        }
