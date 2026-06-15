const jsonFiles = Array.from({ length: 19 }, (_, i) =>
  `books/librarydata${String(i + 1).padStart(2, '0')}.json`
);

const categories = [
  "قسم تفسير القرآن الكريم", "قسم أصول التفسير وعلوم القرآن", "قسم الحديث",
  "قسم شروح الحديث", "قسم مصطلح الحديث", "قسم العقيدة والأديان والفرق", "قسم الفقه",
  "قسم أصول الفقه", "قسم الفتاوى", "قسم السيرة", "قسم التاريخ", "قسم التراجم",
  "قسم اللغة", "قسم الدعوة", "قسم المجموعات", "قسم المتفرقات", "قسم المطويات",
  "قسم المجلات", "قسم الكتب بالأردية"
];

document.getElementById("search-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    performSearch();
  }
});

async function performSearch() {
  const query = document.getElementById("search-input").value.trim();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (!query) {
    resultsContainer.innerHTML = ``;
    return;
  }

  resultsContainer.innerHTML = `<div class="Result-Heading">نتائج البحث عن «${query}»</div>`;

  let totalResults = 0;

  for (let i = 0; i < jsonFiles.length; i++) {
    try {
      const response = await fetch(jsonFiles[i]);
      const data = await response.json();

      const matched = data.filter(book =>
        book[1]?.includes(query) || book[2]?.includes(query)
      );

      if (matched.length > 0) {
        const section = document.createElement("div");
        section.classList.add("result");

        section.innerHTML = `
          <div class="title">${categories[i]}</div>
          <div class="details">
${matched.map(book => {
  const fields = [
    { label: "المؤلف", value: book[2] },
    { label: "المحقق", value: book[3] },
    { label: "المجلد", value: book[4] },
    { label: "دار النشر", value: book[5] },
    { label: "الطبعة", value: book[6] },
    { label: "الرقم العام", value: book[7] }
  ];

  return `
    <div class="card">
      <span class="BookName">${book[1]}</span><br>
      ${fields
        .filter(f => f.value && f.value.trim() !== "-" && f.value.trim() !== "")
        .map(f => `<span class="SideTitle">${f.label}:</span> <span class="OtherDetail">${f.value}</span><br>`)
        .join("")}
    </div>
  `;
}).join("")}

          </div>
        `;
        resultsContainer.appendChild(section);
        totalResults += matched.length;
      }
    } catch (error) {
      console.error(`خطأ في تحميل الملفات ${jsonFiles[i]}:`, error);
    }
  }

  if (totalResults === 0) {
    resultsContainer.innerHTML = `<div class="no-results">لا توجد نتائج لـ «${query}»</div>`;
  }
}
