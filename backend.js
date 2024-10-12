import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({
  model: 'gpt-4o',
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  temperature: 0,
});

const prompt = PromptTemplate.fromTemplate(`
Question: {question}
Answer: {answer}
Markscheme: {markscheme}

Correct the answer to the question provided according to the given markscheme. Include the following two components in your correction:
1. Whether or not a mark was awarded according to each component of the markscheme with detailed reasoning on why that mark was or was not awarded
2. Strategies for the student to use next time in order to improve the marks that they receive.

`);

const checkQuestion = async (question, answer, markscheme) => {
  const chain = prompt.pipe(model);
  const output = await chain.invoke({ question, answer, markscheme });
  // options for what to do with these correction notes
  // 1. modify the way the software works so that one entire student paper is corrected at a time rather than all instances of one question being corrected at a time.
  // 2. send it to a pdf file for the feedback for this one student
  // ok what would the best demonstration based way be? probably to just check one question at a time. i could have multiple questions in bulk later as an additional feature but right now one at a time makes way more sense.

  return output;
};

export { checkQuestion };
