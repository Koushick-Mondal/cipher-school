const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const attempt = await prisma.attempt.findFirst({ orderBy: { createdAt: 'desc' } });
  
  console.log("Evaluating attempt:", attempt.id, "again");
  const res2 = await fetch(`http://127.0.0.1:3000/api/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attemptId: attempt.id })
  });
  console.log("Evaluate status:", res2.status);
  console.log(await res2.text());
}
main().catch(console.error);
