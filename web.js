/* MENU */

function toggleMenu(){

    const sidebar =
    document.getElementById("mySidebar");

    const overlay =
    document.getElementById("menuOverlay");

    sidebar.classList.toggle("active");

    if(sidebar.classList.contains("active")){

        overlay.style.display = "block";

    }else{

        overlay.style.display = "none";

    }

}

function closeMenu(){

    document.getElementById("mySidebar")
    .classList.remove("active");

    document.getElementById("menuOverlay")
    .style.display = "none";

}

/* CHANGE SECTION */

function showSection(sectionId){

    const sections =
    document.querySelectorAll(".section");

    sections.forEach(section => {

        section.classList.remove("active");

    });

    document.getElementById(sectionId)
    .classList.add("active");

    /* ซ่อน/แสดงช่องค้นหา */
    const searchBox =
    document.getElementById("searchContainer");

    if(sectionId === "home"){
        searchBox.style.display = "block";
    }else{
        searchBox.style.display = "none";
    }
    if(sectionId === "charts"){
    loadCharts();
}

    closeMenu();
}

/* IMAGE MODAL */

function openImage(src){

    document.getElementById("imageModal")
    .style.display = "flex";

    document.getElementById("modalImage")
    .src = src;

}

function closeImage(){

    document.getElementById("imageModal")
    .style.display = "none";

}

/* CLICK BLACK AREA CLOSE */

document.getElementById("imageModal")
.addEventListener("click", function(e){

    if(e.target.id === "imageModal"){

        closeImage();

    }

});

/* ESC CLOSE */

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        closeImage();

    }

});

/* TREE DATA */

const items = [

{
img:"images/trees/A011/A011_2_flowers.jpeg",
alt:"ต้นศรีตรัง",
title:"ต้นศรีตรัง",
text:"ดอกของต้นศรีตรังคือสัญลักษณ์ของมหาวิทยาลัยสงขลานครินทร์"
},

{
img:"images/trees/C001/C001_0_overall.jpeg",
alt:"ต้นจามจุรี",
title:"ต้นจามจุรี",
text:"ต้นไม้ที่มีปริมาณการกักเก็บคาร์บอนสูงที่สุดในมหาวิทยาลัย"
},

{
img:"images/trees/E001/E001_0_overall.jpeg",
alt:"ต้นยางนา",
title:"ต้นยางนา",
text:"ต้นไม้ที่มีความสูงมากที่สุดในมหาวิทยาลัย"
},

{
img:"images/trees/C007/C007_0_overall.jpeg",
alt:"ต้นปาล์มสิบสองปันนา",
title:"ต้นปาล์มสิบสองปันนา",
text:"ต้นไม้ที่มีปริมาณการกักเก็บคาร์บอนต่ำที่สุดในมหาวิทยาลัย"
},

{
img:"images/trees/B024/B024_0_overall.jpeg",
alt:"ปาล์มหางหมาจิ้งจอก",
title:"ปาล์มหางหมาจิ้งจอก",
text:"ต้นไม้ที่มีความสูงต่ำที่สุดในมหาวิทยาลัย"
}

];

/* PAGINATION */

const itemsPerPage = 4;

let currentPage = 1;

let filteredItems = [...items];

function renderPage(page){

    const food =
    document.getElementById("food");

    const pagination =
    document.getElementById("pagination");

    const totalPages =
    Math.max(
        1,
        Math.ceil(filteredItems.length
        / itemsPerPage)
    );

    currentPage =
    Math.max(
        1,
        Math.min(page,totalPages)
    );

    const start =
    (currentPage - 1)
    * itemsPerPage;

    const pageItems =
    filteredItems.slice(
        start,
        start + itemsPerPage
    );

    food.innerHTML =
    pageItems.map(item => `

    <div class="w3-quarter">

    <img src="${item.img}"
    alt="${item.alt}"
    class="card-img"
    onclick="openImage('${item.img}')">

    <h3>${item.title}</h3>

    <p>${item.text}</p>

    </div>

    `).join("");

    let paginationHTML = "";

    for(let i=1;i<=totalPages;i++){

        paginationHTML += `

        <a href="javascript:void(0)"
        class="w3-bar-item w3-button
        ${i===currentPage
        ? 'w3-black'
        : 'w3-hover-black'}"

        onclick="renderPage(${i})">

        ${i}

        </a>

        `;

    }

    pagination.innerHTML =
    paginationHTML;

}

