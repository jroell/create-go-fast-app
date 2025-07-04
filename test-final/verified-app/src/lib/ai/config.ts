import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

// Initialize models
export const openaiModel = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const anthropicModel = new ChatAnthropic({
  modelName: "claude-3-sonnet-20240229",
  temperature: 0.7,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize embeddings
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Text splitter for RAG
export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Vector store setup
export async function createVectorStore(documents: string[]) {
  const docs = await textSplitter.createDocuments(documents);
  return await MemoryVectorStore.fromDocuments(docs, embeddings);
}

// RAG chain setup
export async function createRAGChain(vectorStore: MemoryVectorStore) {
  const retriever = vectorStore.asRetriever();
  
  const prompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}

Question: {question}

Answer:`
  );

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe((docs) => docs.map(doc => doc.pageContent).join("\n\n")),
      question: new RunnablePassthrough(),
    },
    prompt,
    openaiModel,
    new StringOutputParser(),
  ]);

  return chain;
}

// Simple chat chain
export const chatChain = RunnableSequence.from([
  PromptTemplate.fromTemplate("Human: {input}\n\nAssistant:"),
  openaiModel,
  new StringOutputParser(),
]);

// Multi-provider chat function
export async function generateResponse(
  message: string,
  provider: "openai" | "anthropic" = "openai"
) {
  const model = provider === "openai" ? openaiModel : anthropicModel;
  
  const response = await model.invoke([
    {
      role: "system",
      content: "You are a helpful AI assistant built with the GO FAST 🔥 STACK. Be concise and helpful.",
    },
    {
      role: "user",
      content: message,
    },
  ]);

  return response.content;
}