import { Request, Response } from 'express';
import * as fs from 'fs';

import OpenAI from 'openai';
import { checkCompleteStatus } from '../helpers/check-complete-status';
import { creatMessage } from '../helpers/create-message';
import { createRun } from '../helpers/create-run';
import { getMessages } from '../helpers/get-messages';
import { Thread } from '../interfaces';

interface Options {
  threadId: string;
  question: string;
}
const OPENAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export const uploadPdf = async (req: Request, res: Response) => {
  if (!req.file) return res.status(404).json({ message: 'Error getting path file 🙃' });

  const file = await OPENAI.files.create({
    file: fs.createReadStream(req.file.path),
    purpose: 'assistants'
  });

  if (file.status !== 'processed') return res.status(404).json({ message: 'Error uploading file to OpenAi 😢' });

  res.status(200).json({ message: 'File uploaded successfully! 😁', id: file.id });
};

export const createThread = async (req: Request, res: Response) => {
  const { fileId } = req.body as Thread;
  if (!fileId) return res.status(400).json({ error: 'FileId is required' });

  const assistantId = process.env.ASSITANT_ID;
  const updatedData = {
    file_ids: [fileId]
  };

  const updatedAssistant = await OPENAI.beta.assistants.update(assistantId!, updatedData);

  console.log(updatedAssistant);
  const { id } = await OPENAI.beta.threads.create();

  if (!id) return res.status(400).json({ message: 'Error creating assitantID (TreadId) 😢' });

  res.status(200).json({ message: 'Thread ID created successfully! 😁', fileId, threadId: id });
};

export const createMessage = async (req: Request, res: Response) => {
  const { threadId, question } = req.body as Options;

  //Create message
  await creatMessage(OPENAI, { threadId, question });

  const run = await createRun(OPENAI, { threadId });

  await checkCompleteStatus(OPENAI, { runId: run.id, threadId });

  const messages = await getMessages(OPENAI, { threadId });

  res.status(200).json({ messages });
};
