import OpenAI from 'openai';

interface Options {
  threadId: string;
  question: string;
}

export const creatMessage = async (openAi: OpenAI, options: Options) => {
  const { threadId, question } = options;

  const message = await openAi.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question
  });

  return message;
};
