async function fetchAssessment() {
  const res = await fetch("http://localhost:3000/assessment/1");
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

fetchAssessment();
