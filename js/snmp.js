/**
 * Utilizing SNMP
 */
const snmp = require('net-snmp');
const keys = require('./keys/radios');
module.exports = (data, callback) => {

    // Parse through each access point
    const NETWORK_SITES = data;
    const NETWORK_SITES_WITH_COUNT = [];
    NETWORK_SITES.forEach(site => {
        let filtered_access_points = site.access_points.filter((val, i, arr) => {
            if(val.subnet.includes(keys.one) 
            || val.subnet.includes(keys.oneThirty) 
            || val.subnet.includes(keys.oneFifty) 
            || val.subnet.includes(keys.lte)) {
                if(!val.description.toLowerCase().includes('ptp ') &&
                   !val.description.toLowerCase().includes(' ptp') &&
                   !val.description.toLowerCase().includes(' ptp ') &&
                   !val.description.toLowerCase().includes('to ') &&
                   !val.description.toLowerCase().includes(' to ') &&
                   !val.description.toLowerCase().includes('mdu ') &&
                   !val.description.toLowerCase().includes(' mdu') &&
                   !val.description.toLowerCase().includes(' mdu ') &&
                   !val.description.toLowerCase().includes('test ') &&
                   !val.description.toLowerCase().includes(' test') &&
                   !val.description.toLowerCase().includes(' test ')) {
                    return val;
                }
            }
        });
        site.access_points = filtered_access_points;

        site.access_points.forEach(access_point => {
            let new_access_point = access_point;
            checkSubnet(access_point.subnet, count => {
                new_access_point.count = count;
            });
            access_point = new_access_point;
        });
        NETWORK_SITES_WITH_COUNT.push(site);
    });
    callback(NETWORK_SITES_WITH_COUNT);
};

function checkSubnet(subnet, callback) {
    if(subnet.includes(keys.one)) { // Ubiquiti
        makeSnmpRequestUbnt(subnet, count => {
            callback(count);
        });
    } else if(subnet.includes(keys.oneThirty)) {
        makeSnmpRequestCanopy(subnet, count => {
            callback(count);
        })
    } else if(subnet.includes(keys.oneFifty)) {
        makeSnmpRequestEpmp(subnet, count => {
            callback(count);
        })
    }
}

function makeSnmpRequestUbnt(subnet, callback) {
    const session = snmp.createSession(subnet, keys.community);
    let oid = ['1.3.6.1.4.1.41112.1.4.5.1.15.1'];
    session.get(oid, (err, binds) => {
        if(err) {
            callback(err.name);
            //console.log(subnet + ': ' + err);
        } else {
            binds.forEach(varbind => {
                if(snmp.isVarbindError(varbind)) {
                    //console.error(snmp.varbindError(varbind));
                    //console.log(varbind);
                    callback(varbind);
                } else {
                    //console.log(subnet + ' = ' + varbind.value);
                    callback(varbind.value);
                }
            });
        }
        session.close();
    });
}

function makeSnmpRequestCanopy(subnet, callback) {
    const options = {
        version: snmp.Version2c
    };
    const session = snmp.createSession(subnet, keys.community, options);
    let oid = ['1.3.6.1.4.1.161.19.3.1.7.18.0'];
    session.get(oid, (err, binds) => {
        if(err) {
            // console.log(err);
            callback(err.name);
        } else {
            binds.forEach(varbind => {
                if(snmp.isVarbindError(varbind)) {
                    // console.error(snmp.varbindError(varbind));
                    // console.log(varbind);
                    callback(varbind);
                } else {
                    // console.log(subnet + ' = ' + varbind.value);
                    callback(varbind.value);
                }
            });
        }
        session.close();
    });
}

function makeSnmpRequestEpmp(subnet, callback) {
    const options = {
        version: snmp.Version2c
    };
    const session = snmp.createSession(subnet, keys.community, options);
    let oid = ['1.3.6.1.4.1.17713.21.1.2.10.0'];
    session.get(oid, (err, binds) => {
        if(err) {
            // console.log(err);
            callback(err.name);
        } else {
            binds.forEach(varbind => {
                if(snmp.isVarbindError(varbind)) {
                    // console.error(snmp.varbindError(varbind));
                    // console.log(varbind);
                    callback(varbind);
                } else {
                    // console.log(subnet + ' = ' + varbind.value);
                    callback(varbind.value);
                }
            });
        }
        session.close();
    });
}

// function makeSnmpRequestLTE(subnet, callback) {
//     const options = {
//         version: snmp.Version2c
//     };
//     const session = snmp.createSession(subnet, 'public', options);
//     let oid = [''];
//     session.get(oid, (err, binds) => {
//         if(err) {
//             // console.log(err);
//             callback(err.name);
//         } else {
//             binds.forEach(varbind => {
//                 if(snmp.isVarbindError(varbind)) {
//                     // console.error(snmp.varbindError(varbind));
//                     // console.log(varbind);
//                     callback(varbind);
//                 } else {
//                     // console.log(subnet + ' = ' + varbind.value);
//                     callback(varbind.value);
//                 }
//             });
//         }
//         session.close();
//     });
// }

