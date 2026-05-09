/*
        var treesData = [
        {
        "survey_date": "3/19/2026",
        "survey_name": "นาย ปรเมศวร์ นุ่มศึก",
        "zone_id": "B",
        "zone_name": "B : สนามฟุตบอล",
        "tree_id": "B023",
        "longitude": 98.353449,
        "latitude": 7.896506,
        "GBH": 49.4,
        "height": 6,
        "name_th": "กระถิน",
        "name_en": "Lead tree",
        "scientific_name": "Leucaena leucocephala",
        "local_name": "กระถินไทย",
        "type": "ป่าเบญจพรรณ",
        "DBH_cm": 15.72,
        "WS_kg": 35.89,
        "WB_kg": 6.3,
        "WL_kg": 1.45,
        "AGB_kg": 43.63,
        "BGB": 11.78,
        "TotalBiomass_kg": 55.41,
        "CarbonStock_kgC": 27.16,
        "Sequestration_kgCO2e": 99.58,
        "Sequestration_tCO2e": 0.1
        },
        {
        "survey_date": "3/28/2026",
        "survey_name": "นางสาววรรณชนก อมิตรสูญ",
        "zone_id": "A",
        "zone_name": "A : ลานจอดรถ",
        "tree_id": "A001",
        "longitude": 98.3515408,
        "latitude": 7.8951044,
        "GBH": 109,
        "height": 9.8,
        "name_th": "กระทิง",
        "name_en": "Alexandrian laurel",
        "scientific_name": "Calophyllum inophyllum",
        "local_name": "สารภีทะเล",
        "type": "ป่าดิบแล้ง",
        "DBH_cm": 34.68,
        "WS_kg": 280.78,
        "WB_kg": 84.85,
        "WL_kg": 7.41,
        "AGB_kg": 373.04,
        "BGB": 100.72,
        "TotalBiomass_kg": 473.76,
        "CarbonStock_kgC": 227.73,
        "Sequestration_kgCO2e": 835.03,
        "Sequestration_tCO2e": 0.84
        }];
        */
        // 1. Define Base Maps
        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        });

        var esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
        });

        var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'], attribution: 'Google Maps'
        });

        // 2. Initialize Map
        var map = L.map('trees-map', {
            center: [7.8958, 98.3525],
            zoom: 17,
            layers: [esriImagery] // Default base layer
        });

        // 3. Define Species Colors
        // DIY: เพิ่มสีสำหรับชนิดต้นไม้เพิ่มเติมตามต้องการ หรือใช้ตัวสร้างสีสำหรับชุดข้อมูลขนาดใหญ่
        const speciesColors = {
            "ยางนา": "#00E676",        // เขียวนีออน
            "ประดู่": "#FF3D00",       // แดงสด
            "ศรีตรัง": "#AA00FF",     // ม่วงสด
            "แคป่า": "#FF1744",
            "เสลา": "#F50057",
            "พะยอม": "#FF9100",
            "แซะ": "#FFD600",
            "ปาล์มน้ำมัน": "#00C853",
            "ตะเคียน": "#795548",
            "มะค่าโมง": "#BF360C",
            "หางนกยูงฝรั่ง": "#FF3D00",
            "ตีนเป็ด": "#00BFA5",      // เขียวอมฟ้า
            "นนทรี": "#FFD600",
            "กระถิน": "#69F0AE",
            "หมาก": "#00E676",
            "ขี้เหล็ก": "#FFEA00",
            "จามจุรี": "#00B0FF",      // ฟ้า
            "มะฮอกกานี": "#6D4C41",
            "ควีนปาล์ม": "#FFD740",
            "บัวสวรรค์": "#D500F9",
            "มะม่วง": "#00C853",
            "ปาล์มสิบสองปันนา": "#00E676",
            "สน": "#00BFA5",
            "อินทนิล": "#FF4081",
            "จำปา": "#FFD740",
            "หูกระจง": "#8D6E63",
            "ปีบ": "#BDBDBD",
            "สาละลังกา": "#D50000",
            "มั่งมี": "#FF6D00",
            "มันปู": "#A1887F",
            "หูกวาง": "#8D6E63",
            "ติ้วขาว": "#5D4037",
            "หว้า": "#651FFF",
            "กระทิง": "#00C853",
            "มะรุม": "#69F0AE",
            "มะพร้าว": "#00E676",
            "ทุเรียน": "#00C853",
            "ตะแบก": "#EA80FC",
            "อโศก": "#00E676",
            "เต็ง": "#6D4C41",
            "ทุ้งฟ้า": "#00E5FF",
            "ปอหูช้าง": "#FF1744"

        };

        // 4. Organize Layers
        var baseMaps = {
            "Satellite (Esri)": esriImagery,
            "Google Streets": googleStreets,
            "OpenStreetMap": osm,
        };

        var speciesLayers = {}; //ใช้ข้อมูลจาก name_en เพื่อจัดกลุ่มชั้นข้อมูล

        // loop through treesData and create markers, adding them to the appropriate species layer
        // Use tree as a row in total 175 rows of data
        const markersByName = {}; // สำหรับเก็บ markerตามชื่อชนิดต้นไม้ (name_th) เพื่อการค้นหา
        const allMarkers = [];
        const markersById = {}; // สำหรับเก็บ marker ตาม tree_id เพื่อการ zoom เมื่อคลิกใน popup ของปุ่มแสดงต้นไม้สำคัญ
        treesData.forEach(function(tree) {
            var species = tree.name_th; // แถว: คอลัมน์: name_th ในเทมเพลตข้อมูลต้นไม้.{columnname}
            
            var marker = L.circleMarker([tree.latitude, tree.longitude], {
                radius: 5, // DIY: ปรับขนาดตามต้องการของ marker
                fillColor: speciesColors[species] || speciesColors["default"], // ใช้สีที่กำหนดไว้หรือสี default หากไม่มีการกำหนด
                color: "#444141", // ขอบสีขาวเพื่อความคมชัด
                weight: 2, // ความหนาของขอบ
                fillOpacity: 0.9 // ความทึบของสีภายใน 0-1
            }).bindPopup(`
                <div class="popup-card">
                    <image src="images/trees/${tree.tree_id}/${tree.tree_id}_0_overall.jpeg" title="ภาพรวม" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                    <image src="images/trees/${tree.tree_id}/${tree.tree_id}_1_leaves.jpeg" title="ใบ" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                    <image src="images/trees/${tree.tree_id}/${tree.tree_id}_2_flowers.jpeg" title="ดอก" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                    <image src="images/trees/${tree.tree_id}/${tree.tree_id}_3_fruits.jpeg" title="ผล" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                    <div class="popup-header">${tree.name_th}</div>
                    <div class="stat-label">ชื่อภาษาอังกฤษ:${tree.name_en}</i></div>
                    <hr>
                    <div class="stat-label">ชื่อวิทยาศาสตร์: <i>${tree.scientific_name}</i></div>
                    <hr>
                    <div class="stat-label">รหัสต้นไม้: <span class="stat-value">${tree.tree_id}</span></div>
                    <div class="stat-label">ชื่อโซนพื้นที่: <span class="stat-value">${tree.zone_name}</span></div>
                    <div class="stat-label">ความสูง: <span class="stat-value">${tree.height} m.</span></div>
                    <div class="stat-label">มวลชีวภาพรวม: <span class="stat-value">${tree.TotalBiomass_kg} kg.</span></div>
                    <div class="stat-label">ปริมาณก๊าซเรือนกระจกที่กักเก็บได้: <span class="stat-value">${tree.CarbonStock_kgC} kgCO2e</span></div>
                    <div class="stat-label" style="color:green">ปริมาณก๊าซเรือนกระจกที่กักเก็บได้: <span class="stat-value">${tree.Sequestration_tCO2e} tCO2e</span></div>
                </div>
            `);
            /* CREATE FILTER OPTIONS */


            /* CREATE FILTER OPTIONS */



            if (!speciesLayers[species]) {
                speciesLayers[species] = L.layerGroup().addTo(map);
            }
            // ✅ เก็บ marker สำหรับค้นหา
markersById[tree.tree_id] = marker;
var species = tree.name_th;

// 🔍 สำหรับ search
if (!markersByName[species]) {
    markersByName[species] = [];
}
markersByName[species].push(marker);

// 🎯 สำหรับ zoom
markersById[tree.tree_id] = marker;
            marker.addTo(speciesLayers[species]);
            allMarkers.push({
    marker: marker,
    data: tree
});
        });
        /* CREATE FILTER OPTIONS */

