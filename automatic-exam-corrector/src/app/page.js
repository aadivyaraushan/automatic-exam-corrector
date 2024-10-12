'use client';
import { useState } from 'react';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import Image from 'next/image';

export default function Home() {
  // States for different data
  const [questionScreenshot, setQuestionScreenshot] = useState(null);
  const [answerScreenshot, setAnswerScreenshot] = useState(null);
  const [markschemeScreenshot, setMarkschemeScreenshot] = useState(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [questionType, setQuestionType] = useState();

  // Handlers for file inputs
  const handleQuestionUpload = (e) => {
    setQuestionScreenshot(e.target.files[0]);
  };

  const handleAnswerUpload = (e) => {
    setAnswerScreenshot(e.target.files[0]);
  };

  const handleMarkschemeUpload = (e) => {
    setMarkschemeScreenshot(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (questionScreenshot && answerScreenshot && markschemeScreenshot) {
      // Model instantiation
      const model = new ChatOpenAI({ model: 'gpt-4o' });

      // Dynamically setting the prompt based on the type of Q
      let prompt;
      if (questionType === 'multiple-choice') {
        prompt = `
Correct the answer to the multiple choice question provided according to the given markscheme. Include the following two components in your correction:
1. Whether or not the answer to the multiple choice question is right.
2. Why the answer to the multiple choice right is right or wrong.
3. Strategies for the student to use next time in order to get questions like this correct, keeping in mind why they got it wrong
        `;
      } else if (questionType === 'short-answer') {
        prompt = `
Correct the answer to the question provided according to the given markscheme. Include the following two components in your correction:
1. Whether or not a mark was awarded according to each component of the markscheme with detailed reasoning on why that mark was or was not awarded
2. Strategies for the student to use next time in order to improve the marks that they receive (keeping in mind why they've lost marks).
        `;
      } else if (questionType === 'essay') {
        prompt = `
Correct the essay response to the question provided according to the given rubric. Include the following two components in your correction:
1. The marks awarded according to each component of the rubric with detailed reasoning on why that many marks were awarded
2. Strategies for the student to use next time in order to improve the marks that they receive (keeping in mind why they've lost marks)`;
      }

      // Messages for the
      const messages = [
        new SystemMessage(prompt),
        new HumanMessage({
          content: [
            {
              type: 'text',
              text: 'Question:',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${questionScreenshot.toString(
                  'base64'
                )}`,
              },
            },
          ],
        }),
        new HumanMessage({
          content: [
            {
              type: 'text',
              text: 'Answer:',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${answerScreenshot.toString(
                  'base64'
                )}`,
              },
            },
          ],
        }),
        new HumanMessage({
          content: [
            {
              type: 'text',
              text: 'Markscheme:',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${markschemeScreenshot.toString(
                  'base64'
                )}`,
              },
            },
          ],
        }),
      ];

      // Simulate generating correction notes and updating state
      setCorrectionNotes('These are your generated correction notes.');
    } else {
      alert('Please upload all screenshots');
    }
  };

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <h1 className='font-bold text-3xl'>Automatic Question Corrector</h1>
        <div className='flex flex-row gap-8'>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col'>
              <label htmlFor='question-upload'>
                Upload question screenshot:
              </label>
              <input
                id='question-upload'
                type='file'
                accept='image/*'
                onChange={handleQuestionUpload}
              />

              <label htmlFor='answer-upload'>Upload answer screenshot:</label>
              <input
                id='answer-upload'
                type='file'
                accept='image/*'
                onChange={handleAnswerUpload}
              />

              <label htmlFor='markscheme-upload'>
                Upload markscheme screenshot:
              </label>
              <input
                id='markscheme-upload'
                type='file'
                accept='image/*'
                onChange={handleMarkschemeUpload}
              />
              <div>
                <label htmlFor='question-type'>Select question type:</label>
                <select
                  id='question-type'
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className='border border-gray-300 p-2 rounded mt-2 text-black'
                >
                  <option value='multiple-choice'>Multiple Choice</option>
                  <option value='short-answer'>Short Answer</option>
                  <option value='essay'>Essay</option>
                </select>
              </div>
              {/* Centering the button */}
              <button
                type='submit'
                className='bg-white text-black px-4 py-2 rounded mt-4'
              >
                Submit
              </button>
            </div>
          </form>
          <div className='flex flex-col w-64'>
            <p className='font-bold mb-2'>Correction notes:</p>
            {/* Constant area for correction notes */}
            <div className='bg-zinc-800 text-white p-4 rounded h-48 overflow-auto'>
              {correctionNotes ? <p>{correctionNotes}</p> : <p></p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
