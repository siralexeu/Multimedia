window.onload = async function () {
    //preluare date eurostat
    const urlPIB = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&time=2022&time=2021&time=2020&time=2019&time=2018&time=2017&time=2016&time=2015&time=2014&time=2013&time=2012&time=2011&time=2010&time=2009&time=2008";
    const urlSV = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_mlexpec?sex=T&age=Y1&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&time=2022&time=2021&time=2020&time=2019&time=2018&time=2017&time=2016&time=2015&time=2014&time=2013&time=2012&time=2011&time=2010&time=2009&time=2008";
    const urlPop = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?sex=T&age=TOTAL&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&time=2022&time=2021&time=2020&time=2019&time=2018&time=2017&time=2016&time=2015&time=2014&time=2013&time=2012&time=2011&time=2010&time=2009&time=2008";

    const codTara = {
        "BE": 0, "BG": 1, "CZ": 2, "DK": 3, "DE": 4, "EE": 5, "IE": 6, "EL": 7, "ES": 8, "FR": 9, "HR": 10, "IT": 11, "CY": 12, "LV": 13,
        "LT": 14, "LU": 15, "HU": 16, "MT": 17, "NL": 18, "AT": 19, "PL": 20, "PT": 21, "RO": 22, "SI": 23, "SK": 24, "FI": 25, "SE": 26
    };
    const ani = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];//ultimii 15 ani disponibili

    let data = []; //array pt date

    async function fetchData() {//ia datele din api, apoi sorteaza valorile în functie de tara si ani
        const responsePIB = await fetch(urlPIB);//citire api
        const dataPIBJson = await responsePIB.json();
        const valoriPIB = dataPIBJson.value;

        const responseSV = await fetch(urlSV);
        const dataSVJson = await responseSV.json();
        const valoriSV = dataSVJson.value;

        const responsePop = await fetch(urlPop);
        const dataPOPJson = await responsePop.json();
        const valoriPOP = dataPOPJson.value;

        Object.keys(codTara).forEach(tara => {//parcurgem tarile si anii
            const indexTara = codTara[tara];

            ani.forEach((an, i) => {
                const poz = indexTara * ani.length + i;
                //adaugam datele in json
                if (valoriPIB[poz] !== undefined) {
                    data.push({
                        tara: tara,
                        an: an,
                        indicator: "PIB",
                        valoare: valoriPIB[poz],
                    });
                }
                if (valoriSV[poz] !== undefined) {
                    data.push({
                        tara: tara,
                        an: an,
                        indicator: "SV",
                        valoare: valoriSV[poz],
                    });
                }
                if (valoriPOP[poz] !== undefined) {
                    data.push({
                        tara: tara,
                        an: an,
                        indicator: "POP",
                        valoare: valoriPOP[poz],
                    });
                }
            });
        });
        console.log("Date citite:", data);

        const taraSelectata = document.getElementById("tara");
        console.log('Tari:', codTara);
        //dropdown
        Object.keys(codTara).forEach(tara => {
            const option = document.createElement("option");
            option.value = tara;
            option.textContent = tara;
            taraSelectata.appendChild(option);
        });
    }
    fetchData();//incarcam datele

    document.getElementById("graficSVG").onclick = function () {
        const taraSelectata = document.getElementById("tara");
        const indicatorSelectat = document.getElementById("indicator").value;
        console.log('Tara selectata:', taraSelectata.value);
        console.log('Indicatorul selectat:', indicatorSelectat);

        const dateSelectate = data.filter(element => element.tara === taraSelectata.value && element.indicator.toUpperCase() === indicatorSelectat.toUpperCase());

        if (dateSelectate.length > 0) {
            GraficSVG(dateSelectate);
        } else {
            alert('Nu exista date pentru tara aceasta');
        }
    };
    document.getElementById("bubbleChart1").onclick = function () {
        const indicatorSelectat = document.getElementById("indicator").value;
        const anSelectat = prompt("Introduceti anul pentru care doriti sa vizualizati date:");
        console.log("Indicator selectat:", indicatorSelectat);
        console.log("An selectat:", anSelectat);

        const dateSelectate = data.filter((element) => element.an === parseInt(anSelectat) && element.indicator.toUpperCase() === indicatorSelectat.toUpperCase());

        if (dateSelectate.length > 0) {
            BubbleChart(dateSelectate);
        } else {
            alert("Nu exista date pentru anul acesta");
        }
    };
    document.getElementById("bubbleChart2").onclick = function () {
        const indicatorSelectat = document.getElementById("indicator").value;
        const aniDisponibili = [...new Set(data.map(element => element.an))];//array cu ani disponibili, Set elimina duplicatele
        console.log("Indicatorul selectat:", indicatorSelectat);

        if (aniDisponibili.length > 0) {
            var indexAn = 0;
            function actualizeazaDate() {
                const anCurent = aniDisponibili[indexAn];
                console.log("Anul curent:", anCurent);

                const dateSelectate = data.filter((element) => element.an === anCurent && element.indicator.toUpperCase() === indicatorSelectat.toUpperCase());

                if (dateSelectate.length > 0) {
                    BubbleChart2(dateSelectate);
                } else {
                    console.log("Nu exista date pentru anul " + anCurent);
                }
                indexAn++;
                if (indexAn >= aniDisponibili.length) {
                    indexAn = 0;
                }
            }
            actualizeazaDate();
            setInterval(actualizeazaDate, 1000);//o secunda
        } else {
            alert("Nu exista date disponibile pentru aceasta selectie");
        }
    };
    document.getElementById("tabelDate").onclick = function () {
        const anSelectat = prompt("Introduceti anul pentru care doriti sa vizualizati date:");
        console.log('Anul selectat:', anSelectat);

        const dateSelectate = data.filter(element => element.an === parseInt(anSelectat));

        if (dateSelectate.length > 0) {
            tabel(dateSelectate);
        } else {
            alert("Nu exista date pentru anul acesta");
        }
    };
};