function populateFilters(){

    const zones =
    [...new Set(
        treesData.map(t => t.zone_name)
    )];

    const species =
    [...new Set(
        treesData.map(t => t.name_th)
    )];

    const types =
    [...new Set(
        treesData.map(t => t.type)
    )];

    const zoneFilter =
    document.getElementById("zoneFilter");

    const speciesFilter =
    document.getElementById("speciesFilter");

    const typeFilter =
    document.getElementById("typeFilter");

    zones.forEach(z => {

        zoneFilter.innerHTML +=
        `<option value="${z}">${z}</option>`;

    });

    species.forEach(s => {

        speciesFilter.innerHTML +=
        `<option value="${s}">${s}</option>`;

    });

    types.forEach(t => {

        typeFilter.innerHTML +=
        `<option value="${t}">${t}</option>`;

    });

}

/* RUN FILTER */

populateFilters();
const searchInput = document.getElementById("treeSearch");
const noResultMsg = document.getElementById("noResultMsg");

searchInput.addEventListener("input", function(e) {
    const keyword = e.target.value.toLowerCase().trim();

    // reset marker
    Object.values(markersByName).flat().forEach(m => {
        m.setStyle({ radius: 5 });
    });

    // ✅ ยังไม่พิมพ์ → ซ่อน
    if (keyword === "") {
        noResultMsg.style.display = "none";
        return;
    }

    let foundMarkers = [];

    Object.keys(markersByName).forEach(name => {
        if (name.toLowerCase().includes(keyword)) {
            markersByName[name].forEach(marker => {
                foundMarkers.push(marker);

                marker.setStyle({ radius: 10 });
                marker.openPopup();
            });
        }
    });

    if (foundMarkers.length > 0) {
        map.fitBounds(L.featureGroup(foundMarkers).getBounds());
        noResultMsg.style.display = "none";
    } else {
        noResultMsg.style.display = "block";
    }
});


        // 5. Add Combined Layer Control
        // The "collapsed: false" makes the panel permanently toggled open
        L.control.layers(baseMaps, speciesLayers, { 
            collapsed: true, // DIY: เปลี่ยนเป็น false หากต้องการให้แผงเลเยอร์เปิดตลอดเวลา
            position: 'topright' 
        }).addTo(map);

