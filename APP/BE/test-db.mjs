import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  host: '3.132.12.55',  // IP hasil Test-NetConnection tadi
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_p5WrzFkgUIm7',
  ssl: {
    rejectUnauthorized: false,
    servername: 'ep-hidden-paper-ae7xripb-pooler.c-2.us-east-2.aws.neon.tech',
  },
  connectionTimeoutMillis: 20000,
});

console.log('Mencoba konek via IP langsung...');
const start = Date.now();

pool.query('SELECT NOW()')
  .then((res) => {
    console.log('BERHASIL! Waktu:', Date.now() - start, 'ms');
    console.log('Hasil:', res.rows);
    pool.end();
  })
  .catch((err) => {
    console.log('GAGAL setelah', Date.now() - start, 'ms');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    pool.end();
  });