function GraficSVG(date) {
    if (date.length === 0) {
        alert("Nu exista date");
        return;
    }
    console.log(date);
    const margini = { top: 20, right: 40, bottom: 40, left: 30 };
    const w = 800 - margini.left - margini.right;
    const h = 410 - margini.top - margini.bottom;

    const svg = document.getElementById("svg");
    svg.innerHTML = "";
    const svgNou = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgNou.setAttribute("width", w + margini.left + margini.right);
    svgNou.setAttribute("height", h + margini.top + margini.bottom);
    svg.appendChild(svgNou);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${margini.left},${margini.top})`);
    svgNou.appendChild(g);

    const x = (element) => (element.an - date[0].an) * (w / (date[date.length - 1].an - date[0].an));
    const y = (element) => h - (element.valoare * h) / Math.max(...date.map(element => element.valoare));

    const tooltip = document.getElementById("tooltip");

    date.forEach((elem) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x(elem));
        rect.setAttribute("y", y(elem));
        rect.setAttribute("width", w / date.length * 0.7);
        rect.setAttribute("height", h - y(elem));
        rect.setAttribute("fill", "#2A8ED1");
        //tooltip
        rect.addEventListener("mouseover", () => {
            tooltip.style.display = "block";
            tooltip.textContent = `An: ${elem.an}, Valoare: ${elem.valoare}`;
        });
        rect.addEventListener("mousemove", (event) => {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        });
        rect.addEventListener("mouseout", () => {
            tooltip.style.display = "none";
        });
        g.appendChild(rect);
    });

    date.forEach((elem) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x(elem) + (w / date.length) * 0.35);
        text.setAttribute("y", h + margini.bottom / 2);
        text.setAttribute("text-anchor", "middle");
        text.textContent = elem.an;
        g.appendChild(text);
    });

}
function BubbleChart(date) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const spatii = 50;
    const valoareMax = Math.max(...date.map((element) => element.valoare));

    const raza = (valoare) => (valoare / valoareMax) * 40;
    const dx = (index) => spatii + (index * (w - 2 * spatii)) / date.length;
    const dy = (valoare) => h - spatii - (valoare / valoareMax) * (h - 2 * spatii);

    date.forEach((d, index) => {
        const x = dx(index);
        const y = dy(d.valoare);
        const r = raza(d.valoare);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = "#2A8ED1";
        ctx.fill();
        ctx.strokeStyle = "#2980B9";
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(d.tara, x, y - r - 2);
        ctx.fillText(d.valoare, x, y + r + 15);
    });
}
function BubbleChart2(date) {
    const canvas = document.getElementById("canvas2");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const spatii = 50;
    const maxValoare = Math.max(...date.map((element) => element.valoare));

    const dr = (valoare) => (valoare / maxValoare) * 40;
    const dx = (index) => spatii + (index * (w - 2 * spatii)) / date.length;
    const dy = (valoare) => h - spatii - (valoare / maxValoare) * (h - 2 * spatii);

    const totiAnii = [...new Set(date.map(element => element.an))];
    let anCurent = 0;

    const anTextX = w / 2;
    const anTextY = h - spatii / 4;

    function animatie() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00FF00";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(totiAnii[anCurent], anTextX, anTextY);

        const anCurentData = date.filter(element => element.an === totiAnii[anCurent]);

        anCurentData.forEach((d, index) => {
            const x = dx(index);
            const y = dy(d.valoare);
            const r = dr(d.valoare);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = "#2A8ED1";
            ctx.fill();
            ctx.strokeStyle = "#2980B9";
            ctx.stroke();

            ctx.fillStyle = "#000000";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(d.tara, x, y - r - 2);
            ctx.fillText(d.valoare, x, y + r + 15);
        });
        anCurent++;
        if (anCurent < totiAnii.length) {
            setTimeout(animatie, 1000);
        }
    }
    animatie();
}
function tabel(date) {
    const tabelC = document.getElementById("tabelAfisare");
    tabelC.innerHTML = "";

    const tabel = document.createElement("table");
    tabel.style.width = "100%";
    tabel.style.border = "1px solid black";
    tabel.style.borderCollapse = "collapse";

    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = "Tara";
    tr.appendChild(th);

    const indicatori = ["PIB", "SV", "POP"];
    indicatori.forEach(indicator => {
        const thNou = document.createElement("th");
        thNou.textContent = indicator;
        tr.appendChild(thNou);
    });
    tabel.appendChild(tr);

    const media = {};
    indicatori.forEach(indicator => {
        const valori = date.filter(element => element.indicator === indicator).map(element => element.valoare);
        media[indicator] = valori.length > 0 ? valori.reduce((a, b) => a + b, 0) / valori.length : 0;
    })

    const tariSelectate = [...new Set(date.map(element => element.tara))];//aray cu toate tarile

    tariSelectate.forEach(tara => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = tara;
        tr.appendChild(td);

        indicatori.forEach(indicator => {
            const tdNou = document.createElement("td");
            const valoare = date.find(element => element.tara === tara && element.indicator === indicator)?.valoare || "N/A";

            if (valoare !== "N/A") {
                const medie = media[indicator];
                const dif = valoare - medie;
                const valMax = Math.max(...date.filter(element => element.indicator === indicator).map(element => Math.abs(element.valoare - media[indicator])));
                if (dif > 0) {
                    const saturatieVerde = Math.min(255, Math.floor((dif / valMax) * 255));
                    tdNou.style.backgroundColor = `rgb(${255 - saturatieVerde}, 255, ${255 - saturatieVerde})`;
                } else {
                    const saturatieRosu = Math.min(255, Math.floor((Math.abs(dif) / valMax) * 255));
                    tdNou.style.backgroundColor = `rgb(255, ${255 - saturatieRosu}, ${255 - saturatieRosu})`;
                }
            }

            tdNou.textContent = valoare;
            tdNou.style.border = "1px solid black";
            tdNou.style.textAlign = "center";
            tr.appendChild(tdNou);
        });
        tabel.appendChild(tr);
    });
    tabelC.appendChild(tabel);
}

//preluare date din fisierul media/json - initial asa am facut
// const response = await fetch('media/eurostat.json');
// const data = await response.json();
// console.log(data);

// const tari = [...new Set(data.map(element => element.tara))];

// taraSelectata = document.getElementById("tara");
// console.log(tari);

// tari.forEach(tara => { //dropdown
//     const option = document.createElement("option");
//     option.value = tara;
//     option.textContent = tara;
//     taraSelectata.appendChild(option);
// });
//ca sa mearga trebuie deschis cu live server si trebuie sters parseInt de la bubbleChart1 si tabel la selectarea anului
//inlocuiesti pana la fetchData inclusiv