// 🔘 ปุ่มแสดงต้นไม้สำคัญ
var importantControl = L.control({ position: 'topleft' });

importantControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'leaflet-bar');

    div.innerHTML = `
        <button id="importantBtn" style="
            padding:6px 10px;
            background:white;
            border:none;
            cursor:pointer;
            font-size:14px;
        ">🌳 5 อันดับปริมาณคาร์บอนในต้นไม้</button>
    `;

    // ❗ กัน map zoom ตอนกดปุ่ม
    L.DomEvent.disableClickPropagation(div);

    return div;
};

// เพิ่มปุ่มไปที่แผนที่
importantControl.addTo(map);

/* LEGEND */

var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function(map){

    var div = L.DomUtil.create(
        'div',
        'legend'
    );

    div.innerHTML +=
    '<div class="legend-title">🌳 คำอธิบายสัญลักษณ์</div>';

    Object.keys(speciesColors).forEach(species => {

        // ข้าม default
        if(species === "default") return;

        div.innerHTML += `

        <div class="legend-item">

            <span
                class="legend-color"
                style="
                    background:${speciesColors[species]}
                "
            ></span>

            ${species}

        </div>

        `;

    });

    return div;

};

legend.addTo(map);
document.addEventListener("DOMContentLoaded", () => {
   document.getElementById("importantBtn").onclick = function() {

    showTop5Dropdown();

};
});
function showTop5Dropdown() {

    const dropdown =
    document.getElementById("topTreesDropdown");

    const content =
    document.getElementById("topTreesContent");

    const topTrees = [...treesData]
        .sort((a,b) =>
            b.CarbonStock_kgC -
            a.CarbonStock_kgC
        )
        .slice(0,5);

    let html = "";

    topTrees.forEach((tree,i) => {

        html += `

        <div
            class="top-tree-item
            ${i===0 ? 'first' : ''}"

            onclick="zoomToTree('${tree.tree_id}')"
        >

            <b>${i+1}. ${tree.name_th}</b>

            <br>

            🌱 ${tree.CarbonStock_kgC} kgC

            <br>

            📏 ${tree.GBH} cm.

        </div>

        `;

    });

    content.innerHTML = html;
    

    /* TOGGLE */

    if(dropdown.style.display === "block"){

        dropdown.style.display = "none";

    }else{

        dropdown.style.display = "block";

    }

}
function zoomToTree(id) {

    const marker = markersById[id];
    if (!marker) return;

    map.flyTo(marker.getLatLng(), 18);

    marker.openPopup();

    marker.setStyle({ radius: 12 });

    setTimeout(() => {
        marker.setStyle({ radius: 5 });
    }, 2000);
}

