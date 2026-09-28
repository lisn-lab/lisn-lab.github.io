(function() {
  function initMap() {
    if (typeof L === 'undefined') { setTimeout(initMap, 100); return; }

    // ==========================================
    // EDIT HERE: outward codes only - the FIRST part of each postcode (e.g. "PR1").
    // Crude location keeps this privacy-preserving: no full postcodes are stored
    // in this published file. List one entry per participant; duplicates are fine,
    // they get aggregated up to the participant's town/district below.
    // ==========================================
    var outcodes = [
      // Workshop 1 (7 participants)
      'LA1', 'LA2', 'LA1', 'PR1', 'M27', 'PR3', 'LA1',
      // Workshop 2 (24 participants)
      'PR8', 'M1',  'BL1', 'L11', 'ST16', 'WA9', 'ME3',
      'LS19', 'W11', 'OL12', 'LS8', 'LA1', 'CA11', 'MK10',
      'PR25', 'LA1', 'PR6', 'SK14', 'LA1', 'LA14', 'LA1',
      'LA1', 'LA2', 'LA1'
    ];

    // Keep the view around the UK: zoom 6 shows the whole country, and
    // maxBounds stops panning off into the rest of the world.
    var ukBounds = L.latLngBounds([49.8, -8.6], [60.9, 1.8]);
    var map = L.map('engagement-map', {
      minZoom: 6,
      maxBounds: ukBounds,
      maxBoundsViscosity: 1.0
    }).setView([53.8, -2.7], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18
    }).addTo(map);

    var counts = {};
    outcodes.forEach(function(o) { o = o.toUpperCase(); counts[o] = (counts[o] || 0) + 1; });
    var unique = Object.keys(counts);

    // Geocode each outward code to a crude point + its town/district.
    Promise.all(unique.map(function(oc) {
      return fetch('https://api.postcodes.io/outcodes/' + encodeURIComponent(oc))
        .then(function(r) { return r.json(); })
        .then(function(d) { return d.result ? { oc: oc, r: d.result } : null; })
        .catch(function() { return null; });
    })).then(function(items) {
      // Roll the outward codes up into their town/district so each town is one pin.
      var districts = {};
      items.forEach(function(it) {
        if (!it) return;
        var name = (it.r.admin_district && it.r.admin_district[0]) || it.oc;
        var n = counts[it.oc] || 1;
        var dd = districts[name] || (districts[name] = { count: 0, latSum: 0, lonSum: 0, pts: 0 });
        dd.count += n;
        dd.latSum += it.r.latitude;
        dd.lonSum += it.r.longitude;
        dd.pts += 1;
      });

      Object.keys(districts).forEach(function(name) {
        var dd = districts[name];
        L.circleMarker([dd.latSum / dd.pts, dd.lonSum / dd.pts], {
          radius: 8 + dd.count * 4,
          fillColor: '#2962ff',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.7
        })
        .bindPopup(name + ' (' + dd.count + ')')
        .addTo(map);
      });
    });
  }
  initMap();
})();
