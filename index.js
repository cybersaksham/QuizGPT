const askGPT = async (question, ind) => {
  const apiKey = "API KEY";
  const gpt4Endpoint = "https://api.openai.com/v1/completions";

  const prompt = `Please provide an answer for the following question: ${question}\n\nAnswer:`;

  const requestBody = {
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1000,
    n: 1,
    stop: null,
    stream: false,
    temperature: 0.5,
  };

  const response = await fetch(gpt4Endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();
  const answer = responseData.choices[0].text.trim();

  console.log({ ind, question, answer });
  return answer;
};

async function getSolutions() {
  const questionElements = Array.from(
    document.querySelectorAll("span.M7eMe")
  ).map((el) => el.textContent.trim());

  const solution = [];

  for (let i = 0; i < questionElements.length; i++) {
    const question = questionElements[i];
    const answer = await askGPT(question, i + 1);
    solution.push({ question, answer });
  }

  console.log(solution);
}

getSolutions();
