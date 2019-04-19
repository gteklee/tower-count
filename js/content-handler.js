const fs = require('fs');
const { dialog } = require('electron').remote;
const visual = require('./visual');

let CSV_FORMAT = 'Network Site,IP Address,Customer Count\n'; // CSV Format for converting data
                     // to a spreadsheet

module.exports = obj => {
    
    const NETWORK_SITES = obj;

    let _TOTAL = 0;         // Overall customer count
    let _TOTAL_TOWERS = 0;  // Overall tower count
    let _TOTAL_APS = 0;     // Overall access point count
    
    let SITE_TABLES = []; // Array of table elements for 
                          // each site

    let _visual_count = 0;
    for(const site of NETWORK_SITES) {
        _visual_count++;
        _TOTAL_TOWERS++;

        let total = 0; // Total customer count for network site
        let csv_aps = ''; // CSV Format of access point data
        // Generate table
        let table = '<h1 class="Table-Title">' + site.name + '</h1>';
        table += '<table>'+
                    '<tr>'+
                        '<th> Access Point </th>'+
                        '<th> IP </th>'+
                        '<th> Customer Count </th>'+
                    '</tr>';
        for(const access_point of site.access_points) {
            _TOTAL_APS++;

            // Generate table of access points
            // console.log('Inside table generation:', access_point);
            // console.log(access_point.count);
            if(access_point.count !== undefined) {
                table += '<tr>'+
                            '<td>' + access_point.description + '</td>'+
                            '<td>' + access_point.subnet + '</td>'+
                            '<td>' + access_point.count + '</td>'+
                         '</tr>';
                         
            } else {
                table += '<tr>'+
                            '<td>' + access_point.description + '</td>'+
                            '<td>' + access_point.subnet + '</td>'+
                            '<td> - </td>'+
                         '</tr>';
            }

            // Update total customer count for site
            if(!(isNaN(Number(access_point.count)))) {
                total += Number(access_point.count);
            }
            
            // Create CSV formatted access point data
            if(access_point.count !== undefined) {
                csv_aps += access_point.description + ',' + access_point.subnet + ',' + access_point.count + '\n';
            } else {
                csv_aps += access_point.description + ',' + access_point.subnet + ',-' + '\n';
            }
        }

        // Update total customer count
        _TOTAL += total;

        table += '</table>';
        table += '<p class="Table-Count-Total">' + total + '</p>'
        table += '<div class="Line-Break"></div>';

        if(site.access_points.length > 0) {
            SITE_TABLES.push(table);
        }

        // Create CSV Formatted data
        CSV_FORMAT += csv_aps;

        let _visual_progress = Math.floor((_visual_count / NETWORK_SITES.length) * 100);
        visual.updateProgress(_visual_progress);
        visual.updateLoadingState(false);
    }

    //console.log(CSV_FORMAT);
    
    // Prepend customer total
    $('#content-container')
        .prepend('<h2> Total Customer Count: ' + _TOTAL + ' </h2>'+
                 '<h3> Total Tower Count: ' + _TOTAL_TOWERS + ' </h3>'+
                 '<h3> Total AP Count: ' + _TOTAL_APS + ' </h3>');

    // Append generated table
    SITE_TABLES.forEach(table => {
        $('#content-container').append(table);
    });
};

/**
 * When the reload button is clicked, reload
 * the data being pulled from Sonar.
 */
$('#btn-reload').on('click', () => {
    location.reload();
});

/**
 * When the convert to CSV button is clicked,
 * convert the collected data into a CSV file
 * that can be viewed as a spreadsheet.
 */
$('#btn-to-csv').on('click', () => {
    dialog.showSaveDialog({ // Ask the user where to save the file
        filters: [{
            name: 'Spreadsheet File (*.csv)', extensions: ['csv']
        }]  
    }, (filepath) => {  // Get path when user clicks save
        if(filepath) { // Check if the user clicked save or cancel
            fs.writeFile(filepath, CSV_FORMAT, (err) => {
                if(err) {
                    console.error(err);
                } else {
                    console.log('Data converted successfully!');
                }
            });
        }
    });
});