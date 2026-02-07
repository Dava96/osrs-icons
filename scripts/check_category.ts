import axios from 'axios';

const WIKI_API_URL = 'https://oldschool.runescape.wiki/api.php';

async function checkCategory() {
  const params = {
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Item_inventory_images',
    cmlimit: 10,
    format: 'json',
    origin: '*',
  };

  const response = await axios.get(WIKI_API_URL, { params });
  console.log(JSON.stringify(response.data.query.categorymembers, null, 2));
}

checkCategory().catch(console.error);
