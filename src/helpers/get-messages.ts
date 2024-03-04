import OpenAI from 'openai';

interface Options {
  threadId: string;
}

export const getMessages = async (openai: OpenAI, options: Options) => {
  const { threadId } = options;

  const messagesList = await openai.beta.threads.messages.list(threadId);

  const messages = messagesList.data.map(eachMessage => {
    return {
      role: eachMessage.role,
      content: eachMessage.content.map(eachContent => (eachContent as any).text.value)
    };
  });

  return messages;
};
