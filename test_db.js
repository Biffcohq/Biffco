const postgres = require('postgres');

async function test() {
  const sql = postgres('postgresql://biffco:biffco_pass@localhost:5432/biffco');
  
  try {
    const result = await sql`
      insert into "assets" ("id", "workspace_id", "vertical_id", "type", "status", "location_id", "metadata", "parent_ids") 
      values ('test_id123', 'qo1ujapueumrdsja50xtak9u', 'bif-bovine-ar', 'AnimalAsset', 'ACTIVE', null, '{}', '[]')
    `;
    console.log("Success:", result);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    process.exit(0)
  }
}

test();
