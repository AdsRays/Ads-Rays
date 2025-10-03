(function(){
  try{
    var s = document.currentScript;
    var api = s && s.dataset && s.dataset.api ? s.dataset.api : '';
    var rootId = s && s.dataset && s.dataset.root ? s.dataset.root : 'adsr-root';
    if(!api){ console.warn('[adsrays] data-api is empty'); return; }

    function logErr(msg){ console.error('[adsrays]', msg); }

    function safeJson(respText){
      try{ return JSON.parse(respText); }catch(e){ return null; }
    }

    function render(list){
      var root = document.getElementById(rootId);
      if(!root){ logErr('root not found: ' + rootId); return; }
      root.innerHTML = '';
      if(!Array.isArray(list) || list.length===0){
        root.textContent = 'ет кампаний';
        return;
      }
      var ul = document.createElement('ul');
      list.forEach(function(c){
        var li = document.createElement('li');
        li.textContent = (c.name||c.id||'кампания');
        ul.appendChild(li);
      });
      root.appendChild(ul);
    }

    var url = api.replace(/\/+$/,'') + '/api/campaigns';
    fetch(url, {method:'GET', credentials:'omit'})
      .then(function(r){ return r.text().then(function(t){ return {ok:r.ok, status:r.status, text:t}; }); })
      .then(function(r){
        if(!r.ok){ logErr('HTTP '+r.status+' '+url+' -> '+(r.text||'')); return; }
        var data = safeJson(r.text);
        if(!data){ logErr('Not JSON: '+(r.text||'empty')); return; }
        render(data);
      })
      .catch(function(err){ logErr(err && err.message ? err.message : String(err)); });

  }catch(e){ console.error('[adsrays]', e); }
})();
