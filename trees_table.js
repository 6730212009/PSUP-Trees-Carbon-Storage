// This script initializes a DataTable for displaying tree data from the treesData array.
// For maor info about DataTables, see https://datatables.net/examples/api/counter_columns.html

// First, we add an 'image_urls' property to each tree object in the treesData array.
treesData.forEach(function(tree) {
// images/trees/A001/A001_0_overall.jpeg
  var images = [
    {imageUrl:"images/trees/" + tree.tree_id + "/" + tree.tree_id + "_0_overall.jpeg", title: "ภาพรวม"},
    {imageUrl:"images/trees/" + tree.tree_id + "/" + tree.tree_id + "_1_leaves.jpeg", title: "ใบ"},
    {imageUrl:"images/trees/" + tree.tree_id + "/" + tree.tree_id + "_2_flowers.jpeg", title: "ดอก"},
    {imageUrl:"images/trees/" + tree.tree_id + "/" + tree.tree_id + "_3_fruits.jpeg", title: "ผล"}
  ];
  tree.image_urls = images;
});

// Now we can initialize the DataTable with the treesData array as the data source.
$(document).ready(function() {
    var table = $('#trees-table').DataTable({ // Initialize DataTable on the #trees-table element
        pageLength: 10, // Set default page length to 10 rows
        lengthMenu: [5, 10, 20, 25, 50], // Define page length options for the user
        language: { // Thai language settings for DataTables
            sProcessing:   "กำลังดำเนินการ...",
            sLengthMenu:   "แสดง _MENU_ แถว",
            sZeroRecords:  "<span style='color: red;margin: 30px;display: block;'>ไม่พบข้อมูล - ตรวจสอบเงื่อนไขการค้นหา</span>",
            sInfo:         "แสดง <strong>_START_</strong> ถึง <strong>_END_</strong> จากทั้งหมด <strong>_TOTAL_</strong> แถว",
            sInfoEmpty:    "ไม่พบข้อมูล",
            sInfoFiltered: "(กรองข้อมูลทั้งหมด _MAX_ แถว)",
            sSearch:       "ค้นหา:",
            oPaginate: { // Pagination controls
                sFirst:    "หน้าแรก",
                sPrevious: "ก่อนหน้า",
                sNext:     "ถัดไป",
                sLast:     "หน้าสุดท้าย"
            }
        },
        responsive: true, // Enable responsive design for better display on different screen sizes
        columnDefs: [
            {
                searchable: false, // Disable searching
                orderable: false, // Disable ordering
                targets: -1 // Disable search and ordering on the image thumbnail column (last column: index -1)
            },
            {
                searchable: false, orderable: false, target: -1
            }
        ],
        data:treesData, // Use the treesData array as the data source for the table
        columns: [
            // { data: 'fid', title: 'FID', titleAttr: 'FID', className: 'dt-center'  }, // same as row number, so hide this column
            // { data: 'tree_code', title: 'รหัสต้นไม้', titleAttr: 'Tree Code' , className: 'dt-center' },
            // { data: 'tree_name_th', title: 'ชื่อต้นไม้ (TH)', titleAttr: 'Tree Name (TH)' },
            // { data: 'tree_name_en', title: 'ชื่อต้นไม้ (EN)', titleAttr: 'Tree Name (EN)' },
            {
                data: 'tree_id',
                title: 'รหัสต้นไม้',
                className: 'dt-center',
                render: function (data, type, row) {
                    return '<span class="tree-code-badge">' + data + '</span>'; // Wrap tree code in a styled badge
                },
                createdCell: function (td, cellData, rowData) { // Add click event to the tree code cell to show details in a modal
                    td.onclick = function () {
                        // Create HTML content for the modal with tree details and images
                        let details = `
                            <table class="details-table">
                                <tr><th colspan="2" style="background-color: #fcfdfc; text-align: center; padding: 10px;">
                                <image src="images/trees/${rowData.tree_id}/${rowData.tree_id}_0_overall.jpeg" title="ภาพรวม" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                                <image src="images/trees/${rowData.tree_id}/${rowData.tree_id}_1_leaves.jpeg" title="ใบ" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                                <image src="images/trees/${rowData.tree_id}/${rowData.tree_id}_2_flowers.jpeg" title="ดอก" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                                <image src="images/trees/${rowData.tree_id}/${rowData.tree_id}_3_fruits.jpeg" title="ผล" style="width: 75px; height: 75px;" onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity='0.5';"> \
                                </th></tr> \
                                <tr><th>ชื่อโซน</th><td>${rowData.zone_name}</td></tr> \
                                <tr><th>รหัสต้นไม้</th><td>${rowData.tree_id}</td></tr> \
                                <tr><th>พิกัดต้นไม้</th><td>${rowData.latitude}, ${rowData.longitude}</td></tr> \
                                <tr><th>ชื่อต้นไม้</th><td>${rowData.name_th} (${rowData.name_en})</td></tr> \
                                <tr><th>ชื่อวิทยาศาสตร์</th><td><i>${rowData.scientific_name}</i></td></tr> \
                                <tr><th>ชื่อท้องถิ่น</th><td>${rowData.local_name}</td></tr> \
                                <tr><th>ประเภทพรรณไม้</th><td>${rowData.type}</td></tr> \
                                <tr><th>เส้นรอบวง (cm)</th><td>${rowData.GBH}</td></tr> \
                                <tr><th>ความสูง (m)</th><td>${rowData.height}</td></tr> \
                                <tr><th>เส้นผ่านศูนย์กลางระดับอก (cm)</th><td>${rowData.DBH_cm}</td></tr> \
                                <tr><th>มวลชีวภาพลำต้น (kg)</th><td>${rowData.WS_kg}</td></tr> \
                                <tr><th>มวลชีวภาพกิ่ง (kg)</th><td>${rowData.WB_kg}</td></tr> \
                                <tr><th>มวลชีวภาพใบ (kg)</th><td>${rowData.WL_kg}</td></tr> \
                                <tr><th>มวลชีวภาพรวมเหนือพื้นดิน (kg)</th><td>${rowData.AGB_kg}</td></tr> \
                                <tr><th>มวลชีวภาพใต้ดิน (kg)</th><td>${rowData.BGB}</td></tr> \
                                <tr><th>มวลชีวภาพรวมทั้งหมด (kg)</th><td>${rowData.TotalBiomass_kg}</td></tr> \
                                <tr><th>การเก็บก๊าซคาร์บอน (kgC)</th><td>${rowData.CarbonStock_kgC}</td></tr> \
                                <tr><th>การดูดซับก๊าซคาร์บอน (kgCO2e)</th><td>${rowData.Sequestration_kgCO2e}</td></tr> \
                                <tr><th>การดูดซับก๊าซคาร์บอน (tCO2e)</th><td>${rowData.Sequestration_tCO2e}</td></tr> \
                            
                            </table>
                        `;
                        // Insert into modal
                        document.getElementById('treeDetails').innerHTML = details;
                        document.getElementById('treeModal').style.display = 'block';
                    };
                }
            },
            {
                // Use null data source since we will combine two fields (tree_name_th and tree_name_en) in the render function
                data: null, 
                title: 'ชื่อต้นไม้',
                titleAttr: 'Tree Name (TH + EN)',
                render: function (data, type, row) {
                    return row.name_th + ' (' + row.name_en + ')';
                }
            },
            { data: 'type', title: 'ประเภทต้นไม้', titleAttr: 'Tree Type' },
            { data: 'height', title: 'ความสูง<br/>(เมตร)', titleAttr: 'Height (m)', className: 'dt-center', 
                render: $.fn.dataTable.render.number(',', '.', 2) },
            { data: 'DBH_cm', title: 'เส้นผ่านศูนย์กลาง<br/>(เซนติเมตร)', titleAttr: 'DBH (cm)', className: 'dt-center', 
                render: $.fn.dataTable.render.number(',', '.', 2)},
            { data: 'CarbonStock_kgC', title: 'การกักเก็บคาร์บอน<br/>(กิโลกรัม)', titleAttr: 'Carbon Storage', className: 'dt-center', 
                render: $.fn.dataTable.render.number(',', '.', 2) },
            { data: 'Sequestration_kgCO2e', title: 'การดูดซับคาร์บอน<br/>(กิโลกรัม)', titleAttr: 'CO₂ Absorption', className: 'dt-center', 
                render: $.fn.dataTable.render.number(',', '.', 2) },
            { data: 'zone_name', title: 'ชื่อโซน', titleAttr: 'Zone Name', className: 'dt-center' },
            {
                // Custom render function to display image thumbnails
                // This column will use the 'image_urls' property of each tree object
                // The render function will create thumbnail images that link to the full-size images
                // If an image fails to load, it will show a placeholder image with reduced opacity
                // The 'type' parameter allows us to check if the cell is being rendered for display or for sorting/filtering
                // We only want to render the thumbnails for display, not for sorting/filtering

                data: 'image_urls', title: 'รูปภาพประกอบ<br/>(ภาพรวม/ใบ/ดอก/ผล)', className: 'dt-center', type: 'display',
                render: function(data, type, row) {
                    if (type === 'display') {
                        var thumbnails = data.map(function(imgObj) {
                            return '<a href="' + imgObj.imageUrl + '" target="_blank" title="' + imgObj.title + '" ' +
                                'onclick="return confirm(\'เปิดไฟล์ภาพ ' + imgObj.imageUrl + ' ในเท็บใหม่ ?\');">' +
                                '<img src="' + imgObj.imageUrl + '" alt="' + imgObj.title + '" title="' + imgObj.title + '" ' +
                                'style="width: 32px; height: 32px; margin-right: 2px; border: 1px solid #ddd; cursor: pointer;" ' +
                                'onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity=\'0.35\'; ' +
                                'this.closest(\'a\').removeAttribute(\'href\'); this.closest(\'a\').style.pointerEvents=\'none\';">' +
                                '</a>';
                        }).join(''); // Join the array of thumbnail HTML strings into a single string (without commas)
                        return thumbnails;
                    }
                    return data; // For sorting/filtering, return the original data (array of image URLs) which will be ignored since we set searchable/orderable to false for this column
                }
            }
        ]
    });
});

