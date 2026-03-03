const createElement = (arr) => {
  const htmlElements = arr.map(
    (el) => `<span class="btn bg-blue-100">${el}</span>`,
  );
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spin").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("spin").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => display(json.data));
};

const levelContainer = document.getElementById("level-container");
levelContainer.innerHTML = "";

const display = (lessons) => {
  for (let lesson of lessons) {
    const btndiv = document.createElement("div");

    btndiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadlevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn  mt-[35px]">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>`;

    levelContainer.appendChild(btndiv);
  }
};

const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
};
loadLessons();

const loadlevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((respo) => respo.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayWord(data.data);
    });
};

const displayWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    wordContainer.innerHTML = `
   <div class="text-center col-span-full space-y-6 font-bangla">
            <img src="./assets/alert-error.png" class="mx-auto">
            <p class="text-xl font-medium text-gray-400 ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
           </div>
   `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="sm:gap-x-10 mt-10 bg-white rounded-[8px] p-[56px]">
              <h2 class=" font-bold text-[2rem] text-center">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
              <p class="text-center font-medium text-[1.1rem] mt-[24px]">Meaning /Pronounciation</p>
              <h2 class="font-bangla font-semibold text-[2rem] text-center mt-[24px] text-[#18181B]">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}</h2>
              <div class="flex justify-between px-5 mt-[56px]">
                <button onclick="loadWordDetail(${word.id})" class="text-[#374957] p-[15px] hover:bg-blue-300 text-[24px] rounded-sm bg-[#1A91FF]/10"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="text-[#374957] p-[15px] hover:bg-blue-300 text-[24px] rounded-sm bg-[#1A91FF]/10"><i class="fa-solid fa-volume-high"></i></button>
              </div>
           </div>
    `;

    wordContainer.append(card);
  });
  manageSpinner(false);
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const response = await fetch(url);
  const detail = await response.json();
  displayDetail(detail.data);
};

const displayDetail = (wordObj) => {
  // console.log(wordObj);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `<div class="">
              <h2 class="text-2xl font-bold mb-[25px]">${wordObj.word} (<i class="fa-solid fa-microphone-lines"></i>: ${wordObj.pronunciation})</h2>
           </div>
           <div class="">
              <h2 class="text-2xl font-semibold mb-[10px]">Meaning</h2>
              <p class="font-bangla">${wordObj.meaning}</p>
           </div>
           <div class="mt-[25px]">
            <h2 class="text-[24px] font-semibold">Example</h2>
            <p class="text-[16px] text-[#00000080]">${wordObj.sentence}</p>
           </div>
           <div class="mt-[25px]">
             <h2 class="text-[24px] font-medium">সমার্থক শব্দ গুলো</h2>
             <div class="flex gap-5 mt-[10px]">
             ${createElement(wordObj.synonyms)}
             </div>
           </div>`;
  document.getElementById("word_modal").showModal();
};

document.getElementById("searchBtn").addEventListener("click", () => {
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayWord(filterWords);
    });
  input.value = "";
});
