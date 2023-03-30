const askGPT = async (question = "", options = [], ind = 0) => {
  try {
    const apiKey = "API KEY";
    const gpt4Endpoint = "https://api.openai.com/v1/completions";

    let prompt = `Please provide an answer for the following question:\n${question}\n\n`;
    if (options.length > 0) {
      prompt += `Options are:\n`;
      options.forEach((opt, i) => {
        prompt += `${i + 1}. ${opt}\n`;
      });
    }

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
  } catch (error) {
    console.error({ ind, msg: "Error in API", error });
    return null;
  }
};

const changeAnswers = (type, question, answer) => {
  try {
    if (type == 0) {
      // Short Text
      question.querySelector("input.whsOnd.zHQkBf").innerHTML = answer;
      // .setAttribute("data-initial-value", answer);
    } else if (type == 1) {
      // Paragraph
      // question
      //   .querySelector("textarea.KHxj8b.tL9Q4c")
      //   .setAttribute("data-initial-value", answer);
    } else if (type == 2) {
      // Multiple Choice
      let options = question
        .querySelector("div.SG0AAe")
        .querySelectorAll("div.nWQGrd.zwllIb");
      let rightOption = Number(answer[8]) - 1;
      options[rightOption].querySelector("label").click();
    } else if (type == 3) {
      // Dropdown
    } else if (type == 4) {
      // Checkboxes
    }
  } catch (error) {
    console.error({ ind: i, msg: "Error when changing answer", error });
  }
};

async function getSolutions() {
  const questionElements = Array.from(
    document.querySelectorAll("div.Qr7Oae")
  ).map((el) => el.querySelector("div"));

  const solution = [];

  let promises = [];

  for (let i = 0; i < questionElements.length; i++) {
    promises.push(
      new Promise(async (resolve, reject) => {
        try {
          const question = questionElements[i];
          const questionObject = Array.from(
            JSON.parse("[" + question.getAttribute("data-params").substring(4))
          )[0];
          const questionText = questionObject[1];
          const questionOptions = Array.from(questionObject[4][0][1]).map(
            (el) => el[0]
          );
          const answer = await askGPT(questionText, questionOptions, i + 1);
          solution.push({ ind: i, questionText, answer });

          // Showing answers in DOM
          let node = document.createElement("span");
          node.innerText = answer;
          question.parentElement.insertBefore(node, question);

          // Changing Answers
          changeAnswers(questionObject[3], question, answer);
          resolve();
        } catch (error) {
          console.error({ ind: i, msg: "Error in execution", error });
          reject();
        }
      })
    );
  }

  await Promise.all(promises);

  solution.sort((a, b) => a.ind - b.ind);
  console.log(solution);
}

getSolutions();