// Modal close logic
document.querySelector('.close').onclick = function() {
  document.getElementById('treeModal').style.display = 'none';
};
window.onclick = function(event) {
  if (event.target == document.getElementById('treeModal')) {
    document.getElementById('treeModal').style.display = 'none';
  }
};

/*
if (type === 'display') {
    var thumbnails = data.map(function(imgObj) {
        return '<a href="' + imgObj.imageUrl + '" target="_blank" title="' + imgObj.title + '" onclick="return confirm(\'Open ' + imgObj.title + ' image in new tab?\');">' +
                '<img src="' + imgObj.imageUrl + '" alt="' + imgObj.title + '" title="' + imgObj.title + '" style="width: 24px; height: 24px; margin-right: 2px; border: 1px solid #ddd; cursor: pointer;" ' +
                'onerror="this.src=\'images/trees/tree-placeholder.png\'; this.style.opacity=\'0.5\';">' +
                '</a>';
    }).join('');
    return thumbnails;
}

<a href="images/trees/oak.jpg" target="_blank" title="Oak Tree"
    onclick="return confirm('เปิดไฟล์ภาพ Oak Tree ในเท็บใหม่ ?');">
    <img src="images/trees/oak.jpg" alt="Oak Tree" title="Oak Tree"
        style="width: 52px; height: 52px; margin-right: 2px; border: 1px solid #ddd; cursor: pointer;"
        onerror="this.src='images/trees/tree-placeholder.png'; 
                this.style.opacity='0.5'; 
                this.closest('a').removeAttribute('href'); 
                this.closest('a').style.pointerEvents='none';">
</a>

*/