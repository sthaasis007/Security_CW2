(async ()=>{
  try{
    const path = process.argv[2] || '/';
    // Try to fetch products via the frontend API (proxied to backend)
    const apiRes = await fetch('http://localhost:3000/api/products');
    const apiJson = await apiRes.json().catch(()=>null);
    if(!apiJson || !Array.isArray(apiJson.products)){
      console.log('Failed to fetch products from /api/products or no products present');
      return;
    }
    const products = apiJson.products;
    const images = products.map(p=>p.image).filter(Boolean);
    if(images.length===0){
      console.log('No product images found in API response');
      return;
    }
    console.log('Found', images.length, 'product images; checking URLs...');
    for(const img of images){
      const frontendUrl = `http://localhost:3000/uploads/${img}`;
      const backendUrl = `http://localhost:5000/uploads/${img}`;
      try{
        const r1 = await fetch(frontendUrl);
        console.log('[frontend] ', frontendUrl, '->', r1.status, r1.headers.get('content-type'));
      }catch(e){
        console.log('[frontend] ', frontendUrl, '-> fetch error', e.message);
      }
      try{
        const r2 = await fetch(backendUrl);
        console.log('[backend]  ', backendUrl, '->', r2.status, r2.headers.get('content-type'));
      }catch(e){
        console.log('[backend]  ', backendUrl, '-> fetch error', e.message);
      }
    }
  }catch(err){
    console.error('Script failed:', err.message);
    process.exit(1);
  }
})();