/* SEARCH */

function searchItems(){

    const keyword =
    document.getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

    filteredItems =
    items.filter(item =>

        item.title.toLowerCase()
        .includes(keyword)

        ||

        item.text.toLowerCase()
        .includes(keyword)

    );

    renderPage(1);

}

/* START */

renderPage(1);


function loadCharts(){

    if(window.chartLoaded) return;
    window.chartLoaded = true;

    // เรียงข้อมูลจากมาก → น้อย
const sortedTrees = [...treesData]
.sort((a, b) => b.CarbonStock_kgC - a.CarbonStock_kgC);

// เอาแค่ 10 อันดับแรก
const top10 = sortedTrees.slice(0, 10);

// แยก label และ data
const names = top10.map(t => t.name_th);
const carbon = top10.map(t => t.CarbonStock_kgC);
const colors1 = names.map((_, i) => {
    const hue = (i * 360 / names.length);
    return `hsl(${hue}, 70%, 50%)`;
});
    const dbh = treesData.map(t => t.DBH_cm);

    // ===== กราฟ 1: การกักเก็บคาร์บอน =====
    new Chart(document.getElementById("chart1"), {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'ชนิดต้นไม้',
                data: carbon,
                backgroundColor: colors1
            }]
        },
        options: {
            plugins: {
                legend: {
                display: false   
            },
                title: {
                    display: true,
                    text: '10 อันดับต้นไม้ที่มีการกักเก็บคาร์บอนสูงสุด'
                }
            },
        
         scales: {
                x: {
                title: { display: true, text: 'ชนิดต้นไม้' }
            },
                y: {
                    title: { display: true, text: 'ปริมาณการกักเก็บคาร์บอน (kgC)' }
                }
            }
        }
    });

    // ===== กราฟ 2: ความสัมพันธ์ Biomass vs Carbon =====
    new Chart(document.getElementById("chart2"), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Biomass vs Carbon',
                data: treesData.map(t => ({
    x: t.DBH_cm,
    y: t.CarbonStock_kgC,
    name: t.name_th
})),  

                backgroundColor: 'rgba(0,123,255,0.7)'
            }]
        },
        options: {
    plugins: {
        legend: {
                display: false   
            },
        title: {
            display: true,
            text: 'ความสัมพันธ์ระหว่างเส้นผ่านศูนย์กลาง (DBH) กับการกักเก็บคาร์บอน'
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const point = context.raw;
                    return `ต้น: ${point.name} | DBH: ${point.x} cm | Carbon: ${point.y} kgC`;
                }
            }
        }
    },
            scales: {
                x: {
                title: { display: true, text: 'เส้นผ่านศูนย์กลาง (cm)' }
            },
                y: {
                    title: { display: true, text: 'ปริมาณการกักเก็บคาร์บอน (kgC)' }
                }
            }
        }
    });


    // ===== กราฟ 4: Carbon แยกตามโซน =====
let zoneCarbon = {};

// รวมค่า Carbon ของแต่ละโซน
treesData.forEach(tree => {
    let zone = tree.zone_name || "Unknown";
    let carbon = tree.CarbonStock_kgC || 0;

    if(!zoneCarbon[zone]){
        zoneCarbon[zone] = 0;
    }

    zoneCarbon[zone] += carbon;
});

// แยก label และ data
const zoneLabels = Object.keys(zoneCarbon);
const zoneData = Object.values(zoneCarbon);
const colors4 = zoneLabels.map((_, i) => {
    const hue = (i * 360 / zoneLabels.length);
    return `hsl(${hue}, 65%, 55%)`;
});

// สร้างกราฟ
new Chart(document.getElementById("chart4"), {
    type: 'bar',
    data: {
        labels: zoneLabels,
        datasets: [{
            label: 'ปริมาณการกักเก็บคาร์บอน (kgC)',
            data: zoneData,
            backgroundColor: colors4
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false   
            },
            title: {
                display: true,
                text: 'การกักเก็บคาร์บอนในแต่ละโซนพื้นที่'
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'โซนพื้นที่' }
            },
            y: {
                title: { display: true, text: 'ปริมาณการกักเก็บคาร์บอน (kgC)' }
            }
        }
    }
});

}