/* CLOSE DROPDOWN WHEN CLICK OUTSIDE */

document.addEventListener("click", function(e){

    const dropdown =
    document.getElementById("topTreesDropdown");

    const button =
    document.getElementById("importantBtn");

    if(
        !dropdown.contains(e.target)
        &&
        !button.contains(e.target)
    ){

        dropdown.style.display = "none";

    }

});

/* FILTER FUNCTION */

function applyFilters(){

    const zone =
    document.getElementById("zoneFilter").value;

    const species =
    document.getElementById("speciesFilter").value;

    const type =
    document.getElementById("typeFilter").value;

    allMarkers.forEach(item => {

        const tree = item.data;

        let show = true;

        if(zone && tree.zone_name !== zone){

            show = false;

        }

        if(species && tree.name_th !== species){

            show = false;

        }

        if(type && tree.type !== type){

            show = false;

        }

        if(show){

    item.marker.addTo(
        speciesLayers[tree.name_th]
    );

}else{

    speciesLayers[tree.name_th]
    .removeLayer(item.marker);

}

    });

}

document.getElementById("zoneFilter")
.addEventListener("change", applyFilters);

document.getElementById("speciesFilter")
.addEventListener("change", applyFilters);

document.getElementById("typeFilter")
.addEventListener("change", applyFilters);

/* RESET FILTER */

document.getElementById("resetFilterBtn")
.addEventListener("click", resetFilters);

function resetFilters(){

    // รีเซ็ตค่า select
    document.getElementById("zoneFilter").value = "";

    document.getElementById("speciesFilter").value = "";

    document.getElementById("typeFilter").value = "";

    // แสดง marker ทั้งหมดกลับมา
    allMarkers.forEach(item => {

        item.marker.addTo(
            speciesLayers[item.data.name_th]
        );

    });

    // ซ่อนข้อความค้นหาไม่พบ
    noResultMsg.style.display = "none";

    // รีเซ็ต search box
    document.getElementById("treeSearch").value = "";

    // ซูมกลับจุดเริ่มต้น
    map.setView([7.8958, 98.3525], 17);

}