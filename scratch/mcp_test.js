async function runMcp() {
  const url = 'https://mcp.supabase.com/mcp?project_ref=cswdcbruzgdqburynlop&read_only=false';
  
  // Send initialize request
  const initRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    })
  });
  
  console.log('Init status:', initRes.status);
  const sessionId = initRes.headers.get('mcp-session-id') || initRes.headers.get('x-session-id');
  console.log('Session ID:', sessionId);
  const initText = await initRes.text();
  console.log('Init response:', initText);

  // Send tool call request
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream'
  };
  if (sessionId) headers['mcp-session-id'] = sessionId;

  const sqlRes = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'execute_sql',
        arguments: {
          query: `CREATE TABLE IF NOT EXISTS public.products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            subtitle TEXT,
            category TEXT NOT NULL,
            subcategory TEXT NOT NULL,
            collection TEXT,
            price NUMERIC NOT NULL,
            original_price NUMERIC,
            cost_price NUMERIC,
            discount_percentage NUMERIC,
            rating NUMERIC DEFAULT 5.0,
            review_count INTEGER DEFAULT 0,
            in_stock BOOLEAN DEFAULT true,
            stock_count INTEGER DEFAULT 10,
            low_stock_threshold INTEGER DEFAULT 5,
            allow_backorders BOOLEAN DEFAULT false,
            brand TEXT DEFAULT 'Kavish Kuthampully Atelier',
            is_new BOOLEAN DEFAULT true,
            is_best_seller BOOLEAN DEFAULT false,
            is_featured BOOLEAN DEFAULT true,
            images JSONB DEFAULT '[]'::jsonb,
            sizes JSONB DEFAULT '[]'::jsonb,
            colors JSONB DEFAULT '[]'::jsonb,
            variants JSONB DEFAULT '[]'::jsonb,
            fabric TEXT,
            details JSONB DEFAULT '[]'::jsonb,
            care_instructions JSONB DEFAULT '[]'::jsonb,
            fit_information TEXT,
            sku TEXT UNIQUE NOT NULL,
            tags JSONB DEFAULT '[]'::jsonb,
            size_chart JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );`
        }
      }
    })
  });

  console.log('SQL Call status:', sqlRes.status);
  console.log('SQL Call response:', await sqlRes.text());
}

runMcp().catch(console.error);
