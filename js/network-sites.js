const sonar = require('node-sonar-api');
const visual = require('./visual');
const keys = require('./keys/sonar');

/**
 * Create client
 */
const client = sonar.createClient({
    sonarHost: keys.host,
    sonarUsername: keys.username,
    sonarPassword: keys.password
});

/**
 * Get all network sites from the 
 * Sonar instance.
 */
let _promises = []; // Array of promises
let NETWORK_SITES = []; // Global array of all network sites
let SITE_OBJECTS = []; // Global array of the site objects
                       // containing APs


async function getData(callback) {

    // Update description
    visual.updateProgressDescription('Getting Network Sites From Sonar...');

    let json_network_sites = await client.getAll.networkSites();

    NETWORK_SITES.push.apply(NETWORK_SITES, json_network_sites.data);

    // Check for more network sites 
    if(json_network_sites.paginator.total_pages > 1) { // More network sites
        let page = json_network_sites.paginator.current_page + 1;
        // Make a request to get all network sites.
        for(let i = page; i === json_network_sites.paginator.total_pages; i++) {
            json_network_sites = await client.getAll.networkSites({ page: i })
            NETWORK_SITES.push.apply(NETWORK_SITES, json_network_sites.data);
        }
    }

    console.log(NETWORK_SITES);

    // Update description
    visual.updateProgressDescription('Getting IP Assignments Of Each Network Site...');

    // Get all IP Assignments of each network site
    // Create an object for each site containing Access Points
    NETWORK_SITES.forEach(async site => {
        let json_assignments = await client.getAll.networkSite.ipAssignments(site.id);
    
        // Check for more than one page of data
        let _access_points = [];
        if(json_assignments.paginator.total_pages > 1) {
            _access_points = [];
            _access_points.push.apply(_access_points, json_assignments.data);
            for(let i = json_assignments.paginator.current_page + 1; i === json_assignments.paginator.total_pages; i++) {
                let json_assignments = await client.getAll.networkSite.ipAssignments(site.id, { page: i });
                _access_points.push.apply(_access_points, json_assignments.data);
            }
        } else {
            _access_points = json_assignments.data;
        }

        // Create site objects
        let siteObject = {
            id: site.id,
            name: site.name,
            access_points: _access_points
        }
        SITE_OBJECTS.push(siteObject);
        visual.updateProgress(Math.floor((SITE_OBJECTS.length / NETWORK_SITES.length) * 100));
    });
    //console.log(SITE_OBJECTS);.
    let interval = setInterval(() => {
        if(SITE_OBJECTS.length >= NETWORK_SITES.length) {
            callback(SITE_OBJECTS);
            clearInterval(interval);
        }
    }, 100);
}

module.exports = (cb) => {
    getData(data => {
        cb(data);
    });
};