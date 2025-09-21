// This data will reset on Vercel function cold starts.
// For true persistence, an external database (e.g., FaunaDB, Supabase, a custom API) is required.
let posts = [];

module.exports = async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  try {
    switch (req.method) {
      case 'POST':
        const body = req.body; // Vercel often parses JSON body automatically
        if (!body) {
          return res.status(400).json({ message: 'Request body is missing.' });
        }
        const newPost = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...body,
        };
        posts.push(newPost);
        console.log('Received new post:', newPost);
        return res.status(201).json(newPost);

      case 'GET':
        return res.status(200).json(posts);

      case 'DELETE':
        posts = []; // Clear all data
        console.log('All posts cleared.');
        return res.status(200).json({ message: 'All posts cleared successfully.' });

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
